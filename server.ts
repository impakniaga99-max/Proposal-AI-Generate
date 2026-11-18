import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface GenerateProposalBody {
  bahasa: 'melayu' | 'english';
  namaProgram: string;
  namaSyarikat: string;
  sektorOrganisasi?: string;
  tahapPeserta?: string;
  huraianProgram: string;
  bilanganHari: number;
  bilanganPeserta: number;
  lokasiProgram: string;
  sertakanHrdCorp?: boolean;
}

interface RefineSectionBody {
  bahasa: 'melayu' | 'english';
  section: 'pengenalan' | 'objektif' | 'kaedah' | 'hasil' | 'modul' | 'penutup' | 'hrdCorpNotes';
  action: 'expand' | 'shorten' | 'formal';
  currentContent: unknown;
  context?: {
    namaProgram?: string;
    namaSyarikat?: string;
    sektorOrganisasi?: string;
    tahapPeserta?: string;
  };
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
    timeout: 40000,
  },
});

const PROPOSAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    pengenalan: {
      type: Type.STRING,
      description:
        'Detailed introduction (2-3 cohesive paragraphs) explaining the industry context, organizational challenges, and relevance of this training program.',
    },
    objektif: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Exactly 5 SMART training objectives tailored to the program.',
    },
    kaedah: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 to 5 interactive blended-learning teaching methodologies.',
    },
    hasil: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 to 5 measurable positive outcomes for participants and the organization.',
    },
    modul: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          namaModul: {
            type: Type.STRING,
            description: 'Concise, authoritative module title.',
          },
          pecahanTajuk: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Exactly 3 structured core subtopics covered within this module.',
          },
        },
        required: ['namaModul', 'pecahanTajuk'],
      },
      description: 'Exactly 4 progressive training modules.',
    },
    penutup: {
      type: Type.STRING,
      description:
        'Persuasive executive closing statement expressing readiness to collaborate and deliver measurable impact.',
    },
    hrdCorpNotes: {
      type: Type.STRING,
      description:
        'Brief structured paragraph detailing HRD Corp SBL-Khas claimability, certified trainer compliance, and pre/post-course competency assessment.',
    },
  },
  required: ['pengenalan', 'objektif', 'kaedah', 'hasil', 'modul', 'penutup', 'hrdCorpNotes'],
};

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms)
    ),
  ]);
}

async function generateWithFallback(
  prompt: string,
  systemInstruction: string,
  responseSchema: Record<string, unknown>
) {
  const callHydrogen = () =>
    withTimeout(
      ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      18000,
      'gemini-4-hydrogen'
    );

  const callFlashLite = () =>
    withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        },
      }),
      20000,
      'gemini-3.1-flash-lite'
    );

  try {
    return await callHydrogen();
  } catch (primaryErr: unknown) {
    const primaryStatus = (primaryErr as { status?: number })?.status;
    const primaryMsg = (primaryErr as { message?: string })?.message || '';
    const shouldFallback =
      primaryStatus === 503 ||
      primaryStatus === 504 ||
      primaryStatus === 429 ||
      primaryMsg.includes('UNAVAILABLE') ||
      primaryMsg.includes('503') ||
      primaryMsg.includes('504') ||
      primaryMsg.toLowerCase().includes('timeout');

    if (shouldFallback) {
      console.warn(`Primary model fallback triggered (${primaryStatus ?? 'timeout'}): ${primaryMsg}`);
      return await callFlashLite();
    }
    throw primaryErr;
  }
}

function mapApiError(error: unknown, isEnglish: boolean): { status: number; message: string } {
  const errObj = error as { status?: number; message?: string; name?: string };
  const status = typeof errObj?.status === 'number' ? errObj.status : 500;
  const rawMessage = errObj?.message || '';

  let message = isEnglish
    ? 'An error occurred while generating content. Please try again.'
    : 'Ralat berlaku semasa menjana kandungan. Sila cuba semula.';

  if (
    errObj?.name === 'AbortError' ||
    status === 504 ||
    rawMessage.toLowerCase().includes('timeout')
  ) {
    message = isEnglish
      ? 'The AI model request timed out. Please try again shortly.'
      : 'Permintaan kepada model AI mengambil masa terlalu lama. Sila cuba semula sebentar lagi.';
  } else if (
    status === 403 ||
    rawMessage.includes('PERMISSION_DENIED') ||
    rawMessage.includes('API_KEY_INVALID')
  ) {
    message = isEnglish
      ? 'API access denied or invalid API key. Please check GEMINI_API_KEY in Settings > Secrets.'
      : 'Akses API ditolak atau kunci API tidak sah. Sila semak GEMINI_API_KEY di panel Settings > Secrets.';
  } else if (status === 429 || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    message = isEnglish
      ? 'API rate limit reached temporarily. Please wait a moment and try again.'
      : 'Had permintaan API telah dicapai buat sementara waktu. Sila tunggu sebentar dan cuba semula.';
  } else if (status === 503 || rawMessage.includes('UNAVAILABLE')) {
    message = isEnglish
      ? 'The AI service is temporarily busy due to high demand. Please try again in a few seconds.'
      : 'Perkhidmatan AI sedang mengalami trafik tinggi buat sementara waktu. Sila cuba semula sebentar lagi.';
  }

  return { status: status >= 400 && status < 600 ? status : 500, message };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/generate-proposal', async (req: Request, res: Response) => {
    const startTime = Date.now();
    const body = req.body as Partial<GenerateProposalBody>;
    const bahasa = body.bahasa === 'english' ? 'english' : 'melayu';

    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            'GEMINI_API_KEY belum dikonfigurasi. Sila tetapkan kunci API anda di panel Settings > Secrets.',
        });
        return;
      }

      const namaProgram = (body.namaProgram ?? '').trim();
      const namaSyarikat = (body.namaSyarikat ?? '').trim();
      const sektorOrganisasi = (body.sektorOrganisasi ?? 'Korporat / GLC').trim();
      const tahapPeserta = (body.tahapPeserta ?? 'Pengurusan Pertengahan & Eksekutif').trim();
      const huraianProgram = (body.huraianProgram ?? '').trim();
      const bilanganHari = Number(body.bilanganHari) || 1;
      const bilanganPeserta = Number(body.bilanganPeserta) || 1;
      const lokasiProgram = (body.lokasiProgram ?? 'Hotel').trim();

      if (!namaProgram || !namaSyarikat || !huraianProgram) {
        res.status(400).json({
          error:
            bahasa === 'english'
              ? 'Please complete Program Name, Company Name, and Program Description.'
              : 'Sila lengkapkan Nama Program, Nama Syarikat, dan Huraian Ringkas.',
        });
        return;
      }

      const systemInstruction =
        bahasa === 'english'
          ? 'You are a senior corporate training consultant at Impak Niaga. Draft an authoritative, formal corporate training proposal in fluent, executive English tailored to the client sector and participant seniority. All output fields must be strictly in English.'
          : 'Anda adalah perunding latihan korporat kanan dari Impak Niaga. Sediakan kandungan kertas kerja cadangan latihan korporat yang formal, berwibawa, dan meyakinkan dalam Bahasa Melayu rasmi mengikut sektor organisasi dan tahap jawatan peserta. Semua nilai teks mestilah dalam Bahasa Melayu.';

      const prompt =
        bahasa === 'english'
          ? `Prepare a comprehensive corporate training proposal based on these parameters:
- Program Name: ${namaProgram}
- Target Organization: ${namaSyarikat}
- Organization Sector: ${sektorOrganisasi}
- Participant Seniority Level: ${tahapPeserta}
- Program Brief & Objectives: ${huraianProgram}
- Duration: ${bilanganHari} day(s)
- Estimated Participants: ${bilanganPeserta} pax
- Venue Type: ${lokasiProgram}

Requirements:
1. pengenalan: Describe the current ${sektorOrganisasi} industry landscape, competency gaps for ${tahapPeserta}, and strategic rationale for ${namaSyarikat} (2-3 crisp paragraphs separated by newline).
2. objektif: Provide exactly 5 SMART learning objectives tailored to ${tahapPeserta}.
3. kaedah: Provide 4 to 5 interactive blended-learning facilitation methods suitable for ${tahapPeserta}.
4. hasil: Provide 4 to 5 tangible outcomes for both individual participants and ${namaSyarikat}.
5. modul: Design exactly 4 progressive training modules tailored to ${sektorOrganisasi}, each with a concise title (namaModul) and exactly 3 practical subtopics (pecahanTajuk).
6. penutup: Write a persuasive executive closing inviting collaboration with Impak Niaga.
7. hrdCorpNotes: Write 1 concise paragraph covering HRD Corp SBL-Khas claimability eligibility, accredited trainer compliance, and pre- and post-training competency evaluation.`
          : `Sediakan kandungan kertas kerja cadangan latihan korporat berdasarkan maklumat berikut:
- Nama Program: ${namaProgram}
- Organisasi Sasaran: ${namaSyarikat}
- Sektor Organisasi: ${sektorOrganisasi}
- Tahap Jawatan Peserta: ${tahapPeserta}
- Huraian Ringkas & Sasaran: ${huraianProgram}
- Tempoh Program: ${bilanganHari} hari
- Anggaran Peserta: ${bilanganPeserta} orang
- Jenis Lokasi: ${lokasiProgram}

Keperluan Kandungan:
1. pengenalan: Huraikan cabaran semasa sektor ${sektorOrganisasi}, jurang kompetensi bagi kumpulan ${tahapPeserta}, dan rasional strategik penganjuran program ini untuk ${namaSyarikat} (2-3 perenggan kemas dipisahkan baris baharu).
2. objektif: Senaraikan tepat 5 objektif pembelajaran SMART yang sesuai dengan tahap ${tahapPeserta}.
3. kaedah: Senaraikan 4 hingga 5 kaedah pengajaran bersepadu dan interaktif.
4. hasil: Huraikan 4 hingga 5 hasil impak positif yang boleh diukur untuk peserta dan ${namaSyarikat}.
5. modul: Cadangkan tepat 4 modul latihan progresif mengikut konteks ${sektorOrganisasi}; setiap modul perlu mempunyai namaModul yang jelas dan tepat 3 pecahanTajuk utama.
6. penutup: Tulis rumusan penutup rasmi yang meyakinkan bagi menjemput kerjasama bersama Impak Niaga.
7. hrdCorpNotes: Tulis 1 perenggan ringkas mengenai pematuhan tuntutan skim HRD Corp (SBL-Khas), jurulatih bertauliah TTT, serta pelaksanaan penilaian pra dan pasca kursus.`;

      const response = await generateWithFallback(prompt, systemInstruction, PROPOSAL_SCHEMA);
      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Model returned an empty response.');
      }

      const proposal = JSON.parse(rawText);
      console.log(`Generated proposal in ${Date.now() - startTime}ms`);
      res.json({ proposal });
    } catch (error: unknown) {
      console.error(`Error generating proposal after ${Date.now() - startTime}ms:`, error);
      const mapped = mapApiError(error, bahasa === 'english');
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.post('/api/refine-section', async (req: Request, res: Response) => {
    const startTime = Date.now();
    const body = req.body as Partial<RefineSectionBody>;
    const bahasa = body.bahasa === 'english' ? 'english' : 'melayu';

    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi.' });
        return;
      }

      const section = body.section;
      const action = body.action || 'formal';
      if (!section || body.currentContent === undefined) {
        res.status(400).json({ error: 'Missing section or content to refine.' });
        return;
      }

      const actionDesc =
        bahasa === 'english'
          ? action === 'expand'
            ? 'Expand with richer corporate detail, concrete examples, and executive depth (about 30-40% more detail).'
            : action === 'shorten'
            ? 'Make it noticeably more concise, punchy, and direct while keeping key points intact.'
            : 'Elevate the tone to be more formal, executive, and boardroom-ready.'
          : action === 'expand'
          ? 'Panjangkan dan perkayakan huraian dengan butiran korporat serta contoh praktikal yang lebih mendalam (~30-40% lebih terperinci).'
          : action === 'shorten'
          ? 'Ringkaskan supaya lebih padat, tepat, dan mudah dibaca tanpa mengorbankan isi penting.'
          : 'Tingkatkan laras bahasa supaya lebih formal, eksekutif, dan berwibawa untuk pembentangan pengurusan.';

      const systemInstruction =
        bahasa === 'english'
          ? 'You are a senior corporate training consultant at Impak Niaga. Refine only the requested proposal section in fluent executive English and return strict JSON.'
          : 'Anda adalah perunding latihan korporat kanan dari Impak Niaga. Perhalusi bahagian kertas kerja yang diminta sahaja dalam Bahasa Melayu rasmi yang kemas dan pulangkan JSON yang sah.';

      const isArraySection = section === 'objektif' || section === 'kaedah' || section === 'hasil';
      const isModuleSection = section === 'modul';

      const refineSchema = isModuleSection
        ? {
            type: Type.OBJECT,
            properties: {
              value: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    namaModul: { type: Type.STRING },
                    pecahanTajuk: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['namaModul', 'pecahanTajuk'],
                },
              },
            },
            required: ['value'],
          }
        : isArraySection
        ? {
            type: Type.OBJECT,
            properties: {
              value: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['value'],
          }
        : {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.STRING },
            },
            required: ['value'],
          };

      const prompt = `Context:
- Program: ${body.context?.namaProgram || '-'}
- Organization: ${body.context?.namaSyarikat || '-'}
- Sector: ${body.context?.sektorOrganisasi || '-'}
- Participant Level: ${body.context?.tahapPeserta || '-'}
- Section to Refine: ${section}
- Instruction: ${actionDesc}

Current Content:
${JSON.stringify(body.currentContent)}

Return the refined content inside the "value" field matching the exact original structure (${
        isModuleSection
          ? '4 module objects with namaModul and 3 pecahanTajuk each'
          : isArraySection
          ? 'array of 4-5 clear bullet strings'
          : 'clean prose string'
      }).`;

      const response = await generateWithFallback(prompt, systemInstruction, refineSchema);
      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Empty refinement response.');
      }

      const parsed = JSON.parse(rawText) as { value: unknown };
      console.log(`Refined section ${section} (${action}) in ${Date.now() - startTime}ms`);
      res.json({ refined: parsed.value });
    } catch (error: unknown) {
      console.error('Error refining section:', error);
      const mapped = mapApiError(error, bahasa === 'english');
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();

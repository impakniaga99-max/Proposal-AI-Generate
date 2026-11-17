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
  huraianProgram: string;
  bilanganHari: number;
  bilanganPeserta: number;
  lokasiProgram: string;
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
  },
  required: ['pengenalan', 'objektif', 'kaedah', 'hasil', 'modul', 'penutup'],
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/generate-proposal', async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            'GEMINI_API_KEY belum dikonfigurasi. Sila tetapkan kunci API anda di panel Settings > Secrets.',
        });
        return;
      }

      const body = req.body as Partial<GenerateProposalBody>;
      const bahasa = body.bahasa === 'english' ? 'english' : 'melayu';
      const namaProgram = (body.namaProgram ?? '').trim();
      const namaSyarikat = (body.namaSyarikat ?? '').trim();
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
          ? 'You are a senior corporate training consultant at Impak Niaga. Draft an authoritative, formal corporate training proposal in fluent, executive English. All output fields must be written strictly in English.'
          : 'Anda adalah perunding latihan korporat kanan dari Impak Niaga. Sediakan kandungan kertas kerja cadangan latihan korporat yang formal, berwibawa, dan meyakinkan dalam Bahasa Melayu rasmi yang kemas. Semua nilai teks mestilah dalam Bahasa Melayu.';

      const prompt =
        bahasa === 'english'
          ? `Prepare a comprehensive corporate training proposal based on these parameters:
- Program Name: ${namaProgram}
- Target Organization: ${namaSyarikat}
- Program Brief & Objectives: ${huraianProgram}
- Duration: ${bilanganHari} day(s)
- Estimated Participants: ${bilanganPeserta} pax
- Venue Type: ${lokasiProgram}

Requirements:
1. pengenalan: Describe the current organizational need, competency gaps, and strategic rationale for ${namaSyarikat} (2-3 crisp paragraphs separated by newline).
2. objektif: Provide exactly 5 SMART learning objectives tailored to this audience.
3. kaedah: Provide 4 to 5 interactive blended-learning facilitation methods.
4. hasil: Provide 4 to 5 tangible outcomes for both individual participants and ${namaSyarikat}.
5. modul: Design exactly 4 progressive training modules, each with a concise title (namaModul) and exactly 3 practical topics (pecahanTajuk).
6. penutup: Write a persuasive executive closing inviting collaboration with Impak Niaga.`
          : `Sediakan kandungan kertas kerja cadangan latihan korporat berdasarkan maklumat berikut:
- Nama Program: ${namaProgram}
- Organisasi Sasaran: ${namaSyarikat}
- Huraian Ringkas & Sasaran: ${huraianProgram}
- Tempoh Program: ${bilanganHari} hari
- Anggaran Peserta: ${bilanganPeserta} orang
- Jenis Lokasi: ${lokasiProgram}

Keperluan Kandungan:
1. pengenalan: Huraikan keperluan organisasi masa kini, jurang kompetensi, dan rasional strategik penganjuran program ini untuk ${namaSyarikat} (2-3 perenggan kemas dipisahkan baris baharu).
2. objektif: Senaraikan tepat 5 objektif pembelajaran SMART yang relevan.
3. kaedah: Senaraikan 4 hingga 5 kaedah pengajaran bersepadu dan interaktif.
4. hasil: Huraikan 4 hingga 5 hasil impak positif yang boleh diukur untuk peserta dan ${namaSyarikat}.
5. modul: Cadangkan tepat 4 modul latihan yang progresif; setiap modul perlu mempunyai namaModul yang jelas dan tepat 3 pecahanTajuk utama.
6. penutup: Tulis rumusan penutup rasmi yang meyakinkan bagi menjemput kerjasama bersama Impak Niaga.`;

      const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
        Promise.race([
          promise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms)
          ),
        ]);

      const callHydrogen = () =>
        withTimeout(
          ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: PROPOSAL_SCHEMA,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          15000,
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
              responseSchema: PROPOSAL_SCHEMA,
              thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            },
          }),
          20000,
          'gemini-3.1-flash-lite'
        );

      let response;
      try {
        response = await callHydrogen();
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
          response = await callFlashLite();
        } else {
          throw primaryErr;
        }
      }

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Model returned an empty response.');
      }

      const proposal = JSON.parse(rawText);
      console.log(`Generated proposal in ${Date.now() - startTime}ms`);
      res.json({ proposal });
    } catch (error: unknown) {
      console.error(`Error generating proposal after ${Date.now() - startTime}ms:`, error);
      const errObj = error as { status?: number; message?: string; name?: string };
      const status = typeof errObj?.status === 'number' ? errObj.status : 500;
      const rawMessage = errObj?.message || '';
      const isEnglish = (req.body as Partial<GenerateProposalBody>)?.bahasa === 'english';

      let message = isEnglish
        ? 'An error occurred while generating the proposal. Please try again.'
        : 'Ralat berlaku semasa menjana kertas kerja. Sila cuba semula.';

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
          ? 'The AI service is temporarily busy due to high demand. Please click Generate again in a few seconds.'
          : 'Perkhidmatan AI sedang mengalami trafik tinggi buat sementara waktu. Sila klik Jana semula sebentar lagi.';
      }

      res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
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

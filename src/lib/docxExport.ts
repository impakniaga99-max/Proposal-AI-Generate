import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import type {
  AIProposalContent,
  BrandingSettings,
  ProposalFormData,
  TrainerProfile,
} from '../types/proposal';
import { docLabels, uiLabels } from './i18n';
import {
  buildPackageTiers,
  buildTentativeSchedule,
  calculateFullBudget,
  formatRM,
} from './proposalUtils';

function makeHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 100 },
    border: {
      bottom: {
        color: '002147',
        space: 4,
        style: BorderStyle.SINGLE,
        size: 8,
      },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        color: '002147',
        font: 'Arial',
        size: 24,
      }),
    ],
  });
}

function makeSubHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: '002147',
        font: 'Arial',
        size: 21,
      }),
    ],
  });
}

function makeBodyParagraph(text: string, italic = false): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        italics: italic,
        color: '1F2937',
        font: 'Arial',
        size: 20,
      }),
    ],
  });
}

function makeTable(headers: string[], rows: string[][]): Table {
  const headerRow = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          shading: { fill: '002147' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                  size: 19,
                }),
              ],
            }),
          ],
        })
    ),
  });

  const bodyRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      color: '1F2937',
                      font: 'Arial',
                      size: 19,
                    }),
                  ],
                }),
              ],
            })
        ),
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows],
  });
}

export async function exportProposalToDocx(
  formData: ProposalFormData,
  aiContent: AIProposalContent,
  branding: BrandingSettings,
  trainerProfile: TrainerProfile
): Promise<void> {
  const lang = formData.bahasa;
  const T = docLabels[lang];
  const UI = uiLabels[lang];
  const isEn = lang === 'english';

  const budget = calculateFullBudget(formData);
  const tentativeDays =
    aiContent.customTentative && aiContent.customTentative.length > 0
      ? aiContent.customTentative
      : buildTentativeSchedule(
          formData.tarikhMula,
          formData.bilanganHari,
          formData.sesiMalamAktif,
          lang,
          aiContent.modul
        );

  const children: Array<Paragraph | Table> = [];

  // Letterhead Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: branding.companyName.toUpperCase(),
          bold: true,
          color: '002147',
          font: 'Arial',
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 140 },
      border: {
        bottom: { color: 'D4AF37', space: 4, style: BorderStyle.SINGLE, size: 12 },
      },
      children: [
        new TextRun({
          text: `${branding.regNo} · ${branding.address} · ${branding.phone} · ${branding.email}`,
          color: '475569',
          font: 'Arial',
          size: 16,
        }),
      ],
    })
  );

  // Optional Cover Letter
  if (formData.sertakanSuratIringan) {
    children.push(
      makeHeading(T.coverLetterTitle),
      makeBodyParagraph(
        `${isEn ? 'Ref. No.' : 'Ruj. Kami'}: ${formData.noRujukan || branding.refPrefix}    |    ${
          isEn ? 'Date' : 'Tarikh'
        }: ${formData.tarikhMula}`
      ),
      makeBodyParagraph(
        `${formData.namaPenerimaSurat || (isEn ? 'Human Resource Director' : 'Pengarah Sumber Manusia')}\n${
          formData.namaSyarikat
        }`
      ),
      makeBodyParagraph(
        isEn
          ? `Dear Sir/Madam,\n\nSUBMISSION OF CORPORATE TRAINING PROPOSAL: "${formData.namaProgram.toUpperCase()}"`
          : `Tuan/Puan,\n\nPENYERAHAN KERTAS KERJA CADANGAN PROGRAM LATIHAN: "${formData.namaProgram.toUpperCase()}"`
      ),
      makeBodyParagraph(
        isEn
          ? `With reference to the above, ${branding.companyName} is pleased to submit our comprehensive training proposal tailored for ${formData.namaSyarikat} (${formData.bilanganHari} day(s), ${formData.bilanganPeserta} participants, ${UI.venueOptions[formData.lokasiProgram]}). The proposed modules and methodologies are aligned to drive measurable performance outcomes.`
          : `Dengan segala hormatnya perkara di atas adalah dirujuk. Pihak ${branding.companyName} berbesar hati mengemukakan kertas kerja cadangan program latihan khusus untuk ${formData.namaSyarikat} bagi tempoh ${formData.bilanganHari} hari melibatkan ${formData.bilanganPeserta} orang peserta di ${UI.venueOptions[formData.lokasiProgram]}.`
      ),
      makeBodyParagraph(
        `${T.preparedBy}\n${branding.consultantName}\n${branding.consultantRole}, ${branding.companyName}`
      ),
      new Paragraph({ pageBreakBefore: true, children: [] })
    );
  }

  // Title Block
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [
        new TextRun({
          text: T.proposalTitle,
          bold: true,
          color: '002147',
          font: 'Arial',
          size: 32,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `${T.programHandling} "${formData.namaProgram.toUpperCase()}"`,
          bold: true,
          color: '111827',
          font: 'Arial',
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${T.proposalFor} ${formData.namaSyarikat.toUpperCase()}`,
          bold: true,
          color: '475569',
          font: 'Arial',
          size: 21,
        }),
      ],
    })
  );

  // 1.0 Introduction
  children.push(makeHeading(T.introTitle));
  aiContent.pengenalan
    .split(/\n+/)
    .filter(Boolean)
    .forEach((p) => children.push(makeBodyParagraph(p)));

  // 2.0 Objectives
  children.push(makeHeading(T.objectivesTitle), makeBodyParagraph(T.objectivesIntro));
  aiContent.objektif.forEach((item, idx) =>
    children.push(makeBodyParagraph(`${idx + 1}. ${item}`))
  );

  // 3.0 Teaching Methods
  children.push(makeHeading(T.methodsTitle), makeBodyParagraph(T.methodsIntro));
  aiContent.kaedah.forEach((item, idx) =>
    children.push(makeBodyParagraph(`${idx + 1}. ${item}`))
  );

  // 4.0 Outcomes
  children.push(makeHeading(T.outcomesTitle), makeBodyParagraph(T.outcomesIntro));
  aiContent.hasil.forEach((item, idx) =>
    children.push(makeBodyParagraph(`${idx + 1}. ${item}`))
  );

  // Optional HRD Corp Compliance
  if (formData.sertakanHrdCorp) {
    children.push(
      makeHeading(T.hrdCorpTitle),
      makeBodyParagraph(
        aiContent.hrdCorpNotes ||
          (isEn
            ? 'This training program is structured for HRD Corp SBL-Khas claimability, delivered by certified trainers (TTT), and supported by pre- and post-training competency evaluations.'
            : 'Program latihan ini dirangka memenuhi piawaian tuntutan skim HRD Corp (SBL-Khas), dikendalikan oleh jurulatih bertauliah (TTT), serta disokong oleh penilaian kompetensi pra dan pasca kursus.')
      )
    );
  }

  // 5.0 Modules
  children.push(makeHeading(T.modulesTitle));
  aiContent.modul.forEach((mod, mIdx) => {
    children.push(makeSubHeading(`${T.module} ${mIdx + 1}: ${mod.namaModul}`));
    mod.pecahanTajuk.forEach((topic, tIdx) =>
      children.push(makeBodyParagraph(`   ${mIdx + 1}.${tIdx + 1} ${topic}`))
    );
  });

  // 6.0 Tentative Schedule
  children.push(makeHeading(T.tentativeTitle));
  tentativeDays.forEach((day) => {
    children.push(
      makeSubHeading(`${T.day} ${day.dayNumber} (${day.formattedDate})`),
      makeTable(
        [T.time, T.activity],
        day.rows.map((r) => [r.time, r.activity])
      )
    );
  });

  // 7.0 Cost Details
  children.push(makeHeading(T.costTitle), makeBodyParagraph(T.costIntro));
  const costRows = budget.lines.map((line, idx) => [
    String(idx + 1),
    line.description,
    line.calculationNote,
    formatRM(line.amount),
  ]);
  if (budget.discountAmount > 0) {
    costRows.push([
      '-',
      `${T.discountLabel} (${formData.diskaunPeratus}%)`,
      '-',
      `-${formatRM(budget.discountAmount)}`,
    ]);
  }
  if (budget.sstAmount > 0) {
    costRows.push(['-', T.sstLabel, '8%', formatRM(budget.sstAmount)]);
  }
  costRows.push(['', T.totalBudgetLabel, '', formatRM(budget.grandTotal)]);

  children.push(
    makeTable([T.bilHeader, T.item, T.calculation, T.totalRM], costRows),
    makeBodyParagraph(T.costNote, true)
  );

  // Optional Package Comparison
  if (formData.sertakanPerbandinganPakej) {
    const tiers = buildPackageTiers(formData);
    children.push(
      makeSubHeading(T.packageComparisonTitle),
      makeTable(
        [
          isEn ? 'Package' : 'Pakej',
          isEn ? 'Venue' : 'Lokasi',
          isEn ? 'Inclusions' : 'Kandungan',
          isEn ? 'Per Pax' : 'Per Peserta',
          isEn ? 'Total' : 'Jumlah',
        ],
        tiers.map((t) => [
          t.name,
          t.venue,
          t.includes,
          formatRM(t.pricePerPax),
          formatRM(t.totalPrice),
        ])
      )
    );
  }

  // 8.0 Conclusion
  children.push(makeHeading(T.conclusionTitle));
  aiContent.penutup
    .split(/\n+/)
    .filter(Boolean)
    .forEach((p) => children.push(makeBodyParagraph(p)));

  children.push(
    new Paragraph({ spacing: { before: 240 }, children: [] }),
    makeBodyParagraph(
      `${T.preparedBy}\n\n\n............................................\n${branding.consultantName}\n(${branding.consultantRole})\n${branding.companyName}`
    )
  );

  // Optional Quotation Sheet
  if (formData.sertakanSebutHarga) {
    children.push(
      new Paragraph({ pageBreakBefore: true, children: [] }),
      makeHeading(T.quotationTitle),
      makeBodyParagraph(
        `${isEn ? 'Quotation To' : 'Kepada'}: ${formData.namaSyarikat}  |  ${
          isEn ? 'Ref' : 'No. Ruj'
        }: QTN-${formData.noRujukan || branding.refPrefix}  |  ${
          isEn ? 'Validity' : 'Tempoh Sah'
        }: 30 ${isEn ? 'Days' : 'Hari'}`
      ),
      makeTable([T.bilHeader, T.item, T.calculation, T.totalRM], costRows)
    );
  }

  // Optional Trainer CV
  if (trainerProfile.enabled) {
    children.push(
      new Paragraph({ pageBreakBefore: true, children: [] }),
      makeHeading(T.trainerCvTitle),
      makeSubHeading(trainerProfile.name),
      makeBodyParagraph(trainerProfile.title, true),
      makeBodyParagraph(
        `${isEn ? 'Qualifications' : 'Kelayakan Akademik & Pentauliahan'}: ${trainerProfile.qualifications}`
      ),
      makeBodyParagraph(
        `${isEn ? 'Core Expertise' : 'Bidang Kepakaran'}: ${trainerProfile.expertise}`
      ),
      makeBodyParagraph(
        `${isEn ? 'Notable Clients' : 'Rekod Klien Terdahulu'}: ${trainerProfile.pastClients}`
      )
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~20mm
              right: 1134,
              bottom: 1134,
              left: 1134,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName =
    formData.namaProgram.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_') ||
    'Kertas_Kerja_Impak_Niaga';
  link.href = url;
  link.download = `${safeName}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

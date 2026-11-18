import React from 'react';
import type { Language } from '../types/proposal';
import { uiLabels } from '../lib/i18n';

interface FormatGuideViewProps {
  language: Language;
  onStartBuilding: () => void;
}

export const FormatGuideView: React.FC<FormatGuideViewProps> = ({ language, onStartBuilding }) => {
  const T = uiLabels[language];
  const isEn = language === 'english';

  const sections = isEn
    ? [
        { num: 'A', title: 'Official Cover Letter (Optional)', desc: 'Custom letterhead, reference number, recipient addressing, digital signature, and company stamp.' },
        { num: '1.0', title: 'Introduction', desc: 'Industry rationale tailored to client sector and participant seniority.' },
        { num: '2.0', title: 'Program Objectives', desc: 'Five measurable SMART learning objectives with one-click AI refinement.' },
        { num: '3.0', title: 'Teaching Methods', desc: 'Blended, interactive facilitation techniques illustrated with framework graphics.' },
        { num: '4.0', title: 'Program Outcomes', desc: 'Tangible workplace impact for both individuals and departments.' },
        { num: '5.0', title: 'Module Proposal', desc: 'Four progressive training modules, each structured into three subtopics.' },
        { num: '6.0', title: 'Proposed Tentative', desc: 'Module-mapped daily timetable auto-dated from start date with inline row editing.' },
        { num: 'B', title: 'HRD Corp & Package Comparison (Optional)', desc: 'SBL-Khas claimability, pre/post evaluation rubric, and 3-tier venue comparison.' },
        { num: '7.0', title: 'Cost Details', desc: 'Auto or itemized custom costing with configurable speaker rate, discount %, and 8% SST.' },
        { num: '8.0', title: 'Conclusion', desc: 'Executive sign-off with digital signature and official company stamp.' },
        { num: 'C', title: 'Official Quotation & Trainer CV (Optional)', desc: 'Standalone A4 quotation sheet with 30-day validity and lead trainer biography sheet.' },
      ]
    : [
        { num: 'A', title: 'Surat Iringan Rasmi (Opsional)', desc: 'Kepala surat syarikat, no. rujukan, penerima rasmi, tandatangan digital, dan cop syarikat.' },
        { num: '1.0', title: 'Pengenalan', desc: 'Latar belakang industri disesuaikan mengikut sektor organisasi dan tahap peserta.' },
        { num: '2.0', title: 'Objektif Program', desc: 'Lima objektif pembelajaran SMART dengan butang penyuntingan & penghalusan AI.' },
        { num: '3.0', title: 'Kaedah Pengajaran', desc: 'Pendekatan pembelajaran bersepadu berserta infografik dan ilustrasi bengkel.' },
        { num: '4.0', title: 'Hasil Program', desc: 'Impak kerja yang boleh diukur kepada individu dan organisasi secara menyeluruh.' },
        { num: '5.0', title: 'Cadangan Modul', desc: 'Empat modul latihan progresif lengkap dengan tiga pecahan tajuk setiap modul.' },
        { num: '6.0', title: 'Cadangan Tentatif Program', desc: 'Jadual harian bertarikh automatik dipetakan terus dengan nama modul dan boleh disunting.' },
        { num: 'B', title: 'Pematuhan HRD Corp & Pilihan Pakej (Opsional)', desc: 'Skim tuntutan SBL-Khas, penilaian pra/pasca, serta matriks perbandingan 3 pakej.' },
        { num: '7.0', title: 'Perincian Kos', desc: 'Mod auto atau item tersuai, kadar penceramah boleh ubah, diskaun (%), dan SST 8%.' },
        { num: '8.0', title: 'Penutup', desc: 'Rumusan penutup rasmi berserta ruang pengesahan, tandatangan digital, dan cop rasmi.' },
        { num: 'C', title: 'Sebut Harga Rasmi & Profil Penceramah (Opsional)', desc: 'Helaian Sebut Harga berasingan (sah 30 hari) serta helaian CV penceramah bertauliah.' },
      ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl font-bold text-navy tracking-tight">
          {T.guideHeading}
        </h1>
        <button
          type="button"
          onClick={onStartBuilding}
          className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {T.navEditor}
        </button>
      </div>

      {/* Proposal Structure Grid */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {sections.map((sec) => (
          <div key={sec.num} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
            <span className="font-mono tabular-nums text-sm font-semibold text-navy w-12 shrink-0">
              {sec.num}
            </span>
            <div className="space-y-0.5">
              <h2 className="font-display text-sm font-semibold text-slate-900">{sec.title}</h2>
              <p className="text-sm text-slate-600">{sec.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Costing Formula Reference */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="font-display text-base font-semibold text-navy">
          {isEn ? 'Standard Costing & Export Formats' : 'Formula Pengiraan Bajet & Format Eksport'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isEn ? 'Auto Budget Formula' : 'Formula Bajet Automatik'}
            </div>
            <div className="mt-1 font-mono tabular-nums text-sm font-semibold text-slate-900">
              {isEn ? '(Rate × Pax × Days) - Disc + SST' : '(Kadar × Peserta × Hari) - Diskaun + SST'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isEn ? 'Speaker Rate (Editable)' : 'Fee Penceramah (Boleh Ubah)'}
            </div>
            <div className="mt-1 font-mono tabular-nums text-sm font-semibold text-slate-900">
              {isEn ? 'Default RM 3,500 × Days' : 'Lalai RM 3,500 × Hari'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isEn ? 'Typography & Export' : 'Tipografi & Eksport'}
            </div>
            <div className="mt-1 font-mono tabular-nums text-sm font-semibold text-slate-900">
              Arial A4 · PDF & Word (.docx)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        { num: '1.0', title: 'Introduction', desc: 'Industry rationale and organizational context tailored to the client.' },
        { num: '2.0', title: 'Program Objectives', desc: 'Five measurable SMART learning objectives.' },
        { num: '3.0', title: 'Teaching Methods', desc: 'Blended, interactive facilitation techniques centered on participants.' },
        { num: '4.0', title: 'Program Outcomes', desc: 'Tangible workplace impact for both individuals and departments.' },
        { num: '5.0', title: 'Module Proposal', desc: 'Four progressive training modules, each structured into three subtopics.' },
        { num: '6.0', title: 'Proposed Tentative', desc: 'Day-by-day timetable auto-dated from your start date with optional evening sessions.' },
        { num: '7.0', title: 'Cost Details', desc: 'Transparent budget breakdown calculated automatically from participant rate and duration.' },
        { num: '8.0', title: 'Conclusion', desc: 'Formal executive sign-off prepared under Impak Niaga training consultancy.' },
      ]
    : [
        { num: '1.0', title: 'Pengenalan', desc: 'Latar belakang industri, jurang kompetensi, dan rasional penganjuran program.' },
        { num: '2.0', title: 'Objektif Program', desc: 'Lima objektif pembelajaran SMART yang selaras dengan sasaran peserta.' },
        { num: '3.0', title: 'Kaedah Pengajaran', desc: 'Pendekatan pembelajaran bersepadu yang interaktif dan berpusatkan peserta.' },
        { num: '4.0', title: 'Hasil Program', desc: 'Impak kerja yang boleh diukur kepada individu dan organisasi secara menyeluruh.' },
        { num: '5.0', title: 'Cadangan Modul', desc: 'Empat modul latihan progresif lengkap dengan tiga pecahan tajuk setiap modul.' },
        { num: '6.0', title: 'Cadangan Tentatif Program', desc: 'Jadual harian bertarikh automatik berserta pilihan sesi malam bagi kursus melebihi 1 hari.' },
        { num: '7.0', title: 'Perincian Kos', desc: 'Pengiraan bajet telus meliputi yuran penceramah, pakej peserta, logistik, dan kontigensi.' },
        { num: '8.0', title: 'Penutup', desc: 'Rumusan penutup rasmi berserta ruang pengesahan perunding latihan Impak Niaga.' },
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

      {/* 8-Section Standard Grid */}
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
          {isEn ? 'Standard Costing Formula' : 'Formula Pengiraan Bajet Standard'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isEn ? 'Total Collection' : 'Jumlah Bajet Kutipan'}
            </div>
            <div className="mt-1 font-mono tabular-nums text-sm font-semibold text-slate-900">
              {isEn ? 'Rate × Participants × Days' : 'Kadar × Peserta × Hari'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isEn ? 'Professional Speaker Fee' : 'Fee Penceramah Profesional'}
            </div>
            <div className="mt-1 font-mono tabular-nums text-sm font-semibold text-slate-900">
              {isEn ? 'RM 3,500.00 × Days' : 'RM 3,500.00 × Hari'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isEn ? 'Contingency Reserve' : 'Peruntukan Kontigensi'}
            </div>
            <div className="mt-1 font-mono tabular-nums text-sm font-semibold text-slate-900">
              {isEn ? '10% of Remaining Balance' : '10% daripada Baki'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

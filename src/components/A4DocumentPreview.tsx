import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Loader2,
  Pencil,
  Check,
  Printer,
  BookmarkCheck,
  Bookmark,
  FileSpreadsheet,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import type {
  AIProposalContent,
  BrandingSettings,
  Language,
  ProposalFormData,
  TentativeDay,
  TrainerProfile,
} from '../types/proposal';
import { docLabels, uiLabels } from '../lib/i18n';
import {
  buildPackageTiers,
  buildTentativeSchedule,
  calculateFullBudget,
  formatRM,
  paginateTentativeDays,
} from '../lib/proposalUtils';
import {
  BlendedLearningInfographic,
  BudgetDonutInfographic,
  ExecutiveSnapshotStrip,
  ModuleRoadmapInfographic,
} from './ProposalInfographics';

export type RefineSectionKey =
  | 'pengenalan'
  | 'objektif'
  | 'kaedah'
  | 'hasil'
  | 'modul'
  | 'penutup'
  | 'hrdCorpNotes';

export type RefineActionKey = 'expand' | 'shorten' | 'formal';

interface A4DocumentPreviewProps {
  formData: ProposalFormData;
  aiContent: AIProposalContent;
  branding: BrandingSettings;
  trainerProfile: TrainerProfile;
  onUpdateAiContent: (updated: AIProposalContent) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onSaveDraft: () => void;
  justSavedDraft: boolean;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  onExportDocx: () => void;
  isExportingDocx: boolean;
  onRefineSection: (section: RefineSectionKey, action: RefineActionKey) => void;
  refiningSection: string | null;
  documentRef: React.RefObject<HTMLDivElement | null>;
}

const COVER_IMAGE_PATH = '/src/assets/images/proposal_cover_training_1794896623243.jpg';
const WORKSHOP_IMAGE_PATH = '/src/assets/images/proposal_workshop_collab_1794896622483.jpg';
const GROWTH_IMAGE_PATH = '/src/assets/images/proposal_impact_growth_1794896622888.jpg';
const LOGO_IMAGE_PATH = '/assets/aistudio/Logo_Impak_Niaga_9f4ce565.png';

const ARIAL_FONT = 'Arial, Helvetica, sans-serif';

const RunningHeader: React.FC<{
  companyBrand: string;
  programName: string;
  clientName: string;
}> = ({ companyBrand, programName, clientName }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '16px',
      paddingBottom: '8px',
      marginBottom: '12px',
      borderBottom: '1px solid #cbd5e1',
      fontFamily: ARIAL_FONT,
      fontSize: '7.5pt',
      lineHeight: 1.45,
      color: '#64748b',
    }}
  >
    <div style={{ fontWeight: 700, color: '#002147', letterSpacing: '0.03em', maxWidth: '40%' }}>
      {companyBrand.toUpperCase()}
    </div>
    <div style={{ textAlign: 'right', maxWidth: '58%', color: '#475569' }}>
      {programName} · {clientName}
    </div>
  </div>
);

const PageFooter: React.FC<{
  companyBrand: string;
  language: Language;
  pageNumber: number;
  totalPages: number;
}> = ({ companyBrand, language, pageNumber, totalPages }) => (
  <div
    className="num-cell"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '8px',
      marginTop: '12px',
      borderTop: '1px solid #e2e8f0',
      fontFamily: ARIAL_FONT,
      fontSize: '7.5pt',
      lineHeight: 1.4,
      color: '#64748b',
    }}
  >
    <span>
      {companyBrand} ·{' '}
      {language === 'english' ? 'Corporate Training Proposal' : 'Kertas Kerja Cadangan Korporat'}
    </span>
    <span>
      {language === 'english'
        ? `Page ${pageNumber} of ${totalPages}`
        : `Muka Surat ${pageNumber} daripada ${totalPages}`}
    </span>
  </div>
);

const RefineBar: React.FC<{
  section: RefineSectionKey;
  language: Language;
  refiningSection: string | null;
  onRefine: (section: RefineSectionKey, action: RefineActionKey) => void;
}> = ({ section, language, refiningSection, onRefine }) => {
  const UI = uiLabels[language];
  const isBusy = refiningSection === section;

  const btnStyle: React.CSSProperties = {
    fontFamily: ARIAL_FONT,
    fontSize: '7pt',
    fontWeight: 600,
    color: '#002147',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '2px 7px',
    cursor: isBusy ? 'wait' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
  };

  return (
    <div
      className="no-print"
      data-html2canvas-ignore="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '4px',
        marginTop: '-3px',
        marginBottom: '6px',
      }}
    >
      {isBusy ? (
        <span
          style={{
            fontFamily: ARIAL_FONT,
            fontSize: '7pt',
            color: '#002147',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          {UI.refining}
        </span>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onRefine(section, 'expand')}
            style={btnStyle}
            title={UI.refineExpand}
          >
            <Sparkles className="h-2.5 w-2.5" />
            {UI.refineExpand}
          </button>
          <button
            type="button"
            onClick={() => onRefine(section, 'shorten')}
            style={btnStyle}
            title={UI.refineShorten}
          >
            {UI.refineShorten}
          </button>
          <button
            type="button"
            onClick={() => onRefine(section, 'formal')}
            style={btnStyle}
            title={UI.refineFormal}
          >
            {UI.refineFormal}
          </button>
        </>
      )}
    </div>
  );
};

const SignOffSignatureBlock: React.FC<{
  preparedByText: string;
  branding: BrandingSettings;
}> = ({ preparedByText, branding }) => (
  <div
    style={{
      marginTop: '18px',
      fontFamily: ARIAL_FONT,
      fontSize: '9.5pt',
      lineHeight: 1.45,
      color: '#111827',
    }}
  >
    <p style={{ marginBottom: '8px', marginTop: 0 }}>{preparedByText}</p>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', minHeight: '56px' }}>
      <div>
        {branding.signatureDataUrl ? (
          <img
            src={branding.signatureDataUrl}
            alt="Signature"
            style={{ height: '46px', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <div style={{ height: '34px' }} />
        )}
        <div
          style={{
            borderTop: '1px dotted #334155',
            minWidth: '220px',
            paddingTop: '5px',
          }}
        >
          <div style={{ fontWeight: 700, color: '#002147' }}>{branding.consultantName}</div>
          <div style={{ fontSize: '8.5pt', color: '#334155', fontWeight: 600 }}>
            {branding.consultantRole}
          </div>
          <div style={{ fontSize: '8.5pt', fontWeight: 700, color: '#111827' }}>
            {branding.companyName}
          </div>
        </div>
      </div>

      {branding.stampDataUrl && (
        <div style={{ paddingBottom: '2px' }}>
          <img
            src={branding.stampDataUrl}
            alt="Company Stamp"
            style={{
              height: '62px',
              width: 'auto',
              objectFit: 'contain',
              opacity: 0.9,
              display: 'block',
            }}
          />
        </div>
      )}
    </div>
  </div>
);

export const A4DocumentPreview: React.FC<A4DocumentPreviewProps> = ({
  formData,
  aiContent,
  branding,
  trainerProfile,
  onUpdateAiContent,
  isEditMode,
  onToggleEditMode,
  onSaveDraft,
  justSavedDraft,
  onExportPdf,
  isExportingPdf,
  onExportDocx,
  isExportingDocx,
  onRefineSection,
  refiningSection,
  documentRef,
}) => {
  const lang = formData.bahasa;
  const isEn = lang === 'english';
  const UI = uiLabels[lang];
  const T = docLabels[lang];

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const markImageFailed = (key: string) =>
    setFailedImages((prev) => ({ ...prev, [key]: true }));

  const budget = calculateFullBudget(formData);
  const autoTentativeDays = buildTentativeSchedule(
    formData.tarikhMula,
    formData.bilanganHari,
    formData.sesiMalamAktif,
    lang,
    aiContent.modul
  );
  const tentativeDays =
    aiContent.customTentative && aiContent.customTentative.length > 0
      ? aiContent.customTentative
      : autoTentativeDays;

  const tentativeChunks: TentativeDay[][] = paginateTentativeDays(tentativeDays);

  const hasCoverLetterPage = formData.sertakanSuratIringan;
  const hasHrdOrPackagePage = formData.sertakanHrdCorp || formData.sertakanPerbandinganPakej;
  const totalCostTableRows =
    budget.lines.length +
    (budget.discountAmount > 0 ? 1 : 0) +
    (budget.sstAmount > 0 ? 1 : 0);
  const splitCostAndConclusion = totalCostTableRows > 5 || aiContent.penutup.length > 700;
  const hasQuotationPage = formData.sertakanSebutHarga;
  const hasTrainerCvPage = trainerProfile.enabled;

  const totalPages =
    (hasCoverLetterPage ? 1 : 0) +
    3 + // Intro (1.0), Obj/Methods/Outcomes (2.0-4.0), Modules (5.0)
    tentativeChunks.length +
    (hasHrdOrPackagePage ? 1 : 0) +
    (splitCostAndConclusion ? 2 : 1) + // Cost (7.0) + Conclusion (8.0)
    (hasQuotationPage ? 1 : 0) +
    (hasTrainerCvPage ? 1 : 0);

  const pageOffset = hasCoverLetterPage ? 1 : 0;
  const hrdPackagePageNum = pageOffset + 4 + tentativeChunks.length;
  const costPageNum = hrdPackagePageNum + (hasHrdOrPackagePage ? 1 : 0);
  const conclusionPageNum = splitCostAndConclusion ? costPageNum + 1 : costPageNum;
  const quotationPageNum = conclusionPageNum + 1;
  const trainerCvPageNum = quotationPageNum + (hasQuotationPage ? 1 : 0);

  const updateArrayItem = (
    field: 'objektif' | 'kaedah' | 'hasil',
    index: number,
    value: string
  ) => {
    const next = [...aiContent[field]];
    next[index] = value;
    onUpdateAiContent({ ...aiContent, [field]: next });
  };

  const updateModuleTitle = (modIndex: number, value: string) => {
    const nextModules = aiContent.modul.map((mod, idx) =>
      idx === modIndex ? { ...mod, namaModul: value } : mod
    );
    onUpdateAiContent({ ...aiContent, modul: nextModules });
  };

  const updateModuleTopic = (modIndex: number, topicIndex: number, value: string) => {
    const nextModules = aiContent.modul.map((mod, idx) => {
      if (idx !== modIndex) return mod;
      const nextTopics = [...mod.pecahanTajuk];
      nextTopics[topicIndex] = value;
      return { ...mod, pecahanTajuk: nextTopics };
    });
    onUpdateAiContent({ ...aiContent, modul: nextModules });
  };

  const cloneTentative = (): TentativeDay[] =>
    tentativeDays.map((d) => ({
      ...d,
      rows: d.rows.map((r) => ({ ...r })),
    }));

  const updateTentativeRow = (
    dayNumber: number,
    rowIdx: number,
    field: 'time' | 'activity',
    value: string
  ) => {
    const next = cloneTentative().map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      const rows = d.rows.map((r, i) => (i === rowIdx ? { ...r, [field]: value } : r));
      return { ...d, rows };
    });
    onUpdateAiContent({ ...aiContent, customTentative: next });
  };

  const addTentativeRow = (dayNumber: number) => {
    const next = cloneTentative().map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      return {
        ...d,
        rows: [
          ...d.rows,
          {
            time: isEn ? '05:30 PM - 06:00 PM' : '05:30 petang - 06:00 petang',
            activity: isEn ? 'Additional Activity' : 'Aktiviti Tambahan',
          },
        ],
      };
    });
    onUpdateAiContent({ ...aiContent, customTentative: next });
  };

  const removeTentativeRow = (dayNumber: number, rowIdx: number) => {
    const next = cloneTentative().map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      return {
        ...d,
        rows: d.rows.filter((_, i) => i !== rowIdx),
      };
    });
    onUpdateAiContent({ ...aiContent, customTentative: next });
  };

  const resetTentativeToAuto = () => {
    const { customTentative: _ignored, ...rest } = aiContent;
    onUpdateAiContent(rest);
  };

  const introParagraphs = aiContent.pengenalan
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const conclusionParagraphs = aiContent.penutup
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const hrdText =
    aiContent.hrdCorpNotes ||
    (isEn
      ? 'This training program is structured for HRD Corp SBL-Khas claimability, facilitated by certified HRD Corp trainers (TTT), and incorporates pre- and post-training competency evaluations to measure participant growth.'
      : 'Program latihan ini dirangka memenuhi piawaian tuntutan skim HRD Corp (SBL-Khas), dikendalikan oleh jurulatih bertauliah (TTT), serta disokong dengan penilaian kompetensi pra dan pasca kursus bagi mengukur peningkatan prestasi peserta.');

  const packageTiers = formData.sertakanPerbandinganPakej ? buildPackageTiers(formData) : [];
  const docRefNumber = formData.noRujukan?.trim() || `${branding.refPrefix}/01`;

  const renderConclusionBlock = (isTopOfPage: boolean) => (
    <>
      <h2 className="section-heading" style={isTopOfPage ? { marginTop: 0 } : undefined}>
        {T.conclusionTitle}
      </h2>
      <RefineBar
        section="penutup"
        language={lang}
        refiningSection={refiningSection}
        onRefine={onRefineSection}
      />

      {isEditMode ? (
        <textarea
          value={aiContent.penutup}
          onChange={(e) => onUpdateAiContent({ ...aiContent, penutup: e.target.value })}
          rows={4}
          style={{
            width: '100%',
            padding: '8px',
            fontFamily: ARIAL_FONT,
            fontSize: '9.6pt',
            lineHeight: 1.5,
            border: '1px solid #94a3b8',
            borderRadius: '4px',
            backgroundColor: '#f8fafc',
            color: '#111827',
          }}
        />
      ) : (
        conclusionParagraphs.map((para, i) => (
          <p key={i} className="prose-paragraph">
            {para}
          </p>
        ))
      )}

      <SignOffSignatureBlock preparedByText={T.preparedBy} branding={branding} />
    </>
  );

  return (
    <div className="space-y-4">
      {/* Document Control Toolbar */}
      <div className="no-print bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{UI.docReadyTitle}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-mono tabular-nums">
            <span>
              {totalPages} {isEn ? 'A4 Pages' : 'Helaian A4'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {formData.bilanganHari} {isEn ? 'Days' : 'Hari'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {formData.bilanganPeserta} {T.paxUnit}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">{formatRM(budget.grandTotal)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleEditMode}
            className={`inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isEditMode
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isEditMode ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            <span>{isEditMode ? UI.editModeOn : UI.editModeOff}</span>
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {justSavedDraft ? (
              <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
            <span>{justSavedDraft ? UI.draftSaved : UI.saveDraft}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{UI.printDoc}</span>
          </button>

          <button
            type="button"
            onClick={onExportDocx}
            disabled={isExportingDocx}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-navy hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            {isExportingDocx ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-3.5 w-3.5 text-navy" />
            )}
            <span>{isExportingDocx ? UI.downloadingWord : UI.downloadWord}</span>
          </button>

          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-navy text-white hover:bg-navy-light transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-70"
          >
            {isExportingPdf ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />
            ) : (
              <Download className="h-3.5 w-3.5 text-gold" />
            )}
            <span>{isExportingPdf ? UI.downloadingPdf : UI.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Paginated A4 Sheets Viewport */}
      <div className="w-full overflow-x-auto bg-slate-200/60 border border-slate-200 rounded-xl p-3 sm:p-6">
        <div id="kertasKerjaContent" ref={documentRef} className="a4-pages-stack">
          {/* ========================================================== */}
          {/* OPTIONAL SHEET 0: OFFICIAL COVER LETTER (SURAT IRINGAN)    */}
          {/* ========================================================== */}
          {hasCoverLetterPage && (
            <section className="a4-page">
              <div className="a4-page-body" style={{ fontFamily: ARIAL_FONT }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    paddingBottom: '12px',
                    marginBottom: '22px',
                    borderBottom: '2.5px solid #002147',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {!failedImages.logo && (
                      <img
                        src={LOGO_IMAGE_PATH}
                        alt={branding.companyName}
                        referrerPolicy="no-referrer"
                        onError={() => markImageFailed('logo')}
                        style={{ height: '48px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
                      />
                    )}
                    <div>
                      <div
                        style={{
                          fontFamily: ARIAL_FONT,
                          fontSize: '13pt',
                          fontWeight: 700,
                          color: '#002147',
                          lineHeight: 1.3,
                        }}
                      >
                        {branding.companyName.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '8pt', color: '#475569', lineHeight: 1.4 }}>
                        {branding.regNo} · {branding.phone} · {branding.email}
                      </div>
                      <div style={{ fontSize: '8pt', color: '#475569', lineHeight: 1.4 }}>
                        {branding.address}
                      </div>
                    </div>
                  </div>
                  {branding.clientLogoDataUrl && (
                    <img
                      src={branding.clientLogoDataUrl}
                      alt={formData.namaSyarikat}
                      style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
                    />
                  )}
                </div>

                <div
                  className="num-cell"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '9.5pt',
                    lineHeight: 1.45,
                    color: '#334155',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <strong>{isEn ? 'Our Ref:' : 'Ruj. Kami:'}</strong> {docRefNumber}
                  </div>
                  <div>
                    <strong>{isEn ? 'Date:' : 'Tarikh:'}</strong> {formData.tarikhMula}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '10pt',
                    color: '#111827',
                    marginBottom: '18px',
                    lineHeight: 1.55,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>
                    {formData.namaPenerimaSurat ||
                      (isEn ? 'Director of Human Resources' : 'Pengarah Sumber Manusia')}
                  </div>
                  <div style={{ fontWeight: 700, color: '#002147' }}>{formData.namaSyarikat}</div>
                  <div style={{ color: '#475569', fontSize: '9pt' }}>
                    {formData.sektorOrganisasi}
                  </div>
                </div>

                <p style={{ fontSize: '10pt', marginBottom: '12px' }}>
                  {isEn ? 'Dear Sir/Madam,' : 'Tuan/Puan,'}
                </p>

                <div
                  style={{
                    fontSize: '10.5pt',
                    fontWeight: 700,
                    lineHeight: 1.4,
                    color: '#002147',
                    textTransform: 'uppercase',
                    borderBottom: '1.5px solid #002147',
                    paddingBottom: '5px',
                    marginBottom: '14px',
                  }}
                >
                  {isEn
                    ? `SUBMISSION OF CORPORATE TRAINING PROPOSAL: "${formData.namaProgram}"`
                    : `PENYERAHAN KERTAS KERJA CADANGAN PROGRAM LATIHAN: "${formData.namaProgram}"`}
                </div>

                <p className="prose-paragraph">
                  {isEn
                    ? `With reference to the above, ${branding.companyName} is pleased to present our formal proposal for the "${formData.namaProgram}" program tailored specifically for ${formData.namaSyarikat}.`
                    : `Dengan segala hormatnya perkara di atas adalah dirujuk. Pihak ${branding.companyName} berbesar hati mengemukakan kertas kerja cadangan bagi penganjuran "${formData.namaProgram}" yang direka khusus untuk warga kerja ${formData.namaSyarikat}.`}
                </p>
                <p className="prose-paragraph">
                  {isEn
                    ? `Scheduled over ${formData.bilanganHari} day(s) (${formData.tarikhMula} to ${formData.tarikhAkhir}) for approximately ${formData.bilanganPeserta} participants (${formData.tahapPeserta}) at ${UI.venueOptions[formData.lokasiProgram]}, this intervention combines strategic frameworks, practical workplace simulations, and post-course execution tracking.`
                    : `Program berimpak tinggi selama ${formData.bilanganHari} hari (${formData.tarikhMula} hingga ${formData.tarikhAkhir}) untuk anggaran ${formData.bilanganPeserta} orang peserta (${formData.tahapPeserta}) di ${UI.venueOptions[formData.lokasiProgram]} ini dirangka menggunakan pendekatan pembelajaran bersepadu yang menekankan aplikasi terus di tempat kerja.`}
                </p>
                <p className="prose-paragraph">
                  {isEn
                    ? `The proposed total investment is ${formatRM(budget.grandTotal)}${
                        formData.sertakanHrdCorp
                          ? ' (eligible for HRD Corp SBL-Khas claim subject to terms)'
                          : ''
                      }. Full module outlines, daily tentative schedules, and itemized cost breakdowns are detailed in the enclosed pages.`
                    : `Anggaran pelaburan keseluruhan bagi pelaksanaan program ini ialah sebanyak ${formatRM(budget.grandTotal)}${
                        formData.sertakanHrdCorp
                          ? ' dan layak dipertimbangkan di bawah skim tuntutan HRD Corp (SBL-Khas)'
                          : ''
                      }. Perincian modul, jadual tentatif harian, dan pecahan kos dilampirkan bersama surat ini untuk pertimbangan pihak Tuan/Puan.`}
                </p>
                <p className="prose-paragraph">
                  {isEn
                    ? 'We welcome the opportunity to discuss and customize the curriculum further to align seamlessly with your organizational priorities. Thank you.'
                    : 'Pihak kami amat mengalu-alukan sesi perbincangan lanjut bagi menyelaraskan kandungan kursus mengikut keperluan strategik organisasi Tuan/Puan. Sekian, terima kasih.'}
                </p>

                <SignOffSignatureBlock
                  preparedByText={isEn ? 'Yours sincerely,' : 'Yang menjalankan amanah,'}
                  branding={branding}
                />
              </div>
              <PageFooter
                companyBrand={branding.companyName}
                language={lang}
                pageNumber={1}
                totalPages={totalPages}
              />
            </section>
          )}

          {/* ========================================================== */}
          {/* PAGE 1: LETTERHEAD + COVER BANNER + SNAPSHOT + 1.0 INTRO   */}
          {/* ========================================================== */}
          <section className="a4-page">
            <div className="a4-page-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  paddingBottom: '10px',
                  marginBottom: '12px',
                  borderBottom: '2px solid #D4AF37',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {!failedImages.logo && (
                    <img
                      src={LOGO_IMAGE_PATH}
                      alt={branding.companyName}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed('logo')}
                      style={{ height: '42px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
                    />
                  )}
                  <div>
                    <div
                      style={{
                        fontFamily: ARIAL_FONT,
                        fontSize: '11.5pt',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: '#002147',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {branding.companyName.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontFamily: ARIAL_FONT,
                        fontSize: '7.8pt',
                        lineHeight: 1.35,
                        color: '#475569',
                      }}
                    >
                      {branding.phone} · {branding.email}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    className="num-cell"
                    style={{
                      fontFamily: ARIAL_FONT,
                      fontSize: '7.8pt',
                      lineHeight: 1.4,
                      color: '#475569',
                      textAlign: 'right',
                    }}
                  >
                    <div>
                      {isEn ? 'Ref' : 'Ruj'}: {docRefNumber}
                    </div>
                    <div>
                      {T.dateMetaLabel}: {formData.tarikhMula} — {formData.tarikhAkhir}
                    </div>
                  </div>
                  {branding.clientLogoDataUrl && (
                    <img
                      src={branding.clientLogoDataUrl}
                      alt={formData.namaSyarikat}
                      style={{
                        height: '34px',
                        width: 'auto',
                        objectFit: 'contain',
                        borderLeft: '1px solid #cbd5e1',
                        paddingLeft: '8px',
                      }}
                    />
                  )}
                </div>
              </div>

              {!failedImages.cover ? (
                <div
                  style={{
                    width: '100%',
                    height: '46mm',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #cbd5e1',
                    marginBottom: '12px',
                    backgroundColor: '#002147',
                  }}
                >
                  <img
                    src={COVER_IMAGE_PATH}
                    alt={formData.namaProgram}
                    referrerPolicy="no-referrer"
                    onError={() => markImageFailed('cover')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '24mm',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #002147 0%, #0a2f5c 100%)',
                    marginBottom: '12px',
                  }}
                />
              )}

              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <h1>{T.proposalTitle}</h1>
                <h2 className="doc-subtitle">
                  {T.programHandling} &ldquo;{formData.namaProgram}&rdquo;
                </h2>
                <div
                  style={{
                    fontFamily: ARIAL_FONT,
                    fontSize: '10.2pt',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: '#334155',
                    marginTop: '4px',
                  }}
                >
                  {T.proposalFor} {formData.namaSyarikat.toUpperCase()}
                </div>
                <div
                  style={{
                    fontFamily: ARIAL_FONT,
                    fontSize: '8.2pt',
                    lineHeight: 1.35,
                    color: '#64748b',
                    marginTop: '2px',
                  }}
                >
                  {formData.sektorOrganisasi} · {formData.tahapPeserta}
                </div>
              </div>

              <ExecutiveSnapshotStrip
                language={lang}
                days={formData.bilanganHari}
                participants={formData.bilanganPeserta}
                venue={UI.venueOptions[formData.lokasiProgram]}
                totalBudget={budget.grandTotal}
              />

              <h2 className="section-heading" style={{ marginTop: '10px' }}>
                {T.introTitle}
              </h2>
              <RefineBar
                section="pengenalan"
                language={lang}
                refiningSection={refiningSection}
                onRefine={onRefineSection}
              />

              {isEditMode ? (
                <textarea
                  value={aiContent.pengenalan}
                  onChange={(e) => onUpdateAiContent({ ...aiContent, pengenalan: e.target.value })}
                  rows={7}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontFamily: ARIAL_FONT,
                    fontSize: '9.5pt',
                    lineHeight: 1.48,
                    border: '1px solid #94a3b8',
                    borderRadius: '4px',
                    backgroundColor: '#f8fafc',
                    color: '#111827',
                  }}
                />
              ) : (
                introParagraphs.map((para, i) => (
                  <p key={i} className="prose-paragraph">
                    {para}
                  </p>
                ))
              )}
            </div>

            <PageFooter
              companyBrand={branding.companyName}
              language={lang}
              pageNumber={pageOffset + 1}
              totalPages={totalPages}
            />
          </section>

          {/* ========================================================== */}
          {/* PAGE 2: 2.0 OBJECTIVES + 3.0 METHODOLOGY + 4.0 OUTCOMES    */}
          {/* ========================================================== */}
          <section className="a4-page">
            <div className="a4-page-body">
              <RunningHeader
                companyBrand={branding.companyName}
                programName={formData.namaProgram}
                clientName={formData.namaSyarikat}
              />

              <h2 className="section-heading" style={{ marginTop: 0 }}>
                {T.objectivesTitle}
              </h2>
              <RefineBar
                section="objektif"
                language={lang}
                refiningSection={refiningSection}
                onRefine={onRefineSection}
              />
              <p className="prose-paragraph">{T.objectivesIntro}</p>
              <ol>
                {aiContent.objektif.map((item, idx) => (
                  <li key={idx}>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem('objektif', idx, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '3px 6px',
                          fontFamily: ARIAL_FONT,
                          fontSize: '9.3pt',
                          border: '1px solid #94a3b8',
                          borderRadius: '4px',
                          backgroundColor: '#f8fafc',
                          color: '#111827',
                        }}
                      />
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ol>

              <h2 className="section-heading">{T.methodsTitle}</h2>
              <RefineBar
                section="kaedah"
                language={lang}
                refiningSection={refiningSection}
                onRefine={onRefineSection}
              />
              <p className="prose-paragraph">{T.methodsIntro}</p>
              <ol>
                {aiContent.kaedah.map((item, idx) => (
                  <li key={idx}>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem('kaedah', idx, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '3px 6px',
                          fontFamily: ARIAL_FONT,
                          fontSize: '9.3pt',
                          border: '1px solid #94a3b8',
                          borderRadius: '4px',
                          backgroundColor: '#f8fafc',
                          color: '#111827',
                        }}
                      />
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ol>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.05fr 0.95fr',
                  gap: '12px',
                  alignItems: 'stretch',
                  marginTop: '8px',
                  marginBottom: '10px',
                }}
              >
                <BlendedLearningInfographic language={lang} />
                {!failedImages.workshop ? (
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                    }}
                  >
                    <img
                      src={WORKSHOP_IMAGE_PATH}
                      alt={isEn ? 'Interactive Workshop' : 'Bengkel Interaktif'}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed('workshop')}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                    }}
                  />
                )}
              </div>

              <h2 className="section-heading">{T.outcomesTitle}</h2>
              <RefineBar
                section="hasil"
                language={lang}
                refiningSection={refiningSection}
                onRefine={onRefineSection}
              />
              <p className="prose-paragraph">{T.outcomesIntro}</p>
              <ol>
                {aiContent.hasil.map((item, idx) => (
                  <li key={idx}>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem('hasil', idx, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '3px 6px',
                          fontFamily: ARIAL_FONT,
                          fontSize: '9.3pt',
                          border: '1px solid #94a3b8',
                          borderRadius: '4px',
                          backgroundColor: '#f8fafc',
                          color: '#111827',
                        }}
                      />
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <PageFooter
              companyBrand={branding.companyName}
              language={lang}
              pageNumber={pageOffset + 2}
              totalPages={totalPages}
            />
          </section>

          {/* ========================================================== */}
          {/* PAGE 3: 5.0 MODULES + ROADMAP INFOGRAPHIC + IMPACT VISUAL  */}
          {/* ========================================================== */}
          <section className="a4-page">
            <div className="a4-page-body">
              <RunningHeader
                companyBrand={branding.companyName}
                programName={formData.namaProgram}
                clientName={formData.namaSyarikat}
              />

              <h2 className="section-heading" style={{ marginTop: 0 }}>
                {T.modulesTitle}
              </h2>
              <RefineBar
                section="modul"
                language={lang}
                refiningSection={refiningSection}
                onRefine={onRefineSection}
              />

              <ModuleRoadmapInfographic language={lang} modules={aiContent.modul} />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                {aiContent.modul.map((mod, modIdx) => (
                  <div
                    key={modIdx}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: ARIAL_FONT,
                        fontSize: '9.4pt',
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: '#002147',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '5px',
                        marginBottom: '6px',
                      }}
                    >
                      {T.module} {modIdx + 1}:{' '}
                      {isEditMode ? (
                        <input
                          type="text"
                          value={mod.namaModul}
                          onChange={(e) => updateModuleTitle(modIdx, e.target.value)}
                          style={{
                            width: '100%',
                            marginTop: '3px',
                            padding: '2px 5px',
                            fontFamily: ARIAL_FONT,
                            fontSize: '9pt',
                            fontWeight: 700,
                            border: '1px solid #94a3b8',
                            borderRadius: '4px',
                            backgroundColor: '#f8fafc',
                            color: '#111827',
                          }}
                        />
                      ) : (
                        mod.namaModul
                      )}
                    </div>
                    <ol style={{ marginBottom: 0 }}>
                      {mod.pecahanTajuk.map((topic, topicIdx) => (
                        <li key={topicIdx} style={{ fontSize: '8.9pt', lineHeight: 1.42 }}>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={topic}
                              onChange={(e) => updateModuleTopic(modIdx, topicIdx, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '2px 5px',
                                fontFamily: ARIAL_FONT,
                                fontSize: '8.8pt',
                                border: '1px solid #94a3b8',
                                borderRadius: '4px',
                                backgroundColor: '#f8fafc',
                                color: '#111827',
                              }}
                            />
                          ) : (
                            topic
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '170px 1fr',
                  gap: '14px',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '11px 13px',
                  backgroundColor: '#f8fafc',
                }}
              >
                {!failedImages.growth ? (
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '5px',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={GROWTH_IMAGE_PATH}
                      alt={isEn ? 'Strategic Growth' : 'Pertumbuhan Strategik'}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed('growth')}
                      style={{
                        width: '100%',
                        height: '108px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: '108px',
                      backgroundColor: '#ffffff',
                      borderRadius: '5px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div
                    style={{
                      fontFamily: ARIAL_FONT,
                      fontSize: '9.4pt',
                      fontWeight: 700,
                      lineHeight: 1.35,
                      color: '#002147',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isEn
                      ? `${branding.companyName} Training Delivery Standard`
                      : `Piawaian Penyampaian Latihan ${branding.companyName}`}
                  </div>
                  <p style={{ fontSize: '8.9pt', color: '#334155', margin: 0, lineHeight: 1.45 }}>
                    {isEn
                      ? 'Every module integrates pre-training alignment, hands-on workplace templates, and post-session action commitments so learning transfers directly into daily execution.'
                      : 'Setiap modul menggabungkan penyesuaian konteks organisasi, templat kerja praktikal, dan komitmen pelan tindakan selepas kursus bagi memastikan pemindahan ilmu terus kepada prestasi tugas harian.'}
                  </p>
                  <div
                    className="num-cell"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid #cbd5e1',
                      fontSize: '8pt',
                      lineHeight: 1.35,
                      color: '#002147',
                      fontWeight: 700,
                    }}
                  >
                    <div>30% {isEn ? 'Concept' : 'Konsep'}</div>
                    <div>40% {isEn ? 'Simulation' : 'Simulasi'}</div>
                    <div>30% {isEn ? 'Action Plan' : 'Pelan Kerja'}</div>
                  </div>
                </div>
              </div>
            </div>

            <PageFooter
              companyBrand={branding.companyName}
              language={lang}
              pageNumber={pageOffset + 3}
              totalPages={totalPages}
            />
          </section>

          {/* ========================================================== */}
          {/* PAGES 4..K: 6.0 TENTATIVE SCHEDULE (HEIGHT-SAFE PAGINATION) */}
          {/* ========================================================== */}
          {tentativeChunks.map((dayChunk, chunkIdx) => {
            const pageNum = pageOffset + 4 + chunkIdx;
            return (
              <section key={chunkIdx} className="a4-page">
                <div className="a4-page-body">
                  <RunningHeader
                    companyBrand={branding.companyName}
                    programName={formData.namaProgram}
                    clientName={formData.namaSyarikat}
                  />

                  <h2 className="section-heading" style={{ marginTop: 0 }}>
                    {T.tentativeTitle}
                    {chunkIdx > 0 ? (isEn ? ' (CONTINUED)' : ' (SAMBUNGAN)') : ''}
                  </h2>

                  {isEditMode && chunkIdx === 0 && aiContent.customTentative && (
                    <div
                      className="no-print"
                      data-html2canvas-ignore="true"
                      style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}
                    >
                      <button
                        type="button"
                        onClick={resetTentativeToAuto}
                        style={{
                          fontFamily: ARIAL_FONT,
                          fontSize: '7.5pt',
                          fontWeight: 600,
                          color: '#002147',
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '2px 7px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <RotateCcw className="h-3 w-3" />
                        {isEn ? 'Sync with Modules' : 'Segerak dari Modul'}
                      </button>
                    </div>
                  )}

                  {dayChunk.map((day) => (
                    <div key={day.dayNumber} style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}
                      >
                        <h3 className="sub-heading">
                          {T.day} {day.dayNumber} ({day.formattedDate})
                        </h3>
                        {isEditMode && (
                          <button
                            type="button"
                            data-html2canvas-ignore="true"
                            onClick={() => addTentativeRow(day.dayNumber)}
                            className="no-print"
                            style={{
                              fontFamily: ARIAL_FONT,
                              fontSize: '7.5pt',
                              fontWeight: 600,
                              color: '#002147',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Plus className="h-3 w-3" />
                            {isEn ? 'Add Slot' : 'Tambah Slot'}
                          </button>
                        )}
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>{T.time}</th>
                            <th style={{ width: isEditMode ? '62%' : '70%' }}>{T.activity}</th>
                            {isEditMode && (
                              <th
                                className="no-print"
                                data-html2canvas-ignore="true"
                                style={{ width: '8%' }}
                              >
                                &nbsp;
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {day.rows.map((row, rowIdx) => (
                            <tr
                              key={rowIdx}
                              style={{
                                backgroundColor: rowIdx % 2 === 1 ? '#f8fafc' : '#ffffff',
                              }}
                            >
                              <td className="num-cell" style={{ whiteSpace: 'nowrap' }}>
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    value={row.time}
                                    onChange={(e) =>
                                      updateTentativeRow(
                                        day.dayNumber,
                                        rowIdx,
                                        'time',
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      width: '100%',
                                      padding: '2px 4px',
                                      fontFamily: ARIAL_FONT,
                                      fontSize: '8.5pt',
                                      border: '1px solid #94a3b8',
                                      borderRadius: '3px',
                                    }}
                                  />
                                ) : (
                                  row.time
                                )}
                              </td>
                              <td>
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    value={row.activity}
                                    onChange={(e) =>
                                      updateTentativeRow(
                                        day.dayNumber,
                                        rowIdx,
                                        'activity',
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      width: '100%',
                                      padding: '2px 4px',
                                      fontFamily: ARIAL_FONT,
                                      fontSize: '8.5pt',
                                      border: '1px solid #94a3b8',
                                      borderRadius: '3px',
                                    }}
                                  />
                                ) : (
                                  row.activity
                                )}
                              </td>
                              {isEditMode && (
                                <td
                                  className="no-print"
                                  data-html2canvas-ignore="true"
                                  style={{ textAlign: 'center' }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => removeTentativeRow(day.dayNumber, rowIdx)}
                                    title="Padam"
                                    style={{
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#dc2626',
                                      cursor: 'pointer',
                                      padding: '2px',
                                    }}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>

                <PageFooter
                  companyBrand={branding.companyName}
                  language={lang}
                  pageNumber={pageNum}
                  totalPages={totalPages}
                />
              </section>
            );
          })}

          {/* ========================================================== */}
          {/* OPTIONAL SHEET: HRD CORP COMPLIANCE & PACKAGE COMPARISON   */}
          {/* ========================================================== */}
          {hasHrdOrPackagePage && (
            <section className="a4-page">
              <div className="a4-page-body">
                <RunningHeader
                  companyBrand={branding.companyName}
                  programName={formData.namaProgram}
                  clientName={formData.namaSyarikat}
                />

                {formData.sertakanHrdCorp && (
                  <div style={{ marginBottom: '16px' }}>
                    <h2 className="section-heading" style={{ marginTop: 0 }}>
                      {T.hrdCorpTitle}
                    </h2>
                    <RefineBar
                      section="hrdCorpNotes"
                      language={lang}
                      refiningSection={refiningSection}
                      onRefine={onRefineSection}
                    />

                    {isEditMode ? (
                      <textarea
                        value={hrdText}
                        onChange={(e) =>
                          onUpdateAiContent({ ...aiContent, hrdCorpNotes: e.target.value })
                        }
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '8px',
                          fontFamily: ARIAL_FONT,
                          fontSize: '9.5pt',
                          border: '1px solid #94a3b8',
                          borderRadius: '4px',
                          backgroundColor: '#f8fafc',
                          marginBottom: '10px',
                        }}
                      />
                    ) : (
                      <p className="prose-paragraph">{hrdText}</p>
                    )}

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px',
                        marginTop: '10px',
                      }}
                    >
                      {[
                        {
                          title: isEn ? '1. Pre-Course Diagnostic' : '1. Penilaian Pra-Kursus',
                          desc: isEn
                            ? 'Baseline competency check before Session 1 to calibrate real workplace gaps.'
                            : 'Ujian diagnostik awal sebelum Sesi 1 bagi mengukur tahap kompetensi asas peserta.',
                        },
                        {
                          title: isEn ? '2. HRD Corp SBL-Khas' : '2. Pematuhan HRD Corp',
                          desc: isEn
                            ? 'Delivered by certified TTT trainers with full attendance logs & grant documentation.'
                            : 'Jurulatih bertauliah TTT dengan rekod kehadiran, silibus, dan dokumen tuntutan lengkap.',
                        },
                        {
                          title: isEn ? '3. Post-Course Report' : '3. Laporan Impak Pasca-Kursus',
                          desc: isEn
                            ? 'Quantitative post-test comparison and Kirkpatrick Level 1–2 evaluation report.'
                            : 'Analisis perbandingan skor pasca-kursus serta laporan penilaian prestasi peserta.',
                        },
                      ].map((card) => (
                        <div
                          key={card.title}
                          style={{
                            border: '1px solid #cbd5e1',
                            borderTop: '3px solid #002147',
                            borderRadius: '5px',
                            padding: '9px 10px',
                            backgroundColor: '#f8fafc',
                          }}
                        >
                          <div
                            style={{
                              fontFamily: ARIAL_FONT,
                              fontSize: '8.5pt',
                              fontWeight: 700,
                              lineHeight: 1.35,
                              color: '#002147',
                              marginBottom: '4px',
                            }}
                          >
                            {card.title}
                          </div>
                          <div
                            style={{
                              fontFamily: ARIAL_FONT,
                              fontSize: '8pt',
                              color: '#334155',
                              lineHeight: 1.4,
                            }}
                          >
                            {card.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.sertakanPerbandinganPakej && (
                  <div>
                    <h2
                      className="section-heading"
                      style={{ marginTop: formData.sertakanHrdCorp ? '12px' : 0 }}
                    >
                      {T.packageComparisonTitle}
                    </h2>
                    <p className="prose-paragraph">
                      {isEn
                        ? 'To provide budget flexibility, below is a transparent tier comparison across venue arrangements for the same core curriculum:'
                        : 'Bagi memberikan fleksibiliti belanjawan kepada pihak pengurusan, berikut adalah perbandingan pilihan pakej pelaksanaan mengikut kesesuaian lokasi:'}
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: '21%' }}>
                            {isEn ? 'Tier / Package' : 'Pilihan Pakej'}
                          </th>
                          <th style={{ width: '17%' }}>{isEn ? 'Venue' : 'Lokasi'}</th>
                          <th style={{ width: '34%' }}>
                            {isEn ? 'Inclusions' : 'Skop & Kemudahan'}
                          </th>
                          <th style={{ width: '13%' }}>{isEn ? 'Per Pax' : 'Per Peserta'}</th>
                          <th style={{ width: '15%' }}>{isEn ? 'Total' : 'Jumlah'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packageTiers.map((tier, idx) => (
                          <tr
                            key={tier.name}
                            style={{
                              backgroundColor: tier.recommended
                                ? '#fefce8'
                                : idx % 2 === 1
                                ? '#f8fafc'
                                : '#ffffff',
                            }}
                          >
                            <td style={{ fontWeight: 700, color: '#002147' }}>
                              {tier.name}
                              {tier.recommended && (
                                <div
                                  style={{
                                    fontSize: '7pt',
                                    color: '#b08d26',
                                    fontWeight: 700,
                                    marginTop: '2px',
                                  }}
                                >
                                  ★ {isEn ? 'RECOMMENDED' : 'DISYORKAN'}
                                </div>
                              )}
                            </td>
                            <td>{tier.venue}</td>
                            <td style={{ fontSize: '8.5pt' }}>{tier.includes}</td>
                            <td
                              className="num-cell"
                              style={{ textAlign: 'right', whiteSpace: 'nowrap' }}
                            >
                              {formatRM(tier.pricePerPax)}
                            </td>
                            <td
                              className="num-cell"
                              style={{
                                textAlign: 'right',
                                fontWeight: 700,
                                color: '#002147',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {formatRM(tier.totalPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <PageFooter
                companyBrand={branding.companyName}
                language={lang}
                pageNumber={hrdPackagePageNum}
                totalPages={totalPages}
              />
            </section>
          )}

          {/* ========================================================== */}
          {/* COST (7.0) (+ CONCLUSION 8.0 IF FITS ON SAME A4 SHEET)     */}
          {/* ========================================================== */}
          <section className="a4-page">
            <div className="a4-page-body">
              <RunningHeader
                companyBrand={branding.companyName}
                programName={formData.namaProgram}
                clientName={formData.namaSyarikat}
              />

              <h2 className="section-heading" style={{ marginTop: 0 }}>
                {T.costTitle}
              </h2>
              <p className="prose-paragraph">{T.costIntro}</p>

              <BudgetDonutInfographic
                language={lang}
                speakerFee={budget.feePenceramah}
                packageCost={budget.jumlahKosPakejDanLogistik}
                contingency={budget.kontigensi}
                totalBudget={budget.grandTotal}
              />

              <table>
                <thead>
                  <tr>
                    <th style={{ width: '7%' }}>{T.bilHeader}</th>
                    <th style={{ width: '38%' }}>{T.item}</th>
                    <th style={{ width: '33%' }}>{T.calculation}</th>
                    <th style={{ width: '22%' }}>{T.totalRM}</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.lines.map((line, idx) => (
                    <tr
                      key={line.id}
                      style={{ backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}
                    >
                      <td className="num-cell" style={{ textAlign: 'center' }}>
                        {idx + 1}
                      </td>
                      <td>{line.description}</td>
                      <td className="num-cell">{line.calculationNote}</td>
                      <td className="num-cell" style={{ textAlign: 'right' }}>
                        {formatRM(line.amount)}
                      </td>
                    </tr>
                  ))}

                  {(budget.discountAmount > 0 || budget.sstAmount > 0) && (
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
                      <td colSpan={3} style={{ textAlign: 'right' }}>
                        {T.subTotalLabel}
                      </td>
                      <td className="num-cell" style={{ textAlign: 'right' }}>
                        {formatRM(budget.subTotal)}
                      </td>
                    </tr>
                  )}

                  {budget.discountAmount > 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        style={{ textAlign: 'right', color: '#047857', fontWeight: 600 }}
                      >
                        {T.discountLabel} ({formData.diskaunPeratus}%)
                      </td>
                      <td
                        className="num-cell"
                        style={{ textAlign: 'right', color: '#047857', fontWeight: 600 }}
                      >
                        -{formatRM(budget.discountAmount)}
                      </td>
                    </tr>
                  )}

                  {budget.sstAmount > 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'right' }}>
                        {T.sstLabel}
                      </td>
                      <td className="num-cell" style={{ textAlign: 'right' }}>
                        {formatRM(budget.sstAmount)}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        textAlign: 'right',
                        fontWeight: 800,
                        backgroundColor: '#002147',
                        color: '#ffffff',
                        borderColor: '#002147',
                      }}
                    >
                      {T.totalBudgetLabel}
                    </td>
                    <td
                      className="num-cell"
                      style={{
                        textAlign: 'right',
                        fontWeight: 800,
                        backgroundColor: '#002147',
                        color: '#D4AF37',
                        borderColor: '#002147',
                      }}
                    >
                      {formatRM(budget.grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p
                style={{
                  fontSize: '8pt',
                  marginTop: '4px',
                  fontStyle: 'italic',
                  color: '#475569',
                }}
              >
                {T.costNote}
              </p>

              {!splitCostAndConclusion && renderConclusionBlock(false)}
            </div>

            <PageFooter
              companyBrand={branding.companyName}
              language={lang}
              pageNumber={costPageNum}
              totalPages={totalPages}
            />
          </section>

          {/* ========================================================== */}
          {/* OPTIONAL DEDICATED CONCLUSION (8.0) PAGE WHEN NEEDED       */}
          {/* ========================================================== */}
          {splitCostAndConclusion && (
            <section className="a4-page">
              <div className="a4-page-body">
                <RunningHeader
                  companyBrand={branding.companyName}
                  programName={formData.namaProgram}
                  clientName={formData.namaSyarikat}
                />
                {renderConclusionBlock(true)}
              </div>
              <PageFooter
                companyBrand={branding.companyName}
                language={lang}
                pageNumber={conclusionPageNum}
                totalPages={totalPages}
              />
            </section>
          )}

          {/* ========================================================== */}
          {/* OPTIONAL SHEET: OFFICIAL QUOTATION (SEBUT HARGA RASMI)     */}
          {/* ========================================================== */}
          {hasQuotationPage && (
            <section className="a4-page">
              <div className="a4-page-body" style={{ fontFamily: ARIAL_FONT }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '2.5px solid #002147',
                    paddingBottom: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!failedImages.logo && (
                      <img
                        src={LOGO_IMAGE_PATH}
                        alt={branding.companyName}
                        referrerPolicy="no-referrer"
                        onError={() => markImageFailed('logo')}
                        style={{ height: '46px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
                      />
                    )}
                    <div>
                      <div
                        style={{
                          fontSize: '12pt',
                          fontWeight: 700,
                          lineHeight: 1.3,
                          color: '#002147',
                        }}
                      >
                        {branding.companyName.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '7.8pt', lineHeight: 1.4, color: '#475569' }}>
                        {branding.regNo} · {branding.address}
                      </div>
                      <div style={{ fontSize: '7.8pt', lineHeight: 1.4, color: '#475569' }}>
                        {branding.phone} · {branding.email}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#002147',
                      color: '#D4AF37',
                      padding: '8px 14px',
                      borderRadius: '5px',
                      fontSize: '11pt',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      lineHeight: 1.25,
                    }}
                  >
                    {isEn ? 'QUOTATION' : 'SEBUT HARGA'}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr',
                    gap: '14px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    backgroundColor: '#f8fafc',
                    marginBottom: '14px',
                    fontSize: '9pt',
                    lineHeight: 1.45,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '7.5pt', fontWeight: 700, color: '#64748b' }}>
                      {isEn ? 'QUOTATION TO:' : 'KEPADA:'}
                    </div>
                    <div style={{ fontWeight: 700, color: '#002147', marginTop: '2px' }}>
                      {formData.namaSyarikat}
                    </div>
                    {formData.namaPenerimaSurat && <div>Attn: {formData.namaPenerimaSurat}</div>}
                    <div style={{ color: '#475569', fontSize: '8.5pt', marginTop: '2px' }}>
                      {formData.namaProgram} ({formData.bilanganHari}{' '}
                      {isEn ? 'Days' : 'Hari'}, {formData.bilanganPeserta} {T.paxUnit})
                    </div>
                  </div>
                  <div className="num-cell" style={{ fontSize: '8.5pt', lineHeight: 1.6 }}>
                    <div>
                      <strong>{isEn ? 'Quotation No:' : 'No. Sebut Harga:'}</strong> QTN-
                      {docRefNumber}
                    </div>
                    <div>
                      <strong>{isEn ? 'Issue Date:' : 'Tarikh Dikeluarkan:'}</strong>{' '}
                      {formData.tarikhMula}
                    </div>
                    <div>
                      <strong>{isEn ? 'Validity:' : 'Tempoh Sah:'}</strong> 30{' '}
                      {isEn ? 'Days' : 'Hari'}
                    </div>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '7%' }}>{T.bilHeader}</th>
                      <th style={{ width: '43%' }}>{T.item}</th>
                      <th style={{ width: '28%' }}>{T.calculation}</th>
                      <th style={{ width: '22%' }}>{T.totalRM}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.lines.map((line, idx) => (
                      <tr
                        key={line.id}
                        style={{ backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}
                      >
                        <td className="num-cell" style={{ textAlign: 'center' }}>
                          {idx + 1}
                        </td>
                        <td>{line.description}</td>
                        <td className="num-cell">{line.calculationNote}</td>
                        <td className="num-cell" style={{ textAlign: 'right' }}>
                          {formatRM(line.amount)}
                        </td>
                      </tr>
                    ))}
                    {budget.discountAmount > 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          style={{ textAlign: 'right', color: '#047857', fontWeight: 600 }}
                        >
                          {T.discountLabel} ({formData.diskaunPeratus}%)
                        </td>
                        <td
                          className="num-cell"
                          style={{ textAlign: 'right', color: '#047857', fontWeight: 600 }}
                        >
                          -{formatRM(budget.discountAmount)}
                        </td>
                      </tr>
                    )}
                    {budget.sstAmount > 0 && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'right' }}>
                          {T.sstLabel}
                        </td>
                        <td className="num-cell" style={{ textAlign: 'right' }}>
                          {formatRM(budget.sstAmount)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: 'right',
                          fontWeight: 800,
                          backgroundColor: '#002147',
                          color: '#ffffff',
                          borderColor: '#002147',
                        }}
                      >
                        {T.totalBudgetLabel}
                      </td>
                      <td
                        className="num-cell"
                        style={{
                          textAlign: 'right',
                          fontWeight: 800,
                          backgroundColor: '#002147',
                          color: '#D4AF37',
                          borderColor: '#002147',
                        }}
                      >
                        {formatRM(budget.grandTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    backgroundColor: '#f8fafc',
                    marginTop: '12px',
                    fontSize: '8.5pt',
                    color: '#334155',
                    lineHeight: 1.55,
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#002147', marginBottom: '4px' }}>
                    {isEn ? 'TERMS & CONDITIONS:' : 'TERMA & SYARAT PEMBAYARAN:'}
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '16px' }}>
                    <li style={{ fontSize: '8.3pt' }}>
                      {isEn
                        ? 'Confirmation requires an official Local Order (LO) / Purchase Order (PO) or 50% booking deposit 14 days prior to training.'
                        : 'Pengesahan penganjuran memerlukan Pesanan Kerajaan (LO) / Pesanan Belian (PO) atau deposit pengesahan 50% selewat-lewatnya 14 hari sebelum kursus.'}
                    </li>
                    <li style={{ fontSize: '8.3pt' }}>
                      {isEn
                        ? 'Remaining balance is payable within 14 days upon completion of the program and submission of invoice/report.'
                        : 'Baki bayaran hendaklah dijelaskan dalam tempoh 14 hari selepas program tamat dan invois rasmi dikemukakan.'}
                    </li>
                    <li style={{ fontSize: '8.3pt' }}>
                      {isEn
                        ? 'This quotation is valid for 30 calendar days from the date of issue.'
                        : 'Sebut harga ini sah laku selama 30 hari dari tarikh dokumen dikeluarkan.'}
                    </li>
                  </ol>
                </div>

                <SignOffSignatureBlock
                  preparedByText={isEn ? 'Issued by,' : 'Disediakan & Disahkan oleh,'}
                  branding={branding}
                />
              </div>

              <PageFooter
                companyBrand={branding.companyName}
                language={lang}
                pageNumber={quotationPageNum}
                totalPages={totalPages}
              />
            </section>
          )}

          {/* ========================================================== */}
          {/* OPTIONAL SHEET: LEAD TRAINER PROFILE / CV                  */}
          {/* ========================================================== */}
          {hasTrainerCvPage && (
            <section className="a4-page">
              <div className="a4-page-body" style={{ fontFamily: ARIAL_FONT }}>
                <RunningHeader
                  companyBrand={branding.companyName}
                  programName={formData.namaProgram}
                  clientName={formData.namaSyarikat}
                />

                <h2 className="section-heading" style={{ marginTop: 0 }}>
                  {T.trainerCvTitle}
                </h2>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '14px',
                    backgroundColor: '#f8fafc',
                    marginBottom: '16px',
                  }}
                >
                  {trainerProfile.photoDataUrl ? (
                    <img
                      src={trainerProfile.photoDataUrl}
                      alt={trainerProfile.name}
                      style={{
                        width: '88px',
                        height: '88px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '2px solid #002147',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '88px',
                        height: '88px',
                        borderRadius: '6px',
                        backgroundColor: '#002147',
                        color: '#D4AF37',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20pt',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {trainerProfile.name
                        .split(' ')
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '12.5pt', fontWeight: 700, lineHeight: 1.3, color: '#002147' }}>
                      {trainerProfile.name}
                    </div>
                    <div
                      style={{
                        fontSize: '9.5pt',
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: '#b08d26',
                        marginTop: '3px',
                      }}
                    >
                      {trainerProfile.title}
                    </div>
                    <div
                      style={{
                        fontSize: '8.5pt',
                        lineHeight: 1.35,
                        color: '#475569',
                        marginTop: '4px',
                      }}
                    >
                      {branding.companyName} · {branding.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '11px 13px',
                    }}
                  >
                    <h3 className="sub-heading" style={{ marginTop: 0 }}>
                      {isEn
                        ? 'ACADEMIC QUALIFICATIONS & CERTIFICATIONS'
                        : 'KELAYAKAN AKADEMIK & PENTAULIAHAN'}
                    </h3>
                    <p className="prose-paragraph" style={{ marginBottom: 0 }}>
                      {trainerProfile.qualifications}
                    </p>
                  </div>

                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '11px 13px',
                    }}
                  >
                    <h3 className="sub-heading" style={{ marginTop: 0 }}>
                      {isEn ? 'CORE AREAS OF EXPERTISE' : 'BIDANG KEPAKARAN UTAMA'}
                    </h3>
                    <p className="prose-paragraph" style={{ marginBottom: 0 }}>
                      {trainerProfile.expertise}
                    </p>
                  </div>

                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '11px 13px',
                    }}
                  >
                    <h3 className="sub-heading" style={{ marginTop: 0 }}>
                      {isEn
                        ? 'NOTABLE CORPORATE & GOVERNMENT CLIENTS'
                        : 'REKOD KLIEN KORPORAT & AGENSI TERDAHULU'}
                    </h3>
                    <p className="prose-paragraph" style={{ marginBottom: 0 }}>
                      {trainerProfile.pastClients}
                    </p>
                  </div>
                </div>
              </div>

              <PageFooter
                companyBrand={branding.companyName}
                language={lang}
                pageNumber={trainerCvPageNum}
                totalPages={totalPages}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

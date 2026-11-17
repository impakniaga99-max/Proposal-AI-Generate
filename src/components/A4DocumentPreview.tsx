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
} from 'lucide-react';
import type { AIProposalContent, Language, ProposalFormData } from '../types/proposal';
import { docLabels, uiLabels } from '../lib/i18n';
import {
  buildTentativeSchedule,
  calculateBudgetSummary,
  formatRM,
  type TentativeDay,
} from '../lib/proposalUtils';
import {
  BlendedLearningInfographic,
  BudgetDonutInfographic,
  ExecutiveSnapshotStrip,
  ModuleRoadmapInfographic,
} from './ProposalInfographics';

interface A4DocumentPreviewProps {
  formData: ProposalFormData;
  aiContent: AIProposalContent;
  onUpdateAiContent: (updated: AIProposalContent) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onSaveDraft: () => void;
  justSavedDraft: boolean;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  documentRef: React.RefObject<HTMLDivElement | null>;
}

const COVER_IMAGE_PATH = '/src/assets/images/proposal_cover_training_1794896623243.jpg';
const WORKSHOP_IMAGE_PATH = '/src/assets/images/proposal_workshop_collab_1794896622483.jpg';
const GROWTH_IMAGE_PATH = '/src/assets/images/proposal_impact_growth_1794896622888.jpg';
const LOGO_IMAGE_PATH = '/src/assets/images/impak_niaga_logo_1794895342738.jpg';

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

const RunningHeader: React.FC<{ programName: string; companyName: string }> = ({
  programName,
  companyName,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '7px',
      marginBottom: '12px',
      borderBottom: '1px solid #cbd5e1',
      fontSize: '7.5pt',
      color: '#64748b',
    }}
  >
    <span style={{ fontWeight: 700, color: '#002147', letterSpacing: '0.04em' }}>
      IMPAK NIAGA
    </span>
    <span style={{ maxWidth: '72%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {programName} · {companyName}
    </span>
  </div>
);

const PageFooter: React.FC<{
  language: Language;
  pageNumber: number;
  totalPages: number;
}> = ({ language, pageNumber, totalPages }) => (
  <div
    className="num-cell"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '8px',
      marginTop: '12px',
      borderTop: '1px solid #e2e8f0',
      fontSize: '7.5pt',
      color: '#64748b',
    }}
  >
    <span>Impak Niaga · {language === 'english' ? 'Corporate Training Proposal' : 'Kertas Kerja Cadangan Korporat'}</span>
    <span>
      {language === 'english'
        ? `Page ${pageNumber} of ${totalPages}`
        : `Muka Surat ${pageNumber} daripada ${totalPages}`}
    </span>
  </div>
);

export const A4DocumentPreview: React.FC<A4DocumentPreviewProps> = ({
  formData,
  aiContent,
  onUpdateAiContent,
  isEditMode,
  onToggleEditMode,
  onSaveDraft,
  justSavedDraft,
  onExportPdf,
  isExportingPdf,
  documentRef,
}) => {
  const lang = formData.bahasa;
  const UI = uiLabels[lang];
  const T = docLabels[lang];

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const markImageFailed = (key: string) =>
    setFailedImages((prev) => ({ ...prev, [key]: true }));

  const budget = calculateBudgetSummary(
    formData.bilanganHari,
    formData.bilanganPeserta,
    formData.bajetPerPeserta
  );
  const tentativeDays = buildTentativeSchedule(
    formData.tarikhMula,
    formData.bilanganHari,
    formData.sesiMalamAktif,
    lang
  );

  const tentativeChunks: TentativeDay[][] = chunkArray(tentativeDays, 2);
  // Total pages: Page 1 (Cover+Intro), Page 2 (Obj+Methods+Outcomes), Page 3 (Modules+Growth), Pages 4..(3+chunks) (Tentative), Final Page (Cost+Conclusion)
  const totalPages = 4 + tentativeChunks.length;

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

  const speakerCalc =
    lang === 'english'
      ? `RM 3,500/day × ${formData.bilanganHari} ${formData.bilanganHari > 1 ? 'days' : 'day'}`
      : `RM 3,500/hari × ${formData.bilanganHari} hari`;

  const introParagraphs = aiContent.pengenalan
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const conclusionParagraphs = aiContent.penutup
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Document Control Toolbar */}
      <div className="no-print bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{UI.docReadyTitle}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono tabular-nums">
            <span>
              {totalPages} {lang === 'english' ? 'A4 Pages' : 'Helaian A4'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {formData.bilanganHari} {lang === 'english' ? 'Days' : 'Hari'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {formData.bilanganPeserta} {T.paxUnit}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">{formatRM(budget.totalBajetKutipan)}</span>
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
          {/* PAGE 1: LETTERHEAD + COVER BANNER + SNAPSHOT + 1.0 INTRO   */}
          {/* ========================================================== */}
          <section className="a4-page">
            <div className="a4-page-body">
              {/* Executive Letterhead */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  marginBottom: '14px',
                  borderBottom: '2px solid #D4AF37',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {!failedImages.logo && (
                    <img
                      src={LOGO_IMAGE_PATH}
                      alt="Impak Niaga"
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed('logo')}
                      style={{ height: '36px', width: '36px', objectFit: 'contain' }}
                    />
                  )}
                  <div>
                    <div
                      style={{
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: '12pt',
                        fontWeight: 800,
                        color: '#002147',
                        letterSpacing: '0.04em',
                      }}
                    >
                      IMPAK NIAGA
                    </div>
                    <div style={{ fontSize: '7.8pt', color: '#475569' }}>
                      {lang === 'english'
                        ? 'Corporate Training & Executive Consultancy'
                        : 'Latihan Korporat & Perundingan Eksekutif'}
                    </div>
                  </div>
                </div>
                <div
                  className="num-cell"
                  style={{ fontSize: '8pt', color: '#475569', textAlign: 'right' }}
                >
                  <div>
                    {T.dateMetaLabel}: {formData.tarikhMula} — {formData.tarikhAkhir}
                  </div>
                  <div>
                    {T.venueMetaLabel}: {UI.venueOptions[formData.lokasiProgram]}
                  </div>
                </div>
              </div>

              {/* Cover Hero Photography */}
              {!failedImages.cover ? (
                <div
                  style={{
                    width: '100%',
                    height: '58mm',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #cbd5e1',
                    marginBottom: '14px',
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
                    height: '28mm',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #002147 0%, #0a2f5c 100%)',
                    marginBottom: '14px',
                  }}
                />
              )}

              {/* Proposal Title Block */}
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <h1>{T.proposalTitle}</h1>
                <h2 className="doc-subtitle">
                  {T.programHandling} &ldquo;{formData.namaProgram}&rdquo;
                </h2>
                <div
                  style={{
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    fontSize: '10.5pt',
                    fontWeight: 600,
                    color: '#334155',
                    marginTop: '4px',
                  }}
                >
                  {T.proposalFor} {formData.namaSyarikat.toUpperCase()}
                </div>
              </div>

              {/* Infographic 1: Executive Program Snapshot Strip */}
              <ExecutiveSnapshotStrip
                language={lang}
                days={formData.bilanganHari}
                participants={formData.bilanganPeserta}
                venue={UI.venueOptions[formData.lokasiProgram]}
                totalBudget={budget.totalBajetKutipan}
              />

              {/* 1.0 Introduction */}
              <h2 className="section-heading">{T.introTitle}</h2>
              {isEditMode ? (
                <textarea
                  value={aiContent.pengenalan}
                  onChange={(e) => onUpdateAiContent({ ...aiContent, pengenalan: e.target.value })}
                  rows={7}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '9.8pt',
                    lineHeight: 1.5,
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

            <PageFooter language={lang} pageNumber={1} totalPages={totalPages} />
          </section>

          {/* ========================================================== */}
          {/* PAGE 2: 2.0 OBJECTIVES + 3.0 METHODOLOGY + 4.0 OUTCOMES    */}
          {/* ========================================================== */}
          <section className="a4-page">
            <div className="a4-page-body">
              <RunningHeader
                programName={formData.namaProgram}
                companyName={formData.namaSyarikat}
              />

              {/* 2.0 Objectives */}
              <h2 className="section-heading" style={{ marginTop: 0 }}>
                {T.objectivesTitle}
              </h2>
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
                          fontSize: '9.5pt',
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

              {/* 3.0 Teaching Methods + Blended Infographic + Workshop Illustration */}
              <h2 className="section-heading">{T.methodsTitle}</h2>
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
                          fontSize: '9.5pt',
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

              {/* Visual Pairing: Blended Learning Infographic + Workshop Illustration */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.05fr 0.95fr',
                  gap: '12px',
                  alignItems: 'stretch',
                  marginTop: '10px',
                  marginBottom: '12px',
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
                      alt={lang === 'english' ? 'Interactive Workshop' : 'Bengkel Interaktif'}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed('workshop')}
                      style={{
                        width: '100%',
                        height: '132px',
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

              {/* 4.0 Program Outcomes */}
              <h2 className="section-heading">{T.outcomesTitle}</h2>
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
                          fontSize: '9.5pt',
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

            <PageFooter language={lang} pageNumber={2} totalPages={totalPages} />
          </section>

          {/* ========================================================== */}
          {/* PAGE 3: 5.0 MODULES + ROADMAP INFOGRAPHIC + IMPACT VISUAL  */}
          {/* ========================================================== */}
          <section className="a4-page">
            <div className="a4-page-body">
              <RunningHeader
                programName={formData.namaProgram}
                companyName={formData.namaSyarikat}
              />

              <h2 className="section-heading" style={{ marginTop: 0 }}>
                {T.modulesTitle}
              </h2>

              {/* Infographic 3: 4-Phase Module Roadmap */}
              <ModuleRoadmapInfographic language={lang} modules={aiContent.modul} />

              {/* Clean 2x2 Module Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '14px',
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
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: '9.5pt',
                        fontWeight: 700,
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
                        <li key={topicIdx} style={{ fontSize: '9pt', lineHeight: 1.45 }}>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={topic}
                              onChange={(e) => updateModuleTopic(modIdx, topicIdx, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '2px 5px',
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

              {/* Strategic Growth Illustration & Delivery Guarantee */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '175px 1fr',
                  gap: '14px',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '12px 14px',
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
                      alt={lang === 'english' ? 'Strategic Growth' : 'Pertumbuhan Strategik'}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed('growth')}
                      style={{
                        width: '100%',
                        height: '115px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: '115px',
                      backgroundColor: '#ffffff',
                      borderRadius: '5px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div
                    style={{
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontSize: '9.5pt',
                      fontWeight: 700,
                      color: '#002147',
                      textTransform: 'uppercase',
                    }}
                  >
                    {lang === 'english'
                      ? 'Impak Niaga Training Delivery Standard'
                      : 'Piawaian Penyampaian Latihan Impak Niaga'}
                  </div>
                  <p style={{ fontSize: '9pt', color: '#334155', margin: 0, lineHeight: 1.48 }}>
                    {lang === 'english'
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
                      color: '#002147',
                      fontWeight: 700,
                    }}
                  >
                    <div>30% {lang === 'english' ? 'Concept' : 'Konsep'}</div>
                    <div>40% {lang === 'english' ? 'Simulation' : 'Simulasi'}</div>
                    <div>30% {lang === 'english' ? 'Action Plan' : 'Pelan Kerja'}</div>
                  </div>
                </div>
              </div>
            </div>

            <PageFooter language={lang} pageNumber={3} totalPages={totalPages} />
          </section>

          {/* ========================================================== */}
          {/* PAGES 4..K: 6.0 TENTATIVE SCHEDULE (2 DAYS PER A4 SHEET)   */}
          {/* ========================================================== */}
          {tentativeChunks.map((dayChunk, chunkIdx) => {
            const pageNum = 4 + chunkIdx;
            return (
              <section key={chunkIdx} className="a4-page">
                <div className="a4-page-body">
                  <RunningHeader
                    programName={formData.namaProgram}
                    companyName={formData.namaSyarikat}
                  />

                  <h2 className="section-heading" style={{ marginTop: 0 }}>
                    {T.tentativeTitle}
                    {chunkIdx > 0
                      ? lang === 'english'
                        ? ' (CONTINUED)'
                        : ' (SAMBUNGAN)'
                      : ''}
                  </h2>

                  {dayChunk.map((day) => (
                    <div key={day.dayNumber} style={{ marginBottom: '12px' }}>
                      <h3 className="sub-heading">
                        {T.day} {day.dayNumber} ({day.formattedDate})
                      </h3>
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: '31%' }}>{T.time}</th>
                            <th style={{ width: '69%' }}>{T.activity}</th>
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
                                {row.time}
                              </td>
                              <td>{row.activity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>

                <PageFooter language={lang} pageNumber={pageNum} totalPages={totalPages} />
              </section>
            );
          })}

          {/* ========================================================== */}
          {/* FINAL PAGE: 7.0 COST + DONUT INFOGRAPHIC + 8.0 CONCLUSION  */}
          {/* ========================================================== */}
          <section className="a4-page">
            <div className="a4-page-body">
              <RunningHeader
                programName={formData.namaProgram}
                companyName={formData.namaSyarikat}
              />

              {/* 7.0 Cost Details */}
              <h2 className="section-heading" style={{ marginTop: 0 }}>
                {T.costTitle}
              </h2>
              <p className="prose-paragraph">{T.costIntro}</p>

              {/* Infographic 4: SVG Cost Allocation Donut */}
              <BudgetDonutInfographic
                language={lang}
                speakerFee={budget.feePenceramah}
                packageCost={budget.jumlahKosPakejDanLogistik}
                contingency={budget.kontigensi}
                totalBudget={budget.totalBajetKutipan}
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
                  <tr>
                    <td className="num-cell" style={{ textAlign: 'center' }}>
                      1
                    </td>
                    <td>{T.speakerFee}</td>
                    <td className="num-cell">{speakerCalc}</td>
                    <td className="num-cell" style={{ textAlign: 'right' }}>
                      {formatRM(budget.feePenceramah)}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td className="num-cell" style={{ textAlign: 'center' }}>
                      2
                    </td>
                    <td>{T.pakejLabel}</td>
                    <td>{T.pakejCalc}</td>
                    <td className="num-cell" style={{ textAlign: 'right' }}>
                      {formatRM(budget.jumlahKosPakejDanLogistik)}
                    </td>
                  </tr>
                  <tr>
                    <td className="num-cell" style={{ textAlign: 'center' }}>
                      3
                    </td>
                    <td>{T.contingency}</td>
                    <td>{T.contingencyCalc}</td>
                    <td className="num-cell" style={{ textAlign: 'right' }}>
                      {formatRM(budget.kontigensi)}
                    </td>
                  </tr>
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
                      {formatRM(budget.totalBajetKutipan)}
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

              {/* 8.0 Conclusion */}
              <h2 className="section-heading">{T.conclusionTitle}</h2>
              {isEditMode ? (
                <textarea
                  value={aiContent.penutup}
                  onChange={(e) => onUpdateAiContent({ ...aiContent, penutup: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '9.8pt',
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

              {/* Sign-off Block */}
              <div style={{ marginTop: '24px', fontSize: '9.8pt', color: '#111827' }}>
                <p style={{ marginBottom: '38px' }}>{T.preparedBy}</p>
                <div style={{ borderTop: '1px dotted #334155', width: '215px', paddingTop: '6px' }}>
                  <div style={{ fontWeight: 700, color: '#002147' }}>({T.consultantTitle})</div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>Impak Niaga</div>
                </div>
              </div>
            </div>

            <PageFooter language={lang} pageNumber={totalPages} totalPages={totalPages} />
          </section>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { AIProposalContent, ProposalFormData, SavedProposalDraft } from './types/proposal';
import { getSampleFormData, uiLabels } from './lib/i18n';
import { calculateEndDateIso, getTodayIsoDate } from './lib/proposalUtils';
import { Navbar, type WorkspaceTab } from './components/Navbar';
import { ProposalForm } from './components/ProposalForm';
import { A4DocumentPreview } from './components/A4DocumentPreview';
import { DraftsView } from './components/DraftsView';
import { FormatGuideView } from './components/FormatGuideView';

const DRAFTS_STORAGE_KEY = 'impak_niaga_proposal_drafts_v1';

const A4_PDF_SAFE_CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background-color: #ffffff; color: #111827; font-family: Arial, Helvetica, sans-serif; }
  .a4-page { width: 210mm; min-height: 297mm; padding: 16mm 18mm; margin: 0; background-color: #ffffff; color: #111827; border: none; box-shadow: none; font-family: Arial, Helvetica, sans-serif; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
  .a4-page-body { flex: 1 1 auto; }
  .a4-page h1 { font-family: Arial, Helvetica, sans-serif; font-size: 18pt; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0; color: #002147; line-height: 1.2; text-align: center; letter-spacing: 0.02em; }
  .a4-page h2.doc-subtitle { font-family: Arial, Helvetica, sans-serif; font-size: 12.5pt; font-weight: 700; text-transform: uppercase; margin: 4px 0 3px 0; color: #111827; text-align: center; }
  .a4-page h2.section-heading { font-family: Arial, Helvetica, sans-serif; font-size: 11.5pt; font-weight: 700; text-transform: uppercase; margin-top: 14px; margin-bottom: 7px; border-bottom: 1.5px solid #002147; padding-bottom: 3px; color: #002147; letter-spacing: 0.015em; }
  .a4-page h3.sub-heading { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; font-weight: 700; margin-top: 10px; margin-bottom: 4px; color: #002147; }
  .a4-page p, .a4-page li, .a4-page td { font-family: Arial, Helvetica, sans-serif; font-size: 9.8pt; line-height: 1.5; color: #1f2937; }
  .a4-page p.prose-paragraph { text-align: justify; margin-bottom: 7px; }
  .a4-page ol { list-style-type: decimal; padding-left: 18px; margin-top: 4px; margin-bottom: 8px; }
  .a4-page ol li { margin-bottom: 3.5px; padding-left: 3px; }
  .a4-page table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 10px; }
  .a4-page th, .a4-page td { font-family: Arial, Helvetica, sans-serif; border: 1px solid #cbd5e1; padding: 5.5px 8px; font-size: 9pt; vertical-align: top; }
  .a4-page th { background-color: #002147; color: #ffffff; font-weight: 700; text-align: center; border-color: #002147; }
  .a4-page .num-cell { font-family: Arial, Helvetica, sans-serif; font-variant-numeric: tabular-nums; }
`;

function createDefaultFormData(): ProposalFormData {
  const today = getTodayIsoDate();
  const end = calculateEndDateIso(today, 2);
  return {
    bahasa: 'melayu',
    namaProgram: '',
    namaSyarikat: '',
    huraianProgram: '',
    bilanganHari: 2,
    bilanganPeserta: 30,
    tarikhMula: today,
    tarikhAkhir: end,
    lokasiProgram: 'Hotel',
    bajetPerPeserta: 250,
    sesiMalamAktif: [],
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('editor');
  const [formData, setFormData] = useState<ProposalFormData>(createDefaultFormData);
  const [aiContent, setAiContent] = useState<AIProposalContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justSavedDraft, setJustSavedDraft] = useState(false);
  const [drafts, setDrafts] = useState<SavedProposalDraft[]>(() => {
    try {
      const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedProposalDraft[]) : [];
    } catch {
      return [];
    }
  });

  const documentRef = useRef<HTMLDivElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    } catch {
      // Ignore storage quota errors
    }
  }, [drafts]);

  const UI = uiLabels[formData.bahasa];

  const handleLoadSample = () => {
    const today = formData.tarikhMula || getTodayIsoDate();
    const end = calculateEndDateIso(today, 2);
    setFormData(getSampleFormData(formData.bahasa, today, end));
    setErrorMessage(null);
  };

  const handleReset = () => {
    setFormData((prev) => ({
      ...createDefaultFormData(),
      bahasa: prev.bahasa,
    }));
    setAiContent(null);
    setIsEditMode(false);
    setErrorMessage(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);
    setIsEditMode(false);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 50000);

    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          bahasa: formData.bahasa,
          namaProgram: formData.namaProgram,
          namaSyarikat: formData.namaSyarikat,
          huraianProgram: formData.huraianProgram,
          bilanganHari: formData.bilanganHari,
          bilanganPeserta: formData.bilanganPeserta,
          lokasiProgram: formData.lokasiProgram,
        }),
      });

      const rawText = await response.text();
      let payload: { proposal?: AIProposalContent; error?: string } = {};
      try {
        payload = rawText ? (JSON.parse(rawText) as { proposal?: AIProposalContent; error?: string }) : {};
      } catch {
        throw new Error(
          formData.bahasa === 'english'
            ? `Server returned an unexpected response (${response.status}).`
            : `Pelayan memulangkan respons tidak sah (${response.status}).`
        );
      }

      if (!response.ok || !payload.proposal) {
        throw new Error(
          payload.error ||
            (formData.bahasa === 'english'
              ? 'Unable to generate proposal. Please try again.'
              : 'Tidak dapat menjana kertas kerja. Sila cuba lagi.')
        );
      }

      setAiContent(payload.proposal);

      if (window.innerWidth < 1024) {
        setTimeout(() => {
          previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setErrorMessage(
          formData.bahasa === 'english'
            ? 'Request timed out after 50 seconds. Please check your connection or try again.'
            : 'Permintaan melebihi had masa 50 saat. Sila semak sambungan atau cuba semula.'
        );
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : 'Ralat sambungan ke pelayan. Sila cuba sebentar lagi.';
        setErrorMessage(msg);
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    if (!aiContent) return;
    const newDraft: SavedProposalDraft = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      formData: { ...formData },
      aiContent: { ...aiContent },
    };
    setDrafts((prev) => [newDraft, ...prev].slice(0, 25));
    setJustSavedDraft(true);
    setTimeout(() => setJustSavedDraft(false), 2200);
  };

  const handleOpenDraft = (draft: SavedProposalDraft) => {
    setFormData(draft.formData);
    setAiContent(draft.aiContent);
    setIsEditMode(false);
    setErrorMessage(null);
    setActiveTab('editor');
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleExportPdf = async () => {
    const target = documentRef.current;
    if (!target || !aiContent) return;

    if (isEditMode) {
      setIsEditMode(false);
      await new Promise((r) => setTimeout(r, 80));
    }

    const pageElements = Array.from(target.querySelectorAll<HTMLElement>('.a4-page'));
    if (pageElements.length === 0) return;

    setIsExportingPdf(true);
    setErrorMessage(null);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            const stylesheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
            stylesheets.forEach((node) => {
              if (node.tagName === 'LINK') {
                const href = node.getAttribute('href') || '';
                if (!href.includes('fonts.googleapis.com')) {
                  node.remove();
                }
              } else {
                node.remove();
              }
            });
            const safeStyle = clonedDoc.createElement('style');
            safeStyle.textContent = A4_PDF_SAFE_CSS;
            clonedDoc.head.appendChild(safeStyle);
          },
        });

        const imgData = canvas.toDataURL('image/png');
        const ratio = canvas.width / canvas.height;
        let renderWidth = pageWidth;
        let renderHeight = renderWidth / ratio;
        let offsetX = 0;

        if (renderHeight > pageHeight) {
          renderHeight = pageHeight;
          renderWidth = renderHeight * ratio;
          offsetX = (pageWidth - renderWidth) / 2;
        }

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', offsetX, 0, renderWidth, renderHeight);
      }

      const safeFilename =
        formData.namaProgram.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_') ||
        'Kertas_Kerja_Impak_Niaga';
      pdf.save(`${safeFilename}.pdf`);
    } catch (err: unknown) {
      console.error('PDF export failed:', err);
      setErrorMessage(
        formData.bahasa === 'english'
          ? 'Failed to generate PDF file. You can also use the Print button to save as PDF.'
          : 'Gagal menjana fail PDF. Anda juga boleh menggunakan butang Cetak untuk simpan sebagai PDF.'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={formData.bahasa}
        hasProposal={Boolean(aiContent)}
        isExportingPdf={isExportingPdf}
        onExportPdf={handleExportPdf}
        draftsCount={drafts.length}
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-24">
              <ProposalForm
                formData={formData}
                onChange={setFormData}
                onSubmit={handleGenerate}
                onLoadSample={handleLoadSample}
                onReset={handleReset}
                isGenerating={isGenerating}
                hasProposal={Boolean(aiContent)}
                errorMessage={errorMessage}
              />
            </div>

            <div ref={previewContainerRef} className="lg:col-span-8 xl:col-span-8">
              {isGenerating && !aiContent ? (
                <div className="bg-white border border-slate-200 rounded-xl p-10 sm:p-14 space-y-6">
                  <div className="space-y-3 max-w-md mx-auto text-center">
                    <div className="h-5 w-48 bg-slate-200 rounded animate-pulse mx-auto" />
                    <div className="h-3.5 w-72 bg-slate-100 rounded animate-pulse mx-auto" />
                  </div>
                  <div className="max-w-2xl mx-auto space-y-4 pt-6 border-t border-slate-100">
                    <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-11/12 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-4/5 bg-slate-100 rounded animate-pulse" />
                    <div className="pt-4 h-4 w-44 bg-slate-200 rounded animate-pulse" />
                    <div className="h-24 w-full bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ) : aiContent ? (
                <A4DocumentPreview
                  formData={formData}
                  aiContent={aiContent}
                  onUpdateAiContent={setAiContent}
                  isEditMode={isEditMode}
                  onToggleEditMode={() => setIsEditMode((prev) => !prev)}
                  onSaveDraft={handleSaveDraft}
                  justSavedDraft={justSavedDraft}
                  onExportPdf={handleExportPdf}
                  isExportingPdf={isExportingPdf}
                  documentRef={documentRef}
                />
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl px-6 py-20 sm:py-28 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-5 text-navy">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-navy max-w-md text-balance">
                    {UI.emptyStateTitle}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 max-w-md leading-relaxed">
                    {UI.emptyStateSubtitle}
                  </p>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="mt-6 inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-navy hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{UI.emptyStateAction}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'drafts' && (
          <DraftsView
            drafts={drafts}
            language={formData.bahasa}
            onOpenDraft={handleOpenDraft}
            onDeleteDraft={handleDeleteDraft}
            onBackToEditor={() => setActiveTab('editor')}
          />
        )}

        {activeTab === 'guide' && (
          <FormatGuideView
            language={formData.bahasa}
            onStartBuilding={() => setActiveTab('editor')}
          />
        )}
      </main>

      <footer className="no-print bg-white border-t border-slate-200 py-5 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Impak Niaga</span>
          <span>{UI.footerText}</span>
        </div>
      </footer>
    </div>
  );
}

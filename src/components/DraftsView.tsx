import React, { useState } from 'react';
import { Search, Trash2, ArrowUpRight, FileText } from 'lucide-react';
import type { Language, SavedProposalDraft } from '../types/proposal';
import { uiLabels } from '../lib/i18n';
import { calculateBudgetSummary, formatRM } from '../lib/proposalUtils';

interface DraftsViewProps {
  drafts: SavedProposalDraft[];
  language: Language;
  onOpenDraft: (draft: SavedProposalDraft) => void;
  onDeleteDraft: (id: string) => void;
  onBackToEditor: () => void;
}

export const DraftsView: React.FC<DraftsViewProps> = ({
  drafts,
  language,
  onOpenDraft,
  onDeleteDraft,
  onBackToEditor,
}) => {
  const T = uiLabels[language];
  const [query, setQuery] = useState('');

  const filtered = drafts.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      d.formData.namaProgram.toLowerCase().includes(q) ||
      d.formData.namaSyarikat.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy tracking-tight">
            {T.draftsHeading}
          </h1>
        </div>
        {drafts.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={T.draftsSearchPlaceholder}
              className="w-full min-h-[40px] pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
          <FileText className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-600 max-w-md mx-auto">{T.draftsEmpty}</p>
          <button
            type="button"
            onClick={onBackToEditor}
            className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors cursor-pointer"
          >
            {T.navEditor}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">{T.programNameLabel}</th>
                  <th className="py-3 px-4">{T.companyNameLabel}</th>
                  <th className="py-3 px-4 text-right">{T.daysLabel}</th>
                  <th className="py-3 px-4 text-right">{T.participantsLabel}</th>
                  <th className="py-3 px-4 text-right">{T.liveTotalLabel}</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((draft) => {
                  const budget = calculateBudgetSummary(
                    draft.formData.bilanganHari,
                    draft.formData.bilanganPeserta,
                    draft.formData.bajetPerPeserta
                  );
                  return (
                    <tr key={draft.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>{draft.formData.namaProgram}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {draft.formData.bahasa === 'english' ? 'English' : 'Bahasa Melayu'} ·{' '}
                          {draft.formData.tarikhMula}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{draft.formData.namaSyarikat}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        {draft.formData.bilanganHari}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        {draft.formData.bilanganPeserta}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-navy">
                        {formatRM(budget.totalBajetKutipan)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenDraft(draft)}
                            className="inline-flex items-center gap-1 min-h-[34px] px-3 py-1.5 rounded-md bg-navy text-white text-xs font-medium hover:bg-navy-light transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <span>{T.openDraft}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteDraft(draft.id)}
                            aria-label={T.deleteDraft}
                            className="inline-flex items-center justify-center min-h-[34px] w-[34px] rounded-md border border-slate-200 text-slate-500 hover:text-red-700 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

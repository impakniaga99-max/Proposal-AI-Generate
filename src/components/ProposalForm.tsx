import React from 'react';
import { Loader2, Sparkles, RotateCcw } from 'lucide-react';
import type { Language, ProposalFormData, VenueType } from '../types/proposal';
import { uiLabels } from '../lib/i18n';
import { calculateBudgetSummary, calculateEndDateIso, formatRM } from '../lib/proposalUtils';

interface ProposalFormProps {
  formData: ProposalFormData;
  onChange: (updated: ProposalFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoadSample: () => void;
  onReset: () => void;
  isGenerating: boolean;
  hasProposal: boolean;
  errorMessage: string | null;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onLoadSample,
  onReset,
  isGenerating,
  hasProposal,
  errorMessage,
}) => {
  const T = uiLabels[formData.bahasa];
  const budget = calculateBudgetSummary(
    formData.bilanganHari,
    formData.bilanganPeserta,
    formData.bajetPerPeserta
  );

  const handleField = <K extends keyof ProposalFormData>(key: K, value: ProposalFormData[K]) => {
    onChange({ ...formData, [key]: value });
  };

  const handleLanguageSwitch = (lang: Language) => {
    onChange({ ...formData, bahasa: lang });
  };

  const handleDaysChange = (rawValue: string) => {
    const parsed = Math.max(1, Math.min(14, parseInt(rawValue, 10) || 1));
    const nextEnd = calculateEndDateIso(formData.tarikhMula, parsed);
    const filteredNights = formData.sesiMalamAktif.filter((n) => n < parsed);
    onChange({
      ...formData,
      bilanganHari: parsed,
      tarikhAkhir: nextEnd || formData.tarikhAkhir,
      sesiMalamAktif: filteredNights,
    });
  };

  const handleStartDateChange = (nextStart: string) => {
    const nextEnd = calculateEndDateIso(nextStart, formData.bilanganHari);
    onChange({
      ...formData,
      tarikhMula: nextStart,
      tarikhAkhir: nextEnd || formData.tarikhAkhir,
    });
  };

  const toggleNightSession = (nightNumber: number) => {
    const exists = formData.sesiMalamAktif.includes(nightNumber);
    const next = exists
      ? formData.sesiMalamAktif.filter((n) => n !== nightNumber)
      : [...formData.sesiMalamAktif, nightNumber].sort((a, b) => a - b);
    handleField('sesiMalamAktif', next);
  };

  const nightIndices = Array.from(
    { length: Math.max(0, formData.bilanganHari - 1) },
    (_, i) => i + 1
  );

  return (
    <aside className="no-print bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Form Header */}
      <div className="px-6 py-4 bg-navy text-white flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold tracking-tight whitespace-nowrap">
          {T.formTitle}
        </h2>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onLoadSample}
            className="text-xs font-medium text-gold hover:text-gold-light underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {T.loadSample}
          </button>
          <button
            type="button"
            onClick={onReset}
            title={T.resetForm}
            className="text-slate-300 hover:text-white p-1.5 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {/* Segmented Language Control */}
        <div>
          <span className="block mb-2 text-xs font-semibold text-slate-700">
            {T.languageLabel}
          </span>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => handleLanguageSwitch('melayu')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                formData.bahasa === 'melayu'
                  ? 'bg-white text-navy shadow-xs'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              Bahasa Melayu
            </button>
            <button
              type="button"
              onClick={() => handleLanguageSwitch('english')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                formData.bahasa === 'english'
                  ? 'bg-white text-navy shadow-xs'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Program Name */}
        <div>
          <label htmlFor="namaProgram" className="block mb-1.5 text-xs font-semibold text-slate-700">
            {T.programNameLabel}
          </label>
          <input
            id="namaProgram"
            type="text"
            required
            value={formData.namaProgram}
            onChange={(e) => handleField('namaProgram', e.target.value)}
            placeholder={T.programNamePlaceholder}
            className="w-full min-h-[42px] px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 transition-colors"
          />
        </div>

        {/* Client Organization */}
        <div>
          <label htmlFor="namaSyarikat" className="block mb-1.5 text-xs font-semibold text-slate-700">
            {T.companyNameLabel}
          </label>
          <input
            id="namaSyarikat"
            type="text"
            required
            value={formData.namaSyarikat}
            onChange={(e) => handleField('namaSyarikat', e.target.value)}
            placeholder={T.companyNamePlaceholder}
            className="w-full min-h-[42px] px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 transition-colors"
          />
        </div>

        {/* Brief Description */}
        <div>
          <label
            htmlFor="huraianProgram"
            className="block mb-1.5 text-xs font-semibold text-slate-700"
          >
            {T.descriptionLabel}
          </label>
          <textarea
            id="huraianProgram"
            rows={3}
            required
            value={formData.huraianProgram}
            onChange={(e) => handleField('huraianProgram', e.target.value)}
            placeholder={T.descriptionPlaceholder}
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 transition-colors leading-relaxed"
          />
        </div>

        {/* Days & Participants */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="bilanganHari"
              className="block mb-1.5 text-xs font-semibold text-slate-700"
            >
              {T.daysLabel}
            </label>
            <input
              id="bilanganHari"
              type="number"
              min={1}
              max={14}
              required
              value={formData.bilanganHari}
              onChange={(e) => handleDaysChange(e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </div>
          <div>
            <label
              htmlFor="bilanganPeserta"
              className="block mb-1.5 text-xs font-semibold text-slate-700"
            >
              {T.participantsLabel}
            </label>
            <input
              id="bilanganPeserta"
              type="number"
              min={1}
              required
              value={formData.bilanganPeserta}
              onChange={(e) =>
                handleField('bilanganPeserta', Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-full min-h-[42px] px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </div>
        </div>

        {/* Start & End Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tarikhMula" className="block mb-1.5 text-xs font-semibold text-slate-700">
              {T.startDateLabel}
            </label>
            <input
              id="tarikhMula"
              type="date"
              required
              value={formData.tarikhMula}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </div>
          <div>
            <label htmlFor="tarikhAkhir" className="block mb-1.5 text-xs font-semibold text-slate-700">
              {T.endDateLabel}
            </label>
            <input
              id="tarikhAkhir"
              type="date"
              required
              value={formData.tarikhAkhir}
              onChange={(e) => handleField('tarikhAkhir', e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </div>
        </div>

        {/* Venue */}
        <div>
          <label
            htmlFor="lokasiProgram"
            className="block mb-1.5 text-xs font-semibold text-slate-700"
          >
            {T.venueLabel}
          </label>
          <select
            id="lokasiProgram"
            value={formData.lokasiProgram}
            onChange={(e) => handleField('lokasiProgram', e.target.value as VenueType)}
            className="w-full min-h-[42px] px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
          >
            <option value="Hotel">{T.venueOptions.Hotel}</option>
            <option value="Dewan Seminar">{T.venueOptions['Dewan Seminar']}</option>
            <option value="Tempat Sendiri">{T.venueOptions['Tempat Sendiri']}</option>
          </select>
        </div>

        {/* Budget per Participant + Live Summary */}
        <div>
          <label
            htmlFor="bajetPerPeserta"
            className="block mb-1.5 text-xs font-semibold text-slate-700"
          >
            {T.budgetPerPaxLabel}
          </label>
          <input
            id="bajetPerPeserta"
            type="number"
            min={0}
            step={10}
            required
            value={formData.bajetPerPeserta}
            onChange={(e) =>
              handleField('bajetPerPeserta', Math.max(0, parseFloat(e.target.value) || 0))
            }
            className="w-full min-h-[42px] px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
          />
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{T.liveTotalLabel}</span>
            <span className="font-mono tabular-nums font-semibold text-navy">
              {formatRM(budget.totalBajetKutipan)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{T.speakerAllocationLabel}</span>
            <span className="font-mono tabular-nums">{formatRM(budget.feePenceramah)}</span>
          </div>
        </div>

        {/* Dynamic Evening Sessions */}
        {nightIndices.length > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="block text-xs font-semibold text-slate-700">
              {T.additionalSessionsLabel}
            </span>
            <div className="space-y-1.5">
              {nightIndices.map((nightNum) => {
                const checked = formData.sesiMalamAktif.includes(nightNum);
                return (
                  <label
                    key={nightNum}
                    className="flex items-center gap-3 min-h-[40px] px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleNightSession(nightNum)}
                      className="h-4 w-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-800 select-none">
                      {T.eveningSessionPrefix} · {T.nightLabel} {nightNum}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed"
          >
            {errorMessage}
          </div>
        )}

        {/* Primary Generate CTA */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full min-h-[44px] px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-navy font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-navy" />
              <span>{T.generatingButton}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-navy" />
              <span>{hasProposal ? T.regenerateButton : T.generateButton}</span>
            </>
          )}
        </button>
      </form>
    </aside>
  );
};

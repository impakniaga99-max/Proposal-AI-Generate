import React from 'react';
import { Loader2, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import type {
  CustomCostItem,
  Language,
  OrganizationSector,
  ParticipantLevel,
  ProposalFormData,
  VenueType,
} from '../types/proposal';
import { uiLabels } from '../lib/i18n';
import {
  calculateEndDateIso,
  calculateFullBudget,
  createDefaultCustomCostItems,
  formatRM,
} from '../lib/proposalUtils';

interface ProposalFormProps {
  formData: ProposalFormData;
  onChange: (updated: ProposalFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoadSample: () => void;
  onReset: () => void;
  isGenerating: boolean;
  hasProposal: boolean;
  errorMessage: string | null;
  trainerCvEnabled: boolean;
  onToggleTrainerCv: (enabled: boolean) => void;
  onOpenBrandingTab: () => void;
}

const SECTORS: OrganizationSector[] = [
  'Korporat / GLC',
  'Kerajaan / Agensi',
  'PKS (SME)',
  'Pendidikan / NGO',
];

const LEVELS: ParticipantLevel[] = [
  'Pengurusan Tertinggi',
  'Pengurusan Pertengahan & Eksekutif',
  'Staf Operasi & Sokongan',
];

export const ProposalForm: React.FC<ProposalFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onLoadSample,
  onReset,
  isGenerating,
  hasProposal,
  errorMessage,
  trainerCvEnabled,
  onToggleTrainerCv,
  onOpenBrandingTab,
}) => {
  const T = uiLabels[formData.bahasa];
  const budget = calculateFullBudget(formData);

  const handleField = <K extends keyof ProposalFormData>(key: K, value: ProposalFormData[K]) => {
    onChange({ ...formData, [key]: value });
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

  const handleSwitchCostMode = (mode: 'auto' | 'custom') => {
    if (mode === 'custom' && formData.customCostItems.length === 0) {
      onChange({
        ...formData,
        costMode: 'custom',
        customCostItems: createDefaultCustomCostItems(formData),
      });
    } else {
      handleField('costMode', mode);
    }
  };

  const updateCustomItem = (index: number, patch: Partial<CustomCostItem>) => {
    const next = formData.customCostItems.map((item, idx) =>
      idx === index ? { ...item, ...patch } : item
    );
    handleField('customCostItems', next);
  };

  const addCustomItem = () => {
    const next: CustomCostItem[] = [
      ...formData.customCostItems,
      {
        id: `item-${Date.now()}`,
        description: formData.bahasa === 'english' ? 'Additional Expense' : 'Item Kos Tambahan',
        calculationNote: '1 unit',
        amount: 500,
      },
    ];
    handleField('customCostItems', next);
  };

  const removeCustomItem = (index: number) => {
    const next = formData.customCostItems.filter((_, idx) => idx !== index);
    handleField('customCostItems', next);
  };

  const nightIndices = Array.from(
    { length: Math.max(0, formData.bilanganHari - 1) },
    (_, i) => i + 1
  );

  return (
    <aside className="no-print bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-navy text-white flex items-center justify-between gap-3">
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

      <form onSubmit={onSubmit} className="p-5 space-y-4">
        {/* Language Toggle */}
        <div>
          <span className="block mb-1.5 text-xs font-semibold text-slate-700">
            {T.languageLabel}
          </span>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => handleField('bahasa', 'melayu')}
              className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                formData.bahasa === 'melayu'
                  ? 'bg-white text-navy shadow-xs'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              Bahasa Melayu
            </button>
            <button
              type="button"
              onClick={() => handleField('bahasa', 'english')}
              className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                formData.bahasa === 'english'
                  ? 'bg-white text-navy shadow-xs'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Program Name & Client */}
        <div>
          <label htmlFor="namaProgram" className="block mb-1 text-xs font-semibold text-slate-700">
            {T.programNameLabel}
          </label>
          <input
            id="namaProgram"
            type="text"
            required
            value={formData.namaProgram}
            onChange={(e) => handleField('namaProgram', e.target.value)}
            placeholder={T.programNamePlaceholder}
            className="w-full min-h-[40px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
          />
        </div>

        <div>
          <label htmlFor="namaSyarikat" className="block mb-1 text-xs font-semibold text-slate-700">
            {T.companyNameLabel}
          </label>
          <input
            id="namaSyarikat"
            type="text"
            required
            value={formData.namaSyarikat}
            onChange={(e) => handleField('namaSyarikat', e.target.value)}
            placeholder={T.companyNamePlaceholder}
            className="w-full min-h-[40px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
          />
        </div>

        {/* Sector & Participant Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="sektor" className="block mb-1 text-xs font-semibold text-slate-700">
              {T.sectorLabel}
            </label>
            <select
              id="sektor"
              value={formData.sektorOrganisasi}
              onChange={(e) =>
                handleField('sektorOrganisasi', e.target.value as OrganizationSector)
              }
              className="w-full min-h-[40px] px-2.5 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tahap" className="block mb-1 text-xs font-semibold text-slate-700">
              {T.levelLabel}
            </label>
            <select
              id="tahap"
              value={formData.tahapPeserta}
              onChange={(e) => handleField('tahapPeserta', e.target.value as ParticipantLevel)}
              className="w-full min-h-[40px] px-2.5 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Program Brief */}
        <div>
          <label
            htmlFor="huraianProgram"
            className="block mb-1 text-xs font-semibold text-slate-700"
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
            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy leading-relaxed"
          />
        </div>

        {/* Days, Participants, Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="bilanganHari"
              className="block mb-1 text-xs font-semibold text-slate-700"
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
              className="w-full min-h-[40px] px-3 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>
          <div>
            <label
              htmlFor="bilanganPeserta"
              className="block mb-1 text-xs font-semibold text-slate-700"
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
              className="w-full min-h-[40px] px-3 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="tarikhMula" className="block mb-1 text-xs font-semibold text-slate-700">
              {T.startDateLabel}
            </label>
            <input
              id="tarikhMula"
              type="date"
              required
              value={formData.tarikhMula}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full min-h-[40px] px-2.5 py-2 text-xs font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>
          <div>
            <label htmlFor="tarikhAkhir" className="block mb-1 text-xs font-semibold text-slate-700">
              {T.endDateLabel}
            </label>
            <input
              id="tarikhAkhir"
              type="date"
              required
              value={formData.tarikhAkhir}
              onChange={(e) => handleField('tarikhAkhir', e.target.value)}
              className="w-full min-h-[40px] px-2.5 py-2 text-xs font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        {/* Venue & Document Ref */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="lokasiProgram"
              className="block mb-1 text-xs font-semibold text-slate-700"
            >
              {T.venueLabel}
            </label>
            <select
              id="lokasiProgram"
              value={formData.lokasiProgram}
              onChange={(e) => handleField('lokasiProgram', e.target.value as VenueType)}
              className="w-full min-h-[40px] px-2.5 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            >
              <option value="Hotel">{T.venueOptions.Hotel}</option>
              <option value="Dewan Seminar">{T.venueOptions['Dewan Seminar']}</option>
              <option value="Tempat Sendiri">{T.venueOptions['Tempat Sendiri']}</option>
            </select>
          </div>
          <div>
            <label htmlFor="noRujukan" className="block mb-1 text-xs font-semibold text-slate-700">
              {T.refNumberLabel}
            </label>
            <input
              id="noRujukan"
              type="text"
              value={formData.noRujukan}
              onChange={(e) => handleField('noRujukan', e.target.value)}
              placeholder="IN/PROP/2026/001"
              className="w-full min-h-[40px] px-2.5 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        {/* Dynamic Night Sessions */}
        {nightIndices.length > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="block text-xs font-semibold text-slate-700">
              {T.additionalSessionsLabel}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {nightIndices.map((nightNum) => {
                const checked = formData.sesiMalamAktif.includes(nightNum);
                return (
                  <label
                    key={nightNum}
                    className="flex items-center gap-2 min-h-[36px] px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleNightSession(nightNum)}
                      className="h-4 w-4 rounded border-slate-300 text-navy cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-800 select-none">
                      {T.nightLabel} {nightNum}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Budget, Speaker Rate, Discount, SST & Package Comparison */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{T.budgetSectionTitle}</span>
            <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => handleSwitchCostMode('auto')}
                className={`px-2 py-1 text-[11px] font-semibold rounded cursor-pointer ${
                  formData.costMode === 'auto'
                    ? 'bg-white text-navy shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                {T.costModeAuto}
              </button>
              <button
                type="button"
                onClick={() => handleSwitchCostMode('custom')}
                className={`px-2 py-1 text-[11px] font-semibold rounded cursor-pointer ${
                  formData.costMode === 'custom'
                    ? 'bg-white text-navy shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                {T.costModeCustom}
              </button>
            </div>
          </div>

          {formData.costMode === 'auto' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="bajetPerPeserta"
                  className="block mb-1 text-[11px] font-semibold text-slate-600"
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
                  className="w-full min-h-[38px] px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
                />
              </div>
              <div>
                <label
                  htmlFor="kadarPenceramah"
                  className="block mb-1 text-[11px] font-semibold text-slate-600"
                >
                  {T.speakerDailyRateLabel}
                </label>
                <input
                  id="kadarPenceramah"
                  type="number"
                  min={0}
                  step={100}
                  required
                  value={formData.kadarPenceramahHarian}
                  onChange={(e) =>
                    handleField(
                      'kadarPenceramahHarian',
                      Math.max(0, parseFloat(e.target.value) || 0)
                    )
                  }
                  className="w-full min-h-[38px] px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {formData.customCostItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5"
                >
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateCustomItem(idx, { description: e.target.value })}
                      className="flex-1 min-h-[32px] px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={item.calculationNote}
                      onChange={(e) => updateCustomItem(idx, { calculationNote: e.target.value })}
                      placeholder="Nota"
                      className="min-h-[32px] px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={item.amount}
                      onChange={(e) =>
                        updateCustomItem(idx, {
                          amount: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      className="min-h-[32px] px-2 py-1 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded text-right"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCustomItem}
                className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{T.addCostItem.replace('+ ', '')}</span>
              </button>
            </div>
          )}

          {/* Discount + SST 8% + Package Comparison */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label htmlFor="diskaun" className="block mb-1 text-[11px] font-semibold text-slate-600">
                {T.discountLabel}
              </label>
              <input
                id="diskaun"
                type="number"
                min={0}
                max={50}
                step={1}
                value={formData.diskaunPeratus}
                onChange={(e) =>
                  handleField(
                    'diskaunPeratus',
                    Math.max(0, Math.min(50, parseFloat(e.target.value) || 0))
                  )
                }
                className="w-full min-h-[36px] px-2.5 py-1 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
              />
            </div>
            <label className="flex items-center gap-2 min-h-[36px] px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sertakanSst}
                onChange={(e) => handleField('sertakanSst', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-navy cursor-pointer"
              />
              <span className="text-[11px] font-medium text-slate-700 leading-tight">
                {T.sstToggleLabel}
              </span>
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.sertakanPerbandinganPakej}
              onChange={(e) => handleField('sertakanPerbandinganPakej', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-navy cursor-pointer"
            />
            <span>{T.packageCompareToggleLabel}</span>
          </label>

          {/* Live Total Summary */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
            <span className="font-medium">{T.liveTotalLabel}</span>
            <span className="font-mono tabular-nums font-bold text-navy text-sm">
              {formatRM(budget.grandTotal)}
            </span>
          </div>
        </div>

        {/* Additional Documents & Compliance Toggles */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{T.docOptionsTitle}</span>
            <button
              type="button"
              onClick={onOpenBrandingTab}
              className="text-[11px] font-semibold text-navy underline underline-offset-2 cursor-pointer"
            >
              {T.navBranding}
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={formData.sertakanHrdCorp}
                onChange={(e) => handleField('sertakanHrdCorp', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-navy cursor-pointer"
              />
              <span>{T.hrdCorpToggle}</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={formData.sertakanSuratIringan}
                onChange={(e) => handleField('sertakanSuratIringan', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-navy cursor-pointer"
              />
              <span>{T.coverLetterToggle}</span>
            </label>

            {formData.sertakanSuratIringan && (
              <div className="pl-6 pb-1">
                <input
                  type="text"
                  value={formData.namaPenerimaSurat}
                  onChange={(e) => handleField('namaPenerimaSurat', e.target.value)}
                  placeholder={T.recipientPlaceholder}
                  className="w-full min-h-[34px] px-2.5 py-1 text-xs border border-slate-300 rounded-md"
                />
              </div>
            )}

            <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={formData.sertakanSebutHarga}
                onChange={(e) => handleField('sertakanSebutHarga', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-navy cursor-pointer"
              />
              <span>{T.quotationToggle}</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={trainerCvEnabled}
                onChange={(e) => onToggleTrainerCv(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-navy cursor-pointer"
              />
              <span>{T.trainerCvToggle}</span>
            </label>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed"
          >
            {errorMessage}
          </div>
        )}

        {/* Generate CTA */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full min-h-[44px] px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-navy font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { Language } from '../types/proposal';
import { uiLabels } from '../lib/i18n';

export type WorkspaceTab = 'editor' | 'branding' | 'drafts' | 'guide';

interface NavbarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  language: Language;
  hasProposal: boolean;
  isExportingPdf: boolean;
  onExportPdf: () => void;
  draftsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  language,
  hasProposal,
  isExportingPdf,
  onExportPdf,
  draftsCount,
}) => {
  const T = uiLabels[language];
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('editor')}
          aria-label="Impak Niaga"
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-md py-1 cursor-pointer"
        >
          {!logoError ? (
            <img
              src="/assets/aistudio/Logo_Impak_Niaga_9f4ce565.png"
              alt="Impak Niaga"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="h-11 w-auto object-contain shrink-0"
            />
          ) : (
            <span className="h-9 px-2.5 rounded-md bg-navy text-gold font-display font-bold text-sm flex items-center justify-center shrink-0">
              Impak Niaga
            </span>
          )}
        </button>

        {/* Zone 2: Single-Line Navigation Links */}
        <nav
          aria-label="Workspace Navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium"
        >
          <button
            type="button"
            onClick={() => onSelectTab('editor')}
            className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'editor'
                ? 'border-navy text-navy font-semibold'
                : 'border-transparent text-slate-600 hover:text-navy'
            }`}
          >
            {T.navEditor}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('branding')}
            className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'branding'
                ? 'border-navy text-navy font-semibold'
                : 'border-transparent text-slate-600 hover:text-navy'
            }`}
          >
            {T.navBranding}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('drafts')}
            className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'drafts'
                ? 'border-navy text-navy font-semibold'
                : 'border-transparent text-slate-600 hover:text-navy'
            }`}
          >
            {T.navDrafts}
            {draftsCount > 0 ? ` (${draftsCount})` : ''}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('guide')}
            className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-navy text-navy font-semibold'
                : 'border-transparent text-slate-600 hover:text-navy'
            }`}
          >
            {T.navGuide}
          </button>
        </nav>

        {/* Zone 3: Single Primary CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onExportPdf}
            disabled={!hasProposal || isExportingPdf}
            className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 ${
              hasProposal && !isExportingPdf
                ? 'bg-navy text-white hover:bg-navy-light cursor-pointer shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isExportingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin text-gold" />
            ) : (
              <Download className="h-4 w-4 text-gold" />
            )}
            <span>{isExportingPdf ? T.downloadingPdf : T.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Compact Mobile Navigation Row */}
      <div className="lg:hidden border-t border-slate-100 px-4 flex items-center gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => onSelectTab('editor')}
          className={`py-2.5 text-xs font-medium border-b-2 whitespace-nowrap shrink-0 ${
            activeTab === 'editor' ? 'border-navy text-navy font-semibold' : 'border-transparent text-slate-600'
          }`}
        >
          {T.navEditor}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('branding')}
          className={`py-2.5 text-xs font-medium border-b-2 whitespace-nowrap shrink-0 ${
            activeTab === 'branding' ? 'border-navy text-navy font-semibold' : 'border-transparent text-slate-600'
          }`}
        >
          {T.navBranding}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('drafts')}
          className={`py-2.5 text-xs font-medium border-b-2 whitespace-nowrap shrink-0 ${
            activeTab === 'drafts' ? 'border-navy text-navy font-semibold' : 'border-transparent text-slate-600'
          }`}
        >
          {T.navDrafts}
          {draftsCount > 0 ? ` (${draftsCount})` : ''}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('guide')}
          className={`py-2.5 text-xs font-medium border-b-2 whitespace-nowrap shrink-0 ${
            activeTab === 'guide' ? 'border-navy text-navy font-semibold' : 'border-transparent text-slate-600'
          }`}
        >
          {T.navGuide}
        </button>
      </div>
    </header>
  );
};

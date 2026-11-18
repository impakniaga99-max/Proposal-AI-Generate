import React, { useState } from 'react';
import { Upload, X, Check, CloudUpload } from 'lucide-react';
import type { BrandingSettings, Language, TrainerProfile } from '../types/proposal';
import { compressImageToDataUrl } from '../lib/proposalUtils';

interface BrandingTrainerViewProps {
  language: Language;
  branding: BrandingSettings;
  onChangeBranding: (next: BrandingSettings) => void;
  trainerProfile: TrainerProfile;
  onChangeTrainerProfile: (next: TrainerProfile) => void;
  isSignedIn: boolean;
  onSaveToCloud: () => Promise<void>;
  onBackToEditor: () => void;
}

export const BrandingTrainerView: React.FC<BrandingTrainerViewProps> = ({
  language,
  branding,
  onChangeBranding,
  trainerProfile,
  onChangeTrainerProfile,
  isSignedIn,
  onSaveToCloud,
  onBackToEditor,
}) => {
  const isEn = language === 'english';
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const handleImageUpload = async (
    file: File | undefined,
    maxDim: number,
    preservePng: boolean,
    onDone: (dataUrl: string) => void
  ) => {
    if (!file) return;
    setUploadErr(null);
    try {
      const dataUrl = await compressImageToDataUrl(file, maxDim, preservePng);
      onDone(dataUrl);
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'Gagal memuat naik imej.');
    }
  };

  const handleCloudSave = async () => {
    setSaving(true);
    try {
      await onSaveToCloud();
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy tracking-tight">
            {isEn ? 'Company Branding, Assets & Trainer Profile' : 'Penjenamaan Syarikat, Cop Rasmi & Profil Penceramah'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isEn
              ? 'Customize your official letterhead, client logo, digital signature, company stamp, and lead trainer CV.'
              : 'Tetapkan maklumat kepala surat rasmi, logo klien, tandatangan digital, cop syarikat, dan biodata penceramah.'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isSignedIn && (
            <button
              type="button"
              onClick={handleCloudSave}
              disabled={saving}
              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-gold text-navy text-sm font-semibold hover:bg-gold-light transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              {savedNotice ? <Check className="h-4 w-4" /> : <CloudUpload className="h-4 w-4" />}
              <span>
                {savedNotice
                  ? isEn
                    ? 'Synced to Cloud'
                    : 'Disimpan ke Awan'
                  : isEn
                  ? 'Save Settings to Cloud'
                  : 'Simpan Tetapan ke Awan'}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={onBackToEditor}
            className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors whitespace-nowrap cursor-pointer"
          >
            {isEn ? 'Back to Workbench' : 'Kembali ke Penyedia'}
          </button>
        </div>
      </div>

      {uploadErr && (
        <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
          {uploadErr}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Section 1: Company Letterhead & Consultant Details */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-navy border-b border-slate-100 pb-3">
            {isEn ? 'Official Letterhead & Signatory' : 'Tetapan Kepala Surat & Perunding'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                {isEn ? 'Company Name' : 'Nama Syarikat Perunding'}
              </label>
              <input
                type="text"
                value={branding.companyName}
                onChange={(e) => onChangeBranding({ ...branding, companyName: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                {isEn ? 'Registration No. (SSM)' : 'No. Pendaftaran (SSM)'}
              </label>
              <input
                type="text"
                value={branding.regNo}
                onChange={(e) => onChangeBranding({ ...branding, regNo: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                {isEn ? 'Default Ref. Prefix' : 'Awalan No. Rujukan'}
              </label>
              <input
                type="text"
                value={branding.refPrefix}
                onChange={(e) => onChangeBranding({ ...branding, refPrefix: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                {isEn ? 'Office Address' : 'Alamat Pejabat'}
              </label>
              <input
                type="text"
                value={branding.address}
                onChange={(e) => onChangeBranding({ ...branding, address: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                {isEn ? 'Phone Number' : 'No. Telefon'}
              </label>
              <input
                type="text"
                value={branding.phone}
                onChange={(e) => onChangeBranding({ ...branding, phone: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                {isEn ? 'Official Email' : 'E-mel Rasmi'}
              </label>
              <input
                type="email"
                value={branding.email}
                onChange={(e) => onChangeBranding({ ...branding, email: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                {isEn ? 'Consultant Name' : 'Nama Perunding'}
              </label>
              <input
                type="text"
                value={branding.consultantName}
                onChange={(e) => onChangeBranding({ ...branding, consultantName: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                {isEn ? 'Consultant Role' : 'Jawatan Perunding'}
              </label>
              <input
                type="text"
                value={branding.consultantRole}
                onChange={(e) => onChangeBranding({ ...branding, consultantRole: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {/* Image Uploads: Client Logo, Signature, Company Stamp */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Client Logo */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700">
                {isEn ? 'Client Logo' : 'Logo Klien'}
              </span>
              {branding.clientLogoDataUrl ? (
                <div className="relative h-24 border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                  <img
                    src={branding.clientLogoDataUrl}
                    alt="Client Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => onChangeBranding({ ...branding, clientLogoDataUrl: '' })}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-slate-300 text-slate-600 hover:text-red-600 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="h-24 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 text-xs text-slate-500 hover:border-navy hover:text-navy cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>{isEn ? 'Upload Logo' : 'Muat Naik'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      void handleImageUpload(e.target.files?.[0], 260, true, (url) =>
                        onChangeBranding({ ...branding, clientLogoDataUrl: url })
                      )
                    }
                  />
                </label>
              )}
            </div>

            {/* Digital Signature */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700">
                {isEn ? 'Digital Signature' : 'Tandatangan Digital'}
              </span>
              {branding.signatureDataUrl ? (
                <div className="relative h-24 border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                  <img
                    src={branding.signatureDataUrl}
                    alt="Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => onChangeBranding({ ...branding, signatureDataUrl: '' })}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-slate-300 text-slate-600 hover:text-red-600 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="h-24 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 text-xs text-slate-500 hover:border-navy hover:text-navy cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>{isEn ? 'Upload PNG/JPG' : 'Muat Naik'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      void handleImageUpload(e.target.files?.[0], 260, true, (url) =>
                        onChangeBranding({ ...branding, signatureDataUrl: url })
                      )
                    }
                  />
                </label>
              )}
            </div>

            {/* Official Stamp */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700">
                {isEn ? 'Company Stamp' : 'Cop Syarikat'}
              </span>
              {branding.stampDataUrl ? (
                <div className="relative h-24 border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                  <img
                    src={branding.stampDataUrl}
                    alt="Company Stamp"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => onChangeBranding({ ...branding, stampDataUrl: '' })}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-slate-300 text-slate-600 hover:text-red-600 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="h-24 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 text-xs text-slate-500 hover:border-navy hover:text-navy cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>{isEn ? 'Upload Stamp' : 'Muat Naik'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      void handleImageUpload(e.target.files?.[0], 240, true, (url) =>
                        onChangeBranding({ ...branding, stampDataUrl: url })
                      )
                    }
                  />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Trainer Profile / CV */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-display text-base font-bold text-navy">
              {isEn ? 'Lead Trainer Profile (CV Sheet)' : 'Profil Penceramah Utama (Helaian CV)'}
            </h2>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-navy cursor-pointer">
              <input
                type="checkbox"
                checked={trainerProfile.enabled}
                onChange={(e) =>
                  onChangeTrainerProfile({ ...trainerProfile, enabled: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-navy cursor-pointer"
              />
              <span>{isEn ? 'Include in Proposal' : 'Sertakan dalam Kertas Kerja'}</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            {trainerProfile.photoDataUrl ? (
              <div className="relative h-20 w-20 shrink-0 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                <img
                  src={trainerProfile.photoDataUrl}
                  alt={trainerProfile.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onChangeTrainerProfile({ ...trainerProfile, photoDataUrl: '' })}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white/90 text-slate-700 hover:text-red-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="h-20 w-20 shrink-0 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-[11px] text-slate-500 hover:border-navy hover:text-navy cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>{isEn ? 'Photo' : 'Foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    void handleImageUpload(e.target.files?.[0], 320, false, (url) =>
                      onChangeTrainerProfile({ ...trainerProfile, photoDataUrl: url })
                    )
                  }
                />
              </label>
            )}

            <div className="flex-1 space-y-2">
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-700">
                  {isEn ? 'Trainer Full Name & Credentials' : 'Nama Penuh & Tauliah'}
                </label>
                <input
                  type="text"
                  value={trainerProfile.name}
                  onChange={(e) =>
                    onChangeTrainerProfile({ ...trainerProfile, name: e.target.value })
                  }
                  className="w-full min-h-[38px] px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-700">
                  {isEn ? 'Designation / Specialty Title' : 'Gelaran Kepakaran'}
                </label>
                <input
                  type="text"
                  value={trainerProfile.title}
                  onChange={(e) =>
                    onChangeTrainerProfile({ ...trainerProfile, title: e.target.value })
                  }
                  className="w-full min-h-[38px] px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-slate-700">
              {isEn ? 'Academic Qualifications & Certifications' : 'Kelayakan Akademik & Pentauliahan'}
            </label>
            <textarea
              rows={2}
              value={trainerProfile.qualifications}
              onChange={(e) =>
                onChangeTrainerProfile({ ...trainerProfile, qualifications: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-slate-700">
              {isEn ? 'Core Areas of Expertise' : 'Bidang Kepakaran Utama'}
            </label>
            <textarea
              rows={2}
              value={trainerProfile.expertise}
              onChange={(e) =>
                onChangeTrainerProfile({ ...trainerProfile, expertise: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-slate-700">
              {isEn ? 'Past Corporate & Government Clients' : 'Rekod Klien Korporat & Agensi Terdahulu'}
            </label>
            <textarea
              rows={2}
              value={trainerProfile.pastClients}
              onChange={(e) =>
                onChangeTrainerProfile({ ...trainerProfile, pastClients: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export type Language = 'melayu' | 'english';

export type VenueType = 'Hotel' | 'Dewan Seminar' | 'Tempat Sendiri';

export interface ProposalFormData {
  bahasa: Language;
  namaProgram: string;
  namaSyarikat: string;
  huraianProgram: string;
  bilanganHari: number;
  bilanganPeserta: number;
  tarikhMula: string; // YYYY-MM-DD
  tarikhAkhir: string; // YYYY-MM-DD
  lokasiProgram: VenueType;
  bajetPerPeserta: number;
  sesiMalamAktif: number[];
}

export interface GeneratedModule {
  namaModul: string;
  pecahanTajuk: string[];
}

export interface AIProposalContent {
  pengenalan: string;
  objektif: string[];
  kaedah: string[];
  hasil: string[];
  modul: GeneratedModule[];
  penutup: string;
}

export interface SavedProposalDraft {
  id: string;
  createdAt: string;
  formData: ProposalFormData;
  aiContent: AIProposalContent;
}

export type Language = 'melayu' | 'english';

export type VenueType = 'Hotel' | 'Dewan Seminar' | 'Tempat Sendiri';

export type OrganizationSector =
  | 'Korporat / GLC'
  | 'Kerajaan / Agensi'
  | 'PKS (SME)'
  | 'Pendidikan / NGO';

export type ParticipantLevel =
  | 'Pengurusan Tertinggi'
  | 'Pengurusan Pertengahan & Eksekutif'
  | 'Staf Operasi & Sokongan';

export type ProposalStatus = 'Draf' | 'Dihantar' | 'Diluluskan' | 'Ditolak';

export type CostMode = 'auto' | 'custom';

export interface CustomCostItem {
  id: string;
  description: string;
  calculationNote: string;
  amount: number;
}

export interface BrandingSettings {
  companyName: string;
  regNo: string;
  address: string;
  phone: string;
  email: string;
  refPrefix: string;
  consultantName: string;
  consultantRole: string;
  clientLogoDataUrl: string;
  signatureDataUrl: string;
  stampDataUrl: string;
}

export interface TrainerProfile {
  enabled: boolean;
  name: string;
  title: string;
  photoDataUrl: string;
  qualifications: string;
  expertise: string;
  pastClients: string;
}

export interface ProposalFormData {
  bahasa: Language;
  namaProgram: string;
  namaSyarikat: string;
  namaPenerimaSurat: string;
  noRujukan: string;
  sektorOrganisasi: OrganizationSector;
  tahapPeserta: ParticipantLevel;
  huraianProgram: string;
  bilanganHari: number;
  bilanganPeserta: number;
  tarikhMula: string; // YYYY-MM-DD
  tarikhAkhir: string; // YYYY-MM-DD
  lokasiProgram: VenueType;
  bajetPerPeserta: number;
  kadarPenceramahHarian: number;
  costMode: CostMode;
  customCostItems: CustomCostItem[];
  diskaunPeratus: number;
  sertakanSst: boolean;
  sertakanPerbandinganPakej: boolean;
  sertakanHrdCorp: boolean;
  sertakanSuratIringan: boolean;
  sertakanSebutHarga: boolean;
  sesiMalamAktif: number[];
}

export interface GeneratedModule {
  namaModul: string;
  pecahanTajuk: string[];
}

export interface TentativeRow {
  time: string;
  activity: string;
}

export interface TentativeDay {
  dayNumber: number;
  formattedDate: string;
  rows: TentativeRow[];
}

export interface AIProposalContent {
  pengenalan: string;
  objektif: string[];
  kaedah: string[];
  hasil: string[];
  modul: GeneratedModule[];
  penutup: string;
  hrdCorpNotes?: string;
  customTentative?: TentativeDay[];
}

export interface SavedProposalDraft {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status: ProposalStatus;
  isCloud?: boolean;
  formData: ProposalFormData;
  aiContent: AIProposalContent;
}

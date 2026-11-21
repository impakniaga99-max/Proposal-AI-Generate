import type { Language, ProposalFormData } from '../types/proposal';

export interface UILabels {
  navEditor: string;
  navBranding: string;
  navDrafts: string;
  navGuide: string;
  downloadPdf: string;
  downloadingPdf: string;
  downloadWord: string;
  downloadingWord: string;
  printDoc: string;
  formTitle: string;
  loadSample: string;
  resetForm: string;
  languageLabel: string;
  programNameLabel: string;
  programNamePlaceholder: string;
  companyNameLabel: string;
  companyNamePlaceholder: string;
  recipientLabel: string;
  recipientPlaceholder: string;
  refNumberLabel: string;
  sectorLabel: string;
  levelLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  daysLabel: string;
  participantsLabel: string;
  startDateLabel: string;
  endDateLabel: string;
  venueLabel: string;
  venueOptions: {
    Hotel: string;
    'Dewan Seminar': string;
    'Tempat Sendiri': string;
  };
  budgetSectionTitle: string;
  costModeAuto: string;
  costModeCustom: string;
  budgetPerPaxLabel: string;
  speakerDailyRateLabel: string;
  discountLabel: string;
  sstToggleLabel: string;
  packageCompareToggleLabel: string;
  addCostItem: string;
  liveTotalLabel: string;
  speakerAllocationLabel: string;
  additionalSessionsLabel: string;
  eveningSessionPrefix: string;
  nightLabel: string;
  docOptionsTitle: string;
  hrdCorpToggle: string;
  coverLetterToggle: string;
  quotationToggle: string;
  trainerCvToggle: string;
  generateButton: string;
  generatingButton: string;
  regenerateButton: string;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  emptyStateAction: string;
  docReadyTitle: string;
  editModeOn: string;
  editModeOff: string;
  saveDraft: string;
  draftSaved: string;
  refineExpand: string;
  refineShorten: string;
  refineFormal: string;
  refining: string;
  draftsHeading: string;
  draftsEmpty: string;
  draftsSearchPlaceholder: string;
  openDraft: string;
  deleteDraft: string;
  localOnlyLabel: string;
  guideHeading: string;
  footerText: string;
}

export interface DocumentLabels {
  proposalTitle: string;
  proposalFor: string;
  programHandling: string;
  introTitle: string;
  objectivesTitle: string;
  objectivesIntro: string;
  methodsTitle: string;
  methodsIntro: string;
  outcomesTitle: string;
  outcomesIntro: string;
  hrdCorpTitle: string;
  modulesTitle: string;
  module: string;
  tentativeTitle: string;
  costTitle: string;
  packageComparisonTitle: string;
  conclusionTitle: string;
  preparedBy: string;
  consultantTitle: string;
  day: string;
  time: string;
  activity: string;
  registration: string;
  session1_intro: string;
  session1_module: string;
  morningBreak: string;
  session2_module: string;
  lunchBreak: string;
  session3: string;
  afternoonBreak: string;
  session4: string;
  eveningRest: string;
  eveningSession: string;
  costIntro: string;
  bilHeader: string;
  item: string;
  calculation: string;
  totalRM: string;
  speakerFee: string;
  pakejLabel: string;
  pakejCalc: string;
  contingency: string;
  contingencyCalc: string;
  subTotalLabel: string;
  discountLabel: string;
  sstLabel: string;
  totalBudgetLabel: string;
  costNote: string;
  page: string;
  venueMetaLabel: string;
  dateMetaLabel: string;
  participantsMetaLabel: string;
  paxUnit: string;
  sessionPrefix: string;
  partA: string;
  partB: string;
  coverLetterTitle: string;
  quotationTitle: string;
  trainerCvTitle: string;
}

export const uiLabels: Record<Language, UILabels> = {
  melayu: {
    navEditor: 'Penyedia Kertas Kerja',
    navBranding: 'Penjenamaan & Profil',
    navDrafts: 'Rekod Draf',
    navGuide: 'Panduan Format',
    downloadPdf: 'Muat Turun PDF',
    downloadingPdf: 'Menjana PDF...',
    downloadWord: 'Word (.docx)',
    downloadingWord: 'Menjana Word...',
    printDoc: 'Cetak',
    formTitle: 'Maklumat Program',
    loadSample: 'Isi Contoh',
    resetForm: 'Set Semula',
    languageLabel: 'Bahasa Kertas Kerja',
    programNameLabel: 'Nama Program',
    programNamePlaceholder: 'Contoh: Kursus Kepimpinan Strategik 2026',
    companyNameLabel: 'Nama Syarikat / Agensi',
    companyNamePlaceholder: 'Contoh: Tenaga Nasional Berhad',
    recipientLabel: 'Penerima Surat (Opsional)',
    recipientPlaceholder: 'Contoh: Pengarah Sumber Manusia',
    refNumberLabel: 'No. Rujukan Dokumen',
    sectorLabel: 'Sektor Organisasi',
    levelLabel: 'Tahap Peserta',
    descriptionLabel: 'Huraian Ringkas',
    descriptionPlaceholder: 'Nyatakan objektif utama, jurang kemahiran, dan cabaran organisasi...',
    daysLabel: 'Bilangan Hari',
    participantsLabel: 'Peserta',
    startDateLabel: 'Tarikh Mula',
    endDateLabel: 'Tarikh Tamat',
    venueLabel: 'Lokasi Cadangan',
    venueOptions: {
      Hotel: 'Hotel',
      'Dewan Seminar': 'Dewan Seminar',
      'Tempat Sendiri': 'Premis Sendiri',
    },
    budgetSectionTitle: 'Kos, Diskaun & Pakej',
    costModeAuto: 'Auto (Per Peserta)',
    costModeCustom: 'Item Tersuai',
    budgetPerPaxLabel: 'Bajet / Peserta / Hari (RM)',
    speakerDailyRateLabel: 'Fee Penceramah / Hari (RM)',
    discountLabel: 'Diskaun (%)',
    sstToggleLabel: 'Sertakan Cukai Perkhidmatan (SST 8%)',
    packageCompareToggleLabel: 'Jadual Perbandingan Pakej (Asas vs Penuh)',
    addCostItem: '+ Tambah Item Kos',
    liveTotalLabel: 'Jumlah Keseluruhan',
    speakerAllocationLabel: 'Yuran Penceramah',
    additionalSessionsLabel: 'Sesi Tambahan (Malam)',
    eveningSessionPrefix: 'Sesi Malam',
    nightLabel: 'Malam',
    docOptionsTitle: 'Helaian & Pematuhan Tambahan',
    hrdCorpToggle: 'Seksyen Pematuhan HRD Corp & Penilaian',
    coverLetterToggle: 'Helaian Surat Iringan Rasmi',
    quotationToggle: 'Helaian Sebut Harga Rasmi (Quotation)',
    trainerCvToggle: 'Helaian Profil Penceramah (CV)',
    generateButton: 'Jana Kertas Kerja',
    generatingButton: 'Menjana Kandungan...',
    regenerateButton: 'Jana Semula',
    emptyStateTitle: 'Sedia untuk menyediakan kertas kerja cadangan',
    emptyStateSubtitle:
      'Lengkapkan maklumat program di sebelah kiri atau muatkan contoh program untuk menjana kertas kerja korporat format A4 lengkap bersama ilustrasi, infografik, tentatif modul, sebut harga, dan eksport PDF/Word.',
    emptyStateAction: 'Isi Contoh & Cuba',
    docReadyTitle: 'Kertas Kerja Siap',
    editModeOn: 'Selesai Sunting',
    editModeOff: 'Sunting Teks & Tentatif',
    saveDraft: 'Simpan Rekod',
    draftSaved: 'Disimpan',
    refineExpand: 'Panjangkan',
    refineShorten: 'Ringkaskan',
    refineFormal: 'Lebih Formal',
    refining: 'Menghalus...',
    draftsHeading: 'Rekod & Status Kertas Kerja',
    draftsEmpty:
      'Tiada kertas kerja disimpan lagi. Jana dan simpan kertas kerja pertama anda untuk mengurus status rekod secara tempatan.',
    draftsSearchPlaceholder: 'Cari nama program atau syarikat...',
    openDraft: 'Buka',
    deleteDraft: 'Padam',
    localOnlyLabel: 'Simpanan Pelayar Tempatan',
    guideHeading: 'Piawaian Struktur & Pengiraan Kertas Kerja Impak Niaga',
    footerText: 'Penjana Kertas Kerja AI · Dikuasakan oleh Impak Niaga',
  },
  english: {
    navEditor: 'Proposal Workbench',
    navBranding: 'Branding & Profile',
    navDrafts: 'Saved Drafts',
    navGuide: 'Format Standard',
    downloadPdf: 'Download PDF',
    downloadingPdf: 'Exporting PDF...',
    downloadWord: 'Word (.docx)',
    downloadingWord: 'Exporting Word...',
    printDoc: 'Print',
    formTitle: 'Program Details',
    loadSample: 'Load Sample',
    resetForm: 'Reset',
    languageLabel: 'Proposal Language',
    programNameLabel: 'Program Name',
    programNamePlaceholder: 'e.g., Executive Leadership & Alignment 2026',
    companyNameLabel: 'Client Organization',
    companyNamePlaceholder: 'e.g., Meridian Logistics Sdn Bhd',
    recipientLabel: 'Letter Recipient (Optional)',
    recipientPlaceholder: 'e.g., Director of Human Resources',
    refNumberLabel: 'Document Ref. No.',
    sectorLabel: 'Organization Sector',
    levelLabel: 'Participant Level',
    descriptionLabel: 'Program Brief',
    descriptionPlaceholder: 'Describe target objectives, skill gaps, and organizational challenges...',
    daysLabel: 'Days',
    participantsLabel: 'Participants',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    venueLabel: 'Proposed Venue',
    venueOptions: {
      Hotel: 'Hotel',
      'Dewan Seminar': 'Seminar Hall',
      'Tempat Sendiri': 'In-House Venue',
    },
    budgetSectionTitle: 'Costing, Discount & Packages',
    costModeAuto: 'Auto (Per Pax)',
    costModeCustom: 'Custom Items',
    budgetPerPaxLabel: 'Budget / Pax / Day (RM)',
    speakerDailyRateLabel: 'Speaker Fee / Day (RM)',
    discountLabel: 'Discount (%)',
    sstToggleLabel: 'Include Service Tax (SST 8%)',
    packageCompareToggleLabel: 'Tiered Package Comparison Table',
    addCostItem: '+ Add Line Item',
    liveTotalLabel: 'Grand Total',
    speakerAllocationLabel: 'Speaker Fee',
    additionalSessionsLabel: 'Additional Evening Sessions',
    eveningSessionPrefix: 'Evening Session',
    nightLabel: 'Night',
    docOptionsTitle: 'Additional Sheets & Compliance',
    hrdCorpToggle: 'HRD Corp Compliance & Assessment Section',
    coverLetterToggle: 'Official Cover Letter Sheet',
    quotationToggle: 'Official Quotation Sheet',
    trainerCvToggle: 'Trainer Profile / CV Sheet',
    generateButton: 'Generate Proposal',
    generatingButton: 'Generating Proposal...',
    regenerateButton: 'Regenerate',
    emptyStateTitle: 'Ready to draft your corporate proposal',
    emptyStateSubtitle:
      'Complete the program details on the left or load a sample brief to generate a paginated A4 proposal with illustrations, infographics, module-mapped schedules, quotations, and PDF/Word export.',
    emptyStateAction: 'Load Sample Brief',
    docReadyTitle: 'Proposal Ready',
    editModeOn: 'Done Editing',
    editModeOff: 'Edit Text & Schedule',
    saveDraft: 'Save Proposal',
    draftSaved: 'Saved',
    refineExpand: 'Expand',
    refineShorten: 'Shorten',
    refineFormal: 'More Formal',
    refining: 'Refining...',
    draftsHeading: 'Saved Proposals & Status Tracker',
    draftsEmpty:
      'No saved proposals yet. Generate and save a proposal to track client status locally.',
    draftsSearchPlaceholder: 'Search program or client name...',
    openDraft: 'Open',
    deleteDraft: 'Delete',
    localOnlyLabel: 'Local Browser Storage',
    guideHeading: 'Impak Niaga Proposal Structure & Costing Standard',
    footerText: 'AI Proposal Workbench · Powered by Impak Niaga',
  },
};

export const docLabels: Record<Language, DocumentLabels> = {
  melayu: {
    proposalTitle: 'KERTAS KERJA CADANGAN',
    proposalFor: 'UNTUK',
    programHandling: 'PENGENDALIAN PROGRAM',
    introTitle: '1.0 PENGENALAN',
    objectivesTitle: '2.0 OBJEKTIF PROGRAM',
    objectivesIntro: 'Setelah tamat program ini, para peserta dijangka akan dapat:',
    methodsTitle: '3.0 KAEDAH PENGAJARAN',
    methodsIntro:
      'Bagi memastikan keberkesanan maksimum, program ini akan menggunakan pendekatan pembelajaran bersepadu (blended learning) yang interaktif dan berpusatkan peserta. Antara kaedah yang akan digunakan ialah:',
    outcomesTitle: '4.0 HASIL PROGRAM',
    outcomesIntro:
      'Program ini direka untuk memberikan impak yang signifikan bukan sahaja kepada individu, tetapi juga kepada organisasi secara keseluruhan. Hasil yang dijangkakan termasuk:',
    hrdCorpTitle: 'PEMATUHAN HRD CORP & PENILAIAN KURSUS',
    modulesTitle: '5.0 CADANGAN MODUL',
    module: 'Modul',
    tentativeTitle: '6.0 CADANGAN TENTATIF PROGRAM',
    costTitle: '7.0 PERINCIAN KOS',
    packageComparisonTitle: 'PERBANDINGAN PILIHAN PAKEJ LATIHAN',
    conclusionTitle: '8.0 PENUTUP',
    preparedBy: 'Disediakan oleh,',
    consultantTitle: 'PERUNDING LATIHAN',
    day: 'HARI',
    time: 'Masa',
    activity: 'Aktiviti',
    registration: 'Pendaftaran & Sarapan Pagi',
    session1_intro: 'Pengenalan & Pecah Suasana',
    session1_module: 'Modul',
    morningBreak: 'Minum Pagi',
    session2_module: 'Modul',
    lunchBreak: 'Makan Tengahari, Rehat & Solat Zohor',
    session3: 'Latihan Amali / Perbincangan Kumpulan',
    afternoonBreak: 'Minum Petang & Solat Asar',
    session4: 'Rumusan & Sesi Soal Jawab',
    eveningRest: 'Rehat, Makan Malam & Solat',
    eveningSession: 'Sesi Malam: Aktiviti Santai / Sesi Perkongsian',
    costIntro: 'Berikut adalah perincian anggaran kos bagi program ini:',
    bilHeader: 'Bil.',
    item: 'Perkara',
    calculation: 'Pengiraan',
    totalRM: 'Jumlah (RM)',
    speakerFee: 'Fee Penceramah Profesional',
    pakejLabel: 'Pakej Latihan Peserta & Kos Logistik',
    pakejCalc: 'Baki selepas yuran penceramah & kontigensi',
    contingency: 'Kontigensi (10%)',
    contingencyCalc: '10% daripada baki',
    subTotalLabel: 'SUB-JUMLAH',
    discountLabel: 'Diskaun Khas',
    sstLabel: 'Cukai Perkhidmatan (SST 8%)',
    totalBudgetLabel: 'JUMLAH KESELURUHAN',
    costNote:
      '*Nota: Anggaran kos ini adalah berdasarkan maklumat yang diberikan dan tertakluk kepada terma perbincangan akhir.',
    page: 'Muka Surat',
    venueMetaLabel: 'Lokasi',
    dateMetaLabel: 'Tarikh',
    participantsMetaLabel: 'Peserta',
    paxUnit: 'orang',
    sessionPrefix: 'Sesi',
    partA: 'Bahagian A',
    partB: 'Bahagian B',
    coverLetterTitle: 'SURAT IRINGAN RASMI',
    quotationTitle: 'SEBUT HARGA RASMI / OFFICIAL QUOTATION',
    trainerCvTitle: 'PROFIL PENCERAMAH & PERUNDING LATIHAN',
  },
  english: {
    proposalTitle: 'PROPOSAL PAPER',
    proposalFor: 'FOR',
    programHandling: 'CONDUCTING PROGRAM',
    introTitle: '1.0 INTRODUCTION',
    objectivesTitle: '2.0 PROGRAM OBJECTIVES',
    objectivesIntro: 'Upon completion of this program, participants are expected to be able to:',
    methodsTitle: '3.0 TEACHING METHODS',
    methodsIntro:
      'To ensure maximum effectiveness, this program will use an interactive and participant-centered blended learning approach. The methods to be used include:',
    outcomesTitle: '4.0 PROGRAM OUTCOMES',
    outcomesIntro:
      'This program is designed to have a significant impact not only on individuals but also on the organization as a whole. Expected outcomes include:',
    hrdCorpTitle: 'HRD CORP COMPLIANCE & COURSE EVALUATION',
    modulesTitle: '5.0 MODULE PROPOSAL',
    module: 'Module',
    tentativeTitle: '6.0 PROPOSED PROGRAM TENTATIVE',
    costTitle: '7.0 COST DETAILS',
    packageComparisonTitle: 'TRAINING PACKAGE COMPARISON',
    conclusionTitle: '8.0 CONCLUSION',
    preparedBy: 'Prepared by,',
    consultantTitle: 'TRAINING CONSULTANT',
    day: 'DAY',
    time: 'Time',
    activity: 'Activity',
    registration: 'Registration & Breakfast',
    session1_intro: 'Introduction & Ice Breaking',
    session1_module: 'Module',
    morningBreak: 'Morning Break',
    session2_module: 'Module',
    lunchBreak: 'Lunch, Rest & Zohor Prayer',
    session3: 'Practical Training / Group Discussion',
    afternoonBreak: 'Afternoon Break & Asar Prayer',
    session4: 'Summary & Q&A Session',
    eveningRest: 'Rest, Dinner & Prayers',
    eveningSession: 'Evening Session: Casual Activity / Sharing Session',
    costIntro: 'The following is the estimated cost breakdown for this program:',
    bilHeader: 'No.',
    item: 'Item',
    calculation: 'Calculation',
    totalRM: 'Total (RM)',
    speakerFee: "Professional Speaker's Fee",
    pakejLabel: 'Participant Package & Logistics',
    pakejCalc: 'Remaining balance after speaker fee & contingency',
    contingency: 'Contingency (10%)',
    contingencyCalc: '10% of balance',
    subTotalLabel: 'SUB-TOTAL',
    discountLabel: 'Special Discount',
    sstLabel: 'Service Tax (SST 8%)',
    totalBudgetLabel: 'GRAND TOTAL',
    costNote:
      '*Note: This cost estimate is based on the information provided and is subject to final commercial agreement.',
    page: 'Page',
    venueMetaLabel: 'Venue',
    dateMetaLabel: 'Dates',
    participantsMetaLabel: 'Participants',
    paxUnit: 'pax',
    sessionPrefix: 'Session',
    partA: 'Part A',
    partB: 'Part B',
    coverLetterTitle: 'OFFICIAL COVER LETTER',
    quotationTitle: 'OFFICIAL QUOTATION',
    trainerCvTitle: 'LEAD TRAINER & CONSULTANT PROFILE',
  },
};

export function getSampleFormData(
  language: Language,
  todayIso: string,
  endIso: string,
  existing?: Partial<ProposalFormData>
): ProposalFormData {
  const base: ProposalFormData =
    language === 'english'
      ? {
          bahasa: 'english',
          namaProgram: 'Strategic Leadership & High-Performance Culture 2026',
          namaSyarikat: 'Sime Darby Logistics Sdn Bhd',
          namaPenerimaSurat: 'Head of Learning & Development',
          noRujukan: 'IN/PROP/2026/018',
          sektorOrganisasi: 'Korporat / GLC',
          tahapPeserta: 'Pengurusan Pertengahan & Eksekutif',
          huraianProgram:
            'A 2-day intensive leadership development program for 30 mid-level managers and team leads focused on cross-functional alignment, decision-making under pressure, and KPI execution.',
          bilanganHari: 2,
          bilanganPeserta: 30,
          tarikhMula: todayIso,
          tarikhAkhir: endIso,
          lokasiProgram: 'Hotel',
          bajetPerPeserta: 280,
          kadarPenceramahHarian: 3500,
          costMode: 'auto',
          customCostItems: existing?.customCostItems || [],
          diskaunPeratus: 0,
          sertakanSst: false,
          sertakanPerbandinganPakej: true,
          sertakanHrdCorp: true,
          sertakanSuratIringan: true,
          sertakanSebutHarga: true,
          sesiMalamAktif: [1],
        }
      : {
          bahasa: 'melayu',
          namaProgram: 'Kursus Kepimpinan Strategik & Pengurusan Pasukan Berimpak Tinggi',
          namaSyarikat: 'Perbadanan Kemajuan Ekonomi Negeri',
          namaPenerimaSurat: 'Pengarah Bahagian Sumber Manusia',
          noRujukan: 'IN/PROP/2026/018',
          sektorOrganisasi: 'Kerajaan / Agensi',
          tahapPeserta: 'Pengurusan Pertengahan & Eksekutif',
          huraianProgram:
            'Program latihan intensif selama 2 hari untuk 30 orang pengurus pertengahan dan ketua unit bagi memperkukuh komunikasi strategik, penyelesaian masalah berstruktur, dan pelaksanaan KPI jabatan.',
          bilanganHari: 2,
          bilanganPeserta: 30,
          tarikhMula: todayIso,
          tarikhAkhir: endIso,
          lokasiProgram: 'Hotel',
          bajetPerPeserta: 250,
          kadarPenceramahHarian: 3500,
          costMode: 'auto',
          customCostItems: existing?.customCostItems || [],
          diskaunPeratus: 0,
          sertakanSst: false,
          sertakanPerbandinganPakej: true,
          sertakanHrdCorp: true,
          sertakanSuratIringan: true,
          sertakanSebutHarga: true,
          sesiMalamAktif: [1],
        };

  return base;
}

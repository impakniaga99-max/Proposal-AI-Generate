import type { Language, ProposalFormData } from '../types/proposal';

export interface UILabels {
  navEditor: string;
  navDrafts: string;
  navGuide: string;
  downloadPdf: string;
  downloadingPdf: string;
  printDoc: string;
  formTitle: string;
  loadSample: string;
  resetForm: string;
  languageLabel: string;
  programNameLabel: string;
  programNamePlaceholder: string;
  companyNameLabel: string;
  companyNamePlaceholder: string;
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
  budgetPerPaxLabel: string;
  liveTotalLabel: string;
  speakerAllocationLabel: string;
  additionalSessionsLabel: string;
  eveningSessionPrefix: string;
  nightLabel: string;
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
  draftsHeading: string;
  draftsEmpty: string;
  draftsSearchPlaceholder: string;
  openDraft: string;
  deleteDraft: string;
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
  modulesTitle: string;
  module: string;
  tentativeTitle: string;
  costTitle: string;
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
  speakerCalcSuffix: string;
  pakejLabel: string;
  pakejCalc: string;
  contingency: string;
  contingencyCalc: string;
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
}

export const uiLabels: Record<Language, UILabels> = {
  melayu: {
    navEditor: 'Penyedia Kertas Kerja',
    navDrafts: 'Draf Tersimpan',
    navGuide: 'Panduan Format',
    downloadPdf: 'Muat Turun PDF',
    downloadingPdf: 'Menjana PDF...',
    printDoc: 'Cetak',
    formTitle: 'Maklumat Program',
    loadSample: 'Isi Contoh',
    resetForm: 'Set Semula',
    languageLabel: 'Bahasa Kertas Kerja',
    programNameLabel: 'Nama Program',
    programNamePlaceholder: 'Contoh: Kursus Kepimpinan Strategik 2026',
    companyNameLabel: 'Nama Syarikat / Agensi',
    companyNamePlaceholder: 'Contoh: Tenaga Nasional Berhad',
    descriptionLabel: 'Huraian Ringkas',
    descriptionPlaceholder: 'Nyatakan objektif utama, tahap jawatan peserta, dan cabaran organisasi...',
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
    budgetPerPaxLabel: 'Bajet / Peserta / Hari (RM)',
    liveTotalLabel: 'Anggaran Kutipan',
    speakerAllocationLabel: 'Yuran Penceramah',
    additionalSessionsLabel: 'Sesi Tambahan (Malam)',
    eveningSessionPrefix: 'Sesi Malam',
    nightLabel: 'Malam',
    generateButton: 'Jana Kertas Kerja',
    generatingButton: 'Menjana Kandungan...',
    regenerateButton: 'Jana Semula',
    emptyStateTitle: 'Sedia untuk menyediakan kertas kerja cadangan',
    emptyStateSubtitle:
      'Lengkapkan maklumat program di sebelah kiri atau muatkan contoh program untuk menjana kertas kerja korporat format A4 berserta jadual tentatif dan perincian kos.',
    emptyStateAction: 'Isi Contoh & Cuba',
    docReadyTitle: 'Kertas Kerja Siap',
    editModeOn: 'Selesai Sunting',
    editModeOff: 'Sunting Teks',
    saveDraft: 'Simpan Draf',
    draftSaved: 'Disimpan',
    draftsHeading: 'Rekod Draf Kertas Kerja',
    draftsEmpty: 'Tiada draf kertas kerja disimpan lagi. Jana dan simpan kertas kerja pertama anda untuk rujukan pantas.',
    draftsSearchPlaceholder: 'Cari nama program atau syarikat...',
    openDraft: 'Buka',
    deleteDraft: 'Padam',
    guideHeading: 'Piawaian Struktur & Pengiraan Kertas Kerja Impak Niaga',
    footerText: 'Penjana Kertas Kerja AI · Dikuasakan oleh Impak Niaga',
  },
  english: {
    navEditor: 'Proposal Workbench',
    navDrafts: 'Saved Drafts',
    navGuide: 'Format Standard',
    downloadPdf: 'Download PDF',
    downloadingPdf: 'Exporting PDF...',
    printDoc: 'Print',
    formTitle: 'Program Details',
    loadSample: 'Load Sample',
    resetForm: 'Reset',
    languageLabel: 'Proposal Language',
    programNameLabel: 'Program Name',
    programNamePlaceholder: 'e.g., Executive Leadership & Alignment 2026',
    companyNameLabel: 'Client Organization',
    companyNamePlaceholder: 'e.g., Meridian Logistics Sdn Bhd',
    descriptionLabel: 'Program Brief',
    descriptionPlaceholder: 'Describe target objectives, participant roles, and organizational challenges...',
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
    budgetPerPaxLabel: 'Budget / Pax / Day (RM)',
    liveTotalLabel: 'Total Collection',
    speakerAllocationLabel: 'Speaker Fee',
    additionalSessionsLabel: 'Additional Evening Sessions',
    eveningSessionPrefix: 'Evening Session',
    nightLabel: 'Night',
    generateButton: 'Generate Proposal',
    generatingButton: 'Generating Proposal...',
    regenerateButton: 'Regenerate',
    emptyStateTitle: 'Ready to draft your corporate proposal',
    emptyStateSubtitle:
      'Complete the program details on the left or load a sample brief to generate an A4-formatted proposal with an itemized schedule and budget breakdown.',
    emptyStateAction: 'Load Sample Brief',
    docReadyTitle: 'Proposal Ready',
    editModeOn: 'Done Editing',
    editModeOff: 'Edit Text',
    saveDraft: 'Save Draft',
    draftSaved: 'Saved',
    draftsHeading: 'Saved Proposal Drafts',
    draftsEmpty: 'No saved proposal drafts yet. Generate and save a proposal to access it here anytime.',
    draftsSearchPlaceholder: 'Search program or client name...',
    openDraft: 'Open',
    deleteDraft: 'Delete',
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
    modulesTitle: '5.0 CADANGAN MODUL',
    module: 'Modul',
    tentativeTitle: '6.0 CADANGAN TENTATIF PROGRAM',
    costTitle: '7.0 PERINCIAN KOS',
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
    speakerCalcSuffix: '/hari',
    pakejLabel: 'Pakej Latihan Peserta & Kos Logistik',
    pakejCalc: 'Baki selepas yuran penceramah & kontigensi',
    contingency: 'Kontigensi (10%)',
    contingencyCalc: '10% daripada baki',
    totalBudgetLabel: 'JUMLAH BAJET KUTIPAN',
    costNote:
      '*Nota: Anggaran kos ini adalah berdasarkan maklumat yang diberikan dan tertakluk kepada perubahan. Sebut harga rasmi akan dikeluarkan selepas perbincangan lanjut.',
    page: 'Muka Surat',
    venueMetaLabel: 'Lokasi',
    dateMetaLabel: 'Tarikh',
    participantsMetaLabel: 'Peserta',
    paxUnit: 'orang',
    sessionPrefix: 'Sesi',
    partA: 'Bahagian A',
    partB: 'Bahagian B',
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
    modulesTitle: '5.0 MODULE PROPOSAL',
    module: 'Module',
    tentativeTitle: '6.0 PROPOSED PROGRAM TENTATIVE',
    costTitle: '7.0 COST DETAILS',
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
    speakerCalcSuffix: '/day',
    pakejLabel: 'Participant Package & Logistics',
    pakejCalc: 'Remaining balance after speaker fee & contingency',
    contingency: 'Contingency (10%)',
    contingencyCalc: '10% of balance',
    totalBudgetLabel: 'TOTAL BUDGET (COLLECTION)',
    costNote:
      '*Note: This cost estimate is based on the information provided and is subject to change. An official quotation will be issued after further discussion.',
    page: 'Page',
    venueMetaLabel: 'Venue',
    dateMetaLabel: 'Dates',
    participantsMetaLabel: 'Participants',
    paxUnit: 'pax',
    sessionPrefix: 'Session',
    partA: 'Part A',
    partB: 'Part B',
  },
};

export function getSampleFormData(language: Language, todayIso: string, endIso: string): ProposalFormData {
  if (language === 'english') {
    return {
      bahasa: 'english',
      namaProgram: 'Strategic Leadership & High-Performance Culture 2026',
      namaSyarikat: 'Sime Darby Logistics Sdn Bhd',
      huraianProgram:
        'A 2-day intensive leadership development program for 30 mid-level managers and team leads focused on cross-functional alignment, decision-making under pressure, and KPI execution.',
      bilanganHari: 2,
      bilanganPeserta: 30,
      tarikhMula: todayIso,
      tarikhAkhir: endIso,
      lokasiProgram: 'Hotel',
      bajetPerPeserta: 280,
      sesiMalamAktif: [1],
    };
  }
  return {
    bahasa: 'melayu',
    namaProgram: 'Kursus Kepimpinan Strategik & Pengurusan Pasukan Berimpak Tinggi',
    namaSyarikat: 'Perbadanan Kemajuan Ekonomi Negeri',
    huraianProgram:
      'Program latihan intensif selama 2 hari untuk 30 orang pengurus pertengahan dan ketua unit bagi memperkukuh komunikasi strategik, penyelesaian masalah berstruktur, dan pelaksanaan KPI jabatan.',
    bilanganHari: 2,
    bilanganPeserta: 30,
    tarikhMula: todayIso,
    tarikhAkhir: endIso,
    lokasiProgram: 'Hotel',
    bajetPerPeserta: 250,
    sesiMalamAktif: [1],
  };
}

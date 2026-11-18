import type {
  BrandingSettings,
  CustomCostItem,
  GeneratedModule,
  Language,
  ProposalFormData,
  TentativeDay,
  TentativeRow,
  TrainerProfile,
} from '../types/proposal';
import { docLabels } from './i18n';

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateEndDateIso(startDateIso: string, numDays: number): string {
  if (!startDateIso) return '';
  const parts = startDateIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return '';
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  const safeDays = Math.max(1, Math.floor(numDays) || 1);
  date.setDate(date.getDate() + safeDays - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatRM(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const fixed = safe.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `RM ${formattedInt}.${decPart}`;
}

export interface FullBudgetLine {
  id: string;
  description: string;
  calculationNote: string;
  amount: number;
}

export interface FullBudgetSummary {
  lines: FullBudgetLine[];
  subTotal: number;
  discountAmount: number;
  afterDiscount: number;
  sstAmount: number;
  grandTotal: number;
  feePenceramah: number;
  jumlahKosPakejDanLogistik: number;
  kontigensi: number;
  // Legacy alias kept for compatibility
  totalBajetKutipan: number;
}

export function calculateFullBudget(formData: ProposalFormData): FullBudgetSummary {
  const lang = formData.bahasa;
  const T = docLabels[lang];
  const safeDays = Math.max(1, formData.bilanganHari || 1);
  const safePax = Math.max(1, formData.bilanganPeserta || 1);
  const safeRate = Math.max(0, formData.bajetPerPeserta || 0);
  const speakerDailyRate = Math.max(0, formData.kadarPenceramahHarian ?? 3500);

  let lines: FullBudgetLine[] = [];
  let feePenceramah = speakerDailyRate * safeDays;
  let jumlahKosPakejDanLogistik = 0;
  let kontigensi = 0;

  if (formData.costMode === 'custom' && formData.customCostItems.length > 0) {
    lines = formData.customCostItems.map((item) => ({
      id: item.id,
      description: item.description,
      calculationNote: item.calculationNote,
      amount: Math.max(0, Number(item.amount) || 0),
    }));
    feePenceramah = lines[0]?.amount ?? 0;
    jumlahKosPakejDanLogistik = lines.slice(1).reduce((acc, item) => acc + item.amount, 0);
    kontigensi = 0;
  } else {
    const baseCollection = safeRate * safePax * safeDays;
    const baki = baseCollection - feePenceramah;
    kontigensi = Math.max(0, baki * 0.1);
    jumlahKosPakejDanLogistik = Math.max(0, baki - kontigensi);
    const speakerCalc =
      lang === 'english'
        ? `${formatRM(speakerDailyRate)}/day × ${safeDays} ${safeDays > 1 ? 'days' : 'day'}`
        : `${formatRM(speakerDailyRate)}/hari × ${safeDays} hari`;

    lines = [
      {
        id: 'speaker',
        description: T.speakerFee,
        calculationNote: speakerCalc,
        amount: feePenceramah,
      },
      {
        id: 'package',
        description: T.pakejLabel,
        calculationNote: T.pakejCalc,
        amount: jumlahKosPakejDanLogistik,
      },
      {
        id: 'contingency',
        description: T.contingency,
        calculationNote: T.contingencyCalc,
        amount: kontigensi,
      },
    ];
  }

  const subTotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const discountPct = Math.max(0, Math.min(50, formData.diskaunPeratus || 0));
  const discountAmount = subTotal * (discountPct / 100);
  const afterDiscount = Math.max(0, subTotal - discountAmount);
  const sstAmount = formData.sertakanSst ? afterDiscount * 0.08 : 0;
  const grandTotal = afterDiscount + sstAmount;

  return {
    lines,
    subTotal,
    discountAmount,
    afterDiscount,
    sstAmount,
    grandTotal,
    feePenceramah,
    jumlahKosPakejDanLogistik,
    kontigensi,
    totalBajetKutipan: grandTotal,
  };
}

export interface PackageTierComparison {
  name: string;
  venue: string;
  includes: string;
  pricePerPax: number;
  totalPrice: number;
  recommended?: boolean;
}

export function buildPackageTiers(formData: ProposalFormData): PackageTierComparison[] {
  const isEn = formData.bahasa === 'english';
  const days = Math.max(1, formData.bilanganHari || 1);
  const pax = Math.max(1, formData.bilanganPeserta || 1);
  const speakerDaily = Math.max(0, formData.kadarPenceramahHarian ?? 3500);
  const speakerTotal = speakerDaily * days;

  // Tier 1: In-House (Client Premise)
  const inHouseTotal = speakerTotal + pax * 45 * days;
  // Tier 2: Seminar Hall
  const hallTotal = speakerTotal + pax * 120 * days + 1200 * days;
  // Tier 3: Full Hotel Package
  const hotelBase = Math.max(formData.bajetPerPeserta * pax * days, speakerTotal + pax * 220 * days);

  return [
    {
      name: isEn ? 'Package A: In-House' : 'Pakej A: Premis Sendiri',
      venue: isEn ? 'Client Premise' : 'Premis Klien',
      includes: isEn
        ? 'Trainer fee, softcopy modules, certificates, pre/post assessment'
        : 'Fee penceramah, nota digital, sijil penyertaan, penilaian pra/pasca',
      pricePerPax: inHouseTotal / pax,
      totalPrice: inHouseTotal,
    },
    {
      name: isEn ? 'Package B: Seminar Hall' : 'Pakej B: Dewan Seminar',
      venue: isEn ? 'External Seminar Hall' : 'Dewan Seminar Luaran',
      includes: isEn
        ? 'Trainer fee, hall rental, AV system, 3x meals/day, printed workbook, certificates'
        : 'Fee penceramah, sewa dewan & AV, makan 3 kali sehari, buku kerja bercetak & sijil',
      pricePerPax: hallTotal / pax,
      totalPrice: hallTotal,
    },
    {
      name: isEn ? 'Package C: Executive Hotel' : 'Pakej C: Pakej Penuh Hotel',
      venue: isEn ? '4/5-Star Corporate Hotel' : 'Hotel Korporat 4/5 Bintang',
      includes: isEn
        ? 'All-inclusive hotel seminar package, meals, printed kits, executive report & certificates'
        : 'Pakej seminar hotel penuh, makan minum, kit latihan eksklusif, laporan impak & sijil',
      pricePerPax: hotelBase / pax,
      totalPrice: hotelBase,
      recommended: true,
    },
  ];
}

export function createDefaultCustomCostItems(formData: ProposalFormData): CustomCostItem[] {
  const isEn = formData.bahasa === 'english';
  const days = Math.max(1, formData.bilanganHari || 1);
  const pax = Math.max(1, formData.bilanganPeserta || 1);
  const speakerDaily = Math.max(0, formData.kadarPenceramahHarian ?? 3500);

  return [
    {
      id: 'item-1',
      description: isEn ? "Professional Speaker's Fee" : 'Fee Penceramah Profesional',
      calculationNote: `${formatRM(speakerDaily)} × ${days} ${isEn ? 'days' : 'hari'}`,
      amount: speakerDaily * days,
    },
    {
      id: 'item-2',
      description: isEn ? 'Training Hall & Audio-Visual' : 'Sewa Dewan & Sistem Audio Visual',
      calculationNote: `${days} ${isEn ? 'days' : 'hari'}`,
      amount: 1500 * days,
    },
    {
      id: 'item-3',
      description: isEn ? 'Participant Meals & Refreshments' : 'Makan & Minum Peserta',
      calculationNote: `${pax} ${isEn ? 'pax' : 'org'} × ${days} ${isEn ? 'days' : 'hari'}`,
      amount: pax * 85 * days,
    },
    {
      id: 'item-4',
      description: isEn ? 'Modules, Materials & Certificates' : 'Bahan Modul, Kit Latihan & Sijil',
      calculationNote: `${pax} ${isEn ? 'pax' : 'org'}`,
      amount: pax * 40,
    },
  ];
}

export function buildTentativeSchedule(
  startDateIso: string,
  numDays: number,
  sesiMalamAktif: number[],
  language: Language,
  modules?: GeneratedModule[]
): TentativeDay[] {
  const T = docLabels[language];
  const locale = language === 'english' ? 'en-GB' : 'ms-MY';
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const parts = startDateIso.split('-').map(Number);
  const baseDate =
    parts.length === 3 && !parts.some(Number.isNaN)
      ? new Date(parts[0], parts[1] - 1, parts[2])
      : new Date();

  const safeDays = Math.max(1, Math.min(14, numDays || 1));
  const days: TentativeDay[] = [];
  const mods = modules && modules.length > 0 ? modules : [];

  for (let i = 0; i < safeDays; i++) {
    const currentDate = new Date(baseDate.getTime());
    currentDate.setDate(baseDate.getDate() + i);
    const formattedDate = currentDate.toLocaleDateString(locale, options);
    const dayNumber = i + 1;

    // Map AI-generated module titles dynamically across program days
    const modAIndex = (i * 2) % Math.max(1, mods.length);
    const modBIndex = (i * 2 + 1) % Math.max(1, mods.length);
    const modATitle = mods[modAIndex]?.namaModul;
    const modBTitle = mods[modBIndex]?.namaModul;

    const session1Activity =
      i === 0
        ? modATitle
          ? `${T.sessionPrefix} 1: ${T.session1_intro} & ${T.session1_module} 1 (${modATitle})`
          : `${T.sessionPrefix} 1: ${T.session1_intro}`
        : modATitle
        ? `${T.sessionPrefix} 1: ${T.session1_module} ${modAIndex + 1} (${modATitle})`
        : `${T.sessionPrefix} 1: ${T.session1_module} ${i + 1} - ${T.partA}`;

    const session2Activity = modBTitle
      ? `${T.sessionPrefix} 2: ${T.session2_module} ${modBIndex + 1} (${modBTitle})`
      : `${T.sessionPrefix} 2: ${T.session2_module} ${i === 0 ? 1 : i + 1}`;

    const rows: TentativeRow[] = [
      {
        time: language === 'melayu' ? '08:30 pagi - 09:00 pagi' : '08:30 AM - 09:00 AM',
        activity: T.registration,
      },
      {
        time: language === 'melayu' ? '09:00 pagi - 10:30 pagi' : '09:00 AM - 10:30 AM',
        activity: session1Activity,
      },
      {
        time: language === 'melayu' ? '10:30 pagi - 11:00 pagi' : '10:30 AM - 11:00 AM',
        activity: T.morningBreak,
      },
      {
        time: language === 'melayu' ? '11:00 pagi - 01:00 t/hari' : '11:00 AM - 01:00 PM',
        activity: session2Activity,
      },
      {
        time: language === 'melayu' ? '01:00 t/hari - 02:30 petang' : '01:00 PM - 02:30 PM',
        activity: T.lunchBreak,
      },
      {
        time: language === 'melayu' ? '02:30 petang - 04:00 petang' : '02:30 PM - 04:00 PM',
        activity: `${T.sessionPrefix} 3: ${T.session3}`,
      },
      {
        time: language === 'melayu' ? '04:00 petang - 04:30 petang' : '04:00 PM - 04:30 PM',
        activity: T.afternoonBreak,
      },
      {
        time: language === 'melayu' ? '04:30 petang - 05:30 petang' : '04:30 PM - 05:30 PM',
        activity: `${T.sessionPrefix} 4: ${T.session4}`,
      },
    ];

    if (sesiMalamAktif.includes(dayNumber) && dayNumber < safeDays) {
      rows.push(
        {
          time: language === 'melayu' ? '05:30 petang - 08:30 malam' : '05:30 PM - 08:30 PM',
          activity: T.eveningRest,
        },
        {
          time: language === 'melayu' ? '08:30 malam - 10:30 malam' : '08:30 PM - 10:30 PM',
          activity: `${T.eveningSession} (${
            language === 'melayu' ? `Malam ${dayNumber}` : `Night ${dayNumber}`
          })`,
        }
      );
    }

    days.push({
      dayNumber,
      formattedDate: formattedDate.toUpperCase(),
      rows,
    });
  }

  return days;
}

export function paginateTentativeDays(days: TentativeDay[]): TentativeDay[][] {
  if (days.length === 0) return [];
  const MAX_PAGE_WEIGHT = 22; // Safe fit for 297mm A4 sheet including header/footer
  const pages: TentativeDay[][] = [];
  let currentPage: TentativeDay[] = [];
  let currentWeight = 0;

  for (const day of days) {
    // Estimate vertical weight: day header/table-head (~3) + each row (1 or 2 if long wrapping text)
    const rowWeight = day.rows.reduce((sum, r) => {
      const lines = Math.max(1, Math.ceil((r.activity || '').length / 58));
      return sum + lines;
    }, 0);
    const dayWeight = 3 + rowWeight;

    if (currentPage.length > 0 && (currentWeight + dayWeight > MAX_PAGE_WEIGHT || currentPage.length >= 2)) {
      pages.push(currentPage);
      currentPage = [day];
      currentWeight = dayWeight;
    } else {
      currentPage.push(day);
      currentWeight += dayWeight;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

export function getDefaultBrandingSettings(): BrandingSettings {
  return {
    companyName: 'Impak Niaga Training & Consultancy',
    regNo: '202203148291 (003409281-K)',
    address: 'Aras 5, Menara Korporat Impak, Jalan Sultan Ismail, 50250 Kuala Lumpur',
    phone: '+603-2181 4900',
    email: 'impakniaga99@gmail.com',
    refPrefix: 'IN/PROP/2026',
    consultantName: 'Ahmad Faizal Bin Razak',
    consultantRole: 'Ketua Perunding Latihan',
    clientLogoDataUrl: '',
    signatureDataUrl: '',
    stampDataUrl: '',
  };
}

export function getDefaultTrainerProfile(): TrainerProfile {
  return {
    enabled: false,
    name: 'Ahmad Faizal Bin Razak, HRD Corp TTT',
    title: 'Perunding Kanan Kepimpinan & Transformasi Organisasi',
    photoDataUrl: '',
    qualifications:
      'Sarjana Pentadbiran Perniagaan (MBA), Jurulatih Bertauliah HRD Corp (TTT/18492), Pengamal Pengurusan Perubahan Prosci',
    expertise:
      'Kepimpinan Strategik, Komunikasi Eksekutif, Pengurusan Prestasi Pasukan & Penjajaran KPI Korporat',
    pastClients:
      'Petronas Dagangan, Tenaga Nasional Berhad, Bank Islam Malaysia, Perbadanan Kemajuan Negeri, Pos Malaysia',
  };
}

export async function compressImageToDataUrl(
  file: File,
  maxDimension = 360,
  preserveTransparency = false
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca fail imej.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format imej tidak disokong.'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Kanvas imej tidak tersedia.'));
          return;
        }
        if (!preserveTransparency) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mime = preserveTransparency ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, 0.82);
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

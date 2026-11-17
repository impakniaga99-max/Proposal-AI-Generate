import type { Language } from '../types/proposal';
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
  const fixed = value.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `RM ${formattedInt}.${decPart}`;
}

export interface BudgetSummary {
  totalBajetKutipan: number;
  feePenceramah: number;
  baki: number;
  kontigensi: number;
  jumlahKosPakejDanLogistik: number;
}

export function calculateBudgetSummary(
  numDays: number,
  numPeserta: number,
  bajetPerPax: number
): BudgetSummary {
  const safeDays = Math.max(1, numDays || 1);
  const safePax = Math.max(1, numPeserta || 1);
  const safeRate = Math.max(0, bajetPerPax || 0);

  const totalBajetKutipan = safeRate * safePax * safeDays;
  const feePenceramah = 3500 * safeDays;
  const baki = totalBajetKutipan - feePenceramah;
  const kontigensi = baki * 0.1;
  const jumlahKosPakejDanLogistik = baki - kontigensi;

  return {
    totalBajetKutipan,
    feePenceramah,
    baki,
    kontigensi,
    jumlahKosPakejDanLogistik,
  };
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

export function buildTentativeSchedule(
  startDateIso: string,
  numDays: number,
  sesiMalamAktif: number[],
  language: Language
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

  for (let i = 0; i < safeDays; i++) {
    const currentDate = new Date(baseDate.getTime());
    currentDate.setDate(baseDate.getDate() + i);
    const formattedDate = currentDate.toLocaleDateString(locale, options);
    const dayNumber = i + 1;

    const rows: TentativeRow[] = [
      { time: '08:30 AM - 09:00 AM', activity: T.registration },
      {
        time: '09:00 AM - 10:30 AM',
        activity: `${T.sessionPrefix} 1: ${
          i === 0 ? T.session1_intro : `${T.session1_module} ${i + 1} - ${T.partA}`
        }`,
      },
      { time: '10:30 AM - 11:00 AM', activity: T.morningBreak },
      {
        time: '11:00 AM - 01:00 PM',
        activity: `${T.sessionPrefix} 2: ${
          i === 0 ? `${T.session2_module} 1` : `${T.session2_module} ${i + 1} - ${T.partB}`
        }`,
      },
      { time: '01:00 PM - 02:30 PM', activity: T.lunchBreak },
      { time: '02:30 PM - 04:00 PM', activity: `${T.sessionPrefix} 3: ${T.session3}` },
      { time: '04:00 PM - 04:30 PM', activity: T.afternoonBreak },
      { time: '04:30 PM - 05:30 PM', activity: `${T.sessionPrefix} 4: ${T.session4}` },
    ];

    if (language === 'melayu') {
      rows[0].time = '08:30 pagi - 09:00 pagi';
      rows[1].time = '09:00 pagi - 10:30 pagi';
      rows[2].time = '10:30 pagi - 11:00 pagi';
      rows[3].time = '11:00 pagi - 01:00 t/hari';
      rows[4].time = '01:00 t/hari - 02:30 petang';
      rows[5].time = '02:30 petang - 04:00 petang';
      rows[6].time = '04:00 petang - 04:30 petang';
      rows[7].time = '04:30 petang - 05:30 petang';
    }

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

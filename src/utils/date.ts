// src/utils/date.ts

export const EXAM_DATE_STR = '2026-12-13'; // Sunday
export const EXAM_TIME_START = '14:00'; // 2:00 PM IST
export const STUDY_START_DATE_STR = '2026-10-02'; // Friday
export const FINAL_WEEK_START_STR = '2026-12-07';
export const NO_NEW_TOPICS_DATE_STR = '2026-11-30';

/**
 * Returns current simulated or real date in YYYY-MM-DD format
 */
export function formatDateYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateYMD(ymd: string): Date {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Noon to avoid DST issues
}

export function formatFriendlyDate(ymd: string): string {
  try {
    const d = parseDateYMD(ymd);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return ymd;
  }
}

export function formatShortDate(ymd: string): string {
  try {
    const d = parseDateYMD(ymd);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return ymd;
  }
}

export function addDays(ymd: string, days: number): string {
  const d = parseDateYMD(ymd);
  d.setDate(d.getDate() + days);
  return formatDateYMD(d);
}

export function daysBetween(startYmd: string, endYmd: string): number {
  const d1 = parseDateYMD(startYmd);
  const d2 = parseDateYMD(endYmd);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExamDay: boolean;
  isPostExam: boolean;
  totalHoursRemaining: number;
}

export function calculateCountdown(currentYmd: string, currentTimeString = '08:00'): CountdownResult {
  if (currentYmd === EXAM_DATE_STR) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExamDay: true,
      isPostExam: false,
      totalHoursRemaining: 0,
    };
  }

  const daysDiff = daysBetween(currentYmd, EXAM_DATE_STR);
  if (daysDiff < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExamDay: false,
      isPostExam: true,
      totalHoursRemaining: 0,
    };
  }

  // Calculate hours remaining until 14:00 on exam day
  const [ch, cm] = currentTimeString.split(':').map(Number);
  const targetHour = 14;
  const hoursLeftToday = Math.max(0, 24 - ch);
  const totalHours = (daysDiff - 1) * 24 + hoursLeftToday + targetHour;

  return {
    days: daysDiff,
    hours: 14,
    minutes: 0,
    seconds: 0,
    isExamDay: false,
    isPostExam: false,
    totalHoursRemaining: Math.max(0, totalHours),
  };
}

export function isFinalWeek(ymd: string): boolean {
  return ymd >= FINAL_WEEK_START_STR && ymd <= EXAM_DATE_STR;
}

export function isLightOnlyDay(ymd: string): boolean {
  return ymd === '2026-12-12';
}

export function isExamDay(ymd: string): boolean {
  return ymd === EXAM_DATE_STR;
}

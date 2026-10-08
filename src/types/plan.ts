// src/types/plan.ts

export type PlanPhaseId = 1 | 2 | 3 | 4 | 5 | 6;

export interface PlanPhase {
  id: PlanPhaseId;
  name: string;
  dateRange: string; // e.g. "2-18 Oct"
  startDate: string; // "2026-10-02"
  endDate: string; // "2026-10-18"
  primaryFocus: string;
  mockTarget: string; // e.g. "1 diagnostic mock + 3 sectionals"
  questionTarget: string; // e.g. "~400-500 mixed Qs"
  whatToAvoid: string; // e.g. "Avoid advanced puzzles, deep static lists"
  rules: string[];
}

export type TaskCategory =
  | 'english'
  | 'logical'
  | 'gk_ca'
  | 'practice'
  | 'test'
  | 'revision'
  | 'warmup'
  | 'mock_analysis';

export interface PlanTask {
  id: string;
  category: TaskCategory;
  title: string;
  description: string;
  targetCount?: string; // e.g. "2 passages", "30 Qs", "30-45 min"
  sectionId?: 'english' | 'ca_gk' | 'logical';
  topicId?: string;
  priority: 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  isEssential: boolean; // For rebalancer logic
}

export interface PlanDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  phaseId: PlanPhaseId;
  weekNumber: number;
  isExactPdfSeed: boolean; // True for Days 2-8 Oct & Final 7 Days (7-12 Dec) & 13 Dec
  derivedRuleExplanation?: string; // e.g. "Derived from PDF pattern: weekday core + priority matrix"
  dayType: 'normal' | 'intensive' | 'mock_day' | 'light_only' | 'exam_day';
  targetHours: number; // 5.5, 7.0, 6.0, 3.0, 0
  scheduleBlocks: {
    timeSlot: string; // e.g. "08:00 - 08:45"
    activity: string;
    focus: string;
  }[];
  tasks: PlanTask[];
  completedCount: number;
  totalTasks: number;
  notes?: string;
  isTracked: boolean; // Days before first app usage are "not tracked", not "missed"
  isMissed?: boolean;
  rebalancedFromDate?: string;
}

export interface RebalanceLog {
  timestamp: string;
  rebalancedDays: string[];
  tasksMoved: { taskId: string; title: string; fromDate: string; toDate: string; priority: string }[];
  tasksDropped: { taskId: string; title: string; fromDate: string; reason: string }[];
  summary: string;
}

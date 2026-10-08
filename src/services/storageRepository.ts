// src/services/storageRepository.ts
import { ExamConfig } from '../types/exam';
import { PlanDay, RebalanceLog } from '../types/plan';
import { MockAttemptResult, ActiveTestState } from '../types/mock';
import { ErrorNotebookEntry } from '../types/error';
import { SpacedRevisionItem } from '../types/revision';
import { CurrentAffairItem } from '../types/ca';
import { QuestionItem } from '../types/question';
import { DEFAULT_EXAM_CONFIG } from '../config/defaultExamConfig';
import { generateFullStudyPlan } from './planRebalancer';
import { createInitialSpacedItems } from './spacedRevisionEngine';
import { SEED_QUESTIONS } from '../data/seedQuestions';

export interface StudentSettings {
  simulatedDate: string; // YYYY-MM-DD
  isDateSimulationActive: boolean;
  omrPracticePromptEnabled: boolean;
  dailyStudyHoursGoal: number;
  accuracyThreshold: number; // For adaptive weak area detection (default 60%)
  minAttemptsForWeakDetection: number; // default 5
}

export interface FullBackupPayload {
  version: string;
  exportedAt: string;
  examConfig: ExamConfig;
  planDays: PlanDay[];
  mockAttempts: MockAttemptResult[];
  errorEntries: ErrorNotebookEntry[];
  spacedRevisionItems: SpacedRevisionItem[];
  currentAffairs: CurrentAffairItem[];
  questions: QuestionItem[];
  settings: StudentSettings;
  rebalanceLogs: RebalanceLog[];
}

const STORAGE_KEYS = {
  EXAM_CONFIG: 'ailet2027_exam_config',
  PLAN_DAYS: 'ailet2027_plan_days',
  MOCK_ATTEMPTS: 'ailet2027_mock_attempts',
  ACTIVE_TEST: 'ailet2027_active_test',
  ERROR_ENTRIES: 'ailet2027_error_entries',
  SPACED_REVISION: 'ailet2027_spaced_revision',
  CURRENT_AFFAIRS: 'ailet2027_current_affairs',
  QUESTIONS: 'ailet2027_questions',
  SETTINGS: 'ailet2027_settings',
  REBALANCE_LOGS: 'ailet2027_rebalance_logs',
};

export const DEFAULT_SETTINGS: StudentSettings = {
  simulatedDate: '2026-10-08', // Matches current session date (Week 1 end)
  isDateSimulationActive: false,
  omrPracticePromptEnabled: true,
  dailyStudyHoursGoal: 6.0,
  accuracyThreshold: 60,
  minAttemptsForWeakDetection: 5,
};

export class StorageRepository {
  static getExamConfig(): ExamConfig {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.EXAM_CONFIG);
      return val ? JSON.parse(val) : DEFAULT_EXAM_CONFIG;
    } catch {
      return DEFAULT_EXAM_CONFIG;
    }
  }

  static saveExamConfig(cfg: ExamConfig): void {
    localStorage.setItem(STORAGE_KEYS.EXAM_CONFIG, JSON.stringify(cfg));
  }

  static getPlanDays(): PlanDay[] {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.PLAN_DAYS);
      if (val) return JSON.parse(val);
      const generated = generateFullStudyPlan();
      StorageRepository.savePlanDays(generated);
      return generated;
    } catch {
      return generateFullStudyPlan();
    }
  }

  static savePlanDays(days: PlanDay[]): void {
    localStorage.setItem(STORAGE_KEYS.PLAN_DAYS, JSON.stringify(days));
  }

  static getMockAttempts(): MockAttemptResult[] {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.MOCK_ATTEMPTS);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  }

  static saveMockAttempts(attempts: MockAttemptResult[]): void {
    localStorage.setItem(STORAGE_KEYS.MOCK_ATTEMPTS, JSON.stringify(attempts));
  }

  static getActiveTest(): ActiveTestState | null {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEST);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  }

  static saveActiveTest(test: ActiveTestState | null): void {
    if (test === null) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEST);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TEST, JSON.stringify(test));
    }
  }

  static getErrorEntries(): ErrorNotebookEntry[] {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ERROR_ENTRIES);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  }

  static saveErrorEntries(entries: ErrorNotebookEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.ERROR_ENTRIES, JSON.stringify(entries));
  }

  static getSpacedRevisionItems(): SpacedRevisionItem[] {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SPACED_REVISION);
      if (val) return JSON.parse(val);
      const initial = createInitialSpacedItems('2026-10-02');
      StorageRepository.saveSpacedRevisionItems(initial);
      return initial;
    } catch {
      return createInitialSpacedItems('2026-10-02');
    }
  }

  static saveSpacedRevisionItems(items: SpacedRevisionItem[]): void {
    localStorage.setItem(STORAGE_KEYS.SPACED_REVISION, JSON.stringify(items));
  }

  static getCurrentAffairs(): CurrentAffairItem[] {
    try {
      // CA ships empty by default per Ground Rules (no fake CA)
      const val = localStorage.getItem(STORAGE_KEYS.CURRENT_AFFAIRS);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  }

  static saveCurrentAffairs(items: CurrentAffairItem[]): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_AFFAIRS, JSON.stringify(items));
  }

  static getQuestions(): QuestionItem[] {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (val) return JSON.parse(val);
      StorageRepository.saveQuestions(SEED_QUESTIONS);
      return SEED_QUESTIONS;
    } catch {
      return SEED_QUESTIONS;
    }
  }

  static saveQuestions(questions: QuestionItem[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }

  static getSettings(): StudentSettings {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return val ? { ...DEFAULT_SETTINGS, ...JSON.parse(val) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: StudentSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  static getRebalanceLogs(): RebalanceLog[] {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.REBALANCE_LOGS);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  }

  static saveRebalanceLogs(logs: RebalanceLog[]): void {
    localStorage.setItem(STORAGE_KEYS.REBALANCE_LOGS, JSON.stringify(logs));
  }

  static exportFullBackup(): string {
    const payload: FullBackupPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      examConfig: StorageRepository.getExamConfig(),
      planDays: StorageRepository.getPlanDays(),
      mockAttempts: StorageRepository.getMockAttempts(),
      errorEntries: StorageRepository.getErrorEntries(),
      spacedRevisionItems: StorageRepository.getSpacedRevisionItems(),
      currentAffairs: StorageRepository.getCurrentAffairs(),
      questions: StorageRepository.getQuestions(),
      settings: StorageRepository.getSettings(),
      rebalanceLogs: StorageRepository.getRebalanceLogs(),
    };
    return JSON.stringify(payload, null, 2);
  }

  static importFullBackup(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed: FullBackupPayload = JSON.parse(jsonString);
      if (!parsed.examConfig || !Array.isArray(parsed.planDays)) {
        return { success: false, error: 'Invalid backup structure: missing exam config or plan days.' };
      }

      if (parsed.examConfig) StorageRepository.saveExamConfig(parsed.examConfig);
      if (parsed.planDays) StorageRepository.savePlanDays(parsed.planDays);
      if (parsed.mockAttempts) StorageRepository.saveMockAttempts(parsed.mockAttempts);
      if (parsed.errorEntries) StorageRepository.saveErrorEntries(parsed.errorEntries);
      if (parsed.spacedRevisionItems) StorageRepository.saveSpacedRevisionItems(parsed.spacedRevisionItems);
      if (parsed.currentAffairs) StorageRepository.saveCurrentAffairs(parsed.currentAffairs);
      if (parsed.questions) StorageRepository.saveQuestions(parsed.questions);
      if (parsed.settings) StorageRepository.saveSettings(parsed.settings);
      if (parsed.rebalanceLogs) StorageRepository.saveRebalanceLogs(parsed.rebalanceLogs);

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to parse JSON file' };
    }
  }

  static resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
}

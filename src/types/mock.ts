// src/types/mock.ts
import { ScoreBreakdown, MistakeType } from './exam';

export type MockType =
  | 'full'
  | 'sectional'
  | 'topic'
  | 'mini'
  | 'daily_challenge'
  | 'mixed_practice'
  | 'weak_topic'
  | 'pyq_practice';

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string | null; // null if unattempted
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  visited: boolean;
}

export interface MockTestConfig {
  id: string;
  title: string;
  type: MockType;
  sectionId?: 'english' | 'ca_gk' | 'logical';
  durationMinutes: number;
  totalQuestions: number;
  questionIds: string[];
  isRecommendedSlot?: boolean; // 2:00-4:00 PM IST
  omrPracticePromptEnabled?: boolean; // Product design addition
  isOfficialPYQ?: boolean; // Only if legitimate PYQs imported
}

export interface ActiveTestState {
  testId: string;
  testTitle: string;
  type: MockType;
  durationMinutes: number;
  startedAtTimestamp: number; // Unix epoch ms
  targetEndTimestamp: number; // startedAtTimestamp + durationMinutes * 60 * 1000
  answers: Record<string, UserAnswer>;
  currentQuestionIndex: number;
  isPaused: boolean;
  pausedAtTimestamp?: number;
  totalPausedDurationMs: number;
  omrPromptAcknowledged: boolean;
}

export interface TwelvePointMockRecord {
  // 12 points per PDF specification
  point1_score: number; // Score/150
  point2_attempted: number;
  point3_correct: number;
  point4_wrong: number;
  point5_unattempted: number;
  point6_accuracyPercentage: number;
  point7_englishScore: number;
  point8_caGkScore: number;
  point9_logicalScore: number;
  point10_timeManagementIssues: string; // Student text
  point11_weakTopics: string[]; // Topic names / tags
  point12_correctiveActionNext3Days: string; // Student text
}

export interface MockAttemptResult {
  id: string;
  testId: string;
  testTitle: string;
  type: MockType;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO string
  durationMinutes: number;
  actualTimeSpentSeconds: number;
  scoreBreakdown: ScoreBreakdown;
  twelvePointRecord: TwelvePointMockRecord;
  questionResponses: Record<string, {
    questionId: string;
    sectionId: string;
    topicId: string;
    userAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    isUnattempted: boolean;
    timeSpentSeconds: number;
    mistakeType?: MistakeType;
    errorNotebookEntryId?: string;
  }>;
  isOmrModeUsed?: boolean;
}

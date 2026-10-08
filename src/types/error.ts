// src/types/error.ts
import { MistakeType } from './exam';

export type ReattemptStatus = 'scheduled' | 'reattempt_due' | 'resolved' | 'needs_reinforcement';

export interface ErrorNotebookEntry {
  id: string;
  date: string; // YYYY-MM-DD
  questionId: string;
  questionText: string;
  options: { id: string; text: string }[];
  studentAnswer: string | null;
  correctAnswer: string;
  explanation: string;
  subject: 'English' | 'Current Affairs & GK' | 'Logical Reasoning';
  sectionId: 'english' | 'ca_gk' | 'logical';
  topic: string;
  subtopic?: string;
  mistakeType: MistakeType;
  whyWrong: string; // Student reflection: e.g. "Misinterpreted assumption as conclusion"
  correctConcept: string; // Key takeaway / principle rule
  reattemptDate: string; // YYYY-MM-DD
  reattemptStatus: ReattemptStatus;
  reattemptCount: number;
  lastReattemptResult?: 'correct' | 'incorrect';
  isArchived?: boolean; // Never delete, archive allowed per PDF rules
  tags?: string[];
  mockAttemptId?: string;
  isAutoSuggestedMistakeType?: boolean;
}

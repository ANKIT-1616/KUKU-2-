// src/types/question.ts

export type QuestionStatus = 'VALIDATED' | 'SAMPLE' | 'DRAFT' | 'REVIEW_PENDING';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuestionItem {
  id: string;
  sectionId: 'english' | 'ca_gk' | 'logical';
  topicId: string;
  subtopicId?: string;
  difficulty: QuestionDifficulty;
  questionType: string; // e.g. "Reading Comprehension", "Syllogism", "Critical Reasoning - Assumption", "Principle + Fact"
  passage?: string; // For RC or group questions
  question: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  source: string; // "SAMPLE Demo", "Student Import", or specific cited official source
  sourceDate?: string;
  isPYQ?: boolean;
  pyqYear?: number;
  status: QuestionStatus;
  isBookmarked?: boolean;
  tags?: string[];
  qualityCheck: {
    passedAutomatedChecks: boolean;
    secondPassReviewDone: boolean;
    noExternalLawRequired: boolean;
    hasSingleCorrectAnswer: boolean;
    hasNoDuplicateOptions: boolean;
    notes?: string;
  };
}

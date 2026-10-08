// src/types/ca.ts

export type CACategory =
  | 'National'
  | 'International'
  | 'Economy'
  | 'Science & Technology'
  | 'Environment'
  | 'Sports'
  | 'Awards & Culture'
  | 'Static GK';

export type CAItemStatus = 'VERIFIED' | 'GENERATED_PRACTICE';

export interface CurrentAffairItem {
  id: string;
  date: string; // YYYY-MM-DD
  topic: string;
  category: CACategory;
  summary: string;
  keyFacts: string[];
  source: string; // REQUIRED for VERIFIED
  sourceDate: string; // REQUIRED for VERIFIED (YYYY-MM-DD)
  relatedExamTopic: string;
  status: CAItemStatus; // VERIFIED vs GENERATED_PRACTICE
  isImportantEvent: boolean;
  notes?: string;
  // PDF tracker columns
  tracker: {
    read: boolean;
    notesCreated: boolean;
    mcqsPracticed: boolean;
    rev1Done: boolean; // Weekly revision
    rev2Done: boolean; // Monthly revision
    finalPassDone: boolean; // Final phase rapid revision
  };
}

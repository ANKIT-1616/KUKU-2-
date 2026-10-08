// src/types/revision.ts

export type SpacedStage =
  | 'Day 0: Learn'
  | 'Day 1: Quick Revision'
  | 'Day 3: Practice'
  | 'Day 7: Revision'
  | 'Day 14: Test'
  | 'Final-Week Rapid Revision'
  | 'Mastered';

export type RevisionSubjectType =
  | 'english_rc_grammar'
  | 'english_vocab_micro'
  | 'logical_major_type'
  | 'static_gk_batch'
  | 'current_affairs_overlay'
  | 'error_notebook_reattempt';

export interface SpacedRevisionItem {
  id: string;
  title: string;
  subjectType: RevisionSubjectType;
  sectionId: 'english' | 'ca_gk' | 'logical';
  topicId: string;
  subtopicName?: string;
  stage: SpacedStage;
  stageIndex: number; // 0 to 5
  initialLearnDate: string; // YYYY-MM-DD
  nextDueDate: string; // YYYY-MM-DD
  lastCompletedDate?: string;
  recommendedAction: string; // e.g. "Review core rules (15 min)" or "Timed 20 Q drill"
  cadenceDescription: string;
  reviewHistory: {
    stage: SpacedStage;
    completedDate: string;
    scoreOrNotes?: string;
    passed: boolean;
  }[];
}

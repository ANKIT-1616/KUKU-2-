// src/services/spacedRevisionEngine.ts
import { SpacedRevisionItem, SpacedStage, RevisionSubjectType } from '../types/revision';
import { addDays } from '../utils/date';

/**
 * Standard PDF Spaced Cycle offset table:
 * Stage 0: Day 0 - Learn
 * Stage 1: Day 1 - Quick Revision (+1 day from initial)
 * Stage 2: Day 3 - Practice (+2 days from stage 1 = Day 3)
 * Stage 3: Day 7 - Revision (+4 days from stage 2 = Day 7)
 * Stage 4: Day 14 - Test (+7 days from stage 3 = Day 14)
 * Stage 5: Final-week rapid revision (scheduled for 2026-12-07 or on completion of Stage 4)
 */

export const STAGE_OFFSETS_FROM_INITIAL: Record<number, number> = {
  0: 0,
  1: 1,
  2: 3,
  3: 7,
  4: 14,
};

export const STAGES_ORDER: SpacedStage[] = [
  'Day 0: Learn',
  'Day 1: Quick Revision',
  'Day 3: Practice',
  'Day 7: Revision',
  'Day 14: Test',
  'Final-Week Rapid Revision',
  'Mastered',
];

export function getNextStage(currentStage: SpacedStage): SpacedStage {
  const idx = STAGES_ORDER.indexOf(currentStage);
  if (idx >= 0 && idx < STAGES_ORDER.length - 1) {
    return STAGES_ORDER[idx + 1];
  }
  return 'Mastered';
}

/**
 * Calculates next due date when an item is completed
 * Product design addition: if test/practice failed, step back to Day 1 or shorten interval
 */
export function calculateNextDueDate(
  initialDate: string,
  currentStageIndex: number,
  passed: boolean
): { nextDueDate: string; nextStage: SpacedStage; nextStageIndex: number } {
  if (!passed) {
    // Failure rule (Product design addition): step back to Day 1 quick revision, due tomorrow
    const fallbackDate = addDays(initialDate, 1);
    return {
      nextDueDate: fallbackDate,
      nextStage: 'Day 1: Quick Revision',
      nextStageIndex: 1,
    };
  }

  const nextIdx = currentStageIndex + 1;
  if (nextIdx >= STAGES_ORDER.length - 1) {
    // Ready for final week or mastered
    return {
      nextDueDate: '2026-12-07', // Final week start per PDF
      nextStage: 'Final-Week Rapid Revision',
      nextStageIndex: 5,
    };
  }

  const nextStage = STAGES_ORDER[nextIdx];
  const offset = STAGE_OFFSETS_FROM_INITIAL[nextIdx] ?? 14;
  const nextDueDate = addDays(initialDate, offset);

  return {
    nextDueDate,
    nextStage,
    nextStageIndex: nextIdx,
  };
}

export function isRevisionDue(item: SpacedRevisionItem, currentDate: string): boolean {
  if (item.stage === 'Mastered') return false;
  return item.nextDueDate <= currentDate;
}

export function isRevisionOverdue(item: SpacedRevisionItem, currentDate: string): boolean {
  if (item.stage === 'Mastered') return false;
  return item.nextDueDate < currentDate;
}

/**
 * Creates initial seed items for the PDF core subjects
 */
export function createInitialSpacedItems(startDate: string): SpacedRevisionItem[] {
  return [
    {
      id: 'rev_eng_sva',
      title: 'Grammar: Subject-Verb Agreement Rules',
      subjectType: 'english_rc_grammar',
      sectionId: 'english',
      topicId: 'eng_grammar',
      subtopicName: 'Subject-Verb Agreement',
      stage: 'Day 1: Quick Revision',
      stageIndex: 1,
      initialLearnDate: startDate,
      nextDueDate: addDays(startDate, 1),
      recommendedAction: 'Review 12 golden SVA rules & singular/plural subject traps',
      cadenceDescription: 'PDF Spaced Cycle: Day 0 -> 1 -> 3 -> 7 -> 14 -> Final Week',
      reviewHistory: [
        {
          stage: 'Day 0: Learn',
          completedDate: startDate,
          passed: true,
          scoreOrNotes: 'Learned core SVA exceptions with prepositional phrases',
        },
      ],
    },
    {
      id: 'rev_lr_syllogism',
      title: 'Logical: Syllogisms & Venn Overlap Rules',
      subjectType: 'logical_major_type',
      sectionId: 'logical',
      topicId: 'lr_analytical_core',
      subtopicName: 'Syllogism',
      stage: 'Day 3: Practice',
      stageIndex: 2,
      initialLearnDate: startDate,
      nextDueDate: addDays(startDate, 3),
      recommendedAction: 'Attempt 25 timed syllogisms (Some/All/No/Some-not)',
      cadenceDescription: 'Logical per-type cycle: Day 0 -> 1 -> 3 -> 7 -> 14',
      reviewHistory: [
        {
          stage: 'Day 0: Learn',
          completedDate: startDate,
          passed: true,
          scoreOrNotes: 'Completed 25 basic syllogisms from Day 2 PDF schedule',
        },
        {
          stage: 'Day 1: Quick Revision',
          completedDate: addDays(startDate, 1),
          passed: true,
          scoreOrNotes: 'Reviewed negative statement rules and either/or conditions',
        },
      ],
    },
    {
      id: 'rev_lr_cr_assumptions',
      title: 'Critical Reasoning: Assumption Identification',
      subjectType: 'logical_major_type',
      sectionId: 'logical',
      topicId: 'lr_cr',
      subtopicName: 'Assumptions',
      stage: 'Day 1: Quick Revision',
      stageIndex: 1,
      initialLearnDate: addDays(startDate, 2),
      nextDueDate: addDays(startDate, 3),
      recommendedAction: 'Negation technique practice on 15 arguments',
      cadenceDescription: 'Critical reasoning cycle: every 3 days review',
      reviewHistory: [
        {
          stage: 'Day 0: Learn',
          completedDate: addDays(startDate, 2),
          passed: true,
          scoreOrNotes: 'Negation test mastered for implicit premise detection',
        },
      ],
    },
    {
      id: 'rev_gk_polity',
      title: 'Static GK: Constitution Overview & Fundamental Rights',
      subjectType: 'static_gk_batch',
      sectionId: 'ca_gk',
      topicId: 'ca_static_gk',
      subtopicName: 'Indian Polity',
      stage: 'Day 7: Revision',
      stageIndex: 3,
      initialLearnDate: startDate,
      nextDueDate: addDays(startDate, 7),
      recommendedAction: 'Review Articles 12-35 summary sheet & write active recall points',
      cadenceDescription: 'Static GK batch cycle: fortnightly review',
      reviewHistory: [
        {
          stage: 'Day 0: Learn',
          completedDate: startDate,
          passed: true,
        },
        {
          stage: 'Day 1: Quick Revision',
          completedDate: addDays(startDate, 1),
          passed: true,
        },
        {
          stage: 'Day 3: Practice',
          completedDate: addDays(startDate, 3),
          passed: true,
          scoreOrNotes: 'Polity mini-quiz: 85% accuracy',
        },
      ],
    },
    {
      id: 'rev_eng_vocab',
      title: 'English Vocabulary: High-frequency Roots & Idioms',
      subjectType: 'english_vocab_micro',
      sectionId: 'english',
      topicId: 'eng_vocab',
      subtopicName: 'Roots & Idioms',
      stage: 'Day 1: Quick Revision',
      stageIndex: 1,
      initialLearnDate: addDays(startDate, 3),
      nextDueDate: addDays(startDate, 4),
      recommendedAction: 'Daily micro-revision of 30 root cards and contextual usage',
      cadenceDescription: 'English Vocab: Daily micro-revision cadence per PDF',
      reviewHistory: [
        {
          stage: 'Day 0: Learn',
          completedDate: addDays(startDate, 3),
          passed: true,
        },
      ],
    },
  ];
}

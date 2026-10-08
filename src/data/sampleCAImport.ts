// src/data/sampleCAImport.ts
import { CurrentAffairItem } from '../types/ca';

/**
 * Clean schema template for student or teacher imports.
 * CA module ships empty by default per Ground Rules (no fabricated news).
 */
export const SAMPLE_CA_IMPORT_TEMPLATE: Partial<CurrentAffairItem>[] = [
  {
    date: '2026-10-01',
    topic: 'Supreme Court ruling on sub-classification within Scheduled Castes',
    category: 'National',
    summary:
      'A seven-judge Constitution Bench of the Supreme Court held that states have the power to sub-classify Scheduled Castes for the purpose of granting affirmative action quotas, provided empirical data proves unequal representation.',
    keyFacts: [
      'Seven-judge Constitution Bench headed by the Chief Justice of India',
      'Overruled the 2004 E.V. Chinnaiah judgment',
      'Requires quantifiable empirical data before creating sub-categories',
    ],
    source: 'The Hindu Legal Bureau / Supreme Court of India Judgment Record',
    sourceDate: '2024-08-01',
    relatedExamTopic: 'Indian Polity - Supreme Court / Judiciary',
    status: 'VERIFIED',
    isImportantEvent: true,
    tracker: {
      read: true,
      notesCreated: true,
      mcqsPracticed: false,
      rev1Done: false,
      rev2Done: false,
      finalPassDone: false,
    },
  },
];

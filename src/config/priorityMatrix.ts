// src/config/priorityMatrix.ts
import { PriorityLevel } from '../types/syllabus';

export interface PriorityMatrixItem {
  topic: string;
  section: 'English' | 'Current Affairs & GK' | 'Logical Reasoning' | 'None';
  sectionId?: 'english' | 'ca_gk' | 'logical';
  priority: PriorityLevel;
  weeklyPractice: string;
  revisionFrequency: string;
  notes: string;
  isAvoid?: boolean;
}

export const PRIORITY_MATRIX: PriorityMatrixItem[] = [
  {
    topic: 'Reading Comprehension',
    section: 'English',
    sectionId: 'english',
    priority: 'VERY HIGH',
    weeklyPractice: '8-12 passages/week',
    revisionFrequency: 'Every 3-4 days',
    notes: 'Primary anchor for 50 English marks. Focus on inference, tone, central theme, argument structure.',
  },
  {
    topic: 'Critical Reasoning (Assumptions, Strengthen/Weaken, Inference)',
    section: 'Logical Reasoning',
    sectionId: 'logical',
    priority: 'VERY HIGH',
    weeklyPractice: '40-60 Qs/week',
    revisionFrequency: 'Every 3 days',
    notes: 'Dominant component of 70 marks. Demands ruthless assumption-identification and logical trap evasion.',
  },
  {
    topic: 'Syllogism + Arrangements + Puzzles',
    section: 'Logical Reasoning',
    sectionId: 'logical',
    priority: 'VERY HIGH',
    weeklyPractice: '50-70 Qs/week',
    revisionFrequency: 'Every 3-4 days',
    notes: 'High-score certainty when mastered. Linear, circular, distribution, and standard negative syllogisms.',
  },
  {
    topic: 'Current Affairs (last 8-10 months)',
    section: 'Current Affairs & GK',
    sectionId: 'ca_gk',
    priority: 'VERY HIGH',
    weeklyPractice: 'Daily 30-45m + weekly compilation',
    revisionFrequency: 'Weekly + monthly overlay',
    notes: 'Focus on National policies/judiciary, International summits, Economy, Science/ISRO, Environment.',
  },
  {
    topic: 'Principle + Facts (Pure Logic)',
    section: 'Logical Reasoning',
    sectionId: 'logical',
    priority: 'HIGH',
    weeklyPractice: '20-30 Qs/week',
    revisionFrequency: 'Weekly',
    notes: 'Pure logical syllogistic matching of facts to given principles. DO NOT memorize statutory law.',
  },
  {
    topic: 'Vocabulary (contextual + idioms)',
    section: 'English',
    sectionId: 'english',
    priority: 'HIGH',
    weeklyPractice: '20-30 words/day + practice',
    revisionFrequency: 'Every 5-7 days',
    notes: 'Contextual vocabulary, word usage, idioms, roots, prefixes/suffixes.',
  },
  {
    topic: 'Grammar (Error spotting, SVA, Tenses)',
    section: 'English',
    sectionId: 'english',
    priority: 'HIGH',
    weeklyPractice: '30-40 Qs/week',
    revisionFrequency: 'Weekly',
    notes: 'Core rules: Subject-Verb Agreement, Parallelism, Modifiers, Pronoun-antecedent.',
  },
  {
    topic: 'Static GK (Polity, History, Geo, Economy basics)',
    section: 'Current Affairs & GK',
    sectionId: 'ca_gk',
    priority: 'MEDIUM',
    weeklyPractice: 'Topic-wise notes + 20 Qs',
    revisionFrequency: 'Fortnightly',
    notes: 'Constitution articles & institutions, major historical treaties, geography basics.',
  },
  {
    topic: 'Para jumbles / Sentence rearrangement',
    section: 'English',
    sectionId: 'english',
    priority: 'MEDIUM',
    weeklyPractice: '15-20 sets/week',
    revisionFrequency: 'Weekly',
    notes: 'Transition cues, pronoun references, mandatory pairs.',
  },
  {
    topic: 'Series, Coding, Blood Relations, Directions',
    section: 'Logical Reasoning',
    sectionId: 'logical',
    priority: 'MEDIUM',
    weeklyPractice: '20-30 Qs/week',
    revisionFrequency: 'Weekly',
    notes: 'Speed drills and standard notation.',
  },
  {
    topic: 'Awards, Sports, Science lists',
    section: 'Current Affairs & GK',
    sectionId: 'ca_gk',
    priority: 'LOW',
    weeklyPractice: 'Monthly revision only',
    revisionFrequency: 'Monthly',
    notes: 'Low ROI if overdone. Review high-profile lists only in monthly blocks.',
  },
  {
    topic: 'Deep legal maxims / case laws / Mathematics',
    section: 'None',
    priority: 'AVOID',
    weeklyPractice: 'Skip (0 Qs)',
    revisionFrequency: 'None',
    notes: 'NOT REQUIRED FOR AILET UG. Avoid wasting preparation hours on law statutes or mathematics.',
    isAvoid: true,
  },
];

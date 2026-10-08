// src/types/syllabus.ts

export type PriorityLevel = 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'AVOID';

export interface SubTopic {
  id: string;
  name: string;
  isOfficial: boolean; // false - PDF specifies subtopics are preparation recommendations inferred from past papers
  recommendedWeeklyVolume?: string;
  recommendedRevisionCadence?: string;
}

export interface Topic {
  id: string;
  name: string;
  sectionId: 'english' | 'ca_gk' | 'logical';
  priority: PriorityLevel;
  practiceGuideline: string;
  revisionGuideline: string;
  subtopics: SubTopic[];
  isAvoid?: boolean; // e.g. Deep legal maxims / case laws
  avoidReason?: string;
}

export interface SectionSyllabus {
  id: 'english' | 'ca_gk' | 'logical';
  name: string;
  isOfficialName: boolean;
  questionCount: number;
  marks: number;
  topics: Topic[];
}

// Progress metrics per subtopic/topic
export interface TopicProgress {
  topicId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  lastStudiedDate?: string;
  lastRevisionDate?: string;
  errorCount: number;
  status: 'not_started' | 'in_progress' | 'mastered' | 'weak';
}

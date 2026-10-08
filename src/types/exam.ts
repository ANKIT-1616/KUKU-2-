// src/types/exam.ts
// Official vs Recommended exam schema per PDF source of truth

export interface ExamConfig {
  examName: string; // "AILET 2027 UG"
  degree: string; // "B.A. LL.B. (Hons.)"
  conductingBody: string; // "National Law University Delhi"
  officialSourceUrl: string; // "https://nationallawuniversitydelhi.in"
  examDate: string; // "2026-12-13" (YYYY-MM-DD)
  dayOfWeek: string; // "Sunday"
  timingStart: string; // "14:00" (IST, 24-hr)
  timingEnd: string; // "16:00" (IST, 24-hr)
  durationMinutes: number; // 120
  totalQuestions: number; // 150
  totalMarks: number; // 150
  markingScheme: {
    correct: number; // +1.0 (derived from 150 Q / 150 marks)
    incorrect: number; // -0.25 (official negative marking)
    unattempted: number; // 0.0
  };
  sections: ExamSectionConfig[];
  mode: 'offline_pen_paper_omr'; // Official mode per NLU Delhi
  timezone: string; // "Asia/Kolkata"
  studyStartDate: string; // "2026-10-02"
  studyEndDate: string; // "2026-12-12"
  finalWeekStartDate: string; // "2026-12-07"
  noNewTopicsDate: string; // "2026-11-30"
  notes: {
    legalAptitudeRule: string; // "No Legal Knowledge required. Legal principles appear only inside Logical Reasoning as pure logic tests."
    mathematicsRule: string; // "No Mathematics section in AILET UG."
    negativeMarkingRule: string; // "-0.25 per incorrect answer. Respect negative marking."
    tieBreakingRule: string; // "Higher marks in Logical Reasoning, then older age, then computerized draw of lots."
  };
}

export interface ExamSectionConfig {
  id: 'english' | 'ca_gk' | 'logical';
  name: string; // Official section name
  questionCount: number; // 50, 30, 70
  marks: number; // 50, 30, 70
  officialWeightagePercent: number; // 33.3%, 20.0%, 46.7%
  recommendedTimeMinutes: number; // Product recommendation: proportional or strategy-based
  isOfficial: boolean; // true
}

export type MistakeType = 'Concept mistake' | 'Knowledge gap' | 'Silly mistake' | 'Time-pressure mistake';

export interface ScoreBreakdown {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  markedForReview: number;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  attemptPercentage: number;
  sectionScores: Record<string, {
    sectionName: string;
    attempted: number;
    correct: number;
    wrong: number;
    unattempted: number;
    score: number;
    maxScore: number;
    accuracyPercentage: number;
  }>;
}

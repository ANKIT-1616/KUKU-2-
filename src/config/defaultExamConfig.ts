// src/config/defaultExamConfig.ts
import { ExamConfig } from '../types/exam';

export const DEFAULT_EXAM_CONFIG: ExamConfig = {
  examName: 'AILET 2027 UG',
  degree: 'B.A. LL.B. (Hons.)',
  conductingBody: 'National Law University Delhi',
  officialSourceUrl: 'https://nationallawuniversitydelhi.in',
  examDate: '2026-12-13',
  dayOfWeek: 'Sunday',
  timingStart: '14:00',
  timingEnd: '16:00',
  durationMinutes: 120,
  totalQuestions: 150,
  totalMarks: 150,
  markingScheme: {
    correct: 1.0, // Implied by 150 Q / 150 marks; verified against NLU Delhi guidelines
    incorrect: -0.25, // Official negative marking
    unattempted: 0.0,
  },
  sections: [
    {
      id: 'english',
      name: 'English Language',
      questionCount: 50,
      marks: 50,
      officialWeightagePercent: 33.33,
      recommendedTimeMinutes: 40, // Proportional limit: 120 * 50/150 = 40 min (Product recommendation)
      isOfficial: true,
    },
    {
      id: 'ca_gk',
      name: 'Current Affairs & General Knowledge',
      questionCount: 30,
      marks: 30,
      officialWeightagePercent: 20.0,
      recommendedTimeMinutes: 24, // Proportional limit: 120 * 30/150 = 24 min (Product recommendation)
      isOfficial: true,
    },
    {
      id: 'logical',
      name: 'Logical Reasoning',
      questionCount: 70,
      marks: 70,
      officialWeightagePercent: 46.67,
      recommendedTimeMinutes: 56, // Proportional limit: 120 * 70/150 = 56 min (Product recommendation)
      isOfficial: true,
    },
  ],
  mode: 'offline_pen_paper_omr',
  timezone: 'Asia/Kolkata',
  studyStartDate: '2026-10-02',
  studyEndDate: '2026-12-12',
  finalWeekStartDate: '2026-12-07',
  noNewTopicsDate: '2026-11-30',
  notes: {
    legalAptitudeRule:
      'No Legal Knowledge required. Legal principles appear only inside Logical Reasoning to test pure logical application.',
    mathematicsRule: 'No Mathematics section in AILET UG.',
    negativeMarkingRule: '-0.25 per incorrect answer. Respect negative marking.',
    tieBreakingRule:
      'Merit tie-break: Higher marks in Logical Reasoning, followed by age (older preferred), then computerized draw of lots.',
  },
};

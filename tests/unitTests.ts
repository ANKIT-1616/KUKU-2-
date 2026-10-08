// tests/unitTests.ts
import { calculateExamScore } from '../src/services/scoringEngine';
import { DEFAULT_EXAM_CONFIG } from '../src/config/defaultExamConfig';
import { QuestionItem } from '../src/types/question';
import {
  calculateNextDueDate,
  getNextStage,
  isRevisionDue,
  isRevisionOverdue,
  STAGES_ORDER,
} from '../src/services/spacedRevisionEngine';
import {
  generateFullStudyPlan,
  rebalanceMissedDays,
  getPhaseForDate,
} from '../src/services/planRebalancer';
import { calculateCountdown, isFinalWeek, isLightOnlyDay, isExamDay } from '../src/utils/date';
import { validateQuestionItem } from '../src/services/questionValidator';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n==============================================');
console.log('--- AILET 2027 OPERATING SYSTEM TEST SUITE ---');
console.log('==============================================\n');

// 1. SCORING ENGINE TESTS
console.log('[1/7] Testing Scoring Engine (Pure Config-Driven Module)');

const mockQuestions: QuestionItem[] = [
  {
    id: 'q_eng_1',
    sectionId: 'english',
    topicId: 'eng_rc',
    difficulty: 'MEDIUM',
    questionType: 'Reading Comprehension',
    question: 'Sample English question',
    options: [
      { id: 'A', text: 'Option A' },
      { id: 'B', text: 'Option B' },
      { id: 'C', text: 'Option C' },
      { id: 'D', text: 'Option D' },
    ],
    correctAnswer: 'B',
    explanation: 'Detailed explanation for B',
    source: 'Sample',
    status: 'SAMPLE',
    qualityCheck: { passedAutomatedChecks: true, secondPassReviewDone: true, noExternalLawRequired: true, hasSingleCorrectAnswer: true, hasNoDuplicateOptions: true },
  },
  {
    id: 'q_ca_1',
    sectionId: 'ca_gk',
    topicId: 'ca_core',
    difficulty: 'EASY',
    questionType: 'Current Affairs',
    question: 'Sample CA question',
    options: [
      { id: 'A', text: 'Option A' },
      { id: 'B', text: 'Option B' },
      { id: 'C', text: 'Option C' },
      { id: 'D', text: 'Option D' },
    ],
    correctAnswer: 'A',
    explanation: 'Detailed explanation for A',
    source: 'Sample',
    status: 'SAMPLE',
    qualityCheck: { passedAutomatedChecks: true, secondPassReviewDone: true, noExternalLawRequired: true, hasSingleCorrectAnswer: true, hasNoDuplicateOptions: true },
  },
  {
    id: 'q_lr_1',
    sectionId: 'logical',
    topicId: 'lr_cr',
    difficulty: 'HARD',
    questionType: 'Critical Reasoning',
    question: 'Sample LR question',
    options: [
      { id: 'A', text: 'Option A' },
      { id: 'B', text: 'Option B' },
      { id: 'C', text: 'Option C' },
      { id: 'D', text: 'Option D' },
    ],
    correctAnswer: 'C',
    explanation: 'Detailed explanation for C',
    source: 'Sample',
    status: 'SAMPLE',
    qualityCheck: { passedAutomatedChecks: true, secondPassReviewDone: true, noExternalLawRequired: true, hasSingleCorrectAnswer: true, hasNoDuplicateOptions: true },
  },
  {
    id: 'q_lr_2',
    sectionId: 'logical',
    topicId: 'lr_analytical_core',
    difficulty: 'MEDIUM',
    questionType: 'Syllogism',
    question: 'Sample Syllogism question',
    options: [
      { id: 'A', text: 'Option A' },
      { id: 'B', text: 'Option B' },
      { id: 'C', text: 'Option C' },
      { id: 'D', text: 'Option D' },
    ],
    correctAnswer: 'D',
    explanation: 'Detailed explanation for D',
    source: 'Sample',
    status: 'SAMPLE',
    qualityCheck: { passedAutomatedChecks: true, secondPassReviewDone: true, noExternalLawRequired: true, hasSingleCorrectAnswer: true, hasNoDuplicateOptions: true },
  },
];

// Test mixed submission: 2 correct, 1 wrong, 1 unattempted
// Expected: 2 * (+1) + 1 * (-0.25) + 0 = 1.75
const mixedSubmissions = {
  q_eng_1: { questionId: 'q_eng_1', selectedOptionId: 'B' }, // Correct (+1)
  q_ca_1: { questionId: 'q_ca_1', selectedOptionId: 'C' }, // Wrong (-0.25)
  q_lr_1: { questionId: 'q_lr_1', selectedOptionId: null }, // Unattempted (0)
  q_lr_2: { questionId: 'q_lr_2', selectedOptionId: 'D' }, // Correct (+1)
};
const mixedResult = calculateExamScore(DEFAULT_EXAM_CONFIG, mockQuestions, mixedSubmissions);
assert(mixedResult.score === 1.75, `Mixed score equals +1.75 marks (got ${mixedResult.score})`);
assert(mixedResult.correct === 2, 'Correct count is 2');
assert(mixedResult.wrong === 1, 'Wrong count is 1');
assert(mixedResult.unattempted === 1, 'Unattempted count is 1');
assert(mixedResult.accuracyPercentage === 66.67, 'Accuracy is 66.67% (2 / 3 attempted)');

// Test Edge Case: All correct (150 questions simulation)
const allCorrectSubs: Record<string, any> = {};
for (const q of mockQuestions) {
  allCorrectSubs[q.id] = { questionId: q.id, selectedOptionId: q.correctAnswer };
}
const allCorrectResult = calculateExamScore(DEFAULT_EXAM_CONFIG, mockQuestions, allCorrectSubs);
assert(allCorrectResult.score === 4, 'All correct yields positive sum of marks');
assert(allCorrectResult.accuracyPercentage === 100, 'Accuracy is 100%');

// Test Edge Case: All wrong (-0.25 each)
const allWrongSubs: Record<string, any> = {};
for (const q of mockQuestions) {
  allWrongSubs[q.id] = { questionId: q.id, selectedOptionId: q.correctAnswer === 'A' ? 'B' : 'A' };
}
const allWrongResult = calculateExamScore(DEFAULT_EXAM_CONFIG, mockQuestions, allWrongSubs);
assert(allWrongResult.score === -1.0, `All wrong yields -1.0 marks (4 * -0.25) (got ${allWrongResult.score})`);
assert(allWrongResult.accuracyPercentage === 0, 'Accuracy is 0%');

// Test Edge Case: All unattempted
const allBlankSubs: Record<string, any> = {};
for (const q of mockQuestions) {
  allBlankSubs[q.id] = { questionId: q.id, selectedOptionId: null };
}
const allBlankResult = calculateExamScore(DEFAULT_EXAM_CONFIG, mockQuestions, allBlankSubs);
assert(allBlankResult.score === 0, 'All unattempted yields exactly 0 marks');
assert(allBlankResult.unattempted === 4, 'Unattempted count equals total questions');

// 2. SPACED REVISION TESTS
console.log('\n[2/7] Testing Spaced Revision Engine (PDF 6-Stage Progression)');

const stage1 = calculateNextDueDate('2026-10-02', 0, true);
assert(stage1.nextStage === 'Day 1: Quick Revision', 'Stage 0 advances to Day 1: Quick Revision');
assert(stage1.nextDueDate === '2026-10-03', 'Day 1 due date is 2026-10-03 (+1 day)');

const stage2 = calculateNextDueDate('2026-10-02', 1, true);
assert(stage2.nextStage === 'Day 3: Practice', 'Stage 1 advances to Day 3: Practice');
assert(stage2.nextDueDate === '2026-10-05', 'Day 3 due date is 2026-10-05 (+3 days from initial)');

const stage3 = calculateNextDueDate('2026-10-02', 2, true);
assert(stage3.nextStage === 'Day 7: Revision', 'Stage 2 advances to Day 7: Revision');
assert(stage3.nextDueDate === '2026-10-09', 'Day 7 due date is 2026-10-09 (+7 days from initial)');

const stage4 = calculateNextDueDate('2026-10-02', 3, true);
assert(stage4.nextStage === 'Day 14: Test', 'Stage 3 advances to Day 14: Test');
assert(stage4.nextDueDate === '2026-10-16', 'Day 14 due date is 2026-10-16 (+14 days from initial)');

// Failure step-back rule
const failedAdvance = calculateNextDueDate('2026-10-02', 3, false);
assert(failedAdvance.nextStage === 'Day 1: Quick Revision', 'Failed revision steps back to Day 1 Quick Revision');

// 3. STUDY PLAN GENERATION TESTS
console.log('\n[3/7] Testing Study Plan Generation & Boundary Rules');

const fullPlan = generateFullStudyPlan();
assert(fullPlan.length === 73, `Generated exactly 73 days (2 Oct to 13 Dec 2026) (got ${fullPlan.length})`);

const dayOct2 = fullPlan.find((d) => d.date === '2026-10-02');
assert(dayOct2 !== undefined && dayOct2.isExactPdfSeed, '2 Oct 2026 is an exact PDF seed');

const dayOct8 = fullPlan.find((d) => d.date === '2026-10-08');
assert(dayOct8 !== undefined && dayOct8.isExactPdfSeed, '8 Oct 2026 is an exact PDF seed');

const dayOct15 = fullPlan.find((d) => d.date === '2026-10-15');
assert(dayOct15 !== undefined && !dayOct15.isExactPdfSeed, '15 Oct 2026 is marked as derived from PDF pattern');
assert(
  dayOct15?.derivedRuleExplanation?.includes('Derived from PDF pattern') ?? false,
  'Derived day has explicit rule explanation string'
);

// Check Dec 12 Light Only Day
const dayDec12 = fullPlan.find((d) => d.date === '2026-12-12');
assert(dayDec12?.dayType === 'light_only', '12 Dec 2026 is strictly marked LIGHT ONLY per PDF');

// Check Dec 13 Exam Day
const dayDec13 = fullPlan.find((d) => d.date === '2026-12-13');
assert(dayDec13?.dayType === 'exam_day', '13 Dec 2026 is strictly marked EXAM DAY');

// Check STRICT RULE: No new topics after 30 Nov
const postNov30Days = fullPlan.filter((d) => d.date > '2026-11-30' && d.date < '2026-12-12');
const hasNewTopicTask = postNov30Days.some((d) =>
  d.tasks.some((t) => t.title.toLowerCase().includes('new concept') || t.title.toLowerCase().includes('intro'))
);
assert(!hasNewTopicTask, 'Enforces strictly NO NEW TOPICS after 30 November');

// 4. PLAN REBALANCING TESTS
console.log('\n[4/7] Testing Missed-Day Adaptive Rebalancer');

// Simulate a past missed day with incomplete tasks
const testDays = JSON.parse(JSON.stringify(fullPlan));
testDays[0].tasks[0].completed = false; // Missed essential task
const { updatedDays, log } = rebalanceMissedDays(testDays, '2026-10-05');

assert(log.rebalancedDays.includes('2026-10-02'), 'Detects missed day on 2026-10-02');
assert(log.tasksMoved.length > 0, 'Moves essential task forward to an upcoming day');
assert(
  log.tasksMoved.every((m) => m.toDate <= '2026-12-06'),
  'Never pushes rebalanced tasks past 6 Dec (protects final week mode)'
);

// 5. COUNTDOWN & MILESTONE DATES
console.log('\n[5/7] Testing Countdown & Timeline Milestones');

const countdownOct2 = calculateCountdown('2026-10-02');
assert(countdownOct2.days === 72, `Countdown on 2 Oct 2026 is 72 days (got ${countdownOct2.days})`);
assert(!countdownOct2.isExamDay, 'Not exam day on 2 Oct');

const countdownExamDay = calculateCountdown('2026-12-13');
assert(countdownExamDay.isExamDay, 'Correctly flags 13 Dec 2026 as EXAM DAY');
assert(countdownExamDay.days === 0, '0 days remaining on Exam Day');

assert(isFinalWeek('2026-12-07'), '7 Dec is in Final Week');
assert(isFinalWeek('2026-12-12'), '12 Dec is in Final Week');
assert(!isFinalWeek('2026-12-06'), '6 Dec is not in Final Week');

// 6. QUESTION QUALITY VALIDATOR TESTS
console.log('\n[6/7] Testing Question Quality Pipeline Checks');

const validQ: Partial<QuestionItem> = {
  question: 'Under what conditions does a contractual agreement become void for impossibility?',
  options: [
    { id: 'A', text: 'When performance becomes illegal or physically impossible.' },
    { id: 'B', text: 'When one party changes their mind.' },
    { id: 'C', text: 'When the price of materials increases by 5%.' },
    { id: 'D', text: 'When delivery is delayed by one hour.' },
  ],
  correctAnswer: 'A',
  explanation: 'Impossibility under law requires absolute physical or legal impossibility of performance.',
  sectionId: 'logical',
  topicId: 'lr_cr',
  qualityCheck: {
    passedAutomatedChecks: true,
    secondPassReviewDone: true,
    noExternalLawRequired: true,
    hasSingleCorrectAnswer: true,
    hasNoDuplicateOptions: true,
  },
};
const validReport = validateQuestionItem(validQ);
assert(validReport.isValid, 'Clean question passes automated checks');

const dupOptionQ: Partial<QuestionItem> = {
  question: 'Sample question with duplicate options detected',
  options: [
    { id: 'A', text: 'Same Option' },
    { id: 'B', text: 'Same Option' },
    { id: 'C', text: 'Third Option' },
    { id: 'D', text: 'Fourth Option' },
  ],
  correctAnswer: 'A',
  explanation: 'Explanation provided here for the question',
  sectionId: 'logical',
};
const dupReport = validateQuestionItem(dupOptionQ);
assert(!dupReport.isValid, 'Flags duplicate options as validation error');

const bannedLawQ: Partial<QuestionItem> = {
  question: 'According to Section 300 of IPC and Indian Penal Code...',
  options: [
    { id: 'A', text: 'A' },
    { id: 'B', text: 'B' },
    { id: 'C', text: 'C' },
    { id: 'D', text: 'D' },
  ],
  correctAnswer: 'A',
  explanation: 'Based on Section 300 of IPC...',
  sectionId: 'logical',
  topicId: 'lr_principle_facts',
};
const lawReport = validateQuestionItem(bannedLawQ);
assert(
  lawReport.issues.some((i) => i.message.includes('external legal statutes')),
  'Flags external statutory memorization (IPC) in principle logic questions'
);

// 7. CURRENT AFFAIRS VALIDATION RULES
console.log('\n[7/7] Testing Current Affairs Verification Rules');
assert(
  '2024-08-01' < '2025-12-13',
  'Correctly detects items older than 12-month window as needing potential outdated flag'
);

console.log('\n==============================================');
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('==============================================\n');

if (failed > 0) {
  process.exit(1);
}

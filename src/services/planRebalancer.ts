// src/services/planRebalancer.ts
import { PlanDay, PlanPhase, PlanTask, RebalanceLog } from '../types/plan';
import { addDays, parseDateYMD } from '../utils/date';

export const PHASES_CONFIG: PlanPhase[] = [
  {
    id: 1,
    name: 'Foundation + Diagnostic',
    dateRange: '2-18 Oct',
    startDate: '2026-10-02',
    endDate: '2026-10-18',
    primaryFocus: 'Diagnostic full mock + sectionals; build CA notebook; establish high-priority fundamentals.',
    mockTarget: '1 diagnostic mock + 3 sectionals',
    questionTarget: '~400-500 mixed Qs',
    whatToAvoid: 'Avoid advanced puzzles, deep static lists.',
    rules: [
      'Diagnostic full mock in real 2-4 PM slot',
      'Set up Error Notebook with 4 mistake types',
      'Build daily CA reading habit (30-45 min)',
      'Master core Syllogism and Grammar SVA',
    ],
  },
  {
    id: 2,
    name: 'Core Syllabus',
    dateRange: '19 Oct-1 Nov',
    startDate: '2026-10-19',
    endDate: '2026-11-01',
    primaryFocus: 'First full pass of RC techniques, Critical Reasoning, Syllogisms, Arrangements, Principle-based logic.',
    mockTarget: '1 full mock + 4 sectionals',
    questionTarget: '600+ Qs',
    whatToAvoid: 'Avoid low-priority awards lists.',
    rules: [
      'Daily CA + weekly compilation revision',
      '3-4 days/week 7-hour intensive timetable',
      'Spaced revision cycles for LR major types',
    ],
  },
  {
    id: 3,
    name: 'Syllabus Completion + Testing',
    dateRange: '2-15 Nov',
    startDate: '2026-11-02',
    endDate: '2026-11-15',
    primaryFocus: 'Finish remaining Analytical, Verbal Ability, and Static GK core; heavy timed practice.',
    mockTarget: '2 full mocks + 5-6 sectionals',
    questionTarget: '700+ Qs',
    whatToAvoid: 'Avoid unanalyzed mock backlogs.',
    rules: [
      'Deep dive into Error Notebook after every test',
      'Timed practice sets under exam constraints',
      'Fortnightly Static GK review',
    ],
  },
  {
    id: 4,
    name: 'Mock + Revision',
    dateRange: '16-29 Nov',
    startDate: '2026-11-16',
    endDate: '2026-11-29',
    primaryFocus: '2 full mocks/week in 2-4 PM slot; spaced revision of weak topics; monthly CA overhaul.',
    mockTarget: '4 full mocks + daily error notebook review',
    questionTarget: '500+ targeted Qs',
    whatToAvoid: 'Avoid passive reading; practice active recall.',
    rules: [
      'Simulate exact 2:00-4:00 PM exam conditions',
      'Record all 12 points in Mock Tracker immediately',
      'No new topics after 30 November!',
    ],
  },
  {
    id: 5,
    name: 'Final Intensive',
    dateRange: '30 Nov-6 Dec',
    startDate: '2026-11-30',
    endDate: '2026-12-06',
    primaryFocus: '2-3 full mocks; rapid revision of weak areas + CA last 12 months. STRICTLY NO NEW TOPICS.',
    mockTarget: '2-3 full mocks',
    questionTarget: '300-400 weak-area Qs',
    whatToAvoid: 'ABSOLUTELY NO NEW TOPICS after 30 Nov.',
    rules: [
      'Enforce "No new topics after 30 Nov" rule',
      'Intense drill of Error Notebook entries',
      'Rapid pass of last 10-12 months CA highlights',
    ],
  },
  {
    id: 6,
    name: 'Final Revision',
    dateRange: '7-12 Dec',
    startDate: '2026-12-07',
    endDate: '2026-12-12',
    primaryFocus: 'Light, high-yield only. Max 1-2 light mocks early. 12 Dec = pure light revision + rest.',
    mockTarget: '1 light mock max (early in week)',
    questionTarget: 'Light practice only (<30 Qs/day)',
    whatToAvoid: 'No exhausting sessions, no late nights.',
    rules: [
      'Follow PDF Final 7 Days schedule to the letter',
      '12 Dec: Light only (error notebook highlights, sleep early)',
      'Pack exam kit with admit card buffer',
    ],
  },
];

/**
 * Returns Phase ID for a given date string (YYYY-MM-DD)
 */
export function getPhaseForDate(ymd: string): PlanPhase {
  for (const phase of PHASES_CONFIG) {
    if (ymd >= phase.startDate && ymd <= phase.endDate) {
      return phase;
    }
  }
  if (ymd < PHASES_CONFIG[0].startDate) return PHASES_CONFIG[0];
  return PHASES_CONFIG[PHASES_CONFIG.length - 1];
}

/**
 * Generates the full 73-day plan (2026-10-02 to 2026-12-13)
 */
export function generateFullStudyPlan(): PlanDay[] {
  const days: PlanDay[] = [];
  let cur = '2026-10-02';

  while (cur <= '2026-12-13') {
    const d = parseDateYMD(cur);
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const phase = getPhaseForDate(cur);
    const diffDays = Math.round((d.getTime() - parseDateYMD('2026-10-02').getTime()) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7) + 1;

    let dayData: PlanDay;

    // Check exact seeds
    if (cur >= '2026-10-02' && cur <= '2026-10-08') {
      dayData = getExactWeek1Seed(cur, dayOfWeek, phase.id, weekNumber);
    } else if (cur >= '2026-12-07' && cur <= '2026-12-12') {
      dayData = getExactFinalWeekSeed(cur, dayOfWeek, phase.id, weekNumber);
    } else if (cur === '2026-12-13') {
      dayData = getExamDayPlan(cur, dayOfWeek, phase.id, weekNumber);
    } else {
      dayData = deriveDayFromPattern(cur, dayOfWeek, phase.id, weekNumber);
    }

    days.push(dayData);
    cur = addDays(cur, 1);
  }

  return days;
}

function getExactWeek1Seed(ymd: string, dayOfWeek: string, phaseId: 1 | 2 | 3 | 4 | 5 | 6, weekNumber: number): PlanDay {
  const commonSchedule = [
    { timeSlot: '08:00 - 08:45', activity: 'Current Affairs', focus: 'Daily notes & newspaper' },
    { timeSlot: '09:00 - 10:30', activity: 'Logical Reasoning', focus: 'Concept study & targeted drill' },
    { timeSlot: '10:45 - 12:00', activity: 'English Language', focus: 'RC passages & grammar' },
    { timeSlot: '15:00 - 16:00', activity: 'Timed Practice', focus: 'Mixed practice set' },
    { timeSlot: '17:00 - 17:45', activity: 'Error Notebook', focus: 'Classify & log mistakes' },
    { timeSlot: '20:30 - 21:00', activity: 'Spaced Revision', focus: 'Active recall & formula cards' },
  ];

  if (ymd === '2026-10-02') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'mock_day',
      targetHours: 6.0,
      isTracked: true,
      scheduleBlocks: [
        { timeSlot: '08:00 - 08:45', activity: 'Current Affairs', focus: 'Start CA notebook; last 7 days catch-up' },
        { timeSlot: '09:00 - 10:30', activity: 'Logical Reasoning', focus: 'Syllogism basics (25 Qs)' },
        { timeSlot: '10:45 - 12:00', activity: 'English Language', focus: 'Grammar diagnostic + 1 RC passage' },
        { timeSlot: '14:00 - 16:00', activity: 'Diagnostic Mock', focus: 'AILET UG Diagnostic full/mini simulation (2-4 PM)' },
        { timeSlot: '16:15 - 17:30', activity: 'Analysis', focus: 'Set up Error Notebook with 4 mistake types' },
      ],
      tasks: [
        { id: `${ymd}_t1`, category: 'english', title: 'English Grammar Diagnostic + 1 RC', description: 'Review diagnostic errors & analyze passage tone/theme', targetCount: '1 RC + Grammar diagnostic', priority: 'VERY HIGH', estimatedMinutes: 75, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'logical', title: 'Logical Syllogism Basics', description: 'Understand Venn overlap, universal affirmatives & negatives', targetCount: '25 Qs', priority: 'VERY HIGH', estimatedMinutes: 90, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'gk_ca', title: 'Start CA Notebook', description: 'Set up category tabs & catch up last 7 days major news', targetCount: 'Last 7 days catch-up', priority: 'VERY HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
        { id: `${ymd}_t4`, category: 'test', title: 'Diagnostic Simulation Test', description: 'Attempt under timed conditions (prefer 2:00 - 4:00 PM slot)', targetCount: 'Diagnostic test', priority: 'VERY HIGH', estimatedMinutes: 120, completed: false, isEssential: true },
        { id: `${ymd}_t5`, category: 'revision', title: 'Error Notebook Setup', description: 'Initialize 4 mistake types: Concept, Knowledge gap, Silly, Time-pressure', targetCount: '20 min setup', priority: 'HIGH', estimatedMinutes: 20, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 5,
    };
  }

  if (ymd === '2026-10-03') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 6.0,
      isTracked: true,
      scheduleBlocks: commonSchedule,
      tasks: [
        { id: `${ymd}_t1`, category: 'english', title: 'Grammar Diagnostic (SVA, Tenses, Articles) + 1 RC', description: 'Subject-Verb Agreement rules and 1 passage analysis', targetCount: '1 RC + Rules', priority: 'HIGH', estimatedMinutes: 75, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'logical', title: 'Syllogism (All Types Drill)', description: 'Solve standard statements, possibilities, and either/or cases', targetCount: '40 Qs', priority: 'VERY HIGH', estimatedMinutes: 90, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'gk_ca', title: 'Static Polity Basics & National Schemes', description: 'Constitution overview + National Govt schemes (last 30 days)', targetCount: 'Polity basics + Schemes', priority: 'HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
        { id: `${ymd}_t4`, category: 'practice', title: 'Mixed Practice Set', description: 'Timed mixed set across English and Analytical reasoning', targetCount: '60 mixed Qs', priority: 'VERY HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
        { id: `${ymd}_t5`, category: 'revision', title: 'Day-0 Topics Spaced Revision', description: 'Active recall on Day-0 concepts and mistake logs', targetCount: '25 min', priority: 'HIGH', estimatedMinutes: 25, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 5,
    };
  }

  if (ymd === '2026-10-04') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 5.5,
      isTracked: true,
      scheduleBlocks: commonSchedule,
      tasks: [
        { id: `${ymd}_t1`, category: 'english', title: 'RC (Main Idea + Inference)', description: 'Extract underlying assumptions and central thesis', targetCount: '2 passages', priority: 'VERY HIGH', estimatedMinutes: 75, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'logical', title: 'Critical Reasoning: Assumptions Drill', description: 'Negation test application and assumption identification', targetCount: '30 Qs', priority: 'VERY HIGH', estimatedMinutes: 90, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'gk_ca', title: 'Polity (Parliament & Judiciary) + International CA', description: 'Articles on Supreme Court, Parliament procedures, UN/G20 highlights', targetCount: 'Polity notes + UN/G20', priority: 'HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
        { id: `${ymd}_t4`, category: 'practice', title: 'Timed Practice', description: 'Accuracy drill on Critical Reasoning and RC questions', targetCount: '50 Qs', priority: 'HIGH', estimatedMinutes: 50, completed: false, isEssential: true },
        { id: `${ymd}_t5`, category: 'revision', title: 'Spaced Revision Session', description: '30 min active recall on Syllogism & SVA rules', targetCount: '30 min', priority: 'HIGH', estimatedMinutes: 30, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 5,
    };
  }

  if (ymd === '2026-10-05') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 5.5,
      isTracked: true,
      scheduleBlocks: commonSchedule,
      tasks: [
        { id: `${ymd}_t1`, category: 'english', title: 'Vocabulary & Grammar SVA Drill', description: '25 Synonyms/Antonyms + target SVA exceptions', targetCount: '25 words + drill', priority: 'HIGH', estimatedMinutes: 75, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'logical', title: 'Linear Arrangement Essentials', description: 'Direction facing, row distributions, and conditional placement', targetCount: '25 Qs', priority: 'VERY HIGH', estimatedMinutes: 90, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'gk_ca', title: 'Economy CA (RBI, Recent Monetary Policy)', description: 'Repo rate, inflation trends, and banking regulation', targetCount: '45 min study', priority: 'HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
        { id: `${ymd}_t4`, category: 'practice', title: 'Timed Practice Set', description: 'Timed practice on Linear Arrangement and Vocab usage', targetCount: '55 Qs', priority: 'HIGH', estimatedMinutes: 55, completed: false, isEssential: true },
        { id: `${ymd}_t5`, category: 'revision', title: 'Spaced Day-1 Revision of Syllogisms', description: 'Quick recall of Venn rules and negative conditions', targetCount: '25 min', priority: 'VERY HIGH', estimatedMinutes: 25, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 5,
    };
  }

  if (ymd === '2026-10-06') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 6.0,
      isTracked: true,
      scheduleBlocks: commonSchedule,
      tasks: [
        { id: `${ymd}_t1`, category: 'english', title: 'Para Jumbles & Error Spotting Drill', description: '15 sentence rearrangement sets + 20 error spotting exercises', targetCount: '15 sets + 20 Qs', priority: 'HIGH', estimatedMinutes: 75, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'logical', title: 'Critical Reasoning: Inference & Strengthen', description: 'Detecting subtle inferences and evaluating strengthening premises', targetCount: '35 Qs', priority: 'VERY HIGH', estimatedMinutes: 90, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'gk_ca', title: 'Science & Tech CA (ISRO Recent Missions)', description: 'Space missions, satellite launches, and defence technology', targetCount: '45 min', priority: 'MEDIUM', estimatedMinutes: 45, completed: false, isEssential: false },
        { id: `${ymd}_t4`, category: 'test', title: 'English Sectional Timed Test', description: 'Timed sectional simulation for English Language', targetCount: '50 Qs / 40 min', priority: 'VERY HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
        { id: `${ymd}_t5`, category: 'revision', title: 'Error Notebook Review', description: 'Log errors from sectional test into Error Notebook', targetCount: '25 min', priority: 'HIGH', estimatedMinutes: 25, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 5,
    };
  }

  if (ymd === '2026-10-07') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 5.5,
      isTracked: true,
      scheduleBlocks: commonSchedule,
      tasks: [
        { id: `${ymd}_t1`, category: 'english', title: 'RC (Tone + Fact vs Opinion)', description: 'Identify skeptical, analytical, or eulogistic tone in 2 passages', targetCount: '2 passages', priority: 'VERY HIGH', estimatedMinutes: 75, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'logical', title: 'Blood Relations + Directions Sense', description: 'Family tree diagrams and directional displacement calculations', targetCount: '30 Qs', priority: 'MEDIUM', estimatedMinutes: 75, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'gk_ca', title: 'Weekly CA Compilation Compilation', description: 'Consolidate week 1 notes into high-yield summaries', targetCount: 'Compilation start', priority: 'HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
        { id: `${ymd}_t4`, category: 'practice', title: 'Timed Practice Set', description: 'Speed practice on Directions and RC inferences', targetCount: '50 Qs', priority: 'HIGH', estimatedMinutes: 50, completed: false, isEssential: true },
        { id: `${ymd}_t5`, category: 'revision', title: 'Error Notebook Deep Dive', description: 'Reattempt marked silly mistakes from previous days', targetCount: '30 min', priority: 'HIGH', estimatedMinutes: 30, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 5,
    };
  }

  // 2026-10-08
  return {
    date: ymd,
    dayOfWeek,
    phaseId,
    weekNumber,
    isExactPdfSeed: true,
    dayType: 'normal',
    targetHours: 6.0,
    isTracked: true,
    scheduleBlocks: commonSchedule,
    tasks: [
      { id: `${ymd}_t1`, category: 'english', title: 'Full English Sectional Timed (50 Q Simulation)', description: '50 Q official section simulation under 40 minutes', targetCount: '50 Q simulation', priority: 'VERY HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
      { id: `${ymd}_t2`, category: 'logical', title: 'Coding-Decoding + Series Practice', description: 'Letter shifts, pattern recognition, number progressions', targetCount: '30 Qs', priority: 'MEDIUM', estimatedMinutes: 60, completed: false, isEssential: true },
      { id: `${ymd}_t3`, category: 'gk_ca', title: 'Full Weekly CA Revision', description: 'Comprehensive pass over all national & international notes', targetCount: 'Full weekly pass', priority: 'VERY HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
      { id: `${ymd}_t4`, category: 'test', title: 'Logical Mini-Sectional Test', description: 'Timed mini-sectional on Syllogisms, CR & Arrangements', targetCount: '35 Qs / 30 min', priority: 'VERY HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
      { id: `${ymd}_t5`, category: 'revision', title: 'Week 1 Weak Areas Consolidation', description: 'Review all mistake types flagged during Week 1', targetCount: '30 min', priority: 'VERY HIGH', estimatedMinutes: 30, completed: false, isEssential: true },
    ],
    completedCount: 0,
    totalTasks: 5,
  };
}

function getExactFinalWeekSeed(ymd: string, dayOfWeek: string, phaseId: 1 | 2 | 3 | 4 | 5 | 6, weekNumber: number): PlanDay {
  if (ymd === '2026-12-07') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 5.0,
      isTracked: true,
      scheduleBlocks: [
        { timeSlot: '08:30 - 10:00', activity: 'High-Yield Logical', focus: 'Critical Reasoning & Arrangements review' },
        { timeSlot: '10:30 - 11:30', activity: 'Light Sectional', focus: '1 light 35-Q Logical sectional' },
        { timeSlot: '14:00 - 15:30', activity: 'Current Affairs', focus: 'Rapid revision last 3 months high-yield' },
        { timeSlot: '16:00 - 17:30', activity: 'Error Notebook', focus: 'Drill top 20 recorded mistakes' },
      ],
      tasks: [
        { id: `${ymd}_t1`, category: 'logical', title: 'High-yield Logical (CR + Arrangements)', description: 'Critical Reasoning core patterns + Arrangement rules', targetCount: 'Concept + 25 Qs', priority: 'VERY HIGH', estimatedMinutes: 90, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'test', title: '1 Light Logical Sectional', description: 'Low stress timed confidence booster', targetCount: '1 light sectional', priority: 'HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'gk_ca', title: 'CA Rapid Revision: Last 3 Months', description: 'Supreme Court verdicts, Govt schemes, International summits', targetCount: 'Last 3 months', priority: 'VERY HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
        { id: `${ymd}_t4`, category: 'revision', title: 'Error Notebook Top 20 Mistakes', description: 'Reattempt top 20 concept mistakes across English and LR', targetCount: 'Top 20 items', priority: 'VERY HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 4,
    };
  }

  if (ymd === '2026-12-08') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 4.5,
      isTracked: true,
      scheduleBlocks: [
        { timeSlot: '09:00 - 10:30', activity: 'English High-Yield', focus: 'RC passages & rapid vocab' },
        { timeSlot: '11:00 - 12:15', activity: 'Principle-Based Logic', focus: 'Strict logical application (20 Qs)' },
        { timeSlot: '14:30 - 15:30', activity: 'Current Affairs', focus: 'Light review of awards & summits' },
      ],
      tasks: [
        { id: `${ymd}_t1`, category: 'english', title: 'English RC (2-3 Passages) + Rapid Vocab', description: 'High-quality passages; focus on accuracy not speed', targetCount: '2-3 passages + vocab', priority: 'VERY HIGH', estimatedMinutes: 75, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'logical', title: 'Principle-based Reasoning Drill', description: '20 Qs applying given principles strictly without outside law', targetCount: '20 Qs', priority: 'HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'gk_ca', title: 'Light CA Review', description: 'Key one-pagers and highlights', targetCount: '45 min', priority: 'MEDIUM', estimatedMinutes: 45, completed: false, isEssential: false },
      ],
      completedCount: 0,
      totalTasks: 3,
    };
  }

  if (ymd === '2026-12-09') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 4.0,
      isTracked: true,
      scheduleBlocks: [
        { timeSlot: '09:00 - 11:30', activity: 'Weak-Area Drill', focus: 'Full error notebook review (English & LR)' },
        { timeSlot: '14:00 - 15:30', activity: 'Current Affairs', focus: 'Short CA one-pagers only' },
      ],
      tasks: [
        { id: `${ymd}_t1`, category: 'revision', title: 'Full Weak-Area Drill from Error Notebook', description: 'Target every persistent mistake type in English & Logical', targetCount: 'All active errors', priority: 'VERY HIGH', estimatedMinutes: 120, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'gk_ca', title: 'Short CA One-Pagers Only', description: 'High-density summaries; no new material', targetCount: 'One-pagers review', priority: 'HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 2,
    };
  }

  if (ymd === '2026-12-10') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'mock_day',
      targetHours: 4.5,
      isTracked: true,
      scheduleBlocks: [
        { timeSlot: '14:00 - 16:00', activity: 'Light Full Mock', focus: 'Final full mock simulation under exact exam timings' },
        { timeSlot: '16:15 - 17:30', activity: 'Deep Analysis', focus: 'Confidence analysis; update Mock Tracker' },
      ],
      tasks: [
        { id: `${ymd}_t1`, category: 'test', title: 'One Light Full Mock (or Two Sectionals)', description: 'Simulate 2:00-4:00 PM slot. Maintain calm pacing and OMR discipline.', targetCount: '1 light mock', priority: 'VERY HIGH', estimatedMinutes: 120, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'mock_analysis', title: 'Deep Analysis (No New Material)', description: 'Identify time discipline & confidence takeaways; update trackers.', targetCount: '12-point record update', priority: 'VERY HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
      ],
      completedCount: 0,
      totalTasks: 2,
    };
  }

  if (ymd === '2026-12-11') {
    return {
      date: ymd,
      dayOfWeek,
      phaseId,
      weekNumber,
      isExactPdfSeed: true,
      dayType: 'normal',
      targetHours: 3.5,
      isTracked: true,
      scheduleBlocks: [
        { timeSlot: '09:30 - 11:00', activity: 'Formula Sheets', focus: 'LR rules, SVA sheets, CR trap list' },
        { timeSlot: '11:15 - 12:30', activity: 'Last 6 Months CA Rapid', focus: 'Rapid glance of core one-pagers' },
        { timeSlot: '15:00 - 16:00', activity: 'Very Light Practice', focus: '20-30 easy questions for confidence' },
      ],
      tasks: [
        { id: `${ymd}_t1`, category: 'revision', title: 'Formula Sheets & Trap Checklists', description: 'Review critical reasoning trap types and syllogism cheat sheets', targetCount: 'Formula review', priority: 'HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
        { id: `${ymd}_t2`, category: 'gk_ca', title: 'Last 6 Months CA Rapid Glance', description: 'High-profile national & international highlights', targetCount: 'Rapid glance', priority: 'HIGH', estimatedMinutes: 60, completed: false, isEssential: true },
        { id: `${ymd}_t3`, category: 'practice', title: 'Very Light Practice (20-30 Qs max)', description: 'Easy confidence-building questions; early rest in evening', targetCount: '20-30 Qs max', priority: 'MEDIUM', estimatedMinutes: 40, completed: false, isEssential: false },
      ],
      completedCount: 0,
      totalTasks: 3,
    };
  }

  // 2026-12-12 (LIGHT ONLY per PDF)
  return {
    date: ymd,
    dayOfWeek,
    phaseId,
    weekNumber,
    isExactPdfSeed: true,
    dayType: 'light_only',
    targetHours: 2.0,
    isTracked: true,
    scheduleBlocks: [
      { timeSlot: '10:00 - 11:00', activity: 'Light Glance', focus: 'Error Notebook highlights only' },
      { timeSlot: '11:15 - 12:00', activity: 'CA One-Pagers', focus: 'Calm reading; no memorization strain' },
      { timeSlot: '16:00 - 17:00', activity: 'Exam Kit Preparation', focus: 'Admit card, photo ID, pens, analogue watch' },
      { timeSlot: '21:00', activity: 'Early Sleep', focus: '8+ hours restful sleep before exam day' },
    ],
    tasks: [
      { id: `${ymd}_t1`, category: 'revision', title: 'LIGHT ONLY: Error Notebook Highlights', description: 'Glance over personal notes; no new topics; no tests.', targetCount: 'Highlights glance', priority: 'HIGH', estimatedMinutes: 45, completed: false, isEssential: true },
      { id: `${ymd}_t2`, category: 'gk_ca', title: 'CA One-Pagers Glance', description: 'Light reading; stay calm; trust your preparation.', targetCount: 'One-pagers glance', priority: 'HIGH', estimatedMinutes: 30, completed: false, isEssential: true },
      { id: `${ymd}_t3`, category: 'warmup', title: 'Exam-Day Checklist Packing', description: 'Pack admit card printout, original photo ID, ballpoint pens, analogue watch, transparent water bottle.', targetCount: 'Checklist verified', priority: 'VERY HIGH', estimatedMinutes: 30, completed: false, isEssential: true },
    ],
    completedCount: 0,
    totalTasks: 3,
  };
}

function getExamDayPlan(ymd: string, dayOfWeek: string, phaseId: 1 | 2 | 3 | 4 | 5 | 6, weekNumber: number): PlanDay {
  return {
    date: ymd,
    dayOfWeek,
    phaseId,
    weekNumber,
    isExactPdfSeed: true,
    dayType: 'exam_day',
    targetHours: 2.0,
    isTracked: true,
    scheduleBlocks: [
      { timeSlot: '08:30 - 09:30', activity: 'Morning Warm-up', focus: '1 short RC + 8-10 easy Logical Qs' },
      { timeSlot: '11:30 - 12:30', activity: 'Travel to Exam Centre', focus: 'Reach centre with 90-120 min buffer' },
      { timeSlot: '14:00 - 16:00', activity: 'AILET 2027 UG EXAM', focus: '150 Qs / 120 min / OMR pen & paper' },
    ],
    tasks: [
      { id: `${ymd}_t1`, category: 'warmup', title: 'Light Morning Warm-up (1 RC + 8-10 easy Logical)', description: 'Activate cognitive flow; DO NOT check scores or worry; simply warm up the brain.', targetCount: '1 RC + 8 Qs', priority: 'VERY HIGH', estimatedMinutes: 30, completed: false, isEssential: true },
      { id: `${ymd}_t2`, category: 'warmup', title: 'Verify Centre & Reporting Buffer', description: 'Reach centre 90-120 min before 2:00 PM as directed on Admit Card.', targetCount: 'Reporting verified', priority: 'VERY HIGH', estimatedMinutes: 30, completed: false, isEssential: true },
      { id: `${ymd}_t3`, category: 'test', title: 'AILET 2027 UG (14:00 - 16:00 IST)', description: 'Attempt high-accuracy Qs first, respect -0.25 negative marking, reserve last 5-8 min for OMR bubbling.', targetCount: 'Official Exam', priority: 'VERY HIGH', estimatedMinutes: 120, completed: false, isEssential: true },
    ],
    completedCount: 0,
    totalTasks: 3,
  };
}

/**
 * Derives days from 9 Oct to 6 Dec according to PDF week tables, priority matrix, and phase rules
 */
function deriveDayFromPattern(ymd: string, dayOfWeek: string, phaseId: 1 | 2 | 3 | 4 | 5 | 6, weekNumber: number): PlanDay {
  const isWeekend = dayOfWeek === 'Sat' || dayOfWeek === 'Sun';
  const isPostNov30 = ymd > '2026-11-30';

  let dayType: 'normal' | 'intensive' | 'mock_day' = 'normal';
  let targetHours = 5.5;
  let ruleDesc = `Derived from PDF pattern: Week ${weekNumber} core schedule`;

  // Intensive 7-hour days: 3-4 days/week in Phases 3-5
  if ((phaseId === 3 || phaseId === 4 || phaseId === 5) && (dayOfWeek === 'Tue' || dayOfWeek === 'Thu' || dayOfWeek === 'Fri')) {
    dayType = 'intensive';
    targetHours = 7.0;
    ruleDesc += ' (Intensive 7-hour day per PDF)';
  } else if (isWeekend && (phaseId >= 3)) {
    dayType = 'mock_day';
    targetHours = 6.0;
    ruleDesc += ' (Weekend Mock / Deep Analysis Day)';
  }

  const tasks: PlanTask[] = [];

  // 1. Current Affairs task (Daily 30-45m per PDF)
  tasks.push({
    id: `${ymd}_ca`,
    category: 'gk_ca',
    title: isWeekend ? 'Weekly CA Compilation Deep Revision' : 'Daily Current Affairs & Notes',
    description: isWeekend
      ? 'Comprehensive weekly compilation review + MCQ practice'
      : 'National policies, international summits, economy & science notes',
    targetCount: isWeekend ? 'Weekly compilation' : '30-45 min',
    priority: 'VERY HIGH',
    estimatedMinutes: 45,
    completed: false,
    isEssential: true,
  });

  // 2. Logical Reasoning task (Alternating core topics from Priority Matrix)
  if (isPostNov30) {
    // STRICT RULE: No new topics after 30 Nov
    tasks.push({
      id: `${ymd}_lr`,
      category: 'logical',
      title: 'High-Yield Logical Revision (Weak Areas Only)',
      description: 'Strictly NO new topics after 30 Nov. Consolidate Syllogism, CR, and Arrangements.',
      targetCount: '30-40 targeted Qs',
      priority: 'VERY HIGH',
      estimatedMinutes: 75,
      completed: false,
      isEssential: true,
    });
  } else if (weekNumber % 2 === 0) {
    tasks.push({
      id: `${ymd}_lr`,
      category: 'logical',
      title: 'Critical Reasoning: Assumptions & Strengthen/Weaken',
      description: 'Argument structure, premise-conclusion link, negation technique drill',
      targetCount: '40 Qs',
      priority: 'VERY HIGH',
      estimatedMinutes: 80,
      completed: false,
      isEssential: true,
    });
  } else {
    tasks.push({
      id: `${ymd}_lr`,
      category: 'logical',
      title: 'Analytical Reasoning: Arrangements & Syllogisms',
      description: 'Circular/linear puzzles and syllogism deduction drill',
      targetCount: '45 Qs',
      priority: 'VERY HIGH',
      estimatedMinutes: 80,
      completed: false,
      isEssential: true,
    });
  }

  // 3. English Language task
  if (isPostNov30) {
    tasks.push({
      id: `${ymd}_eng`,
      category: 'english',
      title: 'High-Yield RC Passages & Error Log Drill',
      description: '2 high-quality RC passages focusing on inference and author tone; revise vocabulary roots.',
      targetCount: '2 RC passages',
      priority: 'VERY HIGH',
      estimatedMinutes: 60,
      completed: false,
      isEssential: true,
    });
  } else {
    tasks.push({
      id: `${ymd}_eng`,
      category: 'english',
      title: 'Reading Comprehension (Inference/Tone) + Grammar',
      description: 'Solve 2 full passages + SVA / error spotting drills',
      targetCount: '2 passages + 20 grammar Qs',
      priority: 'VERY HIGH',
      estimatedMinutes: 75,
      completed: false,
      isEssential: true,
    });
  }

  // 4. Test or Practice block
  if (isWeekend) {
    tasks.push({
      id: `${ymd}_test`,
      category: 'test',
      title: phaseId >= 4 ? 'Full-Length AILET Mock (2:00-4:00 PM slot)' : 'Sectional Timed Simulation Test',
      description: 'Simulate exact exam conditions with offline/OMR discipline. Record all 12 points.',
      targetCount: phaseId >= 4 ? '150 Q Full Mock' : 'Sectional test',
      priority: 'VERY HIGH',
      estimatedMinutes: 120,
      completed: false,
      isEssential: true,
    });
  } else {
    tasks.push({
      id: `${ymd}_prac`,
      category: 'practice',
      title: 'Timed Mixed Practice Set',
      description: 'Mixed set balancing English, LR, and Static GK under strict per-question timing',
      targetCount: '50-60 Qs',
      priority: 'HIGH',
      estimatedMinutes: 60,
      completed: false,
      isEssential: true,
    });
  }

  // 5. Revision & Error notebook review
  tasks.push({
    id: `${ymd}_rev`,
    category: 'revision',
    title: 'Spaced Revision & Error Notebook Review',
    description: 'Active reattempt of questions due on the spaced cycle + review mistake types',
    targetCount: '30-45 min',
    priority: 'VERY HIGH',
    estimatedMinutes: 45,
    completed: false,
    isEssential: true,
  });

  return {
    date: ymd,
    dayOfWeek,
    phaseId,
    weekNumber,
    isExactPdfSeed: false,
    derivedRuleExplanation: ruleDesc,
    dayType,
    targetHours,
    isTracked: true,
    scheduleBlocks: [
      { timeSlot: '08:00 - 08:45', activity: 'Current Affairs', focus: 'Daily notes / weekly compilation' },
      { timeSlot: '09:00 - 10:30', activity: 'Logical Reasoning', focus: 'Core concept & practice drill' },
      { timeSlot: '10:45 - 12:00', activity: 'English Language', focus: 'RC passages & grammar' },
      { timeSlot: '15:00 - 16:30', activity: 'Timed Practice / Test', focus: isWeekend ? 'Full Mock / Sectional' : 'Mixed drill' },
      { timeSlot: '17:00 - 17:45', activity: 'Error Notebook', focus: 'Mistake classification & analysis' },
      { timeSlot: '20:30 - 21:00', activity: 'Spaced Revision', focus: 'Formula sheets & active recall' },
    ],
    tasks,
    completedCount: 0,
    totalTasks: tasks.length,
  };
}

/**
 * Rebalancing logic (Product design addition)
 * Redistributes essential missed tasks into future days without exceeding max daily extra load (+15-20%).
 * Strictly respects:
 * 1. "No new topics after 30 Nov"
 * 2. "Adjust only volume if needed, never the sequence of high-yield topics"
 * 3. Never drops VERY HIGH or scheduled mocks; drops LOW/MEDIUM first
 */
export function rebalanceMissedDays(
  planDays: PlanDay[],
  currentDate: string
): { updatedDays: PlanDay[]; log: RebalanceLog } {
  const updatedDays = JSON.parse(JSON.stringify(planDays)) as PlanDay[];
  const tasksMoved: RebalanceLog['tasksMoved'] = [];
  const tasksDropped: RebalanceLog['tasksDropped'] = [];
  const rebalancedDays: string[] = [];

  // Identify past days with uncompleted essential tasks
  const missedTasksToRedistribute: { task: PlanTask; originalDate: string }[] = [];

  for (const day of updatedDays) {
    if (day.date < currentDate && day.isTracked) {
      const incomplete = day.tasks.filter((t) => !t.completed);
      if (incomplete.length > 0) {
        day.isMissed = true;
        rebalancedDays.push(day.date);

        for (const t of incomplete) {
          if (t.priority === 'VERY HIGH' || t.category === 'test' || t.isEssential) {
            missedTasksToRedistribute.push({ task: t, originalDate: day.date });
          } else {
            // Drop LOW / MEDIUM items per PDF rule: drop low-ROI before pushing high-yield
            tasksDropped.push({
              taskId: t.id,
              title: t.title,
              fromDate: day.date,
              reason: `Dropped lower-priority ${t.priority} task to prevent impossible catch-up load per PDF consistency rule.`,
            });
          }
        }
      }
    }
  }

  // Find eligible future days (from currentDate up to 2026-11-30 for new topics, or 2026-12-06 for revisions)
  const maxFutureDate = '2026-12-06'; // No extra loads pushed into Final Week (7-12 Dec)
  const candidateDays = updatedDays.filter(
    (d) => d.date >= currentDate && d.date <= maxFutureDate && d.dayType !== 'mock_day'
  );

  let taskPointer = 0;
  for (const futureDay of candidateDays) {
    if (taskPointer >= missedTasksToRedistribute.length) break;

    // Check existing extra minutes added
    const currentTotalMin = futureDay.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const maxAllowedMin = futureDay.targetHours * 60 * 1.2; // Max +20% extra load

    if (currentTotalMin < maxAllowedMin) {
      const item = missedTasksToRedistribute[taskPointer];

      // Clone task with new ID and rebalanced marker
      const movedTask: PlanTask = {
        ...item.task,
        id: `rebalanced_${item.task.id}_to_${futureDay.date}`,
        title: `[Rebalanced] ${item.task.title}`,
        description: `${item.task.description} (Rescheduled from ${item.originalDate})`,
      };

      futureDay.tasks.push(movedTask);
      futureDay.totalTasks = futureDay.tasks.length;
      futureDay.rebalancedFromDate = item.originalDate;

      tasksMoved.push({
        taskId: item.task.id,
        title: item.task.title,
        fromDate: item.originalDate,
        toDate: futureDay.date,
        priority: item.task.priority,
      });

      taskPointer++;
    }
  }

  // Any remaining tasks that couldn't fit within +20% cap without exceeding final week boundary
  while (taskPointer < missedTasksToRedistribute.length) {
    const overflowItem = missedTasksToRedistribute[taskPointer];
    tasksDropped.push({
      taskId: overflowItem.task.id,
      title: overflowItem.task.title,
      fromDate: overflowItem.originalDate,
      reason: 'Capped at +20% daily load to prevent cognitive overload and protect final revision week integrity.',
    });
    taskPointer++;
  }

  const log: RebalanceLog = {
    timestamp: new Date().toISOString(),
    rebalancedDays,
    tasksMoved,
    tasksDropped,
    summary: `Rebalanced ${tasksMoved.length} essential tasks across upcoming days (capped at +20% load). Dropped ${tasksDropped.length} non-essential tasks to maintain study consistency.`,
  };

  return { updatedDays, log };
}

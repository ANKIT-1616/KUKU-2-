// src/services/adaptiveEngine.ts
import { MockAttemptResult } from '../types/mock';
import { ErrorNotebookEntry } from '../types/error';

export interface WeakAreaInsight {
  topicId: string;
  topicName: string;
  sectionId: 'english' | 'ca_gk' | 'logical';
  attemptsCount: number;
  accuracyPercentage: number;
  distinctSessionsCount: number;
  recentMistakeTypes: string[];
  recommendedInterventionSequence: {
    step: number;
    title: string;
    description: string;
    actionType: 'concept_review' | 'easy_practice' | 'medium_practice' | 'hard_practice' | 'error_reattempt' | 'targeted_test';
  }[];
}

/**
 * Detects weak areas based purely on actual performance data.
 * Rule: Accuracy < threshold (default 60%) with >= minimum attempts (default 5) across >= minimum sessions (default 2).
 * Strictly avoids fake score predictions or percentiles.
 */
export function detectWeakAreas(
  attempts: MockAttemptResult[],
  errorEntries: ErrorNotebookEntry[],
  accuracyThreshold = 60,
  minAttempts = 5,
  minSessions = 2
): WeakAreaInsight[] {
  if (attempts.length === 0 && errorEntries.length === 0) {
    return [];
  }

  // Aggregate questions by topic
  const topicStats: Record<string, {
    topicId: string;
    topicName: string;
    sectionId: 'english' | 'ca_gk' | 'logical';
    attempts: number;
    correct: number;
    sessions: Set<string>;
    mistakeTypes: Set<string>;
  }> = {};

  // Process mock attempts
  for (const att of attempts) {
    const responses = att.questionResponses || {};
    for (const qId of Object.keys(responses)) {
      const resp = responses[qId];
      const tid = resp.topicId || 'general';
      if (!topicStats[tid]) {
        topicStats[tid] = {
          topicId: tid,
          topicName: formatTopicName(tid),
          sectionId: resp.sectionId as any || 'logical',
          attempts: 0,
          correct: 0,
          sessions: new Set(),
          mistakeTypes: new Set(),
        };
      }
      topicStats[tid].attempts++;
      if (resp.isCorrect) {
        topicStats[tid].correct++;
      }
      topicStats[tid].sessions.add(att.id);
      if (resp.mistakeType) {
        topicStats[tid].mistakeTypes.add(resp.mistakeType);
      }
    }
  }

  // Also include logged errors
  for (const err of errorEntries) {
    const tid = err.topic || 'general';
    if (!topicStats[tid]) {
      topicStats[tid] = {
        topicId: tid,
        topicName: err.topic,
        sectionId: err.sectionId,
        attempts: 1,
        correct: 0,
        sessions: new Set([err.date]),
        mistakeTypes: new Set([err.mistakeType]),
      };
    } else {
      topicStats[tid].mistakeTypes.add(err.mistakeType);
      topicStats[tid].sessions.add(err.date);
    }
  }

  const weakAreas: WeakAreaInsight[] = [];

  for (const tid of Object.keys(topicStats)) {
    const stat = topicStats[tid];
    const acc = stat.attempts > 0 ? (stat.correct / stat.attempts) * 100 : 0;
    const sessionCount = stat.sessions.size;

    if (acc < accuracyThreshold && stat.attempts >= minAttempts && sessionCount >= minSessions) {
      weakAreas.push({
        topicId: tid,
        topicName: stat.topicName,
        sectionId: stat.sectionId,
        attemptsCount: stat.attempts,
        accuracyPercentage: Math.round(acc),
        distinctSessionsCount: sessionCount,
        recentMistakeTypes: Array.from(stat.mistakeTypes),
        recommendedInterventionSequence: [
          {
            step: 1,
            title: 'Concept Revision',
            description: `Review fundamental rules and notes for ${stat.topicName}. Identify core conceptual blindspots.`,
            actionType: 'concept_review',
          },
          {
            step: 2,
            title: 'Easy Foundation Drill',
            description: 'Solve 10 un-timed easy foundation questions to rebuild baseline confidence.',
            actionType: 'easy_practice',
          },
          {
            step: 3,
            title: 'Medium Difficulty Drill',
            description: 'Solve 15 standard difficulty questions matching AILET UG past question benchmarks.',
            actionType: 'medium_practice',
          },
          {
            step: 4,
            title: 'Hard / Trap Question Drill',
            description: 'Solve 10 rigorous trap-heavy questions under timed constraints (45 sec/Q).',
            actionType: 'hard_practice',
          },
          {
            step: 5,
            title: 'Error Notebook Reattempt',
            description: `Reattempt all past recorded mistakes in ${stat.topicName} with zero hints.`,
            actionType: 'error_reattempt',
          },
          {
            step: 6,
            title: 'Targeted Timed Sprint Test',
            description: 'Take a focused 15-question, 12-minute sprint test to verify topic recovery.',
            actionType: 'targeted_test',
          },
        ],
      });
    }
  }

  return weakAreas.sort((a, b) => a.accuracyPercentage - b.accuracyPercentage);
}

function formatTopicName(tid: string): string {
  if (tid === 'eng_rc') return 'Reading Comprehension';
  if (tid === 'eng_vocab') return 'Vocabulary';
  if (tid === 'eng_grammar') return 'Grammar (SVA, Tenses)';
  if (tid === 'eng_verbal') return 'Verbal Ability (Para Jumbles)';
  if (tid === 'ca_core') return 'Current Affairs Core';
  if (tid === 'ca_static_gk') return 'Static GK (Polity / History)';
  if (tid === 'lr_cr') return 'Critical Reasoning';
  if (tid === 'lr_analytical_core') return 'Syllogism + Arrangements';
  if (tid === 'lr_principle_facts') return 'Principle + Facts';
  if (tid === 'lr_analytical_misc') return 'Series & Coding';
  return tid;
}

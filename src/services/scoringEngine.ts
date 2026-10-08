// src/services/scoringEngine.ts
import { ExamConfig, ScoreBreakdown } from '../types/exam';
import { QuestionItem } from '../types/question';

export interface AnswerSubmission {
  questionId: string;
  selectedOptionId: string | null;
  isMarkedForReview?: boolean;
}

/**
 * Pure scoring calculation module strictly driven by ExamConfig.
 * Never hard-codes marks, negative marking, or question counts.
 */
export function calculateExamScore(
  config: ExamConfig,
  questions: QuestionItem[],
  userSubmissions: Record<string, AnswerSubmission>
): ScoreBreakdown {
  const { markingScheme, sections } = config;

  let totalAttempted = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalUnattempted = 0;
  let totalMarkedForReview = 0;
  let totalScore = 0;

  // Pre-initialize section accumulators
  const sectionStats: Record<string, {
    sectionName: string;
    attempted: number;
    correct: number;
    wrong: number;
    unattempted: number;
    score: number;
    maxScore: number;
    accuracyPercentage: number;
  }> = {};

  for (const sec of sections) {
    sectionStats[sec.id] = {
      sectionName: sec.name,
      attempted: 0,
      correct: 0,
      wrong: 0,
      unattempted: 0,
      score: 0,
      maxScore: sec.marks,
      accuracyPercentage: 0,
    };
  }

  // Evaluate each question
  for (const q of questions) {
    const sub = userSubmissions[q.id];
    const secId = q.sectionId;

    if (!sectionStats[secId]) {
      const fallbackSec = sections.find((s) => s.id === secId);
      sectionStats[secId] = {
        sectionName: fallbackSec ? fallbackSec.name : secId,
        attempted: 0,
        correct: 0,
        wrong: 0,
        unattempted: 0,
        score: 0,
        maxScore: fallbackSec ? fallbackSec.marks : 0,
        accuracyPercentage: 0,
      };
    }

    if (sub?.isMarkedForReview) {
      totalMarkedForReview += 1;
    }

    const selected = sub?.selectedOptionId?.trim();

    if (!selected) {
      // Unattempted
      totalUnattempted += 1;
      sectionStats[secId].unattempted += 1;
      totalScore += markingScheme.unattempted;
      sectionStats[secId].score += markingScheme.unattempted;
    } else {
      // Attempted
      totalAttempted += 1;
      sectionStats[secId].attempted += 1;

      if (selected.toUpperCase() === q.correctAnswer.toUpperCase()) {
        totalCorrect += 1;
        sectionStats[secId].correct += 1;
        totalScore += markingScheme.correct;
        sectionStats[secId].score += markingScheme.correct;
      } else {
        totalWrong += 1;
        sectionStats[secId].wrong += 1;
        totalScore += markingScheme.incorrect;
        sectionStats[secId].score += markingScheme.incorrect;
      }
    }
  }

  // Calculate accuracies
  const accuracyPercentage =
    totalAttempted > 0 ? Number(((totalCorrect / totalAttempted) * 100).toFixed(2)) : 0;
  const attemptPercentage =
    questions.length > 0 ? Number(((totalAttempted / questions.length) * 100).toFixed(2)) : 0;

  for (const secKey of Object.keys(sectionStats)) {
    const sec = sectionStats[secKey];
    sec.accuracyPercentage =
      sec.attempted > 0 ? Number(((sec.correct / sec.attempted) * 100).toFixed(2)) : 0;
    // Round score to two decimals (handle float inaccuracies e.g. -0.25 * 3)
    sec.score = Math.round(sec.score * 100) / 100;
  }

  return {
    totalQuestions: questions.length,
    attempted: totalAttempted,
    correct: totalCorrect,
    wrong: totalWrong,
    unattempted: totalUnattempted,
    markedForReview: totalMarkedForReview,
    score: Math.round(totalScore * 100) / 100,
    maxScore: config.totalMarks,
    accuracyPercentage,
    attemptPercentage,
    sectionScores: sectionStats,
  };
}

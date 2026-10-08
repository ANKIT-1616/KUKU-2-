// src/services/questionValidator.ts
import { QuestionItem } from '../types/question';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  field: string;
  message: string;
}

export interface QuestionValidationReport {
  isValid: boolean;
  canBeValidatedStatus: boolean;
  issues: ValidationIssue[];
  automatedChecksPassed: boolean;
}

/**
 * Automated checks for the Question Quality Pipeline
 */
export function validateQuestionItem(q: Partial<QuestionItem>): QuestionValidationReport {
  const issues: ValidationIssue[] = [];

  // 1. Basic presence checks
  if (!q.question || q.question.trim().length < 10) {
    issues.push({
      severity: 'error',
      field: 'question',
      message: 'Question text is missing or too brief (minimum 10 characters required).',
    });
  }

  // 2. Options checks: exactly 4 options A, B, C, D
  if (!q.options || q.options.length !== 4) {
    issues.push({
      severity: 'error',
      field: 'options',
      message: 'AILET UG requires exactly 4 options (A, B, C, D).',
    });
  } else {
    const optionTexts = q.options.map((opt) => opt.text.trim().toLowerCase());
    const uniqueTexts = new Set(optionTexts);

    if (uniqueTexts.size < 4) {
      issues.push({
        severity: 'error',
        field: 'options',
        message: 'Duplicate option texts detected. All 4 options must be distinct.',
      });
    }

    for (const opt of q.options) {
      if (!opt.text || opt.text.trim().length === 0) {
        issues.push({
          severity: 'error',
          field: 'options',
          message: `Option ${opt.id} text cannot be blank.`,
        });
      }
    }
  }

  // 3. Correct answer validation
  const validAnswers = ['A', 'B', 'C', 'D'];
  if (!q.correctAnswer || !validAnswers.includes(q.correctAnswer.toUpperCase())) {
    issues.push({
      severity: 'error',
      field: 'correctAnswer',
      message: 'Correct answer must be one of A, B, C, or D.',
    });
  }

  // 4. Explanation requirement
  if (!q.explanation || q.explanation.trim().length < 15) {
    issues.push({
      severity: 'error',
      field: 'explanation',
      message: 'Detailed explanation is required (minimum 15 characters) explaining why the answer is correct.',
    });
  }

  // 5. Section & topic mapping
  if (!q.sectionId || !['english', 'ca_gk', 'logical'].includes(q.sectionId)) {
    issues.push({
      severity: 'error',
      field: 'sectionId',
      message: 'Section must be one of: english, ca_gk, or logical.',
    });
  }

  // 6. Check for AILET principle-based logic purity
  if (q.sectionId === 'logical' && q.topicId === 'lr_principle_facts') {
    const textToCheck = `${q.question} ${q.explanation || ''}`.toLowerCase();
    const bannedPhrases = [
      'section 300 of ipc',
      'indian penal code',
      'article 21 of constitution',
      'case law decided by',
      'landmark judgment',
      'doctrine of basic structure',
    ];

    for (const phrase of bannedPhrases) {
      if (textToCheck.includes(phrase)) {
        issues.push({
          severity: 'warning',
          field: 'question',
          message: `Principle questions must test pure logical application strictly from the given principle. Avoid external legal statutes like "${phrase}".`,
        });
      }
    }
  }

  // 7. Source & date audit for current affairs
  if (q.sectionId === 'ca_gk') {
    if (!q.source || q.source.trim().length === 0) {
      issues.push({
        severity: 'warning',
        field: 'source',
        message: 'Current affairs questions should cite a real source or be explicitly marked as SAMPLE practice.',
      });
    }
  }

  const hasErrors = issues.some((i) => i.severity === 'error');
  const automatedChecksPassed = !hasErrors;
  const canBeValidatedStatus = automatedChecksPassed && Boolean(q.qualityCheck?.secondPassReviewDone);

  return {
    isValid: !hasErrors,
    canBeValidatedStatus,
    issues,
    automatedChecksPassed,
  };
}

// src/components/mock/ResultAnalysisModal.tsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { MockAttemptResult } from '../../types/mock';
import { TwelvePointRecordCard } from './TwelvePointRecordCard';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { MistakeBadge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { MistakeType } from '../../types/exam';
import { addDays } from '../../utils/date';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: MockAttemptResult | null;
}

export const ResultAnalysisModal: React.FC<Props> = ({ isOpen, onClose, result }) => {
  const { questions, addErrorEntry, currentDate } = useApp();
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct' | 'unattempted'>('all');
  const [addedErrorQIds, setAddedErrorQIds] = useState<Set<string>>(new Set());
  const [selectedMistakeType, setSelectedMistakeType] = useState<Record<string, MistakeType>>({});
  const [whyWrongText, setWhyWrongText] = useState<Record<string, string>>({});

  if (!result) return null;

  const responses = Object.values(result.questionResponses);

  const filteredResponses = responses.filter((r) => {
    if (filter === 'wrong') return !r.isCorrect && !r.isUnattempted;
    if (filter === 'correct') return r.isCorrect;
    if (filter === 'unattempted') return r.isUnattempted;
    return true;
  });

  const handleAddError = (resp: typeof responses[0]) => {
    const q = questions.find((item) => item.id === resp.questionId);
    if (!q) return;

    // Default mistake suggestion: if time > 90s, suggest time-pressure; otherwise Concept mistake
    const mType = selectedMistakeType[q.id] || (resp.timeSpentSeconds > 90 ? 'Time-pressure mistake' : 'Concept mistake');
    const reason = whyWrongText[q.id] || 'Fell for trap option / missed implicit premise';

    addErrorEntry({
      date: currentDate,
      questionId: q.id,
      questionText: q.question,
      options: q.options,
      studentAnswer: resp.userAnswer,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      subject:
        q.sectionId === 'english'
          ? 'English'
          : q.sectionId === 'ca_gk'
          ? 'Current Affairs & GK'
          : 'Logical Reasoning',
      sectionId: q.sectionId,
      topic: q.topicId,
      subtopic: q.subtopicId,
      mistakeType: mType,
      whyWrong: reason,
      correctConcept: `Rule / Concept from explanation: ${q.explanation.slice(0, 100)}...`,
      reattemptDate: addDays(currentDate, 3), // Scheduled on Day 3 practice cycle per PDF
      reattemptStatus: 'scheduled',
      reattemptCount: 0,
      mockAttemptId: result.id,
    });

    setAddedErrorQIds((prev) => new Set([...prev, q.id]));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Post-Test Result: ${result.testTitle}`}
      subtitle={`Completed on ${result.date} • Duration: ${Math.round(result.actualTimeSpentSeconds / 60)} min`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* 12-point mock record card */}
        <TwelvePointRecordCard record={result.twelvePointRecord} />

        {/* Section Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900">
              Sectional Performance Breakdown
            </h4>
            <OfficialRecommendedTag type="official" label="Official Sections" size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(result.scoreBreakdown.sectionScores).map((secKey) => {
              const sec = result.scoreBreakdown.sectionScores[secKey];
              return (
                <div key={secKey} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                  <span className="text-xs font-bold text-slate-900 block mb-1">
                    {sec.sectionName}
                  </span>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-lg font-bold font-mono text-slate-900">
                      {sec.score}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ {sec.maxScore} marks</span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>Acc: {sec.accuracyPercentage}%</span>
                    <span>
                      {sec.correct}C • {sec.wrong}W • {sec.unattempted}U
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question-by-Question Review with Error Notebook Action */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Question Review & Error Classification
              </h4>
              <p className="text-xs text-slate-500">
                Classify incorrect answers into the PDF's 4 mistake types to schedule spaced reattempts.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({responses.length})
              </button>
              <button
                onClick={() => setFilter('wrong')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  filter === 'wrong' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Wrong ({responses.filter((r) => !r.isCorrect && !r.isUnattempted).length})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  filter === 'correct' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Correct ({responses.filter((r) => r.isCorrect).length})
              </button>
              <button
                onClick={() => setFilter('unattempted')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  filter === 'unattempted' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unattempted ({responses.filter((r) => r.isUnattempted).length})
              </button>
            </div>
          </div>

          {/* List of questions */}
          <div className="space-y-4">
            {filteredResponses.map((resp, idx) => {
              const q = questions.find((item) => item.id === resp.questionId);
              if (!q) return null;

              const isAdded = addedErrorQIds.has(q.id);
              const isWrong = !resp.isCorrect && !resp.isUnattempted;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition ${
                    resp.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isWrong
                      ? 'border-rose-200 bg-rose-50/20'
                      : 'border-slate-200 bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-medium text-slate-600 capitalize">
                        {q.sectionId.replace('_', ' ')} • {q.questionType}
                      </span>
                      {resp.isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" /> +1.0
                        </span>
                      )}
                      {isWrong && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" /> -0.25 (Official Penalty)
                        </span>
                      )}
                      {resp.isUnattempted && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                          <HelpCircle className="w-3.5 h-3.5" /> 0.0 Unattempted
                        </span>
                      )}
                    </div>

                    <div className="text-right text-xs text-slate-500 font-mono">
                      {resp.timeSpentSeconds}s spent
                    </div>
                  </div>

                  {q.passage && (
                    <div className="mb-2 p-2.5 rounded bg-white text-xs text-slate-700 border border-slate-200 italic line-clamp-3">
                      {q.passage}
                    </div>
                  )}

                  <p className="text-xs font-semibold text-slate-900 mb-3 whitespace-pre-line">
                    {q.question}
                  </p>

                  {/* Options display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt) => {
                      const isUserChoice = resp.userAnswer === opt.id;
                      const isCorrectChoice = q.correctAnswer === opt.id;

                      let optClasses = 'border-slate-200 bg-white text-slate-700';
                      if (isCorrectChoice) {
                        optClasses = 'border-emerald-400 bg-emerald-50 text-emerald-900 font-semibold';
                      } else if (isUserChoice && !isCorrectChoice) {
                        optClasses = 'border-rose-400 bg-rose-50 text-rose-900 font-medium line-through';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${optClasses}`}
                        >
                          <span className="font-bold shrink-0">{opt.id}.</span>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 mb-3">
                    <span className="font-bold text-slate-900 block mb-0.5">Explanation:</span>
                    <p>{q.explanation}</p>
                  </div>

                  {/* If wrong or unattempted: Add to Error Notebook */}
                  {isWrong && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-amber-800" />
                          <span className="text-xs font-bold text-amber-950">
                            Classify for Error Notebook:
                          </span>
                        </div>

                        {/* 4 PDF mistake types selector */}
                        <div className="flex flex-wrap gap-1">
                          {(
                            [
                              'Concept mistake',
                              'Knowledge gap',
                              'Silly mistake',
                              'Time-pressure mistake',
                            ] as MistakeType[]
                          ).map((m) => {
                            const currentM =
                              selectedMistakeType[q.id] ||
                              (resp.timeSpentSeconds > 90
                                ? 'Time-pressure mistake'
                                : 'Concept mistake');
                            const isSelected = currentM === m;
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() =>
                                  setSelectedMistakeType({
                                    ...selectedMistakeType,
                                    [q.id]: m,
                                  })
                                }
                                className={`px-2 py-0.5 rounded text-[11px] font-medium border transition ${
                                  isSelected
                                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                {m}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Why did you get it wrong? (e.g. Rushed reading of statement 2)"
                          value={whyWrongText[q.id] || ''}
                          onChange={(e) =>
                            setWhyWrongText({
                              ...whyWrongText,
                              [q.id]: e.target.value,
                            })
                          }
                          className="flex-1 text-xs p-1.5 rounded border border-amber-300 bg-white"
                        />
                        <button
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddError(resp)}
                          className={`px-3 py-1.5 text-xs font-bold rounded transition shrink-0 flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-900 text-white hover:bg-amber-950'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Notebook</span>
                            </>
                          ) : (
                            <span>+ Save to Error Notebook</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Close footer */}
        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </Modal>
  );
};

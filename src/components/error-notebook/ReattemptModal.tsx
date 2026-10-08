// src/components/error-notebook/ReattemptModal.tsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ErrorNotebookEntry } from '../../types/error';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entry: ErrorNotebookEntry | null;
}

export const ReattemptModal: React.FC<Props> = ({ isOpen, onClose, entry }) => {
  const { updateErrorEntry } = useApp();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  if (!entry) return null;

  const handleEvaluate = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption.toUpperCase() === entry.correctAnswer.toUpperCase();
    setHasEvaluated(true);

    updateErrorEntry(entry.id, {
      reattemptCount: entry.reattemptCount + 1,
      lastReattemptResult: isCorrect ? 'correct' : 'incorrect',
      reattemptStatus: isCorrect ? 'resolved' : 'needs_reinforcement',
    });
  };

  const handleReset = () => {
    setSelectedOption(null);
    setHasEvaluated(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Spaced Reattempt Drill"
      subtitle={`Subject: ${entry.subject} • Logged on ${entry.date}`}
      maxWidth="lg"
    >
      <div className="space-y-5 text-xs">
        {/* Past mistake context banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-slate-700">
          <div>
            <span className="font-semibold block text-slate-900">
              Original Mistake: {entry.mistakeType}
            </span>
            <span className="text-[11px] text-slate-500">
              Why wrong then: {entry.whyWrong}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-200 text-slate-800">
            Reattempt #{entry.reattemptCount + 1}
          </span>
        </div>

        {/* Question text */}
        <div className="text-sm font-semibold text-slate-900 leading-relaxed">
          {entry.questionText}
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {entry.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = opt.id === entry.correctAnswer;

            let optClass = 'border-slate-200 bg-white hover:border-slate-400';
            if (hasEvaluated) {
              if (isCorrect) {
                optClass = 'border-emerald-500 bg-emerald-50 font-bold text-emerald-950';
              } else if (isSelected && !isCorrect) {
                optClass = 'border-rose-500 bg-rose-50 font-medium text-rose-950 line-through';
              }
            } else if (isSelected) {
              optClass = 'border-slate-900 bg-slate-900 text-white font-medium';
            }

            return (
              <button
                key={opt.id}
                disabled={hasEvaluated}
                onClick={() => setSelectedOption(opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition flex items-center gap-3 ${optClass}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected && !hasEvaluated
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Outcome analysis upon evaluation */}
        {hasEvaluated && (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-2">
              {selectedOption === entry.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-900">
                    Correct! Concept successfully reinforced.
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span className="text-sm font-bold text-rose-900">
                    Still incorrect. Needs further concept review.
                  </span>
                </>
              )}
            </div>

            <div className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <strong className="block text-slate-900">Explanation & Core Concept:</strong>
              <p>{entry.explanation || entry.correctConcept}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
          {hasEvaluated ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          ) : (
            <span className="text-slate-400 text-[11px]">Choose your answer with care</span>
          )}

          <div className="flex items-center gap-2">
            {!hasEvaluated ? (
              <button
                disabled={!selectedOption}
                onClick={handleEvaluate}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-40 hover:bg-slate-800 transition"
              >
                Submit Reattempt
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

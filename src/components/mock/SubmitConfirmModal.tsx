// src/components/mock/SubmitConfirmModal.tsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ScoreBreakdown } from '../../types/exam';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: (notes: {
    timeIssues: string;
    weakTopics: string[];
    correctiveAction: string;
  }) => void;
  stats: {
    totalQuestions: number;
    attempted: number;
    unattempted: number;
    markedForReview: number;
  };
}

export const SubmitConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  stats,
}) => {
  const [timeIssues, setTimeIssues] = useState('');
  const [weakTopicInput, setWeakTopicInput] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weakTopics = weakTopicInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onConfirmSubmit({
      timeIssues: timeIssues.trim() || 'Pacing steady across sections.',
      weakTopics: weakTopics.length > 0 ? weakTopics : ['General review'],
      correctiveAction:
        correctiveAction.trim() || 'Add wrong questions to Error Notebook and review on spaced cycle.',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Test & Record Attempt"
      subtitle="Verify your attempt counts and record initial mock reflections"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Attempt summary counts */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Attempted</span>
            <span className="text-xl font-bold font-mono text-emerald-700">
              {stats.attempted}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Unattempted</span>
            <span className="text-xl font-bold font-mono text-slate-600">
              {stats.unattempted}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Marked for Review</span>
            <span className="text-xl font-bold font-mono text-amber-700">
              {stats.markedForReview}
            </span>
          </div>
        </div>

        {stats.unattempted > 0 && (
          <div className="flex items-center gap-2 p-3 text-xs bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              You have {stats.unattempted} unattempted questions. They will receive 0 marks (no negative penalty).
            </span>
          </div>
        )}

        {/* 12-point initial reflection fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Time-Management Reflection (Point 10 of PDF Record)
            </label>
            <textarea
              rows={2}
              value={timeIssues}
              onChange={(e) => setTimeIssues(e.target.value)}
              placeholder="e.g. English RC took 48 min instead of 40; rushed through Analytical arrangements."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Suspected Weak Topics (Point 11, comma separated)
            </label>
            <input
              type="text"
              value={weakTopicInput}
              onChange={(e) => setWeakTopicInput(e.target.value)}
              placeholder="e.g. Syllogism either-or, Critical Assumptions, SVA Modifiers"
              className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Next 3 Days Corrective Action (Point 12 of PDF Record)
            </label>
            <textarea
              rows={2}
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              placeholder="e.g. Drill 30 Assumption questions; re-attempt all marked mistakes on Day 3 cycle."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            Return to Test
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
          >
            Submit & View Analysis
          </button>
        </div>
      </form>
    </Modal>
  );
};

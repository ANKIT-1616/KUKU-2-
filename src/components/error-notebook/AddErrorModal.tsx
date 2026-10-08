// src/components/error-notebook/AddErrorModal.tsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { MistakeType } from '../../types/exam';
import { addDays } from '../../utils/date';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddErrorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addErrorEntry, currentDate } = useApp();

  const [subject, setSubject] = useState<'English' | 'Current Affairs & GK' | 'Logical Reasoning'>('Logical Reasoning');
  const [topic, setTopic] = useState('Critical Reasoning - Assumptions');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [studentAnswer, setStudentAnswer] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [mistakeType, setMistakeType] = useState<MistakeType>('Concept mistake');
  const [whyWrong, setWhyWrong] = useState('');
  const [correctConcept, setCorrectConcept] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const sectionId =
      subject === 'English' ? 'english' : subject === 'Current Affairs & GK' ? 'ca_gk' : 'logical';

    addErrorEntry({
      date: currentDate,
      questionId: `manual_err_${Date.now()}`,
      questionText: questionText.trim(),
      options: [
        { id: 'A', text: optA.trim() || 'Option A' },
        { id: 'B', text: optB.trim() || 'Option B' },
        { id: 'C', text: optC.trim() || 'Option C' },
        { id: 'D', text: optD.trim() || 'Option D' },
      ],
      studentAnswer,
      correctAnswer,
      explanation: correctConcept.trim() || 'Review the correct concept and principles above.',
      subject,
      sectionId,
      topic: topic.trim(),
      mistakeType,
      whyWrong: whyWrong.trim() || 'Misinterpreted argument constraints.',
      correctConcept: correctConcept.trim() || 'Key rule to remember.',
      reattemptDate: addDays(currentDate, 3), // Spaced Day 3 practice per PDF
      reattemptStatus: 'scheduled',
      reattemptCount: 0,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manually Log Question in Error Notebook"
      subtitle="Permanent entry with scheduled spaced reattempt"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300"
            >
              <option value="English">English Language</option>
              <option value="Logical Reasoning">Logical Reasoning</option>
              <option value="Current Affairs & GK">Current Affairs & GK</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Topic / Area</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Syllogism either-or"
              className="w-full p-2 rounded-lg border border-slate-300"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Question Text</label>
          <textarea
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Paste or write the question statement..."
            className="w-full p-2 rounded-lg border border-slate-300"
            required
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Option A</label>
            <input
              type="text"
              value={optA}
              onChange={(e) => setOptA(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Option B</label>
            <input
              type="text"
              value={optB}
              onChange={(e) => setOptB(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Option C</label>
            <input
              type="text"
              value={optC}
              onChange={(e) => setOptC(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Option D</label>
            <input
              type="text"
              value={optD}
              onChange={(e) => setOptD(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Your (Wrong) Answer</label>
            <select
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Correct Answer</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">PDF Mistake Type</label>
            <select
              value={mistakeType}
              onChange={(e) => setMistakeType(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
            >
              <option value="Concept mistake">Concept mistake</option>
              <option value="Knowledge gap">Knowledge gap</option>
              <option value="Silly mistake">Silly mistake</option>
              <option value="Time-pressure mistake">Time-pressure mistake</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Why Wrong (Student Self-Reflection)
          </label>
          <input
            type="text"
            value={whyWrong}
            onChange={(e) => setWhyWrong(e.target.value)}
            placeholder="e.g. Assumed X without verifying explicit premise"
            className="w-full p-2 rounded-lg border border-slate-300"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Correct Concept & Key Takeaway
          </label>
          <textarea
            rows={2}
            value={correctConcept}
            onChange={(e) => setCorrectConcept(e.target.value)}
            placeholder="State the underlying conceptual rule or trap pattern to memorize..."
            className="w-full p-2 rounded-lg border border-slate-300"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
          >
            Save to Error Notebook
          </button>
        </div>
      </form>
    </Modal>
  );
};

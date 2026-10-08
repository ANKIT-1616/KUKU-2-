// src/components/ca/AddCAModal.tsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { CACategory, CurrentAffairItem } from '../../types/ca';
import { AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCAModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addCurrentAffair, currentDate } = useApp();

  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(currentDate);
  const [category, setCategory] = useState<CACategory>('National');
  const [summary, setSummary] = useState('');
  const [keyFactsInput, setKeyFactsInput] = useState('');
  const [source, setSource] = useState('');
  const [sourceDate, setSourceDate] = useState('');
  const [relatedExamTopic, setRelatedExamTopic] = useState('Indian Polity / Judiciary');
  const [isImportantEvent, setIsImportantEvent] = useState(false);

  // Status determined by whether real source & date are provided
  const hasRealSourceAndDate = source.trim().length > 0 && sourceDate.trim().length > 0;
  const isOlderThanWindow = sourceDate && sourceDate < '2025-12-13'; // Older than 12 months before exam

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !summary.trim()) return;

    const keyFacts = keyFactsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addCurrentAffair({
      date,
      topic: topic.trim(),
      category,
      summary: summary.trim(),
      keyFacts: keyFacts.length > 0 ? keyFacts : [summary.trim()],
      source: source.trim() || 'Author generated practice statement',
      sourceDate: sourceDate.trim() || date,
      relatedExamTopic: relatedExamTopic.trim(),
      status: hasRealSourceAndDate ? 'VERIFIED' : 'GENERATED_PRACTICE',
      isImportantEvent,
      tracker: {
        read: true,
        notesCreated: true,
        mcqsPracticed: false,
        rev1Done: false,
        rev2Done: false,
        finalPassDone: false,
      },
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Current Affairs / Static GK Entry"
      subtitle="Strict audit: requires real source & date for VERIFIED status"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Verification banner */}
        <div
          className={`p-3 rounded-lg border flex items-center justify-between ${
            hasRealSourceAndDate
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {hasRealSourceAndDate ? (
              <ShieldCheck className="w-4 h-4 text-blue-700" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            )}
            <span className="font-semibold">
              Status:{' '}
              {hasRealSourceAndDate
                ? 'VERIFIED (Has real source & date)'
                : 'GENERATED_PRACTICE (Practice only)'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            {hasRealSourceAndDate ? 'Official news standard' : 'Missing checkable source'}
          </span>
        </div>

        {isOlderThanWindow && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Warning: Source date is older than 12 months before exam (may be outdated for CA).</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Syllabus Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300"
            >
              <option value="National">National (Govt, Acts, Judiciary)</option>
              <option value="International">International (UN, G20, BRICS)</option>
              <option value="Economy">Economy (RBI, Monetary Policy)</option>
              <option value="Science & Technology">Science & Technology (ISRO, AI)</option>
              <option value="Environment">Environment (COP, Biodiversity)</option>
              <option value="Sports">Sports (Tournaments, Records)</option>
              <option value="Awards & Culture">Awards & Culture (Nobel, Booker)</option>
              <option value="Static GK">Static GK (Polity, History, Geo)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Topic Headline</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Supreme Court 7-Judge Bench ruling on SC/ST sub-classification"
            className="w-full p-2 rounded-lg border border-slate-300 font-medium"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Summary / Detailed Explanation</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Detailed factual explanation of the policy, legal development, or global event..."
            className="w-full p-2 rounded-lg border border-slate-300"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Key Facts / High-Yield Takeaways (one per line)
          </label>
          <textarea
            rows={2}
            value={keyFactsInput}
            onChange={(e) => setKeyFactsInput(e.target.value)}
            placeholder="Fact 1&#10;Fact 2&#10;Fact 3"
            className="w-full p-2 rounded-lg border border-slate-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Source (Required for VERIFIED)
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. The Hindu / PIB / SC Registry"
              className="w-full p-1.5 rounded border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Source Publication Date
            </label>
            <input
              type="date"
              value={sourceDate}
              onChange={(e) => setSourceDate(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Related Exam Topic</label>
            <input
              type="text"
              value={relatedExamTopic}
              onChange={(e) => setRelatedExamTopic(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isImportantEvent}
                onChange={(e) => setIsImportantEvent(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900"
              />
              <span className="font-semibold text-slate-800">Flag as High-Yield Event (Star)</span>
            </label>
          </div>
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
            Save Entry
          </button>
        </div>
      </form>
    </Modal>
  );
};

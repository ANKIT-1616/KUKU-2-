// src/components/revision/SpacedRevisionView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpacedRevisionItem, SpacedStage } from '../../types/revision';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { STAGES_ORDER } from '../../services/spacedRevisionEngine';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { formatFriendlyDate } from '../../utils/date';

export const SpacedRevisionView: React.FC = () => {
  const { spacedRevisionItems, completeRevisionStage, currentDate } = useApp();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const filteredItems = spacedRevisionItems.filter((item) => {
    if (selectedSubjectFilter !== 'all' && item.subjectType !== selectedSubjectFilter) {
      return false;
    }
    return true;
  });

  const dueItems = filteredItems.filter(
    (item) => item.nextDueDate <= currentDate && item.stage !== 'Mastered'
  );
  const upcomingItems = filteredItems.filter(
    (item) => item.nextDueDate > currentDate && item.stage !== 'Mastered'
  );
  const masteredItems = filteredItems.filter((item) => item.stage === 'Mastered');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Spaced Revision Engine
              </h2>
              <OfficialRecommendedTag type="recommended" label="PDF 6-Stage Roadmap" />
              <OfficialRecommendedTag type="addition" label="Adaptive Recovery on Failure" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Standard PDF cycle: <strong>Day 0 (Learn) → Day 1 (Quick revision) → Day 3 (Practice) → Day 7 (Revision) → Day 14 (Test) → Final-Week Rapid Revision</strong>. Each major Logical type, Static GK batch, and RC rule runs on its own cycle.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
              {dueItems.length} Revisions Due Today
            </span>
          </div>
        </div>

        {/* Visual Roadmap Stages Strip */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-3">
            PDF Spaced Revision Interval Progression
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {STAGES_ORDER.slice(0, 6).map((stage, idx) => (
              <div
                key={stage}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center relative"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 block mb-0.5">
                  Stage {idx}
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight block">
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Subjects' },
          { id: 'logical_major_type', label: 'Logical Reasoning Cycles' },
          { id: 'english_rc_grammar', label: 'English RC & Grammar' },
          { id: 'english_vocab_micro', label: 'Vocabulary Micro-Cycle' },
          { id: 'static_gk_batch', label: 'Static GK Batches' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedSubjectFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedSubjectFilter === tab.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Due Today Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Revision Due Today ({dueItems.length})
            </h3>
          </div>
          <span className="text-xs text-amber-800 font-medium">
            Active recall required before advancing
          </span>
        </div>

        {dueItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">You are completely up to date!</p>
            <p className="mt-0.5">No spaced revisions due on {formatFriendlyDate(currentDate)}.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dueItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      Current: {item.stage}
                    </span>
                    {item.nextDueDate < currentDate && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Overdue by {formatFriendlyDate(item.nextDueDate)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-1 leading-relaxed">
                    <strong>Recommended Action:</strong> {item.recommendedAction}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Cadence: {item.cadenceDescription}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => completeRevisionStage(item.id, false, 'Struggled with rules')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                    title="Product design addition: failed recall shortens next interval to reinforce"
                  >
                    Struggled (Step back)
                  </button>
                  <button
                    onClick={() => completeRevisionStage(item.id, true, 'Recalled successfully')}
                    className="px-4 py-1.5 text-xs font-bold rounded-md bg-slate-900 text-white hover:bg-slate-800 transition shadow-2xs"
                  >
                    Advance Stage →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Revisions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Scheduled Pipeline ({upcomingItems.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Future Spaced Dates</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {upcomingItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/40 transition"
            >
              <div className="min-w-0">
                <span className="font-semibold text-slate-900 block truncate">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500">{item.cadenceDescription}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700">
                  {item.stage}
                </span>
                <span className="font-mono text-slate-700 font-semibold text-right">
                  Due {formatFriendlyDate(item.nextDueDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

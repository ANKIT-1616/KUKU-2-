// src/components/home/RevisionDueWidget.tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';

export const RevisionDueWidget: React.FC = () => {
  const { spacedRevisionItems, currentDate, completeRevisionStage, setActiveTab } = useApp();

  // Filter items due today or overdue
  const dueItems = spacedRevisionItems.filter(
    (item) => item.nextDueDate <= currentDate && item.stage !== 'Mastered'
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-slate-900">Revision Due Today</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            {dueItems.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <OfficialRecommendedTag type="recommended" label="PDF Spaced Cycle" size="sm" />
          <button
            onClick={() => setActiveTab('revision')}
            className="text-xs text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-0.5"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {dueItems.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-medium text-slate-800">All spaced revisions up to date!</p>
            <p className="text-xs text-slate-500 mt-0.5">
              No topics due for Day 1/3/7/14 review today.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dueItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {item.stage}
                    </span>
                    {item.nextDueDate < currentDate && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{item.recommendedAction}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => completeRevisionStage(item.id, true)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}

            {dueItems.length > 4 && (
              <button
                onClick={() => setActiveTab('revision')}
                className="w-full text-center py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                + {dueItems.length - 4} more revisions due today
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/study-plan/RebalanceModal.tsx
import React from 'react';
import { Modal } from '../common/Modal';
import { RebalanceLog } from '../../types/plan';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { Sparkles, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  log: RebalanceLog | null;
}

export const RebalanceModal: React.FC<Props> = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adaptive Plan Rebalancer Report"
      subtitle="Balanced workload strictly capped at +20% daily load per PDF consistency rules"
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold">Rebalancing Strategy Applied</span>
              <OfficialRecommendedTag type="addition" label="Product design addition" size="sm" />
            </div>
            <p className="leading-relaxed text-purple-950">
              {log.summary}
            </p>
          </div>
        </div>

        {/* Tasks moved */}
        <div>
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Essential Tasks Rescheduled ({log.tasksMoved.length})</span>
          </h4>
          {log.tasksMoved.length === 0 ? (
            <p className="text-slate-500 italic p-3 bg-slate-50 rounded-lg">
              No pending essential tasks needed rescheduling.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {log.tasksMoved.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800 block truncate">
                      {m.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Priority: {m.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-slate-600">
                    <span>{m.fromDate}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="font-bold text-slate-900">{m.toDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks dropped */}
        {log.tasksDropped.length > 0 && (
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Low-ROI Items Dropped to Prevent Cognitive Overload ({log.tasksDropped.length})</span>
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {log.tasksDropped.map((d, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/40 text-rose-950"
                >
                  <span className="font-semibold block truncate">{d.title}</span>
                  <span className="text-[11px] text-rose-700 block mt-0.5">{d.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core PDF principle reminder */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 italic">
          "Consistency over intensity wins AILET. Never create an impossible catch-up debt."
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

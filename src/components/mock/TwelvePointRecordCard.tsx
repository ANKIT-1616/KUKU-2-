// src/components/mock/TwelvePointRecordCard.tsx
import React, { useState } from 'react';
import { TwelvePointMockRecord } from '../../types/mock';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { Award, Clock, Target, AlertTriangle, Check, Edit2 } from 'lucide-react';

interface Props {
  record: TwelvePointMockRecord;
  onSave?: (updated: TwelvePointMockRecord) => void;
  isEditable?: boolean;
}

export const TwelvePointRecordCard: React.FC<Props> = ({
  record: initialRecord,
  onSave,
  isEditable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState<TwelvePointMockRecord>(initialRecord);

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) onSave(record);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">
            PDF 12-Point Mock Record
          </h3>
          <OfficialRecommendedTag type="recommended" label="PDF Standard Record" size="sm" />
        </div>

        {isEditable && (
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Save Record</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Reflections</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Quantitative Grid (Points 1-9) */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-lg bg-slate-900 text-white col-span-3 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              1. Total Score
            </span>
            <span className="text-2xl font-black font-mono text-amber-400">
              {record.point1_score}
            </span>
            <span className="text-[10px] text-slate-400 block">/ 150 marks</span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-semibold text-slate-500 block">2. Attempted</span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {record.point2_attempted}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/60">
            <span className="text-[10px] font-semibold text-emerald-800 block">3. Correct</span>
            <span className="text-lg font-bold font-mono text-emerald-700">
              {record.point3_correct}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-rose-50/60">
            <span className="text-[10px] font-semibold text-rose-800 block">4. Wrong</span>
            <span className="text-lg font-bold font-mono text-rose-700">
              {record.point4_wrong}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-semibold text-slate-500 block">5. Unattempted</span>
            <span className="text-lg font-bold font-mono text-slate-700">
              {record.point5_unattempted}
            </span>
          </div>
        </div>

        {/* Section Scores + Accuracy (Points 6-9) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-amber-50/40">
            <span className="text-[10px] font-semibold text-amber-900 block">6. Accuracy</span>
            <span className="text-lg font-bold font-mono text-amber-800">
              {record.point6_accuracyPercentage}%
            </span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-blue-50/40">
            <span className="text-[10px] font-semibold text-blue-900 block">7. English (50)</span>
            <span className="text-lg font-bold font-mono text-blue-800">
              {record.point7_englishScore}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/40">
            <span className="text-[10px] font-semibold text-emerald-900 block">8. CA / GK (30)</span>
            <span className="text-lg font-bold font-mono text-emerald-800">
              {record.point8_caGkScore}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-indigo-50/40">
            <span className="text-[10px] font-semibold text-indigo-900 block">9. Logical (70)</span>
            <span className="text-lg font-bold font-mono text-indigo-800">
              {record.point9_logicalScore}
            </span>
          </div>
        </div>

        {/* Qualitative Reflections (Points 10, 11, 12) */}
        <div className="space-y-4 pt-3 border-t border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>10. Time-Management Issues</span>
            </div>
            {isEditing ? (
              <textarea
                rows={2}
                value={record.point10_timeManagementIssues}
                onChange={(e) =>
                  setRecord({ ...record, point10_timeManagementIssues: e.target.value })
                }
                className="w-full text-xs p-2 rounded-lg border border-slate-300"
              />
            ) : (
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {record.point10_timeManagementIssues || 'None recorded.'}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <Target className="w-3.5 h-3.5 text-rose-600" />
              <span>11. Weak Topic(s) Identified</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={record.point11_weakTopics.join(', ')}
                onChange={(e) =>
                  setRecord({
                    ...record,
                    point11_weakTopics: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full text-xs p-2 rounded-lg border border-slate-300"
              />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {record.point11_weakTopics.length > 0 ? (
                  record.point11_weakTopics.map((w, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None logged.</span>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>12. Corrective Action (Next 3 Days)</span>
            </div>
            {isEditing ? (
              <textarea
                rows={2}
                value={record.point12_correctiveActionNext3Days}
                onChange={(e) =>
                  setRecord({ ...record, point12_correctiveActionNext3Days: e.target.value })
                }
                className="w-full text-xs p-2 rounded-lg border border-slate-300"
              />
            ) : (
              <p className="text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                {record.point12_correctiveActionNext3Days || 'Review and log error items.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

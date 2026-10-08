// src/components/navigation/DateSimulatorBar.tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, RotateCcw, AlertTriangle } from 'lucide-react';
import { formatFriendlyDate } from '../../utils/date';

export const DateSimulatorBar: React.FC = () => {
  const { settings, updateSettings, currentDate } = useApp();

  const presets = [
    { label: 'Day 1 (2 Oct)', date: '2026-10-02' },
    { label: 'Week 1 End (8 Oct)', date: '2026-10-08' },
    { label: 'Phase 2 (25 Oct)', date: '2026-10-25' },
    { label: 'Phase 4 (18 Nov)', date: '2026-11-18' },
    { label: 'No New Topics (30 Nov)', date: '2026-11-30' },
    { label: 'Final Week (7 Dec)', date: '2026-12-07' },
    { label: 'Light Day (12 Dec)', date: '2026-12-12' },
    { label: 'EXAM DAY (13 Dec)', date: '2026-12-13' },
  ];

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Timeline Mode:</span>
        </span>
        <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-mono font-medium">
          {formatFriendlyDate(currentDate)}
        </span>
        {settings.isDateSimulationActive && (
          <span className="inline-flex items-center gap-1 text-amber-300 font-medium bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
            <AlertTriangle className="w-3 h-3" />
            <span>Simulated Date</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-slate-400 text-[11px] hidden sm:inline">Jump to Milestone:</span>
        {presets.map((p) => {
          const isSelected = currentDate === p.date;
          return (
            <button
              key={p.date}
              onClick={() => {
                updateSettings({
                  simulatedDate: p.date,
                  isDateSimulationActive: true,
                });
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          );
        })}

        {settings.isDateSimulationActive && (
          <button
            onClick={() => {
              updateSettings({
                isDateSimulationActive: false,
              });
            }}
            title="Reset to local real date"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800 transition ml-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Real Date</span>
          </button>
        )}
      </div>
    </div>
  );
};

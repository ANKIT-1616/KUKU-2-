// src/components/navigation/ExamCountdownBadge.tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateCountdown } from '../../utils/date';
import { Clock, Award } from 'lucide-react';

export const ExamCountdownBadge: React.FC = () => {
  const { currentDate, examConfig, setActiveTab } = useApp();
  const countdown = calculateCountdown(currentDate);

  if (countdown.isExamDay) {
    return (
      <button
        onClick={() => setActiveTab('final_week')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs tracking-wide uppercase animate-pulse shadow-md"
        title="Today is AILET 2027 UG Exam Day! (14:00 - 16:00 IST)"
      >
        <Award className="w-4 h-4" />
        <span>EXAM DAY: 14:00 - 16:00 IST</span>
      </button>
    );
  }

  if (countdown.isPostExam) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span>AILET 2027 UG Concluded</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => setActiveTab('study_plan')}
      className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs border border-slate-800 hover:bg-slate-800 transition shadow-xs"
      title={`AILET 2027 UG: ${examConfig.examDate} at 2:00 PM IST`}
    >
      <Clock className="w-3.5 h-3.5 text-amber-400" />
      <div className="flex items-baseline gap-1">
        <span className="font-extrabold text-amber-400 font-mono text-sm leading-none">
          {countdown.days}
        </span>
        <span className="text-slate-300 font-medium">days to AILET</span>
      </div>
      <span className="text-[10px] text-slate-400 hidden md:inline border-l border-slate-700 pl-2">
        13 Dec 2026 (IST)
      </span>
    </div>
  );
};

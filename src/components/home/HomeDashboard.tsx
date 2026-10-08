// src/components/home/HomeDashboard.tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { DailyTaskBoard } from './DailyTaskBoard';
import { RevisionDueWidget } from './RevisionDueWidget';
import { WeakAreaBanner } from './WeakAreaBanner';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { calculateCountdown } from '../../utils/date';
import {
  Flame,
  Award,
  CheckSquare,
  BookOpen,
  Calendar,
  AlertCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    currentDate,
    planDays,
    mockAttempts,
    errorEntries,
    examConfig,
    setActiveTab,
  } = useApp();

  const countdown = calculateCountdown(currentDate);

  // Compute overall statistics
  const trackedDays = planDays.filter((d) => d.isTracked && d.date <= currentDate);
  const totalCompletedTasks = trackedDays.reduce((acc, d) => acc + d.completedCount, 0);
  const totalTasksPossible = trackedDays.reduce((acc, d) => acc + d.totalTasks, 0);
  const overallPercent =
    totalTasksPossible > 0 ? Math.round((totalCompletedTasks / totalTasksPossible) * 100) : 0;

  // Streak: consecutive tracked days leading up to currentDate where at least 1 task was completed
  let streakCount = 0;
  const sortedPastDays = [...trackedDays].sort((a, b) => (a.date > b.date ? -1 : 1));
  for (const day of sortedPastDays) {
    if (day.completedCount > 0) {
      streakCount++;
    } else {
      break;
    }
  }

  const todayDayObj = planDays.find((d) => d.date === currentDate) || planDays[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-slate-800 rounded-full opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                Phase {todayDayObj.phaseId}: Week {todayDayObj.weekNumber}
              </span>
              <OfficialRecommendedTag type="official" label="13 Dec 2026 (2-4 PM IST)" size="sm" />
              <OfficialRecommendedTag type="recommended" label="72-Day PDF Syllabus" size="sm" />
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-serif text-white">
              AILET 2027 Command Center
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
              Target: National Law University Delhi B.A. LL.B. (Hons.). The daily loop: Plan → Learn → Practice → Mock → Analyze → Record Mistakes → Revise → Improve.
            </p>
          </div>

          {/* Quick Metrics (Calm, disciplined display per prompt) */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center min-w-[90px]">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Days to AILET</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                {countdown.isExamDay ? 'TODAY' : countdown.days}
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center min-w-[90px]">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Study Streak</span>
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {streakCount}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">days</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center min-w-[90px]">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Mocks Taken</span>
              <div className="flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-blue-400" />
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {mockAttempts.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Rule Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Core Principle:</span>
            <span>"Adjust only volume if needed, never the sequence of high-yield topics."</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>• No new topics after 30 Nov</span>
            <span>• -0.25 Negative Marking</span>
            <span>• Offline OMR Mode</span>
          </div>
        </div>
      </div>

      {/* Adaptive Weak Area Notice */}
      <WeakAreaBanner />

      {/* Main Grid: Today's Tasks + Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Task Board */}
        <div className="lg:col-span-2 space-y-6">
          <DailyTaskBoard />

          {/* Quick Mock Launchers */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Quick Testing & Practice Hub
                </h3>
                <p className="text-xs text-slate-500">
                  Simulate full length or practice sections under strict time constraints
                </p>
              </div>
              <button
                onClick={() => setActiveTab('mock')}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
              >
                View all tests →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab('mock')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 text-left transition group bg-slate-50/50 hover:bg-white"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Full AILET Mock
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">120m</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  150 Qs • 150 Marks • 2-4 PM slot recommended
                </p>
              </button>

              <button
                onClick={() => setActiveTab('mock')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 text-left transition group bg-slate-50/50 hover:bg-white"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Logical Sectional
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">56m</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  70 Qs • Critical, Syllogism, Principle-based
                </p>
              </button>

              <button
                onClick={() => setActiveTab('mock')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 text-left transition group bg-slate-50/50 hover:bg-white"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    English Sectional
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">40m</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  50 Qs • RC, Grammar, Vocabulary
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Revision Queue & Error Notebook Summary */}
        <div className="space-y-6">
          <RevisionDueWidget />

          {/* Error Notebook Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-semibold text-slate-900">Error Notebook</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                {errorEntries.length} logged
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Every mistake classified into 4 PDF types: Concept, Knowledge gap, Silly, or Time-pressure. Never delete entries.
            </p>

            <button
              onClick={() => setActiveTab('error_notebook')}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-slate-800 font-semibold text-xs hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              <span>Open Error Notebook</span>
              <span className="text-slate-400">({errorEntries.filter(e => e.reattemptStatus === 'reattempt_due').length} due)</span>
            </button>
          </div>

          {/* Syllabus Explorer Teaser */}
          <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold">AILET Syllabus Hierarchy</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Explore official section weightages (English 50, CA&GK 30, Logical 70) alongside recommended subtopics and priority matrices.
            </p>
            <button
              onClick={() => setActiveTab('syllabus')}
              className="px-3.5 py-1.5 rounded-md bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition"
            >
              Explore Syllabus Tree →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

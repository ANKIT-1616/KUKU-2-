// src/components/final-week/FinalWeekView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { formatFriendlyDate, calculateCountdown } from '../../utils/date';
import {
  Flag,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Heart,
  ChevronRight,
} from 'lucide-react';

export const FinalWeekView: React.FC = () => {
  const { currentDate, errorEntries, setActiveTab } = useApp();
  const countdown = calculateCountdown(currentDate);

  const isExamDay = currentDate === '2026-12-13';
  const isLightDay = currentDate === '2026-12-12';

  const final7Schedule = [
    {
      date: '2026-12-07',
      day: 'Mon 7 Dec',
      focus: 'High-Yield Logical & Top 20 Mistakes',
      tasks: [
        'High-yield Logical (Critical Reasoning + Arrangements)',
        '1 light 35-Q Logical sectional test',
        'CA rapid revision: last 3 months',
        'Error notebook drill: top 20 recorded mistakes',
      ],
    },
    {
      date: '2026-12-08',
      day: 'Tue 8 Dec',
      focus: 'English RC & Principle-Based Logic',
      tasks: [
        'English RC (2-3 high-quality passages) + Vocabulary rapid pass',
        'Principle-based reasoning drill (20 Qs pure logic)',
        'Light Current Affairs review',
      ],
    },
    {
      date: '2026-12-09',
      day: 'Wed 9 Dec',
      focus: 'Full Weak-Area Error Log Overhaul',
      tasks: [
        'Full weak-area drill from Error Notebook (English & Logical)',
        'Short CA one-pagers only (no heavy reading)',
      ],
    },
    {
      date: '2026-12-10',
      day: 'Thu 10 Dec',
      focus: 'One Light Mock Simulation & Pacing',
      tasks: [
        'One light full mock simulation in the 2:00-4:00 PM slot (or two sectionals)',
        'Deep analysis only; no new material; update trackers',
      ],
    },
    {
      date: '2026-12-11',
      day: 'Fri 11 Dec',
      focus: 'Formula Sheets & Confidence Build',
      tasks: [
        'Formula sheets + last 6 months CA rapid pass',
        'Very light practice (20-30 Qs max)',
        'Early restful sleep',
      ],
    },
    {
      date: '2026-12-12',
      day: 'Sat 12 Dec',
      focus: 'LIGHT ONLY: Mental Calm & Rest',
      isLightOnly: true,
      tasks: [
        'Error notebook highlights glance only',
        'CA one-pagers light reading (no memorization strain)',
        'Pack exam kit with Admit Card printout & photo ID',
        'Early sleep (8+ hours rest)',
      ],
    },
    {
      date: '2026-12-13',
      day: 'Sun 13 Dec',
      focus: 'EXAM DAY: AILET 2027 UG (14:00-16:00 IST)',
      isExamDay: true,
      tasks: [
        'Light morning warm-up only (1 short RC + 8-10 easy Logical)',
        'Reach centre 90-120 minutes early',
        'Official Exam: 150 Qs / 120 min / Offline OMR mode',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white uppercase tracking-wider">
                {isExamDay ? 'EXAM DAY MODE' : 'FINAL WEEK PROTOCOL (7-12 DEC)'}
              </span>
              <OfficialRecommendedTag type="official" label="Exam: 13 Dec 2026 (2-4 PM IST)" />
              <OfficialRecommendedTag type="recommended" label="Exact PDF Final 7 Days Schedule" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-serif">
              {isExamDay
                ? 'National Law University Delhi — AILET 2027 UG'
                : 'Final 7 Days: Focus, Consolidate & Rest'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              PDF Golden Rule: <em>"No new topics after 30 November. Consistency and calm over intensity wins AILET."</em>
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-center shrink-0 min-w-[130px]">
            <span className="text-[11px] text-slate-400 block mb-0.5">Countdown</span>
            <span className="text-2xl font-black font-mono text-amber-400">
              {isExamDay ? 'TODAY' : `${countdown.days} Days`}
            </span>
            <span className="text-[10px] text-slate-400 block">14:00 IST Start</span>
          </div>
        </div>
      </div>

      {/* If 12 Dec: Special Light Only Card */}
      {isLightDay && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-emerald-950">
              12 December: Pure Light Revision & Mental Calm
            </h3>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            Per the PDF planner: <strong>No exhausting study sessions. No new topics. No heavy mocks.</strong> Glance through your Error Notebook highlights, read CA one-pagers calmly, double-check your exam kit, take a peaceful walk, and sleep early tonight.
          </p>
        </div>
      )}

      {/* Official Exam-Day Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Official Exam-Day Checklist & Guidelines (per PDF)
            </h3>
          </div>
          <OfficialRecommendedTag type="official" label="NLU Delhi Checklist" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mandatory Documents & Items</span>
            </h4>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
              <li>Admit Card clear printout (verify centre address & reporting time)</li>
              <li>Valid original Government Photo ID (Aadhaar / Passport / Voter ID)</li>
              <li>Black / Blue ballpoint pens for OMR bubbling</li>
              <li>Recent passport photograph (if required on admit card)</li>
              <li>Simple analogue watch (if permitted per centre guidelines)</li>
              <li>Transparent water bottle</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Exam Timing & Strategy</span>
            </h4>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
              <li>Reach exam centre 90-120 minutes prior to 2:00 PM</li>
              <li>Morning light warm-up only: 1 short RC + 8-10 easy Logical Qs</li>
              <li>Attempt high-accuracy questions first; respect -0.25 negative marks</li>
              <li>Reserve the final 5-8 minutes strictly for OMR bubbling & check</li>
              <li>Mental calm: trust your preparation; no question debates afterward</li>
            </ul>
          </div>
        </div>
      </div>

      {/* PDF Final 7 Days Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              PDF Final 7 Days Schedule (7 Dec – 13 Dec)
            </h3>
          </div>
          <OfficialRecommendedTag type="recommended" label="PDF Source of Truth" size="sm" />
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {final7Schedule.map((item) => {
            const isToday = item.date === currentDate;
            return (
              <div
                key={item.date}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition ${
                  isToday ? 'bg-amber-50/60 ring-1 ring-amber-300' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="sm:w-44 shrink-0">
                  <span className="font-bold text-slate-900 block font-mono text-sm">
                    {item.day}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                    {item.focus}
                  </span>
                  {isToday && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                      Current Day
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <ul className="space-y-1">
                    {item.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <span className="text-slate-400 font-bold shrink-0">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

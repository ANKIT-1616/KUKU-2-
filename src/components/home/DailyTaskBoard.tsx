// src/components/home/DailyTaskBoard.tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlanTask } from '../../types/plan';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { PriorityBadge } from '../common/Badge';
import { CheckCircle2, Circle, Clock, Flame, Play, BookOpen } from 'lucide-react';
import { formatFriendlyDate } from '../../utils/date';

export const DailyTaskBoard: React.FC = () => {
  const { planDays, currentDate, toggleTaskComplete, setActiveTab } = useApp();

  const todayPlan = planDays.find((d) => d.date === currentDate) || planDays[0];

  const totalTasks = todayPlan?.tasks.length || 0;
  const completedTasks = todayPlan?.tasks.filter((t) => t.completed).length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Category visual icons/tags
  const getCategoryBadge = (cat: PlanTask['category']) => {
    switch (cat) {
      case 'english':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">English Language</span>;
      case 'logical':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Logical Reasoning</span>;
      case 'gk_ca':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Current Affairs & GK</span>;
      case 'test':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Mock / Sectional Test</span>;
      case 'practice':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Timed Practice</span>;
      case 'revision':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Spaced Revision</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Preparation</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Today's Plan: {formatFriendlyDate(currentDate)}
            </h2>
            {todayPlan.isExactPdfSeed ? (
              <OfficialRecommendedTag type="recommended" label="Exact PDF Seed" size="sm" />
            ) : (
              <OfficialRecommendedTag
                type="addition"
                label="Derived from PDF Pattern"
                size="sm"
              />
            )}
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-800">
              Phase {todayPlan.phaseId} • Week {todayPlan.weekNumber}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            {todayPlan.derivedRuleExplanation ||
              'Exact day plan specified in the AILET student planner PDF.'}
          </p>
        </div>

        {/* Progress & Target Hours */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end text-xs font-semibold text-slate-900">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Target: {todayPlan.targetHours}h</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {completedTasks}/{totalTasks} tasks done ({progressPercent}%)
            </p>
          </div>

          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-xs text-slate-900 relative">
            <svg className="w-12 h-12 absolute -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-amber-500 transition-all duration-300"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
              />
            </svg>
            <span className="relative z-10">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-100">
        {todayPlan.tasks.map((task) => {
          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 transition flex items-start gap-3.5 ${
                task.completed ? 'bg-slate-50/70 text-slate-500' : 'hover:bg-slate-50/40'
              }`}
            >
              <button
                onClick={() => toggleTaskComplete(currentDate, task.id)}
                className="mt-0.5 text-slate-400 hover:text-slate-600 transition shrink-0"
                aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {getCategoryBadge(task.category)}
                  <PriorityBadge priority={task.priority} />
                  {task.targetCount && (
                    <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {task.targetCount}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.estimatedMinutes} min
                  </span>
                </div>

                <h3
                  className={`text-sm font-semibold ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Action shortcut */}
              <div className="shrink-0 flex items-center gap-2">
                {task.category === 'test' && !task.completed && (
                  <button
                    onClick={() => setActiveTab('mock')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Start Test</span>
                  </button>
                )}
                {task.category === 'gk_ca' && (
                  <button
                    onClick={() => setActiveTab('current_affairs')}
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                    title="Open Current Affairs Tracker"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

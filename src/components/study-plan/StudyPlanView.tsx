// src/components/study-plan/StudyPlanView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanDay } from '../../types/plan';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { PriorityBadge } from '../common/Badge';
import { RebalanceModal } from './RebalanceModal';
import { PHASES_CONFIG } from '../../services/planRebalancer';
import { formatFriendlyDate, parseDateYMD } from '../../utils/date';
import {
  Calendar,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  List,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export const StudyPlanView: React.FC = () => {
  const { planDays, currentDate, toggleTaskComplete, rebalancePlan } = useApp();

  const [viewMode, setViewMode] = useState<'calendar' | 'phases' | 'list'>('calendar');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number>(0); // 0 = all
  const [rebalanceLog, setRebalanceLog] = useState<any>(null);
  const [isRebalanceModalOpen, setIsRebalanceModalOpen] = useState(false);
  const [expandedDate, setExpandedDate] = useState<string>(currentDate);

  const handleTriggerRebalance = () => {
    const log = rebalancePlan();
    setRebalanceLog(log);
    setIsRebalanceModalOpen(true);
  };

  const filteredDays = planDays.filter((d) => {
    if (selectedPhaseFilter !== 0 && d.phaseId !== selectedPhaseFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                AILET 2027 73-Day Master Study Plan
              </h2>
              <OfficialRecommendedTag type="official" label="2 Oct – 13 Dec 2026" />
              <OfficialRecommendedTag type="recommended" label="PDF Timetables & Phases" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Days 2-8 Oct seed directly from the PDF calendar; Days 9 Oct – 12 Dec are derived from the weekly timetable, phase rules, and priority matrix. Strictly enforces: <em>"No new topics after 30 Nov"</em> and <em>"Consistency over intensity"</em>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerRebalance}
              className="px-4 py-2 rounded-lg bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Rebalancer</span>
            </button>
          </div>
        </div>

        {/* Phase summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-5 pt-4 border-t border-slate-100">
          {PHASES_CONFIG.map((p) => {
            const isCur = currentDate >= p.startDate && currentDate <= p.endDate;
            return (
              <button
                key={p.id}
                onClick={() =>
                  setSelectedPhaseFilter(selectedPhaseFilter === p.id ? 0 : p.id)
                }
                className={`p-2.5 rounded-lg border text-left transition ${
                  isCur
                    ? 'border-amber-400 bg-amber-50/70 shadow-2xs'
                    : selectedPhaseFilter === p.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`text-[10px] font-bold font-mono ${
                      selectedPhaseFilter === p.id ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  >
                    Phase {p.id}
                  </span>
                  {isCur && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                </div>
                <span
                  className={`text-xs font-bold block truncate ${
                    selectedPhaseFilter === p.id ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {p.name}
                </span>
                <span
                  className={`text-[10px] block ${
                    selectedPhaseFilter === p.id ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {p.dateRange}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
              viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Day-by-Day Agenda</span>
          </button>
          <button
            onClick={() => setViewMode('phases')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
              viewMode === 'phases' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phase Targets</span>
          </button>
        </div>

        <button
          onClick={() => setExpandedDate(currentDate)}
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white font-medium hover:bg-slate-50"
        >
          Jump to Current Date ({formatFriendlyDate(currentDate)})
        </button>
      </div>

      {/* Calendar Grid View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {filteredDays.map((day) => {
              const isToday = day.date === currentDate;
              const isSelected = expandedDate === day.date;
              const completedTasks = day.tasks.filter((t) => t.completed).length;

              return (
                <button
                  key={day.date}
                  onClick={() => setExpandedDate(day.date)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between min-h-[92px] ${
                    isSelected
                      ? 'border-slate-900 ring-2 ring-slate-900 bg-slate-50'
                      : isToday
                      ? 'border-amber-400 bg-amber-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                      <span className="font-bold text-slate-900">
                        {day.dayOfWeek} {parseDateYMD(day.date).getDate()}
                      </span>
                      {isToday && (
                        <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950 uppercase">
                          Today
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-500 block truncate font-sans">
                      {day.dayType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">P{day.phaseId}</span>
                    <span
                      className={`font-semibold ${
                        completedTasks === day.totalTasks && day.totalTasks > 0
                          ? 'text-emerald-700 font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      {completedTasks}/{day.totalTasks}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Detail Box */}
          {expandedDate && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              {(() => {
                const dayObj = planDays.find((d) => d.date === expandedDate);
                if (!dayObj) return null;

                return (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-bold text-slate-900">
                            {formatFriendlyDate(dayObj.date)} ({dayObj.dayOfWeek})
                          </h3>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-800">
                            Phase {dayObj.phaseId} • Week {dayObj.weekNumber}
                          </span>
                          {dayObj.isExactPdfSeed ? (
                            <OfficialRecommendedTag type="recommended" label="Exact PDF Seed" />
                          ) : (
                            <OfficialRecommendedTag
                              type="addition"
                              label="Derived from PDF Pattern"
                            />
                          )}
                        </div>
                        <p className="text-xs text-slate-600">
                          {dayObj.derivedRuleExplanation || 'Exact day plan specified in the PDF planner.'}
                        </p>
                      </div>

                      <div className="text-xs font-semibold text-slate-700 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        Target: {dayObj.targetHours} hours
                      </div>
                    </div>

                    {/* Schedule blocks if any */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {dayObj.scheduleBlocks.map((b, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-white border border-slate-200 text-[11px]"
                        >
                          <span className="font-mono text-slate-500 font-semibold block mb-0.5">
                            {b.timeSlot}
                          </span>
                          <span className="font-bold text-slate-900 block">{b.activity}</span>
                          <span className="text-slate-600 truncate block">{b.focus}</span>
                        </div>
                      ))}
                    </div>

                    {/* Task checklist */}
                    <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                      {dayObj.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 flex items-start gap-3 hover:bg-slate-50/50 transition"
                        >
                          <button
                            onClick={() => toggleTaskComplete(dayObj.date, task.id)}
                            className="mt-0.5 text-slate-400 hover:text-slate-600 shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span
                                className={`text-xs font-semibold ${
                                  task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                                }`}
                              >
                                {task.title}
                              </span>
                              <PriorityBadge priority={task.priority} />
                              {task.targetCount && (
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                  {task.targetCount}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">{task.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredDays.map((day) => (
            <div
              key={day.date}
              className={`bg-white rounded-xl border p-4 sm:p-5 shadow-2xs transition ${
                day.date === currentDate ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900">
                    {formatFriendlyDate(day.date)} ({day.dayOfWeek})
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    Phase {day.phaseId} • Week {day.weekNumber}
                  </span>
                  {day.isExactPdfSeed ? (
                    <OfficialRecommendedTag type="recommended" label="Exact PDF Seed" size="sm" />
                  ) : (
                    <OfficialRecommendedTag type="addition" label="Derived Pattern" size="sm" />
                  )}
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  {day.completedCount}/{day.totalTasks} completed • {day.targetHours}h
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {day.tasks.map((task) => (
                  <div key={task.id} className="py-2.5 flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskComplete(day.date, task.id)}
                      className="mt-0.5 text-slate-400 hover:text-slate-600 shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span
                          className={`font-semibold ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      <p className="text-[11px] text-slate-500">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phase Targets View */}
      {viewMode === 'phases' && (
        <div className="space-y-4">
          {PHASES_CONFIG.map((phase) => (
            <div
              key={phase.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black font-mono px-2.5 py-0.5 rounded bg-slate-900 text-white">
                    Phase {phase.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{phase.name}</h3>
                  <span className="text-xs font-mono text-slate-500">({phase.dateRange})</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {phase.primaryFocus}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-500 block mb-0.5">Mock Target</span>
                  <span className="font-bold text-slate-900">{phase.mockTarget}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-500 block mb-0.5">Question Volume</span>
                  <span className="font-bold text-slate-900">{phase.questionTarget}</span>
                </div>
                <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200 text-rose-900">
                  <span className="font-semibold text-rose-600 block mb-0.5">What to Avoid</span>
                  <span className="font-bold">{phase.whatToAvoid}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rebalance Modal */}
      <RebalanceModal
        isOpen={isRebalanceModalOpen}
        onClose={() => setIsRebalanceModalOpen(false)}
        log={rebalanceLog}
      />
    </div>
  );
};

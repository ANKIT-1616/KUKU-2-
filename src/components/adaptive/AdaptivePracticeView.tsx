// src/components/adaptive/AdaptivePracticeView.tsx
import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { detectWeakAreas } from '../../services/adaptiveEngine';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import {
  Target,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Layers,
  BookOpen,
} from 'lucide-react';

export const AdaptivePracticeView: React.FC = () => {
  const { mockAttempts, errorEntries, settings, updateSettings, setActiveTab, startTest, questions } = useApp();

  const weakAreas = useMemo(() => {
    return detectWeakAreas(
      mockAttempts,
      errorEntries,
      settings.accuracyThreshold,
      settings.minAttemptsForWeakDetection,
      2
    );
  }, [mockAttempts, errorEntries, settings.accuracyThreshold, settings.minAttemptsForWeakDetection]);

  const handleLaunchTargetedTest = (topicId: string, topicName: string) => {
    const matched = questions.filter((q) => q.topicId === topicId);
    const testQs = matched.length > 0 ? matched : questions.slice(0, 10);

    startTest(
      {
        id: `adaptive_${topicId}_${Date.now()}`,
        title: `Adaptive Recovery Sprint: ${topicName}`,
        type: 'weak_topic',
        durationMinutes: 12,
        totalQuestions: Math.min(10, testQs.length),
        questionIds: testQs.map((q) => q.id),
      },
      testQs
    );
    setActiveTab('mock');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Adaptive Weak Area Intervention
              </h2>
              <OfficialRecommendedTag type="addition" label="Product design addition" />
              <OfficialRecommendedTag type="recommended" label="Based on Real Attempts" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              <strong>Data-Driven Only:</strong> Detects genuine subtopic deficiencies based strictly on actual practice data (accuracy &lt; {settings.accuracyThreshold}% across &ge; {settings.minAttemptsForWeakDetection} attempts in multiple sessions). Strictly zero fake percentile or rank predictions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
              {weakAreas.length} Weak Area(s) Detected
            </span>
          </div>
        </div>

        {/* Rule parameter info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Current Detection Rule: Accuracy &lt; {settings.accuracyThreshold}% with &ge; {settings.minAttemptsForWeakDetection} attempts across &ge; 2 distinct test sessions.
          </span>
        </div>
      </div>

      {/* Weak Areas List or Honest Empty State */}
      {weakAreas.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto shadow-2xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No Weak Areas Detected
          </h3>
          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            {mockAttempts.length === 0
              ? 'Complete at least 1 mock or sectional test and log error entries to generate objective performance diagnostics.'
              : `All tested subtopics currently meet or exceed the ${settings.accuracyThreshold}% accuracy threshold with healthy consistency!`}
          </p>

          {mockAttempts.length === 0 && (
            <button
              onClick={() => setActiveTab('mock')}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Start Diagnostic Test →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {weakAreas.map((area) => (
            <div
              key={area.topicId}
              className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      WEAK AREA DETECTED
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {area.topicName}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      ({area.sectionId.replace('_', ' ').toUpperCase()})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Accuracy: <strong>{area.accuracyPercentage}%</strong> across {area.attemptsCount} questions in {area.distinctSessionsCount} test sessions.
                  </p>
                </div>

                <button
                  onClick={() => handleLaunchTargetedTest(area.topicId, area.topicName)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Targeted Sprint (12 min)</span>
                </button>
              </div>

              {/* 6-step recovery protocol */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Recommended 6-Step Recovery Protocol (Product Design Addition):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {area.recommendedInterventionSequence.map((step) => (
                    <div
                      key={step.step}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {step.step}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {step.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Action</span>
                        <span className="text-slate-700 capitalize font-mono">
                          {step.actionType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

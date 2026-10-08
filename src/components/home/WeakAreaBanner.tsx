// src/components/home/WeakAreaBanner.tsx
import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { detectWeakAreas } from '../../services/adaptiveEngine';
import { Target, ArrowRight } from 'lucide-react';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';

export const WeakAreaBanner: React.FC = () => {
  const { mockAttempts, errorEntries, settings, setActiveTab } = useApp();

  const weakAreas = useMemo(() => {
    return detectWeakAreas(
      mockAttempts,
      errorEntries,
      settings.accuracyThreshold,
      settings.minAttemptsForWeakDetection,
      2
    );
  }, [mockAttempts, errorEntries, settings.accuracyThreshold, settings.minAttemptsForWeakDetection]);

  if (weakAreas.length === 0) return null;

  const topWeak = weakAreas[0];

  return (
    <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-amber-100 text-amber-900 shrink-0">
          <Target className="w-5 h-5 text-amber-800" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-sm font-bold text-slate-900">
              Weak Area Detected: {topWeak.topicName}
            </h4>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-200 text-amber-900">
              {topWeak.accuracyPercentage}% Accuracy ({topWeak.attemptsCount} Qs)
            </span>
            <OfficialRecommendedTag type="addition" label="Adaptive Rule" size="sm" />
          </div>
          <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
            {topWeak.recommendedInterventionSequence[0]?.title}:{' '}
            {topWeak.recommendedInterventionSequence[0]?.description}
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('adaptive')}
        className="shrink-0 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-900 text-white hover:bg-amber-950 transition flex items-center gap-1.5 shadow-2xs"
      >
        <span>Launch 6-Step Protocol</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

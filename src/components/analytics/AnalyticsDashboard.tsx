// src/components/analytics/AnalyticsDashboard.tsx
import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import {
  BarChart2,
  TrendingUp,
  Award,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { mockAttempts, errorEntries, planDays, currentDate, setActiveTab } = useApp();

  const metrics = useMemo(() => {
    if (mockAttempts.length === 0) return null;

    const scores = mockAttempts.map((a) => a.scoreBreakdown.score);
    const accuracies = mockAttempts.map((a) => a.scoreBreakdown.accuracyPercentage);

    const latest = mockAttempts[0];
    const bestScore = Math.max(...scores);
    const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;
    const bestAccuracy = Math.max(...accuracies);

    // Section totals
    const sectionTotals: Record<string, { correct: number; attempted: number; score: number }> = {
      english: { correct: 0, attempted: 0, score: 0 },
      ca_gk: { correct: 0, attempted: 0, score: 0 },
      logical: { correct: 0, attempted: 0, score: 0 },
    };

    for (const a of mockAttempts) {
      for (const secKey of Object.keys(a.scoreBreakdown.sectionScores)) {
        const sec = a.scoreBreakdown.sectionScores[secKey];
        if (sectionTotals[secKey]) {
          sectionTotals[secKey].correct += sec.correct;
          sectionTotals[secKey].attempted += sec.attempted;
          sectionTotals[secKey].score += sec.score;
        }
      }
    }

    // Determine strongest and weakest section by accuracy
    let strongestSection = 'logical';
    let weakestSection = 'english';
    let maxAcc = -1;
    let minAcc = 999;

    for (const k of Object.keys(sectionTotals)) {
      const s = sectionTotals[k];
      const acc = s.attempted > 0 ? (s.correct / s.attempted) * 100 : 0;
      if (acc > maxAcc) {
        maxAcc = acc;
        strongestSection = k;
      }
      if (acc < minAcc && s.attempted > 0) {
        minAcc = acc;
        weakestSection = k;
      }
    }

    return {
      latestScore: latest.scoreBreakdown.score,
      bestScore,
      avgScore,
      bestAccuracy,
      strongestSection,
      weakestSection,
      sectionTotals,
      totalAttemptsCount: mockAttempts.length,
    };
  }, [mockAttempts]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Performance Analytics & Trend Analysis
              </h2>
              <OfficialRecommendedTag type="recommended" label="Objective Metrics" />
              <OfficialRecommendedTag type="official" label="Zero Fake Percentiles / Ranks" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              <strong>Honest EdTech Architecture:</strong> Analytics are computed exclusively from real tests and error logs. Strictly no fabricated percentiles, speculative national ranks, or fake performance projections.
            </p>
          </div>
        </div>
      </div>

      {!metrics ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto shadow-2xs">
          <BarChart2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Insufficient Performance Data
          </h3>
          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            Take at least one mock test or sectional simulation to unlock score distributions, accuracy trends, and section-level strengths.
          </p>
          <button
            onClick={() => setActiveTab('mock')}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Start First Test →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Latest Score</span>
              <span className="text-2xl font-black font-mono text-slate-900">
                {metrics.latestScore}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">/ 150 marks</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Best Score</span>
              <span className="text-2xl font-black font-mono text-amber-700">
                {metrics.bestScore}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">/ 150 marks</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Average Score</span>
              <span className="text-2xl font-black font-mono text-slate-800">
                {metrics.avgScore}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">across {metrics.totalAttemptsCount} mocks</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Peak Accuracy</span>
              <span className="text-2xl font-black font-mono text-emerald-700">
                {metrics.bestAccuracy}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">highest single test</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Strongest Section</span>
              <span className="text-sm font-bold text-emerald-800 block truncate mt-1 capitalize">
                {metrics.strongestSection.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Highest accuracy</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Weakest Section</span>
              <span className="text-sm font-bold text-rose-800 block truncate mt-1 capitalize">
                {metrics.weakestSection.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-rose-600 font-semibold block mt-1">Target for drill</span>
            </div>
          </div>

          {/* Score Trend History */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              <span>Score & Attempt Progression</span>
            </h3>

            <div className="space-y-3">
              {mockAttempts.map((att, idx) => {
                const score = att.scoreBreakdown.score;
                const percent = Math.min(100, Math.max(0, (score / 150) * 100));
                return (
                  <div key={att.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{att.testTitle}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({att.date})</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono font-bold">
                        <span className="text-amber-900">{score} / 150</span>
                        <span className="text-slate-600">({att.scoreBreakdown.accuracyPercentage}% Acc)</span>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-slate-900 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Breakdown Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Cumulative Section Performance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.keys(metrics.sectionTotals).map((secKey) => {
                const sec = metrics.sectionTotals[secKey];
                const acc = sec.attempted > 0 ? Math.round((sec.correct / sec.attempted) * 100) : 0;
                return (
                  <div key={secKey} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                    <span className="text-xs font-bold text-slate-900 block mb-1 capitalize">
                      {secKey.replace('_', ' ')}
                    </span>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-black font-mono text-slate-900">
                        {acc}%
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {sec.correct} correct / {sec.attempted} att
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${acc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

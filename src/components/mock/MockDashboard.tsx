// src/components/mock/MockDashboard.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MockTestConfig, MockType } from '../../types/mock';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { ResultAnalysisModal } from './ResultAnalysisModal';
import {
  CheckSquare,
  Play,
  Clock,
  History,
  Award,
  FileText,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { formatFriendlyDate } from '../../utils/date';

export const MockDashboard: React.FC = () => {
  const {
    startTest,
    questions,
    mockAttempts,
    examConfig,
    activeAttemptResultForModal,
    setActiveAttemptResultForModal,
  } = useApp();

  const [selectedMockHistory, setSelectedMockHistory] = useState<any>(null);

  // Available test configs
  const mockOptions: {
    config: MockTestConfig;
    description: string;
    targetSlot?: string;
    isProportional?: boolean;
  }[] = [
    {
      config: {
        id: 'mock_full_standard',
        title: 'AILET 2027 UG Full-Length Mock #1',
        type: 'full',
        durationMinutes: 120,
        totalQuestions: 150,
        questionIds: [],
        isRecommendedSlot: true,
        omrPracticePromptEnabled: true,
      },
      description:
        'Complete 150-question paper: 50 English, 30 Current Affairs & GK, 70 Logical Reasoning. Offline OMR simulation.',
      targetSlot: '2:00 PM - 4:00 PM IST (Official Slot)',
    },
    {
      config: {
        id: 'mock_sec_logical',
        title: 'Logical Reasoning Sectional Test',
        type: 'sectional',
        sectionId: 'logical',
        durationMinutes: 56, // 120 * 70/150 = 56 min
        totalQuestions: 70,
        questionIds: [],
        omrPracticePromptEnabled: true,
      },
      description:
        'Official 70-question Logical Reasoning section: Critical Reasoning, Syllogisms, Arrangements, and Principle-based logic.',
      targetSlot: 'Proportional Time: 56 min (Product recommendation)',
      isProportional: true,
    },
    {
      config: {
        id: 'mock_sec_english',
        title: 'English Language Sectional Test',
        type: 'sectional',
        sectionId: 'english',
        durationMinutes: 40, // 120 * 50/150 = 40 min
        totalQuestions: 50,
        questionIds: [],
        omrPracticePromptEnabled: true,
      },
      description:
        'Official 50-question English section: Reading Comprehension passages, Vocabulary, Grammar, and Verbal Ability.',
      targetSlot: 'Proportional Time: 40 min (Product recommendation)',
      isProportional: true,
    },
    {
      config: {
        id: 'mock_sec_cagk',
        title: 'Current Affairs & GK Sectional Test',
        type: 'sectional',
        sectionId: 'ca_gk',
        durationMinutes: 24, // 120 * 30/150 = 24 min
        totalQuestions: 30,
        questionIds: [],
      },
      description:
        'Official 30-question GK section: National policies, International events, Economy, Science/Tech, and Static Polity.',
      targetSlot: 'Proportional Time: 24 min (Product recommendation)',
      isProportional: true,
    },
    {
      config: {
        id: 'mock_mini_cr',
        title: 'Critical Reasoning Speed Sprint',
        type: 'mini',
        sectionId: 'logical',
        durationMinutes: 15,
        totalQuestions: 15,
        questionIds: [],
      },
      description:
        'Fast 15-question sprint focusing on assumptions, strengthen/weaken, and inference trap detection.',
    },
  ];

  const handleLaunchTest = (testConfig: MockTestConfig) => {
    // Select questions matching section if specified
    let pool = questions;
    if (testConfig.sectionId) {
      pool = questions.filter((q) => q.sectionId === testConfig.sectionId);
    }

    if (pool.length === 0) {
      alert('No questions available in the question bank for this section yet. Please import or add questions.');
      return;
    }

    // Duplicate or slice pool to create mock test instance
    let testQuestions = [...pool];
    if (testQuestions.length < testConfig.totalQuestions) {
      // For demonstration of UI when small sample bank is seeded: repeat items with unique IDs
      const expanded: typeof questions = [];
      let counter = 0;
      while (expanded.length < testConfig.totalQuestions && expanded.length < 150) {
        const item = pool[counter % pool.length];
        expanded.push({
          ...item,
          id: `${item.id}_rep_${expanded.length}`,
        });
        counter++;
      }
      testQuestions = expanded;
    } else {
      testQuestions = testQuestions.slice(0, testConfig.totalQuestions);
    }

    startTest(testConfig, testQuestions);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Mock Testing Engine
              </h2>
              <OfficialRecommendedTag type="official" label="120 Min • 150 Marks • -0.25 Penalty" />
              <OfficialRecommendedTag type="recommended" label="Simulate 2:00-4:00 PM Slot" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Real AILET exam conditions: full-length timed tests, sectional benchmarks, immediate 12-point reflection logging, and permanent mistake classification into the Error Notebook.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {mockAttempts.length} Total Attempts Recorded
            </span>
          </div>
        </div>
      </div>

      {/* Available Tests Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-slate-700" />
            <span>Available Test Simulations</span>
          </h3>
          <span className="text-xs text-slate-500">
            Autosaves every second • Resilient to tab refresh
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockOptions.map((item) => (
            <div
              key={item.config.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {item.config.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {item.config.durationMinutes} min
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {item.config.title}
                </h4>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {item.description}
                </p>

                {item.targetSlot && (
                  <div className="mb-4">
                    <span className="text-[11px] font-medium text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200 inline-block">
                      {item.targetSlot}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  {item.config.totalQuestions} Questions
                </span>
                <button
                  onClick={() => handleLaunchTest(item.config)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Tracker Table (Points from PDF: Date, #, Score, Att, Corr, Wrong, Unatt, Acc%, Eng, GK, LR, Weak Topic/Action) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Official Mock Tracker Log
              </h3>
              <OfficialRecommendedTag type="recommended" label="PDF Mock Tracker Columns" size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks performance progression, negative marks, and 3-day corrective actions.
            </p>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            {mockAttempts.length} Records
          </span>
        </div>

        {mockAttempts.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs">
            <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No mock attempts logged yet.</p>
            <p className="mt-1">
              Start your Diagnostic Full Mock (Phase 1, 2-18 Oct) or a sectional practice test above!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-2">Test Name</th>
                  <th className="py-3 px-2 text-center">Score / 150</th>
                  <th className="py-3 px-2 text-center">Att</th>
                  <th className="py-3 px-2 text-center text-emerald-700">Corr</th>
                  <th className="py-3 px-2 text-center text-rose-700">Wrong</th>
                  <th className="py-3 px-2 text-center">Unatt</th>
                  <th className="py-3 px-2 text-center font-bold">Acc %</th>
                  <th className="py-3 px-2 text-center">Eng</th>
                  <th className="py-3 px-2 text-center">GK</th>
                  <th className="py-3 px-2 text-center">LR</th>
                  <th className="py-3 px-3">Weak Topic / Action</th>
                  <th className="py-3 px-3 text-right">Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {mockAttempts.map((att, idx) => {
                  const rec = att.twelvePointRecord;
                  return (
                    <tr key={att.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-sans">
                        {att.date}
                      </td>
                      <td className="py-3 px-2 font-sans font-semibold text-slate-900 max-w-[140px] truncate">
                        {att.testTitle}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-amber-900">
                        {rec.point1_score}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-700">{rec.point2_attempted}</td>
                      <td className="py-3 px-2 text-center text-emerald-700 font-bold">{rec.point3_correct}</td>
                      <td className="py-3 px-2 text-center text-rose-700 font-bold">{rec.point4_wrong}</td>
                      <td className="py-3 px-2 text-center text-slate-500">{rec.point5_unattempted}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-900">
                        {rec.point6_accuracyPercentage}%
                      </td>
                      <td className="py-3 px-2 text-center text-blue-800">{rec.point7_englishScore}</td>
                      <td className="py-3 px-2 text-center text-emerald-800">{rec.point8_caGkScore}</td>
                      <td className="py-3 px-2 text-center text-indigo-800">{rec.point9_logicalScore}</td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-600 font-sans">
                        {rec.point12_correctiveActionNext3Days}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedMockHistory(att)}
                          className="px-2.5 py-1 text-xs font-sans font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Re-open Review Modal */}
      <ResultAnalysisModal
        isOpen={Boolean(selectedMockHistory || activeAttemptResultForModal)}
        onClose={() => {
          setSelectedMockHistory(null);
          setActiveAttemptResultForModal(null);
        }}
        result={selectedMockHistory || activeAttemptResultForModal}
      />
    </div>
  );
};

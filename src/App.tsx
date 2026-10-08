// src/App.tsx
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/navigation/Header';
import { HomeDashboard } from './components/home/HomeDashboard';
import { MockDashboard } from './components/mock/MockDashboard';
import { TestInterface } from './components/mock/TestInterface';
import { StudyPlanView } from './components/study-plan/StudyPlanView';
import { ErrorNotebookView } from './components/error-notebook/ErrorNotebookView';
import { SpacedRevisionView } from './components/revision/SpacedRevisionView';
import { CurrentAffairsView } from './components/ca/CurrentAffairsView';
import { SyllabusTreeView } from './components/syllabus/SyllabusTreeView';
import { AdaptivePracticeView } from './components/adaptive/AdaptivePracticeView';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { FinalWeekView } from './components/final-week/FinalWeekView';
import { QuestionBankView } from './components/questions/QuestionBankView';
import { SettingsView } from './components/settings/SettingsView';

const AppContent: React.FC = () => {
  const { activeTab, activeTest } = useApp();

  // If a mock test or sectional drill is currently running, render full-screen focus interface
  if (activeTest) {
    return <TestInterface />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900 antialiased selection:bg-amber-200 selection:text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'mock' && <MockDashboard />}
        {activeTab === 'study_plan' && <StudyPlanView />}
        {activeTab === 'error_notebook' && <ErrorNotebookView />}
        {activeTab === 'revision' && <SpacedRevisionView />}
        {activeTab === 'current_affairs' && <CurrentAffairsView />}
        {activeTab === 'syllabus' && <SyllabusTreeView />}
        {activeTab === 'adaptive' && <AdaptivePracticeView />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'final_week' && <FinalWeekView />}
        {activeTab === 'questions' && <QuestionBankView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-700">AILET 2027 Preparation Operating System</span>
            <span className="mx-2">•</span>
            <span>National Law University Delhi B.A. LL.B. (Hons.)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Official facts verified per NLU Delhi • 150 Qs • 120 Min • -0.25 Negative Marking
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

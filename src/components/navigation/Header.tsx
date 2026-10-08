// src/components/navigation/Header.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamCountdownBadge } from './ExamCountdownBadge';
import { DateSimulatorBar } from './DateSimulatorBar';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import {
  Home,
  CheckSquare,
  Calendar,
  BookOpen,
  RotateCcw,
  Newspaper,
  GitBranch,
  Target,
  BarChart2,
  Flag,
  FileQuestion,
  Settings,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { isFinalWeek } from '../../utils/date';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, currentDate, errorEntries, spacedRevisionItems } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute badges
  const dueRevisionCount = spacedRevisionItems.filter((i) => i.nextDueDate <= currentDate && i.stage !== 'Mastered').length;
  const inFinalWeek = isFinalWeek(currentDate);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mock', label: 'Mocks & Practice', icon: CheckSquare },
    { id: 'study_plan', label: 'Study Plan', icon: Calendar },
    { id: 'error_notebook', label: 'Error Notebook', icon: BookOpen, count: errorEntries.length },
    { id: 'revision', label: 'Spaced Revision', icon: RotateCcw, count: dueRevisionCount },
    { id: 'current_affairs', label: 'Current Affairs', icon: Newspaper },
    { id: 'syllabus', label: 'Syllabus', icon: GitBranch },
    { id: 'adaptive', label: 'Adaptive Practice', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    {
      id: 'final_week',
      label: 'Final Week Mode',
      icon: Flag,
      isSpecial: inFinalWeek,
      specialText: inFinalWeek ? 'Active' : undefined,
    },
    { id: 'questions', label: 'Question Bank', icon: FileQuestion },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <DateSimulatorBar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Exam Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-serif font-black text-lg group-hover:bg-slate-800 transition">
                A
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
                    AILET 2027
                  </span>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Preparation OS
                  </span>
                  <OfficialRecommendedTag type="official" label="NLU Delhi" size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 truncate hidden md:block">
                  Personal single-student mastery operating system
                </p>
              </div>
            </button>
          </div>

          {/* Right actions: Countdown + Mobile hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ExamCountdownBadge />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 py-1 -mb-px">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.isSpecial && (
                  <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                    {item.specialText}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[105px] bottom-0 bg-slate-900/40 backdrop-blur-xs z-50">
          <div className="bg-white border-b border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                        {item.count}
                      </span>
                    )}
                    {item.isSpecial && (
                      <span className="px-2 py-0.5 rounded text-xs bg-rose-500 text-white font-bold">
                        {item.specialText}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

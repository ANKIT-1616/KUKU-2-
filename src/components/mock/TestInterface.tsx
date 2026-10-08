// src/components/mock/TestInterface.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionItem } from '../../types/question';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Send,
  Flag,
  HelpCircle,
} from 'lucide-react';

export const TestInterface: React.FC = () => {
  const {
    activeTest,
    activeTestQuestions,
    updateAnswer,
    submitActiveTest,
    abandonActiveTest,
    setOMRPromptAcknowledged,
    examConfig,
    settings,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState<'all' | 'english' | 'ca_gk' | 'logical'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [showOMRWarning, setShowOMRWarning] = useState(false);

  // Sync index from active state if available
  useEffect(() => {
    if (activeTest) {
      setCurrentIndex(activeTest.currentQuestionIndex || 0);
    }
  }, [activeTest]);

  // Handle timer tick based on ABSOLUTE targetEndTimestamp
  useEffect(() => {
    if (!activeTest) return;

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = activeTest.targetEndTimestamp - now;
      const remainingSec = Math.max(0, Math.floor(diffMs / 1000));
      setTimeRemainingSeconds(remainingSec);

      // OMR warning trigger at 8 minutes (480 seconds) remaining if enabled & not yet acknowledged
      if (
        settings.omrPracticePromptEnabled &&
        remainingSec <= 480 &&
        remainingSec > 0 &&
        !activeTest.omrPromptAcknowledged
      ) {
        setShowOMRWarning(true);
      }

      // Auto submit on expiry
      if (remainingSec <= 0) {
        submitActiveTest({
          timeIssues: 'Auto-submitted on 120-minute timer expiry.',
          weakTopics: ['Time allocation per section'],
          correctiveAction: 'Practice with stricter per-question timing.',
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeTest, settings.omrPracticePromptEnabled, submitActiveTest]);

  // Window beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You have an active test running. All progress is autosaved.';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (!activeTest || activeTestQuestions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active test in progress.
      </div>
    );
  }

  // Filter questions for display or navigation
  const questionsToUse = activeTestQuestions;
  const currentQ: QuestionItem = questionsToUse[currentIndex] || questionsToUse[0];
  const currentAnswer = activeTest.answers[currentQ.id];

  // Stats calculation
  const stats = useMemo(() => {
    let attempted = 0;
    let unattempted = 0;
    let markedForReview = 0;

    for (const q of activeTestQuestions) {
      const a = activeTest.answers[q.id];
      if (a?.selectedOptionId) {
        attempted++;
      } else {
        unattempted++;
      }
      if (a?.isMarkedForReview) {
        markedForReview++;
      }
    }

    return {
      totalQuestions: activeTestQuestions.length,
      attempted,
      unattempted,
      markedForReview,
    };
  }, [activeTest, activeTestQuestions]);

  // Formatting timer
  const formatTimer = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    updateAnswer(currentQ.id, optionId);
  };

  const handleClearResponse = () => {
    updateAnswer(currentQ.id, null);
  };

  const handleToggleMarkReview = () => {
    const isMarked = currentAnswer?.isMarkedForReview;
    updateAnswer(currentQ.id, currentAnswer?.selectedOptionId || null, !isMarked);
  };

  const handleNext = () => {
    if (currentIndex < questionsToUse.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setIsMobilePaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Test Header Bar */}
      <header className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold text-white truncate">
                {activeTest.testTitle}
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeTest.type.toUpperCase()}
              </span>
              <OfficialRecommendedTag type="official" label="-0.25 Negative Marking" size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {examConfig.degree} • {examConfig.conductingBody}
            </p>
          </div>
        </div>

        {/* Center/Right Timer & Submit button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sticky Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm sm:text-base font-bold tracking-wider ${
              timeRemainingSeconds <= 600
                ? 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
                : 'bg-slate-800 text-amber-400 border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-500 transition shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>

          {/* Mobile palette drawer button */}
          <button
            onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Question Palette"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* OMR Practice Reminder Banner */}
      {showOMRWarning && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>OMR Practice Alert (Product design addition):</strong> Less than 8 minutes remaining! In the official pen-and-paper exam, reserve this time to bubble answers onto your OMR sheet and verify doubtful questions.
            </span>
          </div>
          <button
            onClick={() => {
              setShowOMRWarning(false);
              setOMRPromptAcknowledged();
            }}
            className="px-2.5 py-1 rounded bg-slate-950 text-white text-[11px] font-bold hover:bg-slate-800 transition shrink-0"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Subheader: Section Navigation Strip */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sections:</span>
          {examConfig.sections.map((sec) => {
            const isCur = currentQ.sectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  const targetIdx = activeTestQuestions.findIndex((q) => q.sectionId === sec.id);
                  if (targetIdx >= 0) setCurrentIndex(targetIdx);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  isCur
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{sec.name}</span>
                <span className="text-[10px] opacity-80 font-mono">({sec.questionCount}Q)</span>
              </button>
            );
          })}
        </div>

        {/* Quick summary counts */}
        <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-600">
          <span className="text-emerald-700 font-bold">{stats.attempted} Attempted</span>
          <span>•</span>
          <span className="text-slate-500">{stats.unattempted} Unattempted</span>
          <span>•</span>
          <span className="text-amber-700 font-bold">{stats.markedForReview} Marked</span>
        </div>
      </div>

      {/* Main Body: Question View + Side Palette */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question area */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 bg-slate-50">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-between">
            {/* Question card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-2xs mb-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black font-mono px-2.5 py-1 rounded bg-slate-900 text-white">
                    Question {currentIndex + 1} of {questionsToUse.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 capitalize">
                    {currentQ.sectionId.replace('_', ' ')} • {currentQ.questionType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMarkReview}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                      currentAnswer?.isMarkedForReview
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>
                      {currentAnswer?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Passage if applicable */}
              {currentQ.passage && (
                <div className="mb-5 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed max-h-64 overflow-y-auto">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Passage:
                  </div>
                  <p>{currentQ.passage}</p>
                </div>
              )}

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed mb-6 whitespace-pre-line">
                {currentQ.question}
              </div>

              {/* Options list */}
              <div className="space-y-3">
                {currentQ.options.map((option) => {
                  const isSelected = currentAnswer?.selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white font-medium shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50/60 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {option.id}
                      </span>
                      <span className="leading-relaxed pt-0.5">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleClearResponse}
                  disabled={!currentAnswer?.selectedOptionId}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Clear Answer
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleToggleMarkReview();
                    handleNext();
                  }}
                  className="px-3.5 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition hidden sm:inline-flex"
                >
                  Mark & Next
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === questionsToUse.length - 1}
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 shadow-2xs"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Desktop Palette / Mobile Drawer */}
        <aside
          className={`lg:w-80 w-full bg-white border-l border-slate-200 flex flex-col shrink-0 transition-transform ${
            isMobilePaletteOpen
              ? 'fixed inset-0 z-50 overflow-y-auto block'
              : 'hidden lg:flex'
          }`}
        >
          {/* Palette header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Question Palette</h3>
              <p className="text-[11px] text-slate-500">
                Click any number to jump to question
              </p>
            </div>
            {isMobilePaletteOpen && (
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Legend */}
          <div className="p-3 border-b border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-600 shrink-0" />
              <span>Answered ({stats.attempted})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-300 shrink-0" />
              <span>Unanswered ({stats.unattempted})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-400 shrink-0" />
              <span>Marked ({stats.markedForReview})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded ring-2 ring-slate-900 bg-white shrink-0" />
              <span>Current (Q{currentIndex + 1})</span>
            </div>
          </div>

          {/* Palette Buttons Grid */}
          <div className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-5 gap-2">
              {questionsToUse.map((q, idx) => {
                const ans = activeTest.answers[q.id];
                const isSelected = Boolean(ans?.selectedOptionId);
                const isMarked = Boolean(ans?.isMarkedForReview);
                const isCurrent = idx === currentIndex;

                let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (isSelected && isMarked) {
                  btnClass = 'bg-amber-500 text-slate-950 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-emerald-600 text-white font-bold';
                } else if (isMarked) {
                  btnClass = 'bg-amber-300 text-slate-950 font-bold';
                }

                if (isCurrent) {
                  btnClass += ' ring-2 ring-offset-2 ring-slate-950 font-black';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-9 rounded-lg text-xs font-mono transition flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quit / Abandon safeguard */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to abandon this test attempt? Unsaved work will be cleared.'
                  )
                ) {
                  abandonActiveTest();
                }
              }}
              className="w-full py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition text-center"
            >
              Abandon Test
            </button>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={(notes) => {
          setIsSubmitModalOpen(false);
          submitActiveTest(notes);
        }}
        stats={stats}
      />
    </div>
  );
};

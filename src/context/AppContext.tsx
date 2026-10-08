// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ExamConfig, MistakeType } from '../types/exam';
import { PlanDay, RebalanceLog } from '../types/plan';
import { MockAttemptResult, ActiveTestState, MockTestConfig, TwelvePointMockRecord } from '../types/mock';
import { ErrorNotebookEntry } from '../types/error';
import { SpacedRevisionItem } from '../types/revision';
import { CurrentAffairItem } from '../types/ca';
import { QuestionItem } from '../types/question';
import { StorageRepository, StudentSettings, DEFAULT_SETTINGS } from '../services/storageRepository';
import { DEFAULT_EXAM_CONFIG } from '../config/defaultExamConfig';
import { SEED_QUESTIONS } from '../data/seedQuestions';
import { calculateExamScore } from '../services/scoringEngine';
import { calculateNextDueDate, createInitialSpacedItems } from '../services/spacedRevisionEngine';
import { rebalanceMissedDays, generateFullStudyPlan } from '../services/planRebalancer';
import { formatDateYMD, addDays } from '../utils/date';

interface AppContextType {
  examConfig: ExamConfig;
  updateExamConfig: (cfg: ExamConfig) => void;
  planDays: PlanDay[];
  toggleTaskComplete: (dayDate: string, taskId: string) => void;
  rebalancePlan: () => RebalanceLog;
  rebalanceLogs: RebalanceLog[];
  mockAttempts: MockAttemptResult[];
  activeTest: ActiveTestState | null;
  activeTestQuestions: QuestionItem[];
  startTest: (testConfig: MockTestConfig, questions: QuestionItem[]) => void;
  updateAnswer: (questionId: string, optionId: string | null, isMarkedForReview?: boolean) => void;
  submitActiveTest: (notes?: {
    timeIssues?: string;
    weakTopics?: string[];
    correctiveAction?: string;
  }) => MockAttemptResult | null;
  abandonActiveTest: () => void;
  setOMRPromptAcknowledged: () => void;
  errorEntries: ErrorNotebookEntry[];
  addErrorEntry: (entry: Omit<ErrorNotebookEntry, 'id'>) => ErrorNotebookEntry;
  updateErrorEntry: (id: string, updates: Partial<ErrorNotebookEntry>) => void;
  archiveErrorEntry: (id: string) => void;
  spacedRevisionItems: SpacedRevisionItem[];
  completeRevisionStage: (itemId: string, passed: boolean, notes?: string) => void;
  addSpacedRevisionItem: (item: Omit<SpacedRevisionItem, 'id'>) => void;
  currentAffairs: CurrentAffairItem[];
  addCurrentAffair: (item: Omit<CurrentAffairItem, 'id'>) => CurrentAffairItem;
  updateCATracker: (id: string, trackerKey: keyof CurrentAffairItem['tracker'], value: boolean) => void;
  deleteCurrentAffair: (id: string) => void;
  questions: QuestionItem[];
  addQuestion: (q: Omit<QuestionItem, 'id'>) => QuestionItem;
  updateQuestion: (id: string, updates: Partial<QuestionItem>) => void;
  settings: StudentSettings;
  updateSettings: (s: Partial<StudentSettings>) => void;
  currentDate: string; // Effective date in YYYY-MM-DD
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAttemptResultForModal: MockAttemptResult | null;
  setActiveAttemptResultForModal: (res: MockAttemptResult | null) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [examConfig, setExamConfigState] = useState<ExamConfig>(() => StorageRepository.getExamConfig());
  const [planDays, setPlanDaysState] = useState<PlanDay[]>(() => StorageRepository.getPlanDays());
  const [mockAttempts, setMockAttemptsState] = useState<MockAttemptResult[]>(() => StorageRepository.getMockAttempts());
  const [activeTest, setActiveTestState] = useState<ActiveTestState | null>(() => StorageRepository.getActiveTest());
  const [activeTestQuestions, setActiveTestQuestions] = useState<QuestionItem[]>([]);
  const [errorEntries, setErrorEntriesState] = useState<ErrorNotebookEntry[]>(() => StorageRepository.getErrorEntries());
  const [spacedRevisionItems, setSpacedRevisionItemsState] = useState<SpacedRevisionItem[]>(() =>
    StorageRepository.getSpacedRevisionItems()
  );
  const [currentAffairs, setCurrentAffairsState] = useState<CurrentAffairItem[]>(() =>
    StorageRepository.getCurrentAffairs()
  );
  const [questions, setQuestionsState] = useState<QuestionItem[]>(() => StorageRepository.getQuestions());
  const [settings, setSettingsState] = useState<StudentSettings>(() => StorageRepository.getSettings());
  const [rebalanceLogs, setRebalanceLogsState] = useState<RebalanceLog[]>(() => StorageRepository.getRebalanceLogs());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeAttemptResultForModal, setActiveAttemptResultForModal] = useState<MockAttemptResult | null>(null);

  // Restore active test questions on reload if active test exists
  useEffect(() => {
    if (activeTest && activeTestQuestions.length === 0) {
      const qIds = Object.keys(activeTest.answers);
      const matched = questions.filter((q) => qIds.includes(q.id));
      if (matched.length > 0) {
        setActiveTestQuestions(matched);
      }
    }
  }, [activeTest, questions, activeTestQuestions.length]);

  // Compute effective date
  const currentDate = useMemo(() => {
    if (settings.isDateSimulationActive && settings.simulatedDate) {
      return settings.simulatedDate;
    }
    // Return local date formatted as YYYY-MM-DD
    const now = new Date();
    return formatDateYMD(now);
  }, [settings.isDateSimulationActive, settings.simulatedDate]);

  // Exam config updater
  const updateExamConfig = useCallback((cfg: ExamConfig) => {
    setExamConfigState(cfg);
    StorageRepository.saveExamConfig(cfg);
  }, []);

  // Settings updater
  const updateSettings = useCallback((newSettings: Partial<StudentSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      StorageRepository.saveSettings(updated);
      return updated;
    });
  }, []);

  // Task completion toggle
  const toggleTaskComplete = useCallback((dayDate: string, taskId: string) => {
    setPlanDaysState((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== dayDate) return day;
        const newTasks = day.tasks.map((task) => {
          if (task.id !== taskId) return task;
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        });
        const completedCount = newTasks.filter((t) => t.completed).length;
        return {
          ...day,
          tasks: newTasks,
          completedCount,
        };
      });
      StorageRepository.savePlanDays(updated);
      return updated;
    });
  }, []);

  // Rebalance plan
  const rebalancePlan = useCallback((): RebalanceLog => {
    const { updatedDays, log } = rebalanceMissedDays(planDays, currentDate);
    setPlanDaysState(updatedDays);
    StorageRepository.savePlanDays(updatedDays);
    setRebalanceLogsState((prev) => {
      const nextLogs = [log, ...prev];
      StorageRepository.saveRebalanceLogs(nextLogs);
      return nextLogs;
    });
    return log;
  }, [planDays, currentDate]);

  // Start test
  const startTest = useCallback((testConfig: MockTestConfig, testQuestions: QuestionItem[]) => {
    const now = Date.now();
    const answers: ActiveTestState['answers'] = {};
    for (const q of testQuestions) {
      answers[q.id] = {
        questionId: q.id,
        selectedOptionId: null,
        isMarkedForReview: false,
        timeSpentSeconds: 0,
        visited: false,
      };
    }
    // Mark first question visited
    if (testQuestions.length > 0) {
      answers[testQuestions[0].id].visited = true;
    }

    const newActiveState: ActiveTestState = {
      testId: testConfig.id,
      testTitle: testConfig.title,
      type: testConfig.type,
      durationMinutes: testConfig.durationMinutes,
      startedAtTimestamp: now,
      targetEndTimestamp: now + testConfig.durationMinutes * 60 * 1000,
      answers,
      currentQuestionIndex: 0,
      isPaused: false,
      totalPausedDurationMs: 0,
      omrPromptAcknowledged: false,
    };

    setActiveTestState(newActiveState);
    setActiveTestQuestions(testQuestions);
    StorageRepository.saveActiveTest(newActiveState);
  }, []);

  // Update answer in active test
  const updateAnswer = useCallback((questionId: string, optionId: string | null, isMarkedForReview?: boolean) => {
    setActiveTestState((prev) => {
      if (!prev) return null;
      const currentAns = prev.answers[questionId] || {
        questionId,
        selectedOptionId: null,
        isMarkedForReview: false,
        timeSpentSeconds: 0,
        visited: true,
      };

      const updatedAns = {
        ...currentAns,
        selectedOptionId: optionId,
        isMarkedForReview: isMarkedForReview !== undefined ? isMarkedForReview : currentAns.isMarkedForReview,
        visited: true,
      };

      const next = {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: updatedAns,
        },
      };
      StorageRepository.saveActiveTest(next);
      return next;
    });
  }, []);

  const setOMRPromptAcknowledged = useCallback(() => {
    setActiveTestState((prev) => {
      if (!prev) return null;
      const updated = { ...prev, omrPromptAcknowledged: true };
      StorageRepository.saveActiveTest(updated);
      return updated;
    });
  }, []);

  // Abandon active test
  const abandonActiveTest = useCallback(() => {
    setActiveTestState(null);
    setActiveTestQuestions([]);
    StorageRepository.saveActiveTest(null);
  }, []);

  // Submit active test
  const submitActiveTest = useCallback(
    (notes?: {
      timeIssues?: string;
      weakTopics?: string[];
      correctiveAction?: string;
    }): MockAttemptResult | null => {
      if (!activeTest || activeTestQuestions.length === 0) return null;

      const submissions: Record<string, { questionId: string; selectedOptionId: string | null; isMarkedForReview?: boolean }> = {};
      for (const qId of Object.keys(activeTest.answers)) {
        submissions[qId] = {
          questionId: qId,
          selectedOptionId: activeTest.answers[qId].selectedOptionId,
          isMarkedForReview: activeTest.answers[qId].isMarkedForReview,
        };
      }

      const scoreBreakdown = calculateExamScore(examConfig, activeTestQuestions, submissions);
      const actualTimeSpentSeconds = Math.min(
        activeTest.durationMinutes * 60,
        Math.round((Date.now() - activeTest.startedAtTimestamp - activeTest.totalPausedDurationMs) / 1000)
      );

      // Construct detailed 12-point record per PDF
      const twelvePointRecord: TwelvePointMockRecord = {
        point1_score: scoreBreakdown.score,
        point2_attempted: scoreBreakdown.attempted,
        point3_correct: scoreBreakdown.correct,
        point4_wrong: scoreBreakdown.wrong,
        point5_unattempted: scoreBreakdown.unattempted,
        point6_accuracyPercentage: scoreBreakdown.accuracyPercentage,
        point7_englishScore: scoreBreakdown.sectionScores['english']?.score ?? 0,
        point8_caGkScore: scoreBreakdown.sectionScores['ca_gk']?.score ?? 0,
        point9_logicalScore: scoreBreakdown.sectionScores['logical']?.score ?? 0,
        point10_timeManagementIssues: notes?.timeIssues || 'Time distributed evenly; pace steady.',
        point11_weakTopics: notes?.weakTopics || [],
        point12_correctiveActionNext3Days:
          notes?.correctiveAction || 'Log incorrect questions in Error Notebook; schedule spaced review.',
      };

      const questionResponses: MockAttemptResult['questionResponses'] = {};
      for (const q of activeTestQuestions) {
        const userSub = activeTest.answers[q.id];
        const selected = userSub?.selectedOptionId;
        const isCorrect = selected ? selected.toUpperCase() === q.correctAnswer.toUpperCase() : false;
        const isUnattempted = !selected;

        questionResponses[q.id] = {
          questionId: q.id,
          sectionId: q.sectionId,
          topicId: q.topicId,
          userAnswer: selected,
          correctAnswer: q.correctAnswer,
          isCorrect,
          isUnattempted,
          timeSpentSeconds: userSub?.timeSpentSeconds || 0,
        };
      }

      const result: MockAttemptResult = {
        id: `att_${Date.now()}`,
        testId: activeTest.testId,
        testTitle: activeTest.testTitle,
        type: activeTest.type,
        date: currentDate,
        completedAt: new Date().toISOString(),
        durationMinutes: activeTest.durationMinutes,
        actualTimeSpentSeconds: Math.max(10, actualTimeSpentSeconds),
        scoreBreakdown,
        twelvePointRecord,
        questionResponses,
        isOmrModeUsed: settings.omrPracticePromptEnabled,
      };

      setMockAttemptsState((prev) => {
        const updated = [result, ...prev];
        StorageRepository.saveMockAttempts(updated);
        return updated;
      });

      // Clear active test
      setActiveTestState(null);
      setActiveTestQuestions([]);
      StorageRepository.saveActiveTest(null);

      // Set for analysis modal
      setActiveAttemptResultForModal(result);

      return result;
    },
    [activeTest, activeTestQuestions, examConfig, currentDate, settings.omrPracticePromptEnabled]
  );

  // Error Notebook operations
  const addErrorEntry = useCallback((entry: Omit<ErrorNotebookEntry, 'id'>) => {
    const newEntry: ErrorNotebookEntry = {
      ...entry,
      id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setErrorEntriesState((prev) => {
      const updated = [newEntry, ...prev];
      StorageRepository.saveErrorEntries(updated);
      return updated;
    });
    return newEntry;
  }, []);

  const updateErrorEntry = useCallback((id: string, updates: Partial<ErrorNotebookEntry>) => {
    setErrorEntriesState((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      StorageRepository.saveErrorEntries(updated);
      return updated;
    });
  }, []);

  const archiveErrorEntry = useCallback((id: string) => {
    setErrorEntriesState((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, isArchived: true } : e));
      StorageRepository.saveErrorEntries(updated);
      return updated;
    });
  }, []);

  // Spaced revision operations
  const completeRevisionStage = useCallback(
    (itemId: string, passed: boolean, notes?: string) => {
      setSpacedRevisionItemsState((prev) => {
        const updated = prev.map((item) => {
          if (item.id !== itemId) return item;
          const { nextDueDate, nextStage, nextStageIndex } = calculateNextDueDate(
            item.initialLearnDate,
            item.stageIndex,
            passed
          );
          const historyEntry = {
            stage: item.stage,
            completedDate: currentDate,
            passed,
            scoreOrNotes: notes || (passed ? 'Completed on schedule' : 'Needs reinforcement'),
          };

          return {
            ...item,
            stage: nextStage,
            stageIndex: nextStageIndex,
            nextDueDate,
            lastCompletedDate: currentDate,
            reviewHistory: [...item.reviewHistory, historyEntry],
          };
        });
        StorageRepository.saveSpacedRevisionItems(updated);
        return updated;
      });
    },
    [currentDate]
  );

  const addSpacedRevisionItem = useCallback((item: Omit<SpacedRevisionItem, 'id'>) => {
    const newItem: SpacedRevisionItem = {
      ...item,
      id: `rev_${Date.now()}`,
    };
    setSpacedRevisionItemsState((prev) => {
      const updated = [newItem, ...prev];
      StorageRepository.saveSpacedRevisionItems(updated);
      return updated;
    });
  }, []);

  // Current Affairs operations
  const addCurrentAffair = useCallback((item: Omit<CurrentAffairItem, 'id'>) => {
    const newItem: CurrentAffairItem = {
      ...item,
      id: `ca_${Date.now()}`,
    };
    setCurrentAffairsState((prev) => {
      const updated = [newItem, ...prev];
      StorageRepository.saveCurrentAffairs(updated);
      return updated;
    });
    return newItem;
  }, []);

  const updateCATracker = useCallback((id: string, trackerKey: keyof CurrentAffairItem['tracker'], value: boolean) => {
    setCurrentAffairsState((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          tracker: {
            ...item.tracker,
            [trackerKey]: value,
          },
        };
      });
      StorageRepository.saveCurrentAffairs(updated);
      return updated;
    });
  }, []);

  const deleteCurrentAffair = useCallback((id: string) => {
    setCurrentAffairsState((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      StorageRepository.saveCurrentAffairs(updated);
      return updated;
    });
  }, []);

  // Question operations
  const addQuestion = useCallback((q: Omit<QuestionItem, 'id'>) => {
    const newQ: QuestionItem = {
      ...q,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setQuestionsState((prev) => {
      const updated = [newQ, ...prev];
      StorageRepository.saveQuestions(updated);
      return updated;
    });
    return newQ;
  }, []);

  const updateQuestion = useCallback((id: string, updates: Partial<QuestionItem>) => {
    setQuestionsState((prev) => {
      const updated = prev.map((q) => (q.id === id ? { ...q, ...updates } : q));
      StorageRepository.saveQuestions(updated);
      return updated;
    });
  }, []);

  // Reset
  const resetAllData = useCallback(() => {
    StorageRepository.resetAllData();
    setExamConfigState(DEFAULT_EXAM_CONFIG);
    const initialPlan = generateFullStudyPlan();
    setPlanDaysState(initialPlan);
    setMockAttemptsState([]);
    setActiveTestState(null);
    setActiveTestQuestions([]);
    setErrorEntriesState([]);
    setSpacedRevisionItemsState(createInitialSpacedItems('2026-10-02'));
    setCurrentAffairsState([]);
    setQuestionsState(SEED_QUESTIONS);
    setSettingsState(DEFAULT_SETTINGS);
    setRebalanceLogsState([]);
  }, []);

  const value = useMemo(
    () => ({
      examConfig,
      updateExamConfig,
      planDays,
      toggleTaskComplete,
      rebalancePlan,
      rebalanceLogs,
      mockAttempts,
      activeTest,
      activeTestQuestions,
      startTest,
      updateAnswer,
      submitActiveTest,
      abandonActiveTest,
      setOMRPromptAcknowledged,
      errorEntries,
      addErrorEntry,
      updateErrorEntry,
      archiveErrorEntry,
      spacedRevisionItems,
      completeRevisionStage,
      addSpacedRevisionItem,
      currentAffairs,
      addCurrentAffair,
      updateCATracker,
      deleteCurrentAffair,
      questions,
      addQuestion,
      updateQuestion,
      settings,
      updateSettings,
      currentDate,
      activeTab,
      setActiveTab,
      activeAttemptResultForModal,
      setActiveAttemptResultForModal,
      resetAllData,
    }),
    [
      examConfig,
      updateExamConfig,
      planDays,
      toggleTaskComplete,
      rebalancePlan,
      rebalanceLogs,
      mockAttempts,
      activeTest,
      activeTestQuestions,
      startTest,
      updateAnswer,
      submitActiveTest,
      abandonActiveTest,
      setOMRPromptAcknowledged,
      errorEntries,
      addErrorEntry,
      updateErrorEntry,
      archiveErrorEntry,
      spacedRevisionItems,
      completeRevisionStage,
      addSpacedRevisionItem,
      currentAffairs,
      addCurrentAffair,
      updateCATracker,
      deleteCurrentAffair,
      questions,
      addQuestion,
      updateQuestion,
      settings,
      updateSettings,
      currentDate,
      activeTab,
      setActiveTab,
      activeAttemptResultForModal,
      setActiveAttemptResultForModal,
      resetAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};

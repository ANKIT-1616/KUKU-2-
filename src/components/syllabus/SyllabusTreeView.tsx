// src/components/syllabus/SyllabusTreeView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SYLLABUS_SECTIONS } from '../../config/syllabusData';
import { PRIORITY_MATRIX } from '../../config/priorityMatrix';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { PriorityBadge } from '../common/Badge';
import {
  GitBranch,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export const SyllabusTreeView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    english: true,
    ca_gk: true,
    logical: true,
  });
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    eng_rc: true,
    lr_cr: true,
    lr_analytical_core: true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Interactive Syllabus Tree & Priority Explorer
              </h2>
              <OfficialRecommendedTag type="official" label="Official Section Counts" />
              <OfficialRecommendedTag type="recommended" label="Recommended Sub-topics" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              <strong>Ground Rule Transparency:</strong> Section names and question counts (English 50, CA & GK 30, Logical Reasoning 70) are <strong>OFFICIAL</strong> exam facts. Sub-topics, priorities, and study cadences are <strong>RECOMMENDED</strong> preparation guidelines inferred from past papers in the student's planner PDF.
            </p>
          </div>
        </div>

        {/* Priority Matrix Quick Summary */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
          <span className="font-semibold text-slate-700 py-0.5">Priority Hierarchy:</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold border border-rose-200">
            VERY HIGH: RC, Critical Reasoning, Syllogisms/Arrangements, Core CA
          </span>
          <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-semibold border border-orange-200">
            HIGH: Principle+Facts, Vocab, Grammar (SVA)
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium border border-amber-200">
            MEDIUM: Static GK, Para Jumbles, Series/Directions
          </span>
          <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold border border-red-200">
            AVOID: Case Law Memorization, Deep Maxims, Mathematics
          </span>
        </div>
      </div>

      {/* Sections Tree */}
      <div className="space-y-4">
        {SYLLABUS_SECTIONS.map((section) => {
          const isSecExpanded = expandedSections[section.id];
          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left p-4 sm:p-5 bg-slate-50/80 hover:bg-slate-100/70 border-b border-slate-200 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {isSecExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-600 shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">
                        {section.name}
                      </h3>
                      <OfficialRecommendedTag type="official" label={`${section.questionCount} Questions / ${section.marks} Marks`} />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {section.topics.length} topic clusters inferred from previous papers
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-300">
                    {section.questionCount} Marks
                  </span>
                </div>
              </button>

              {/* Topics under Section */}
              {isSecExpanded && (
                <div className="divide-y divide-slate-100">
                  {section.topics.map((topic) => {
                    const isTopicExpanded = expandedTopics[topic.id];
                    const isAvoid = topic.priority === 'AVOID';

                    return (
                      <div
                        key={topic.id}
                        className={`p-4 sm:p-5 transition ${isAvoid ? 'bg-rose-50/20' : 'bg-white'}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <button
                            onClick={() => toggleTopic(topic.id)}
                            className="flex items-center gap-2 text-left group"
                          >
                            {isTopicExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                            )}
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                              {topic.name}
                            </h4>
                            <PriorityBadge priority={topic.priority} />
                          </button>

                          {/* Guidelines */}
                          <div className="flex items-center gap-3 text-xs text-slate-600 font-sans">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              Practice: {topic.practiceGuideline}
                            </span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] hidden md:inline">
                              Revision: {topic.revisionGuideline}
                            </span>
                          </div>
                        </div>

                        {/* Avoid justification if applicable */}
                        {isAvoid && topic.avoidReason && (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs mb-3 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>OFFICIAL EXAM FACT: </strong>
                              <span>{topic.avoidReason}</span>
                            </div>
                          </div>
                        )}

                        {/* Subtopics Grid */}
                        {isTopicExpanded && (
                          <div className="pl-6 pt-2">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <span>Recommended Sub-topics:</span>
                              <OfficialRecommendedTag type="recommended" label="Inferred from papers" size="sm" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {topic.subtopics.map((sub) => (
                                <div
                                  key={sub.id}
                                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                                    isAvoid
                                      ? 'border-red-200 bg-red-50/50 text-red-800 line-through'
                                      : 'border-slate-200 bg-slate-50/60 text-slate-800'
                                  }`}
                                >
                                  <span className="truncate">{sub.name}</span>
                                  {!isAvoid && (
                                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                      Recommended
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

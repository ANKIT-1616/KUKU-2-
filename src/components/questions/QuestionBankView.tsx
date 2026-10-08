// src/components/questions/QuestionBankView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionItem, QuestionStatus } from '../../types/question';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { validateQuestionItem } from '../../services/questionValidator';
import {
  FileQuestion,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Search,
  BookOpen,
} from 'lucide-react';

export const QuestionBankView: React.FC = () => {
  const { questions, addQuestion, updateQuestion } = useApp();
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  const filteredQuestions = questions.filter((q) => {
    if (selectedSection !== 'all' && q.sectionId !== selectedSection) return false;
    if (selectedStatus !== 'all' && q.status !== selectedStatus) return false;
    if (searchQuery) {
      const match = `${q.question} ${q.explanation} ${q.questionType}`.toLowerCase();
      if (!match.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `ailet2027_question_bank_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Question Bank & Quality Assurance Pipeline
              </h2>
              <OfficialRecommendedTag type="official" label="Zero Fake PYQs" />
              <OfficialRecommendedTag type="recommended" label="Quality Over Quantity" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Every question in the bank passes an automated quality checklist: single correct answer, 4 distinct options, full explanation, and strictly zero external law required for principle questions. Ships with sample items clearly labelled <code>SAMPLE</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Bank JSON</span>
            </button>
          </div>
        </div>

        {/* Quality checklist highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">Automated Checks</span>
            <span className="text-slate-600 text-[11px]">4 options, no duplicates, single correct key, 15+ char explanation</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">Pure Logic Principle Rule</span>
            <span className="text-slate-600 text-[11px]">No IPC, CrPC, statutes, or landmark cases tested in legal questions</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">Strict Authenticity</span>
            <span className="text-slate-600 text-[11px]">SAMPLE questions are transparently marked; no fake PYQs claimed</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="p-1.5 rounded-md border border-slate-300 font-medium"
          >
            <option value="all">All Sections</option>
            <option value="english">English (50Q)</option>
            <option value="ca_gk">Current Affairs & GK (30Q)</option>
            <option value="logical">Logical Reasoning (70Q)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 rounded-md border border-slate-300 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="VALIDATED">Validated</option>
            <option value="SAMPLE">Sample Demonstrators</option>
            <option value="DRAFT">Drafts</option>
          </select>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-300 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedQId === q.id;
          const validationReport = validateQuestionItem(q);

          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 capitalize">
                    {q.sectionId.replace('_', ' ')} • {q.questionType}
                  </span>
                  <OfficialRecommendedTag type="sample" label={q.status} size="sm" />
                  <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                    Difficulty: {q.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {validationReport.isValid ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Quality Passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> Issues Flagged
                    </span>
                  )}
                  <button
                    onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                    className="text-xs text-blue-700 font-semibold hover:underline"
                  >
                    {isExpanded ? 'Collapse' : 'Inspect'}
                  </button>
                </div>
              </div>

              {q.passage && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 italic">
                  {q.passage}
                </div>
              )}

              <p className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-pre-line">
                {q.question}
              </p>

              {/* Expanded details */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 space-y-3 animate-fadeIn text-xs">
                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const isCorrect = opt.id === q.correctAnswer;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                            isCorrect
                              ? 'border-emerald-400 bg-emerald-50/60 font-semibold text-emerald-950'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <span className="font-bold shrink-0">{opt.id}.</span>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                    <strong className="block text-slate-900 mb-0.5">Official Explanation:</strong>
                    <p>{q.explanation}</p>
                  </div>

                  {/* Source metadata */}
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Source: {q.source}</span>
                    <span>No external law required: {q.qualityCheck.noExternalLawRequired ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// src/components/error-notebook/ErrorNotebookView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ErrorNotebookEntry } from '../../types/error';
import { MistakeType } from '../../types/exam';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { MistakeBadge } from '../common/Badge';
import { AddErrorModal } from './AddErrorModal';
import { ReattemptModal } from './ReattemptModal';
import {
  BookOpen,
  Plus,
  Filter,
  RotateCcw,
  Archive,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
} from 'lucide-react';

export const ErrorNotebookView: React.FC = () => {
  const { errorEntries, archiveErrorEntry, currentDate } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEntryForReattempt, setSelectedEntryForReattempt] = useState<ErrorNotebookEntry | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Visible non-archived entries (unless filtering for archive)
  const filteredEntries = errorEntries.filter((e) => {
    if (e.isArchived && statusFilter !== 'archived') return false;
    if (statusFilter === 'archived' && !e.isArchived) return false;
    if (subjectFilter !== 'all' && e.subject !== subjectFilter) return false;
    if (typeFilter !== 'all' && e.mistakeType !== typeFilter) return false;
    if (statusFilter === 'due' && e.reattemptDate > currentDate) return false;
    if (statusFilter === 'resolved' && e.reattemptStatus !== 'resolved') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${e.questionText} ${e.topic} ${e.whyWrong} ${e.correctConcept}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const dueCount = errorEntries.filter((e) => !e.isArchived && e.reattemptDate <= currentDate && e.reattemptStatus !== 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Personal Error Notebook
              </h2>
              <OfficialRecommendedTag type="recommended" label="PDF Core Discipline" />
              <OfficialRecommendedTag type="addition" label="Spaced Reattempt Engine" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              PDF Rule: "Reattempt every marked question on its scheduled spaced day. Never delete entries." Master the 4 mistake types to systematically eliminate negative marks (-0.25).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Log Manual Mistake</span>
            </button>
          </div>
        </div>

        {/* 4 Mistake types summary banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-2.5 rounded-lg bg-red-50/60 border border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-900">Concept mistake</span>
              <span className="text-sm font-bold font-mono text-red-700">
                {errorEntries.filter((e) => e.mistakeType === 'Concept mistake').length}
              </span>
            </div>
            <p className="text-[10px] text-red-700 mt-0.5">Misunderstanding premise or rule</p>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Knowledge gap</span>
              <span className="text-sm font-bold font-mono text-amber-700">
                {errorEntries.filter((e) => e.mistakeType === 'Knowledge gap').length}
              </span>
            </div>
            <p className="text-[10px] text-amber-700 mt-0.5">Missing fact / vocabulary word</p>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">Silly mistake</span>
              <span className="text-sm font-bold font-mono text-blue-700">
                {errorEntries.filter((e) => e.mistakeType === 'Silly mistake').length}
              </span>
            </div>
            <p className="text-[10px] text-blue-700 mt-0.5">Misread question / bubbled wrong</p>
          </div>

          <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">Time-pressure mistake</span>
              <span className="text-sm font-bold font-mono text-purple-700">
                {errorEntries.filter((e) => e.mistakeType === 'Time-pressure mistake').length}
              </span>
            </div>
            <p className="text-[10px] text-purple-700 mt-0.5">Rushed guessing at section end</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="p-1.5 rounded-md border border-slate-300 font-medium"
          >
            <option value="all">All Subjects</option>
            <option value="English">English</option>
            <option value="Logical Reasoning">Logical Reasoning</option>
            <option value="Current Affairs & GK">Current Affairs & GK</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1.5 rounded-md border border-slate-300 font-medium"
          >
            <option value="all">All Mistake Types</option>
            <option value="Concept mistake">Concept mistakes</option>
            <option value="Knowledge gap">Knowledge gaps</option>
            <option value="Silly mistake">Silly mistakes</option>
            <option value="Time-pressure mistake">Time-pressure mistakes</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 rounded-md border border-slate-300 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="due">Due for Reattempt ({dueCount})</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-300 focus:outline-hidden focus:border-slate-800"
          />
        </div>
      </div>

      {/* Main Table: PDF Columns: Date, Question/Topic, Subject, Type, Why Wrong, Correct Concept, Reattempt */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Logged Mistake Records ({filteredEntries.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {dueCount} due for reattempt today
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No error entries match current filter.</p>
            <p className="mt-1">
              Add incorrect questions from test result analysis, or log questions manually.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Question / Topic</th>
                  <th className="py-3 px-2">Subject</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-3">Why Wrong</th>
                  <th className="py-3 px-3">Correct Concept</th>
                  <th className="py-3 px-3 text-center">Reattempt</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => {
                  const isDue = entry.reattemptDate <= currentDate && entry.reattemptStatus !== 'resolved';
                  return (
                    <tr
                      key={entry.id}
                      className={`hover:bg-slate-50/70 transition ${
                        isDue ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap align-top">
                        {entry.date}
                      </td>

                      {/* Question / Topic */}
                      <td className="py-3 px-3 align-top max-w-xs">
                        <span className="font-semibold text-slate-900 block truncate">
                          {entry.topic}
                        </span>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {entry.questionText}
                        </p>
                      </td>

                      {/* Subject */}
                      <td className="py-3 px-2 align-top whitespace-nowrap text-slate-700 font-medium">
                        {entry.subject}
                      </td>

                      {/* Mistake Type */}
                      <td className="py-3 px-2 align-top whitespace-nowrap">
                        <MistakeBadge type={entry.mistakeType} size="sm" />
                      </td>

                      {/* Why Wrong */}
                      <td className="py-3 px-3 align-top max-w-xs text-slate-700">
                        {entry.whyWrong}
                      </td>

                      {/* Correct Concept */}
                      <td className="py-3 px-3 align-top max-w-xs text-slate-800 bg-slate-50/60 rounded">
                        {entry.correctConcept}
                      </td>

                      {/* Reattempt */}
                      <td className="py-3 px-3 align-top text-center whitespace-nowrap">
                        {entry.reattemptStatus === 'resolved' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Resolved
                          </span>
                        ) : isDue ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" /> Due Today
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            Due {entry.reattemptDate}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-2 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedEntryForReattempt(entry)}
                            className="px-2.5 py-1 rounded bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800 transition"
                          >
                            Reattempt
                          </button>
                          {!entry.isArchived && (
                            <button
                              onClick={() => archiveErrorEntry(entry.id)}
                              title="Archive entry (never deletes)"
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AddErrorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Reattempt Modal */}
      <ReattemptModal
        isOpen={Boolean(selectedEntryForReattempt)}
        onClose={() => setSelectedEntryForReattempt(null)}
        entry={selectedEntryForReattempt}
      />
    </div>
  );
};

// src/components/ca/CurrentAffairsView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CACategory, CurrentAffairItem } from '../../types/ca';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { AddCAModal } from './AddCAModal';
import { SAMPLE_CA_IMPORT_TEMPLATE } from '../../data/sampleCAImport';
import {
  Newspaper,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Star,
  CheckCircle2,
  Download,
  Upload,
  Calendar,
  Sparkles,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export const CurrentAffairsView: React.FC = () => {
  const { currentAffairs, addCurrentAffair, updateCATracker, deleteCurrentAffair } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyImportant, setOnlyImportant] = useState(false);
  const [rapidRevisionMode, setRapidRevisionMode] = useState(false);

  const filteredItems = currentAffairs.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (onlyImportant && !item.isImportantEvent) return false;
    return true;
  });

  const handleImportSampleTemplate = () => {
    for (const sample of SAMPLE_CA_IMPORT_TEMPLATE) {
      if (sample.topic && sample.summary) {
        addCurrentAffair({
          date: sample.date || '2026-10-01',
          topic: sample.topic,
          category: sample.category || 'National',
          summary: sample.summary,
          keyFacts: sample.keyFacts || [],
          source: sample.source || 'Verified Supreme Court Record',
          sourceDate: sample.sourceDate || '2024-08-01',
          relatedExamTopic: sample.relatedExamTopic || 'Polity / Judiciary',
          status: 'VERIFIED',
          isImportantEvent: true,
          tracker: sample.tracker || {
            read: true,
            notesCreated: true,
            mcqsPracticed: false,
            rev1Done: false,
            rev2Done: false,
            finalPassDone: false,
          },
        });
      }
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'National', label: 'National' },
    { id: 'International', label: 'International' },
    { id: 'Economy', label: 'Economy' },
    { id: 'Science & Technology', label: 'Science & Tech' },
    { id: 'Environment', label: 'Environment' },
    { id: 'Sports', label: 'Sports' },
    { id: 'Awards & Culture', label: 'Awards & Culture' },
    { id: 'Static GK', label: 'Static GK' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Current Affairs & GK Operating System
              </h2>
              <OfficialRecommendedTag type="official" label="30 Questions / 30 Marks" />
              <OfficialRecommendedTag type="recommended" label="PDF CA Tracking Columns" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              <strong>Ground Rule:</strong> Never fabricate current affairs. All entries require checkable sources and publication dates for <code>VERIFIED</code> status. Tracker logs all 6 PDF stages: Read, Notes, MCQs, Rev 1, Rev 2, Final Pass.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setRapidRevisionMode(!rapidRevisionMode)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                rapidRevisionMode
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              <span>Rapid Revision Mode</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyImportant(!onlyImportant)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
            onlyImportant
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
              : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${onlyImportant ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
          <span>High-Yield Only</span>
        </button>
      </div>

      {/* Main Content Area */}
      {currentAffairs.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-xl mx-auto shadow-2xs">
          <Newspaper className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Current Affairs Module Ships Empty
          </h3>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Per the AILET OS Ground Rules, zero fake news or fabricated current events are shipped. Add your verified daily news notes or import authentic compilation files below.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              Add First Verified Entry
            </button>
            <button
              onClick={handleImportSampleTemplate}
              className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition"
            >
              Load Verified Sample Template
            </button>
          </div>
        </div>
      ) : (
        /* PDF Tracker Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                PDF Current Affairs Tracker ({filteredItems.length})
              </h3>
              <OfficialRecommendedTag type="recommended" label="PDF Columns: Read, Notes, MCQs, Rev1, Rev2, Final" size="sm" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Topic / Summary</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Status & Source</th>
                  <th className="py-3 px-2 text-center">Read</th>
                  <th className="py-3 px-2 text-center">Notes</th>
                  <th className="py-3 px-2 text-center">MCQs</th>
                  <th className="py-3 px-2 text-center text-amber-800">Rev 1</th>
                  <th className="py-3 px-2 text-center text-indigo-800">Rev 2</th>
                  <th className="py-3 px-2 text-center text-emerald-800">Final</th>
                  <th className="py-3 px-2 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isVerified = item.status === 'VERIFIED';
                  const isOutdated = item.sourceDate && item.sourceDate < '2025-12-13';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap align-top">
                        {item.date}
                      </td>

                      <td className="py-3 px-3 align-top max-w-sm">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {item.isImportantEvent && (
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                          )}
                          <span className="font-semibold text-slate-900 line-clamp-1">
                            {item.topic}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{item.summary}</p>
                      </td>

                      <td className="py-3 px-2 align-top whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-2 align-top max-w-xs">
                        <div className="flex items-center gap-1 mb-0.5">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                              <ShieldCheck className="w-3 h-3" /> VERIFIED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                              PRACTICE
                            </span>
                          )}
                          {isOutdated && (
                            <span className="text-[10px] text-rose-600 font-semibold">
                              (May be outdated)
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {item.source} ({item.sourceDate})
                        </p>
                      </td>

                      {/* 6 PDF Tracker Checkboxes */}
                      <td className="py-3 px-2 text-center align-top">
                        <input
                          type="checkbox"
                          checked={item.tracker.read}
                          onChange={(e) => updateCATracker(item.id, 'read', e.target.checked)}
                          className="w-4 h-4 rounded text-slate-900"
                        />
                      </td>

                      <td className="py-3 px-2 text-center align-top">
                        <input
                          type="checkbox"
                          checked={item.tracker.notesCreated}
                          onChange={(e) =>
                            updateCATracker(item.id, 'notesCreated', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-slate-900"
                        />
                      </td>

                      <td className="py-3 px-2 text-center align-top">
                        <input
                          type="checkbox"
                          checked={item.tracker.mcqsPracticed}
                          onChange={(e) =>
                            updateCATracker(item.id, 'mcqsPracticed', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-slate-900"
                        />
                      </td>

                      <td className="py-3 px-2 text-center align-top">
                        <input
                          type="checkbox"
                          checked={item.tracker.rev1Done}
                          onChange={(e) =>
                            updateCATracker(item.id, 'rev1Done', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-amber-600"
                          title="Weekly Revision Done"
                        />
                      </td>

                      <td className="py-3 px-2 text-center align-top">
                        <input
                          type="checkbox"
                          checked={item.tracker.rev2Done}
                          onChange={(e) =>
                            updateCATracker(item.id, 'rev2Done', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-indigo-600"
                          title="Monthly Revision Done"
                        />
                      </td>

                      <td className="py-3 px-2 text-center align-top">
                        <input
                          type="checkbox"
                          checked={item.tracker.finalPassDone}
                          onChange={(e) =>
                            updateCATracker(item.id, 'finalPassDone', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-emerald-600"
                          title="Final Phase Rapid Pass Done"
                        />
                      </td>

                      <td className="py-3 px-2 text-right align-top">
                        <button
                          onClick={() => deleteCurrentAffair(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <AddCAModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

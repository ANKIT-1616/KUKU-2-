// src/components/settings/SettingsView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamConfig } from '../../types/exam';
import { OfficialRecommendedTag } from '../common/OfficialRecommendedTag';
import { StorageRepository } from '../../services/storageRepository';
import {
  Settings,
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Save,
  AlertTriangle,
  ExternalLink,
  Check,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    examConfig,
    updateExamConfig,
    settings,
    updateSettings,
    resetAllData,
  } = useApp();

  const [jsonConfigText, setJsonConfigText] = useState(() =>
    JSON.stringify(examConfig, null, 2)
  );
  const [configSaveStatus, setConfigSaveStatus] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const handleSaveExamConfig = () => {
    try {
      const parsed: ExamConfig = JSON.parse(jsonConfigText);
      if (!parsed.examDate || !parsed.markingScheme || !Array.isArray(parsed.sections)) {
        throw new Error('Invalid config schema: missing examDate, markingScheme, or sections.');
      }
      updateExamConfig(parsed);
      setConfigError(null);
      setConfigSaveStatus('Exam configuration successfully saved!');
      setTimeout(() => setConfigSaveStatus(null), 3000);
    } catch (err: any) {
      setConfigError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleExportBackup = () => {
    const backupJson = StorageRepository.exportFullBackup();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(backupJson);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `ailet2027_full_backup_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageRepository.importFullBackup(content);
      if (res.success) {
        alert('Backup successfully imported! Reloading state...');
        window.location.reload();
      } else {
        alert(`Failed to import backup: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'WARNING: This will reset all your mock attempts, error notebook entries, and study plans to default state. Are you completely sure?'
      )
    ) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Settings & Exam Configuration
              </h2>
              <OfficialRecommendedTag type="official" label="Editable ExamConfig" />
              <OfficialRecommendedTag type="recommended" label="Local-First Storage" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              All official exam facts (sections, scoring, timing, dates) reside in a single editable JSON configuration. If official notifications from NLU Delhi change any pattern facts, you can update them immediately here without altering code.
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Study Preferences & Simulations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">OMR Practice Mode</span>
              <span className="text-[11px] text-slate-500">
                Triggers bubbling alerts 8 minutes before test completion
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.omrPracticePromptEnabled}
                onChange={(e) =>
                  updateSettings({ omrPracticePromptEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-slate-900"
              />
            </label>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Daily Study Goal</span>
              <span className="text-[11px] text-slate-500">
                Target hours per normal preparation day
              </span>
            </div>
            <select
              value={settings.dailyStudyHoursGoal}
              onChange={(e) =>
                updateSettings({ dailyStudyHoursGoal: Number(e.target.value) })
              }
              className="p-1.5 rounded border border-slate-300 font-mono font-bold"
            >
              <option value="5.5">5.5 Hours</option>
              <option value="6.0">6.0 Hours</option>
              <option value="7.0">7.0 Hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Editable ExamConfig JSON Editor */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Editable ExamConfig (JSON)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Source of truth for scoring, section count, marks, and dates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://nationallawuniversitydelhi.in"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
            >
              <span>Verify Official Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {configSaveStatus && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{configSaveStatus}</span>
          </div>
        )}

        {configError && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{configError}</span>
          </div>
        )}

        <div>
          <textarea
            rows={14}
            value={jsonConfigText}
            onChange={(e) => setJsonConfigText(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-lg border border-slate-300 bg-slate-950 text-emerald-400 focus:outline-hidden"
            spellCheck={false}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Validated against NLU Delhi official pattern (150Q / 150M / 120min / -0.25 penalty)
          </span>

          <button
            onClick={handleSaveExamConfig}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Apply ExamConfig</span>
          </button>
        </div>
      </div>

      {/* Backup and Data Reset */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Backup, Restore & Reset
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-800 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full Backup (JSON)</span>
            </button>

            <label className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-800 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore from Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold border border-rose-200 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

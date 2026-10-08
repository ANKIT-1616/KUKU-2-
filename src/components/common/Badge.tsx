// src/components/common/Badge.tsx
import React from 'react';
import { PriorityLevel } from '../../types/syllabus';
import { MistakeType } from '../../types/exam';
import { AlertCircle, AlertTriangle, Clock, Zap } from 'lucide-react';

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  switch (priority) {
    case 'VERY HIGH':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          VERY HIGH
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          LOW
        </span>
      );
    case 'AVOID':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-300">
          AVOID (Not in Exam)
        </span>
      );
  }
};

/**
 * Mistake Type Badge with AA-contrast icons and labels (not relying on color alone)
 */
export const MistakeBadge: React.FC<{ type: MistakeType; size?: 'sm' | 'md' }> = ({
  type,
  size = 'sm',
}) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  switch (type) {
    case 'Concept mistake':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded font-medium bg-red-100 text-red-900 border border-red-300 ${pad}`}
        >
          <AlertCircle className={iconSize} aria-hidden="true" />
          <span>Concept mistake</span>
        </span>
      );
    case 'Knowledge gap':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded font-medium bg-amber-100 text-amber-900 border border-amber-300 ${pad}`}
        >
          <AlertTriangle className={iconSize} aria-hidden="true" />
          <span>Knowledge gap</span>
        </span>
      );
    case 'Silly mistake':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded font-medium bg-blue-100 text-blue-900 border border-blue-300 ${pad}`}
        >
          <Zap className={iconSize} aria-hidden="true" />
          <span>Silly mistake</span>
        </span>
      );
    case 'Time-pressure mistake':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded font-medium bg-purple-100 text-purple-900 border border-purple-300 ${pad}`}
        >
          <Clock className={iconSize} aria-hidden="true" />
          <span>Time-pressure mistake</span>
        </span>
      );
  }
};

// src/components/common/OfficialRecommendedTag.tsx
import React from 'react';
import { ShieldCheck, Compass, Sparkles } from 'lucide-react';

interface Props {
  type: 'official' | 'recommended' | 'addition' | 'sample';
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const OfficialRecommendedTag: React.FC<Props> = ({
  type,
  label,
  className = '',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (type === 'official') {
    return (
      <span
        title="Official NLU Delhi Exam Fact (Verified against nationallawuniversitydelhi.in)"
        className={`inline-flex items-center gap-1 font-semibold rounded border border-blue-200 bg-blue-50 text-blue-800 ${sizeClasses} ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
        <span>{label || 'OFFICIAL'}</span>
      </span>
    );
  }

  if (type === 'recommended') {
    return (
      <span
        title="Preparation recommendation inferred from past papers and student's planner PDF"
        className={`inline-flex items-center gap-1 font-medium rounded border border-amber-200 bg-amber-50 text-amber-900 ${sizeClasses} ${className}`}
      >
        <Compass className="w-3.5 h-3.5 text-amber-700" />
        <span>{label || 'RECOMMENDED'}</span>
      </span>
    );
  }

  if (type === 'addition') {
    return (
      <span
        title="Product Design Addition designed for preparation excellence"
        className={`inline-flex items-center gap-1 font-medium rounded border border-purple-200 bg-purple-50 text-purple-900 ${sizeClasses} ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-purple-700" />
        <span>{label || 'Product design addition'}</span>
      </span>
    );
  }

  return (
    <span
      title="Sample demonstrator content — not official, not a past year question"
      className={`inline-flex items-center gap-1 font-medium rounded border border-slate-200 bg-slate-100 text-slate-700 ${sizeClasses} ${className}`}
    >
      <span>{label || 'SAMPLE'}</span>
    </span>
  );
};

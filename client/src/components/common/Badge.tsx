import React from 'react';
import { CONDITION_LABELS } from '../../utils/constants.js';
import { ListingCondition } from '../../types/index.js';

export const ConditionBadge: React.FC<{ condition: ListingCondition; size?: 'sm' | 'md' }> = ({
  condition,
  size = 'md',
}) => {
  const info = CONDITION_LABELS[condition] || {
    label: condition,
    color: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${info.color} ${sizeClasses} tracking-wide backdrop-blur-sm`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {info.label}
    </span>
  );
};

export const VerifiedDtuBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium ${sizeClasses}`}
    >
      <span>🎓</span>
      <span>DTU Verified</span>
    </span>
  );
};

export const CampusLocationBadge: React.FC<{ location?: string | null }> = ({ location }) => {
  if (!location) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium truncate">
      <span className="text-campus-pink">📍</span>
      <span className="truncate">{location}</span>
    </span>
  );
};

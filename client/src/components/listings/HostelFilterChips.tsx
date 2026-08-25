import React from 'react';
import { Building2, Home } from 'lucide-react';
import { DTU_HOSTELS } from '../../utils/constants.js';

interface HostelFilterChipsProps {
  selectedHostel: string;
  onSelectHostel: (hostel: string) => void;
}

export const HostelFilterChips: React.FC<HostelFilterChipsProps> = ({
  selectedHostel,
  onSelectHostel,
}) => {
  const chips = [
    { label: 'All Hostels', value: '' },
    ...DTU_HOSTELS.map((h) => ({ label: h.replace(' Hostel', ''), value: h })),
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-0.5">
        {chips.map((chip) => {
          const isSelected = selectedHostel === chip.value;
          return (
            <button
              key={chip.value || 'all'}
              onClick={() => onSelectHostel(chip.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                isSelected
                  ? 'bg-campus-lime text-black shadow-glow font-bold scale-[1.02]'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {chip.value === '' ? (
                <Home size={13} className={isSelected ? 'text-black' : 'text-slate-500'} />
              ) : (
                <Building2 size={13} className={isSelected ? 'text-black' : 'text-slate-500'} />
              )}
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

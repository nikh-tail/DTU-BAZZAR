import React from 'react';
import { SUB_CATEGORIES_PILLS } from '../../utils/constants.js';

interface SubCategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const SubCategoryChips: React.FC<SubCategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Sub-Categories
        </h3>
        <span className="text-[11px] text-slate-400 hidden sm:inline">Scroll horizontally ➔</span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {SUB_CATEGORIES_PILLS.map((pill, idx) => {
          const isActive = selectedCategory === pill.category;
          return (
            <button
              key={idx}
              onClick={() => onSelectCategory(pill.category)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                isActive
                  ? 'bg-campus-lime text-slate-950 border-campus-lime shadow-glow scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <span className="text-base">{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

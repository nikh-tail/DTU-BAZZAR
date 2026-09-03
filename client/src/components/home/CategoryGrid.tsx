import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Sparkles, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants.js';

interface CategoryGridProps {
  selectedCategory?: string;
  onSelectCategory: (categoryId: string) => void;
  onViewAll?: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory = 'ALL',
  onSelectCategory,
  onViewAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Exactly 4 primary categories shown by default (like SharePal reference), or all 7 when expanded
  const displayCategories = isExpanded ? CATEGORIES : CATEGORIES.slice(0, 4);
  const remainingCount = CATEGORIES.length - 4;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-14">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Campus Categories
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-100 text-lime-900 border border-lime-300 font-bold hidden sm:inline-block">
            4 Core Hubs
          </span>
        </div>

        {/* Quick-access "All Items" filter pill */}
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-campus-lime text-slate-950 border-lime-300 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
          }`}
        >
          <Sparkles size={12} className={selectedCategory === 'ALL' ? 'text-slate-950' : 'text-amber-500'} />
          <span>All Items</span>
        </button>
      </div>

      {/* 4-Category Card Grid (SharePal Inspired: 2x2 on Mobile, 4 in 1 Row on Desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative bg-white border ${
                isSelected
                  ? 'border-slate-900 ring-2 ring-campus-lime shadow-md'
                  : 'border-[#EAEAEA] hover:border-slate-300 hover:shadow-xl hover:-translate-y-1'
              } rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer group aspect-[4/5] sm:aspect-[4/4.8] shadow-sm`}
            >
              {/* 1 & 2. Card Header Area with Smooth CSS Background Fill / Color Reveal */}
              <div
                className={`p-3.5 sm:p-4 z-10 transition-all duration-300 ease-out bg-white ${cat.headerHoverBg}`}
              >
                <h4 className="font-black text-[#1A1A1A] group-hover:text-white transition-colors duration-300 text-sm sm:text-base leading-snug">
                  {cat.name}
                </h4>
                <p className="text-[10.5px] sm:text-xs text-[#6B6B6B] group-hover:text-white/90 transition-colors duration-300 line-clamp-1 mt-0.5 font-medium leading-tight">
                  {cat.subtitle}
                </p>
              </div>

              {/* 3. Representative Product Image (Fills lower two-thirds) */}
              <div className="relative flex-1 w-full overflow-hidden flex items-end justify-center px-2 pb-2 bg-white">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full max-h-[130px] sm:max-h-[160px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* 4. Solid Colored Bottom Accent Strip (8-10px height, rounded bottom corners) */}
              <div
                className={`w-full h-2 sm:h-2.5 ${cat.stripColor} rounded-b-3xl flex-shrink-0 transition-opacity`}
              />
            </div>
          );
        })}
      </div>

      {/* Small Button to See All Categories */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs shadow-sm active:scale-95 transition-all"
        >
          <LayoutGrid size={13} className="text-emerald-600" />
          <span>
            {isExpanded
              ? 'Show 4 Main Categories'
              : `See All Categories (+${remainingCount} More)`}
          </span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors py-2 px-3 rounded-full hover:bg-slate-100"
          >
            <span>Explore in Marketplace</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </section>
  );
};

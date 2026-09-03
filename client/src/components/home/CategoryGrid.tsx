import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
  // Show top 6 categories in 2-column grid (3 rows on mobile), matching SharePal structure
  const displayCategories = CATEGORIES.slice(0, 6);
  const remainingCount = CATEGORIES.length - 6;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-14">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Campus Categories
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-100 text-lime-900 border border-lime-300 font-bold hidden sm:inline-block">
            DTU Gear
          </span>
        </div>

        {/* Quick-access "All Items" filter pill */}
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-campus-lime text-slate-950 border-campus-lime shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <Sparkles size={12} className={selectedCategory === 'ALL' ? 'text-slate-950' : 'text-amber-500'} />
          <span>All Items</span>
        </button>
      </div>

      {/* 2-Column Category Card Grid (SharePal Inspired) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative bg-white border ${
                isSelected
                  ? 'border-slate-900 ring-2 ring-campus-lime shadow-md'
                  : 'border-[#EAEAEA] hover:border-slate-300 hover:shadow-md'
              } rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer group aspect-[4/5] sm:aspect-[4/4.5]`}
              style={{
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* 1 & 2. Card Header: Title & Subtitle */}
              <div className="p-3.5 sm:p-4 z-10">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[10.5px] sm:text-xs text-[#6B6B6B] line-clamp-1 mt-0.5 font-medium leading-tight">
                  {cat.subtitle}
                </p>
              </div>

              {/* 3. Representative Product Image (Fills lower two-thirds) */}
              <div className="relative flex-1 w-full overflow-hidden flex items-end justify-center px-2 pb-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full max-h-[140px] sm:max-h-[160px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* 4. Solid Colored Bottom Accent Strip (8-10px height, rounded bottom corners) */}
              <div
                className={`w-full h-2.5 sm:h-3 ${cat.stripColor} rounded-b-3xl flex-shrink-0 transition-opacity`}
              />
            </div>
          );
        })}
      </div>

      {/* View All Categories Footer Link */}
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => (onViewAll ? onViewAll() : onSelectCategory('ALL'))}
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors py-1 px-3 rounded-full hover:bg-slate-100"
        >
          <span>View All Categories {remainingCount > 0 ? `(+${remainingCount} More)` : ''}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

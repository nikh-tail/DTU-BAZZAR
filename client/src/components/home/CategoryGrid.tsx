import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants.js';

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  // Take top 4 prominent categories for the SharePal 4-across tile layout
  const topCategories = CATEGORIES.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Explore Campus Categories</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-campus-lime/20 text-campus-lime font-bold">
              Instant DTU Deals
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Everything you need for hostels, labs, semesters & sports
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {topCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`relative group cursor-pointer overflow-hidden rounded-3xl border border-slate-800 ${cat.bgGradient} p-5 transition-all duration-300 hover:scale-[1.02] hover:border-slate-600 hover:shadow-2xl flex flex-col justify-between min-h-[220px]`}
          >
            {/* Top Text Info */}
            <div className="z-10 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{cat.icon}</span>
                <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-slate-300 group-hover:bg-campus-lime group-hover:text-black group-hover:border-campus-lime transition-all">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-campus-lime transition-colors leading-snug">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-[180px]">
                {cat.subtitle}
              </p>
            </div>

            {/* Bleeding product image on bottom right */}
            <div className="relative mt-4 self-end w-32 h-28 sm:w-36 sm:h-32 -mr-3 -mb-3 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

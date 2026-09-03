import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants.js';

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-14 sm:mb-16">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Explore Campus Categories</span>
            <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-900 font-bold border border-lime-300">
              Instant DTU Deals
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Everything you need for hostels, labs, semesters, sports & fashion
          </p>
        </div>
      </div>

      {/* Mobile: Horizontal Swipeable Carousel | Tablet/Desktop: Responsive Grid */}
      <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`min-w-[240px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink relative group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 ${cat.bgGradient} p-5 transition-all duration-300 hover:scale-[1.02] hover:border-slate-300 hover:shadow-xl flex flex-col justify-between min-h-[200px] sm:min-h-[220px] shadow-sm`}
          >
            {/* Top Text Info */}
            <div className="z-10 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{cat.icon}</span>
                <div className="w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-campus-lime group-hover:text-black group-hover:border-campus-lime transition-all shadow-sm">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 max-w-[180px] font-medium">
                {cat.subtitle}
              </p>
            </div>

            {/* Bleeding product image on bottom right */}
            <div className="relative mt-3 self-end w-28 h-24 sm:w-36 sm:h-32 -mr-3 -mb-3 rounded-2xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { CATEGORIES, DTU_HOSTELS, CONDITION_LABELS } from '../../utils/constants.js';
import { ListingCondition } from '../../types/index.js';

interface FiltersState {
  category: string;
  condition: string;
  campusLocation: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

interface ListingFiltersProps {
  filters: FiltersState;
  onChange: (newFilters: Partial<FiltersState>) => void;
  onReset: () => void;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const selectedConditions = filters.condition ? filters.condition.split(',') : [];

  const toggleCondition = (cond: ListingCondition) => {
    let updated: string[];
    if (selectedConditions.includes(cond)) {
      updated = selectedConditions.filter((c) => c !== cond);
    } else {
      updated = [...selectedConditions, cond];
    }
    onChange({ condition: updated.join(',') });
  };

  return (
    <aside className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
          <Filter size={16} className="text-emerald-600" />
          <span>Filters & Sort</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort Listings
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl px-3 py-2.5 outline-none focus:border-campus-lime transition-all"
        >
          <option value="newest">🕒 Newest First</option>
          <option value="popular">🔥 Most Viewed / Popular</option>
          <option value="price_asc">💵 Price: Low to High</option>
          <option value="price_desc">💎 Price: High to Low</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onChange({ category: 'ALL' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filters.category === 'ALL' || !filters.category
                ? 'bg-campus-lime text-slate-950 shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>⚡ All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.id })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filters.category === cat.id
                  ? 'bg-campus-lime text-slate-950 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.shortName}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Price Range (₹)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="w-1/2 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 text-xs outline-none focus:border-campus-lime font-medium"
          />
          <span className="text-slate-400 text-xs">—</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="w-1/2 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 text-xs outline-none focus:border-campus-lime font-medium"
          />
        </div>
      </div>

      {/* Item Condition */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Condition
        </label>
        <div className="space-y-1.5">
          {(Object.keys(CONDITION_LABELS) as ListingCondition[]).map((cond) => {
            const isChecked = selectedConditions.includes(cond);
            return (
              <label
                key={cond}
                onClick={() => toggleCondition(cond)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                  isChecked
                    ? 'bg-slate-100 border-slate-400 text-slate-950'
                    : 'border-transparent text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{CONDITION_LABELS[cond].label}</span>
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    isChecked
                      ? 'bg-campus-lime border-campus-lime text-slate-950'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check size={12} className="stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Hostel / Campus Spot */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Hostel / Campus Spot
        </label>
        <select
          value={filters.campusLocation}
          onChange={(e) => onChange({ campusLocation: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl px-3 py-2.5 outline-none focus:border-campus-lime transition-all"
        >
          <option value="ALL">📍 All DTU Campus Locations</option>
          {DTU_HOSTELS.map((hostel, i) => (
            <option key={i} value={hostel}>
              {hostel}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};

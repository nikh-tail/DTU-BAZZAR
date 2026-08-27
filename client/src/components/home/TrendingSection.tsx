import React from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { Listing } from '../../types/index.js';
import { ListingCard } from '../listings/ListingCard.js';

interface TrendingSectionProps {
  listings: Listing[];
  onSelectListing: (id: string) => void;
  onViewAll: () => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  listings,
  onSelectListing,
  onViewAll,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Flame size={20} className="fill-orange-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Trending Campus Finds
            </h2>
            <p className="text-xs text-slate-400">
              Most active gear listed by DTU hostelers & day scholars
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-campus-lime hover:text-campus-lime-hover transition-colors"
        >
          <span>View All Listings</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid: strictly 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {listings.slice(0, 8).map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onClick={() => onSelectListing(listing.id)}
          />
        ))}
      </div>
    </section>
  );
};

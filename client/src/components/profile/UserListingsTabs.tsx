import React, { useState } from 'react';
import { Package, CheckCircle, Heart, Trash2, Edit3, CheckCheck, Eye } from 'lucide-react';
import { Listing } from '../../types/index.js';
import { formatPrice, formatTimeAgo } from '../../utils/formatters.js';
import { ConditionBadge } from '../common/Badge.js';
import { Button } from '../common/Button.js';
import { EmptyState } from '../common/EmptyState.js';
import { ListingService } from '../../services/listing.service.js';

interface UserListingsTabsProps {
  activeListings: Listing[];
  soldListings: Listing[];
  savedListings: Listing[];
  onSelectListing: (id: string) => void;
  onEditListing?: (listing: Listing) => void;
  onRefresh: () => void;
  initialTab?: 'active' | 'sold' | 'saved';
}

export const UserListingsTabs: React.FC<UserListingsTabsProps> = ({
  activeListings,
  soldListings,
  savedListings,
  onSelectListing,
  onEditListing,
  onRefresh,
  initialTab = 'active',
}) => {
  const [tab, setTab] = useState<'active' | 'sold' | 'saved'>(initialTab);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleMarkAsSold = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setActionLoadingId(id);
      await ListingService.markAsSold(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    try {
      setActionLoadingId(id);
      await ListingService.deleteListing(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            tab === 'active'
              ? 'bg-campus-lime text-black shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Package size={15} />
          <span>Active Listings ({activeListings.length})</span>
        </button>

        <button
          onClick={() => setTab('sold')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            tab === 'sold'
              ? 'bg-campus-lime text-black shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CheckCircle size={15} />
          <span>Sold Items ({soldListings.length})</span>
        </button>

        <button
          onClick={() => setTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            tab === 'saved'
              ? 'bg-campus-pink text-white shadow-glow-pink'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Heart size={15} />
          <span>Saved Wishlist ({savedListings.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'active' && (
        <>
          {activeListings.length === 0 ? (
            <EmptyState
              title="No active listings"
              description="You haven't listed any items for sale yet. Post your unused books, cycles, coolers or gadgets!"
              actionText="+ Sell an Item Now"
              onAction={() => {}}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => onSelectListing(listing.id)}
                  className="bg-campus-card border border-slate-800 hover:border-slate-700 rounded-3xl p-4 sm:p-5 flex gap-4 cursor-pointer group transition-all"
                >
                  <img
                    src={
                      listing.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&auto=format&fit=crop&q=80'
                    }
                    alt={listing.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <ConditionBadge condition={listing.condition} size="sm" />
                        <span className="text-[10px] text-slate-500">
                          {formatTimeAgo(listing.createdAt)}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-campus-lime transition-colors">
                        {listing.title}
                      </h4>
                      <p className="text-base font-black text-campus-lime mt-1">
                        {formatPrice(listing.price)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 mt-2">
                      <button
                        onClick={(e) => handleMarkAsSold(e, listing.id)}
                        disabled={actionLoadingId === listing.id}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-campus-lime hover:text-black text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                      >
                        <CheckCheck size={13} />
                        <span>Mark Sold</span>
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, listing.id)}
                        disabled={actionLoadingId === listing.id}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'sold' && (
        <>
          {soldListings.length === 0 ? (
            <EmptyState
              title="No sold items yet"
              description="Items you mark as sold will be stored here for your campus trading track record."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {soldListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => onSelectListing(listing.id)}
                  className="bg-campus-card/60 border border-slate-800/80 rounded-3xl p-4 sm:p-5 flex gap-4 cursor-pointer opacity-80 hover:opacity-100 transition-all"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={
                        listing.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={listing.title}
                      className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px] uppercase">
                        Sold
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">
                        {listing.title}
                      </h4>
                      <p className="text-base font-black text-slate-400 mt-1">
                        {formatPrice(listing.price)}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Location: {listing.campusLocation || 'DTU Campus'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs text-emerald-400 font-semibold">
                      <CheckCircle size={14} />
                      <span>Deal Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'saved' && (
        <>
          {savedListings.length === 0 ? (
            <EmptyState
              title="No saved items in wishlist"
              description="Click the heart icon on any listing to bookmark it and monitor price updates."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => onSelectListing(listing.id)}
                  className="bg-campus-card border border-slate-800 rounded-3xl p-4 cursor-pointer hover:border-campus-pink/50 transition-all flex flex-col justify-between group"
                >
                  <img
                    src={
                      listing.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&auto=format&fit=crop&q=80'
                    }
                    alt={listing.title}
                    className="w-full aspect-[4/3] rounded-2xl object-cover mb-3"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-campus-pink transition-colors">
                      {listing.title}
                    </h4>
                    <p className="text-base font-black text-white mt-1">
                      {formatPrice(listing.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

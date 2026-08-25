import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Eye, Share2, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { Listing } from '../types/index.js';
import { ListingService } from '../services/listing.service.js';
import { ListingGallery } from '../components/listings/ListingGallery.js';
import { QuickActionBox } from '../components/listings/QuickActionBox.js';
import { ListingCard } from '../components/listings/ListingCard.js';
import { ConditionBadge, CampusLocationBadge } from '../components/common/Badge.js';
import { formatPrice, formatTimeAgo, getCategoryBadge } from '../utils/formatters.js';

interface ListingDetailPageProps {
  listingId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listingId,
  onNavigate,
}) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [relatedListings, setRelatedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await ListingService.getListingById(listingId);
        if (res.success && res.data) {
          setListing(res.data);
          setRelatedListings(res.related || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [listingId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[450px] rounded-3xl bg-slate-900 animate-pulse" />
          <div className="h-[450px] rounded-3xl bg-slate-900 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Listing not found</h2>
        <p className="text-slate-400 text-sm mb-6">This campus listing may have been sold or removed by the seller.</p>
        <button
          onClick={() => onNavigate('browse')}
          className="px-6 py-2.5 rounded-full bg-campus-lime text-black font-bold text-sm"
        >
          Browse Active Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-campus-lime transition-colors flex-shrink-0"
        >
          Home
        </button>
        <ChevronRight size={13} className="text-slate-600 flex-shrink-0" />
        <button
          onClick={() => onNavigate('browse', { category: listing.category })}
          className="hover:text-campus-lime transition-colors flex-shrink-0"
        >
          {getCategoryBadge(listing.category)}
        </button>
        <ChevronRight size={13} className="text-slate-600 flex-shrink-0" />
        <span className="text-white font-medium truncate max-w-[200px] sm:max-w-md">
          {listing.title}
        </span>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Gallery, Specs & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Multi-Photo Gallery */}
          <ListingGallery images={listing.images} title={listing.title} />

          {/* Title & Metadata Strip */}
          <div className="bg-campus-card border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                  {getCategoryBadge(listing.category)}
                </span>
                <ConditionBadge condition={listing.condition} />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  title="Share listing link"
                >
                  <Share2 size={15} />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {listing.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-campus-pink" />
                <span>{listing.campusLocation || 'DTU Campus'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-campus-lime" />
                <span>Listed {formatTimeAgo(listing.createdAt)}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} className="text-campus-cyan" />
                <span>{listing.viewsCount + 12} Views</span>
              </span>
            </div>
          </div>

          {/* Detailed Item Description */}
          <div className="bg-campus-card border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Item Details & Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block mb-0.5 font-semibold">Campus Handover</span>
                <span className="font-bold text-white">{listing.campusLocation || 'DTU Main Campus'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block mb-0.5 font-semibold">Payment Mode</span>
                <span className="font-bold text-campus-lime">Direct UPI / Cash upon Inspection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Buyer Action Box */}
        <div className="lg:col-span-1">
          <QuickActionBox
            listing={listing}
            onSelectSellerProfile={(sellerId) => onNavigate('profile', { userId: sellerId })}
          />
        </div>
      </div>

      {/* Related Campus Listings Carousel */}
      {relatedListings.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Similar Items in {getCategoryBadge(listing.category)}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedListings.map((rel) => (
              <ListingCard
                key={rel.id}
                listing={rel}
                onClick={() => onNavigate('listing-detail', { id: rel.id })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

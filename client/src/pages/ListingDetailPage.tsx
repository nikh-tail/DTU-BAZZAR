import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Calendar,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  Flame,
  Layers,
  FileText,
} from 'lucide-react';
import { Listing } from '../types/index.js';
import { ListingService } from '../services/listing.service.js';
import { ListingGallery } from '../components/listings/ListingGallery.js';
import { QuickActionBox } from '../components/listings/QuickActionBox.js';
import { ListingCard } from '../components/listings/ListingCard.js';
import { ImageLightbox } from '../components/listings/ImageLightbox.js';
import { MakeOfferModal } from '../components/listings/MakeOfferModal.js';
import { ConditionBadge } from '../components/common/Badge.js';
import { Button } from '../components/common/Button.js';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon.js';
import { formatPrice, formatTimeAgo, getCategoryBadge } from '../utils/formatters.js';
import { useAuth } from '../context/AuthContext.js';
import { useChat } from '../context/ChatContext.js';

interface ListingDetailPageProps {
  listingId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listingId,
  onNavigate,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { startChatWithListing, sendMessage } = useChat();

  const [listing, setListing] = useState<Listing | null>(null);
  const [relatedListings, setRelatedListings] = useState<Listing[]>([]);
  const [trendingListings, setTrendingListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [recTab, setRecTab] = useState<'SIMILAR' | 'TRENDING' | 'LOCATION'>('SIMILAR');
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const recCarouselRef = useRef<HTMLDivElement>(null);

  // Lightbox and Offer Modal States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isMobileChatLoading, setIsMobileChatLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await ListingService.getListingById(listingId);
        if (res.success && res.data) {
          setListing(res.data);
          setRelatedListings(res.related || []);
        }

        // Fetch global trending/recommended campus items
        const allRes = await ListingService.getListings({ limit: 16 });
        if (allRes.success && allRes.data) {
          const others = allRes.data.filter((i: Listing) => i.id !== listingId);
          setTrendingListings(others);
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

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleOpenMakeOffer = () => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
      return;
    }
    setIsOfferModalOpen(true);
  };

  const handleSubmitOffer = async (offeredPrice: number, messageText?: string) => {
    if (!listing) return;
    try {
      await startChatWithListing(listing.id);
      const offerMsg = `🤝 PRICE OFFER: ₹${offeredPrice} (Listed at ₹${listing.price})${
        messageText ? `\nNote: ${messageText}` : ''
      }`;
      await sendMessage(offerMsg);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMobileChat = async () => {
    if (!listing) return;
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
      return;
    }
    try {
      setIsMobileChatLoading(true);
      await startChatWithListing(listing.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMobileChatLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!listing) return;
    const phone = listing.seller.phone?.replace(/\D/g, '') || '919315096256';
    const text = encodeURIComponent(
      `Hi ${listing.seller.name}! I saw your listing on DTU Bazaar: "${listing.title}" (${formatPrice(listing.price)}). Is it still available to meet on campus?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const scrollRecLeft = () => {
    recCarouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRecRight = () => {
    recCarouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[450px] rounded-3xl bg-slate-200 animate-pulse" />
          <div className="h-[450px] rounded-3xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Listing not found</h2>
        <p className="text-slate-500 text-sm mb-6 font-medium">
          This campus listing may have been sold or removed by the seller.
        </p>
        <button
          onClick={() => onNavigate('browse')}
          className="px-6 py-2.5 rounded-full bg-campus-lime text-slate-950 font-black text-sm shadow-glow"
        >
          Browse Active Listings
        </button>
      </div>
    );
  }

  const isOwner = user?.id === listing.sellerId;
  const isSold = listing.status === 'SOLD';

  // Compute recommendation buckets
  const sameLocationListings = trendingListings.filter(
    (item) => item.campusLocation === listing.campusLocation && item.id !== listing.id
  );

  const activeRecommendations =
    recTab === 'SIMILAR'
      ? relatedListings.length > 0
        ? relatedListings
        : trendingListings
      : recTab === 'LOCATION'
      ? sameLocationListings.length > 0
        ? sameLocationListings
        : trendingListings
      : trendingListings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen pb-24 sm:pb-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto no-scrollbar font-medium">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-emerald-700 transition-colors flex-shrink-0 font-semibold"
        >
          Home
        </button>
        <ChevronRight size={13} className="text-slate-400 flex-shrink-0" />
        <button
          onClick={() => onNavigate('browse', { category: listing.category })}
          className="hover:text-emerald-700 transition-colors flex-shrink-0 font-semibold"
        >
          {getCategoryBadge(listing.category)}
        </button>
        <ChevronRight size={13} className="text-slate-400 flex-shrink-0" />
        <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-md">
          {listing.title}
        </span>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Gallery, Specs & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Multi-Photo Gallery with Lightbox support */}
          <ListingGallery
            images={listing.images}
            title={listing.title}
            category={listing.category}
            onOpenLightbox={handleOpenLightbox}
          />

          {/* Title & Metadata Strip */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                  {getCategoryBadge(listing.category)}
                </span>
                <ConditionBadge condition={listing.condition} />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-semibold"
                  title="Share listing link"
                >
                  <Share2 size={15} />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              {listing.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-rose-500" />
                <span>{listing.campusLocation || 'DTU Campus'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-600" />
                <span>Listed {formatTimeAgo(listing.createdAt)}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} className="text-sky-600" />
                <span>{listing.viewsCount + 12} Views</span>
              </span>
            </div>
          </div>

          {/* Detailed Item Description with Click-to-View Toggle */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                  Item Details & Description
                </h3>
              </div>

              <button
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
              >
                <span>{isDetailsExpanded ? 'Hide Details' : 'Show Details'}</span>
                {isDetailsExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {/* Collapsed State: Direct action button to reveal details */}
            {!isDetailsExpanded ? (
              <div className="space-y-3 pt-1">
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {listing.description}
                </p>

                <button
                  onClick={() => setIsDetailsExpanded(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                >
                  <span>Click to See Full Item Details & Specs</span>
                  <ChevronDown size={16} className="text-emerald-700 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              /* Expanded State: Full description and specs */
              <div className="space-y-4 pt-1 animate-fadeIn">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {listing.description}
                </p>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block mb-0.5 font-semibold">Campus Handover</span>
                    <span className="font-bold text-slate-900">
                      {listing.campusLocation || 'DTU Main Campus'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block mb-0.5 font-semibold">Payment Mode</span>
                    <span className="font-bold text-emerald-700">Direct UPI / Cash upon Inspection</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailsExpanded(false)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-2"
                >
                  <span>Hide Details</span>
                  <ChevronUp size={15} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Buyer Action Box */}
        <div className="lg:col-span-1">
          <QuickActionBox
            listing={listing}
            onSelectSellerProfile={(sellerId) => onNavigate('profile', { userId: sellerId })}
            onOpenMakeOffer={handleOpenMakeOffer}
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* 🌟 SCROLLABLE RECOMMENDATIONS CAROUSEL (RIGHT/LEFT)  */}
      {/* ==================================================== */}
      <div className="mt-16 pt-12 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-600 text-lg">💡</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Recommended Campus Deals
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Swipe or scroll horizontally from right to left to explore similar gear & student finds
            </p>
          </div>

          {/* Recommendation Mode Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 self-stretch sm:self-auto overflow-x-auto no-scrollbar shadow-inner">
            <button
              onClick={() => setRecTab('SIMILAR')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                recTab === 'SIMILAR'
                  ? 'bg-campus-lime text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={13} />
              <span>Similar Category</span>
            </button>

            <button
              onClick={() => setRecTab('TRENDING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                recTab === 'TRENDING'
                  ? 'bg-campus-lime text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame size={13} />
              <span>Campus Trending</span>
            </button>

            {sameLocationListings.length > 0 && (
              <button
                onClick={() => setRecTab('LOCATION')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  recTab === 'LOCATION'
                    ? 'bg-campus-lime text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin size={13} />
                <span>Nearby ({listing.campusLocation ? listing.campusLocation.split(' ')[0] : 'Campus'})</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Carousel Wrapper */}
        {activeRecommendations.length > 0 ? (
          <div className="relative group">
            {/* Left Scroll Button */}
            <button
              onClick={scrollRecLeft}
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-300 text-slate-700 hover:text-black hover:bg-slate-50 items-center justify-center shadow-lg transition-all active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Horizontal Scroll Track */}
            <div
              ref={recCarouselRef}
              className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {activeRecommendations.map((rel) => (
                <div
                  key={rel.id}
                  className="min-w-[260px] sm:min-w-[280px] max-w-[280px] snap-start flex-shrink-0 flex flex-col"
                >
                  <ListingCard
                    listing={rel}
                    onClick={() => onNavigate('listing-detail', { id: rel.id })}
                  />
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={scrollRecRight}
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-300 text-slate-700 hover:text-black hover:bg-slate-50 items-center justify-center shadow-lg transition-all active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs font-medium">
            No other active listings found in this section right now.
          </div>
        )}
      </div>

      {/* Fullscreen Photo Lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        images={listing.images}
        initialIndex={lightboxIndex}
        category={listing.category}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Make an Offer Modal */}
      <MakeOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        listingTitle={listing.title}
        originalPrice={listing.price}
        onSubmitOffer={handleSubmitOffer}
      />

      {/* Sticky Mobile Action Bar (1-Thumb Friendly with WhatsApp Icon) */}
      {!isOwner && !isSold && (
        <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 p-3 bg-white/95 border-t border-slate-200/90 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-500">Price</span>
            <span className="text-lg font-black text-slate-950 leading-tight">
              {formatPrice(listing.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleOpenMakeOffer}
              className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform shadow-sm"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Offer</span>
            </button>

            {/* Official WhatsApp Logo Button */}
            <button
              onClick={handleWhatsApp}
              className="p-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#128C7E] text-xs font-bold active:scale-95 transition-transform flex items-center justify-center shadow-sm"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon size={18} className="text-[#25D366]" />
            </button>

            <Button
              variant="lime"
              size="sm"
              onClick={handleMobileChat}
              isLoading={isMobileChatLoading}
              className="shadow-glow font-black text-xs px-4 text-slate-950"
              leftIcon={<MessageCircle size={15} />}
            >
              Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

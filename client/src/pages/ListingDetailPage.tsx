import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Eye, Share2, ShieldCheck, CheckCircle2, ChevronRight, MessageCircle, Sparkles, Phone } from 'lucide-react';
import { Listing } from '../types/index.js';
import { ListingService } from '../services/listing.service.js';
import { ListingGallery } from '../components/listings/ListingGallery.js';
import { QuickActionBox } from '../components/listings/QuickActionBox.js';
import { ListingCard } from '../components/listings/ListingCard.js';
import { ImageLightbox } from '../components/listings/ImageLightbox.js';
import { MakeOfferModal } from '../components/listings/MakeOfferModal.js';
import { ConditionBadge, CampusLocationBadge } from '../components/common/Badge.js';
import { Button } from '../components/common/Button.js';
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
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
    const phone = listing.seller.phone?.replace(/\D/g, '') || '919876543210';
    const text = encodeURIComponent(
      `Hi ${listing.seller.name}! I saw your listing on DTU Bazaar: "${listing.title}" (${formatPrice(listing.price)}). Is it still available to meet on campus?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
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

  const isOwner = user?.id === listing.sellerId;
  const isSold = listing.status === 'SOLD';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen pb-24 sm:pb-8">
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
          {/* Multi-Photo Gallery with Lightbox support */}
          <ListingGallery
            images={listing.images}
            title={listing.title}
            onOpenLightbox={handleOpenLightbox}
          />

          {/* Title & Metadata Strip */}
          <div className="bg-campus-card border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
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
          <div className="bg-campus-card border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
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
            onOpenMakeOffer={handleOpenMakeOffer}
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

      {/* Fullscreen Photo Lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        images={listing.images}
        initialIndex={lightboxIndex}
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

      {/* Sticky Mobile Action Bar (1-Thumb Friendly) */}
      {!isOwner && !isSold && (
        <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 p-3 bg-[#070B14]/95 border-t border-slate-800/90 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Price</span>
            <span className="text-lg font-black text-white leading-tight">
              {formatPrice(listing.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleOpenMakeOffer}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-campus-lime font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Sparkles size={13} />
              <span>Offer</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="p-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold active:scale-95 transition-transform"
              title="Chat on WhatsApp"
            >
              <Phone size={16} className="fill-[#25D366]" />
            </button>

            <Button
              variant="lime"
              size="sm"
              onClick={handleMobileChat}
              isLoading={isMobileChatLoading}
              className="shadow-glow font-black text-xs px-4"
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

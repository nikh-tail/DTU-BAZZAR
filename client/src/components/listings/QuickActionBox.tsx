import React, { useState } from 'react';
import { MessageCircle, Star, Heart, Sparkles } from 'lucide-react';
import { Listing } from '../../types/index.js';
import { formatPrice } from '../../utils/formatters.js';
import { ConditionBadge, VerifiedDtuBadge } from '../common/Badge.js';
import { Button } from '../common/Button.js';
import { WhatsAppIcon } from '../common/WhatsAppIcon.js';
import { useAuth } from '../../context/AuthContext.js';
import { useChat } from '../../context/ChatContext.js';
import { UserService } from '../../services/user.service.js';
import { getImageUrl } from '../../utils/imageUrl.js';

interface QuickActionBoxProps {
  listing: Listing;
  onSelectSellerProfile: (sellerId: string) => void;
  onOpenMakeOffer?: () => void;
}

export const QuickActionBox: React.FC<QuickActionBoxProps> = ({
  listing,
  onSelectSellerProfile,
  onOpenMakeOffer,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { startChatWithListing } = useChat();
  const [isSaved, setIsSaved] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const isOwner = user?.id === listing.sellerId;
  const isSold = listing.status === 'SOLD';

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
      return;
    }
    if (isOwner) return;

    try {
      setIsChatLoading(true);
      await startChatWithListing(listing.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const phone = listing.seller.phone?.replace(/\D/g, '') || '919315096256';
    const text = encodeURIComponent(
      `Hi ${listing.seller.name}! I saw your listing on DTU Bazaar: "${listing.title}" (${formatPrice(listing.price)}). Is it still available to meet on campus?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
      return;
    }
    try {
      setIsSaved(!isSaved);
      await UserService.toggleSaveListing(listing.id);
    } catch {
      setIsSaved(isSaved);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm sticky top-24">
      {/* 1. Price & Condition Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Listed Price
          </span>
          <ConditionBadge condition={listing.condition} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-emerald-700 font-bold">Fixed / Negotiable</span>
        </div>
      </div>

      {/* 2. Action Buttons (Chat with Seller, Make Offer, WhatsApp, Wishlist) */}
      <div className="space-y-2.5">
        {isOwner ? (
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold text-center">
            This is your active listing. You can manage it in your profile dashboard.
          </div>
        ) : isSold ? (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center">
            This item has been marked as Sold.
          </div>
        ) : (
          <>
            {/* Primary: In-App Chat */}
            <Button
              variant="lime"
              size="lg"
              onClick={() => handleStartChat()}
              isLoading={isChatLoading}
              leftIcon={<MessageCircle size={18} className="stroke-[2.5]" />}
              className="w-full shadow-glow font-black text-base text-slate-950"
            >
              Chat with Seller
            </Button>

            {/* Secondary Row: Make Offer & WhatsApp with Official Logo */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenMakeOffer}
                className="py-3 px-3 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>Make Offer</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="py-3 px-3 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/40 hover:bg-[#25D366]/25 text-[#128C7E] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                title="Chat directly on WhatsApp"
              >
                <WhatsAppIcon size={16} className="text-[#25D366]" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleToggleSave}
              className={`w-full py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                isSaved
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <Heart size={14} className={isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-500'} />
              <span>{isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
            </button>
          </>
        )}
      </div>

      {/* 3. Seller Info Mini Card (Positioned BELOW the action buttons) */}
      <div
        onClick={() => onSelectSellerProfile(listing.seller.id)}
        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Seller Info
          </span>
          <div className="flex items-center gap-1.5">
            {listing.seller.isProSeller && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-lime-300 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                Pro 🌟
              </span>
            )}
            <VerifiedDtuBadge size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {listing.seller.avatar ? (
            <img
              src={getImageUrl(listing.seller.avatar)}
              alt={listing.seller.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
              }}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-lime-100 text-lime-900 font-bold text-base flex items-center justify-center border border-lime-300">
              {listing.seller.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
              {listing.seller.name}
            </h4>
            <p className="text-xs text-slate-500 truncate font-medium">
              {listing.seller.branch || 'DTU Engineering'} • {listing.seller.year || 'Student'}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                <span>{listing.seller.rating || 5.0}</span>
              </span>
              <span>•</span>
              <span className="truncate">{listing.seller.hostel || 'DTU Campus'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Eye, MessageCircle, Heart, MapPin } from 'lucide-react';
import { Listing } from '../../types/index.js';
import { formatPrice, formatTimeAgo } from '../../utils/formatters.js';
import { ConditionBadge } from '../common/Badge.js';
import { useAuth } from '../../context/AuthContext.js';
import { useChat } from '../../context/ChatContext.js';
import { UserService } from '../../services/user.service.js';
import { getImageUrl, handleImageError } from '../../utils/imageUrl.js';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
  isSavedInitial?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onClick,
  isSavedInitial = false,
}) => {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const { startChatWithListing } = useChat();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isChatStarting, setIsChatStarting] = useState(false);

  const rawCover = listing.images && listing.images.length > 0 ? listing.images[0].url : null;
  const coverImage = getImageUrl(rawCover, listing.category);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleQuickChat = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
      return;
    }
    if (user?.id === listing.sellerId) {
      onClick();
      return;
    }
    try {
      setIsChatStarting(true);
      await startChatWithListing(listing.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatStarting(false);
    }
  };

  const isSold = listing.status === 'SOLD';

  return (
    <div
      onClick={onClick}
      className="group relative bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer shadow-sm"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={listing.title}
          onError={(e) => handleImageError(e, listing.category)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Gradient overlay on top for location pill readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <ConditionBadge condition={listing.condition} size="sm" />
            {listing.seller?.isProSeller && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-lime-300 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                Pro 🌟
              </span>
            )}
          </div>
          <button
            onClick={handleToggleSave}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all min-w-[36px] min-h-[36px] flex items-center justify-center shadow-sm ${
              isSaved
                ? 'bg-rose-500 text-white'
                : 'bg-white/85 text-slate-700 hover:text-rose-500 hover:bg-white'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Save item"
          >
            <Heart size={15} className={isSaved ? 'fill-white' : ''} />
          </button>
        </div>

        {/* Sold Badge Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Bottom image location & time info */}
        <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-2.5 sm:left-3 sm:right-3 flex items-center justify-between text-[10px] sm:text-[11px] text-white font-semibold z-10 drop-shadow">
          <span className="flex items-center gap-1 truncate max-w-[150px] sm:max-w-[170px]">
            <MapPin size={12} className="text-campus-lime flex-shrink-0" />
            <span className="truncate">{listing.campusLocation || 'DTU Campus'}</span>
          </span>
          <span className="text-slate-200 text-[9px] sm:text-[10px] flex-shrink-0">
            {formatTimeAgo(listing.createdAt)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title: 2 lines max */}
          <h3 className="font-bold text-slate-900 text-xs sm:text-base line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug group-hover:text-emerald-700 transition-colors">
            {listing.title}
          </h3>

          {/* Description snippet */}
          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed hidden sm:block font-medium">
            {listing.description}
          </p>

          {/* Social Proof Line */}
          <div className="flex items-center gap-1 mt-2 text-[10px] sm:text-[11px] text-slate-500">
            <Eye size={12} className="text-emerald-600 flex-shrink-0" />
            <span className="truncate">
              <strong className="text-slate-700 font-bold">{listing.viewsCount + 8}</strong> students viewed
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2.5 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Price
            </span>
            <span className="text-sm sm:text-lg font-black text-slate-950 group-hover:text-emerald-700 transition-colors">
              {formatPrice(listing.price)}
            </span>
          </div>

          <button
            onClick={handleQuickChat}
            disabled={isSold || isChatStarting}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-full bg-slate-100 hover:bg-campus-lime hover:text-slate-950 text-slate-800 text-xs font-bold border border-slate-200 hover:border-campus-lime transition-all disabled:opacity-40 min-h-[36px] sm:min-h-[38px] shadow-sm"
          >
            <MessageCircle size={13} />
            <span>{isChatStarting ? '...' : 'Chat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

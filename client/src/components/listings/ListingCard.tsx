import React, { useState } from 'react';
import { Eye, MessageCircle, Heart, MapPin } from 'lucide-react';
import { Listing } from '../../types/index.js';
import { formatPrice, formatTimeAgo } from '../../utils/formatters.js';
import { ConditionBadge } from '../common/Badge.js';
import { useAuth } from '../../context/AuthContext.js';
import { useChat } from '../../context/ChatContext.js';
import { UserService } from '../../services/user.service.js';

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

  const coverImage =
    listing.images && listing.images.length > 0
      ? listing.images[0].url
      : 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=80';

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
      className="group relative bg-campus-card hover:bg-campus-card-hover border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={coverImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Gradient overlay on top for badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <ConditionBadge condition={listing.condition} size="sm" />
            {listing.seller?.isProSeller && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-campus-lime text-black font-black text-[10px] uppercase tracking-wider shadow-glow">
                Pro 🌟
              </span>
            )}
          </div>
          <button
            onClick={handleToggleSave}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all min-w-[36px] min-h-[36px] flex items-center justify-center ${
              isSaved
                ? 'bg-campus-pink text-white shadow-glow-pink'
                : 'bg-black/60 text-white/80 hover:text-campus-pink hover:bg-black/80'
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
        <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-2.5 sm:left-3 sm:right-3 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300 font-medium z-10">
          <span className="flex items-center gap-1 truncate max-w-[150px] sm:max-w-[170px] drop-shadow">
            <MapPin size={12} className="text-campus-lime flex-shrink-0" />
            <span className="truncate">{listing.campusLocation || 'DTU Campus'}</span>
          </span>
          <span className="text-slate-400 text-[9px] sm:text-[10px] drop-shadow flex-shrink-0">
            {formatTimeAgo(listing.createdAt)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title: 2 lines max with comfortable height so never truncating mid-word */}
          <h3 className="font-bold text-white text-xs sm:text-base line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug group-hover:text-campus-lime transition-colors">
            {listing.title}
          </h3>

          {/* Description snippet */}
          <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed hidden sm:block">
            {listing.description}
          </p>

          {/* Social Proof Line */}
          <div className="flex items-center gap-1 mt-2 text-[10px] sm:text-[11px] text-campus-muted">
            <Eye size={12} className="text-campus-lime flex-shrink-0" />
            <span className="truncate">
              <strong className="text-slate-200 font-semibold">{listing.viewsCount + 8}</strong> students viewed
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2.5 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5 sm:gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Price
            </span>
            <span className="text-sm sm:text-lg font-extrabold text-white group-hover:text-campus-lime transition-colors">
              {formatPrice(listing.price)}
            </span>
          </div>

          <button
            onClick={handleQuickChat}
            disabled={isSold || isChatStarting}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-2 sm:py-1.5 rounded-full bg-slate-800 hover:bg-campus-lime hover:text-black text-slate-200 text-xs font-semibold border border-slate-700/80 hover:border-campus-lime transition-all disabled:opacity-40 min-h-[36px] sm:min-h-[38px]"
          >
            <MessageCircle size={13} />
            <span>{isChatStarting ? '...' : 'Chat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

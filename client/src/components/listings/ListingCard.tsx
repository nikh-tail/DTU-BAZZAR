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
        />

        {/* Gradient overlay on top for badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <ConditionBadge condition={listing.condition} size="sm" />
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-campus-pink text-white shadow-glow-pink'
                : 'bg-black/60 text-white/80 hover:text-campus-pink hover:bg-black/80'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={14} className={isSaved ? 'fill-white' : ''} />
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
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium z-10">
          <span className="flex items-center gap-1 truncate max-w-[170px] drop-shadow">
            <MapPin size={12} className="text-campus-lime flex-shrink-0" />
            <span className="truncate">{listing.campusLocation || 'DTU Campus'}</span>
          </span>
          <span className="text-slate-400 text-[10px] drop-shadow">
            {formatTimeAgo(listing.createdAt)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-campus-lime transition-colors">
            {listing.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {listing.description}
          </p>

          {/* Social Proof Line (SharePal Style) */}
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-campus-muted">
            <Eye size={12} className="text-campus-lime" />
            <span>
              <strong className="text-slate-200 font-semibold">{listing.viewsCount + 8}</strong> DTU students viewed
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Price
            </span>
            <span className="text-lg font-extrabold text-white group-hover:text-campus-lime transition-colors">
              {formatPrice(listing.price)}
            </span>
          </div>

          <button
            onClick={handleQuickChat}
            disabled={isSold || isChatStarting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-campus-lime hover:text-black text-slate-200 text-xs font-semibold border border-slate-700/80 hover:border-campus-lime transition-all disabled:opacity-40"
          >
            <MessageCircle size={13} />
            <span>{isChatStarting ? 'Opening...' : 'Chat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

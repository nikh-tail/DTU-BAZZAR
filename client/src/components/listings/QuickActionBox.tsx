import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, MapPin, Star, Heart, CheckCircle2 } from 'lucide-react';
import { Listing } from '../../types/index.js';
import { formatPrice } from '../../utils/formatters.js';
import { ConditionBadge, VerifiedDtuBadge } from '../common/Badge.js';
import { Button } from '../common/Button.js';
import { useAuth } from '../../context/AuthContext.js';
import { useChat } from '../../context/ChatContext.js';
import { UserService } from '../../services/user.service.js';

interface QuickActionBoxProps {
  listing: Listing;
  onSelectSellerProfile: (sellerId: string) => void;
}

export const QuickActionBox: React.FC<QuickActionBoxProps> = ({
  listing,
  onSelectSellerProfile,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { startChatWithListing, sendMessage } = useChat();
  const [isSaved, setIsSaved] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const isOwner = user?.id === listing.sellerId;
  const isSold = listing.status === 'SOLD';

  const quickPrompts = [
    'Hey, is this still available?',
    'Can we meet at Mic-Mac Canteen today?',
    `Will you accept ₹${Math.round(listing.price * 0.85)}?`,
    'Is original box/bill available?',
  ];

  const handleStartChat = async (presetText?: string) => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
      return;
    }
    if (isOwner) return;

    try {
      setIsChatLoading(true);
      await startChatWithListing(listing.id);
      if (presetText) {
        await sendMessage(presetText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
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
    <div className="bg-campus-card border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl sticky top-24">
      {/* Price & Condition */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Listed Price
          </span>
          <ConditionBadge condition={listing.condition} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-campus-lime font-bold">Fixed / Negotiable</span>
        </div>
      </div>

      {/* Seller Profile Mini Card */}
      <div
        onClick={() => onSelectSellerProfile(listing.seller.id)}
        className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Seller Info
          </span>
          <VerifiedDtuBadge size="sm" />
        </div>

        <div className="flex items-center gap-3">
          {listing.seller.avatar ? (
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-campus-lime/50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-800 text-campus-lime font-bold text-base flex items-center justify-center border border-campus-lime/40">
              {listing.seller.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-sm group-hover:text-campus-lime transition-colors truncate">
              {listing.seller.name}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {listing.seller.branch || 'DTU Engineering'} • {listing.seller.year || 'Student'}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-campus-gold font-semibold">
                <Star size={12} className="fill-campus-gold" />
                <span>{listing.seller.rating || 5.0}</span>
              </span>
              <span>•</span>
              <span className="truncate">{listing.seller.hostel || 'DTU Campus'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isOwner ? (
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold text-center">
            This is your active listing. You can manage it in your profile dashboard.
          </div>
        ) : isSold ? (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
            This item has been marked as Sold.
          </div>
        ) : (
          <>
            <Button
              variant="lime"
              size="lg"
              onClick={() => handleStartChat()}
              isLoading={isChatLoading}
              leftIcon={<MessageCircle size={18} className="stroke-[2.5]" />}
              className="w-full shadow-glow font-extrabold text-base"
            >
              Chat with Seller
            </Button>

            <button
              onClick={handleToggleSave}
              className={`w-full py-3 rounded-full border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-campus-pink/20 border-campus-pink text-pink-300 shadow-glow-pink'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              <Heart size={15} className={isSaved ? 'fill-campus-pink text-campus-pink' : ''} />
              <span>{isSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </>
        )}
      </div>

      {/* 1-Click Fast Campus Inquiries */}
      {!isOwner && !isSold && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Quick Inquiry Prompts
          </span>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleStartChat(prompt)}
                className="text-left text-xs px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-campus-lime border border-slate-800 hover:border-campus-lime/40 transition-all truncate"
              >
                💬 "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Safety guidelines */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2 text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-200 font-bold">
          <ShieldCheck size={16} className="text-campus-lime" />
          <span>DTU Campus Safety Guidelines</span>
        </div>
        <ul className="space-y-1 text-[11px] list-disc list-inside">
          <li>Inspect gear in person at public spots (Mic-Mac / OAT).</li>
          <li>Never transfer advance tokens prior to physical inspection.</li>
          <li>Pay directly to seller via UPI or cash upon testing.</li>
        </ul>
      </div>
    </div>
  );
};

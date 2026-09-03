import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Conversation } from '../../types/index.js';
import { formatPrice, formatTimeAgo } from '../../utils/formatters.js';
import { getImageUrl, handleImageError } from '../../utils/imageUrl.js';

interface ChatListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  activeId,
  onSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-slate-800/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <MessageSquare size={32} className="text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-white">No campus chats yet</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
          Click "Chat" on any listing to start chatting with student sellers.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[500px] no-scrollbar">
      {conversations.map((conv) => {
        const isSelected = activeId === conv.id;
        const listingCategory = (conv.listing as any)?.category;
        const coverImg = getImageUrl(conv.listing?.images?.[0]?.url, listingCategory);

        return (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`p-3.5 sm:p-4 flex items-center gap-3 cursor-pointer transition-colors ${
              isSelected
                ? 'bg-slate-800/90 border-l-4 border-campus-lime'
                : 'hover:bg-slate-900/60'
            }`}
          >
            {/* Listing / Partner Image */}
            <div className="relative flex-shrink-0">
              <img
                src={coverImg}
                alt={conv.listing?.title}
                onError={(e) => handleImageError(e, listingCategory)}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
              />
              {conv.partner?.avatar && (
                <img
                  src={getImageUrl(conv.partner.avatar)}
                  alt={conv.partner.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-900 absolute -bottom-1 -right-1"
                />
              )}
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <h4 className="text-xs font-bold text-white truncate">
                  {conv.partner?.name || 'DTU Student'}
                </h4>
                {conv.lastMessageAt && (
                  <span className="text-[10px] text-slate-500 flex-shrink-0">
                    {formatTimeAgo(conv.lastMessageAt)}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-campus-lime font-medium truncate">
                {conv.listing?.title} • {formatPrice(conv.listing?.price || 0)}
              </p>

              <p className="text-xs text-slate-400 truncate mt-0.5">
                {conv.lastMessageText || 'Chat started'}
              </p>
            </div>

            {/* Unread badge */}
            {(conv.unreadCount ?? 0) > 0 && (
              <span className="w-5 h-5 rounded-full bg-campus-pink text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 animate-pulse shadow-glow-pink">
                {conv.unreadCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

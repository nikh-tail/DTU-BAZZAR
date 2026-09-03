import React from 'react';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useChat } from '../../context/ChatContext.js';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { totalUnreadCount, openChatDrawer } = useChat();

  const handleSellClick = () => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
    } else {
      onNavigate('create-listing');
    }
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      openAuthModal('LOGIN');
    } else {
      openChatDrawer();
    }
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      openAuthModal('LOGIN');
    } else {
      onNavigate('profile');
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-2 py-1.5 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentPage === 'home' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home size={20} className={currentPage === 'home' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => onNavigate('browse')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentPage === 'browse' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass size={20} className={currentPage === 'browse' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-bold mt-0.5">Explore</span>
        </button>

        {/* Sell Center CTA */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={handleSellClick}
            className="w-12 h-12 rounded-full bg-campus-lime text-slate-950 flex items-center justify-center shadow-glow active:scale-95 transition-transform border-4 border-white"
            aria-label="Sell an item"
          >
            <Plus size={24} className="stroke-[3]" />
          </button>
        </div>

        {/* Chats */}
        <button
          onClick={handleChatClick}
          className="relative flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <div className="relative">
            <MessageSquare size={20} />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Chats</span>
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentPage === 'profile' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User size={20} className={currentPage === 'profile' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-bold mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
};

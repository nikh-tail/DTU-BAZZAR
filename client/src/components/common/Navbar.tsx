import React, { useState, useRef, useEffect } from 'react';
import { Search, PlusCircle, MessageSquare, User as UserIcon, LogOut, Heart, Package, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useChat } from '../../context/ChatContext.js';
import { Button } from './Button.js';
import { getImageUrl } from '../../utils/imageUrl.js';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onNavigate: (page: string, params?: any) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onNavigate, activePage }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { totalUnreadCount, openChatDrawer } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
      onNavigate('browse', { search: searchQuery.trim() });
      setIsSearchExpanded(false);
    }
  };

  const handleSellClick = () => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
    } else {
      onNavigate('create-listing');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer select-none group flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-campus-lime to-emerald-400 flex items-center justify-center text-black font-black text-lg shadow-glow group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                DTU BAZAAR
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-lime-100 text-lime-800 border border-lime-300 hidden sm:inline-block">
                Campus
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
              Delhi Technological University Peer Marketplace
            </p>
          </div>
        </div>

        {/* Expandable Search Trigger (Desktop & Mobile) */}
        {isSearchExpanded ? (
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl mx-2 animate-fadeIn flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators, cycles, coolers, books..."
                className="w-full bg-white border-2 border-campus-lime text-slate-900 placeholder-slate-400 rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setIsSearchExpanded(false)}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-campus-lime text-slate-950 font-black text-xs rounded-full shadow-glow"
            >
              Go
            </button>
          </form>
        ) : (
          <div className="flex-1 max-w-xl flex justify-end md:justify-center">
            <button
              type="button"
              onClick={() => setIsSearchExpanded(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-all min-h-[44px] shadow-sm"
              title="Search DTU Bazaar"
            >
              <Search size={16} className="text-emerald-600" />
              <span className="hidden md:inline text-slate-500">Search marketplace...</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sell Button CTA */}
          <Button
            variant="lime"
            size="sm"
            onClick={handleSellClick}
            leftIcon={<PlusCircle size={16} className="stroke-[2.5]" />}
            className="shadow-glow font-black text-xs sm:text-sm min-h-[44px] text-slate-950"
          >
            <span className="hidden sm:inline">Sell an Item</span>
            <span className="sm:hidden">Sell</span>
          </Button>

          {/* Download App Link */}
          <button
            onClick={() => onNavigate('download')}
            className={`px-3 py-2 text-xs font-bold rounded-full border transition-all min-h-[44px] ${
              activePage === 'download'
                ? 'bg-lime-100 text-lime-900 border-lime-300'
                : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-100'
            } inline-flex items-center gap-1.5 shadow-sm`}
            title="Download DTU Bazaar Android APK & iOS App"
          >
            <span>📲</span>
            <span className="hidden sm:inline">Get App</span>
          </button>

          {/* Browse Link (Desktop) */}
          <button
            onClick={() => onNavigate('browse')}
            className={`px-3.5 py-2 text-xs font-bold rounded-full border transition-all min-h-[44px] ${
              activePage === 'browse'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-100'
            } hidden lg:inline-flex items-center gap-1.5 shadow-sm`}
          >
            <Sparkles size={14} className="text-rose-500" />
            <span>Browse All</span>
          </button>

          {/* Chat Messages Drawer Trigger */}
          {isAuthenticated && (
            <button
              onClick={openChatDrawer}
              className="relative p-2.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
              title="Campus Chats"
            >
              <MessageSquare size={18} />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-glow-pink">
                  {totalUnreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Auth State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-all text-slate-800 min-h-[44px] shadow-sm"
              >
                {user.avatar ? (
                  <img
                    src={getImageUrl(user.avatar)}
                    alt={user.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-lime-100 text-lime-900 text-xs font-black flex items-center justify-center border border-lime-300">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs font-bold max-w-[90px] truncate hidden md:inline-block">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-emerald-600 font-mono truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
                    >
                      <UserIcon size={15} />
                      <span>My Profile & Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigate('profile', { tab: 'active' });
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
                    >
                      <Package size={15} />
                      <span>My Listings (Manage)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigate('profile', { tab: 'saved' });
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
                    >
                      <Heart size={15} />
                      <span>Saved Wishlist</span>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors min-h-[44px]"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openAuthModal('LOGIN')}
                className="text-slate-700 hover:text-slate-900 min-h-[44px]"
              >
                Log In
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

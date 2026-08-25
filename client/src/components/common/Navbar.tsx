import React, { useState } from 'react';
import { Search, PlusCircle, MessageSquare, User as UserIcon, LogOut, Heart, Package, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useChat } from '../../context/ChatContext.js';
import { Button } from './Button.js';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onNavigate: (page: string, params?: any) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onNavigate, activePage }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { totalUnreadCount, openChatDrawer } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    onNavigate('browse', { search: searchQuery });
  };

  const handleSellClick = () => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
    } else {
      onNavigate('create-listing');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
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
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-campus-lime transition-colors">
                DTU BAZAAR
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-campus-lime/20 text-campus-lime border border-campus-lime/30 hidden sm:inline-block">
                Campus
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
              Delhi Tech University Peer Marketplace
            </p>
          </div>
        </div>

        {/* Global Search Bar (OLX style search) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl hidden md:block"
        >
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scientific calculators, cycles, coolers, lab kits, notes..."
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-campus-lime text-slate-100 placeholder-slate-400 rounded-full pl-11 pr-24 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-campus-lime/20"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-full transition-colors flex items-center gap-1"
            >
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sell Button CTA */}
          <Button
            variant="lime"
            size="sm"
            onClick={handleSellClick}
            leftIcon={<PlusCircle size={16} className="stroke-[2.5]" />}
            className="shadow-glow"
          >
            <span className="hidden xs:inline">Sell an Item</span>
            <span className="xs:hidden">Sell</span>
          </Button>

          {/* Browse Link */}
          <button
            onClick={() => onNavigate('browse')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              activePage === 'browse'
                ? 'bg-slate-800 text-campus-lime border-campus-lime/40'
                : 'text-slate-300 border-slate-700/70 hover:bg-slate-800/80'
            } hidden lg:inline-flex items-center gap-1.5`}
          >
            <Sparkles size={14} className="text-campus-pink" />
            <span>Browse All</span>
          </button>

          {/* Chat Messages Drawer Trigger */}
          {isAuthenticated && (
            <button
              onClick={openChatDrawer}
              className="relative p-2.5 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 rounded-full transition-all"
              title="Campus Chats"
            >
              <MessageSquare size={18} />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-campus-pink text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-glow-pink">
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
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-900 border border-slate-700/70 hover:border-slate-500 transition-all text-slate-200"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-campus-lime"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-campus-lime font-bold text-xs flex items-center justify-center border border-campus-lime/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold max-w-[80px] sm:max-w-[110px] truncate hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-campus-card border border-slate-700/80 rounded-2xl shadow-2xl z-50 py-2 divide-y divide-slate-800 text-sm">
                    <div className="px-4 py-2.5">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-campus-lime truncate">{user.email}</p>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">
                        {user.branch} • {user.hostel || 'Day Scholar'}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('profile');
                        }}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 text-xs font-medium"
                      >
                        <UserIcon size={15} />
                        <span>My Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('profile', { tab: 'listings' });
                        }}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 text-xs font-medium"
                      >
                        <Package size={15} />
                        <span>My Listings (Manage)</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('profile', { tab: 'saved' });
                        }}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 text-xs font-medium"
                      >
                        <Heart size={15} />
                        <span>Saved Items</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 text-xs font-medium"
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAuthModal('LOGIN')}
              leftIcon={<UserIcon size={14} />}
            >
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar (under header on small screens) */}
      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search calculators, coolers, cycles, notes..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-400 rounded-full pl-10 pr-4 py-2 text-xs focus:border-campus-lime focus:outline-none"
            />
          </div>
        </form>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Search, PlusCircle, ArrowRight, ShieldCheck, Zap, MapPin } from 'lucide-react';
import { Button } from '../common/Button.js';
import { useAuth } from '../../context/AuthContext.js';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onNavigate('browse', { search: query.trim() });
    }
  };

  const handlePostItem = () => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
    } else {
      onNavigate('create-listing');
    }
  };

  return (
    <section className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 overflow-hidden text-center">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-campus-lime/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-campus-pink/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Trust Badge Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck size={14} className="text-blue-400" />
            <span>Verified @dtu.ac.in Only</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campus-lime/10 border border-campus-lime/30 text-campus-lime text-xs font-semibold backdrop-blur-md">
            <Zap size={14} className="text-campus-lime" />
            <span>Zero Brokerage / 100% Free</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campus-pink/10 border border-campus-pink/30 text-pink-300 text-xs font-semibold backdrop-blur-md">
            <MapPin size={14} className="text-campus-pink" />
            <span>Meet at Mic-Mac / OAT</span>
          </span>
        </div>

        {/* Main Mixed-Weight Headline */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-5">
          "Buy & Sell <span className="text-gradient-lime drop-shadow-sm">Within DTU</span>,<br className="hidden sm:inline" />
          Zero Campus Hassle"
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-medium">
          The official peer-to-peer student marketplace. Trade semester books, coolers, cycles, calculators, and hostel essentials directly with verified campus peers.
        </p>

        {/* Hero Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto mb-6 relative group"
        >
          <div className="relative flex items-center bg-campus-card border-2 border-slate-700/80 group-hover:border-campus-lime/60 focus-within:border-campus-lime rounded-2xl sm:rounded-full p-1.5 shadow-2xl transition-all">
            <Search size={22} className="ml-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Casio 991EX, Hero Cycle, Symphony Cooler, Lab Drafter..."
              className="w-full bg-transparent text-white placeholder-slate-400 px-3 py-2 text-sm sm:text-base outline-none"
            />
            <Button
              type="submit"
              variant="lime"
              size="md"
              className="flex-shrink-0 font-bold px-6"
            >
              Search
            </Button>
          </div>
        </form>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="lime"
            size="lg"
            onClick={handlePostItem}
            leftIcon={<PlusCircle size={18} className="stroke-[2.5]" />}
            className="shadow-glow"
          >
            Sell Your Unused Gear
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('browse')}
            rightIcon={<ArrowRight size={18} />}
          >
            Browse 500+ Items
          </Button>
        </div>
      </div>
    </section>
  );
};

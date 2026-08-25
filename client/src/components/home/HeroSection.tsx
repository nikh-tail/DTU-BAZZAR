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
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden text-center">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-campus-lime/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[320px] h-[320px] bg-campus-pink/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Trust Badge Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck size={14} className="text-blue-400" />
            <span>Verified Student Community</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-campus-lime/10 border border-campus-lime/30 text-campus-lime text-xs font-semibold backdrop-blur-md">
            <Zap size={14} className="text-campus-lime" />
            <span>100% Free • Zero Commission</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-campus-pink/10 border border-campus-pink/30 text-pink-300 text-xs font-semibold backdrop-blur-md">
            <MapPin size={14} className="text-campus-pink" />
            <span>On-Campus Handover</span>
          </span>
        </div>

        {/* Clean, authoritative headline without quotes */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
          The Peer-to-Peer Marketplace for <br className="hidden sm:inline" />
          <span className="text-gradient-lime drop-shadow-sm">Delhi Technological University</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
          Buy, sell, and exchange academic textbooks, lab equipment, cycles, room coolers, and tech gear directly with fellow DTU students.
        </p>

        {/* Hero Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto mb-8 relative group"
        >
          <div className="relative flex items-center bg-campus-card border-2 border-slate-700/80 group-hover:border-campus-lime/60 focus-within:border-campus-lime rounded-2xl sm:rounded-full p-2 shadow-2xl transition-all">
            <Search size={22} className="ml-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Casio calculators, mountain bikes, desert coolers, drafters..."
              className="w-full bg-transparent text-white placeholder-slate-400 px-3 py-2 text-sm sm:text-base outline-none"
            />
            <Button
              type="submit"
              variant="lime"
              size="md"
              className="flex-shrink-0 font-bold px-6 shadow-sm"
            >
              Search Feed
            </Button>
          </div>
        </form>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button
            variant="lime"
            size="lg"
            onClick={handlePostItem}
            leftIcon={<PlusCircle size={18} className="stroke-[2.5]" />}
            className="shadow-glow font-bold px-7"
          >
            Post an Item for Sale
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('browse')}
            rightIcon={<ArrowRight size={18} />}
            className="px-7"
          >
            Explore All Listings
          </Button>
        </div>
      </div>
    </section>
  );
};

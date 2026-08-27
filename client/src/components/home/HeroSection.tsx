import React, { useState } from 'react';
import { Search, PlusCircle, ShieldCheck } from 'lucide-react';
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
    <section className="relative pt-6 pb-12 sm:pt-14 sm:pb-20 overflow-hidden text-center">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[400px] bg-campus-lime/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* 1. Single Combined Trust Badge Pill (Subtle, Clean) */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/70 text-slate-300 text-[11px] sm:text-xs font-semibold mb-5 sm:mb-6 shadow-sm backdrop-blur-md">
          <ShieldCheck size={14} className="text-campus-lime flex-shrink-0" />
          <span>Verified @dtu.ac.in students only · Zero brokerage</span>
        </div>

        {/* 2. Main Headline (Responsive on mobile 375px+) */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
          Buy & Sell <span className="text-gradient-lime drop-shadow-sm">Within DTU</span>,<br className="hidden sm:inline" />
          Zero Campus Hassle
        </h1>

        {/* 3. Short Single-Line Subtext */}
        <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed">
          Buy and sell second-hand cycles, coolers, books, and lab gear directly with DTU peers.
        </p>

        {/* 4. Prominent Interactive Hero Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto mb-6 sm:mb-8 relative group"
        >
          <div className="relative flex items-center bg-[#0C1220] border-2 border-slate-700/80 group-hover:border-campus-lime/70 focus-within:border-campus-lime rounded-2xl sm:rounded-full p-1.5 shadow-2xl transition-all">
            <Search size={20} className="ml-3 sm:ml-4 text-slate-400 pointer-events-none flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scientific calculators, cycles, coolers, lab kits..."
              className="w-full bg-transparent text-white placeholder-slate-400 px-3 py-2.5 text-xs sm:text-base outline-none min-w-0"
            />
            <Button
              type="submit"
              variant="lime"
              size="md"
              className="flex-shrink-0 font-black px-4 sm:px-7 text-xs sm:text-sm shadow-glow"
            >
              Search
            </Button>
          </div>
        </form>

        {/* 5. Single Primary CTA */}
        <div className="flex items-center justify-center">
          <Button
            variant="lime"
            size="lg"
            onClick={handlePostItem}
            leftIcon={<PlusCircle size={18} className="stroke-[2.5]" />}
            className="shadow-glow font-black text-sm sm:text-base px-7 sm:px-9 py-3.5"
          >
            Sell Your Unused Gear
          </Button>
        </div>
      </div>
    </section>
  );
};

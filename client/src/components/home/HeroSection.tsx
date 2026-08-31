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

  // 6 Big Visual Floating Gear Elements orbiting tightly around the center text (SharePal Style)
  const floatingItems = [
    {
      id: 'keyboard',
      shortName: 'Keyboard',
      price: '₹4.5k',
      category: 'ELECTRONICS',
      search: 'Keyboard',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
      position: 'top-[-10px] left-[-45px] xl:left-[-85px]',
      rotation: '-rotate-6',
      animation: 'animate-float-slow',
      borderGlow: 'hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.5)]',
      accentColor: 'text-cyan-400',
    },
    {
      id: 'calculator',
      shortName: 'Casio 991EX',
      price: '₹790',
      category: 'ELECTRONICS',
      search: 'Calculator',
      image: 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=500&auto=format&fit=crop&q=80',
      position: 'top-[-15px] right-[-45px] xl:right-[-85px]',
      rotation: 'rotate-8',
      animation: 'animate-float-fast',
      borderGlow: 'hover:border-campus-lime hover:shadow-[0_0_35px_rgba(198,255,61,0.5)]',
      accentColor: 'text-campus-lime',
    },
    {
      id: 'bicycle',
      shortName: 'Cycle',
      price: '₹3.4k',
      category: 'CYCLES',
      search: 'Cycle',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop&q=80',
      position: 'top-[115px] left-[-75px] xl:left-[-120px]',
      rotation: '-rotate-8',
      animation: 'animate-float-medium',
      borderGlow: 'hover:border-amber-400 hover:shadow-[0_0_35px_rgba(251,191,36,0.5)]',
      accentColor: 'text-amber-400',
    },
    {
      id: 'books',
      shortName: 'CSE Books',
      price: '₹850',
      category: 'BOOKS_ACADEMICS',
      search: 'Books',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80',
      position: 'top-[120px] right-[-75px] xl:right-[-120px]',
      rotation: 'rotate-6',
      animation: 'animate-float-slow',
      borderGlow: 'hover:border-rose-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.5)]',
      accentColor: 'text-rose-400',
    },
    {
      id: 'cloths',
      shortName: 'Lab Coat',
      price: '₹260',
      category: 'LAB_STATIONERY',
      search: 'Lab Coat',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      position: 'bottom-[20px] left-[-50px] xl:left-[-95px]',
      rotation: '-rotate-4',
      animation: 'animate-float-fast',
      borderGlow: 'hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(52,211,153,0.5)]',
      accentColor: 'text-emerald-400',
    },
    {
      id: 'cooler',
      shortName: 'Room Cooler',
      price: '₹2.4k',
      category: 'HOSTEL_ESSENTIALS',
      search: 'Cooler',
      image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&auto=format&fit=crop&q=80',
      position: 'bottom-[20px] right-[-50px] xl:right-[-95px]',
      rotation: 'rotate-8',
      animation: 'animate-float-medium',
      borderGlow: 'hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]',
      accentColor: 'text-purple-400',
    },
  ];

  return (
    <section className="relative pt-8 pb-14 sm:pt-16 sm:pb-24 overflow-visible text-center select-none">
      {/* 1. Concentric Radial Perspective Rings (SharePal style background) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1300px] h-[850px] sm:h-[1300px] pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[320px] h-[320px] rounded-full border border-slate-800/40" />
        <div className="absolute w-[560px] h-[560px] rounded-full border border-slate-800/30" />
        <div className="absolute w-[820px] h-[820px] rounded-full border border-slate-800/20" />
        <div className="absolute w-[1080px] h-[1080px] rounded-full border border-slate-800/15" />
        <div className="absolute w-[1340px] h-[1340px] rounded-full border border-slate-800/10" />
      </div>

      {/* 2. Ambient Lighting Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] h-[280px] sm:h-[420px] bg-campus-lime/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* 3. Main Hero Central Content with Orbiting Floating Gear Elements */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-20">
        {/* Floating Items Orbiting Directly Around Central Content (Visible on lg+ screens) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-30">
          {floatingItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('browse', { category: item.category, search: item.search })}
              className={`absolute ${item.position} ${item.rotation} ${item.animation} pointer-events-auto cursor-pointer group`}
              title={`Buy / Sell ${item.shortName} (${item.price}) on DTU Bazaar`}
            >
              {/* Big Rounded Visual Tile */}
              <div
                className={`relative w-24 h-24 xl:w-28 xl:h-28 rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-700/80 shadow-[0_20px_40px_rgba(0,0,0,0.7)] transition-all duration-300 group-hover:scale-115 group-hover:-translate-y-2 ${item.borderGlow}`}
              >
                <img
                  src={item.image}
                  alt={item.shortName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="eager"
                  decoding="async"
                />

                {/* Gradient dark scrim on bottom for high contrast text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

                {/* Minimal Bottom Pill: Short Name + Price */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between px-2 py-0.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-black">
                  <span className="text-white truncate max-w-[55px] font-bold">
                    {item.shortName}
                  </span>
                  <span className={item.accentColor}>
                    {item.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/70 text-slate-300 text-[11px] sm:text-xs font-semibold mb-5 sm:mb-6 shadow-sm backdrop-blur-md">
          <ShieldCheck size={14} className="text-campus-lime flex-shrink-0" />
          <span>Verified @dtu.ac.in students only · Zero brokerage</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
          Buy & Sell <span className="text-gradient-lime drop-shadow-sm">Within DTU</span>,<br className="hidden sm:inline" />
          Zero Campus Hassle
        </h1>

        {/* Subtext */}
        <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed">
          Buy and sell second-hand cycles, coolers, books, and lab gear directly with DTU peers.
        </p>

        {/* Prominent Search Bar */}
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
              placeholder="Search scientific calculators, cycles, coolers, lab kits, books..."
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

        {/* Primary CTA */}
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

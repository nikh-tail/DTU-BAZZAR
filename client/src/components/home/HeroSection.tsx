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

  // 6 Visual Floating Gear Elements arranged in a balanced circular orbit ring (Hugging Central Text)
  const floatingItems = [
    {
      id: 'keyboard',
      shortName: 'Keyboard',
      price: '₹4.5k',
      category: 'ELECTRONICS',
      search: 'Keyboard',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=350&auto=format&fit=crop&q=80',
      position: 'top-[6px] left-[16px] sm:top-[-20px] sm:left-[10px] lg:top-[-15px] lg:left-[-35px] xl:left-[-75px]',
      rotation: '-rotate-6',
      animation: 'animate-orbit-11',
      borderGlow: 'hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.5)]',
      accentColor: 'text-cyan-400',
    },
    {
      id: 'calculator',
      shortName: 'Casio 991EX',
      price: '₹790',
      category: 'ELECTRONICS',
      search: 'Calculator',
      image: 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=350&auto=format&fit=crop&q=80',
      position: 'top-[6px] right-[16px] sm:top-[-20px] sm:right-[10px] lg:top-[-15px] lg:right-[-35px] xl:right-[-75px]',
      rotation: 'rotate-8',
      animation: 'animate-orbit-1',
      borderGlow: 'hover:border-campus-lime hover:shadow-[0_0_35px_rgba(198,255,61,0.5)]',
      accentColor: 'text-campus-lime',
    },
    {
      id: 'bicycle',
      shortName: 'Cycle',
      price: '₹3.4k',
      category: 'CYCLES',
      search: 'Cycle',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=350&auto=format&fit=crop&q=80',
      position: 'top-[86px] left-[4px] sm:top-[100px] sm:left-[-25px] lg:top-[125px] lg:left-[-90px] xl:left-[-135px]',
      rotation: '-rotate-8',
      animation: 'animate-orbit-9',
      borderGlow: 'hover:border-amber-400 hover:shadow-[0_0_35px_rgba(251,191,36,0.5)]',
      accentColor: 'text-amber-400',
    },
    {
      id: 'books',
      shortName: 'CSE Books',
      price: '₹850',
      category: 'BOOKS_ACADEMICS',
      search: 'Books',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=350&auto=format&fit=crop&q=80',
      position: 'top-[86px] right-[4px] sm:top-[100px] sm:right-[-25px] lg:top-[125px] lg:right-[-90px] xl:right-[-135px]',
      rotation: 'rotate-6',
      animation: 'animate-orbit-3',
      borderGlow: 'hover:border-rose-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.5)]',
      accentColor: 'text-rose-400',
    },
    {
      id: 'cloths',
      shortName: 'Lab Coat',
      price: '₹260',
      category: 'LAB_STATIONERY',
      search: 'Lab Coat',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350&auto=format&fit=crop&q=80',
      position: 'bottom-[48px] left-[18px] sm:bottom-[30px] sm:left-[-15px] lg:bottom-[15px] lg:left-[-45px] xl:left-[-85px]',
      rotation: '-rotate-4',
      animation: 'animate-orbit-7',
      borderGlow: 'hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(52,211,153,0.5)]',
      accentColor: 'text-emerald-400',
    },
    {
      id: 'headphones',
      shortName: 'Headphones',
      price: '₹1.8k',
      category: 'ELECTRONICS',
      search: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=350&auto=format&fit=crop&q=80',
      position: 'bottom-[48px] right-[18px] sm:bottom-[30px] sm:right-[-15px] lg:bottom-[15px] lg:right-[-45px] xl:right-[-85px]',
      rotation: 'rotate-8',
      animation: 'animate-orbit-5',
      borderGlow: 'hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]',
      accentColor: 'text-purple-400',
    },
  ];

  return (
    <section className="relative pt-8 pb-14 sm:pt-18 sm:pb-26 overflow-x-clip text-center select-none">
      {/* 1. Concentric Radial Perspective Rings (SharePal style background) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1300px] h-[850px] sm:h-[1300px] pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] rounded-full border border-slate-800/40" />
        <div className="absolute w-[460px] sm:w-[560px] h-[460px] sm:h-[560px] rounded-full border border-slate-800/30" />
        <div className="absolute w-[680px] sm:w-[820px] h-[680px] sm:h-[820px] rounded-full border border-slate-800/20" />
        <div className="absolute w-[900px] sm:w-[1080px] h-[900px] sm:h-[1080px] rounded-full border border-slate-800/15" />
        <div className="absolute w-[1140px] sm:w-[1340px] h-[1140px] sm:h-[1340px] rounded-full border border-slate-800/10" />
      </div>

      {/* 2. Ambient Lighting Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] h-[220px] sm:h-[420px] bg-campus-lime/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* 3. Main Hero Central Content Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Floating Items Placed in Background Layer (z-0 on mobile, z-10 on desktop) hovering closely around the main text */}
        <div className="absolute inset-0 pointer-events-none z-0 lg:z-10">
          {floatingItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('browse', { category: item.category, search: item.search })}
              className={`absolute ${item.position} ${item.rotation} ${item.animation} pointer-events-auto cursor-pointer group opacity-80 sm:opacity-90 lg:opacity-100 transition-opacity`}
              title={`Buy / Sell ${item.shortName} (${item.price}) on DTU Bazaar`}
            >
              {/* Responsive Rounded Visual Tile */}
              <div
                className={`relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900/90 border sm:border-2 border-slate-700/80 shadow-[0_12px_28px_rgba(0,0,0,0.6)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.7)] transition-all duration-300 group-hover:scale-115 group-hover:-translate-y-2 ${item.borderGlow}`}
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
                <div className="absolute bottom-0.5 left-0.5 right-0.5 sm:bottom-1.5 sm:left-1.5 sm:right-1.5 flex items-center justify-between px-1 py-0.2 sm:px-2 sm:py-0.5 rounded-md sm:rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[7.5px] sm:text-[10px] font-black">
                  <span className="hidden sm:inline text-white truncate max-w-[55px] font-bold">
                    {item.shortName}
                  </span>
                  <span className={`${item.accentColor} mx-auto sm:mx-0`}>
                    {item.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Text & Actions Layer with Higher Z-Index (z-30) - 100% Unobstructed */}
        <div className="relative z-30 pointer-events-auto">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/95 border border-slate-700/80 text-slate-300 text-[11px] sm:text-xs font-semibold mb-5 sm:mb-6 shadow-md backdrop-blur-md">
            <ShieldCheck size={14} className="text-campus-lime flex-shrink-0" />
            <span>Verified @dtu.ac.in students only · Zero brokerage</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-2xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.14] mb-3 sm:mb-4 px-2 sm:px-0 max-w-[280px] sm:max-w-none mx-auto drop-shadow-md">
            Buy & Sell <span className="text-gradient-lime drop-shadow-sm">Within DTU</span>,<br className="hidden sm:inline" />
            Zero Campus Hassle
          </h1>

          {/* Subtext */}
          <p className="text-xs sm:text-base text-slate-300 max-w-[270px] sm:max-w-xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed px-2 sm:px-0 drop-shadow-sm">
            Buy and sell second-hand cycles, coolers, books, and lab gear directly with DTU peers.
          </p>

          {/* Prominent Search Bar (z-40 for crystal clear clickability) */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-6 sm:mb-8 relative group z-40"
          >
            <div className="relative flex items-center bg-[#0C1220] border-2 border-slate-700/90 group-hover:border-campus-lime/70 focus-within:border-campus-lime rounded-2xl sm:rounded-full p-1.5 shadow-2xl transition-all">
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
                className="flex-shrink-0 font-black px-4 sm:px-7 text-xs sm:text-sm shadow-glow cursor-pointer"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Primary CTA */}
          <div className="flex items-center justify-center relative z-40">
            <Button
              variant="lime"
              size="lg"
              onClick={handlePostItem}
              leftIcon={<PlusCircle size={18} className="stroke-[2.5]" />}
              className="shadow-glow font-black text-sm sm:text-base px-7 sm:px-9 py-3.5 cursor-pointer"
            >
              Sell Your Unused Gear
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

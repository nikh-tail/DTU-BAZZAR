import React, { useState } from 'react';
import { Search, PlusCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
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

  // 6 Visual Floating Gear Elements arranged in a circular orbit ring
  const floatingItems = [
    {
      id: 'keyboard',
      shortName: 'Keyboard',
      price: '₹4.5k',
      category: 'ELECTRONICS',
      search: 'Keyboard',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=350&auto=format&fit=crop&q=80',
      position: 'top-[4px] left-[18px] sm:top-[-20px] sm:left-[10px] lg:top-[-15px] lg:left-[-35px] xl:left-[-75px]',
      rotation: '-rotate-6',
      animation: 'animate-orbit-11',
      borderGlow: 'hover:border-sky-500 hover:shadow-lg',
      accentColor: 'text-sky-600',
    },
    {
      id: 'calculator',
      shortName: 'Casio 991EX',
      price: '₹790',
      category: 'ELECTRONICS',
      search: 'Calculator',
      image: 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=350&auto=format&fit=crop&q=80',
      position: 'top-[4px] right-[18px] sm:top-[-20px] sm:right-[10px] lg:top-[-15px] lg:right-[-35px] xl:right-[-75px]',
      rotation: 'rotate-8',
      animation: 'animate-orbit-1',
      borderGlow: 'hover:border-emerald-500 hover:shadow-lg',
      accentColor: 'text-emerald-700',
    },
    {
      id: 'bicycle',
      shortName: 'Cycle',
      price: '₹3.4k',
      category: 'HOBBY_SPORT',
      search: 'Cycle',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=350&auto=format&fit=crop&q=80',
      position: 'top-[65px] left-[4px] sm:top-[85px] sm:left-[-25px] lg:top-[110px] lg:left-[-90px] xl:left-[-135px]',
      rotation: '-rotate-8',
      animation: 'animate-orbit-9',
      borderGlow: 'hover:border-amber-500 hover:shadow-lg',
      accentColor: 'text-amber-700',
    },
    {
      id: 'books',
      shortName: 'CSE Books',
      price: '₹850',
      category: 'BOOKS_NOTES',
      search: 'Books',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=350&auto=format&fit=crop&q=80',
      position: 'top-[65px] right-[4px] sm:top-[85px] sm:right-[-25px] lg:top-[110px] lg:right-[-90px] xl:right-[-135px]',
      rotation: 'rotate-6',
      animation: 'animate-orbit-3',
      borderGlow: 'hover:border-rose-500 hover:shadow-lg',
      accentColor: 'text-rose-600',
    },
    {
      id: 'cloths',
      shortName: 'Lab Coat',
      price: '₹260',
      category: 'FASHION',
      search: 'Lab Coat',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350&auto=format&fit=crop&q=80',
      position: 'bottom-[35px] left-[18px] sm:bottom-[30px] sm:left-[-15px] lg:bottom-[15px] lg:left-[-45px] xl:left-[-85px]',
      rotation: '-rotate-4',
      animation: 'animate-orbit-7',
      borderGlow: 'hover:border-emerald-500 hover:shadow-lg',
      accentColor: 'text-emerald-700',
    },
    {
      id: 'headphones',
      shortName: 'Headphones',
      price: '₹1.8k',
      category: 'ELECTRONICS',
      search: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=350&auto=format&fit=crop&q=80',
      position: 'bottom-[35px] right-[18px] sm:bottom-[30px] sm:right-[-15px] lg:bottom-[15px] lg:right-[-45px] xl:right-[-85px]',
      rotation: 'rotate-8',
      animation: 'animate-orbit-5',
      borderGlow: 'hover:border-purple-500 hover:shadow-lg',
      accentColor: 'text-purple-700',
    },
  ];

  return (
    <section className="relative pt-10 pb-16 sm:pt-20 sm:pb-28 overflow-x-clip text-center select-none">
      {/* 1. Concentric Radial Perspective Rings (Light Theme) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1300px] h-[850px] sm:h-[1300px] pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] rounded-full border border-slate-200/80" />
        <div className="absolute w-[460px] sm:w-[560px] h-[460px] sm:h-[560px] rounded-full border border-slate-200/60" />
        <div className="absolute w-[680px] sm:w-[820px] h-[680px] sm:h-[820px] rounded-full border border-slate-200/50" />
        <div className="absolute w-[900px] sm:w-[1080px] h-[900px] sm:h-[1080px] rounded-full border border-slate-200/40" />
        <div className="absolute w-[1140px] sm:w-[1340px] h-[1140px] sm:h-[1340px] rounded-full border border-slate-200/30" />
      </div>

      {/* 2. Ambient Lighting Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] h-[220px] sm:h-[420px] bg-lime-200/40 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* 3. Main Hero Central Content Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Floating Items Placed in Background Layer */}
        <div className="absolute inset-0 pointer-events-none z-0 lg:z-10">
          {floatingItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('browse', { category: item.category, search: item.search })}
              className={`absolute ${item.position} ${item.rotation} ${item.animation} pointer-events-auto cursor-pointer group opacity-90 lg:opacity-100 transition-opacity`}
              title={`Buy / Sell ${item.shortName} (${item.price}) on DTU Bazaar`}
            >
              {/* Responsive Rounded Visual Tile */}
              <div
                className={`relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white border-2 border-slate-200 shadow-md transition-all duration-300 group-hover:scale-115 group-hover:-translate-y-2 ${item.borderGlow}`}
              >
                <img
                  src={item.image}
                  alt={item.shortName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="eager"
                  decoding="async"
                />

                {/* Minimal Bottom Pill: Short Name + Price */}
                <div className="absolute bottom-0.5 left-0.5 right-0.5 sm:bottom-1.5 sm:left-1.5 sm:right-1.5 flex items-center justify-between px-1 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-[8px] sm:text-[10px] font-bold shadow-sm">
                  <span className="hidden sm:inline text-slate-800 truncate max-w-[55px]">
                    {item.shortName}
                  </span>
                  <span className={`${item.accentColor} mx-auto sm:mx-0 font-extrabold`}>
                    {item.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Text & Actions Layer */}
        <div className="relative z-30 pointer-events-auto">
          {/* Main Statement: OLX for DTU */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-950 tracking-tight leading-[1.08] mb-3 sm:mb-4 px-2 sm:px-0 max-w-[320px] sm:max-w-none mx-auto drop-shadow-sm">
            <span className="text-emerald-600">OLX</span> For DTU
          </h1>

          {/* Subtext below OLX for DTU */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto mb-6 sm:mb-8 px-2 flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold shadow-sm">
              <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
              <span>Verified DTU Students Only</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-600 text-xs sm:text-sm font-semibold">Buy & Sell Directly Within Campus</span>
          </p>

          {/* Prominent Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-6 sm:mb-8 relative group z-40"
          >
            <div className="relative flex items-center bg-white border-2 border-slate-200 group-hover:border-campus-lime focus-within:border-campus-lime rounded-2xl sm:rounded-full p-1.5 shadow-md transition-all">
              <Search size={20} className="ml-3 sm:ml-4 text-slate-400 pointer-events-none flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scientific calculators, cycles, coolers, lab kits, books..."
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 px-3 py-2.5 text-xs sm:text-base outline-none min-w-0"
              />
              <Button
                type="submit"
                variant="lime"
                size="md"
                className="flex-shrink-0 font-black px-4 sm:px-7 text-xs sm:text-sm shadow-glow cursor-pointer text-slate-950"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Dual Buy & Sell Action Buttons */}
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 relative z-40">
            {/* Buy / Browse Button */}
            <button
              type="button"
              onClick={() => onNavigate('browse')}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-white border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-900 font-extrabold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer min-h-[46px]"
            >
              <ShoppingBag size={18} className="text-emerald-600 stroke-[2.5]" />
              <span>Buy Items</span>
            </button>

            {/* Sell Button */}
            <Button
              variant="lime"
              size="lg"
              onClick={handlePostItem}
              leftIcon={<PlusCircle size={18} className="stroke-[2.5]" />}
              className="shadow-glow font-black text-xs sm:text-sm px-6 sm:px-8 py-3.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform min-h-[46px] text-slate-950"
            >
              Sell Gear
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

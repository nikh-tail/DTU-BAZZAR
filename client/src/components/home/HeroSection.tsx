import React, { useState } from 'react';
import { Search, PlusCircle, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
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

  // 6 Floating Campus Gear Items (SharePal Style)
  const floatingItems = [
    {
      id: 'laptop',
      name: 'Coding Monitor / Laptop',
      price: '₹6,200',
      tag: 'Tech',
      category: 'ELECTRONICS',
      search: 'Monitor',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80',
      position: 'top-6 left-3 xl:left-12',
      rotation: '-rotate-6',
      animation: 'animate-float-slow',
      borderGlow: 'hover:border-cyan-400/80 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]',
    },
    {
      id: 'calculator',
      name: 'Casio 991EX Classwiz',
      price: '₹790',
      tag: 'Must-Have',
      category: 'ELECTRONICS',
      search: 'Calculator',
      image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=300&auto=format&fit=crop&q=80',
      position: 'top-4 right-3 xl:right-12',
      rotation: 'rotate-6',
      animation: 'animate-float-fast',
      borderGlow: 'hover:border-campus-lime/80 hover:shadow-[0_0_25px_rgba(198,255,61,0.35)]',
    },
    {
      id: 'bicycle',
      name: 'Hero Sprint Geared Bike',
      price: '₹3,400',
      tag: 'Campus Ride',
      category: 'CYCLES',
      search: 'Cycle',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&auto=format&fit=crop&q=80',
      position: 'top-48 left-1 xl:left-8',
      rotation: '-rotate-3',
      animation: 'animate-float-medium',
      borderGlow: 'hover:border-amber-400/80 hover:shadow-[0_0_25px_rgba(251,191,36,0.35)]',
    },
    {
      id: 'books',
      name: 'CSE Books & Notes Bundle',
      price: '₹850',
      tag: 'Curriculum',
      category: 'BOOKS_ACADEMICS',
      search: 'Books',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80',
      position: 'top-52 right-1 xl:right-8',
      rotation: 'rotate-3',
      animation: 'animate-float-slow',
      borderGlow: 'hover:border-rose-400/80 hover:shadow-[0_0_25px_rgba(244,63,94,0.35)]',
    },
    {
      id: 'cloths',
      name: 'White Lab Coat (Size 40)',
      price: '₹260',
      tag: 'Lab Kit',
      category: 'LAB_STATIONERY',
      search: 'Lab Coat',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      position: 'bottom-2 left-6 xl:left-20',
      rotation: '-rotate-6',
      animation: 'animate-float-fast',
      borderGlow: 'hover:border-emerald-400/80 hover:shadow-[0_0_25px_rgba(52,211,153,0.35)]',
    },
    {
      id: 'cooler',
      name: 'Symphony Room Cooler',
      price: '₹2,450',
      tag: 'Hostel Gear',
      category: 'HOSTEL_ESSENTIALS',
      search: 'Cooler',
      image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&auto=format&fit=crop&q=80',
      position: 'bottom-2 right-6 xl:right-20',
      rotation: 'rotate-6',
      animation: 'animate-float-medium',
      borderGlow: 'hover:border-purple-400/80 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]',
    },
  ];

  return (
    <section className="relative pt-6 pb-12 sm:pt-14 sm:pb-20 overflow-hidden text-center select-none">
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

      {/* 3. 3D Floating Campus Gear Cutouts (SharePal Style) - Visible on lg+ screens */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none max-w-7xl mx-auto z-10">
        {floatingItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate('browse', { category: item.category, search: item.search })}
            className={`absolute ${item.position} ${item.rotation} ${item.animation} pointer-events-auto cursor-pointer group`}
            title={`Buy / Sell ${item.name} on DTU Bazaar`}
          >
            <div
              className={`flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl bg-[#0B1120]/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${item.borderGlow}`}
            >
              {/* Product Thumbnail with cutout glow */}
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50 flex-shrink-0 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Text / Price Chip */}
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-campus-lime uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <ArrowUpRight size={10} className="text-slate-400 group-hover:text-campus-lime transition-colors" />
                </div>
                <div className="text-xs font-bold text-white max-w-[110px] truncate group-hover:text-campus-lime transition-colors">
                  {item.name}
                </div>
                <div className="text-[11px] font-extrabold text-slate-300">
                  {item.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Main Hero Central Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-20">
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

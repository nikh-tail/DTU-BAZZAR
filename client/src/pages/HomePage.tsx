import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection.js';
import { CategoryGrid } from '../components/home/CategoryGrid.js';
import { SubCategoryChips } from '../components/home/SubCategoryChips.js';
import { TrendingSection } from '../components/home/TrendingSection.js';
import { TrustZeroSection } from '../components/home/TrustZeroSection.js';
import { CampusStats } from '../components/home/CampusStats.js';
import { StudentTestimonials } from '../components/home/StudentTestimonials.js';
import { Listing } from '../types/index.js';
import { ListingService } from '../services/listing.service.js';
import { PlusCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button.js';
import { useAuth } from '../context/AuthContext.js';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [trendingListings, setTrendingListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const res = await ListingService.getListings({
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          limit: 8,
          sortBy: 'popular',
        });
        if (res.success) {
          setTrendingListings(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [selectedCategory]);

  const handleCategorySelect = (catId: string) => {
    onNavigate('browse', { category: catId });
  };

  const handleSubCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
  };

  const handleSellerBannerClick = () => {
    if (!isAuthenticated) {
      openAuthModal('SIGNUP');
    } else {
      onNavigate('create-listing');
    }
  };

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        onSearch={(q) => onNavigate('browse', { search: q })}
        onNavigate={onNavigate}
      />

      {/* 2. SharePal 4-Grid Colorful Bleed Categories */}
      <CategoryGrid onSelectCategory={handleCategorySelect} />

      {/* 3. High-Energy Campus Seller Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C152B] via-[#161F3B] to-[#0C152B] border border-slate-700/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campus-lime/10 border border-campus-lime/30 text-campus-lime text-xs font-bold">
              <Sparkles size={13} />
              <span>Campus Seller Program</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Got unused textbooks, cycles, or coolers?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Post your listing in 60 seconds and connect directly with juniors & batchmates across hostels.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 z-10">
            <Button
              variant="lime"
              size="lg"
              onClick={handleSellerBannerClick}
              leftIcon={<PlusCircle size={18} className="stroke-[2.5]" />}
              className="shadow-glow font-extrabold"
            >
              List an Item Now
            </Button>
          </div>

          {/* Background ambient lighting */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-campus-lime/10 blur-3xl rounded-full pointer-events-none" />
        </div>
      </section>

      {/* 4. Sub-category Pills */}
      <SubCategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={handleSubCategorySelect}
      />

      {/* 5. Trending Campus Finds Grid */}
      <TrendingSection
        listings={trendingListings}
        onSelectListing={(id) => onNavigate('listing-detail', { id })}
        onViewAll={() => onNavigate('browse')}
      />

      {/* 6. ZERO Statements Trust Section */}
      <TrustZeroSection />

      {/* 7. Live Campus Stats */}
      <CampusStats />

      {/* 8. DTU Student Reviews */}
      <StudentTestimonials />
    </div>
  );
};

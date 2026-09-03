import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Listing } from '../types/index.js';
import { ListingService } from '../services/listing.service.js';
import { ListingCard } from '../components/listings/ListingCard.js';
import { ListingFilters } from '../components/listings/ListingFilters.js';
import { EmptyState } from '../components/common/EmptyState.js';

interface BrowsePageProps {
  initialParams?: {
    search?: string;
    category?: string;
    condition?: string;
    campusLocation?: string;
  };
  onNavigate: (page: string, params?: any) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({ initialParams = {}, onNavigate }) => {
  const [filters, setFilters] = useState({
    search: initialParams.search || '',
    category: initialParams.category || 'ALL',
    condition: initialParams.condition || '',
    campusLocation: initialParams.campusLocation || 'ALL',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await ListingService.getListings({
        search: filters.search.trim() || undefined,
        category: filters.category !== 'ALL' ? filters.category : undefined,
        condition: filters.condition || undefined,
        campusLocation: filters.campusLocation !== 'ALL' ? filters.campusLocation : undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        sortBy: filters.sortBy,
        limit: 30,
      });

      if (res.success) {
        setListings(res.data);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'ALL',
      condition: '',
      campusLocation: 'ALL',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen pb-20 sm:pb-8">
      {/* Top Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Search by title, brand, specs, or department..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-campus-lime text-slate-900 placeholder-slate-400 rounded-2xl pl-11 pr-10 py-2.5 text-sm outline-none transition-all font-medium"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange({ search: '' })}
                className="absolute right-3 text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Mobile Filter Drawer Button & Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-800 text-xs font-bold shadow-sm"
            >
              <SlidersHorizontal size={15} className="text-emerald-600" />
              <span>Filters ({Object.values(filters).filter((v) => v && v !== 'ALL' && v !== 'newest').length})</span>
            </button>

            {/* Result count */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{listings.length}</strong> of {totalCount} items
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ListingFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-full max-w-xs bg-white h-full p-6 overflow-y-auto border-l border-slate-200 shadow-2xl z-10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-base">Filter Listings</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X size={18} />
                </button>
              </div>

              <ListingFilters
                filters={filters}
                onChange={(f) => {
                  handleFilterChange(f);
                }}
                onReset={handleResetFilters}
              />

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-full bg-campus-lime text-slate-950 font-black text-sm shadow-glow"
                >
                  Apply Filters ({listings.length} Results)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listings Feed Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 rounded-3xl bg-slate-200 animate-pulse border border-slate-300" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              title="No items found"
              description="Try adjusting your keywords, price filter, or category to find what you need."
              actionText="Clear All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {listings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  onClick={() => onNavigate('listing-detail', { id: item.id })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

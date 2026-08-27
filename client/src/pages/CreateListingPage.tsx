import React, { useState, useEffect } from 'react';
import { PlusCircle, Sparkles, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES, DTU_HOSTELS, CONDITION_LABELS } from '../utils/constants.js';
import { ListingCategory, ListingCondition } from '../types/index.js';
import { ImageUploader } from '../components/common/ImageUploader.js';
import { Button } from '../components/common/Button.js';
import { PaywallModal } from '../components/common/PaywallModal.js';
import { ListingService } from '../services/listing.service.js';
import { UserService } from '../services/user.service.js';
import { useAuth } from '../context/AuthContext.js';

interface CreateListingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CreateListingPage: React.FC<CreateListingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ListingCategory>('ELECTRONICS');
  const [condition, setCondition] = useState<ListingCondition>('LIKE_NEW');
  const [campusLocation, setCampusLocation] = useState(user?.hostel || DTU_HOSTELS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quota & Paywall state
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [maxLimit, setMaxLimit] = useState<number>(user?.maxListings || 3);
  const [isProSeller, setIsProSeller] = useState<boolean>(Boolean(user?.isProSeller));

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await UserService.getMyListings();
        if (res.success && res.data?.stats) {
          setActiveCount(res.data.stats.activeCount || 0);
          if (res.data.stats.maxListings) {
            setMaxLimit(res.data.stats.maxListings);
          }
          if (res.data.stats.isProSeller !== undefined) {
            setIsProSeller(res.data.stats.isProSeller);
          }
        }
      } catch {
        // Fallback to user session values
        setMaxLimit(user?.maxListings || 3);
        setIsProSeller(Boolean(user?.isProSeller));
      }
    };
    fetchQuota();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Pre-check local quota
    if (activeCount >= maxLimit) {
      setIsPaywallOpen(true);
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setError('Please provide a descriptive title (at least 3 characters).');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setError('Please write a brief description of the item condition and specifications (at least 10 characters).');
      return;
    }

    if (!price || Number(price) < 0) {
      setError('Please enter a valid price in ₹.');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('campusLocation', customLocation.trim() || campusLocation);

      files.forEach((file) => {
        formData.append('images', file);
      });

      const res = await ListingService.createListing(formData);

      if (res.success && res.data) {
        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C6FF3D', '#E8397A', '#7C4DFF', '#00E5FF'],
        });

        // Navigate to the newly created listing
        setTimeout(() => {
          onNavigate('listing-detail', { id: res.data.id });
        }, 800);
      }
    } catch (err: any) {
      if (err.response?.status === 402 || err.response?.data?.code === 'PAYWALL_LIMIT_REACHED') {
        setIsPaywallOpen(true);
        setError(err.response?.data?.message || 'Free listing limit reached. Upgrade to Pro for ₹10 to continue!');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to publish listing.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeSuccess = (updatedUser: any) => {
    setMaxLimit(10);
    setIsProSeller(true);
    setError(null);
  };

  const isLimitReached = activeCount >= maxLimit;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to marketplace</span>
        </button>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-campus-lime/20 border border-campus-lime/30 text-campus-lime flex items-center justify-center font-black">
              ⚡
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                List an Item for DTU Students
              </h1>
              <p className="text-xs text-slate-400">
                Post your unused books, electronics, coolers, or cycle in under 60 seconds
              </p>
            </div>
          </div>

          {/* Quota Indicator Bar */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">Quota: </span>
              <strong className={isLimitReached ? 'text-rose-400' : 'text-campus-lime'}>
                {activeCount}/{maxLimit}
              </strong>
              <span className="text-[11px] text-slate-400 ml-1">
                {isProSeller ? '(Campus Pro 🌟)' : '(Free Tier)'}
              </span>
            </div>

            {!isProSeller && (
              <button
                type="button"
                onClick={() => setIsPaywallOpen(true)}
                className="px-3 py-1.5 rounded-2xl bg-campus-lime text-black font-extrabold text-xs shadow-glow active:scale-95 transition-all flex items-center gap-1"
              >
                <Zap size={13} className="fill-black" />
                <span>Upgrade ₹10</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quota Limit Reached Banner */}
      {isLimitReached && (
        <div className="mb-6 p-4 rounded-3xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🔒</span>
            <div>
              <strong className="block text-sm font-black text-amber-100">
                Free Limit Reached ({activeCount}/{maxLimit} Items Active)
              </strong>
              <span>Upgrade for ₹10 to unlock up to 10 active listings and Pro Seller badge.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPaywallOpen(true)}
            className="px-4 py-2 rounded-2xl bg-amber-400 text-black font-black text-xs hover:bg-amber-300 active:scale-95 transition-all shadow-md flex-shrink-0"
          >
            Unlock 10 Slots (₹10)
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Listing Form */}
      <form onSubmit={handleSubmit} className="bg-campus-card border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Photo Uploader */}
        <ImageUploader files={files} onChange={setFiles} maxFiles={5} />

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Listing Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Casio 991EX Calculator / Hero Sprint Cycle / Symphony Desert Cooler"
            className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white placeholder-slate-500 rounded-2xl px-4 py-3 text-sm outline-none transition-all"
            required
          />
        </div>

        {/* Category & Condition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ListingCategory)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white rounded-2xl px-4 py-3 text-sm outline-none transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Item Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ListingCondition)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white rounded-2xl px-4 py-3 text-sm outline-none transition-all"
            >
              {(Object.keys(CONDITION_LABELS) as ListingCondition[]).map((cond) => (
                <option key={cond} value={cond}>
                  {CONDITION_LABELS[cond].label} — {CONDITION_LABELS[cond].desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Campus Handover Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Price (₹ INR) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 750"
              className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white placeholder-slate-500 rounded-2xl px-4 py-3 text-sm outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Handover Location on Campus
            </label>
            <select
              value={campusLocation}
              onChange={(e) => setCampusLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white rounded-2xl px-4 py-3 text-sm outline-none transition-all"
            >
              {DTU_HOSTELS.map((h, i) => (
                <option key={i} value={h}>
                  📍 {h}
                </option>
              ))}
              <option value="Mic-Mac Canteen">📍 Mic-Mac Canteen</option>
              <option value="Open Air Theatre (OAT)">📍 Open Air Theatre (OAT)</option>
              <option value="Central Library Lawns">📍 Central Library Lawns</option>
              <option value="Mechanical Dept Lawn">📍 Mechanical Dept Lawn</option>
              <option value="Custom">📍 Custom Spot...</option>
            </select>
          </div>
        </div>

        {campusLocation === 'Custom' && (
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Specify Custom Campus Location
            </label>
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="e.g. Outside Amul Counter near Mech Block"
              className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white rounded-2xl px-4 py-3 text-sm outline-none"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Detailed Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe condition, age, reasons for selling, warranty, or relevant academic semester..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white placeholder-slate-500 rounded-2xl p-4 text-sm outline-none transition-all"
            required
          />
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-400 hover:text-white font-medium"
          >
            Cancel
          </button>

          <Button
            type="submit"
            variant="lime"
            size="lg"
            isLoading={isLoading}
            className="shadow-glow font-bold text-base px-8"
            leftIcon={<Sparkles size={18} />}
          >
            Publish to DTU Bazaar
          </Button>
        </div>
      </form>

      {/* Paywall Upgrade Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={handleUpgradeSuccess}
        currentCount={activeCount}
      />
    </div>
  );
};

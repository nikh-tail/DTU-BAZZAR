import React, { useState } from 'react';
import { Sparkles, CheckCircle2, QrCode, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { UserService } from '../../services/user.service.js';
import { useAuth } from '../../context/AuthContext.js';
import { User } from '../../types/index.js';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedUser: User) => void;
  currentCount?: number;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentCount = 3,
}) => {
  const { user, login, token } = useAuth();
  const [utrRef, setUtrRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UPI deep link for 1-tap mobile payment
  const upiId = 'nikhilrathorq@okaxis';
  const upiLink = `upi://pay?pa=${upiId}&pn=DTU%20Bazaar&am=10.00&cu=INR&tn=DTU%20Bazaar%20Pro%20Upgrade`;
  // Generate high-resolution QR code URL for ₹10 UPI payment
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiLink
  )}&bgcolor=0E1526&color=C6FF3D`;

  const handleUpgrade = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await UserService.upgradeSellerTier({
        paymentMode: 'UPI',
        utrReference: utrRef.trim() || undefined,
        amount: 10.0,
      });

      if (res.success && res.data?.user) {
        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C6FF3D', '#FFD700', '#00E5FF', '#E8397A'],
        });

        // Update local auth context with new user properties
        if (token) {
          login(token, res.data.user);
        }

        if (onSuccess) {
          onSuccess(res.data.user);
        }

        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to complete upgrade.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ Upgrade to Campus Seller Pro"
      subtitle="Free listing limit reached. Unlock up to 10 listings for just ₹10!"
      maxWidth="md"
    >
      <div className="space-y-5">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Quota Exhausted Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>
              Free Limit: <strong>{currentCount}/3 Listings Used</strong>
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
            Full
          </span>
        </div>

        {/* Pro Benefits Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-campus-card to-[#0F172A] border border-campus-lime/40 shadow-glow space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-campus-lime font-black text-sm">
              <Sparkles size={16} />
              <span>Campus Seller Pro Tier</span>
            </div>
            <span className="text-xl font-black text-white font-mono bg-campus-lime/20 border border-campus-lime text-campus-lime px-2.5 py-0.5 rounded-xl">
              ₹10 Only
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 size={15} className="text-campus-lime flex-shrink-0" />
              <span>
                <strong>10 Total Active Listings</strong> (7 additional item slots)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <Star size={15} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              <span>
                <strong>"Campus Pro 🌟" Badge</strong> displayed on all your listings
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <Zap size={15} className="text-campus-cyan flex-shrink-0" />
              <span>
                <strong>Priority Search Placement</strong> for faster sales
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <ShieldCheck size={15} className="text-campus-pink flex-shrink-0" />
              <span>
                <strong>Lifetime Pro Status</strong> for your DTU student account
              </span>
            </div>
          </div>
        </div>

        {/* QR Code & UPI Details */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Scan & Pay with Any UPI App
          </div>

          <div className="flex justify-center py-1">
            <div className="p-2 rounded-2xl bg-[#0E1526] border border-campus-lime/30 shadow-inner">
              <img
                src={qrCodeUrl}
                alt="₹10 UPI QR Code"
                className="w-36 h-36 rounded-xl object-contain mx-auto"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            UPI ID: <strong className="text-campus-lime select-all">{upiId}</strong>
          </div>

          {/* Mobile 1-Tap UPI App Button */}
          <div className="sm:hidden pt-1">
            <a
              href={upiLink}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all"
            >
              <span>📱 Open in GPay / PhonePe / Paytm</span>
            </a>
          </div>
        </div>

        {/* UTR Input (Optional) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            UPI Reference / UTR Number (Optional)
          </label>
          <input
            type="text"
            value={utrRef}
            onChange={(e) => setUtrRef(e.target.value)}
            placeholder="e.g. 423987102938 (12-digit Ref No)"
            className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all font-mono"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Maybe Later
          </Button>

          <Button
            type="button"
            variant="lime"
            size="lg"
            isLoading={isLoading}
            onClick={() => handleUpgrade()}
            className="flex-2 shadow-glow font-black text-sm"
            rightIcon={<Sparkles size={16} />}
          >
            Pay ₹10 & Unlock 10 Listings
          </Button>
        </div>
      </div>
    </Modal>
  );
};

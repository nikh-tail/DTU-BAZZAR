import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Star } from 'lucide-react';
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
  const { login, token } = useAuth();
  const [utrRef, setUtrRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UPI deep link for 1-tap mobile payment
  const upiId = 'nikhilrathorq@okaxis';
  const upiLink = `upi://pay?pa=${upiId}&pn=DTU%20Bazaar&am=10.00&cu=INR&tn=DTU%20Bazaar%20Pro%20Upgrade`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiLink
  )}&bgcolor=FFFFFF&color=000000`;

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
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C6FF3D', '#FFD700', '#00E5FF', '#E8397A'],
        });

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
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Quota Exhausted Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>
              Free Limit: <strong>{currentCount}/3 Listings Used</strong>
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
            Full
          </span>
        </div>

        {/* Pro Benefits Card */}
        <div className="p-4 rounded-3xl bg-lime-50/70 border border-lime-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-950 font-black text-sm">
              <Sparkles size={16} className="text-emerald-700" />
              <span>Campus Seller Pro Tier</span>
            </div>
            <span className="text-xl font-black font-mono bg-campus-lime border border-lime-300 text-slate-950 px-2.5 py-0.5 rounded-xl shadow-sm">
              ₹10 Only
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-800">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <span>
                <strong>10 Total Active Listings</strong> (7 additional item slots)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-800">
              <Star size={15} className="text-amber-500 fill-amber-400 flex-shrink-0" />
              <span>
                <strong>"Campus Pro 🌟" Badge</strong> displayed on all your listings
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-800">
              <Zap size={15} className="text-sky-600 flex-shrink-0" />
              <span>
                <strong>Priority Search Placement</strong> for faster sales
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-800">
              <ShieldCheck size={15} className="text-rose-500 flex-shrink-0" />
              <span>
                <strong>Lifetime Pro Status</strong> for your DTU student account
              </span>
            </div>
          </div>
        </div>

        {/* QR Code & UPI Details */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-center">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Scan & Pay with Any UPI App
          </div>

          <div className="flex justify-center py-1">
            <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <img
                src={qrCodeUrl}
                alt="₹10 UPI QR Code"
                className="w-36 h-36 rounded-xl object-contain mx-auto"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-600 font-medium">
            UPI ID: <strong className="text-emerald-700 select-all font-bold">{upiId}</strong>
          </div>

          {/* Mobile 1-Tap UPI App Button */}
          <div className="sm:hidden pt-1">
            <a
              href={upiLink}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
            >
              <span>📱 Open in GPay / PhonePe / Paytm</span>
            </a>
          </div>
        </div>

        {/* UTR Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            UPI Reference / UTR Number (Optional)
          </label>
          <input
            type="text"
            value={utrRef}
            onChange={(e) => setUtrRef(e.target.value)}
            placeholder="e.g. 423987102938 (12-digit Ref No)"
            className="w-full bg-slate-50 border border-slate-200 focus:border-campus-lime text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all font-mono font-medium"
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
            className="flex-2 shadow-glow font-black text-sm text-slate-950"
            rightIcon={<Sparkles size={16} />}
          >
            Pay ₹10 & Unlock 10 Listings
          </Button>
        </div>
      </div>
    </Modal>
  );
};

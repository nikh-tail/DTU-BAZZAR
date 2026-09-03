import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { IndianRupee, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
  originalPrice: number;
  onSubmitOffer: (offeredPrice: number, messageText?: string) => Promise<void>;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  isOpen,
  onClose,
  listingTitle,
  originalPrice,
  onSubmitOffer,
}) => {
  const [offerPrice, setOfferPrice] = useState<number>(Math.round(originalPrice * 0.9));
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const discount10 = Math.round(originalPrice * 0.9);
  const discount15 = Math.round(originalPrice * 0.85);
  const discount20 = Math.round(originalPrice * 0.8);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offerPrice <= 0) return;

    try {
      setIsLoading(true);
      await onSubmitOffer(offerPrice, message);
      onClose();
    } catch (err) {
      console.error('Failed to submit offer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Make a Price Offer"
      subtitle={`Negotiate directly with seller for "${listingTitle}"`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Original Price Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">Asking Price:</span>
          <span className="text-sm font-black text-slate-900">
            {formatCurrency(originalPrice)}
          </span>
        </div>

        {/* Quick percentage offer buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Quick Offers
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setOfferPrice(discount10)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                offerPrice === discount10
                  ? 'border-lime-400 bg-lime-100 text-slate-950 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] text-slate-500">-10%</div>
              <div>{formatCurrency(discount10)}</div>
            </button>

            <button
              type="button"
              onClick={() => setOfferPrice(discount15)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                offerPrice === discount15
                  ? 'border-lime-400 bg-lime-100 text-slate-950 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] text-slate-500">-15%</div>
              <div>{formatCurrency(discount15)}</div>
            </button>

            <button
              type="button"
              onClick={() => setOfferPrice(discount20)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                offerPrice === discount20
                  ? 'border-lime-400 bg-lime-100 text-slate-950 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] text-slate-500">-20%</div>
              <div>{formatCurrency(discount20)}</div>
            </button>
          </div>
        </div>

        {/* Custom Price Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Your Offer Amount (₹)
          </label>
          <div className="relative flex items-center">
            <IndianRupee size={18} className="absolute left-3.5 text-emerald-700 pointer-events-none" />
            <input
              type="number"
              min={1}
              max={originalPrice}
              value={offerPrice || ''}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              placeholder="e.g. 600"
              className="w-full bg-slate-50 border border-slate-200 focus:border-campus-lime text-emerald-700 font-black text-lg placeholder-slate-400 rounded-2xl pl-10 pr-4 py-3 outline-none transition-all shadow-inner"
              required
            />
          </div>
        </div>

        {/* Message Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Add a Note (Optional)
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Can meet at Mic-Mac canteen today if you accept!"
            className="w-full bg-slate-50 border border-slate-200 focus:border-campus-lime text-slate-900 placeholder-slate-400 rounded-2xl px-4 py-2.5 text-xs outline-none transition-all font-medium"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="lime"
            size="md"
            isLoading={isLoading}
            className="shadow-glow font-black text-xs sm:text-sm px-6 text-slate-950"
            rightIcon={<Sparkles size={16} />}
          >
            Send Offer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { IndianRupee, Send, Sparkles } from 'lucide-react';
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
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Asking Price:</span>
          <span className="text-sm font-black text-slate-200">
            {formatCurrency(originalPrice)}
          </span>
        </div>

        {/* Quick percentage offer buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Quick Offers
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setOfferPrice(discount10)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                offerPrice === discount10
                  ? 'border-campus-lime bg-campus-lime/15 text-campus-lime shadow-glow'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] text-slate-400">-10%</div>
              <div>{formatCurrency(discount10)}</div>
            </button>

            <button
              type="button"
              onClick={() => setOfferPrice(discount15)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                offerPrice === discount15
                  ? 'border-campus-lime bg-campus-lime/15 text-campus-lime shadow-glow'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] text-slate-400">-15%</div>
              <div>{formatCurrency(discount15)}</div>
            </button>

            <button
              type="button"
              onClick={() => setOfferPrice(discount20)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                offerPrice === discount20
                  ? 'border-campus-lime bg-campus-lime/15 text-campus-lime shadow-glow'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] text-slate-400">-20%</div>
              <div>{formatCurrency(discount20)}</div>
            </button>
          </div>
        </div>

        {/* Custom Price Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Your Offer Amount (₹)
          </label>
          <div className="relative flex items-center">
            <IndianRupee size={18} className="absolute left-3.5 text-campus-lime pointer-events-none" />
            <input
              type="number"
              min={1}
              max={originalPrice}
              value={offerPrice || ''}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              placeholder="e.g. 600"
              className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-campus-lime font-black text-lg placeholder-slate-500 rounded-2xl pl-10 pr-4 py-3 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Message Note */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Add a Note (Optional)
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Can meet at Mic-Mac canteen today if you accept!"
            className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white placeholder-slate-500 rounded-2xl px-4 py-2.5 text-xs outline-none transition-all"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="lime"
            size="md"
            isLoading={isLoading}
            className="flex-1 shadow-glow font-bold"
            rightIcon={<Send size={16} />}
          >
            Send Offer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { getImageUrl, handleImageError } from '../../utils/imageUrl.js';

interface ImageLightboxProps {
  isOpen: boolean;
  images: { id: string; url: string; order?: number }[];
  initialIndex?: number;
  category?: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  category,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];
  const resolvedUrl = getImageUrl(currentImage?.url, category);

  const handleNext = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-fadeIn">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-sm font-semibold text-slate-300">
          Photo {currentIndex + 1} of {images.length}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden">
        <img
          src={resolvedUrl}
          alt={`Listing preview ${currentIndex + 1}`}
          onError={(e) => handleImageError(e, category)}
          className={`max-w-full max-h-[85vh] object-contain transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-slate-700/80 text-white hover:bg-black/90 active:scale-95 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-slate-700/80 text-white hover:bg-black/90 active:scale-95 transition-all"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-2xl bg-black/80 backdrop-blur-md border border-slate-800 max-w-[90vw] overflow-x-auto no-scrollbar">
          {images.map((img, idx) => {
            const thumbUrl = getImageUrl(img.url, category);
            return (
              <button
                key={img.id || idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-14 h-11 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  currentIndex === idx ? 'border-campus-lime shadow-glow scale-105' : 'border-slate-800 opacity-60'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Thumb ${idx + 1}`}
                  onError={(e) => handleImageError(e, category)}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

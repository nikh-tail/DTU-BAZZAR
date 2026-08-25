import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ListingImage } from '../../types/index.js';

interface ListingGalleryProps {
  images: ListingImage[];
  title: string;
  onOpenLightbox?: (index: number) => void;
}

export const ListingGallery: React.FC<ListingGalleryProps> = ({
  images,
  title,
  onOpenLightbox,
}) => {
  const defaultImages =
    images && images.length > 0
      ? images
      : [{ id: '1', url: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=80', order: 0 }];

  const [activeIndex, setActiveIndex] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? defaultImages.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === defaultImages.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    if (onOpenLightbox) {
      onOpenLightbox(activeIndex);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div
        onClick={handleImageClick}
        className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 group cursor-pointer"
      >
        <img
          src={defaultImages[activeIndex]?.url}
          alt={`${title} - Photo ${activeIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Maximize2 size={14} className="text-campus-lime" />
            <span>Click to Fullscreen Zoom</span>
          </span>
        </div>

        {/* Navigation Arrows */}
        {defaultImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image index pill */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
          {activeIndex + 1} / {defaultImages.length}
        </div>
      </div>

      {/* Thumbnails strip */}
      {defaultImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {defaultImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? 'border-campus-lime shadow-glow scale-105'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

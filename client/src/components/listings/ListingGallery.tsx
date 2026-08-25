import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ListingImage } from '../../types/index.js';

interface ListingGalleryProps {
  images: ListingImage[];
  title: string;
}

export const ListingGallery: React.FC<ListingGalleryProps> = ({ images, title }) => {
  const defaultImages =
    images && images.length > 0
      ? images
      : [{ id: '1', url: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=80', order: 0 }];

  const [activeIndex, setActiveIndex] = useState(0);

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? defaultImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === defaultImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 group">
        <img
          src={defaultImages[activeIndex]?.url}
          alt={`${title} - Photo ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {defaultImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100"
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

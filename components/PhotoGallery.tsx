
import React, { useState, useRef } from 'react';
import { Photo } from '../types';

interface Props { photos: Photo[]; accentColor: string; }

export const PhotoGallery: React.FC<Props> = ({ photos, accentColor }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveIndex(index);
    }
  };

  const handleImageLoad = (id: number) => { setLoadedImages(prev => ({ ...prev, [id]: true })); };

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 py-6 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {photos.map((photo) => (
          <div key={photo.id} className="flex-none w-[82vw] max-w-[320px] snap-center relative">
            <div className="relative group overflow-hidden rounded-[3rem] bg-white p-4 shadow-2xl transition-all border-4 border-white transform active:scale-105">
              <div className="relative w-full aspect-[4/5] bg-pink-50 rounded-[2rem] overflow-hidden">
                <img src={photo.url} alt={photo.caption} onLoad={() => handleImageLoad(photo.id)} className={`w-full h-full object-cover transition-all duration-1000 ${loadedImages[photo.id] ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} />
                {!loadedImages[photo.id] && (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl animate-spin">
                     ⌛
                  </div>
                )}
              </div>
              <div className="mt-6 pb-2 text-center">
                <p className="text-pink-600 font-dancing text-2xl">{photo.caption}</p>
              </div>
              <div className="absolute top-6 right-6 text-2xl animate-pulse">
                 {photo.emoji}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3 mt-4">
        {photos.map((_, i) => (
          <div key={i} className={`h-2.5 rounded-full transition-all duration-500 ${i === activeIndex ? `w-10 ${accentColor}` : 'w-2.5 bg-pink-200'}`} />
        ))}
      </div>
    </div>
  );
};

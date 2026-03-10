import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

const statsBadges = [
  {
    icon: (
      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    ),
    value: '4.9/5',
    label: 'Avaliação média'
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    value: '90%',
    label: 'Taxa de precisão'
  },
  {
    icon: (
      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
      </svg>
    ),
    value: '2.5k+',
    label: 'Traders ativos'
  }
];

export const StatsBadgesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true
    },
    [
      AutoScroll({
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: false
      })
    ]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi]);

  const duplicatedBadges = [...statsBadges, ...statsBadges, ...statsBadges];

  return (
    <div className="lg:hidden mt-8 overflow-hidden" ref={emblaRef}>
      <div className="flex gap-3">
        {duplicatedBadges.map((badge, index) => (
          <div
            key={index}
            className="flex-[0_0_auto] bg-gradient-to-br from-[#00bcff]/10 to-[#00e0d6]/10 backdrop-blur-sm border border-[#00bcff]/30 rounded-full px-4 py-2.5 shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00bcff] to-[#00e0d6] flex items-center justify-center flex-shrink-0">
                {badge.icon}
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-white font-bold text-base">{badge.value}</span>
                <span className="text-[#9ca3af] text-xs">{badge.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

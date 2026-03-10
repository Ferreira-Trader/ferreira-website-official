import React, { useRef, useEffect, useState } from "react";

interface BonusCard {
  image: string;
  number: string;
  title?: string;
  subtitle?: string;
}

interface BonusCarouselProps {
  cards: BonusCard[];
}

export const BonusCarousel: React.FC<BonusCarouselProps> = ({ cards }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll infinito
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = scrollContainer.scrollLeft;

    const scroll = () => {
      if (!isDragging && scrollContainer) {
        scrollPosition += 0.8;

        const cardWidth = scrollContainer.scrollWidth / (cards.length * 2);
        const maxScroll = cardWidth * cards.length;

        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
          scrollContainer.scrollLeft = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
        animationId = requestAnimationFrame(scroll);
      } else if (!isDragging) {
        animationId = requestAnimationFrame(scroll);
      }
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isDragging, cards.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Duplica os cards para criar o efeito infinito
  const duplicatedCards = [...cards, ...cards];

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto w-full pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {duplicatedCards.map((card, index) => (
          <div
            key={`${card.number}-${index}`}
            className="relative flex-shrink-0 w-[200px] md:w-[220px] lg:w-[240px]"
          >
            <img
              className="w-full h-auto rounded-lg object-cover pointer-events-none select-none"
              alt={`Bonus ${card.number}`}
              src={card.image}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Gradiente esquerda */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-40 lg:w-48 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />

      {/* Gradiente direita */}
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-40 lg:w-48 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </div>
  );
};

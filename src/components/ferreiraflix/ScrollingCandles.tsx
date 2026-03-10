import { useEffect, useState } from 'react';

interface CandleProps {
  className?: string;
  initialY: number;
  speed?: number;
  size?: 'sm' | 'md' | 'lg';
}

const Candle = ({ className, initialY, speed = 0.3, size = 'md' }: CandleProps) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  const sizeClasses = {
    sm: 'w-8 h-20 md:w-10 md:h-24',
    md: 'w-12 h-32 md:w-14 md:h-36',
    lg: 'w-16 h-40 md:w-20 md:h-48'
  };

  return (
    <div
      className={`absolute transition-transform duration-100 block ${className}`}
      style={{
        transform: `translateY(-${offsetY}px)`,
        top: `${initialY}px`
      }}
    >
      <img
        src="/ferreiraflix/union.svg"
        alt=""
        className={`${sizeClasses[size]} opacity-20`}
      />
    </div>
  );
};

export const ScrollingCandles = () => {
  return (
    <>
      <Candle className="-left-4 md:-left-8 lg:-left-16 xl:-left-24" initialY={50} speed={0.25} size="md" />
      <Candle className="-left-2 md:-left-6 lg:-left-12 xl:-left-20" initialY={300} speed={0.35} size="sm" />
      <Candle className="-left-6 md:-left-10 lg:-left-14 xl:-left-24" initialY={550} speed={0.28} size="lg" />

      <Candle className="-right-4 md:-right-8 lg:-right-16 xl:-right-24" initialY={150} speed={0.32} size="lg" />
      <Candle className="-right-2 md:-right-6 lg:-right-12 xl:-right-20" initialY={400} speed={0.27} size="md" />
      <Candle className="-right-6 md:-right-10 lg:-right-14 xl:-right-24" initialY={650} speed={0.3} size="sm" />
    </>
  );
};

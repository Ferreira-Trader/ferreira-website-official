import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const modules = [
  { id: 1, image: '/ferreiraflix/aa-1.webp', alt: 'Do Básico ao Avançado' },
  { id: 2, image: '/ferreiraflix/aa-2.webp', alt: 'Gestões Otimizadas' },
  { id: 3, image: '/ferreiraflix/aa-3.webp', alt: 'Introdução à Criptomoeda' },
  { id: 4, image: '/ferreiraflix/aa-4.webp', alt: 'Técnicas de Análises em Cripto' },
  { id: 5, image: '/ferreiraflix/aa-5.webp', alt: 'Introdução ao Forex' },
  { id: 6, image: '/ferreiraflix/aa-6.webp', alt: 'Introdução ao Mindset Profissional' },
  { id: 7, image: '/ferreiraflix/aa-7.webp', alt: 'Aulas ao Vivo' },
  { id: 8, image: '/ferreiraflix/aa-8.webp', alt: 'Recomendação de Carteira Cripto' },
];

export function ModulesCarousel() {
  const [itemsPerView, setItemsPerView] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 7
  );
  const [currentIndex, setCurrentIndex] = useState(modules.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef<HTMLDivElement>(null);

  const extendedModules = [...modules, ...modules, ...modules];

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 3 : 7);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      if (currentIndex >= modules.length * 2) {
        setCurrentIndex(modules.length);
      } else if (currentIndex < modules.length) {
        setCurrentIndex(modules.length + modules.length - 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          className="w-12 h-12 rounded-full border-2 border-white bg-[#2a2a2a] flex items-center justify-center hover:bg-[#3a3a3a] transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white stroke-[2.5]" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full border-2 border-white bg-[#2a2a2a] flex items-center justify-center hover:bg-[#3a3a3a] transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white stroke-[2.5]" />
        </button>
      </div>

      <div className="w-screen overflow-hidden">
        <div
          ref={transitionRef}
          className="flex gap-3"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none',
          }}
        >
          {extendedModules.map((module, index) => (
            <div
              key={`${module.id}-${index}`}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / itemsPerView}% - ${(12 * (itemsPerView - 1)) / itemsPerView}px)` }}
            >
              <img
                src={module.image}
                alt={module.alt}
                className="w-full h-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          (window as any).lenis?.scrollTo('#checkout-section');
        }}
        className="w-[85%] md:w-full max-w-md h-16 md:h-[70px] bg-[#fc0820] rounded-full hover:bg-[#fc0820]/90 text-base md:text-lg mt-4 relative overflow-hidden cursor-pointer font-['MADE_Outer_Sans',sans-serif] font-normal text-white"
      >
        <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></span>
        <span className="relative z-10">Entrar no FerreiraFlix</span>
      </button>
    </div>
  );
}

import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

const testimonials = [
  "/neuron/feesback1.png",
  "/neuron/feesback2.png",
  "/neuron/feesback3.png",
  "/neuron/feesback4.png",
  "/neuron/feesback5.png",
  "/neuron/feesback6.png",
  "/neuron/feesback7.png",
  "/neuron/feesback8.jpg",
  "/neuron/feesback9.jpg",
];

const repeatedTestimonials = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
  ...testimonials,
  ...testimonials,
  ...testimonials,
];

export const TestimonialsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      draggable: true,
      dragFree: false,
      containScroll: false,
    },
    [
      AutoScroll({
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: false,
      })
    ]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;

    let resumeTimeout: NodeJS.Timeout;

    const onPointerDown = () => {
      autoScroll.stop();
      clearTimeout(resumeTimeout);
    };

    const onPointerUp = () => {
      resumeTimeout = setTimeout(() => {
        autoScroll.reset();
        autoScroll.play();
      }, 1500);
    };

    const onMouseEnter = () => {
      autoScroll.stop();
      clearTimeout(resumeTimeout);
    };

    const onMouseLeave = () => {
      resumeTimeout = setTimeout(() => {
        autoScroll.reset();
        autoScroll.play();
      }, 500);
    };

    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerUp);

    const emblaNode = emblaApi.rootNode();
    emblaNode.addEventListener('mouseenter', onMouseEnter);
    emblaNode.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearTimeout(resumeTimeout);
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('pointerUp', onPointerUp);
      emblaNode.removeEventListener('mouseenter', onMouseEnter);
      emblaNode.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [emblaApi]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex cursor-grab active:cursor-grabbing">
          {repeatedTestimonials.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="flex-[0_0_auto] w-[308px] h-[482px] rounded-[25px] border-2 border-solid border-[#5b5b5b] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] mx-[15px] flex items-center justify-center p-4 overflow-hidden"
            >
              <img
                src={image}
                alt={`Depoimento ${index + 1}`}
                className="w-full h-full object-contain rounded-[20px] pointer-events-none select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

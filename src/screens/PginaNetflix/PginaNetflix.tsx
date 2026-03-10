import React, { useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useCountUp } from "../../hooks/useCountUp";
import { BonusCarousel } from "../../components/ferreiraflix/BonusCarousel";
import { ModulesCarousel } from "../../components/ferreiraflix/ModulesCarousel";
import { ScrollingCandles } from "../../components/ferreiraflix/ScrollingCandles";
import { Plus, X } from "lucide-react";

const CountUpNumber: React.FC<{ value: string }> = ({ value }) => {
  const hasPrefix = value.startsWith('+');
  const numericValue = parseInt(value.replace(/\D/g, ''), 10);
  const { count, elementRef } = useCountUp({
    end: numericValue,
    duration: 2000,
    startOnView: true
  });

  const formattedCount = value.startsWith('0') && value.length === 2
    ? count.toString().padStart(2, '0')
    : count.toString();

  return (
    <div ref={elementRef}>
      {hasPrefix && '+'}{formattedCount}
    </div>
  );
};

const AutoScrollCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = scrollContainer.scrollLeft;

    const scroll = () => {
      if (!isPaused && !isDragging && scrollContainer) {
        scrollPosition += 0.5;

        const maxScroll = scrollContainer.scrollWidth / 2;

        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
        animationId = requestAnimationFrame(scroll);
      }
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, isDragging]);

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
    setIsPaused(false);
  };

  const duplicatedImages = [...images, ...images];

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto w-full pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {duplicatedImages.map((img, index) => (
        <img
          key={index}
          className="w-64 h-[380px] rounded-none object-cover flex-shrink-0 pointer-events-none"
          alt="Result" 
          src={img}
        /> 
      ))}
    </div>
  );
};

const learningBenefitsLeft = [
  {
    icon: "/ferreiraflix/olho.svg",
    text: "Interpretar o mercado",
    subtext: " como um profissional",
  },
  {
    icon: "/ferreiraflix/mente.svg",
    text: " operar sem medo.",
    prefix: "Desenvolver a mentalidade de um trader profissional e",
  },
  {
    icon: "/ferreiraflix/candle.svg",
    text: " padrões mais lucrativos",
    prefix: "Os",
    suffix: " do mercado",
  },
];

const learningBenefitsRight = [
  {
    icon: "/ferreiraflix/check.svg",
    text: "Melhorar",
    subtext: " a leitura gráfica",
  },
  {
    icon: "/ferreiraflix/cifrao.svg",
    text: " transforma conhecimento em resultados",
    prefix: "Um método validado que",
  },
  {
    icon: "/ferreiraflix/ampulheta.svg",
    text: "Gerenciar seu capital",
    suffix: " de forma efetiva",
  },
];

const statsData = [
  { number: "+75", top: "Aulas do zero", bottom: "ao avançado" },
  { number: "35", top: "Aulas sobre", bottom: "Opções Binárias" },
  { number: "20", top: "Aulas sobre", bottom: "Criptomoedas" },
  { number: "+10", top: "Aulas sobre", bottom: "Forex" },
  { number: "14", top: "Aulas sobre", bottom: "Mindset" },
  { number: "6", top: "Aulas sobre", bottom: "gestão de capital" },
]; 

const platformModules = [
  {
    text: "Ler o mercado",
    subtext: " como fazem os traders profissionais",
    price: "R$ 2997",
    dark: true,
  },
  { text: "Forex", prefix: "Introdução ao ", price: "R$ 697", dark: false },
  { text: "Cripto", prefix: "Módulos sobre ", price: " R$ 997", dark: true },
  {
    text: "Método operacional",
    subtext: " aplicado e comprovado",
    price: "R$ 1997",
    dark: false,
  },
  {
    text: "Aulas sobre mentalidade",
    subtext: " para se tornar\num trader de sucesso",
    price: "R$ 997",
    dark: true,
    multiline: true,
  },
  {
    text: "gerenciamento lucrativo",
    prefix: "Planilha de ",
    price: "R$ 1597",
    dark: false,
  },
  {
    text: "Aulas atualizadas",
    subtext: " mensalmente",
    price: "Valor inestimável",
    priceRed: true,
    dark: true,
  },
  {
    text: "passo a passo simples",
    prefix: "O ",
    subtext: " e direto para\nse tornar consistente",
    price: "Valor inestimável",
    priceRed: true,
    dark: false,
    multiline: true,
  },
];

const bonusCards = [
  { image: "/ferreiraflix/cc1.webp", number: "1" },
  { image: "/ferreiraflix/cc2.webp", number: "2" },
  { image: "/ferreiraflix/cc3.webp", number: "3" },
  { image: "/ferreiraflix/cc4.webp", number: "4" },
  { image: "/ferreiraflix/cc5.webp", number: "5" },
  { image: "/ferreiraflix/cc6.webp", number: "6" },
  { image: "/ferreiraflix/cc7.webp", number: "7" },
  { image: "/ferreiraflix/cc8.webp", number: "8" },
  { image: "/ferreiraflix/cc9.webp", number: "9" },
  { image: "/ferreiraflix/cc10.webp", number: "10" },
];

const bonusAccordionItems = [
  {
    title: "Como alcançar os ",
    highlight: "primeiros R$ 10.000,00",
    titleEnd: " com Operações Binárias",
    description: "Módulo completo com o passo a passo para alcançar os primeiros R$10.000."
  },
  {
    title: "Gravações de ",
    highlight: "aulas educacionais ao vivo",
    titleEnd: "",
    description: "Módulo com gravações dos nossos encontros ao vivo de toda quinta-feira."
  },
  {
    title: "Ferramentas no ",
    highlight: "TradingView",
    titleEnd: "",
    description: "Uma aula voltada às ferramentas mais assertivas para analisar o gráfico através do trading view."
  },
  {
    title: "Operacional para ",
    highlight: "futuros em Cripto",
    titleEnd: "",
    description: "Módulo voltado às análises técnicas e fundamentalistas para serem utilizadas no mercado futuro."
  },
  {
    title: "Leitura de ",
    highlight: "pavios",
    titleEnd: "",
    description: "Módulo completo ensinando a importância dos pavios e como identificar a direção do preço através deles."
  },
  {
    title: "Padronização ",
    highlight: "operacional",
    titleEnd: "",
    description: "O passo a passo completo para você aumentar a sua assertividade."
  },
  {
    title: "Evite um ",
    highlight: "loss",
    titleEnd: "",
    description: "Filtros e gatilhos em m2 e 30s para garantir uma melhor análise e evitar um loss."
  },
  {
    title: "Análises ",
    highlight: "on-chain",
    titleEnd: "",
    description: "Módulo com análises mais assertivas e seguras destacando a importância dos filtros e gatilhos."
  },
  {
    title: "Como prever a ",
    highlight: "próxima vela",
    titleEnd: "",
    description: "Módulo onde você vai aprender a antecipar o movimento da próxima vela com segurança e precisão."
  },
  {
    title: "",
    highlight: "Contexto",
    titleEnd: " de mercado",
    description: "Descubra através do contexto de mercado o próximo movimento do preço e utilize-o para pegar as melhores operações."
  }
];

const testimonialImages = [
  "/ferreiraflix/image-5.png",
  "/ferreiraflix/image.png",
  "/ferreiraflix/image-1.png",
  "/ferreiraflix/image-2.png",
  "/ferreiraflix/image-3.png",
  "/ferreiraflix/image-4.png",
  "/ferreiraflix/image-6.png",
];

const resultImages = [
  "/ferreiraflix/image-8.png",
  "/ferreiraflix/image-7.png",
  "/ferreiraflix/image-9.png",
  "/ferreiraflix/image-10.png",
  "/ferreiraflix/trade-analise.webp",
  "/ferreiraflix/melhor-invest.webp",
  "/ferreiraflix/lucro-em-dolar.webp",
  "/ferreiraflix/aula-vale-milhoes.webp",
  "/ferreiraflix/8k-de-lucro.webp",
  "/ferreiraflix/placas.webp",
  "/ferreiraflix/placa-10k-2.webp",
  "/ferreiraflix/placa-10k4.webp",
  "/ferreiraflix/placa-10k.webp",
  "/ferreiraflix/placa-10k-5.webp",
  "/ferreiraflix/placa-10k-3.webp",
  "/ferreiraflix/placa-50k.webp",
  "/ferreiraflix/placa-100k.webp",
];

const faqItems = [
  {
    question: "Quais são as formas de pagamento?",
    answer: "É possível fazer o pagamento via boleto, pix ou cartão de crédito."
  },
  {
    question: "Por quanto tempo terei acesso aos módulos?",
    answer: "12 meses é o período de tempo que você terá acesso a todas as aulas e atualizações dentro da plataforma."
  },
  {
    question: "Ainda não tenho resultados no mercado. O Ferreiraflix é para mim?",
    answer: "O Ferreiraflix serve para todos os perfis. Se o que você quer é fazer dinheiro com mercado, não tenha dúvidas se é para você."
  },
  {
    question: "Como vou receber acesso ao curso?",
    answer: "Ao efetuar o pagamento, o seu acesso chegará imediatamente no seu e-mail. Tenha atenção ao cadastrar seus dados."
  },
];

export const PginaNetflix = (): JSX.Element => {
  const scrollToCheckout = () => {
    (window as any).lenis?.scrollTo('#checkout-section');
  };

  return (
    <div className="bg-black w-full min-h-screen relative overflow-x-hidden">
      <a
        href="https://ferreiratrader.link/suporte?text=Oi!%20Estou%20no%20site%20de%20vendas%20do%20FerreiraFlix%20e%20tenho%20uma%20d%C3%BAvida%2C%20pode%20me%20ajudar%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-6 top-8 z-50 animate-swing"
      >
        <div className="relative w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-[20px] flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] transition-shadow duration-300">
          <svg
            viewBox="0 0 32 32"
            fill="white"
            className="w-9 h-9"
          >
            <path d="M16.002 3.2c-7.066 0-12.8 5.734-12.8 12.8 0 2.262.587 4.395 1.613 6.24l-1.707 6.24 6.4-1.68c1.76.933 3.76 1.44 5.867 1.44 7.066 0 12.8-5.734 12.8-12.8s-5.734-12.8-12.8-12.8zm0 23.467c-1.92 0-3.733-.507-5.28-1.387l-.373-.213-3.84 1.013 1.013-3.733-.24-.4c-.96-1.6-1.493-3.467-1.493-5.413 0-5.867 4.773-10.667 10.667-10.667s10.667 4.8 10.667 10.667-4.8 10.667-10.667 10.667zm5.867-7.787c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.347-.507-2.56-1.6-.96-.853-1.6-1.92-1.787-2.24-.187-.32-.02-.507.133-.667.147-.147.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.267-.64-.533-.533-.72-.533h-.613c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.24 3.413 5.44 4.787.76.32 1.347.507 1.813.667.76.24 1.453.213 2 .133.613-.08 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.267-.213-.587-.373z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF1E1E] rounded-full border-2 border-black flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">1</span>
          </div>
        </div>
      </a>
      <div className="relative z-10 w-full">
        <header className="relative w-full">
          <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-80 md:hidden"
              alt="Netflix BG Mobile"
              src="/ferreiraflix/mobile1.png"
            />
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-80 hidden md:block"
              alt="Netflix BG"
              src="/ferreiraflix/netflix-bg-1.png"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-64 md:pt-16 lg:pt-24 pb-16 md:pb-16 lg:pb-24 max-w-7xl">

          <div className="flex flex-col items-center lg:items-start gap-8 lg:gap-12 relative z-10">
            <div className="flex flex-col items-center lg:items-start gap-6">
              <img
                className="w-36 md:w-64 lg:w-[305px] h-auto"
                alt="Ferreiraflix"
                src="/ferreiraflix/ferreiraflix-2.svg"
              /> 

<p className="text-center lg:text-left font-['MADE_Outer_Sans',sans-serif] text-white/85 text-[19px] md:text-[28px] lg:text-[40px] leading-[120%] max-w-3xl antialiased font-semibold">
  Aprenda a lucrar no mercado financeiro e <span className="text-[#FF1E1E]">faça seus primeiros <span className="text-[#FC0532] whitespace-nowrap">R$ 10.000,00</span></span> com um método validado há mais de 6 anos.
</p>


            </div>

            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <Button
                onClick={scrollToCheckout}
                className="w-full h-16 md:h-20 lg:h-[81px] bg-[#fc0820] rounded-full hover:bg-[#fc0820]/90 text-base md:text-lg relative overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></span>
                <span className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white relative z-10 pointer-events-none">
                  Quero Aprender
                </span>
              </Button>
            </div>
          </div>
          </div>
        </header>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 max-w-7xl">
          <div className="w-full flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-lg md:text-3xl lg:text-[40px] font-['MADE_Outer_Sans',sans-serif] font-normal text-white leading-tight max-w-4xl">
  O treinamento completo para
  <br className="hidden lg:block" />
  você ter resultados no mercado!
</h2>

              <p className="text-base md:text-lg lg:text-xl font-['MADE_Outer_Sans',sans-serif] leading-relaxed max-w-3xl">
                <span className="text-white">Domine os conceitos principais para operar com confiança e</span>
                <br />
                <span className="text-[#fc0820]">transformar o mercado na sua principal fonte de renda principal:</span>
              </p>
            </div>

<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl">
  {statsData.map((stat, index) => (
    <Card
  className="
    bg-[#141414]
    border border-transparent
    ring-0 ring-offset-0
    rounded-lg md:!rounded-none
  "
    >
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          {/* Número */}
          <div
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-['MADE_Outer_Sans',sans-serif] font-bold leading-none antialiased bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #B83280 0%, #FF1E1E 100%)",
            }}
          >
            <CountUpNumber value={stat.number} />
          </div>

          {/* Texto */}
          <div className="flex flex-col leading-tight">
            <p className="text-xs sm:text-sm md:text-base text-white/45 font-medium">
              {stat.top}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white font-semibold">
              {stat.bottom}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
        

            <button
              onClick={scrollToCheckout}
              className="w-[85%] md:w-full max-w-md h-16 md:h-[70px] bg-[#fc0820] rounded-full hover:bg-[#fc0820]/90 text-base md:text-lg mt-4 relative overflow-hidden font-['MADE_Outer_Sans',sans-serif] font-normal text-white cursor-pointer"
            >
              <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></span>
              <span className="relative z-10">Entrar no FerreiraFlix</span>
            </button>
          </div>
        </section> 
 
       <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 max-w-7xl">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center overflow-visible">

    {/* IMAGEM */}
    <div className="order-2 lg:order-1 flex justify-center lg:justify-start lg:-translate-x-32 xl:-translate-x-48">
  <img
    className="
      w-full
      max-w-sm sm:max-w-md
      lg:max-w-none
      lg:scale-140 xl:scale-150
      h-auto
      object-cover
      drop-shadow-[0_0_48px_rgba(30,58,138,0.35)]
    "
    alt="Monitor"
    src="/ferreiraflix/monitor-1.png"
  />
</div>


    {/* TEXTO */}
    <article className="order-1 lg:order-2 flex flex-col gap-6">
      <div className="flex flex-row items-start gap-3">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-['MADE_Outer_Sans',sans-serif] font-bold leading-tight text-white">
          Conheça o
        </h2>
        <img
          className="h-8 md:h-10 lg:h-12 w-auto"
          alt="Ferreiraflix"
          src="/ferreiraflix/image copy copy.png"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xl md:text-2xl lg:text-3xl text-white font-['MADE_Outer_Sans',sans-serif] font-bold leading-tight">
          A plataforma que ensina você a operar de forma lucrativa{" "}
          <span className="text-[#E50914]">
            mesmo que nunca tenha feito uma entrada antes!
          </span>
        </p>

        <p className="text-base md:text-lg text-white/70 font-['MADE_Outer_Sans',sans-serif] leading-relaxed">
          Através da Psicologia Gráfica, um método que permite antecipar os movimentos do mercado sem depender de indicadores. Com isso você aprende a tomar decisões estratégicas e operar com confiança!
        </p>
      </div>

      <img className="w-full max-w-sm" alt="Frame" src="/ferreiraflix/frame-401.svg" />

      <p className="text-lg md:text-xl text-white font-['MADE_Outer_Sans',sans-serif] font-bold leading-tight">
        Tudo o que você precisa para operar com segurança, reunido em um só lugar!
      </p>
    </article>
  </div>
</section>




        <div className="w-full py-12 md:py-16">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative bg-black px-4">
              <img
                src="/ferreiraflix/group_61.svg"
                alt="Divider"
                className="w-8 h-8"
              />
            </div>
          </div>
        </div>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-12 md:py-16 lg:py-24 max-w-7xl">
          <div className="flex flex-col items-center gap-8 lg:gap-12">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/15 blur-[60px] rounded-full"></div>
              <img
                src="/ferreiraflix/formacao.svg"
                alt="Formação"
                className="
                  w-52 h-52           /* mobile – maior e nítido */
                  md:w-40 md:h-40     /* tablet */
                  lg:w-[222px] lg:h-[222px] /* desktop */
                  relative z-10
                "
              />
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-[32px] text-center text-white font-['MADE_Outer_Sans',sans-serif] font-semibold leading-tight max-w-lg">
              Veja tudo que
              <br />
              você vai aprender:
            </h2>

            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6 w-full">
              <div className="flex flex-col gap-3 md:gap-4 lg:gap-6">
                {learningBenefitsLeft.map((benefit, index) => (
                  <Card
                    key={index}
                    className="flex flex-col items-center gap-3 p-3 md:p-6 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] h-full"
                  >
                    <CardContent className="flex flex-col md:flex-row items-center gap-3 md:gap-2.5 p-0 w-full">
                      <img
                        className="w-10 md:w-12 h-10 md:h-12 flex-shrink-0"
                        alt="Group"
                        src={benefit.icon}
                      />
                      <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-xs md:text-base text-center md:text-left">
                        {benefit.prefix && (
                          <span className="text-[#7d7d7d]">{benefit.prefix} </span>
                        )}
                        <span className="text-white font-semibold">{benefit.text}</span>
                        {benefit.subtext && (
                          <span className="text-[#7d7d7d]">{benefit.subtext}</span>
                        )}
                        {benefit.suffix && (
                          <span className="text-[#7d7d7d]">{benefit.suffix}</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col gap-3 md:gap-4 lg:gap-6">
                {learningBenefitsRight.map((benefit, index) => (
                  <Card
                    key={index}
                    className="flex flex-col items-center gap-3 p-3 md:p-6 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] h-full"
                  >
                    <CardContent className="flex flex-col md:flex-row items-center gap-3 md:gap-2.5 p-0 w-full">
                      <img
                        className="w-10 md:w-12 h-10 md:h-12 flex-shrink-0"
                        alt="Group"
                        src={benefit.icon}
                      />
                      <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-xs md:text-base text-center md:text-left">
                        {benefit.prefix && (
                          <span className="text-[#7d7d7d]">{benefit.prefix} </span>
                        )}
                        <span className="text-white font-semibold">{benefit.text}</span>
                        {benefit.subtext && (
                          <span className="text-[#7d7d7d]">{benefit.subtext}</span>
                        )}
                        {benefit.suffix && (
                          <span className="text-[#7d7d7d]">{benefit.suffix}</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <button
              onClick={scrollToCheckout}
              className="w-full max-w-md h-16 md:h-[70px] bg-[#fc0820] rounded-full hover:bg-[#fc0820]/90 text-base md:text-lg mt-8 relative overflow-hidden cursor-pointer font-['MADE_Outer_Sans',sans-serif] font-normal text-white"
            >
              <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></span>
              <span className="relative z-10">Entrar no FerreiraFlix</span>
            </button>
          </div>
        </section>

        <img
          className="w-full max-w-7xl mx-auto px-4"
          alt="Frame"
          src="/ferreiraflix/frame-403.svg"
        />

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 max-w-7xl">
          <Card className="bg-[#141414] rounded-3xl overflow-visible border-0 p-6 md:p-8 lg:p-10 relative">
            <img
  className="
    absolute
    -top-8
    right-[-2px] md:-right-8
    w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
    object-contain
    z-10
  "
  alt="Bonus badge"
  src="/ferreiraflix/group_63.png"
/>

            <CardContent className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10 p-0">
              <div className="flex flex-col gap-6 w-full lg:w-[400px] lg:flex-shrink-0">
                <div className="flex items-center gap-2.5 p-2 bg-black rounded-full w-fit">
                  <div className="flex items-center">
                    {testimonialImages.map((img, index) => (
                      <img
                        key={index}
                        className="w-8 h-8 rounded-full border border-[#010d15] object-cover -ml-2 first:ml-0"
                        alt="Image"
                        src={img}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pr-2">
                    <img
                      className="w-12 h-2"
                      alt="Vector"
                      src="/ferreiraflix/vector.svg"
                    />
                    <p className="text-white text-[9.5px] font-['MADE_Outer_Sans',sans-serif] font-normal whitespace-nowrap">
                      4.9 / 5
                    </p>
                  </div>
                </div>

                <h2
  className="
    text-lg md:text-3xl lg:text-[34px]
    font-['MADE_Outer_Sans',sans-serif]
    font-semibold
    leading-snug 
    text-white/70
    max-w-[520px]
    line-clamp-6
    text-center lg:text-left
  "
>
  Confira os resultados reais de pessoas comuns que aprenderam a fazer  <br />
  dinheiro ao entrar para o FerreiraFlix:
</h2>


              </div>

              <AutoScrollCarousel images={resultImages} />
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 max-w-7xl relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-screen flex justify-center overflow-hidden pointer-events-none z-0">
            <img
              className="w-full h-auto opacity-60"
              alt="Background decoration"
              src="/ferreiraflix/group_71.svg"
            />
          </div>
          <div className="flex flex-col items-center gap-6 relative z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/15 blur-[50px] rounded-full"></div>
              <img
                className="w-20 md:w-40 lg:w-36 h-auto relative z-10"
                alt="Group"
                src="/ferreiraflix/top-10-seal.svg"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-xl md:text-3xl lg:text-5xl text-center text-white font-['MADE_Outer_Sans',sans-serif] leading-tight">
                Entrando para o FerreiraFlix
                <br />
                As 10 Aulas Essenciais para
                <br />
                Acelerar sua Jornada no Mercado!
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-center text-white font-['MADE_Outer_Sans',sans-serif] leading-relaxed max-w-4xl mx-auto">
                <span className="font-normal">Além do conteúdo principal, você terá acesso </span>
                <span className="text-gray-400">a um conjunto de aulas fundamentais que vão otimizar sua curva de aprendizado e </span>
                <span className="text-red-600 font-semibold">garantir resultados mais rápidos e consistentes.</span>
              </p>
            </div>
          </div>

          <div className="mt-8 lg:mt-12 relative z-20">
            <BonusCarousel cards={bonusCards} />
          </div>

          <div className="mt-8 lg:mt-12 max-w-4xl mx-auto relative z-20">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="flex flex-col gap-4 w-full"
            >
              {bonusAccordionItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-[#1a1a1a] border-0 rounded-none overflow-hidden"
                >
                  <AccordionTrigger
                    className="group px-6 py-5 font-['MADE_Outer_Sans',sans-serif] font-normal text-white text-base md:text-lg hover:no-underline text-left data-[state=open]:bg-[#0a0a0a]"
                    customIcon={
                      <div className="relative shrink-0 w-6 h-6">
                        <Plus className="absolute inset-0 w-6 h-6 text-white transition-opacity duration-200 group-data-[state=open]:opacity-0" strokeWidth={3} />
                        <X className="absolute inset-0 w-6 h-6 text-[#fc0820] transition-opacity duration-200 opacity-0 group-data-[state=open]:opacity-100" strokeWidth={3} />
                      </div>
                    }
                  >
                    <span>
                      <span className="text-[#9f9f9f]">{item.title}</span>
                      <span className="text-[#fc0820]">{item.highlight}</span>
                      <span className="text-[#9f9f9f]">{item.titleEnd}</span>
                    </span>
                  </AccordionTrigger>
                  {item.description && (
                    <AccordionContent className="px-6 pb-5 pt-2 bg-[#0a0a0a]">
                      <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white/70 text-sm md:text-base">
                        {item.description}
                      </p>
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center gap-6 lg:gap-8 mb-8">
              <img
                className="w-12 md:w-16 h-auto"
                alt="Group"
                src="/ferreiraflix/group-65.svg"
              />

              <h2 className="text-2xl md:text-3xl lg:text-[32px] text-center text-white font-['MADE_Outer_Sans',sans-serif] leading-tight max-w-2xl">
                Todas as aulas que você precisa para dominar o mercado – em um só lugar!
              </h2>
            </div>
          </div>

          <ModulesCarousel />
        </section> 

        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 max-w-4xl">
          <h2
            className="text-2xl md:text-3xl lg:text-[32px] text-center font-['MADE_Outer_Sans',sans-serif] leading-tight mb-12 relative z-10"
            style={{
              background: 'radial-gradient(50% 50% at 50% 12%, rgba(255,255,255,1) 0%, rgba(159,159,159,1) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Veja tudo que você recebe
            <br />
            dentro da plataforma:
          </h2>

          <Card className="bg-[#00000066] rounded-sm overflow-hidden border-0 relative z-10">
            <CardContent className="p-0 w-full">
              {platformModules.map((module, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 ${module.dark ? "bg-[#141414]" : ""}`}
                >
                  <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-sm md:text-base flex-1">
                    {module.prefix && (
                      <span className="text-[#7d7d7d]">{module.prefix}</span>
                    )}
                    <span className="text-white">{module.text}</span>
                    {module.subtext && (
                      <span className="text-[#7d7d7d]">{module.subtext}</span>
                    )}
                  </p>
                  <p className={`font-['MADE_Outer_Sans',sans-serif] font-normal text-sm md:text-base whitespace-nowrap ${module.priceRed ? "text-redx" : "text-white"}`}>
                    {module.price}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section> 

        <section id="checkout-section" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 max-w-7xl scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <Card className="relative rounded-[32px] bg-[#1a1a1a] border-0">
              <CardContent className="flex flex-col items-center gap-6 p-6 md:p-8">
                <img
                  className="absolute -top-12 w-20 h-20 md:w-24 md:h-24"
                  alt="Group"
                  src="/ferreiraflix/group-66.png"
                />

                <div className="flex flex-col items-center gap-4 w-full mt-8">
                  <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white text-base md:text-lg text-center leading-relaxed">
                    Vendido separadamente, o valor<br />
                    total seria <span className="line-through text-[#fc0820]">R$ 4.799,00 ,</span><br />
                    mas hoje você terá acesso por:
                  </p>

                  <div className="flex flex-col items-center gap-2 my-4">
                    <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-center">
                      <span className="text-white text-base">12x de </span>
                      <span className="text-[#fc0820] text-4xl md:text-5xl lg:text-[56px] font-bold">
                        R$ 41,06
                      </span>
                    </p>
                    <p className="text-white text-base">ou R$ 397,00 à vista</p>
                  </div>

                  <a
                    href="https://pay.hotmart.com/S100822439E?checkoutMode=10&sck=9fb8aa2a212342e3945ac6c59c1c0b44-9f79dcadd9a4473484a804455aafd6a9&"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full h-16 md:h-[70px] rounded-full bg-[#fc0820] hover:bg-[#fc0820]/90 text-base md:text-lg relative overflow-hidden cursor-pointer">
                      <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></span>
                      <span className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white relative z-10 pointer-events-none">
                        Liberar meu acesso agora
                      </span>
                    </Button>
                  </a>

                  <img
                    className="w-52 md:w-48 mt-2"
                    alt="Formas de pagamento"
                    src="/ferreiraflix/formas-de-pagamento.svg"
                  />

                  <div className="flex flex-col items-center gap-2 mt-4">
                    <p className="font-['MADE_Outer_Sans',sans-serif] font-bold text-[#fc0820] text-sm md:text-base text-center">
                      Oferta disponível por tempo limitado!
                    </p>
                    <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white text-sm md:text-base text-center">
                      O que está esperando para dar o primeiro<br />
                      passo rumo aos seus resultados?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <article className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
              <img
                className="w-48 md:w-40 lg:w-48 h-auto"
                alt="Group"
                src="/ferreiraflix/group-18.svg"
              />

              <h3 className="font-['MADE_Outer_Sans',sans-serif] font-bold text-white text-2xl md:text-3xl uppercase">
                GARANTIA DE RISCO ZERO!
              </h3>

              <p className="font-['MADE_Outer_Sans',sans-serif] font-bold text-[#fc0820] text-xl md:text-[22px]">
                O Risco (se é que existe) é todo meu!
              </p>

              <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white text-sm md:text-base leading-relaxed">
                Para mim é fundamental que sua satisfação seja garantida, por isso eu libero 7 dias para você decidir se vale a pena ou não.
              </p>

              <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white text-sm md:text-base leading-relaxed">
                Caso não seja o suficiente ou o que você esperava, basta entrar em contato diretamente comigo ou com meu time de suporte dentro do prazo de 7 dias que devolvemos 100% do seu dinheiro.
              </p>

              <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white text-sm md:text-base leading-relaxed">
                Eu garanto que a satisfação é garantida e que o produto atenderá 100% das suas expectativas!
              </p>
            </article>
          </div>
        </section>

        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 max-w-7xl">
          <div className="absolute inset-0 overflow-visible pointer-events-none">
            <ScrollingCandles />
          </div>

          <div className="flex flex-col gap-8 lg:gap-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <h2 className="font-['MADE_Outer_Sans',sans-serif] font-normal text-[#dddddd] text-2xl md:text-3xl">
                Perguntas frequentes
              </h2>

              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-4 w-full"
              >
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-[#1a1a1a] border-0 rounded-none overflow-hidden"
                  >
                    <AccordionTrigger
                      className="group px-6 py-5 font-['MADE_Outer_Sans',sans-serif] font-normal text-[#9f9f9f] text-base md:text-lg hover:no-underline text-left data-[state=open]:bg-[#0a0a0a] data-[state=open]:text-[#fc0820]"
                      customIcon={
                        <div className="relative shrink-0 w-6 h-6">
                          <Plus className="absolute inset-0 w-6 h-6 text-white transition-opacity duration-200 group-data-[state=open]:opacity-0" strokeWidth={3} />
                          <X className="absolute inset-0 w-6 h-6 text-[#fc0820] transition-opacity duration-200 opacity-0 group-data-[state=open]:opacity-100" strokeWidth={3} />
                        </div>
                      }
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 pt-2 bg-[#0a0a0a]">
                      <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white/70 text-sm md:text-base">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <a
              href="https://ferreiratrader.link/suporte?text=Oi!%20Estou%20no%20site%20de%20vendas%20do%20FerreiraFlix%20e%20tenho%20uma%20d%C3%BAvida%2C%20pode%20me%20ajudar%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 mx-auto"
            >
              <img
                src="/ferreiraflix/whatsapp-logo.svg"
                alt="WhatsApp"
                className="w-24 h-24 md:w-40 md:h-40"
              />
              <div className="flex flex-col items-center gap-2">
                <p className="font-['MADE_Outer_Sans',sans-serif] font-bold text-white text-xl md:text-2xl text-center">
                  Dúvidas? Fale com o suporte agora!
                </p>
                <p className="font-['MADE_Outer_Sans',sans-serif] font-normal text-white/70 text-base md:text-lg text-center">
                  Clique aqui para ter Suporte.
                </p>
              </div>
            </a>
          </div>
        </section>

        <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <p className="font-['MADE_Outer_Sans',sans-serif] font-medium text-[#616161] text-[10px] md:text-xs text-center md:text-left max-w-2xl leading-relaxed">
              Aviso Legal: &quot;Nenhuma informação contida neste produto deve ser
              interpretada como uma afirmação da obtenção de resultados. Qualquer
              referência ao desempenho passado ou potencial de uma estratégia
              abordada no conteúdo não é, e não deve ser interpretada como uma
              recomendação ou como garantia de qualquer resultado
              específico.&quot; Copyright © 2025 Inc. Todos os direitos
              reservados.
            </p>

            <img
              className="w-40 md:w-48 h-auto flex-shrink-0"
              alt="Ferreiraflix"
              src="/ferreiraflix/ferreiraflix.svg"
            />
          </div>
        </footer>
      </div>
    </div>
  );
};

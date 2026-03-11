import { ArrowRight as ArrowRightIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { FeaturesCarousel } from "../components/neuron/FeaturesCarousel";
import { TestimonialsCarousel } from "../components/neuron/TestimonialsCarousel";
import { PurchaseNotifications } from "../components/neuron/PurchaseNotifications";
import { StatsBadgesCarousel } from "../components/neuron/StatsBadgesCarousel";

const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 1500;
  let start: number | null = null;

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  const animation = (currentTime: number) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

const MobileCardsSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleCards.includes(index)) {
              setVisibleCards((prev) => [...prev, index].sort((a, b) => a - b));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      title: "Para quem está começando",
      description: "Não sabe por onde começar. A Neuron traduz o mercado em linguagem clara.",
    },
    {
      title: "Para quem estuda, mas não opera",
      description: "Tem conhecimento, mas trava na hora de clicar. A análise dá a confirmação que falta.",
    },
    {
      title: "Para quem opera, mas não é consistente",
      description: "Acerta, mas não lucra. A Neuron organiza sua leitura e identifica padrões",
    },
    {
      title: "Para quem quer se profissionalizar",
      description: "Já tem resultados, quer estrutura. Relatórios transformam achismo em dados.",
    },
  ];

  return (
    <div className="lg:hidden flex flex-col items-center gap-6">
      <div className="relative w-[172px] h-[172px] flex-shrink-0">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00bcff] via-[#00e0d6] to-[#00bcff] p-[1.5px]">
          <div className="w-full h-full rounded-full bg-[#020614] flex items-center justify-center overflow-hidden">
            <img
              className="w-full h-full rounded-full object-contain animate-spin-3d"
              alt="Neuron 3D"
              src="/neuron/neuron-3d-1.png"
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[340px] relative">
        {cards.map((card, index) => (
          <div key={index} className="relative">
            {index > 0 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#00bcff] to-transparent transition-all duration-700 ease-out"
                style={{
                  height: visibleCards.includes(index) ? '24px' : '0px',
                  top: '-24px',
                  opacity: visibleCards.includes(index) ? 1 : 0,
                }}
              />
            )}
            <div
              ref={(el) => (cardsRef.current[index] = el)}
              className={`mb-6 transition-all duration-700 ease-out ${
                visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <Card className="rounded-2xl border-2 border-solid border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] relative overflow-hidden group hover:border-[#00d4ff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,188,255,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00bcff]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <CardContent className="p-[20px] relative z-10">
                  <img
                    className="w-[32px] h-[32px] object-cover mx-auto mb-[16px]"
                    alt="Image"
                    src="/neuron/image-41.png"
                  />
                  <h3 className="[font-family:'Inter',Helvetica] font-black text-white text-base text-center tracking-[0] leading-[normal] mb-[12px]">
                    {card.title}
                  </h3>
                  <p className="[font-family:'Inter',Helvetica] font-medium text-[#9f9f9f] text-sm text-center tracking-[0] leading-[1.4]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const painPoints = [
  {
    title: "Estuda todo dia e continua perdido", 
    description:
      "Dedicou horas operando e mesmo assim não saiu do lugar, ou pior, saiu no prejuízo e sentia que não estava bom o suficiente e faltava algo",
    image: "/neuron/image-1.png",
  },
  {
    title: "Sabe onde analisar, mas não confia na análise",
    description:
      "Você identifica suporte, resistência, padrão... mas na hora de clicar, a dúvida grita mais alto. E quando não entra, o mercado vai sem você.",
    image: "/neuron/image-2.png",
  },
  {
    title: "O medo de errar é maior que a vontade de acertar",
    description:
      "Você fica travado esperando a entrada perfeita. Enquanto isso, o tempo passa, as oportunidades vão — e a frustração só aumenta.",
    image: "/neuron/image-3.png",
  },
];

const problemCards = [
  {
    title: "Não entende nada no gráfico",
    description:
      "Dedicou horas operando e mesmo assim não saiu do lugar, ou pior, saiu no prejuízo e sentia que não estava bom o suficiente e faltava algo", 
    image: "/neuron/image-4.png",
  },
  {
    title: "Ganha num dia, devolve no outro",
    description:
      "Você tem dias bons, mas não sustenta. A inconsistência acaba com seu lucro — e pior, sua confiança. Parece que está sempre voltando pro zero.",
    image: "/neuron/image-5.png",
  },
];

const targetAudienceCards = [
  {
    title: "Para você trade que..",
    description:
      "Para você trader que esta cansado de ver o grafico por horas e fica com medo de pegar entrada",
    position: "top-[3097px] left-[1010px]",
  },
  {
    title: "Para você trade que..",
    description:
      "Para você trader que esta cansado de ver o grafico por horas e fica com medo de pegar entrada",
    position: "top-[3434px] left-[911px]",
  },
  {
    title: "Para você trade que..",
    description:
      "Para você trader que esta cansado de ver o grafico por horas e fica com medo de pegar entrada",
    position: "top-[3097px] left-[63px]",
  },
  {
    title: "Para você trade que..",
    description:
      "Para você trader que esta cansado de ver o grafico por horas e fica com medo de pegar entrada",
    position: "top-[3434px] left-[150px]",
  },
];

const evenIfCards = [
  {
    text: "Tá começando do zero? ",
    description: "A IA traduz. Você aprende vendo as análises funcionarem.",
    icon: "user",
  },
  {
    text: "Já estuda mas trava na prática?",
    description: "A Neuron confirma sua leitura e tira a dúvida que paralisa.",
    icon: "chart",
  },
  {
    text: "Já opera mas quer consistência? ",
    description: "Os relatórios mostram onde você tá errando — pra você parar de repetir.",
    icon: "shield",
  },
];

const howItWorksSteps = [
  {
    number: "1",
    title: "Abra a Neuron",
    description:
      "Acesse de qualquer dispositivo.\n Fez login,tá dentro.",
    image: "/neuron/image-23.png",
    video: "/neuron/passo1.gif",
  },
  {
    number: "2",
    title: "Escolha o ativo ou mande um print",
    description:
      "Seleciona o par ou tira print e cola direto.\n A IA processa em segundos..", 
    image: "/neuron/image-23.png",
    video: "/neuron/passo2.gif",
  },
  {
    number: "3",
    title: "Receba a análise completa",
    description:
      "Contexto, zonas de interesse,\n gatilhos e nível de confiança.\n Tudo 100% explicado.",
    image: "/neuron/image-23.png",
    video: "/neuron/passo3.gif",
  },
];

const pricingPlans = [
  {
    name: "Mensal",
    priceMain: "R$197",
    priceDecimal: ",00",
    period: "/mês",
    description: "Perfeito para começar",
    savings: null,
    features: [
      "1.800 análises por mês",
      "Análise de I.A Gráfico",
      "Relatórios de Performance",
      "Registro de trades",
      "Integração com broker",
    ],
    excludedFeatures: [
      "Bônus: Material exclusivo",
      "App Gestão de Risco (R$297)",
      "App Plano de Trading (R$150)",
    ],
    note: "Cancele quando quiser",
    buttonText: "Assinar Mensal",
    buttonVariant: "secondary" as const,
    highlighted: false,
    url: "https://checkout.ferreiratrader.com.br/subscribe/a142bf91-6829-497e-be25-4a106acc32ba",
  },
  {
    name: "Semestral",
    priceMain: "R$797",
    priceDecimal: ",00",
    period: "/6 meses",
    description: "Economia de 33%",
    savings: "R$133 /mês",
    features: [
      "10.800 análises por semestre",
      "Análise de I.A Gráfico",
      "Relatórios de Performance",
      "Registro de trades",
      "Integração com broker ",
    ],
    excludedFeatures: [
      "Bônus: Material exclusivo",
      "App Gestão de Risco (R$297)",
      " App Plano de Trading (R$150)",
    ],
    buttonText: "Assinar Semestral!",
    buttonVariant: "secondary" as const,
    highlighted: false,
    url: "https://checkout.ferreiratrader.com.br/subscribe/a142c1d6-056f-4706-9cfd-ce8d90bdc833",
  },
  {
    name: "Anual",
    priceMain: "R$997",
    priceDecimal: ",00",
    period: "/ano",
    description: "Economia de 58%",
    savings: "R$83 /mês",
    features: [
      "23.000 análises por ano",
      "Análise de I.A Gráfico",
      "Relatórios de Performance",
      "Registro de trades",
      "Integração com broker ",
      "Bônus: Material exclusivo",
      "App Gestão de Risco (R$297)",
      "App Plano de Trading (R$150)",
    ],
    excludedFeatures: [],
    buttonText: "Assinar Anual",
    buttonVariant: "default" as const,
    highlighted: true,
    badge: "Mais Popular",
    url: "https://checkout.ferreiratrader.com.br/subscribe/a142bd0b-87a5-4608-afb3-0f1cb4c44720",
  },
];

const faqItems = [
  {
    question: "Preciso saber operar para usar a NEURON?",
    answer: "Não. A Neuron foi pensada pra qualquer nível. Se você tá começando, ela te ajuda a entender o que o gráfico está dizendo. Se você já opera, ela te dá a clareza que falta pra decidir com mais confiança.",
  },
  {
    question: "A NEURON funciona 24 horas por dia?",
    answer: " Sim. A plataforma fica disponível 24/7. Você pode enviar e fazer análises a qualquer momento — inclusive fora do horário de mercado, pra estudar gráficos passados e se preparar pro próximo pregão.",
  },
  {
    question: "Qual o valor mínimo para operar?",
    answer: "A Neuron é uma ferramenta de análise, não uma corretora. Você pode usar independente do seu capital. O valor mínimo pra operar depende da plataforma que você usa, não da Neuron.",
  },
  {
    question: "Como funciona a garantia de 7 dias?",
    answer: " Simples: você testa por 7 dias. Se não fizer sentido pra você, é só pedir o reembolso no suporte. Devolvemos 100% do valor, sem burocracia.",
  },
  {
     question: "A Neuron dá sinais de entrada?",
    answer: "Não do jeito que você tá acostumado a ver por aí. Ela não diz [compra agora] e pronto. Ela analisa o gráfico e te mostra o contexto: onde está a força, o risco e qual o nível de confiança. A decisão final é sua — e é isso que te torna um trader de verdade, não um seguidor de sinal.",
  },
  {
    question: " Funciona para Forex e Cripto?",
    answer: "Sim. A análise neural funciona pra qualquer gráfico de preço com candles. Binários, forex, cripto, ações — se tem vela, a Neuron lê.",
  },
  {
    question: "Preciso instalar algo ?",
    answer: " Não. A Neuron é 100% online. Funciona direto no navegador — no computador, tablet ou celular. Abriu, logou, tá pronto.",
  },
]; 

export const Desktop = (): JSX.Element => {
  const [activeHowItWorksTab, setActiveHowItWorksTab] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState<boolean>(false);
  const userPausedRef = useRef<boolean>(false);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      userPausedRef.current = true;
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onScroll = () => {
      const rect = video.getBoundingClientRect();
      const videoVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setShowFloatingBtn(!videoVisible);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        await video.play();
        setIsVideoPlaying(true);
      } catch (error) {
        console.log('Autoplay bloqueado, aguardando interação do usuário');
        setIsVideoPlaying(false);
      }
    };

    attemptAutoplay();

    const handleUserInteraction = () => {
      if (video.paused && !userPausedRef.current) {
        video.play().then(() => {
          setIsVideoPlaying(true);
        }).catch(() => {});
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,rgba(2,6,20,1)_0%,rgba(1,4,13,1)_57%,rgba(0,0,0,1)_100%)] w-full min-h-[10586px] relative">
      <PurchaseNotifications />

      {showFloatingBtn && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleVideo(); }}
          className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-[#00bcff]/90 hover:bg-[#00bcff] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,188,255,0.5)] transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
          aria-label={isVideoPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
        >
          <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
            <defs>
              <path id="circlePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
            </defs>
            <text fill="#000" fontSize="11" fontWeight="700" fontFamily="Inter, Helvetica, sans-serif" letterSpacing="3">
              <textPath href="#circlePath">
                {isVideoPlaying ? "PAUSAR VIDEO \u2022 PAUSAR VIDEO \u2022 " : "PLAY VIDEO \u2022 PLAY VIDEO \u2022 PLAY \u2022 "}
              </textPath>
            </text>
          </svg>
          {isVideoPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="relative z-10">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="relative z-10">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      )}

      <header className="flex flex-col items-center pt-[100px] md:pt-[149px] px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="animate-float-message-1 absolute top-[15%] left-[10%] opacity-0">
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00bcff]/8 to-[#00e0d6]/8 border border-[#00bcff]/20 backdrop-blur-sm">
              <span className="text-[#00bcff] text-xs font-medium [font-family:'Inter',Helvetica]">COMPRA</span>
            </div>
          </div>

          <div className="animate-float-message-2 absolute top-[25%] right-[15%] opacity-0">
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff6b6b]/8 to-[#ff8787]/8 border border-[#ff6b6b]/20 backdrop-blur-sm">
              <span className="text-[#ff6b6b] text-xs font-medium [font-family:'Inter',Helvetica]">VENDE</span>
            </div>
          </div>

          <div className="animate-float-message-3 absolute top-[40%] left-[8%] opacity-0">
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00bcff]/8 to-[#00e0d6]/8 border border-[#00bcff]/20 backdrop-blur-sm">
              <span className="text-[#00bcff] text-xs font-medium [font-family:'Inter',Helvetica]">COMPRA</span>
            </div>
          </div>

          <div className="animate-float-message-4 absolute top-[35%] right-[12%] opacity-0">
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff6b6b]/8 to-[#ff8787]/8 border border-[#ff6b6b]/20 backdrop-blur-sm">
              <span className="text-[#ff6b6b] text-xs font-medium [font-family:'Inter',Helvetica]">VENDE</span>
            </div>
          </div>

          <div className="animate-float-message-5 absolute top-[55%] left-[5%] opacity-0">
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00bcff]/8 to-[#00e0d6]/8 border border-[#00bcff]/20 backdrop-blur-sm">
              <span className="text-[#00bcff] text-xs font-medium [font-family:'Inter',Helvetica]">COMPRA</span>
            </div>
          </div>

          <div className="animate-float-message-6 absolute top-[60%] right-[8%] opacity-0">
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff6b6b]/8 to-[#ff8787]/8 border border-[#ff6b6b]/20 backdrop-blur-sm">
              <span className="text-[#ff6b6b] text-xs font-medium [font-family:'Inter',Helvetica]">VENDE</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
          <div className="animate-float-message-mobile-1 absolute top-[8%] left-[5%] opacity-0">
            <div className="px-2 py-1 rounded-md bg-gradient-to-r from-[#00bcff]/6 to-[#00e0d6]/6 border border-[#00bcff]/15 backdrop-blur-sm">
              <span className="text-[#00bcff] text-[10px] font-medium [font-family:'Inter',Helvetica]">COMPRA</span>
            </div>
          </div>

          <div className="animate-float-message-mobile-2 absolute top-[20%] right-[8%] opacity-0">
            <div className="px-2 py-1 rounded-md bg-gradient-to-r from-[#ff6b6b]/6 to-[#ff8787]/6 border border-[#ff6b6b]/15 backdrop-blur-sm">
              <span className="text-[#ff6b6b] text-[10px] font-medium [font-family:'Inter',Helvetica]">VENDE</span>
            </div>
          </div>

          <div className="animate-float-message-mobile-3 absolute top-[70%] left-[8%] opacity-0">
            <div className="px-2 py-1 rounded-md bg-gradient-to-r from-[#00bcff]/6 to-[#00e0d6]/6 border border-[#00bcff]/15 backdrop-blur-sm">
              <span className="text-[#00bcff] text-[10px] font-medium [font-family:'Inter',Helvetica]">COMPRA</span>
            </div>
          </div>

          <div className="animate-float-message-mobile-4 absolute top-[82%] right-[5%] opacity-0">
            <div className="px-2 py-1 rounded-md bg-gradient-to-r from-[#ff6b6b]/6 to-[#ff8787]/6 border border-[#ff6b6b]/15 backdrop-blur-sm">
              <span className="text-[#ff6b6b] text-[10px] font-medium [font-family:'Inter',Helvetica]">VENDE</span>
            </div>
          </div>
        </div>

        <img
          className="w-[200px] md:w-[299px] h-auto object-contain mb-[29px] relative z-10"
          alt="Neuron AI"
          src="/neuron/neuron-ai-4.png"
        />

 <h1 className="max-w-[920px] w-full [font-family:'Inter',Helvetica] font-semibold text-white text-[32px] md:text-[54px] lg:text-[64px] text-center tracking-[0] leading-[1.3] mb-[51px] px-4 relative z-10"> O gráfico já te mostra o que fazer. Você só precisa ver. </h1> 

        <p className="max-w-[790px] w-full [font-family:'Inter',Helvetica] font-normal text-white text-lg md:text-xl text-center tracking-[0] leading-[1.6] mb-[78px] px-4 relative z-10">
          A Neuron.AI lê o gráfico para você — identificando intenção, contexto de força e os melhores momentos para entrar.

        </p>

        <Button
          onClick={() => smoothScrollTo('precos')}
          className="w-[320px] md:w-[427px] h-[50px] md:h-[60px] rounded-[100px] button-gradient-animated [font-family:'Inter',Helvetica] font-black text-black text-base md:text-xl flex items-center justify-center gap-2 shadow-lg relative z-10"
        >
          Garantir acesso agora
          <ArrowRightIcon className="w-5 h-5" strokeWidth={3} />
        </Button>

        <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 flex-wrap px-4 relative z-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#00bcff]/10 to-[#00e0d6]/10 border border-[#00bcff]/30 text-[#00bcff] text-xs md:text-sm font-semibold tracking-wide backdrop-blur-sm">
            Sem instalação
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#00bcff]/10 to-[#00e0d6]/10 border border-[#00bcff]/30 text-[#00bcff] text-xs md:text-sm font-semibold tracking-wide backdrop-blur-sm">
            Acesso imediato
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#00bcff]/10 to-[#00e0d6]/10 border border-[#00bcff]/30 text-[#00bcff] text-xs md:text-sm font-semibold tracking-wide backdrop-blur-sm">
            Qualquer dispositivo
          </span>
        </div>
      </header>

      <section className="relative mt-[80px] md:mt-[144px] px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00bcff]/10 to-[#00e0d6]/10 border border-[#00bcff]/30 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#00bcff] animate-pulse"></div>
              <span className="text-[#00bcff] text-sm font-semibold">Veja em ação</span>
            </div>
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-white text-2xl md:text-3xl lg:text-4xl mb-4">
              Veja a Neuron.AI Funcionando na Prática
            </h2>
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#9ca3af] text-base md:text-lg max-w-[700px] mx-auto">
              Análise em tempo real que transforma gráficos complexos em decisões claras
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#00bcff]/20 via-[#00e0d6]/20 to-[#00bcff]/20 rounded-[40px] blur-2xl opacity-50"></div>

            <div className="relative z-10 w-full max-w-[1079px] lg:max-w-[1800px] mx-auto aspect-video rounded-[32px] border-[none] bg-[linear-gradient(1deg,rgba(1,4,16,1)_0%,rgba(34,36,48,1)_100%)] before:content-[''] before:absolute before:inset-0 before:p-[3px] before:rounded-[32px] before:[background:linear-gradient(180deg,rgba(65,99,217,1)_0%,rgba(1,4,16,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none overflow-hidden shadow-[0_20px_60px_rgba(0,188,255,0.15)]">
              <video
                ref={videoRef}
                loop
                playsInline
                controls
                className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-[29px] object-cover z-0"
              >
                <source src="https://s3.ferreiratrader.com.br/neuron/videoneuron.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>
            </div>

            <div className="hidden lg:block absolute top-1/4 -left-4 xl:-left-12 z-20">
              <div className="bg-gradient-to-br from-[#00bcff]/10 to-[#00e0d6]/10 backdrop-blur-sm border border-[#00bcff]/30 rounded-2xl p-4 shadow-lg max-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00bcff] to-[#00e0d6] flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">4.9/5</div>
                  </div>
                </div>
                <p className="text-[#9ca3af] text-xs">Avaliação média dos usuários</p>
              </div>
            </div>

            <div className="hidden lg:block absolute top-1/4 -right-4 xl:-right-12 z-20">
              <div className="bg-gradient-to-br from-[#00bcff]/10 to-[#00e0d6]/10 backdrop-blur-sm border border-[#00bcff]/30 rounded-2xl p-4 shadow-lg max-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00bcff] to-[#00e0d6] flex items-center justify-center text-black font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">90%</div>
                  </div>
                </div>
                <p className="text-[#9ca3af] text-xs">Taxa de precisão das análises</p>
              </div>
            </div>

            <div className="hidden lg:block absolute top-[58%] -left-4 xl:-left-12 z-20">
              <div className="bg-gradient-to-br from-[#00bcff]/10 to-[#00e0d6]/10 backdrop-blur-sm border border-[#00bcff]/30 rounded-2xl p-4 shadow-lg max-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00bcff] to-[#00e0d6] flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">2.5k+</div>
                  </div>
                </div>
                <p className="text-[#9ca3af] text-xs">Traders ativos usando hoje</p>
              </div>
            </div>

            <StatsBadgesCarousel />
          </div>

          <div className="text-center mt-12">
            <p className="[font-family:'Inter',Helvetica] font-medium text-white text-lg md:text-xl mb-3">
              Análise profissional automatizada, 24/7
            </p>
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#9ca3af] text-sm md:text-base max-w-[600px] mx-auto">
              Enquanto você foca em executar, a Neuron.AI monitora o mercado e identifica as melhores oportunidades em tempo real
            </p>
          </div>
        </div>
      </section>

      <section className="mt-[120px] md:mt-[200px] lg:mt-[200px] px-4 md:px-[52px]">
        <h2 className="max-w-[816px] w-full mx-auto [font-family:'Inter',Helvetica] font-semibold text-[#b3bcda] text-[40px] md:text-[54px] lg:text-[64px] tracking-[0] leading-[1.2] mb-[80px] md:mb-[145px] text-center">
          Você já sentiu algo assim?
        </h2>

        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px] mb-[20px]">
            {painPoints.map((point, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00bcff] via-[#00e0d6] to-[#00bcff] rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
                <Card className="relative rounded-2xl border-2 border-solid border-[#5b5b5b] bg-[linear-gradient(145deg,rgba(0,0,0,1)_0%,rgba(28,32,42,1)_50%,rgba(34,36,48,1)_100%)] overflow-hidden group-hover:border-[#00bcff] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,188,255,0.4)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00bcff]/0 via-[#00bcff]/0 to-[#00bcff]/0 group-hover:from-[#00bcff]/5 group-hover:via-[#00bcff]/10 group-hover:to-transparent transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00bcff]/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00bcff]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <CardContent className="p-[24px_20px_20px] md:p-[30px_24px_24px] relative z-10">
                    <div className="w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-xl bg-gradient-to-br from-[#00bcff]/15 to-[#00e0d6]/15 flex items-center justify-center mb-[18px] md:mb-[22px] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-[0_0_20px_rgba(0,188,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,188,255,0.5)] border border-[#00bcff]/20">
                      {index === 0 ? (
                        <svg className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] drop-shadow-[0_0_8px_rgba(0,188,255,0.6)] text-[#00bcff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <img
                          className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] object-cover drop-shadow-[0_0_8px_rgba(0,188,255,0.6)]"
                          alt="Image"
                          src={point.image}
                        />
                      )}
                    </div>
                    <h3 className="[font-family:'Inter',Helvetica] font-bold text-white text-[20px] md:text-[24px] tracking-[0] leading-[1.2] mb-[12px] md:mb-[16px] group-hover:text-[#00bcff] transition-colors duration-300">
                      {point.title}
                    </h3>
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#b4b4b4] text-[14px] md:text-[15px] tracking-[0] leading-[1.6] group-hover:text-white transition-colors duration-300">
                      {point.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[19px]">
            {problemCards.map((card, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00bcff] via-[#00e0d6] to-[#00bcff] rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
                <Card className="relative rounded-2xl border-2 border-solid border-[#5b5b5b] bg-[linear-gradient(145deg,rgba(0,0,0,1)_0%,rgba(28,32,42,1)_50%,rgba(34,36,48,1)_100%)] overflow-hidden group-hover:border-[#00bcff] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,188,255,0.4)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00bcff]/0 via-[#00bcff]/0 to-[#00bcff]/0 group-hover:from-[#00bcff]/5 group-hover:via-[#00bcff]/10 group-hover:to-transparent transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00bcff]/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00bcff]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <CardContent className="p-[24px_20px_20px] md:p-[30px_32px_32px] relative z-10">
                    <div className="w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-xl bg-gradient-to-br from-[#00bcff]/15 to-[#00e0d6]/15 flex items-center justify-center mb-[18px] md:mb-[22px] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-[0_0_20px_rgba(0,188,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,188,255,0.5)] border border-[#00bcff]/20">
                      <img
                        className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] object-cover drop-shadow-[0_0_8px_rgba(0,188,255,0.6)]"
                        alt="Image"
                        src={card.image}
                      />
                    </div>
                    <h3 className="[font-family:'Inter',Helvetica] font-bold text-white text-[20px] md:text-[24px] tracking-[0] leading-[1.2] mb-[12px] md:mb-[16px] group-hover:text-[#00bcff] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#b4b4b4] text-[14px] md:text-[15px] tracking-[0] leading-[1.6] group-hover:text-white transition-colors duration-300">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mt-[60px] md:mt-[100px] px-4">
        <p className="max-w-[1218px] w-full mx-auto [font-family:'Inter',Helvetica] font-normal text-white text-[18px] md:text-[28px] lg:text-[32px] tracking-[0] leading-[1.5] text-center mb-[80px] md:mb-[120px]">
          <span className="[font-family:'Inter',Helvetica] font-normal text-white text-[18px] md:text-[32px] tracking-[0]">
            Você não está sozinho. E é justamente pra mudar isso que a{" "}
          </span>
          <span className="font-bold">Neuron.Ai</span>
          <span className="[font-family:'Inter',Helvetica] font-normal text-white text-[18px] md:text-[32px] tracking-[0]">
            {" "}
            existe
          </span>
        </p>

        <div className="relative w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-20">
            <div className="relative flex-shrink-0 w-full lg:w-auto flex justify-center">
              <img
                className="w-[280px] md:w-[320px] lg:w-[550px] h-auto object-contain"
                alt="Design sem nome"
                src="/neuron/design-sem-nome--29--1.png"
              />
            </div>

            <div className="flex-1 flex flex-col items-center lg:items-start max-w-[600px]">
              <div className="w-16 h-[54px] rounded-[10px] border border-solid border-[#5b5b5b] bg-[linear-gradient(50deg,rgba(0,0,0,0.5)_0%,rgba(34,36,48,0.5)_100%)] flex items-center justify-center mb-8">
                <img
                  className="w-[55px] h-[55px] object-cover"
                  alt="Neuron logo PNG"
                  src="/neuron/neuron--logo-png--1.png"
                />
              </div>

              <h2 className="[font-family:'Inter',Helvetica] font-normal text-white text-[28px] md:text-[32px] lg:text-[36px] tracking-[0] leading-[1.3] mb-6 text-center lg:text-left">
                Foi pensando nisso que criei a <span className="font-bold">Neuron.AI</span>
              </h2>

              <div className="space-y-6 mb-6">
                <p className="[font-family:'Inter',Helvetica] font-normal text-[17px] md:text-[19px] tracking-[0] leading-[1.7] text-white text-center lg:text-left">
                  Depois de <span className="font-bold text-[#4062d8]">7 anos operando</span> e <span className="font-bold text-[#4062d8]">3 anos ensinando</span> ao vivo, eu entendi:
                </p>

                <div className="relative p-5 bg-white/5 border-l-4 border-red-500 rounded-r-xl backdrop-blur-sm">
                  <p className="[font-family:'Inter',Helvetica] font-normal text-[16px] md:text-[18px] tracking-[0] leading-[1.8] text-white">
                    O problema não é <span className="line-through text-white/50">falta de conhecimento</span>. É <span className="font-bold text-red-400">falta de clareza</span> na hora de aplicar.
                  </p>
                  <p className="[font-family:'Inter',Helvetica] font-normal text-[16px] md:text-[18px] tracking-[0] leading-[1.8] text-white mt-3">
                    E sem <span className="font-bold text-red-400">clareza</span>, não tem <span className="font-bold text-red-400">consistência</span>. Sem <span className="font-bold text-red-400">consistência</span>, não tem <span className="font-bold text-white">lucro de verdade</span>.
                  </p>
                </div>

                <div className="relative p-6 bg-gradient-to-br from-[#4062d8]/20 to-[#2a4ba8]/20 border-2 border-[#4062d8]/50 rounded-2xl backdrop-blur-sm shadow-lg shadow-[#4062d8]/10">
                  <div className="absolute -top-3 left-6">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-[#4062d8] to-[#2a4ba8] text-white text-xs font-black rounded-full shadow-lg uppercase tracking-wide">
                      ✨ A DIFERENÇA
                    </span>
                  </div>
                  <p className="[font-family:'Inter',Helvetica] font-semibold text-[17px] md:text-[19px] leading-[1.8] text-white text-center lg:text-left">
                    A Neuron <span className="font-bold text-[#4062d8]">não dá entradas prontas</span>. Ela mostra o que o gráfico está dizendo — para que <span className="font-bold underline decoration-[#4062d8] decoration-2 underline-offset-2">VOCÊ</span> tome a decisão certa e construa resultados que se sustentam.
                  </p>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-emerald-500/20 rounded-full">
                    <span className="text-2xl">💡</span>
                  </div>
                  <p className="[font-family:'Inter',Helvetica] font-normal text-[16px] md:text-[18px] leading-[1.8] text-white">
                    Porque <span className="font-bold text-emerald-400">trader de verdade</span> não segue sinal. <span className="font-bold text-white">Trader de verdade lê o mercado</span> — e lucra com isso.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => smoothScrollTo('precos')}
                className="w-full max-w-[300px] h-[50px] rounded-[100px] button-gradient-animated [font-family:'Inter',Helvetica] font-black text-black text-base flex items-center justify-center gap-2 shadow-lg"
              >
                Quero melhorar meus lucros
                <ArrowRightIcon className="w-5 h-5" strokeWidth={3} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-[120px] md:mt-[200px] lg:mt-[200px] px-4">
        <h2 className="max-w-[240px] md:max-w-[816px] w-full mx-auto [font-family:'Inter',Helvetica] font-semibold text-[#b3bcda] text-[36px] md:text-[54px] lg:text-[64px] tracking-[0] leading-[1.2] mb-[100px] md:mb-[187px] text-center">
          Para quem é a Neuron.AI?
        </h2>

        <div className="relative min-h-[600px] hidden lg:flex lg:items-center lg:justify-center">
          <div className="relative w-[1440px] h-[565px]">
            <img
              className="absolute top-[67px] left-[331px] w-[275px] h-[110px] animate-line-glow"
              alt="Line"
              src="/neuron/line-2.svg"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 188, 255, 0.6))' }}
            />

            <img
              className="absolute top-[67px] left-[844px] w-[275px] h-[110px] animate-line-glow"
              alt="Line"
              src="/neuron/line-1.svg"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 188, 255, 0.6))' }}
            />

            <img
              className="absolute top-[370px] left-[404px] w-[275px] h-[110px] animate-line-glow"
              alt="Line"
              src="/neuron/line-4.svg"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 188, 255, 0.6))' }}
            />

            <img
              className="absolute top-[370px] left-[745px] w-[275px] h-[110px] animate-line-glow"
              alt="Line"
              src="/neuron/line-3.svg"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 188, 255, 0.6))' }}
            />

            <div className="absolute top-[93px] left-[561px] w-[318px] h-[318px] z-30">
              <div className="absolute inset-0 rounded-full bg-[#00bcff] opacity-20 blur-3xl animate-pulse-glow"></div>
              <img className="w-full h-full relative z-10 drop-shadow-[0_0_25px_rgba(0,188,255,0.5)]" alt="Ellipse" src="/neuron/ellipse-2.svg" />
              <img
                className="absolute top-[23px] left-[23px] w-[272px] h-[272px] rounded-[272px] object-cover animate-spin-3d z-20 drop-shadow-[0_0_30px_rgba(0,188,255,0.6)]"
                alt="Neuron"
                src="/neuron/neuron-3d-1.png"
              />
              <div className="absolute top-[23px] left-[23px] w-[272px] h-[272px] rounded-[272px] bg-gradient-to-tr from-[#00bcff]/30 via-transparent to-[#00e0d6]/30 animate-spin-slow pointer-events-none z-10"></div>
            </div>

            <Card className="absolute top-0 left-[1010px] w-[363px] h-[233px] rounded-2xl border-2 border-solid border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] shadow-[0_0_20px_rgba(0,188,255,0.3)] hover:shadow-[0_0_40px_rgba(0,188,255,0.6)] transition-shadow duration-300 z-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00bcff]/10 via-transparent to-transparent pointer-events-none"></div>
              <CardContent className="p-[27px_30px_20px] relative z-10">
                <img
                  className="w-[38px] h-[38px] object-cover mx-auto mb-[20px] drop-shadow-[0_0_15px_rgba(0,188,255,0.8)]"
                  alt="Image"
                  src="/neuron/image-41.png"
                />
                <h3 className="mx-auto [font-family:'Inter',Helvetica] font-black text-white text-lg text-center tracking-[0] leading-[normal] mb-[15px]">
                   Para quem está começando
                </h3>
                <p className="[font-family:'Inter',Helvetica] font-medium text-[#9f9f9f] text-sm text-center tracking-[0] leading-[1.4]">
                  Não sabe por onde começar. A Neuron traduz o mercado em linguagem clara.
                </p>
              </CardContent>
            </Card>

            <Card className="absolute top-[337px] left-[911px] w-[363px] h-[228px] rounded-2xl border-2 border-solid border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] shadow-[0_0_20px_rgba(0,188,255,0.3)] hover:shadow-[0_0_40px_rgba(0,188,255,0.6)] transition-shadow duration-300 z-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00bcff]/10 via-transparent to-transparent pointer-events-none"></div>
              <CardContent className="p-[24px_30px_20px] relative z-10">
                <img
                  className="w-[38px] h-[38px] object-cover mx-auto mb-[20px] drop-shadow-[0_0_15px_rgba(0,188,255,0.8)]"
                  alt="Image"
                  src="/neuron/image-41.png"
                />
                <h3 className="mx-auto [font-family:'Inter',Helvetica] font-black text-white text-lg text-center tracking-[0] leading-[normal] mb-[15px]">
                Para quem estuda, mas não opera
                </h3>
                <p className="[font-family:'Inter',Helvetica] font-medium text-[#9f9f9f] text-sm text-center tracking-[0] leading-[1.4]">
                  Tem conhecimento, mas trava na hora de clicar. A análise dá a confirmação que falta.
                </p>
              </CardContent>
            </Card>

            <Card className="absolute top-0 left-[63px] w-[377px] h-[251px] rounded-2xl border-2 border-solid border-[#00bcff] rotate-180 bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] shadow-[0_0_20px_rgba(0,188,255,0.3)] hover:shadow-[0_0_40px_rgba(0,188,255,0.6)] transition-shadow duration-300 z-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00bcff]/10 via-transparent to-transparent pointer-events-none"></div>
              <CardContent className="p-[35px_30px_20px] rotate-180 relative z-10">
                <img
                  className="w-[38px] h-[38px] object-cover mx-auto mb-[20px] drop-shadow-[0_0_15px_rgba(0,188,255,0.8)]"
                  alt="Image"
                  src="/neuron/image-41.png"
                />
                <h3 className="mx-auto [font-family:'Inter',Helvetica] font-black text-white text-lg text-center tracking-[0] leading-[normal] mb-[15px]">
                  Para quem opera, mas não é consistente
                </h3>
                <p className="[font-family:'Inter',Helvetica] font-medium text-[#9f9f9f] text-sm text-center tracking-[0] leading-[1.4]">
                  Acerta, mas não lucra. A Neuron organiza sua leitura e identifica padrões.
                </p>
              </CardContent>
            </Card>

            <Card className="absolute top-[337px] left-[150px] w-[363px] h-[228px] rounded-2xl border-2 border-solid border-[#00bcff] rotate-180 bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] shadow-[0_0_20px_rgba(0,188,255,0.3)] hover:shadow-[0_0_40px_rgba(0,188,255,0.6)] transition-shadow duration-300 z-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00bcff]/10 via-transparent to-transparent pointer-events-none"></div>
              <CardContent className="p-[24px_30px_20px] rotate-180 relative z-10">
                <img
                  className="w-[38px] h-[38px] object-cover mx-auto mb-[20px] drop-shadow-[0_0_15px_rgba(0,188,255,0.8)]"
                  alt="Image"
                  src="/neuron/image-41.png"
                />
                <h3 className="mx-auto [font-family:'Inter',Helvetica] font-black text-white text-lg text-center tracking-[0] leading-[normal] mb-[15px]">
                  Para quem quer se profissionalizar 
                </h3>
                <p className="[font-family:'Inter',Helvetica] font-medium text-[#9f9f9f] text-sm text-center tracking-[0] leading-[1.4]">
                  Já tem resultados, quer estrutura. Relatórios transformam achismo em dados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <MobileCardsSection />
      </section>
 
      <section className="mt-[80px] md:mt-[120px] lg:mt-[120px] px-4 max-w-[1440px] mx-auto">
        <div className="relative border-2 border-solid border-[#00bcff]/30 rounded-[32px] p-8 md:p-12 lg:p-20 bg-gradient-to-br from-[#00bcff]/10 via-transparent to-[#00e0d6]/5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,188,255,0.08),transparent_70%)] hidden md:block"></div>
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00bcff]/5 rounded-full blur-[100px] hidden md:block"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00e0d6]/5 rounded-full blur-[100px] hidden md:block"></div>

          <div className="relative z-10">
            <h2 className="max-w-[600px] w-full mx-auto [font-family:'Inter',Helvetica] font-semibold text-white text-[36px] md:text-[48px] lg:text-[56px] tracking-[0] leading-[1.2] mb-[20px] text-center">
              Não importa de onde você está partindo.
            </h2>

            <p className="max-w-[700px] w-full mx-auto [font-family:'Inter',Helvetica] font-normal text-[#b3bcda] text-[16px] md:text-[18px] lg:text-[20px] tracking-[0] leading-[1.6] mb-[60px] md:mb-[80px] text-center">
              A Neuron.AI foi projetada para ser acessível a todos, independente do seu nível de experiência
            </p>

            <div className="hidden md:block mb-[60px] md:mb-[80px] mx-auto max-w-[1200px] px-8">
              <div className="grid grid-cols-3 gap-10 lg:gap-16 relative">
                {evenIfCards.map((card, index) => {
                  const iconMap = {
                    user: (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ),
                    chart: (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                    ),
                    shield: (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                    ),
                  };

                  return (
                    <div key={index} className="group flex flex-col items-center text-center relative">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#00bcff]/10 border-2 border-[#00bcff]/30 flex items-center justify-center group-hover:bg-[#00bcff]/20 group-hover:border-[#00bcff]/50 transition-all duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(0,188,255,0.1)] group-hover:shadow-[0_0_30px_rgba(0,188,255,0.25)] relative z-10">
                          {iconMap[card.icon as keyof typeof iconMap]}
                        </div>

                        {index < evenIfCards.length - 1 && (
                          <>
                            <div className="absolute top-1/2 left-full w-[calc(100%+2.5rem)] lg:w-[calc(100%+4rem)] h-0.5 bg-gradient-to-r from-[#00bcff]/40 via-[#00bcff]/20 to-transparent -translate-y-1/2 hidden md:block"></div>
                            <div className="absolute top-1/2 left-full w-2 h-2 bg-[#00bcff]/50 rounded-full -translate-y-1/2 translate-x-[calc(100%+2.5rem)] lg:translate-x-[calc(100%+4rem)] hidden md:block"></div>
                          </>
                        )}
                      </div>

                      <h3 className="[font-family:'Inter',Helvetica] font-bold text-white text-[19px] lg:text-[21px] tracking-[-0.02em] leading-[1.3] mb-3 group-hover:text-[#00bcff] transition-colors duration-300">
                        {card.text}
                      </h3>
                      <p className="[font-family:'Inter',Helvetica] font-normal text-[#b3bcda] text-[15px] lg:text-[16px] tracking-[0] leading-[1.6]">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:hidden mb-[60px] px-4">
              <div className="space-y-8">
                {evenIfCards.map((card, index) => {
                  const iconMap = {
                    user: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ),
                    chart: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                    ),
                    shield: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                    ),
                  };

                  return (
                    <div key={index} className="flex items-start gap-5 relative">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00bcff]/10 border-2 border-[#00bcff]/30 flex items-center justify-center">
                        {iconMap[card.icon as keyof typeof iconMap]}
                      </div>

                      <div className="flex-1">
                        <h3 className="[font-family:'Inter',Helvetica] font-bold text-white text-[18px] tracking-[-0.02em] leading-[1.3] mb-2">
                          {card.text}
                        </h3>
                        <p className="[font-family:'Inter',Helvetica] font-normal text-[#b3bcda] text-[15px] tracking-[0] leading-[1.6]">
                          {card.description}
                        </p>
                      </div>

                      {index < evenIfCards.length - 1 && (
                        <div className="absolute -bottom-4 left-6 w-0.5 h-8 bg-gradient-to-b from-[#00bcff]/30 to-transparent"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-[40px] h-[40px] rounded-full bg-[#00bcff]/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="[font-family:'Inter',Helvetica] font-medium text-white text-[16px] md:text-[18px]">
                  Comece em menos de 5 minutos
                </p>
              </div>

              <Button
                onClick={() => smoothScrollTo('precos')}
                className="w-full max-w-[450px] h-[64px] rounded-[100px] button-gradient-animated [font-family:'Inter',Helvetica] font-black text-black text-[17px] md:text-[20px] flex items-center justify-center gap-3 mx-auto"
              >
                Quero evoluir agora
                <ArrowRightIcon className="w-6 h-6" strokeWidth={3} />
              </Button>
            </div>
          </div>
        </div>
      </section> 

      <section className="mt-[120px] md:mt-[200px] lg:mt-[200px] px-4">
        <h2 className="max-w-[728px] w-full mx-auto [font-family:'Inter',Helvetica] font-semibold text-[#b3bcda] text-[40px] md:text-[54px] lg:text-[64px] text-center tracking-[0] leading-[1.2] mb-[60px] md:mb-[105px]">
          O que você vai receber
        </h2>

        <FeaturesCarousel />
      </section>

      <section className="mt-[100px] md:mt-[120px] px-4">
        <h2 className="max-w-[728px] w-full mx-auto [font-family:'Inter',Helvetica] font-semibold text-[#b3bcda] text-[40px] md:text-[54px] lg:text-[64px] text-center tracking-[0] leading-[1.2] mb-[100px] md:mb-[193px]">
          Como ela funciona:
        </h2>

        <div className="hidden lg:block relative w-full max-w-[1400px] mx-auto" style={{ height: '600px' }}>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1400 600"
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 1 }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#00bcff', stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#00e0d6', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            <path
              d="M 100,380 C 250,380 300,150 480,250 C 600,320 650,340 750,310 C 900,260 1000,160 1150,110 C 1250,70 1300,60 1300,60"
              stroke="url(#lineGradient)"
              strokeWidth="5"
              fill="none"
              filter="url(#glow)"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute group" style={{ left: '100px', top: '380px', transform: 'translate(-50px, -50px)', zIndex: 10 }}>
            <div className="w-[100px] h-[100px] rounded-full border-3 border-solid border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] flex items-center justify-center shadow-[0_0_40px_rgba(0,188,255,0.7)] hover:scale-110 transition-transform duration-300">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[700px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-500 rounded-xl shadow-[0_0_60px_rgba(0,188,255,0.5)] border-2 border-[#00bcff]">
              <img
                src="/neuron/passo1.gif"
                alt="Passo 1"
                className="w-full h-auto rounded-xl"
                style={{ objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>

          <div className="absolute" style={{ left: '100px', top: '490px', transform: 'translateX(-50px)', zIndex: 5 }}>
            <div style={{ maxWidth: '240px' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-[linear-gradient(180deg,rgba(179,188,218,1)_0%,rgba(100,105,125,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-[100px] leading-[0.9] opacity-40">
                  1
                </div>
              </div>
              <h3 className="[font-family:'Inter',Helvetica] font-semibold text-white text-[18px] mb-2 leading-tight">
                 Abra a Neuron
              </h3>
              <p className="[font-family:'Inter',Helvetica] font-normal text-[#b4b4b4] text-[15px] leading-[1.5]">
                Acesse de qualquer dispositivo. Fez login, tá dentro.
              </p>
            </div>
          </div>

          <div className="absolute group" style={{ left: '600px', top: '310px', transform: 'translate(-50px, -50px)', zIndex: 10 }}>
            <div className="w-[100px] h-[100px] rounded-full border-3 border-solid border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] flex items-center justify-center shadow-[0_0_40px_rgba(0,188,255,0.7)] hover:scale-110 transition-transform duration-300">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[700px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-500 rounded-xl shadow-[0_0_60px_rgba(0,188,255,0.5)] border-2 border-[#00bcff]">
              <img
                src="/neuron/passo2.gif"
                alt="Passo 2"
                className="w-full h-auto rounded-xl"
                style={{ objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>

          <div className="absolute" style={{ left: '700px', top: '10px', transform: 'translateX(-120px)', zIndex: 5 }}>
            <div style={{ maxWidth: '280px' }}>
              <h3 className="[font-family:'Inter',Helvetica] font-semibold text-white text-[18px] mb-2 leading-tight">
                Escolha o ativo ou mande um print
              </h3>
              <p className="[font-family:'Inter',Helvetica] font-normal text-[#b4b4b4] text-[15px] leading-[1.5] mb-3">
                Seleciona o par ou tira print e cola direto. A IA processa em segundos..
              </p>
              <div className="flex items-start gap-3">
                <div className="bg-[linear-gradient(180deg,rgba(179,188,218,1)_0%,rgba(100,105,125,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-[100px] leading-[0.9] opacity-40">
                  2
                </div>
              </div>
            </div>
          </div>

          <div className="absolute group" style={{ left: '1150px', top: '110px', transform: 'translate(-50px, -50px)', zIndex: 10 }}>
            <div className="w-[100px] h-[100px] rounded-full border-3 border-solid border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] flex items-center justify-center shadow-[0_0_40px_rgba(0,188,255,0.7)] hover:scale-110 transition-transform duration-300">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[700px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-500 rounded-xl shadow-[0_0_60px_rgba(0,188,255,0.5)] border-2 border-[#00bcff]">
              <img
                src="/neuron/passo3.gif"
                alt="Passo 3"
                className="w-full h-auto rounded-xl"
                style={{ objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>

          <div className="absolute" style={{ left: '1150px', top: '220px', transform: 'translateX(-50px)', zIndex: 5 }}>
            <div style={{ maxWidth: '240px' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-[linear-gradient(180deg,rgba(179,188,218,1)_0%,rgba(100,105,125,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-[100px] leading-[0.9] opacity-40">
                  3
                </div>
              </div>
              <h3 className="[font-family:'Inter',Helvetica] font-semibold text-white text-[18px] mb-2 leading-tight">
                Receba a análise completa
              </h3>
              <p className="[font-family:'Inter',Helvetica] font-normal text-[#b4b4b4] text-[15px] leading-[1.5]">
                Contexto, zonas de interesse, gatilhos e nível de confiança. Tudo 100% explicado.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:hidden w-full mx-auto">
          <div className="flex gap-2 mb-6">
            {howItWorksSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveHowItWorksTab(index)}
                className={`flex-1 h-[50px] rounded-lg border-2 transition-all duration-300 [font-family:'Inter',Helvetica] font-bold text-base ${
                  activeHowItWorksTab === index
                    ? 'border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,188,255,0.1)_0%,rgba(0,224,214,0.1)_100%)] text-[#00bcff] shadow-[0_0_15px_rgba(0,188,255,0.3)]'
                    : 'border-[#5b5b5b] bg-transparent text-[#9f9f9f] hover:border-[#00bcff]/50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Card className="rounded-2xl border border-[#00bcff]/30 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm relative max-w-[900px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00bcff]/5 via-transparent to-transparent"></div>
            <CardContent className="p-6 md:p-8 relative z-10 flex flex-col items-center text-center">
              <div className="w-[60px] h-[60px] rounded-full border-2 border-solid border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] flex items-center justify-center shadow-[0_0_25px_rgba(0,188,255,0.5)] mb-4">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00bcff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div className="bg-[linear-gradient(180deg,rgba(179,188,218,1)_0%,rgba(100,105,125,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-[50px] md:text-[60px] leading-[0.8] mb-3">
                {howItWorksSteps[activeHowItWorksTab].number}
              </div>
              <h3 className="[font-family:'Inter',Helvetica] font-semibold text-white text-lg md:text-xl mb-3">
                {howItWorksSteps[activeHowItWorksTab].title}
              </h3>
              <p className="[font-family:'Inter',Helvetica] font-normal text-[#b4b4b4] text-sm md:text-base leading-[1.5] mb-4 whitespace-pre-line max-w-[600px]">
                {howItWorksSteps[activeHowItWorksTab].description}
              </p>
              <div className="w-full rounded-lg border border-[#00bcff]/30 max-w-[700px]">
                {howItWorksSteps[activeHowItWorksTab].video.endsWith('.gif') ? (
                  <img
                    src={howItWorksSteps[activeHowItWorksTab].video}
                    alt={`Passo ${howItWorksSteps[activeHowItWorksTab].number}`}
                    className="w-full h-auto rounded-lg"
                    style={{ objectFit: 'contain', display: 'block' }}
                  />
                ) : (
                  <iframe
                    src={howItWorksSteps[activeHowItWorksTab].video}
                    title={`Video ${howItWorksSteps[activeHowItWorksTab].number}`}
                    className="w-full h-auto"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    scrolling="no"
                    style={{ border: 'none', objectFit: 'contain', aspectRatio: '16/9' }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-[120px] md:mt-[200px] lg:mt-[200px] bg-[linear-gradient(35deg,rgba(0,0,0,1)_0%,rgba(34,36,48,1)_100%)] py-[80px] md:py-[100px] lg:py-[127px] overflow-hidden">
        <div className="hidden lg:flex items-center gap-[80px] max-w-[1440px] mx-auto px-4 md:px-[63px]">
          <div className="w-[450px] flex-shrink-0">
            <div className="flex items-center gap-[5px] mb-[60px]">
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  className="w-[36px] h-[34px]"
                  alt="Star"
                  src="/neuron/star-5.svg"
                />
              ))}
              <div className="ml-[10px] bg-[linear-gradient(313deg,rgba(217,223,245,1)_0%,rgba(104,109,125,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-semibold text-transparent text-[32px] tracking-[0] leading-[normal]">
                4.9/5
              </div>
            </div>

            <h2 className="bg-[linear-gradient(313deg,rgba(217,223,245,1)_0%,rgba(104,109,125,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-semibold text-transparent text-[48px] tracking-[0] leading-[1.2]">
              Veja o que dizem<br />alguns dos usuarios<br />da NEURON.AI
            </h2>
          </div>

          <div className="flex-1">
            <TestimonialsCarousel />
          </div>
        </div>

        <div className="lg:hidden px-4">
          <div className="flex items-center gap-[5px] mb-[20px] justify-center">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                className="w-[20px] h-[19px]"
                alt="Star"
                src="/neuron/star-5.svg"
              />
            ))}
            <div className="ml-[6px] bg-[linear-gradient(313deg,rgba(217,223,245,1)_0%,rgba(104,109,125,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-semibold text-transparent text-[20px] tracking-[0] leading-[normal]">
              4.9/5
            </div>
          </div>

          <h2 className="bg-[linear-gradient(313deg,rgba(217,223,245,1)_0%,rgba(104,109,125,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-semibold text-transparent text-[32px] md:text-[40px] tracking-[0] leading-[1.2] mb-[60px] text-center">
            Veja o que dizem alguns dos usuarios da NEURON.AI
          </h2>

          <TestimonialsCarousel />
        </div>
      </section>

      <section id="precos" className="mt-[120px] md:mt-[200px] lg:mt-[200px] px-4">
        <h2 className="max-w-[728px] w-full mx-auto [font-family:'Inter',Helvetica] font-bold text-[#b3bcda] text-[32px] md:text-[54px] lg:text-[64px] text-center tracking-[0] leading-[1.2] mb-[20px] md:mb-[30px]">
          Comece a Lucrar Hoje
        </h2>

        <p className="max-w-[931px] w-full mx-auto [font-family:'Inter',Helvetica] font-medium text-[#9ca3af] text-[18px] md:text-2xl lg:text-3xl text-center tracking-[0] leading-[1.4] mb-[60px] md:mb-[80px]">
          A ferramenta perfeita para todo trader. Escolha como começar.
        </p>

        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[24px] items-stretch justify-center max-w-[1200px] mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`w-full max-w-[360px] lg:flex-1 rounded-[18px] transition-all duration-300 flex flex-col ${
                plan.highlighted
                  ? "border-[3px] border-solid border-[#00bcff] shadow-[0_8px_32px_rgba(0,188,255,0.25)] lg:mt-[-16px] lg:mb-[-16px]"
                  : "border-[2px] border-solid border-[#3a3a3a] hover:border-[#5a5a5a]"
              } bg-[linear-gradient(180deg,rgba(24,26,32,1)_0%,rgba(16,18,24,1)_100%)] relative hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]`}
            >
              <CardContent className="p-6 lg:p-7 flex flex-col flex-1">
                {plan.badge && (
                  <div className="absolute top-[-18px] left-1/2 transform -translate-x-1/2 w-[170px] h-[38px] rounded-[100px] bg-[linear-gradient(90deg,rgba(0,188,255,1)_0%,rgba(0,224,214,1)_100%)] flex items-center justify-center shadow-[0_4px_16px_rgba(0,188,255,0.4)]">
                    <span className="[font-family:'Inter',Helvetica] font-black text-[#010510] text-[14px] text-center tracking-[0.5px] leading-[normal] uppercase">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="w-full mx-auto mt-[40px] [font-family:'Inter',Helvetica] font-bold text-white text-[28px] lg:text-[30px] text-center tracking-[0] leading-[normal] mb-[10px]">
                  {plan.name}
                </h3>

                <p className="w-full max-w-[300px] mx-auto [font-family:'Inter',Helvetica] font-medium text-[#9ca3af] text-[14px] lg:text-[15px] text-center tracking-[0] leading-[normal] mb-[16px]">
                  {plan.description}
                </p>

                {plan.savings && (
                  <div className="w-fit mx-auto px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-[16px]">
                    <span className="[font-family:'Inter',Helvetica] font-bold text-green-400 text-[12px] uppercase tracking-wide">
                      {plan.savings}
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center mb-[30px] relative">
                  <div className="flex items-start justify-center">
                    <p className="[font-family:'Inter',Helvetica] font-black text-white text-[52px] lg:text-[58px] text-center tracking-[-2px] leading-[1] whitespace-nowrap">
                      {plan.priceMain}
                    </p>
                    <span className="[font-family:'Inter',Helvetica] font-bold text-white text-[28px] lg:text-[32px] text-center tracking-[0] leading-[1] mt-[4px]">
                      {plan.priceDecimal}
                    </span>
                  </div>
                  <span className="[font-family:'Inter',Helvetica] font-medium text-[#737373] text-[14px] lg:text-[16px] text-center tracking-[0] leading-[normal] mt-[8px]">
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-[16px] mb-[28px] flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center justify-start gap-[10px] px-2"
                    >
                      <img
                        className="w-[18px] h-[18px] object-cover flex-shrink-0"
                        alt="Image"
                        src="/neuron/image-41.png"
                      />
                      <p className="flex-1 [font-family:'Inter',Helvetica] font-medium text-[#b4b4b4] text-[14px] lg:text-[15px] text-left tracking-[0] leading-[1.5]">
                        {feature}
                      </p>
                    </div>
                  ))}
                  {plan.excludedFeatures && plan.excludedFeatures.map((feature, featureIndex) => (
                    <div
                      key={`excluded-${featureIndex}`}
                      className="flex items-center justify-start gap-[10px] px-2"
                    >
                      <svg
                        className="w-[18px] h-[18px] flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      <p className="flex-1 [font-family:'Inter',Helvetica] font-medium text-[#6b6b6b] text-[14px] lg:text-[15px] text-left tracking-[0] leading-[1.5] line-through opacity-60">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {plan.highlighted ? (
                  <Button
                    onClick={() => plan.url && window.open(plan.url, '_blank')}
                    className="w-full max-w-[290px] h-[54px] mx-auto block rounded-[100px] bg-[linear-gradient(90deg,rgba(0,188,255,1)_0%,rgba(0,224,214,1)_100%)] [font-family:'Inter',Helvetica] font-black text-[#010510] text-[16px] shadow-[0_0_30px_rgba(0,188,255,0.6),0_4px_20px_rgba(0,188,255,0.4)] hover:shadow-[0_0_50px_rgba(0,224,214,0.8),0_8px_30px_rgba(0,188,255,0.6)] hover:scale-[1.05] hover:brightness-110 transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.3)_50%,transparent_70%)] before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                  >
                    {plan.buttonText}
                  </Button>
                ) : (
                  <Button
                    onClick={() => plan.url && window.open(plan.url, '_blank')}
                    className="w-full max-w-[290px] h-[54px] mx-auto block rounded-[100px] bg-[linear-gradient(135deg,rgba(30,30,35,1)_0%,rgba(20,20,25,1)_100%)] border-[2px] border-[#505050] [font-family:'Inter',Helvetica] font-bold text-white text-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:bg-[linear-gradient(135deg,rgba(0,188,255,0.1)_0%,rgba(0,224,214,0.05)_100%)] hover:border-[#00bcff] hover:shadow-[0_0_25px_rgba(0,188,255,0.4),0_4px_20px_rgba(0,188,255,0.3)] hover:scale-[1.03] hover:text-[#00e0d6] transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_30%,rgba(0,188,255,0.1)_50%,transparent_70%)] before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                  >
                    {plan.buttonText}
                  </Button>
                )}

                {plan.note && (
                  <p className="w-full max-w-[280px] mx-auto mt-[12px] [font-family:'Inter',Helvetica] font-medium text-[#7a7a7a] text-[13px] lg:text-[14px] text-center tracking-[0] leading-[normal]">
                    {plan.note}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-[120px] md:mt-[200px] lg:mt-[200px] px-4 md:px-[63px] relative">
        <div className="max-w-[1000px] mx-auto flex flex-col items-center">
          <div className="absolute top-[-10px] md:top-[-30px] left-1/2 -translate-x-1/2 blur-[4px] md:blur-[12.5px] [font-family:'Inter',Helvetica] font-medium text-[#ffffff1a] text-[65px] md:text-[160px] lg:text-[200px] text-center tracking-[0] leading-[normal] pointer-events-none whitespace-nowrap">
            GARANTIA
          </div>

          <img
            className="w-[200px] md:w-[280px] lg:w-[350px] h-auto object-contain mb-[40px] md:mb-[50px] relative z-10"
            alt="Image"
            src="/neuron/image-20.png"
          />

          <h2 className="w-full [font-family:'Inter',Helvetica] font-medium text-white text-[28px] md:text-[36px] lg:text-[42px] text-center tracking-[0] leading-[1.3] mb-[40px] md:mb-[60px]">
            Garantia Incondicional de 7 dias
          </h2>

          <p className="max-w-[800px] w-full [font-family:'Inter',Helvetica] font-medium text-[#989898] text-[18px] md:text-[22px] lg:text-[26px] text-center tracking-[0] leading-[1.5] mb-[80px] md:mb-[120px]">
            Você tem uma semana completa para testar nossos serviços e acompanhar
            o desempenho real.
            <br /> Se não estiver satisfeito, devolvemos 100% do valor investido,
            sem burocracia.
          </p>

          <p className="max-w-[850px] w-full [font-family:'Inter',Helvetica] font-normal text-[#c5c5c5] text-[18px] md:text-[22px] lg:text-[26px] text-center tracking-[0] leading-[1.5] mb-[50px] md:mb-[70px]">
            <span className="font-medium">
              Você tem tudo a ganhar e nada a perder.{" "}
            </span>
            <span className="font-extrabold">Agora a decisão é sua!</span>
          </p>

          <Button
            onClick={() => smoothScrollTo('precos')}
            className="w-full max-w-[380px] h-[60px] rounded-[100px] button-gradient-animated [font-family:'Inter',Helvetica] font-black text-black text-base md:text-xl flex items-center justify-center gap-2 shadow-lg"
          >
            Garanta seu acesso agora
            <ArrowRightIcon className="w-5 h-5" strokeWidth={3} />
          </Button>
        </div>
      </section>

      <section className="mt-[120px] md:mt-[200px] lg:mt-[200px] px-4 md:px-[63px]">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-[40px] lg:gap-[80px] mb-[46px] max-w-[1440px] mx-auto">
          <div className="w-full lg:w-auto flex-shrink-0 flex flex-col items-center lg:items-start">
            <div className="inline-block mb-[30px] md:mb-[54px]">
              <div className="px-[24px] py-[8px] rounded-full border border-solid border-[#00bcff] bg-[linear-gradient(35deg,rgba(0,0,0,0.8)_0%,rgba(34,36,48,0.8)_100%)] shadow-[0_0_15px_rgba(0,188,255,0.2)]">
                <h2 className="[font-family:'Inter',Helvetica] font-normal text-white text-[18px] md:text-[20px] text-center tracking-[0] leading-[normal]">
                  FAQ
                </h2>
              </div>
            </div>

            <h3 className="max-w-[589px] w-full [font-family:'Inter',Helvetica] font-medium text-transparent text-[32px] md:text-[42px] lg:text-5xl text-center lg:text-left tracking-[0] leading-[1.3] mb-[60px] md:mb-[100px]">
              <span className="text-white">Dúvidas</span>
              <span className="text-[#00bcff]"> Frequentes</span>
            </h3>

            <a
              href="https://api.whatsapp.com/send?phone=5521923670493&text=Ferreira,%20estou%20no%20site%20da%20Neuron%20e%20preciso%20de%20suporte"
              target="_blank"
              rel="noopener noreferrer"
              className="block mx-auto mb-[21px] w-[150px] md:w-[177px] cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <img
                className="w-full h-auto object-contain"
                alt="WhatsApp"
                src="/neuron/image-42.png"
              />
            </a>

            <p className="max-w-[422px] w-full mx-auto lg:mx-0 [font-family:'Inter',Helvetica] font-semibold text-[#b4b4b4] text-xl md:text-2xl text-center lg:text-left tracking-[0] leading-[1.5]">
              Dúvidas? Fale com o suporte agora!
              <br />
              Clique aqui
            </p>
          </div>

          <div className="flex-1 w-full max-w-[652px] lg:ml-[40px]">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-2 border-[#1a1a1a] rounded-2xl bg-[linear-gradient(135deg,rgba(10,10,15,0.8)_0%,rgba(20,20,30,0.4)_100%)] backdrop-blur-sm hover:border-[#00bcff] transition-all duration-300 overflow-hidden group hover:shadow-[0_0_30px_rgba(0,188,255,0.15)]"
                >
                  <AccordionTrigger className="[font-family:'Inter',Helvetica] font-semibold text-white text-[16px] md:text-[18px] lg:text-[20px] text-left tracking-[0] leading-[1.4] px-6 py-6 hover:no-underline hover:text-[#00bcff] transition-colors [&[data-state=open]]:text-[#00bcff]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="[font-family:'Inter',Helvetica] font-normal text-[#b4b4b4] text-[14px] md:text-[16px] text-left tracking-[0] leading-[1.7] px-6 pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <footer className="mt-[80px] md:mt-[114px] pb-[100px] md:pb-[236px] px-4">
        <p className="max-w-[948px] w-full mx-auto [font-family:'Inter',Helvetica] font-medium text-[#272727] text-[11px] md:text-[13px] lg:text-[14px] text-center tracking-[0] leading-[1.6]">
          Aviso Legal: &quot;Nenhuma informação contida neste produto deve ser
          interpretada como uma afirmação da obtenção de resultados. Qualquer
          referência ao desempenho passado ou potencial de uma estratégia
          abordada no conteúdo não é, e não deve ser interpretada como uma
          recomendação ou como garantia de qualquer resultado específico.&quot;
          Políticas de Privacidade | Termos de uso
        </p>
      </footer>
    </div>
  );
};

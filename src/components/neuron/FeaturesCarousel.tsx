import React, { useState, useEffect, useRef } from 'react';

const features = [
  {
    title: 'Análise Neural de Gráficos',
    description: `Envie o gráfico e receba a leitura completa em segundos.

• Contexto: a IA identifica se o momento favorece compra, venda ou espera

• Zonas de interesse: regiões onde o preço tende a reagir 

• Gatilhos: o que precisa acontecer pra entrada fazer sentido 

• Nível de confiança: pra você saber o peso da oportunidade 
Sem achismo. Leitura técnica traduzida em linguagem clara.`,
    image: '/neuron/analiseneuralgrafico.png',
    alt: 'Oportunidad de Compra',
  },
  {
    title: 'Análise Direto da Corretora',
    description: `Agora você não precisa mais tirar print.
    
    Conecte sua corretora e a Neuron analisa o gráfico em tempo real, direto da plataforma.

• Sem sair da corretora
• Sem upload manual
• Análise instantânea enquanto você opera

Mais agilidade na hora das suas operações.`,
    image: '/neuron/analisecorretora.png',
    alt: 'Análise Neural de Gráficos',
  },
  {
    title: 'Oportunidade de Compra / Venda',
    description: `Quando a IA encontra uma oportunidade, ela te entrega tudo mastigado:

• Análise: o que o preço está fazendo e por quê

• Gatilho: formação ou movimento que valida a entrada

• Filtro: confirmação extra pra aumentar a probabilidade

• Confirmação: candle ou padrão que dá o "ok" final

Você não precisa decorar. Precisa entender — e a Neuron te mostra.`,
    image: '/neuron/oportunidade_.png',
    alt: 'Dashboard',
  },
  {
    title: 'Dashboard',
    description: `Seus números organizados num só lugar.

• Taxa de acerto

• Sequência de wins e loss (pra identificar padrões emocionais)

•  Evolução do capital ao longo do tempo

• Comparativo semanal e mensal

• Você não melhora o que não mede. O dashboard mostra onde você tá ganhando — e onde tá errando.`,
    image: '/neuron/dashboardd.png',
    alt: 'Oportunidad de Compra 2',
  },
  {
    title: 'Diário Neural e Gestão de Risco',
    description: `Duas ferramentas que separam amador de profissional!
    
    Diário Neural:
• Registro automático de cada operação
• Tags de estado emocional (ansiedade, confiança, impulso)
• Padrões de comportamento identificados 

Gestão de Risco (EM BREVE):
• Cálculo de exposição por operação
• Alertas de overtrading
• Limites diários personalizáveis

Consistência é técnica + autoconhecimento + proteção.`,
    image: '/neuron/diarioneural.png',
    alt: 'Imagem Neural de Gráficos',
  },
];

export const FeaturesCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying]);

  const currentFeature = features[activeIndex];

  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start lg:items-center">
        <div className="relative z-10 order-2 lg:order-1">
          <h3 className="[font-family:'Inter',Helvetica] font-bold text-white text-[28px] md:text-[36px] lg:text-[44px] tracking-[0] leading-[1.2] mb-4 md:mb-6 flex items-center gap-3 flex-wrap">
            <span>{currentFeature.title}</span>
            {currentFeature.title === 'Análise Direto da Corretora' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-[14px] md:text-[16px] font-bold tracking-wide">
                NOVO
              </span>
            )}
          </h3>

          <div className="[font-family:'Inter',Helvetica] font-normal text-[#b3bcda] text-[15px] md:text-[17px] lg:text-[18px] tracking-[0] leading-[1.7] mb-6 md:mb-8 whitespace-pre-line">
            {currentFeature.description}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#00bcff]/50 bg-black/20 flex items-center justify-center hover:bg-[#00bcff]/10 hover:border-[#00bcff] transition-all duration-300 hover:scale-105 active:scale-95 group"
                aria-label="Previous"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00bcff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#00bcff]/50 bg-black/20 flex items-center justify-center hover:bg-[#00bcff]/10 hover:border-[#00bcff] transition-all duration-300 hover:scale-105 active:scale-95 group"
                aria-label="Next"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00bcff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="transition-all duration-300"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'w-8 md:w-10 h-2 md:h-2.5 bg-[#00bcff] shadow-[0_0_10px_rgba(0,188,255,0.5)]'
                        : 'w-2 md:w-2.5 h-2 md:h-2.5 bg-[#00bcff]/30 hover:bg-[#00bcff]/50'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="absolute inset-0 bg-[#00bcff]/10 rounded-[24px] md:rounded-[32px] blur-[60px] md:blur-[80px]"></div>

          <div className="relative rounded-[24px] md:rounded-[32px] border-2 md:border-4 border-solid border-[#00bcff]/40 bg-[linear-gradient(145deg,rgba(0,0,0,0.98)_0%,rgba(20,30,48,0.95)_100%)] overflow-hidden shadow-[0_20px_60px_rgba(0,188,255,0.3)] md:shadow-[0_30px_80px_rgba(0,188,255,0.4)] transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00bcff]/5 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,188,255,0.08),transparent_70%)]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#00bcff]/5 rounded-full blur-[80px] md:blur-[100px]"></div>

            <div className="relative p-3 md:p-4">
              <img
                key={activeIndex}
                src={currentFeature.image}
                alt={currentFeature.alt}
                className="w-full h-auto object-contain animate-in fade-in duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

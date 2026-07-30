import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useCampaignId } from "../hooks/useCampaignId";

// Web components da Cakto (definidos pelo upsell.js). Tipagem para o JSX/TS.
type CaktoAcceptAttrs = React.HTMLAttributes<HTMLElement> & {
  "bg-color"?: string;
  "text-color"?: string;
  "upsell-accept-url"?: string;
  "offer-id"?: string;
  "app-base-url"?: string;
  "offer-type"?: string;
  "upsell-reject-url"?: string;
};
type CaktoRejectAttrs = React.HTMLAttributes<HTMLElement> & {
  "upsell-reject-url"?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "cakto-upsell-buttons": React.HTMLAttributes<HTMLElement>;
      "cakto-upsell-accept": CaktoAcceptAttrs;
      "cakto-upsell-reject": CaktoRejectAttrs;
    }
  }
}

const CAKTO_SCRIPT =
  "https://caktoscripts.nyc3.cdn.digitaloceanspaces.com/upsell.js";

const beneficios = ["Sem instalação", "Acesso imediato", "Qualquer dispositivo"];

export function FerreiraFlixObrigadoPage() {
  useCampaignId("2026-07-ferreiraflix-obrigado");

  // Carrega o script da Cakto só nesta página (uma vez).
  useEffect(() => {
    if (document.querySelector(`script[src="${CAKTO_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = CAKTO_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,rgba(2,6,20,1)_0%,rgba(1,4,13,1)_57%,rgba(0,0,0,1)_100%)] flex items-center justify-center px-4 py-12 [font-family:'Inter',Helvetica]">
      <style>{`
        cakto-upsell-accept::part(button) {
          border-radius: 9999px;
          padding: 1rem 2rem;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 8px 24px rgba(0,188,255,0.35);
        }
        cakto-upsell-reject::part(button) {
          background: transparent;
          color: #9f9f9f;
          text-decoration: underline;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
        }
        cakto-upsell-reject::part(button):hover {
          color: #ffffff;
        }
      `}</style>
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00bcff]/10 to-[#00e0d6]/10 border border-[#00bcff]/30 text-[#00bcff] text-xs md:text-sm font-semibold tracking-wide backdrop-blur-sm">
          <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
          Compra confirmada
        </span>

        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>Seu acesso ao</span>
          <img
            src="/ferreiraflix/ferreiraflix-2.svg"
            alt="FerreiraFlix"
            className="h-7 md:h-11 w-auto inline-block translate-y-[0.05em]"
          />
          <span>está garantido!</span>
        </h1>
        <p className="text-[#9f9f9f] text-base md:text-lg max-w-xl">
          Mas antes de entrar, uma oportunidade que não vai se repetir.
        </p>

        <div className="w-full mt-2 relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#00bcff]/20 via-[#00e0d6]/20 to-[#00bcff]/20 rounded-[28px] blur-2xl opacity-50" />
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#00bcff]/30 shadow-[0_20px_60px_rgba(0,188,255,0.15)]">
            <video
              controls
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="https://s3.ferreiratrader.com.br/neuron/videoneuron.mp4"
                type="video/mp4"
              />
              Seu navegador não suporta vídeos.
            </video>
          </div>
        </div>

        <div className="w-full rounded-2xl border border-[#00bcff]/20 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 flex flex-col items-center gap-5">
          <span className="text-2xl md:text-3xl font-bold tracking-[0.15em] bg-gradient-to-r from-[#00bcff] to-[#00e0d6] bg-clip-text text-transparent">
            NEURON.AI
          </span>
          <p className="text-white text-lg md:text-xl font-semibold">
            Deixe a IA ler o gráfico por você.
          </p>
          <p className="text-[#9f9f9f] text-sm md:text-base max-w-lg leading-relaxed">
            A Neuron.AI identifica intenção, contexto de força e os melhores
            momentos pra entrar — direto no seu gráfico. Adicione agora com 1
            clique, sem precisar digitar o cartão de novo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {beneficios.map((b) => (
              <span
                key={b}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00bcff]/8 to-[#00e0d6]/8 border border-[#00bcff]/20 text-[#00bcff] text-xs font-medium backdrop-blur-sm"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-white text-4xl md:text-5xl font-bold">R$ 197</span>
            <span className="text-[#9f9f9f] text-lg md:text-xl">/mês</span>
          </div>
          <span className="text-[#9f9f9f] text-sm">
            Assinatura mensal · cobrança recorrente automática
          </span>
        </div>

        <div className="w-full flex flex-col items-center gap-3 mt-2">
          <cakto-upsell-buttons>
            <cakto-upsell-accept
              bg-color="#00bcff"
              text-color="#001018"
              upsell-accept-url="https://alunos.alfaclass.com.br"
              offer-id="mjjtzcf"
              app-base-url="https://app.cakto.com.br"
              offer-type="upsell"
              upsell-reject-url="https://alunos.alfaclass.com.br"
            >
              Sim, quero acelerar meus resultados
            </cakto-upsell-accept>
            <cakto-upsell-reject upsell-reject-url="https://alunos.alfaclass.com.br">
              Não quero
            </cakto-upsell-reject>
          </cakto-upsell-buttons>
        </div>

        <p className="text-[#6b7280] text-xs max-w-md">
          Ao aceitar, você contrata a assinatura da Neuron.AI por R$ 197/mês, cobrada
          automaticamente todo mês até o cancelamento. Oferta exclusiva desta página.
        </p>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import Lenis from "lenis";
import { PginaNetflix } from "../screens/PginaNetflix";
import { useUTMTracking } from "../hooks/useUTMTracking";
import { useCampaignId } from "../hooks/useCampaignId";
import { LeadCaptureProvider } from "../components/ferreiraflix/LeadCaptureProvider";

export function FerreiraFlixV2Page() {
  useCampaignId('2026-05-ferreiraflix-v2-vendas');
  useUTMTracking();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 5,
      smoothWheel: false,
      easing: (t) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return (
    <div className="page-ferreiraflix">
      <LeadCaptureProvider>
        <PginaNetflix variant="v2-lead-form" />
      </LeadCaptureProvider>
    </div>
  );
}

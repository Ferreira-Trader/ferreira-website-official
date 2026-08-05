import { useEffect } from "react";
import Lenis from "lenis";
import { PginaNetflix } from "../screens/PginaNetflix";
import { useUTMTracking } from "../hooks/useUTMTracking";
import { useCampaignId } from "../hooks/useCampaignId";

export function FerreiraFlixV3Page() {
  useCampaignId('2026-08-ferreiraflix-v3');
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
      <PginaNetflix variant="v3-cakto" />
    </div>
  );
}

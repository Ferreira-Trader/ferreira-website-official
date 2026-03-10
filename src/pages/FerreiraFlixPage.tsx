import { useEffect } from "react";
import Lenis from "lenis";
import { PginaNetflix } from "../screens/PginaNetflix";

export function FerreiraFlixPage() {
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
      <PginaNetflix />
    </div>
  );
}

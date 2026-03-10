import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface Notification {
  id: number;
  name: string;
  plan: string;
}

const notifications: Notification[] = [
  { id: 1, name: "Eduardo", plan: "Mensal" },
  { id: 2, name: "Adriana", plan: "Semestral" },
  { id: 3, name: "Sergio", plan: "Anual" },
  { id: 4, name: "Mariana", plan: "Mensal" },
  { id: 5, name: "Carlos", plan: "Anual" },
  { id: 6, name: "Patricia", plan: "Semestral" },
  { id: 7, name: "Roberto", plan: "Anual" },
];

export const PurchaseNotifications = () => {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * notifications.length));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const initialDelay = setTimeout(() => {
      setIsVisible(true);

      interval = setInterval(() => {
        setIsVisible(false);

        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % notifications.length);
          setIsVisible(true);
        }, 5000);
      }, 12000);
    }, 20000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const currentNotification = notifications[currentIndex];

  return (
    <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50 pointer-events-none">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-2xl
          bg-gradient-to-r from-[#0a1420] via-[#0f1a28] to-[#0a1420]
          border-2 border-[#00bcff]/40
          shadow-[0_0_30px_rgba(0,188,255,0.2)]
          backdrop-blur-sm
          transition-all duration-500 ease-out
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
        `}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00bcff]/20 flex items-center justify-center border border-[#00bcff]/60">
          <Check className="w-5 h-5 text-[#00bcff]" strokeWidth={3} />
        </div>

        <div className="flex flex-col">
          <p className="text-white font-semibold text-sm md:text-base [font-family:'Inter',Helvetica]">
            {currentNotification.name} acabou de comprar
          </p>
          <p className="text-[#00bcff] text-xs md:text-sm font-medium [font-family:'Inter',Helvetica]">
            o plano {currentNotification.plan}
          </p>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#00bcff]/5 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

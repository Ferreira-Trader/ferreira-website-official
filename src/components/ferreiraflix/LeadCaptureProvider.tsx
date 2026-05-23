import { createContext, useContext, useState, ReactNode } from 'react';
import { LeadCaptureModal } from './LeadCaptureModal';

interface LeadCaptureContextValue {
  openModal: () => void;
}

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export function LeadCaptureProvider({ children }: { children: ReactNode }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <LeadCaptureContext.Provider value={{ openModal: () => setShowModal(true) }}>
      {children}
      {showModal && <LeadCaptureModal onClose={() => setShowModal(false)} />}
    </LeadCaptureContext.Provider>
  );
}

export function useLeadCapture(): LeadCaptureContextValue {
  const ctx = useContext(LeadCaptureContext);
  return ctx ?? { openModal: () => {} };
}

import { getCapturedUTMs } from '../hooks/useUTMTracking';

const APPS_SCRIPT_URL = import.meta.env.VITE_LEAD_APPS_SCRIPT_URL as string | undefined;

const readCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

export interface LeadData {
  name: string;
  email: string;
  phone: string;
}

export async function submitLead(data: LeadData, eventID: string): Promise<boolean> {
  if (!APPS_SCRIPT_URL) {
    console.warn('[leadSubmit] VITE_LEAD_APPS_SCRIPT_URL não configurada — lead não persistido');
    return false;
  }

  const utms = getCapturedUTMs();

  const payload = {
    nome: data.name,
    email: data.email,
    telefone: data.phone,
    source: 'ferreiraflix-v2',
    campaign: '2026-05-ferreiraflix-v2-vendas',
    utm_source: utms.utm_source || '',
    utm_medium: utms.utm_medium || '',
    utm_campaign: utms.utm_campaign || '',
    utm_content: utms.utm_content || '',
    utm_term: utms.utm_term || '',
    eventID,
    source_url: window.location.href,
    fbc: readCookie('_fbc'),
    fbp: readCookie('_fbp'),
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error('[leadSubmit] Erro ao enviar para Apps Script:', error);
    return false;
  }
}

import { getCapturedUTMs } from '../hooks/useUTMTracking';

const DATACRAZY_WEBHOOK_URL =
  'https://api.datacrazy.io/v1/crm/api/crm/integrations/webhook/business/19fbbc11-ce0e-4d06-9996-6f202f06f51b';

const CAMPAIGN_ID = '2026-05-ferreiraflix-v2';
const SOURCE = 'ferreiraflix-v2-modal';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
}

interface DataCrazyPayload {
  name: string;
  email: string;
  whatsapp: string;
  source: string;
  campaign: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export async function submitToDataCrazy(data: LeadData): Promise<boolean> {
  const utms = getCapturedUTMs();
  const cleanPhone = data.phone.replace(/\D/g, '');

  const payload: DataCrazyPayload = {
    name: data.name,
    email: data.email,
    whatsapp: cleanPhone,
    source: SOURCE,
    campaign: CAMPAIGN_ID,
    ...(utms.utm_source && { utm_source: utms.utm_source }),
    ...(utms.utm_medium && { utm_medium: utms.utm_medium }),
    ...(utms.utm_campaign && { utm_campaign: utms.utm_campaign }),
    ...(utms.utm_content && { utm_content: utms.utm_content }),
    ...(utms.utm_term && { utm_term: utms.utm_term }),
  };

  try {
    const response = await fetch(DATACRAZY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error('[dataCrazy] Erro ao enviar para DataCrazy:', error);
    return false;
  }
}

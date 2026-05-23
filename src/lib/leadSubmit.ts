import { getCapturedUTMs } from '../hooks/useUTMTracking';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzdMLVS2FB7Kr5tGnr39jhY_TmUsRk7CPdIxKTlZBuwbXYDQ9IKvYdBaSs-quwsRdR3Fw/exec';

const CAMPAIGN_ID = '2026-05-ferreiraflix-v2';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
}

interface AppsScriptPayload {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  campaign: string;
  name: string;
  email: string;
  phone: string;
}

// `eventID` permanece no parâmetro para uso futuro pelo CRM/CAPI, mas o
// Apps Script V2 só guarda os 9 campos abaixo na ordem da planilha.
export async function submitLead(data: LeadData, _eventID: string): Promise<boolean> {
  const utms = getCapturedUTMs();

  const payload: AppsScriptPayload = {
    utm_source: utms.utm_source || '',
    utm_medium: utms.utm_medium || '',
    utm_campaign: utms.utm_campaign || '',
    utm_content: utms.utm_content || '',
    utm_term: utms.utm_term || '',
    campaign: CAMPAIGN_ID,
    name: data.name,
    email: data.email,
    phone: data.phone,
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    return response.ok;
  } catch (error) {
    console.error('[leadSubmit] Erro ao enviar para Apps Script:', error);
    return false;
  }
}

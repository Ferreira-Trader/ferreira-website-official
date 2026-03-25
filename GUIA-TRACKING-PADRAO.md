# Guia Padrão de Tracking GTM - Ferreira Trader

> Padrão de rastreamento para todos os sites do Ferreira Trader
> Stack: React + TypeScript + Vite + Tailwind
> Tracking: Google Tag Manager server-side via dataLayer
> Servidor GTM: `yag.ferreiratrader.com.br`
> Container: `GTM-PJGMM2NV`

---

## Dois Tipos de Página

| | Página de Captura | Página de Vendas |
|---|---|---|
| **Exemplo** | v1.3.1 | v2.1 |
| **Objetivo** | Coletar lead (nome, email, telefone) | Redirecionar para checkout externo |
| **Formulário** | Sim (popup modal) | Não |
| **Eventos dataLayer** | 9 eventos customizados | Apenas `page_campaign_id` |
| **UTM Handling** | Simples (sessionStorage) | Avançado (MutationObserver + SCK) |
| **Destino dos dados** | Google Apps Script (Sheets) | Checkout externo (Kiwify/custom) |
| **Thank You page** | Com tracking completo | Simples, sem tracking |
| **Campaign ID** | `YYYY-MM-produto-captura` | `YYYY-MM-produto-vendas` |

---

## PARTE COMUM (Ambos os tipos)

### PASSO 1: Configurar o index.html

Idêntico para TODOS os sites. Trocar apenas o `page_campaign_id`.

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TITULO_DO_PROJETO</title>

    <!-- 1. DATALAYER COM CAMPAIGN_ID - SEMPRE ANTES DO GTM -->
    <script>
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'page_campaign_id': 'YYYY-MM-NOME-DO-PRODUTO-TIPO'
      });
    </script>

    <!-- 2. GOOGLE TAG MANAGER (SERVIDOR FERREIRA) -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://yag.ferreiratrader.com.br/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PJGMM2NV');</script>
  </head>
  <body>
    <!-- 3. NOSCRIPT FALLBACK -->
    <noscript><iframe src="https://yag.ferreiratrader.com.br/ns.html?id=GTM-PJGMM2NV"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

    <div id="app"></div>
    <script type="module" src="./src/index.tsx"></script>
  </body>
</html>
```

### Padrão de nomenclatura do campaign_id:

```
YYYY-MM-nome-do-produto-tipo
```

| Parte | Descrição | Exemplos |
|---|---|---|
| `YYYY-MM` | Ano e mês do lançamento | `2025-11` |
| `nome-do-produto` | Slug do produto | `alfa-black-edition` |
| `tipo` | Tipo da página | `captura`, `vendas`, `checkout`, `obrigado` |

**Exemplos reais:**
- `2025-11-alfa-black-edition-captura`
- `2025-11-alfa-black-edition-vendas`

### Regras fixas (não mudam):
- Servidor GTM: `yag.ferreiratrader.com.br`
- Container ID: `GTM-PJGMM2NV`
- dataLayer SEMPRE antes do GTM no `<head>`
- noscript no início do `<body>`

---

## PARTE A: PÁGINA DE VENDAS (sem formulário)

Páginas de vendas são mais simples. Não coletam dados — apenas redirecionam para checkout com UTMs.

### PASSO 2V: Criar src/hooks/useUTMTracking.ts

Sistema avançado de UTM que:
- Captura UTMs da URL atual + referrer
- Fallback inteligente para utm_source (referrer hostname ou "direto")
- Captura parâmetros extras automaticamente (fbclid, gclid, etc)
- Gera SCK (Seed Correction Key) para compatibilidade com plataformas
- Propaga UTMs automaticamente para TODOS os links e iframes da página
- Usa MutationObserver para links adicionados dinamicamente

```typescript
import { useEffect, useCallback, useRef } from 'react';

interface UTMParams {
  [key: string]: string;
}

interface UseUTMTrackingReturn {
  utms: UTMParams;
  sck: string;
  getUrlWithUTMs: (baseUrl: string) => string;
  redirectWithUTMs: (baseUrl: string) => void;
}

export const useUTMTracking = (): UseUTMTrackingReturn => {
  const utmsRef = useRef<UTMParams>({});
  const sckRef = useRef<string>('');
  const initializedRef = useRef(false);

  const captureUTMs = useCallback(() => {
    let parametros = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    // Captura parâmetros extras da URL (fbclid, gclid, etc)
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    for (const [key] of params) {
      if (!parametros.includes(key)) {
        parametros.push(key);
      }
    }

    const urlParamsCapt = new URLSearchParams(window.location.search);
    const referrerSearch = document.referrer ? document.referrer.split('?')[1] || '' : '';
    const urlParamsCaptReferrer = new URLSearchParams(referrerSearch);

    const utms: UTMParams = {};

    parametros.forEach(param => {
      if (param === 'utm_source') {
        // Fallback: URL > Referrer UTM > Hostname do Referrer > "direto"
        const fromUrl = urlParamsCapt.get(param);
        const fromReferrer = urlParamsCaptReferrer.get(param);
        if (fromUrl) {
          utms[param] = fromUrl;
        } else if (fromReferrer) {
          utms[param] = fromReferrer;
        } else if (document.referrer) {
          try {
            utms[param] = new URL(document.referrer).hostname;
          } catch {
            utms[param] = 'direto';
          }
        } else {
          utms[param] = 'direto';
        }
      } else {
        const value = urlParamsCapt.get(param) ?? urlParamsCaptReferrer.get(param) ?? '';
        if (value) {
          utms[param] = value;
        }
      }
    });

    // Gera SCK (valores concatenados com |, sem duplicatas)
    const sckValues = Object.values(utms).filter(value => value !== '' && value !== 'direto');
    const currentSck = urlParamsCapt.get('sck');
    let currentSckValues: string[] = [];
    if (currentSck) {
      currentSckValues = currentSck.split('|');
    }
    const filteredSckValues = sckValues.filter(value => !currentSckValues.includes(value));
    const sck = filteredSckValues.length > 0 ? filteredSckValues.join('|') : '';

    utmsRef.current = utms;
    sckRef.current = sck;
    return { utms, sck };
  }, []);

  // Gera URL com UTMs anexados
  const getUrlWithUTMs = useCallback((baseUrl: string): string => {
    try {
      const url = new URL(baseUrl);
      const searchParams = new URLSearchParams(url.search);
      for (const key in utmsRef.current) {
        if (!searchParams.has(key) && utmsRef.current[key]) {
          searchParams.set(key, utmsRef.current[key]);
        }
      }
      if (!searchParams.has('sck') && sckRef.current) {
        searchParams.set('sck', sckRef.current);
      }
      const queryString = searchParams.toString();
      return queryString ? `${url.origin}${url.pathname}?${queryString}` : `${url.origin}${url.pathname}`;
    } catch {
      return baseUrl;
    }
  }, []);

  // Redireciona para URL com UTMs
  const redirectWithUTMs = useCallback((baseUrl: string): void => {
    window.location.href = getUrlWithUTMs(baseUrl);
  }, [getUrlWithUTMs]);

  // Atualiza automaticamente TODOS os links <a> da página
  const updateAllLinks = useCallback(() => {
    const utms = utmsRef.current;
    const sck = sckRef.current;

    document.querySelectorAll('a').forEach((el: HTMLAnchorElement) => {
      try {
        const elURL = new URL(el.href);
        // Ignora âncoras internas, javascript:, mailto:, tel:
        if (elURL.hash && elURL.pathname === window.location.pathname) return;
        if (el.href.startsWith('javascript:') || el.href.startsWith('mailto:') || el.href.startsWith('tel:')) return;

        const elSearchParams = new URLSearchParams(elURL.search);
        let modified = false;
        for (const key in utms) {
          if (!elSearchParams.has(key) && utms[key]) {
            elSearchParams.set(key, utms[key]);
            modified = true;
          }
        }
        if (!elSearchParams.has('sck') && sck) {
          elSearchParams.set('sck', sck);
          modified = true;
        }
        if (modified) {
          el.href = elURL.origin + elURL.pathname + '?' + elSearchParams.toString();
        }
      } catch { /* Ignora URLs inválidas */ }
    });
  }, []);

  // Atualiza automaticamente TODOS os iframes da página
  const updateAllIframes = useCallback(() => {
    const utms = utmsRef.current;
    const sck = sckRef.current;

    document.querySelectorAll('iframe').forEach((iframe: HTMLIFrameElement) => {
      const actualSrc = iframe.getAttribute('data-src') || iframe.src;
      if (!actualSrc || actualSrc === 'about:blank') return;

      try {
        const iframeURL = new URL(actualSrc);
        const iframeSearchParams = new URLSearchParams(iframeURL.search);
        let modified = false;
        for (const key in utms) {
          if (!iframeSearchParams.has(key) && utms[key]) {
            iframeSearchParams.set(key, utms[key]);
            modified = true;
          }
        }
        if (!iframeSearchParams.has('sck') && sck) {
          iframeSearchParams.set('sck', sck);
          modified = true;
        }
        if (modified) {
          const newSrc = iframeURL.origin + iframeURL.pathname + '?' + iframeSearchParams.toString();
          if (iframe.hasAttribute('data-src')) {
            iframe.setAttribute('data-src', newSrc);
          } else {
            iframe.src = newSrc;
          }
        }
      } catch { /* Ignora URLs inválidas */ }
    });
  }, []);

  // Inicialização + MutationObserver para elementos dinâmicos
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    captureUTMs();

    const updateAll = () => {
      updateAllLinks();
      updateAllIframes();
    };

    if (document.readyState === 'complete') {
      updateAll();
    } else {
      window.addEventListener('load', updateAll);
    }

    // Observer para links/iframes adicionados dinâmicamente
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.tagName === 'A' || node.tagName === 'IFRAME' ||
                node.querySelector('a') || node.querySelector('iframe')) {
              shouldUpdate = true;
            }
          }
        });
      });
      if (shouldUpdate) updateAll();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('load', updateAll);
      observer.disconnect();
    };
  }, [captureUTMs, updateAllLinks, updateAllIframes]);

  return {
    utms: utmsRef.current,
    sck: sckRef.current,
    getUrlWithUTMs,
    redirectWithUTMs
  };
};

export default useUTMTracking;
```

### PASSO 3V: Usar no componente principal

```typescript
import { useUTMTracking } from '../hooks/useUTMTracking';

// TROCAR: URL do checkout do produto
const CHECKOUT_URL = 'https://checkout.ferreiratrader.com.br/checkout/SLUG-DO-CHECKOUT';

export const SalesPage = () => {
  const { redirectWithUTMs } = useUTMTracking();

  const redirectToCheckout = () => {
    redirectWithUTMs(CHECKOUT_URL);
  };

  return (
    <div>
      {/* Todos os <a> da página já recebem UTMs automaticamente */}
      {/* Para botões que redirecionam via JS: */}
      <button onClick={redirectToCheckout}>
        GARANTIR MINHA VAGA
      </button>
    </div>
  );
};
```

### PASSO 4V: Thank You Page (simples)

Na página de vendas, a thank you page é simples — sem tracking customizado.
O GTM server-side rastreia o acesso à `/obrigado` automaticamente.

```typescript
const ThankYou = () => {
  return (
    <div>
      <h1>Parabéns! Sua inscrição foi confirmada!</h1>
      <p>Verifique seu e-mail com os dados de acesso.</p>

      {/* TROCAR: links de suporte/comunidade */}
      <button onClick={() => window.open('https://ferreiratrader.link/suporte', '_blank')}>
        Falar com Suporte
      </button>
      <button onClick={() => window.open('https://ferreiratrader.link/discord', '_blank')}>
        Entrar no Discord
      </button>
    </div>
  );
};
```

### Variáveis para trocar (Página de Vendas):
| # | Arquivo | Variável | Exemplo |
|---|---------|----------|---------|
| 1 | `index.html` | `page_campaign_id` | `2025-11-alfa-black-edition-vendas` |
| 2 | Componente | `CHECKOUT_URL` | URL do checkout Kiwify/custom |
| 3 | ThankYou | Links de suporte/comunidade | URLs do ferreiratrader.link |

### Estrutura de pastas (Vendas):
```
src/
  hooks/
    useUTMTracking.ts       # UTM avançado (copiar inteiro)
  screens/
    Desktop/
      Desktop.tsx           # Página principal com redirectToCheckout
    ThankYou/
      ThankYou.tsx          # Página simples
index.html                  # GTM + dataLayer init
```

---

## PARTE B: PÁGINA DE CAPTURA (com formulário)

Páginas de captura coletam dados do lead e enviam para Google Sheets.
Possuem tracking completo de funil.

### PASSO 2C: Criar src/lib/utm-tracker.ts

Versão simplificada para captura (sem MutationObserver, sem SCK).
Apenas captura e armazena no sessionStorage para enviar junto com o form.

```typescript
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

// TROCAR: chave única por campanha
const UTM_STORAGE_KEY = 'NOME_CAMPANHA_utms';

export const captureUTMs = (): UTMParams => {
  const params = new URLSearchParams(window.location.search);
  const utms: UTMParams = {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
  const cleanUTMs = Object.fromEntries(
    Object.entries(utms).filter(([_, v]) => v !== undefined)
  ) as UTMParams;
  if (Object.keys(cleanUTMs).length > 0) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(cleanUTMs));
  }
  return cleanUTMs;
};

export const getUTMs = (): UTMParams => {
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao recuperar UTMs:', error);
  }
  return {};
};

export const clearUTMs = (): void => {
  sessionStorage.removeItem(UTM_STORAGE_KEY);
};

export const getUTMQueryString = (): string => {
  const utms = getUTMs();
  const params = new URLSearchParams(utms as Record<string, string>);
  return params.toString();
};
```

### PASSO 3C: Criar src/lib/data-hasher.ts

Gera hash SHA-256 de dados sensíveis e transaction IDs.

```typescript
import { UTMParams } from './utm-tracker';

export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16);
};

export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return (timestamp + randomPart).substring(0, 12);
};

export interface FormData {
  name: string;
  email: string;
  phone: string;
}

export interface HashedData {
  transaction_id: string;
  email_hash: string;
  phone_hash: string;
  first_name: string;
}

export const hashFormData = async (formData: FormData): Promise<HashedData> => {
  const [emailHash, phoneHash] = await Promise.all([
    hashData(formData.email.toLowerCase().trim()),
    hashData(formData.phone.replace(/\D/g, '')),
  ]);
  const firstName = formData.name.split(' ')[0];
  return {
    transaction_id: generateTransactionId(),
    email_hash: emailHash,
    phone_hash: phoneHash,
    first_name: firstName,
  };
};

export const createThankYouUrl = async (
  formData: FormData,
  campaign: string,
  utms: UTMParams
): Promise<string> => {
  const hashedData = await hashFormData(formData);
  const params = new URLSearchParams({
    tid: hashedData.transaction_id,
    em: hashedData.email_hash,
    ph: hashedData.phone_hash,
    nm: hashedData.first_name,
    campaign,
  });
  if (utms.utm_source) params.append('utm_source', utms.utm_source);
  if (utms.utm_medium) params.append('utm_medium', utms.utm_medium);
  if (utms.utm_campaign) params.append('utm_campaign', utms.utm_campaign);
  if (utms.utm_content) params.append('utm_content', utms.utm_content);
  if (utms.utm_term) params.append('utm_term', utms.utm_term);
  return `/obrigado?${params.toString()}`;
};

export interface ThankYouParams {
  transaction_id?: string;
  email_hash?: string;
  phone_hash?: string;
  first_name?: string;
  campaign?: string;
  utms?: UTMParams;
}

export const parseThankYouUrl = (): ThankYouParams => {
  const params = new URLSearchParams(window.location.search);
  return {
    transaction_id: params.get('tid') || undefined,
    email_hash: params.get('em') || undefined,
    phone_hash: params.get('ph') || undefined,
    first_name: params.get('nm') || undefined,
    campaign: params.get('campaign') || undefined,
    utms: {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_content: params.get('utm_content') || undefined,
      utm_term: params.get('utm_term') || undefined,
    },
  };
};
```

### PASSO 4C: Criar src/lib/analytics.ts

Central de TODOS os 9 eventos do GTM.

```typescript
import { UTMParams } from './utm-tracker';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const pushToDataLayer = (data: any) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// --- EVENTOS DE FORMULÁRIO ---

export const trackFormStart = (formName: string) => {
  pushToDataLayer({
    event: 'form_start',
    form_name: formName,
    timestamp: new Date().toISOString(),
  });
};

export const trackFieldCompleted = (fieldName: string, formName: string) => {
  pushToDataLayer({
    event: 'form_field_completed',
    form_name: formName,
    field_name: fieldName,
    timestamp: new Date().toISOString(),
  });
};

// EVENTO DE CONVERSÃO PRINCIPAL
export const trackFormSuccess = (
  formName: string,
  transactionId: string,
  utms?: UTMParams,
  userData?: { name?: string; email?: string; phone?: string; }
) => {
  pushToDataLayer({
    event: 'form_success',
    form_name: formName,
    transaction_id: transactionId,
    timestamp: new Date().toISOString(),
    ...(userData && { userData: { name: userData.name, email: userData.email, phone: userData.phone } }),
    ...utms,
  });
};

export const trackFormError = (
  formName: string,
  errorMessage: string,
  errorType?: string
) => {
  pushToDataLayer({
    event: 'form_error',
    form_name: formName,
    error_message: errorMessage,
    error_type: errorType || 'submission_error',
    timestamp: new Date().toISOString(),
  });
};

export const trackFormAbandonment = (
  formName: string,
  filledFields: string[],
  timeSpent: number
) => {
  pushToDataLayer({
    event: 'form_abandoned',
    form_name: formName,
    filled_fields: filledFields,
    time_spent_seconds: timeSpent,
    timestamp: new Date().toISOString(),
  });
};

// --- EVENTOS DE PÁGINA ---

// EVENTO DE CONFIRMAÇÃO DE CONVERSÃO
export const trackThankYouPageView = (data: {
  transaction_id: string;
  email_hash?: string;
  phone_hash?: string;
  first_name?: string;
  campaign?: string;
  utms?: UTMParams;
}) => {
  pushToDataLayer({
    event: 'thank_you_page_view',
    transaction_id: data.transaction_id,
    userData: { email: data.email_hash, phone: data.phone_hash, name: data.first_name },
    campaign: data.campaign,
    timestamp: new Date().toISOString(),
    ...data.utms,
  });
};

export const trackPageEngagement = (
  pageName: string,
  secondsOnPage: number,
  transactionId?: string
) => {
  pushToDataLayer({
    event: 'page_engagement',
    page_name: pageName,
    seconds_on_page: secondsOnPage,
    transaction_id: transactionId,
    timestamp: new Date().toISOString(),
  });
};

export const trackPageExit = (
  pageName: string,
  totalTimeOnPage: number,
  transactionId?: string
) => {
  pushToDataLayer({
    event: 'page_exit',
    page_name: pageName,
    total_time_seconds: totalTimeOnPage,
    transaction_id: transactionId,
    timestamp: new Date().toISOString(),
  });
};

// --- EVENTOS DE INTERAÇÃO ---

export const trackWhatsAppClick = (
  groupUrl: string,
  transactionId?: string
) => {
  pushToDataLayer({
    event: 'whatsapp_group_click',
    group_url: groupUrl,
    transaction_id: transactionId,
    timestamp: new Date().toISOString(),
  });
};

// --- SETUP FUNCTIONS (retornam cleanup) ---

export const setupFormAbandonmentTracking = (
  formName: string,
  getFilledFields: () => string[]
): (() => void) => {
  const startTime = Date.now();
  let tracked = false;

  const handleBeforeUnload = () => {
    if (!tracked) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const filledFields = getFilledFields();
      if (filledFields.length > 0) {
        trackFormAbandonment(formName, filledFields, timeSpent);
        tracked = true;
      }
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => { window.removeEventListener('beforeunload', handleBeforeUnload); };
};

export const setupPageEngagementTracking = (
  pageName: string,
  engagementThresholdSeconds: number = 10,
  transactionId?: string
): (() => void) => {
  const startTime = Date.now();

  const engagementTimer = setTimeout(() => {
    const secondsOnPage = Math.floor((Date.now() - startTime) / 1000);
    trackPageEngagement(pageName, secondsOnPage, transactionId);
  }, engagementThresholdSeconds * 1000);

  const handleBeforeUnload = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    trackPageExit(pageName, totalTime, transactionId);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    clearTimeout(engagementTimer);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};
```

### PASSO 5C: Criar src/lib/google-apps-script.ts

Envia dados do lead para Google Sheets.

```typescript
import { UTMParams } from './utm-tracker';

// TROCAR: URL do Google Apps Script (deploy como web app)
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_SCRIPT_ID/exec';

// TROCAR: Campaign ID (mesmo do index.html)
const CAMPAIGN_ID = 'YYYY-MM-NOME-DO-PRODUTO-captura';

export interface FormSubmissionData {
  name: string;
  email: string;
  phone: string;
}

export const submitToGoogleAppsScript = async (
  formData: FormSubmissionData,
  utms: UTMParams = {}
): Promise<boolean> => {
  try {
    const payload = {
      utm_source: utms.utm_source || '',
      utm_medium: utms.utm_medium || '',
      utm_campaign: utms.utm_campaign || '',
      utm_content: utms.utm_content || '',
      utm_term: utms.utm_term || '',
      campaign: CAMPAIGN_ID,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });

    return true;
  } catch (error) {
    console.error('Erro ao enviar para Google Apps Script:', error);
    return false;
  }
};

export const getCampaignId = (): string => CAMPAIGN_ID;
```

**Detalhes técnicos:**
- `Content-Type: 'text/plain'` (NÃO application/json) — necessário para CORS
- `mode: 'no-cors'` — Google Apps Script exige isso
- Não é possível ler a resposta com no-cors (assume sucesso se não der erro)

### PASSO 6C: Implementar o Formulário com Tracking

#### Imports necessários:

```typescript
import { captureUTMs, getUTMs } from "../lib/utm-tracker"
import {
  trackFormStart, trackFieldCompleted, trackFormSuccess,
  trackFormError, setupFormAbandonmentTracking
} from "../lib/analytics"
import { createThankYouUrl, generateTransactionId } from "../lib/data-hasher"
import { submitToGoogleAppsScript } from "../lib/google-apps-script"

// TROCAR: campaign do projeto
const FORM_NAME = 'YYYY-MM-NOME-DO-PRODUTO-captura';
const CAMPAIGN = 'YYYY-MM-NOME-DO-PRODUTO-captura';
```

#### States necessários:

```typescript
const [formStarted, setFormStarted] = useState(false)
const [completedFields, setCompletedFields] = useState<Set<string>>(new Set())
const [isSubmitting, setIsSubmitting] = useState(false)
const isSubmittingRef = useRef(false)
const [honeypot, setHoneypot] = useState("")
const cleanupAbandonmentRef = useRef<(() => void) | null>(null)
```

#### useEffects:

```typescript
// Captura UTMs ao montar
useEffect(() => { captureUTMs() }, [])

// Setup abandono quando form inicia
useEffect(() => {
  if (formStarted && !cleanupAbandonmentRef.current) {
    const getFilledFields = () => {
      const fields: string[] = []
      if (formData.name) fields.push('name')
      if (formData.email) fields.push('email')
      if (phone) fields.push('phone')
      return fields
    }
    cleanupAbandonmentRef.current = setupFormAbandonmentTracking(FORM_NAME, getFilledFields)
  }
}, [formStarted, formData.name, formData.email, phone])
```

#### Handlers dos campos:

```typescript
// Primeiro foco -> form_start (apenas 1x)
const handleFormStart = () => {
  if (!formStarted) {
    setFormStarted(true)
    trackFormStart(FORM_NAME)
  }
}

// Campo preenchido -> form_field_completed (apenas 1x por campo)
const handleFieldComplete = (fieldName: string, value: string) => {
  if (value && value.trim().length > 2 && !completedFields.has(fieldName)) {
    trackFieldCompleted(fieldName, FORM_NAME)
    setCompletedFields(prev => new Set(prev).add(fieldName))
  }
}
```

#### Handler de submit (ORDEM CRÍTICA):

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // 1. VALIDAÇÕES (antes de preventDefault!)
  if (!formData.name || !formData.email || !phone) {
    e.preventDefault()
    e.stopPropagation() // Impede GTM de capturar submit inválido
    return
  }

  // 2. Previne submit nativo
  e.preventDefault()

  // 3. Proteção multi-submit
  if (isSubmittingRef.current) return
  isSubmittingRef.current = true
  setIsSubmitting(true)

  // 4. Honeypot check
  if (honeypot) {
    setTimeout(() => { window.location.href = '/obrigado' }, 1500)
    return
  }

  try {
    // 5. Coleta UTMs
    const utms = getUTMs()

    // 6. Envia Google Apps Script
    await submitToGoogleAppsScript(
      { name: formData.name, email: formData.email, phone: phone },
      utms
    )

    // 7. Gera transaction ID
    const transactionId = generateTransactionId()

    // 8. EVENTO DE CONVERSÃO
    trackFormSuccess(FORM_NAME, transactionId, utms, {
      name: formData.name, email: formData.email, phone: phone
    })

    // 9. Cria URL thank you com dados hasheados
    const thankYouUrl = await createThankYouUrl(
      { name: formData.name, email: formData.email, phone: phone },
      CAMPAIGN, utms
    )

    // 10. Redireciona com delay
    setTimeout(() => { window.location.href = thankYouUrl }, 1500)

  } catch (error) {
    trackFormError(FORM_NAME, error instanceof Error ? error.message : 'Unknown error')
    setIsSubmitting(false)
    isSubmittingRef.current = false
  }
}
```

#### HTML do formulário:

```tsx
<div data-gtm-form="complete">
  <form onSubmit={handleSubmit} id="lead-form">
    {/* HONEYPOT - INVISÍVEL */}
    <input
      type="text" name="website" value={honeypot}
      onChange={(e) => setHoneypot(e.target.value)}
      style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
      tabIndex={-1} autoComplete="off"
    />

    <input name="name" onFocus={handleFormStart}
      onBlur={(e) => handleFieldComplete('name', e.target.value)} required />

    <input name="email" type="email" onFocus={handleFormStart}
      onBlur={(e) => handleFieldComplete('email', e.target.value)} required />

    <PhoneInput defaultCountry="BR" onFocus={handleFormStart}
      onBlur={() => handleFieldComplete('phone', phone)} required />

    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Enviando..." : "QUERO PARTICIPAR"}
    </button>
  </form>
</div>
```

#### Data attributes para CTAs:

```tsx
<button data-gtm-button="hero-cta">CTA Principal</button>
<button data-gtm-button="cta-section">CTA Seção</button>
```

### PASSO 7C: Thank You Page (com tracking completo)

```typescript
import { parseThankYouUrl } from "../../lib/data-hasher";
import {
  trackThankYouPageView, trackWhatsAppClick, setupPageEngagementTracking
} from "../../lib/analytics";

export const ThankYou = () => {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const data = parseThankYouUrl();
    setPageData(data);

    if (data.transaction_id) {
      trackThankYouPageView({
        transaction_id: data.transaction_id,
        email_hash: data.email_hash,
        phone_hash: data.phone_hash,
        first_name: data.first_name,
        campaign: data.campaign,
        utms: data.utms,
      });
    }

    const cleanup = setupPageEngagementTracking('thank_you', 10, data.transaction_id);
    return () => cleanup();
  }, []);

  const handleWhatsAppClick = () => {
    // TROCAR: URL do grupo WhatsApp
    const whatsappUrl = "https://ferreiratrader.link/wa-entrar-grupo";
    trackWhatsAppClick(whatsappUrl, pageData?.transaction_id);
  };

  return (
    <div>
      <h1>Você agora faz parte!</h1>
      <a href="https://ferreiratrader.link/wa-entrar-grupo"
         target="_blank" rel="noopener noreferrer"
         onClick={handleWhatsAppClick}>
        ENTRAR NO GRUPO VIP
      </a>
    </div>
  );
};
```

### Variáveis para trocar (Página de Captura):
| # | Arquivo | Variável | Exemplo |
|---|---------|----------|---------|
| 1 | `index.html` | `page_campaign_id` | `2025-11-alfa-black-edition-captura` |
| 2 | `utm-tracker.ts` | `UTM_STORAGE_KEY` | `alfa_black_utms` |
| 3 | `google-apps-script.ts` | `GOOGLE_APPS_SCRIPT_URL` | URL do deploy |
| 4 | `google-apps-script.ts` | `CAMPAIGN_ID` | Mesmo do index.html |
| 5 | `FormPopup.tsx` | `FORM_NAME` / `CAMPAIGN` | Mesmo do index.html |
| 6 | `ThankYou.tsx` | URL do WhatsApp | Link do grupo |
| 7 | Botões CTA | `data-gtm-button` | Nomes descritivos |

### Estrutura de pastas (Captura):
```
src/
  lib/
    analytics.ts          # 9 eventos GTM (copiar inteiro)
    utm-tracker.ts        # Captura UTMs simples (trocar storage key)
    data-hasher.ts        # Hash + transaction ID (copiar inteiro)
    google-apps-script.ts # Envio p/ Sheets (trocar URL + campaign)
  components/
    FormPopup.tsx         # Formulário completo (nome, email, telefone)
  screens/
    ThankYou/
      ThankYou.tsx        # Página de obrigado COM tracking
index.html                # GTM + dataLayer init
```

### Dependência npm (apenas captura):
```bash
npm install react-phone-number-input
```

---

## TABELA DE EVENTOS GTM - Referência rápida

Para configurar Tags/Triggers no GTM:

| Evento | Tipo de Página | Trigger GTM | Tag sugerida | Prioridade |
|--------|---------------|-------------|-------------|------------|
| `form_start` | Captura | Custom Event | GA4 Event | Baixa |
| `form_field_completed` | Captura | Custom Event | GA4 Event | Baixa |
| `form_success` | Captura | Custom Event | GA4 Conversion + Meta CAPI + Google Ads | CRÍTICA |
| `form_error` | Captura | Custom Event | GA4 Event | Média |
| `form_abandoned` | Captura | Custom Event | GA4 Event | Média |
| `thank_you_page_view` | Captura | Custom Event | GA4 Conversion (confirmação) | CRÍTICA |
| `page_engagement` | Captura | Custom Event | GA4 Event | Baixa |
| `page_exit` | Captura | Custom Event | GA4 Event | Baixa |
| `whatsapp_group_click` | Captura | Custom Event | GA4 Event | Média |

Páginas de vendas NÃO disparam eventos customizados — dependem do GTM server-side.

### Variáveis do DataLayer para configurar no GTM:
- `page_campaign_id` (ambos os tipos)
- `form_name` (apenas captura)
- `transaction_id` (apenas captura)
- `userData.name`, `userData.email`, `userData.phone` (apenas captura)
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` (apenas captura)
- `campaign` (apenas captura)

---

## PROTEÇÕES (Página de Captura - não remover)

1. **Anti-spam (Honeypot):** Campo invisível `website` — se preenchido = bot
2. **Anti-duplo submit:** `isSubmittingRef` (ref) + `isSubmitting` (state)
3. **Erros graciosos:** Google Apps Script pode falhar sem quebrar fluxo
4. **e.stopPropagation():** Em validações que falham, impede GTM de capturar submit inválido
5. **Dados hasheados:** Email e telefone hasheados na URL da thank you page (SHA-256)
6. **Transaction ID único:** Cada conversão tem ID rastreável de ponta a ponta

---

## DECISÃO RÁPIDA: Qual tipo usar?

```
O site tem formulário de captura de lead?
  SIM -> PARTE B (Captura) - Passos 2C a 7C
  NÃO -> PARTE A (Vendas) - Passos 2V a 4V

Ambos usam o PASSO 1 (index.html) idêntico.
```

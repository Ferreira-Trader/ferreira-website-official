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

const EXCLUDED_DOMAINS = ['api.whatsapp.com', 'wa.me', 'ferreiratrader.link'];

// Estado de módulo para uso fora de React (lib/leadSubmit, lib/hotmartCheckout)
let capturedUTMs: UTMParams = {};
let capturedSck: string = '';

function captureUTMsFromUrl(): { utms: UTMParams; sck: string } {
  let parametros = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

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

  const sckValues = Object.values(utms).filter(value => value !== '' && value !== 'direto');
  const currentSck = urlParamsCapt.get('sck');
  let currentSckValues: string[] = [];
  if (currentSck) {
    currentSckValues = currentSck.split('|');
  }
  const filteredSckValues = sckValues.filter(value => !currentSckValues.includes(value));
  const sck = filteredSckValues.length > 0 ? filteredSckValues.join('|') : '';

  capturedUTMs = utms;
  capturedSck = sck;

  return { utms, sck };
}

export function getCapturedUTMs(): UTMParams {
  return { ...capturedUTMs };
}

export function getCapturedSck(): string {
  return capturedSck;
}

export function getUrlWithUTMs(baseUrl: string): string {
  try {
    const url = new URL(baseUrl);
    const searchParams = new URLSearchParams(url.search);
    for (const key in capturedUTMs) {
      if (!searchParams.has(key) && capturedUTMs[key]) {
        searchParams.set(key, capturedUTMs[key]);
      }
    }
    if (!searchParams.has('sck') && capturedSck) {
      searchParams.set('sck', capturedSck);
    }
    const queryString = searchParams.toString();
    return queryString ? `${url.origin}${url.pathname}?${queryString}` : `${url.origin}${url.pathname}`;
  } catch {
    return baseUrl;
  }
}

export const useUTMTracking = (): UseUTMTrackingReturn => {
  const initializedRef = useRef(false);

  const updateAllLinks = useCallback(() => {
    const utms = capturedUTMs;
    const sck = capturedSck;

    document.querySelectorAll('a').forEach((el: HTMLAnchorElement) => {
      try {
        const elURL = new URL(el.href);
        if (EXCLUDED_DOMAINS.some(d => elURL.hostname.includes(d))) return;
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

  const updateAllIframes = useCallback(() => {
    const utms = capturedUTMs;
    const sck = capturedSck;

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

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    captureUTMsFromUrl();

    const updateAll = () => {
      updateAllLinks();
      updateAllIframes();
    };

    if (document.readyState === 'complete') {
      updateAll();
    } else {
      window.addEventListener('load', updateAll);
    }

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
  }, [updateAllLinks, updateAllIframes]);

  const getUrlWithUTMsCallback = useCallback((baseUrl: string) => getUrlWithUTMs(baseUrl), []);
  const redirectWithUTMs = useCallback((baseUrl: string): void => {
    window.location.href = getUrlWithUTMs(baseUrl);
  }, []);

  return {
    utms: capturedUTMs,
    sck: capturedSck,
    getUrlWithUTMs: getUrlWithUTMsCallback,
    redirectWithUTMs,
  };
};

export default useUTMTracking;

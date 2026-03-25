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
        // Ignora domínios que não processam UTMs
        if (EXCLUDED_DOMAINS.some(d => elURL.hostname.includes(d))) return;
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

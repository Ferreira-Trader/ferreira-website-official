import { getUrlWithUTMs } from '../hooks/useUTMTracking';

const HOTMART_BASE =
  'https://pay.hotmart.com/S100822439E?checkoutMode=10&sck=9fb8aa2a212342e3945ac6c59c1c0b44-9f79dcadd9a4473484a804455aafd6a9';

export function buildHotmartCheckoutUrl(lead: {
  name: string;
  email: string;
  phone: string;
}): string {
  const url = new URL(HOTMART_BASE);
  url.searchParams.set('name', lead.name);
  url.searchParams.set('email', lead.email);
  url.searchParams.set('phonenumber', lead.phone.replace(/\D/g, ''));
  return getUrlWithUTMs(url.toString());
}

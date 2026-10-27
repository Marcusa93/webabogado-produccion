export type Consent = 'granted' | 'denied';

const STORAGE_KEY = 'mr-cookie-consent';
const CHANGE_EVENT = 'mr:consent-change';
const OPEN_EVENT = 'mr:consent-open';

const ANALYTICS_COOKIE_PREFIXES = ['_ga', '_gid', '_gat', '_gcl', '_clck', '_clsk', '_fbp'];

export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.replace(/^www\./, '')}`];
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!ANALYTICS_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) return;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
    });
  });
}

export function setConsent(value: Consent) {
  const previous = getConsent();
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Sin storage la elección vale solo para esta visita.
  }

  // Los scripts ya cargados no se pueden descargar: limpiamos sus cookies y recargamos sin ellos.
  if (previous === 'granted' && value === 'denied') {
    clearAnalyticsCookies();
    window.location.reload();
    return;
  }

  window.dispatchEvent(new CustomEvent<Consent>(CHANGE_EVENT, { detail: value }));
}

export function onConsentChange(callback: (value: Consent) => void) {
  const handler = (event: Event) => callback((event as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

export const openConsentPreferences = () => window.dispatchEvent(new Event(OPEN_EVENT));

export function onConsentPreferencesOpen(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}

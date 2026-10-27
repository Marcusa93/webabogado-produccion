import { useEffect, useRef } from 'react';
import { initGA, trackScrollDepth } from '@/lib/analytics';
import { initClarity } from '@/lib/clarity';
import { initGTM } from '@/lib/gtm';
import { clearAnalyticsCookies, getConsent, onConsentChange } from '@/lib/consent';

/**
 * Carga GTM, GA4 y Microsoft Clarity solo después de que el visitante acepta
 * las cookies de analítica (ver CookieBanner). Skip en development.
 *
 * Env vars:
 *   VITE_GA4_MEASUREMENT_ID    — opcional, default G-T1TNJFDYJF
 *   VITE_CLARITY_PROJECT_ID    — opcional, si no está, Clarity no carga
 */

const GTM_ID = 'GTM-NRWQGPW5';

const MEASUREMENT_ID =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() ||
  'G-T1TNJFDYJF';

const CLARITY_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined)?.trim() || '';

// Guard contra olvidos: si alguien dejó el placeholder histórico, no inicializamos GA4.
const isPlaceholder = /^G-X+$/i.test(MEASUREMENT_ID);

const MILESTONES = [25, 50, 75, 100] as const;

export default function Analytics() {
  const scrollTrackedRef = useRef<Record<(typeof MILESTONES)[number], boolean>>({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  useEffect(() => {
    // GA4 reescribe su cookie de sesión al descargar la página, después del borrado en setConsent.
    if (getConsent() === 'denied') clearAnalyticsCookies();
    if (import.meta.env.DEV) return;

    let stopScrollTracking: (() => void) | undefined;

    const startScrollTracking = () => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const handleScroll = () => {
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollPercentage = (scrollTop / (documentHeight - window.innerHeight)) * 100;

        MILESTONES.forEach((milestone) => {
          if (scrollPercentage >= milestone && !scrollTrackedRef.current[milestone]) {
            trackScrollDepth(milestone);
            scrollTrackedRef.current[milestone] = true;
          }
        });
      };

      const throttledHandleScroll = () => {
        if (timeoutId) return;
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 500);
      };

      window.addEventListener('scroll', throttledHandleScroll);
      return () => {
        window.removeEventListener('scroll', throttledHandleScroll);
        if (timeoutId) clearTimeout(timeoutId);
      };
    };

    const start = () => {
      if (stopScrollTracking) return;
      initGTM(GTM_ID);
      if (!isPlaceholder) initGA(MEASUREMENT_ID);
      if (CLARITY_ID) initClarity(CLARITY_ID);
      stopScrollTracking = startScrollTracking();
    };

    if (getConsent() === 'granted') start();
    const unsubscribe = onConsentChange((value) => {
      if (value === 'granted') start();
    });

    return () => {
      unsubscribe();
      stopScrollTracking?.();
    };
  }, []);

  return null;
}

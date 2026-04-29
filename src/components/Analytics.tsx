import { useEffect, useRef } from 'react';
import { initGA, trackScrollDepth } from '@/lib/analytics';

/**
 * Google Analytics Component
 *
 * Inicializa GA4 una sola vez en App y trackea scroll depth.
 * Skip en development para no contaminar la data con visitas locales.
 *
 * Para cambiar la propiedad: editar la constante o setear VITE_GA4_MEASUREMENT_ID
 * en Vercel (la env var tiene precedencia).
 */

const MEASUREMENT_ID =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() ||
  'G-T1TNJFDYJF';

// Guard contra olvidos: si alguien dejó el placeholder histórico, no inicializamos.
const isPlaceholder = /^G-X+$/i.test(MEASUREMENT_ID);

export default function Analytics() {
  const scrollTrackedRef = useRef({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  useEffect(() => {
    // No trackear localhost ni placeholder.
    if (import.meta.env.DEV) return;
    if (isPlaceholder) {
      console.warn('[Analytics] MEASUREMENT_ID es placeholder; GA4 deshabilitado.');
      return;
    }

    // Initialize Google Analytics
    initGA(MEASUREMENT_ID);

    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track 25%, 50%, 75%, 100% scroll milestones
      const milestones = [25, 50, 75, 100] as const;

      milestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !scrollTrackedRef.current[milestone]
        ) {
          trackScrollDepth(milestone);
          scrollTrackedRef.current[milestone] = true;
        }
      });
    };

    // Throttle scroll event
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
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
  }, []);

  // This component doesn't render anything
  return null;
}

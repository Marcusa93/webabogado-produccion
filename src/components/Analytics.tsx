import { useEffect, useRef } from 'react';
import { initGA, trackScrollDepth } from '@/lib/analytics';

/**
 * Google Analytics Component
 *
 * This component initializes Google Analytics and tracks scroll depth.
 * It should be placed once in your main App component.
 */

const MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your actual GA4 Measurement ID

export default function Analytics() {
  const scrollTrackedRef = useRef({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  useEffect(() => {
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

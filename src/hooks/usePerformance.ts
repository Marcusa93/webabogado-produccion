import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  isSlowConnection: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  deviceMemory: number | undefined;
}

/**
 * Hook to detect device performance capabilities
 *
 * Use this to conditionally load heavy components or animations
 * based on user's device and connection quality
 */
export function usePerformance(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isSlowConnection: false,
    isMobile: false,
    prefersReducedMotion: false,
    deviceMemory: undefined,
  });

  useEffect(() => {
    // Check connection quality
    const connection =
      // @ts-expect-error - connection API is experimental
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const isSlowConnection =
      connection &&
      (connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === '3g' ||
        connection.saveData === true);

    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check device memory (if available)
    // @ts-expect-error - deviceMemory is experimental
    const deviceMemory = navigator.deviceMemory;

    setMetrics({
      isSlowConnection: Boolean(isSlowConnection),
      isMobile,
      prefersReducedMotion,
      deviceMemory,
    });
  }, []);

  return metrics;
}

/**
 * Hook to detect if we should load heavy resources
 */
export function useShouldLoadHeavyResources(): boolean {
  const { isSlowConnection, isMobile, deviceMemory } = usePerformance();

  // Don't load heavy resources if:
  // - Connection is slow
  // - Device is mobile
  // - Device has low memory (< 4GB)
  if (isSlowConnection || isMobile) {
    return false;
  }

  if (deviceMemory !== undefined && deviceMemory < 4) {
    return false;
  }

  return true;
}

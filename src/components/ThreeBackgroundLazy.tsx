import { lazy, Suspense, useEffect, useState } from 'react';

// Lazy load the heavy Three.js component
const ThreeBackground = lazy(() => import('./ThreeBackground'));

const fallbackClass =
  'absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent dark:from-navy-deep dark:via-navy-medium dark:to-navy-light dark:opacity-80';

/**
 * Optimized Three.js Background Loader
 *
 * Only loads the 3D background on:
 * - Desktop devices (>= 1024px)
 * - Devices with sufficient performance
 *
 * This saves ~200KB of JavaScript and improves mobile performance
 */
export default function ThreeBackgroundLazy() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Check if we should load the heavy 3D component
    const checkShouldLoad = () => {
      const isDesktop = window.innerWidth >= 1024;
      const hasGoodConnection =
        !('connection' in navigator) ||
        // @ts-expect-error - connection API is experimental
        navigator.connection?.effectiveType === '4g' ||
        // @ts-expect-error - connection API is experimental
        !navigator.connection?.saveData;

      return isDesktop && hasGoodConnection;
    };

    // Delay loading to prioritize critical content
    const timer = setTimeout(() => {
      setShouldLoad(checkShouldLoad());
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    // Fallback gradient background for mobile
    return <div className={fallbackClass} />;
  }

  return (
    <Suspense fallback={<div className={fallbackClass} />}>
      <ThreeBackground />
    </Suspense>
  );
}

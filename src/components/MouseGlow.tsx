import { useEffect, useRef, useState } from 'react';

/**
 * Soft radial glow that follows the cursor.
 *
 * Optimizations:
 * - Disabled on touch devices (no mouse, no point binding listeners).
 * - Position updated via direct DOM mutation through a ref + rAF, no setState
 *   on every mousemove (which would re-render the whole component).
 * - Visibility flag is the only React state, flipped once on first move.
 */
export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Skip entirely on touch / coarse-pointer devices.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const apply = () => {
      rafRef.current = null;
      const node = glowRef.current;
      if (!node) return;
      node.style.background = `radial-gradient(600px circle at ${lastPos.current.x}px ${lastPos.current.y}px, rgba(var(--mouse-glow-rgb, 120, 160, 255), 0.08), transparent 80%)`;
    };

    const onMove = (e: MouseEvent) => {
      lastPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(apply);
      }
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-[60] transition-opacity duration-300"
    />
  );
}

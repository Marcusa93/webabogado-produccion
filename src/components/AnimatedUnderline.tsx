import { ReactNode } from 'react';

interface AnimatedUnderlineProps {
  children: ReactNode;
  /** Color del subrayado (por defecto: accent) */
  color?: 'accent' | 'primary' | 'white';
  /** Grosor del subrayado en px */
  thickness?: number;
  /** Delay de animación en ms */
  delay?: number;
  /** Mostrar inmediatamente sin animación */
  immediate?: boolean;
  className?: string;
}

/**
 * Animated Underline Component
 *
 * Subrayado animado que crece dinámicamente de izquierda a derecha.
 * Uso: Envolver texto que necesite subrayado dinámico.
 *
 * @example
 * <AnimatedUnderline>
 *   especialidad.
 * </AnimatedUnderline>
 */
export default function AnimatedUnderline({
  children,
  color = 'accent',
  thickness = 3,
  delay = 0,
  immediate = false,
  className = '',
}: AnimatedUnderlineProps) {
  const colorMap = {
    accent: 'bg-accent',
    primary: 'bg-navy-deep',
    white: 'bg-white',
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={immediate ? 'text-accent' : 'animate-fade-in'}>{children}</span>
      <span
        className={`absolute bottom-0 left-0 h-[${thickness}px] ${colorMap[color]} transition-all duration-700 ease-out ${
          immediate ? 'w-full' : 'w-0 animate-underline-grow'
        }`}
        style={{
          animationDelay: `${delay}ms`,
        }}
      />
    </span>
  );
}

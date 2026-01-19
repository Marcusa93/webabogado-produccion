import { ReactNode, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface UnifiedCardProps {
  /** Ícono del servicio/especialidad */
  icon: LucideIcon;
  /** Color del ícono y acento */
  iconColor?: string;
  /** Color de fondo del ícono */
  iconBgColor?: string;
  /** Título de la tarjeta */
  title: string;
  /** Descripción breve */
  description?: string;
  /** Contenido adicional */
  children?: ReactNode;
  /** Tags o badges */
  tags?: string[];
  /** Variante de diseño */
  variant?: 'light' | 'dark' | 'glass';
  /** Delay de animación en ms */
  delay?: number;
  /** Mostrar efecto de mouse glow */
  mouseGlow?: boolean;
  /** Número de la tarjeta (para servicios) */
  number?: string;
  /** Callback al hacer click */
  onClick?: () => void;
  className?: string;
}

/**
 * Unified Card Component
 *
 * Tarjeta estandarizada con diseño coherente para todas las secciones.
 * Soporta diferentes variantes y personalizaciones manteniendo coherencia visual.
 *
 * @example
 * <UnifiedCard
 *   icon={Shield}
 *   title="Protección Avanzada"
 *   description="Defensa contra abusos"
 *   variant="light"
 *   tags={["Penal", "Digital"]}
 * />
 */
export default function UnifiedCard({
  icon: Icon,
  iconColor = 'text-accent',
  iconBgColor = 'bg-accent/10',
  title,
  description,
  children,
  tags = [],
  variant = 'light',
  delay = 0,
  mouseGlow = true,
  number,
  onClick,
  className = '',
}: UnifiedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseGlow || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const variants = {
    light: {
      card: 'bg-white/80 backdrop-blur-sm border-navy-deep/5 hover:shadow-strong',
      text: 'text-navy-deep',
      description: 'text-slate/60',
    },
    dark: {
      card: 'bg-white/5 border-white/10 hover:bg-white hover:shadow-2xl',
      text: 'text-white hover:text-navy-deep',
      description: 'text-white/40 group-hover:text-slate/60',
    },
    glass: {
      card: 'bg-white border-navy-deep/10 backdrop-blur-md hover:shadow-strong',
      text: 'text-navy-deep',
      description: 'text-slate/60',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl border p-5 sm:p-6 md:p-8
        transition-all duration-500
        hover:-translate-y-1 hover:scale-[1.02]
        ${currentVariant.card}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        animationDelay: `${delay}ms`,
        ...(mouseGlow && {
          backgroundImage: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 58, 138, 0.08), transparent 40%)`,
        }),
      }}
    >
      {/* Número de tarjeta (para servicios) */}
      {number && (
        <div className="absolute top-4 right-4 text-6xl font-black text-navy-deep/5 group-hover:text-accent/10 transition-colors">
          {number}
        </div>
      )}

      {/* Contenedor de ícono */}
      <div
        className={`
          inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4
          ${iconBgColor} ${iconColor}
          icon-hover
          group-hover:shadow-lg
        `}
      >
        <Icon size={24} className="sm:w-7 sm:h-7" />
      </div>

      {/* Título */}
      <h3
        className={`
          text-lg sm:text-xl md:text-2xl font-black mb-3 leading-tight
          ${currentVariant.text}
          transition-colors duration-300
        `}
      >
        {title}
      </h3>

      {/* Descripción */}
      {description && (
        <p
          className={`
            text-base font-medium leading-relaxed mb-4
            ${currentVariant.description}
            transition-colors duration-300
          `}
        >
          {description}
        </p>
      )}

      {/* Contenido adicional */}
      {children && <div className="mb-4">{children}</div>}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-current/5">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`
                px-3 py-1 text-xs font-bold rounded-full
                ${variant === 'dark' ? 'bg-white/10 text-white/70' : 'bg-navy-deep/5 text-navy-deep/70'}
                transition-all duration-300
                hover:scale-105
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Efecto de brillo en hover (opcional) */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}

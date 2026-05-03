import { useInView } from '@/hooks/useInView';

type Client = {
  name: string;
  /** Logo path para light mode (logo oscuro sobre fondo claro). Omitir si textOnly. */
  logo?: string;
  /** Logo path para dark mode (versión clara del logo). Si no se provee, usamos invert/invert-0. */
  logoDark?: string;
  /**
   * Tratamiento si el logo solo viene en una versión:
   * - 'darkOnLight': logo oscuro/colorido sobre fondo blanco (ej. La Vieja Escuela). Invierte en dark.
   * - 'lightOnDark': logo blanco sobre fondo oscuro (ej. Ana Cabrera). Invierte en light.
   * Ignorado si se provee logoDark explícito.
   */
  treatment?: 'darkOnLight' | 'lightOnDark';
  href?: string;
  /** Tailwind class para tunear cada logo individualmente (h-X, scale, etc.) */
  className?: string;
  /** Si true, no renderiza imagen — usa el `name` como tipografía-logo. */
  textOnly?: boolean;
};

// Logos provienen del Manual de marca del estudio. Para sumar uno nuevo:
// 1) Subí el archivo a public/clients/<slug>.webp (preferible) o .png/.svg
// 2) Si tenés ambas versiones (light + dark), incluí logoDark.
// 3) Si tenés solo una, marcá treatment para que el componente la invierta donde haga falta.
const CLIENTS: Client[] = [
  {
    name: 'Digital Amenities',
    logo: '/clients/digital-amenities.webp',
    logoDark: '/clients/digital-amenities-dark.webp',
    href: 'https://digitalamenities.com',
    className: 'h-8 md:h-10',
  },
  {
    name: 'La Vieja Escuela',
    logo: '/clients/la-vieja-escuela.webp',
    treatment: 'darkOnLight',
    className: 'h-10 md:h-12',
  },
  {
    name: 'Countrify',
    logo: '/clients/countrify.webp',
    treatment: 'darkOnLight',
    className: 'h-7 md:h-9',
  },
  {
    name: 'Ana Cabrera Medicina Estética',
    logo: '/clients/ana-cabrera.webp',
    treatment: 'lightOnDark',
    className: 'h-10 md:h-12',
  },
  {
    name: 'BRUCA',
    textOnly: true,
  },
];

/**
 * Banda fina de prueba social (clientes) que va inmediatamente debajo del Hero.
 * Pattern probado: el visitante ve "X empresas confían" antes de cualquier
 * sales pitch, lo que reduce la fricción de los CTAs siguientes.
 *
 * Background es card-color para crear separación visual del Hero y dar
 * un fondo neutro donde los logos respiran independiente del tema activo.
 */
export default function TrustStrip() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const renderLogo = (client: Client) => {
    if (client.textOnly) {
      return (
        <span
          className={`font-bold tracking-[0.18em] uppercase text-base md:text-lg lg:text-xl text-foreground/55 hover:text-foreground transition-colors ${
            client.className || ''
          }`}
          aria-label={client.name}
        >
          {client.name}
        </span>
      );
    }

    const baseImg = `object-contain transition-all duration-300 opacity-70 hover:opacity-100 ${
      client.className || 'h-10'
    }`;

    if (client.logoDark) {
      // Tenemos ambas versiones: usamos la indicada según el tema activo.
      return (
        <>
          <img
            src={client.logo}
            alt={client.name}
            loading="lazy"
            decoding="async"
            className={`${baseImg} block dark:hidden`}
          />
          <img
            src={client.logoDark}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={`${baseImg} hidden dark:block`}
          />
        </>
      );
    }

    // Una sola versión: aplicamos invert según el tratamiento.
    const invertClass =
      client.treatment === 'lightOnDark'
        ? 'invert dark:invert-0' // logo blanco: invertir en light, dejar tal cual en dark
        : 'dark:invert'; // logo oscuro (default): dejar tal cual en light, invertir en dark

    return (
      <img
        src={client.logo}
        alt={client.name}
        loading="lazy"
        decoding="async"
        className={`${baseImg} ${invertClass}`}
      />
    );
  };

  return (
    <section
      ref={ref}
      aria-label="Empresas que confían en el estudio"
      className="relative py-10 md:py-14 bg-foreground/[0.04] dark:bg-foreground/[0.02] border-y border-foreground/10"
    >
      <div className="section-container">
        <div
          className={`text-center mb-7 md:mb-9 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] text-foreground/55 uppercase">
            Algunas de las empresas que confían su cuidado integral en nosotros
          </p>
        </div>

        <ul
          className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-7 md:gap-x-14 lg:gap-x-16 transition-all duration-700 delay-150 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {CLIENTS.map((client) => (
            <li key={client.name} className="flex items-center justify-center min-h-[40px]">
              {client.href ? (
                <a
                  href={client.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visitar ${client.name}`}
                  className="flex items-center"
                >
                  {renderLogo(client)}
                </a>
              ) : (
                renderLogo(client)
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

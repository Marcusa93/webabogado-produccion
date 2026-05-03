import { useInView } from '@/hooks/useInView';

type Client = {
  name: string;
  logo: string;
  href?: string;
  /** Tailwind class para tunear cada logo individualmente (h-X, scale, etc.) */
  className?: string;
};

// Logos provienen del Manual de marca del estudio. Para sumar uno nuevo:
// 1) Subí el archivo a public/clients/<slug>.webp (preferible) o .png/.svg
// 2) Agregá una entrada acá con el className que mejor lo proporcione
const CLIENTS: Client[] = [
  {
    name: 'Digital Amenities',
    logo: '/clients/digital-amenities.webp',
    href: 'https://digitalamenities.com',
    className: 'h-8 md:h-10',
  },
  {
    name: 'La Vieja Escuela',
    logo: '/clients/la-vieja-escuela.webp',
    className: 'h-10 md:h-12',
  },
  {
    name: 'Countrify',
    logo: '/clients/countrify.webp',
    className: 'h-7 md:h-9',
  },
  {
    name: 'Ana Cabrera Medicina Estética',
    logo: '/clients/ana-cabrera.webp',
    className: 'h-10 md:h-12',
  },
];

/**
 * Banda fina de prueba social (clientes) que va inmediatamente debajo del Hero.
 * Pattern probado: el visitante ve "X empresas confían en nosotros" antes de
 * cualquier sales pitch, lo que reduce la fricción de los CTAs siguientes.
 */
export default function TrustStrip() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      aria-label="Empresas que confían en el estudio"
      className="relative py-10 md:py-14 bg-background border-y border-foreground/5"
    >
      <div className="section-container">
        <div
          className={`text-center mb-7 md:mb-9 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] text-foreground/50 uppercase">
            Empresas que confían en el estudio
          </p>
        </div>

        <ul
          className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-7 md:gap-x-16 lg:gap-x-20 transition-all duration-700 delay-150 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {CLIENTS.map((client) => {
            const img = (
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                decoding="async"
                className={`object-contain transition-all duration-300 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 ${
                  client.className || 'h-10'
                }`}
              />
            );

            return (
              <li key={client.name} className="flex items-center justify-center">
                {client.href ? (
                  <a
                    href={client.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visitar ${client.name}`}
                  >
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

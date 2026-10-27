import { Briefcase, Scale, ShieldCheck, Building2, Fingerprint, MessageCircle, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import StaggeredTitle from './StaggeredTitle';
import { whatsappUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/lib/analytics';

const areas = [
  {
    icon: Briefcase,
    title: 'Laboral y ART',
    description:
      'Despidos, trabajo no registrado, acoso laboral y accidentes de trabajo. Representamos a trabajadores y defendemos empresas.',
    lead: 'Facundo Castillo',
  },
  {
    icon: Scale,
    title: 'Civil y daños',
    description:
      'Daños y perjuicios, incumplimientos contractuales y defensa del consumidor frente a bancos y grandes empresas.',
    lead: 'Marco Rossi · Francisco Bottini',
  },
  {
    icon: ShieldCheck,
    title: 'Penal',
    description: 'Defensa penal, denuncias y querellas, con foco en ciberdelitos y estafas digitales.',
    lead: 'Francisco Bottini',
  },
  {
    icon: Building2,
    title: 'Empresas y sociedades',
    description:
      'Sociedades y fundaciones, disputas societarias, contratos entre empresas y compliance digital.',
    lead: 'Facundo Casadey',
  },
  {
    icon: Fingerprint,
    title: 'Derecho digital',
    description:
      'Influencers, recuperación de cuentas, fraudes online y prueba electrónica: preservación de evidencia y pericias.',
    lead: 'Marco Rossi',
  },
];

const steps = [
  'Diagnóstico inicial sin cargo',
  'Costos claros desde el inicio',
  'Reportes de avance',
  'Cupo mensual pro bono',
];

export default function QueHago() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="especialidades"
      ref={ref}
      className="py-20 md:py-28 bg-background relative overflow-hidden transition-colors duration-500"
    >
      <div className="absolute top-0 left-0 w-full h-full tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mb-10 md:mb-14">
          <StaggeredTitle
            text="Áreas de práctica."
            highlightWords={['práctica.']}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-5 leading-tight font-montserrat justify-start"
          />
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-medium">
            Litigamos en todas las áreas, con estrategia procesal rigurosa y dominio de la prueba digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {areas.map((area, index) => (
            <div
              key={area.title}
              className={`group flex flex-col p-6 md:p-8 rounded-[2rem] bg-card border border-foreground/10 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                  <area.icon size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-foreground font-montserrat leading-tight">
                  {area.title}
                </h3>
              </div>
              <p className="text-foreground/65 text-sm md:text-base leading-relaxed font-medium mb-5">
                {area.description}
              </p>
              <p className="mt-auto pt-4 border-t border-foreground/5 text-[11px] font-bold uppercase tracking-wider text-foreground/40">
                Referente: <span className="text-accent">{area.lead}</span>
              </p>
            </div>
          ))}

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('areas')}
            className={`group flex flex-col justify-between p-6 md:p-8 rounded-[2rem] bg-foreground text-background shadow-xl hover:-translate-y-1 transition-all duration-500 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${areas.length * 80}ms` }}
          >
            <div>
              <h3 className="text-xl md:text-2xl font-black font-montserrat leading-tight mb-3">
                ¿No sabés en qué área entra tu caso?
              </h3>
              <p className="text-background/70 text-sm md:text-base leading-relaxed font-medium mb-6">
                Contanos qué pasó y te decimos cómo seguir.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--whatsapp-green)]">
              <MessageCircle size={18} className="fill-current" />
              Escribinos por WhatsApp
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </div>

        <ol className="mt-8 md:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-foreground/[0.03] border border-foreground/10"
            >
              <span className="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-black flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <span className="text-xs md:text-sm font-bold text-foreground/75 leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

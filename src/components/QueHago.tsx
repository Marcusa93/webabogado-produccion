import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import StaggeredTitle from './StaggeredTitle';
import { areaIcons } from './areaIcons';
import { areas, areaPath, workSteps } from '@/data/areas';
import { whatsappUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/lib/analytics';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {areas.map((area, index) => {
            const Icon = areaIcons[area.slug];
            return (
              <Link
                key={area.slug}
                to={areaPath(area.slug)}
                className={`group flex flex-col p-6 md:p-7 rounded-[2rem] bg-card border border-foreground/10 shadow-soft hover:shadow-xl hover:-translate-y-1 hover:border-accent/30 transition-all duration-500 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-foreground font-montserrat leading-tight">
                    {area.title}
                  </h3>
                </div>
                <p className="text-foreground/65 text-sm leading-relaxed font-medium mb-5">{area.summary}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
                  Ver más
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('areas')}
            className={`group flex flex-col justify-between p-6 md:p-7 rounded-[2rem] bg-foreground text-background shadow-xl hover:-translate-y-1 transition-all duration-500 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${areas.length * 60}ms` }}
          >
            <div>
              <h3 className="text-xl font-black font-montserrat leading-tight mb-3">
                ¿No sabés en qué área entra tu caso?
              </h3>
              <p className="text-background/70 text-sm leading-relaxed font-medium mb-6">
                Contanos qué pasó y te decimos cómo seguir.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--whatsapp-green)]">
              <MessageCircle size={16} className="fill-current" />
              Escribinos por WhatsApp
            </span>
          </a>
        </div>

        <ol className="mt-8 md:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {workSteps.map((step, index) => (
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

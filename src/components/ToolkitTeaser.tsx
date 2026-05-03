import { Link } from 'react-router-dom';
import { ShieldAlert, Fingerprint, Sparkles, ArrowRight, Wrench } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import StaggeredTitle from './StaggeredTitle';

// Teaser que va en el home: 3 herramientas destacadas + CTA a /herramientas (hub completo).
// Mantiene el peso del home liviano sin perder la presencia de "tenemos kit de cliente".
const featured = [
  {
    icon: ShieldAlert,
    title: 'Preservación SOS',
    subtitle: 'Evidencia digital',
    description: 'Qué hacer en las primeras horas para que tus capturas, mensajes y registros sean prueba válida en juicio.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Fingerprint,
    title: 'Check Influencer',
    subtitle: 'Contratos de imagen',
    description: 'Las 3 cláusulas críticas a revisar antes de firmar una colaboración o cesión de imagen.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: Sparkles,
    title: 'Optimizador COTIO',
    subtitle: 'Prompts jurídicos',
    description: 'Convertí borradores en prompts profesionales con metodología COTIO. Herramienta exclusiva para abogados.',
    color: 'from-indigo-500 to-purple-600',
  },
];

export default function ToolkitTeaser() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="toolkit"
      ref={ref}
      className="py-20 md:py-28 bg-background relative overflow-hidden transition-colors duration-500"
    >
      <div className="absolute inset-0 tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 mb-6">
            <Wrench size={12} className="text-accent" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-montserrat">
              Recursos Útiles
            </span>
          </div>

          <StaggeredTitle
            text="Kit de herramientas para clientes."
            highlightWords={['herramientas']}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6 font-montserrat leading-tight justify-start"
          />

          <p className="text-base md:text-lg text-foreground/65 max-w-2xl font-medium leading-relaxed">
            Cinco utilidades de uso inmediato para proteger tu identidad y patrimonio en
            entornos digitales — antes incluso de necesitar abogado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10 md:mb-14">
          {featured.map((tool, i) => (
            <div
              key={tool.title}
              className={`relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-card border border-foreground/10 shadow-soft overflow-hidden transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-10 blur-[40px] pointer-events-none`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-5 md:mb-6 shadow-lg`}>
                  <tool.icon size={26} />
                </div>
                <h3 className="text-base md:text-lg font-black text-foreground mb-1 font-montserrat uppercase tracking-tight">
                  {tool.title}
                </h3>
                <p className="text-foreground/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
                  {tool.subtitle}
                </p>
                <p className="text-foreground/65 text-sm leading-relaxed font-medium">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — link a hub completo */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-foreground/5 border border-foreground/10">
          <div>
            <p className="text-sm md:text-base font-bold text-foreground mb-1">
              Estas son solo 3. Hay más en el hub completo.
            </p>
            <p className="text-foreground/55 text-xs md:text-sm font-medium">
              Hasher criptográfico, Scam Detector y todas las versiones detalladas.
            </p>
          </div>
          <Link
            to="/herramientas"
            className="btn-interactive inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-4 bg-foreground text-background font-black rounded-xl text-xs md:text-sm uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 shadow-lg shrink-0"
          >
            Ver todas las herramientas
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

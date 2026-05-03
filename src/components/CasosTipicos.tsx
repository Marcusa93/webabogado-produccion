import { useRef, useState, useEffect } from 'react';
import {
  AtSign,
  Sparkles,
  ShieldAlert,
  Lock,
  FileText,
  Briefcase,
  ClipboardCheck,
  DollarSign,
  MessageCircle,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import StaggeredTitle from './StaggeredTitle';
import BookingButton from './BookingButton';

// Escenarios concretos en voz del cliente: el visitante se reconoce en
// uno de estos antes de saber qué "área del derecho" lo cubre.
// Combinación de las viejas "Especialidades" (QueHago) + "Servicios"
// reformuladas en lenguaje del problema, no del producto jurídico.
type Caso = {
  icon: React.ElementType;
  title: string;
  description: string;
  tags: string[];
  /** Tailwind text color class for the icon */
  accent: string;
};

const casos: Caso[] = [
  {
    icon: AtSign,
    title: 'Sos influencer y recibís un cease-and-desist o reclamo por uso de marca, imagen o contenido.',
    description:
      'Marcas que te exigen bajar publicaciones, sponsors que rompen contrato, suplantación de identidad o uso no autorizado de tu imagen. Defendemos tu marca personal y construimos un repertorio de respuestas legales reutilizables.',
    tags: ['Influencer', 'Marca personal', 'Propiedad intelectual'],
    accent: 'text-pink-500',
  },
  {
    icon: Sparkles,
    title: 'Tu empresa enfrenta una denuncia o consulta regulatoria por uso de IA en marketing, decisiones automatizadas o entrenamiento de modelos.',
    description:
      'Desde un competidor que te acusa de scraping hasta un cliente que cuestiona una decisión algorítmica. Te asesoramos en compliance preventivo y en la defensa cuando ya hay reclamo formal.',
    tags: ['IA', 'Empresa', 'Compliance'],
    accent: 'text-blue-500',
  },
  {
    icon: ShieldAlert,
    title: 'Estás imputado o demandado y la prueba clave son chats, mails, redes o evidencia digital.',
    description:
      'Defensa penal y civil donde la prueba electrónica define el resultado. Validamos cadena de custodia, impugnamos pruebas mal obtenidas, coordinamos peritajes informáticos y construimos contra-narrativas técnicas.',
    tags: ['Penal', 'Prueba digital', 'Forensia'],
    accent: 'text-rose-500',
  },
  {
    icon: Lock,
    title: 'Te hackearon, suplantaron o eliminaron una cuenta crítica en redes sociales o plataformas.',
    description:
      'Recuperación expeditiva ante la plataforma, denuncia penal por usurpación de identidad o estafa, medidas cautelares y planteo de daños. Sabemos qué reclamar a Meta, Google, X y TikTok cuando el soporte estándar no responde.',
    tags: ['Cibercrimen', 'Identidad digital', 'Recuperación'],
    accent: 'text-amber-500',
  },
  {
    icon: FileText,
    title: 'Necesitás revisar o redactar un contrato de colaboración, cesión de imagen, exclusividad o sponsoreo.',
    description:
      'Contratos para creadores, marcas y agencias que protegen tu propiedad intelectual, definen exclusividades realistas y blindan los términos económicos. Lo escribimos pensando en cómo se litiga si rompen el acuerdo.',
    tags: ['Contratos', 'Comercial', 'Influencer'],
    accent: 'text-emerald-500',
  },
  {
    icon: Briefcase,
    title: 'Tenés un conflicto laboral donde la prueba digital define el caso (mobbing, despido por chats, monitoreo de productividad).',
    description:
      'Representamos tanto a empresas como a trabajadores en disputas donde la prueba reside en chats, registros de actividad o métricas de plataforma. La validez probatoria de cada captura define el resultado.',
    tags: ['Laboral', 'Empresa/Trabajador', 'Prueba digital'],
    accent: 'text-indigo-500',
  },
];

// Subsección "Cómo trabajamos" — heredada del ex-QueEsperar.
const processSteps = [
  {
    number: '01',
    title: 'Consulta inicial estratégica',
    description: 'Reunión de diagnóstico para evaluar la viabilidad de tu caso. No tomamos casos sin análisis previo.',
    icon: MessageCircle,
    color: 'text-blue-500',
  },
  {
    number: '02',
    title: 'Propuesta clara y transparente',
    description: 'Un plan de acción detallado con costos definidos desde el primer día. Sin sorpresas ni letra chica.',
    icon: DollarSign,
    color: 'text-emerald-500',
  },
  {
    number: '03',
    title: 'Ejecución técnica rigurosa',
    description: 'Implementamos la estrategia jurídica validada, con reportes periódicos de avance.',
    icon: ClipboardCheck,
    color: 'text-amber-500',
  },
  {
    number: '04',
    title: 'Compromiso social',
    description: 'Reservamos un cupo mensual para casos pro bono de alto impacto social o vulnerabilidad.',
    icon: Heart,
    color: 'text-rose-500',
  },
];

export default function CasosTipicos() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { ref: processRef, isInView: isProcessInView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="especialidades"
      ref={sectionRef}
      className="py-24 md:py-32 bg-background relative overflow-hidden transition-colors duration-500"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="max-w-4xl mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">
              Casos Reales
            </span>
          </div>

          <StaggeredTitle
            text="Casos típicos que resolvemos."
            highlightWords={['resolvemos.']}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 leading-tight font-montserrat justify-start"
          />

          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed font-medium">
            Estos son los seis escenarios más frecuentes que llegan al estudio. Si tu situación
            se parece a alguno, ya sabemos por dónde empezar.
          </p>
        </div>

        {/* Casos grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-32">
          {casos.map((caso, index) => (
            <article
              key={caso.title}
              className="group relative h-auto rounded-[2rem] bg-card border border-foreground/10 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 flex flex-col"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 p-7 md:p-8 flex flex-col h-full">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <caso.icon size={22} className={caso.accent} />
                </div>

                {/* Scenario as the headline */}
                <h3 className="text-base md:text-lg font-black text-foreground mb-4 font-montserrat leading-snug group-hover:text-accent transition-colors">
                  {caso.title}
                </h3>

                {/* What we do */}
                <p className="text-sm text-foreground/65 leading-relaxed font-medium mb-6 flex-1">
                  {caso.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pb-5 border-b border-foreground/5">
                  {caso.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-foreground/5 text-[10px] font-bold uppercase tracking-wider text-foreground/55 border border-foreground/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-5 mt-auto">
                  <BookingButton
                    source={`caso-${index + 1}`}
                    label="Hablar de mi caso"
                    variant="primary"
                    icon={false}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-foreground/70 hover:text-accent transition-colors group/cta"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ============= Subsección "Cómo trabajamos" ============= */}
        <div ref={processRef} className="relative pt-12 md:pt-16 border-t border-foreground/10">
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">
                Metodología
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 font-montserrat leading-tight">
              Cómo <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">trabajamos</span>.
            </h2>

            <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
              Transparencia, orden y rigor técnico en cada etapa del camino.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            <div className="hidden lg:block absolute top-[24px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent z-0" />

            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 ${
                  isProcessInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-6 relative">
                  <div className="w-12 h-12 rounded-full bg-card border-4 border-background flex items-center justify-center text-sm font-black text-foreground shadow-lg relative z-10">
                    {step.number}
                  </div>
                </div>

                <div className="w-full bg-card/60 backdrop-blur-sm border border-foreground/5 rounded-2xl p-6 hover:bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/step">
                  <div className="w-11 h-11 mx-auto mb-4 rounded-xl bg-foreground/5 flex items-center justify-center group-hover/step:scale-110 transition-transform">
                    <step.icon size={22} className={step.color} />
                  </div>

                  <h3 className="text-base md:text-lg font-black text-foreground mb-2 font-montserrat leading-tight">
                    {step.title}
                  </h3>

                  <p className="text-foreground/65 text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

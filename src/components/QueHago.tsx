import React, { useRef, useState, useEffect } from 'react';
import { Network, Briefcase, Scale, ShieldCheck, Fingerprint, Check, ArrowRight, MousePointer2, ClipboardCheck, DollarSign, MessageCircle, Heart } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import AnimatedUnderline from './AnimatedUnderline';

// 4 etapas del proceso de trabajo (consolidado desde el ex-componente QueEsperar).
// Vive como subsección "Cómo trabajamos" debajo de las áreas de especialidad.
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

const specialties = [
  {
    icon: Scale,
    title: "Litigios civiles y comerciales",
    description: "Trabajamos con prueba documental clásica y evidencia digital cuando resulta pertinente para acreditar los hechos.",
    bullets: [
      "Daños y perjuicios",
      "Responsabilidad contractual",
      "Incumplimientos comerciales",
      "Estrategias de reparación"
    ],
    tags: ["Prueba Digital", "Litigios", "Civil", "Comercial"]
  },
  {
    icon: Briefcase,
    title: "Conflictos laborales",
    description: "Defensas estratégicas para empresas y representación de trabajadores, incorporando prueba digital como elemento clave.",
    bullets: [
      "Despidos y Sanciones",
      "Acoso Laboral (Mobbing)",
      "Accidentes de Trabajo",
      "Prueba en RRSS/Chats"
    ],
    tags: ["Laboral", "Despidos", "Baja Productividad"]
  },
  {
    icon: ShieldCheck,
    title: "Derecho penal",
    description: "Especialistas en ciberdelitos. Garantizamos el debido proceso en la obtención y resguardo de la evidencia digital.",
    bullets: [
      "Ciberdelitos",
      "Defensa Penal",
      "Querellas",
      "Evidencia Informática"
    ],
    tags: ["Penal", "Ciberseguridad", "Forensia"]
  },
  {
    icon: Network,
    title: "Plataformas y entornos digitales",
    description: "Traducimos conflictos en redes y plataformas en planteos jurídicos claros, comprensibles y exigibles.",
    bullets: [
      "Recuperación de Cuentas",
      "Fraudes Online",
      "Comercio Electrónico",
      "Términos y Condiciones"
    ],
    tags: ["Redes Sociales", "Influencers", "Plataformas"]
  },
  {
    icon: Fingerprint,
    title: "Prueba electrónica y estrategia procesal",
    description: "Asesoramos en la identificación, preservación y presentación de evidencia digital para su validez judicial.",
    bullets: [
      "Preservación de Evidencia",
      "Pericias Informáticas",
      "Cadena de Custodia",
      "Validación Notarial"
    ],
    tags: ["E-discovery", "Cloud Forensics", "Peritajes"]
  }
];

import StaggeredTitle from './StaggeredTitle';

export default function QueHago() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
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

  const handleMobileCardClick = (index: number) => {
    if (window.innerWidth < 1024) { // Only active on mobile/tablet
      setMobileActiveIndex(mobileActiveIndex === index ? null : index);
    }
  };

  return (
    <section id="especialidades" ref={sectionRef} className="py-24 md:py-32 bg-background relative overflow-hidden transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">Expertise Jurídico</span>
          </div>

          <StaggeredTitle
            text="Áreas de especialidad."
            highlightWords={['especialidad']}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 leading-tight font-montserrat justify-start"
          />

          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed font-medium">
            Nuestra práctica se especializa en la intersección entre el derecho tradicional y las nuevas tecnologías.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-32">
          {specialties.map((item, index) => {
            const isActive = mobileActiveIndex === index;

            return (
              <div
                key={index}
                onClick={() => handleMobileCardClick(index)}
                className={`group relative h-auto min-h-[420px] rounded-[2rem] bg-card border border-foreground/10 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-2 ${isActive ? 'shadow-[0_20px_40px_rgba(0,0,0,0.2)] -translate-y-2' : ''}`}
                style={{
                  '--mouse-x': `${mousePos.x}px`,
                  '--mouse-y': `${mousePos.y}px`,
                } as React.CSSProperties}
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                {/* Hover Glow Effect defined by mouse position */}
                <div
                  className="absolute w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block"
                  style={{
                    left: 'var(--mouse-x)',
                    top: 'var(--mouse-y)',
                    transform: 'translate(-50%, -50%)'
                  }}
                />

                <div className="relative z-10 h-full p-8 flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-accent mb-6 transition-all duration-500 shadow-sm ${isActive ? 'bg-accent text-white shadow-glow scale-110' : 'group-hover:bg-accent group-hover:text-white group-hover:shadow-glow group-hover:scale-110'}`}>
                      <item.icon size={28} />
                    </div>
                    <h3 className={`text-2xl font-black text-foreground mb-3 font-montserrat leading-tight transition-colors ${isActive ? 'text-accent' : 'group-hover:text-accent'}`}>
                      {item.title}
                    </h3>

                    {/* Abstract Line */}
                    <div className={`h-1 bg-foreground/10 rounded-full transition-all duration-700 ${isActive ? 'w-full bg-accent/30' : 'w-12 group-hover:w-full group-hover:bg-accent/30'}`} />
                  </div>

                  {/* Content - Initially abstract, reveals detail on hover */}
                  <div className="flex-1 relative">
                    {/* Default View: Tags */}
                    <div className={`transition-all duration-500 ${isActive ? 'opacity-0 translate-x-4 absolute inset-0' : 'opacity-100 lg:absolute lg:inset-0 lg:group-hover:opacity-0 lg:group-hover:translate-x-4'}`}>
                      <p className="text-foreground/60 font-medium mb-6 line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6 lg:mb-0">
                        {item.tags.map((tag, t) => (
                          <span key={t} className="px-3 py-1 rounded-full bg-foreground/5 text-[10px] font-bold uppercase tracking-wider text-foreground/50 border border-foreground/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {/* Mobile hint */}
                      <p className="lg:hidden text-[10px] text-accent font-bold uppercase tracking-widest mt-4 animate-pulse">
                        Tocar para ver más
                      </p>
                    </div>

                    {/* Hover View: Actionable Bullets */}
                    <div className={`transition-all duration-500 mt-4 lg:mt-0 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-0 lg:absolute lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0'}`}>
                      <ul className="space-y-3">
                        {item.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-bold text-foreground/80">
                            <div className="mt-0.5 min-w-[16px] text-accent">
                              <Check size={16} />
                            </div>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-foreground/5 hidden lg:flex">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 group-hover:text-accent transition-colors">
                      Saber más
                    </span>
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/50 group-hover:bg-accent group-hover:text-white transition-all duration-500 group-hover:translate-x-1">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================
            Subsección "Cómo trabajamos"
            (consolidada desde QueEsperar.tsx)
            ============================ */}
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
            {/* Connecting line, desktop only */}
            <div className="hidden lg:block absolute top-[24px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent z-0" />

            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 ${
                  isProcessInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Number badge */}
                <div className="mb-6 relative">
                  <div className="w-12 h-12 rounded-full bg-card border-4 border-background flex items-center justify-center text-sm font-black text-foreground shadow-lg relative z-10">
                    {step.number}
                  </div>
                </div>

                {/* Content card */}
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

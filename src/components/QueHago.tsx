import React, { useRef, useState, useEffect } from 'react';
import { Network, Briefcase, Scale, ShieldCheck, Fingerprint, Check, ArrowRight, MousePointer2 } from 'lucide-react';
import AnimatedUnderline from './AnimatedUnderline';

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

export default function QueHago() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="especialidades" ref={sectionRef} className="py-24 md:py-32 bg-background relative overflow-hidden transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">Expertise Jurídico</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 leading-tight font-montserrat">
            Áreas de <br />
            <AnimatedUnderline delay={200}>especialidad.</AnimatedUnderline>
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed font-medium">
            Nuestra práctica se especializa en la intersección entre el derecho tradicional y las nuevas tecnologías.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {specialties.map((item, index) => (
            <div
              key={index}
              className="group relative h-auto min-h-[420px] rounded-[2rem] bg-card border border-foreground/10 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-2"
              style={{
                '--mouse-x': `${mousePos.x}px`,
                '--mouse-y': `${mousePos.y}px`,
              } as React.CSSProperties}
            >
              {/* Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Hover Glow Effect defined by mouse position */}
              <div
                className="absolute w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  left: 'var(--mouse-x)',
                  top: 'var(--mouse-y)',
                  transform: 'translate(-50%, -50%)'
                }}
              />

              <div className="relative z-10 h-full p-8 flex flex-col">
                {/* Header */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-glow group-hover:scale-110">
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3 font-montserrat leading-tight group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  {/* Abstract Line */}
                  <div className="w-12 h-1 bg-foreground/10 rounded-full group-hover:w-full group-hover:bg-accent/30 transition-all duration-700" />
                </div>

                {/* Content - Initially abstract, reveals detail on hover */}
                <div className="flex-1 relative">
                  {/* Default View: Tags */}
                  <div className="lg:absolute lg:inset-0 transition-all duration-500 lg:opacity-100 lg:group-hover:opacity-0 lg:group-hover:translate-x-4">
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
                  </div>

                  {/* Hover View: Actionable Bullets (Always visible on mobile below description) */}
                  <div className="lg:absolute lg:inset-0 transition-all duration-500 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 mt-4 lg:mt-0">
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
          ))}
        </div>
      </div>
    </section>
  );
}

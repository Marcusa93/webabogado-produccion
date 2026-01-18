import React, { useRef, useState, useEffect } from 'react';
import { Network, Briefcase, Scale, ShieldCheck, Fingerprint, ChevronDown, Check } from 'lucide-react';
import AnimatedUnderline from './AnimatedUnderline';

const specialties = [
  {
    icon: Scale,
    title: "Litigios civiles y comerciales",
    description: "Actuamos en conflictos de daños y perjuicios, responsabilidad contractual y extracontractual, incumplimientos, cobros, controversias empresariales y conflictos entre particulares. Trabajamos con prueba documental clásica y evidencia digital cuando resulta pertinente para acreditar los hechos.",
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
    description: "Intervenimos en despidos, sanciones, acoso laboral, accidentes de trabajo y reclamos de crédito. Defensas estratégicas para empresas y representación de trabajadores en situaciones complejas, incorporando prueba digital (chats, correos) como elemento probatorio clave.",
    bullets: [
      "Despidos y Sanciones",
      "Acoso Laboral (Mobbing)",
      "Accidentes de Trabajo",
      "Prueba en RRSS/Chats"
    ],
    tags: ["Laboral", "Despidos", "Evidencia Digital"]
  },
  {
    icon: ShieldCheck,
    title: "Derecho penal",
    description: "Asumimos la defensa técnica en procesos penales y el acompañamiento jurídico de víctimas en etapas de investigación y juicio. Especialistas en ciberdelitos y delitos informáticos, garantizando el debido proceso en la obtención y resguardo de la evidencia digital.",
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
    description: "Intervenimos en conflictos vinculados a redes sociales, cuentas bloqueadas, fraudes en línea, comercio electrónico y servicios digitales. Traducimos hechos complejos en planteos jurídicos claros, comprensibles y exigibles en sede judicial o administrativa.",
    bullets: [
      "Recuperación de Cuentas",
      "Fraudes Online",
      "Comercio Electrónico",
      "Términos y Condiciones"
    ],
    tags: ["Redes Sociales", "E-Commerce", "Plataformas"]
  },
  {
    icon: Fingerprint,
    title: "Prueba electrónica y estrategia procesal",
    description: "Asesoramos en la identificación, preservación y presentación de evidencia digital: mensajes, correos, metadatos, registros de actividad y pericias informáticas. Diseñamos la estrategia probatoria pensando en su evaluación posterior por jueces y tribunales.",
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
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

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="especialidades" ref={sectionRef} className="py-24 md:py-32 bg-ice-blue relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full tech-grid opacity-20 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-deep/5 border border-navy-deep/10 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-navy-deep/60 uppercase font-montserrat">Expertise Jurídico</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-navy-deep mb-8 leading-tight font-montserrat">
            Áreas de <br />
            <AnimatedUnderline delay={200}>especialidad.</AnimatedUnderline>
          </h2>
          <p className="text-lg md:text-xl text-slate leading-relaxed font-medium">
            Intervenimos en conflictos civiles, laborales y penales de alta complejidad. Hoy casi toda controversia deja huella en entornos digitales: comunicaciones, registros de sistemas, plataformas o dispositivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {specialties.map((item, index) => (
            <div
              key={index}
              className="tech-card p-8 md:p-10 rounded-3xl bg-white/80 backdrop-blur-sm shadow-soft border border-navy-deep/5 transition-all duration-500 hover:shadow-strong group flex flex-col"
              style={{
                '--mouse-x': `${mousePos.x}px`,
                '--mouse-y': `${mousePos.y}px`,
              } as React.CSSProperties}
            >
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-navy-deep/5 flex items-center justify-center text-accent mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500 icon-hover">
                  <item.icon size={28} />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-navy-deep mb-6 group-hover:text-accent transition-colors font-montserrat leading-tight">
                  {item.title}
                </h3>

                {/* Bullets Section */}
                <ul className="mb-6 space-y-2">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate/80">
                      <Check size={14} className="text-accent mt-1 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Accordion for Full Description */}
                <div className={`overflow-hidden transition-all duration-500 ${expandedIndex === index ? 'max-h-[300px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                  <p className="text-slate/70 text-sm leading-relaxed p-4 bg-navy-deep/5 rounded-xl border border-navy-deep/5">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-accent mb-6 hover:gap-2 transition-all self-start"
                >
                  {expandedIndex === index ? 'Menos info' : 'Leer más'}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                </button>

                <div className="mt-auto pt-6 border-t border-navy-deep/5 flex flex-wrap gap-2">
                  {item.tags.map((tag, t) => (
                    <span key={t} className="inline-block px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--tags-red) 10%, transparent)',
                            color: 'var(--tags-red)',
                            borderColor: 'color-mix(in srgb, var(--tags-red) 20%, transparent)',
                            borderWidth: '1px',
                            borderStyle: 'solid'
                          }}>
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

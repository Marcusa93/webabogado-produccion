import React, { useRef, useState, useEffect } from 'react';
import { Network, Briefcase, Scale, ShieldCheck, Fingerprint, ChevronDown, Check } from 'lucide-react';

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
    <section id="especialidades" ref={sectionRef} className="py-24 md:py-32 bg-navy-deep relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full tech-grid-dark opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">Expertise Jurídico</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1] font-montserrat">
            Soluciones legales <br />
            <span className="text-white/90">para problemas complejos.</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Nuestra práctica se especializa en la intersección entre el derecho tradicional y las nuevas tecnologías.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          {/* List of Specialties (Accordion) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {specialties.map((item, index) => (
              <div
                key={index}
                className={`group relative rounded-3xl transition-all duration-500 overflow-hidden shadow-lg ${expandedIndex === index
                  ? 'bg-[#1E1E2E] border-accent/40 shadow-[0_8px_32px_rgba(123,44,191,0.2)]'
                  : 'bg-[#1E1E2E]/50 border-white/10 hover:bg-[#1E1E2E] hover:border-white/20 hover:shadow-xl'
                  } border-2`}
              >
                {/* Header (Clickable) */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left relative z-10"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${expandedIndex === index
                      ? 'bg-accent text-white shadow-glow'
                      : 'bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10'
                      }`}>
                      <item.icon size={24} />
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold font-montserrat transition-colors duration-300 ${expandedIndex === index ? 'text-white' : 'text-white/80 group-hover:text-white'
                      }`}>
                      {item.title}
                    </h3>
                  </div>

                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${expandedIndex === index
                    ? 'border-accent bg-accent text-white rotate-180'
                    : 'border-white/20 text-white/30 group-hover:border-white/40 group-hover:text-white'
                    }`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {/* Expanded Content */}
                <div
                  className={`relative z-10 transition-all duration-500 ease-in-out border-t border-white/10 ${expandedIndex === index ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                >
                  <div className="p-6 md:p-8 pt-6 space-y-8">
                    {/* Description */}
                    <div>
                      <p className="text-white/70 leading-relaxed mb-6 font-medium text-base">
                        {item.description}
                      </p>

                      {/* Tags as Pill Badges */}
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, t) => (
                          <span
                            key={t}
                            className="inline-block text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-full cursor-default"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Areas de Practica */}
                    <div className="bg-black/30 rounded-2xl p-6 border border-white/5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-accent rounded-full"></span>
                        Áreas de Práctica
                      </h4>
                      <ul className="space-y-3">
                        {item.bullets.map((bullet, b) => (
                          <li key={b} className="flex items-start gap-3 text-white/60 text-sm">
                            <Check size={16} className="text-accent mt-0.5 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Visual/Summary */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <div className="sticky top-40 p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1E1E2E] to-black border border-white/10 text-center">
              <div className="w-20 h-20 mx-auto bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 animate-pulse">
                <Fingerprint size={40} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Estrategia Personalizada</h3>
              <p className="text-white/50 text-sm mb-8">
                Cada caso es único. Analizamos la viabilidad técnica y jurídica para construir el mejor escenario posible.
              </p>
              <a href="#contacto" className="inline-flex w-full items-center justify-center gap-2 py-4 bg-white text-navy-deep font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Iniciar Consulta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

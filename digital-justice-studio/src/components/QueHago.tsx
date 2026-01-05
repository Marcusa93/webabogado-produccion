import React, { useRef, useState, useEffect } from 'react';
import { Network, Briefcase, Scale, ShieldCheck, Fingerprint } from 'lucide-react';

const specialties = [
  {
    icon: Scale,
    title: "Litigios civiles y comerciales",
    description: "Actuamos en conflictos de daños y perjuicios, responsabilidad contractual y extracontractual, incumplimientos, cobros, controversias empresariales y conflictos entre particulares. Trabajamos con prueba documental clásica y evidencia digital cuando resulta pertinente para acreditar los hechos.",
    detail: "Estrategias procesales para el cumplimiento y la reparación."
  },
  {
    icon: Briefcase,
    title: "Conflictos laborales",
    description: "Intervenimos en despidos, sanciones, acoso laboral, accidentes de trabajo y reclamos de créditos laborales. Muchos de estos casos se apoyan en comunicaciones, registros de asistencia, sistemas internos o cámaras. Integramos esa prueba digital al proceso de manera técnicamente válida.",
    detail: "Protección integral en el ámbito del trabajo y la empresa."
  },
  {
    icon: ShieldCheck,
    title: "Derecho penal",
    description: "Asumimos la defensa técnica en procesos penales y el acompañamiento jurídico de víctimas en etapas de investigación y juicio. Analizamos con rigor la prueba digital incorporada a la causa, su obtención, cadena de custodia, licitud y valor probatorio, resguardando garantías y debido proceso.",
    detail: "Rigor técnico en la defensa de derechos y garantías."
  },
  {
    icon: Network,
    title: "Plataformas y entornos digitales",
    description: "Intervenimos en conflictos vinculados a redes sociales, cuentas bloqueadas, fraudes en línea, comercio electrónico y servicios digitales. Traducimos hechos complejos en planteos jurídicos claros, comprensibles y exigibles en sede judicial o administrativa.",
    detail: "Defensa jurídica en la arquitectura del ecosistema digital."
  },
  {
    icon: Fingerprint,
    title: "Prueba electrónica y estrategia procesal",
    description: "Asesoramos en la identificación, preservación y presentación de evidencia digital: mensajes, correos, metadatos, registros de actividad y pericias informáticas. Diseñamos la estrategia probatoria pensando en su evaluación posterior por jueces y tribunales.",
    detail: "Aseguramiento y validez de la evidencia en juicio."
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
            <span className="text-accent underline decoration-accent/30 underline-offset-8">especialidad.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate leading-relaxed font-medium">
            Intervenimos en conflictos civiles, laborales y penales de alta complejidad. Hoy casi toda controversia deja huella en entornos digitales: comunicaciones, registros de sistemas, plataformas o dispositivos. Nuestro trabajo consiste en ordenar esa evidencia, integrarla al expediente y construir una estrategia procesal sólida, acorde al funcionamiento real de los tribunales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {specialties.map((item, index) => (
            <div
              key={index}
              className="tech-card p-8 md:p-10 rounded-3xl bg-white/80 backdrop-blur-sm shadow-soft border border-navy-deep/5 transition-all duration-500 hover:shadow-strong group"
              style={{
                '--mouse-x': `${mousePos.x}px`,
                '--mouse-y': `${mousePos.y}px`,
              } as React.CSSProperties}
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-navy-deep/5 flex items-center justify-center text-accent mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-navy-deep mb-4 group-hover:text-accent transition-colors font-montserrat leading-tight">
                  {item.title}
                </h3>
                <p className="text-slate/70 text-base mb-6 leading-relaxed font-medium">
                  {item.description}
                </p>
                <div className="pt-6 border-t border-navy-deep/5">
                  <span className="text-[10px] font-black text-accent/80 tracking-widest uppercase block mb-1 font-montserrat">Enfoque</span>
                  <span className="text-sm text-navy-deep/60 italic leading-snug font-medium">
                    {item.detail}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { FileCode, BookOpen, Microscope, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import AnimatedUnderline from './AnimatedUnderline';

const modules = [
  {
    icon: BookOpen,
    title: "Publicaciones",
    version: "2025 Ed.",
    status: "disponible",
    desc: "Manuales y artículos académicos sobre la intersección entre sistemas, datos y derechos fundamentales."
  },
  {
    icon: Microscope,
    title: "Clases & Cursos",
    version: "v2.5",
    status: "inscripciones abiertas",
    desc: "Material de cátedra universitaria y capacitaciones ejecutivas en derecho tecnológico y ciberseguridad."
  },
  {
    icon: FileCode,
    title: "Modelos & Protocolos",
    version: "v1.2.0",
    status: "disponible",
    desc: "Herramientas técnicas y marcos legales pre-diseñados para la gobernanza de datos y privacidad."
  }
];

const roadmap = [
  { q: "Q1 2025", task: "Lanzamiento Libro: IA & Proceso Judicial", status: "completed" },
  { q: "Q2 2025", task: "Seminario: Litigio en Entornos Digitales", status: "in-progress" },
  { q: "Q3 2025", task: "Publicación: Reporte Anual de Tech Law", status: "planned" }
];

export default function Recursos() {
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
    <section id="recursos" ref={sectionRef} className="py-24 md:py-32 bg-ice-blue relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Left Column: Lab Info */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-deep/5 border border-navy-deep/10 mb-8">
              <span className="text-[10px] font-bold tracking-[0.2em] text-navy-deep/60 uppercase font-montserrat">Biblioteca & Publicaciones</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-navy-deep mb-8 leading-tight font-montserrat">
              Recursos de <br />
              <AnimatedUnderline delay={200}>Marco Rossi.</AnimatedUnderline>
            </h2>

            <p className="text-lg md:text-xl text-slate font-medium leading-relaxed mb-12 max-w-2xl">
              Un repositorio de conocimiento donde el derecho se encuentra con la tecnología. Guías, manuales y herramientas para navegar la era digital.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((mod, i) => (
                <div key={i} className="tech-card p-8 rounded-3xl bg-white border border-navy-deep/5 group hover:shadow-strong transition-all duration-500"
                  style={{
                    '--mouse-x': `${mousePos.x}px`,
                    '--mouse-y': `${mousePos.y}px`,
                  } as React.CSSProperties}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-navy-deep/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all icon-hover">
                      <mod.icon size={24} />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-navy-deep/40 bg-navy-deep/5 px-2 py-1 rounded tracking-tighter">
                      {mod.version}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-navy-deep mb-3 font-montserrat">{mod.title}</h3>
                  <p className="text-slate text-sm leading-relaxed mb-6">
                    {mod.desc}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-navy-deep/5">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${mod.status === 'disponible' ? 'text-blue-500' : 'text-navy-deep/30'}`}>
                      {mod.status}
                    </span>
                    <button className="text-navy-deep group-hover:text-accent transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Roadmap */}
          <div className="lg:col-span-1">
            <div className="p-10 rounded-[2.5rem] bg-navy-deep text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BookOpen size={120} />
              </div>

              <h3 className="text-2xl font-black mb-10 font-montserrat">Próximos Pasos</h3>

              <div className="space-y-10 relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-px bg-white/10" />

                {roadmap.map((item, i) => (
                  <div key={i} className="relative pl-10 group">
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-navy-deep z-10 flex items-center justify-center transition-all ${item.status === 'completed' ? 'bg-accent' : item.status === 'in-progress' ? 'bg-blue-500 animate-pulse' : 'bg-white/10'}`}>
                      {item.status === 'completed' && <CheckCircle2 size={12} className="text-white" />}
                      {item.status === 'in-progress' && <Clock size={12} className="text-white" />}
                    </div>

                    <div className="text-[10px] font-black tracking-widest text-accent uppercase mb-1 font-montserrat">
                      {item.q}
                    </div>
                    <div className={`text-sm font-bold leading-snug transition-colors ${item.status === 'planned' ? 'text-white/40' : 'text-white'}`}>
                      {item.task}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-10 border-t border-white/5">
                <p className="text-xs text-white/30 font-medium leading-relaxed italic">
                  * Publicaciones y lanzamientos sujetos a la agenda de investigación académica y profesional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

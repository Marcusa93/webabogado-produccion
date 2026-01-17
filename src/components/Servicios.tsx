import React, { useRef, useState, useEffect } from 'react';
import { Shield, Briefcase, ShoppingBag, Users, Gavel, ArrowRight, Star, User } from 'lucide-react';

const services = [
  {
    icon: Star,
    badges: [
      { text: "Para Influencers", color: "bg-purple-100 text-purple-600", icon: Star },
      { text: "Creators", color: "bg-pink-100 text-pink-600", icon: Users }
    ],
    title: "Abogacía para influencers y creadores digitales",
    summary: "Protección legal integral para creadores de contenido digital y streamers.",
    description: "Representamos a influencers y streamers en negociaciones con marcas, contratos, uso de imagen, desmonetizaciones, bloqueos y conflictos reputacionales."
  },
  {
    icon: Briefcase,
    badges: [
      { text: "Para Empresas", color: "bg-blue-100 text-blue-600", icon: Briefcase }
    ],
    title: "Defensa integral para empresas",
    summary: "Seguridad jurídica para negocios en conflictos civiles y laborales.",
    description: "Intervenimos en reclamos laborales, demandas de consumidores, incumplimientos contractuales y gestión de crisis reputacionales con estrategias preventivas."
  },
  {
    icon: ShoppingBag,
    badges: [
      { text: "Para Personas", color: "bg-green-100 text-green-600", icon: User }
    ],
    title: "Protección avanzada del consumidor",
    summary: "Defensa contra abusos de bancos, plataformas y aerolíneas.",
    description: "Actuamos frente a fraudes, compras incumplidas, débitos indebidos y trato indigno por parte de grandes proveedores de servicios y plataformas."
  },
  {
    icon: Users,
    badges: [
      { text: "Para Trabajadores", color: "bg-green-100 text-green-600", icon: User }
    ],
    title: "Defensa en conflictos laborales personales",
    summary: "Acompañamiento en despidos, sanciones y acoso laboral.",
    description: "Evaluamos tu situación para definir la mejor estrategia: negociación, vía administrativa o demanda judicial ante presiones o despidos injustificados."
  },
  {
    icon: Gavel,
    badges: [
      { text: "Penal / Civil", color: "bg-orange-100 text-orange-600", icon: Shield }
    ],
    title: "Denuncias penales, mediaciones y juicios",
    summary: "Representación firme en instancias judiciales críticas.",
    description: "Asistencia en denuncias policiales, mediaciones y juicios orales. Construimos defensas técnicas serias y representamos a víctimas con compromiso."
  }
];

export default function Servicios() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToContact = () => {
    const element = document.querySelector('#contacto');
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

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
      id="servicios"
      ref={sectionRef}
      className="py-24 md:py-32 bg-white relative"
      style={{ minHeight: '300vh' }}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

          {/* Left Column: Title & Intro (Sticky) */}
          <div className="lg:w-2/5 lg:sticky lg:top-32 h-fit">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-deep/5 border border-navy-deep/10 mb-6">
              <span className="text-[10px] font-bold tracking-widest text-navy-deep/60 uppercase font-montserrat tracking-[0.2em]">Ecosistema Legal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-navy-deep mb-8 leading-tight font-montserrat">
              Servicios <br />
              <span className="text-accent underline decoration-accent/30 underline-offset-8">profesionales.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate font-medium leading-relaxed">
              Ofrecemos servicios jurídicos orientados a resolver problemas concretos de personas, empresas y organizaciones. Trabajamos con seriedad, estrategia y experiencia real en tribunales.
            </p>
          </div>

          {/* Right Column: Stacking Cards Wrapper */}
          <div className="lg:w-3/5 relative pt-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="sticky bg-white tech-card p-8 md:p-12 rounded-[2.5rem] border border-navy-deep/10 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] mb-12 last:mb-0 transition-all duration-500 hover:scale-[1.03] group"
                style={{
                  top: '120px',
                  zIndex: index + 1,
                  '--mouse-x': `${mousePos.x}px`,
                  '--mouse-y': `${mousePos.y}px`,
                } as React.CSSProperties}
              >
                <div className="relative z-10">

                  {/* Header: Number & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex gap-2">
                      {service.badges.map((badge, i) => (
                        <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${badge.color}`}>
                          <badge.icon size={12} />
                          {badge.text}
                        </span>
                      ))}
                    </div>
                    <div className="text-xl font-black text-accent/20 font-montserrat">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-2xl md:text-3xl font-black text-navy-deep mb-3 font-montserrat leading-tight group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>

                  <div className="text-sm font-bold text-slate mb-6 uppercase tracking-wider opacity-80">
                    {service.summary}
                  </div>

                  <p className="text-lg text-slate/70 font-medium leading-relaxed mb-10 max-w-[90%]">
                    {service.description}
                  </p>

                  <button
                    onClick={scrollToContact}
                    className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-accent hover:gap-5 transition-all duration-300 group/btn bg-accent/5 px-6 py-4 min-h-[44px] rounded-xl w-fit hover:bg-accent hover:text-white"
                  >
                    Consultar servicio <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

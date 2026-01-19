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
      className="py-24 md:py-32 bg-navy-deep relative"
      style={{ minHeight: '300vh' }}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 tech-grid-dark opacity-20 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

          {/* Left Column: Title & Intro (Sticky) */}
          <div className="lg:w-2/5 lg:sticky lg:top-32 h-fit mb-12 lg:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat tracking-[0.2em]">Ecosistema Legal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight font-montserrat">
              Servicios <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">profesionales.</span>
            </h2>
            <p className="text-lg text-white/70 font-medium leading-relaxed mb-10">
              Un enfoque 360° que combina la rigurosidad del derecho tradicional con la agilidad de los negocios digitales.
            </p>

            <button
              onClick={scrollToContact}
              className="hidden lg:flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-light transition-all shadow-glow hover:translate-x-2 w-fit group"
            >
              <span>Solicitar presupuesto</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: Cards with Sticky Stacking Effect */}
          <div className="lg:w-3/5 w-full relative pt-10 pb-32">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-[#1E1E2E] border-2 border-white/10 hover:border-accent/40 rounded-3xl p-8 md:p-10 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(123,44,191,0.15)] hover:-translate-y-1 overflow-hidden lg:sticky mb-12 last:mb-0 shadow-lg"
                style={{
                  top: `${120 + index * 20}px`,
                  zIndex: index + 1
                }}
              >
                {/* Background Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header: Badges and Number */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-3">
                      {service.badges.map((badge, i) => (
                        <div key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                          <badge.icon size={12} />
                          {badge.text}
                        </div>
                      ))}
                    </div>
                    {/* Numeric Badge - More Prominent */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-2xl font-black text-white/20 font-montserrat">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Icon and Title */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <service.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-montserrat">{service.title}</h3>
                      <p className="text-accent font-medium text-sm md:text-base">{service.summary}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/60 leading-relaxed mb-8 pl-0 md:pl-20 md:border-l-2 border-white/5 flex-grow">
                    {service.description}
                  </p>

                  {/* Button at Bottom */}
                  <div className="md:pl-20 mt-auto">
                    <button
                      onClick={scrollToContact}
                      className="text-sm font-bold text-white/40 group-hover:text-accent flex items-center gap-2 transition-colors uppercase tracking-widest"
                    >
                      Consultar servicio
                      <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Solicitar Presupuesto Button - Separated with margin */}
            <button
              onClick={scrollToContact}
              className="lg:hidden flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-light transition-all shadow-glow mt-16 w-full"
            >
              <span>Solicitar presupuesto</span>
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { Shield, Briefcase, ShoppingBag, Users, Gavel, ArrowRight, Star, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import AnimatedUnderline from './AnimatedUnderline';
import StaggeredTitle from './StaggeredTitle';

const services = [
  {
    id: 1,
    icon: Star,
    badges: [
      { text: "Influyentes", color: "bg-purple-100 text-purple-600", icon: Star },
      { text: "Creators", color: "bg-pink-100 text-pink-600", icon: Users }
    ],
    title: "Abogacía para influencers y creadores digitales",
    summary: "Protección integral de marca personal e imagen.",
    description: "Representamos a influencers y streamers en negociaciones con marcas, redacción de contratos publicitarios, defensa ante uso no autorizado de imagen, recuperación de cuentas, desmonetizaciones y gestión de crisis reputacionales."
  },
  {
    id: 2,
    icon: Briefcase,
    badges: [
      { text: "Empresas", color: "bg-blue-100 text-blue-600", icon: Briefcase }
    ],
    title: "Defensa integral para empresas",
    summary: "Seguridad jurídica en negocios y litigios.",
    description: "Intervenimos en reclamos laborales complejos, demandas colectivas de consumidores, disputas societarias, incumplimientos contractuales B2B y estrategias preventivas de Compliance digital."
  },
  {
    id: 3,
    icon: ShoppingBag,
    badges: [
      { text: "Personas", color: "bg-green-100 text-green-600", icon: User }
    ],
    title: "Protección avanzada del consumidor y las empresas",
    summary: "Acciones preventivas empresariales y contra abusos de grandes proveedores.",
    description: "Defensa especializada frente a fraudes bancarios (phishing), estafas en plataformas de e-commerce, vuelos cancelados, débitos indebidos y prácticas abusivas de servicios masivos."
  },
  {
    id: 4,
    icon: Users,
    badges: [
      { text: "Trabajadores", color: "bg-green-100 text-green-600", icon: User }
    ],
    title: "Defensa en conflictos laborales",
    summary: "Acompañamiento a empresas y trabajadores.",
    description: "Evaluamos tu situación para definir la mejor estrategia: negociación prejudicial, reclamo administrativo o demanda judicial ante despidos injustificados, trabajo no registrado o acoso laboral."
  },
  {
    id: 5,
    icon: Gavel,
    badges: [
      { text: "Penal / Civil", color: "bg-orange-100 text-orange-600", icon: Shield }
    ],
    title: "Denuncias penales, mediaciones y juicios",
    summary: "Litigación estratégica en casos críticos.",
    description: "Asistencia letrada en denuncias penales por ciberdelitos, querellas por calumnias e injurias, mediaciones civiles y juicios orales. Construimos defensas técnicas sólidas con alto estándar probatorio."
  }
];

export default function Servicios() {
  const [activeService, setActiveService] = useState<number | null>(1); // Default open first one
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToContact = () => {
    const element = document.querySelector('#contacto');
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="py-24 md:py-32 bg-background transition-colors duration-500 relative"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

          {/* Left Column: Title & Intro (Sticky) */}
          <div className="lg:w-2/5 lg:sticky lg:top-32 h-fit mb-12 lg:mb-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6 mx-auto lg:mx-0">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat tracking-[0.2em] w-full">Ecosistema Legal</span>
            </div>

            <StaggeredTitle
              text="Servicios profesionales."
              highlightWords={['profesionales']}
              className="text-4xl md:text-5xl font-black text-foreground mb-8 leading-tight font-montserrat justify-center lg:justify-start"
            />

            <p className="text-lg text-foreground/70 font-medium leading-relaxed mb-10">
              Un enfoque 360° que combina la rigurosidad del derecho tradicional con la agilidad de los negocios digitales.
            </p>

            <button
              onClick={scrollToContact}
              className="hidden lg:flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent-light transition-all shadow-glow hover:translate-x-2 w-fit group"
            >
              <span>Solicitar presupuesto</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:w-3/5 w-full flex flex-col gap-6">
            {services.map((service, index) => {
              const isActive = activeService === service.id;

              return (
                <div
                  key={service.id}
                  className={`group bg-card rounded-3xl border transition-all duration-500 overflow-hidden ${isActive ? 'border-accent shadow-lg scale-[1.02]' : 'border-foreground/10 hover:border-foreground/20'}`}
                >
                  {/* Header - Always Visible */}
                  <button
                    onClick={() => setActiveService(isActive ? null : service.id)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 shrink-0 ${isActive ? 'bg-accent/10 text-accent' : 'bg-foreground/5 text-foreground/50 group-hover:text-foreground'}`}>
                        <service.icon size={24} />
                      </div>
                      <div>
                        <h3 className={`text-lg md:text-xl font-bold font-montserrat mb-1 transition-colors ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
                          {service.title}
                        </h3>
                        <p className={`text-sm md:text-base font-medium transition-colors ${isActive ? 'text-accent' : 'text-foreground/50'}`}>
                          {service.summary}
                        </p>
                      </div>
                    </div>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-accent text-white rotate-180' : 'bg-foreground/5 text-foreground/40 group-hover:bg-foreground/10'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  {/* Content - Expandable */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-6 md:p-8 pt-0 border-t border-dashed border-foreground/10">
                      <div className="flex flex-wrap gap-2 mb-4 mt-6">
                        {service.badges.map((badge, i) => (
                          <span key={i} className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badge.color}`}>
                            {badge.text}
                          </span>
                        ))}
                      </div>
                      <p className="text-foreground/70 leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToContact();
                        }}
                        className="text-sm font-bold text-accent hover:text-accent-light flex items-center gap-2 transition-colors uppercase tracking-widest"
                      >
                        Consultar ahora
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Áreas adicionales — comunica el scope completo del estudio */}
            <div className="mt-10 p-6 md:p-8 rounded-3xl bg-foreground/[0.03] border border-foreground/10">
              <p className="text-[10px] md:text-xs font-black tracking-[0.2em] text-foreground/40 uppercase mb-4">
                Áreas adicionales que abordamos
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Derecho del consumidor',
                  'Civil',
                  'Administrativo',
                  'Daños y perjuicios',
                  'Penal',
                  'Laboral',
                  'Mediaciones',
                ].map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 text-xs font-bold rounded-full bg-card border border-foreground/10 text-foreground/70 hover:border-accent/40 hover:text-foreground transition-colors"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-foreground/50 leading-relaxed">
                Acompañamos a clientes en procesos judiciales, mediaciones y estrategias preventivas en cada una de estas áreas.
              </p>
            </div>

            {/* Mobile CTA */}
            <button
              onClick={scrollToContact}
              className="lg:hidden flex items-center justify-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent-light transition-all shadow-glow mt-8 w-full"
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

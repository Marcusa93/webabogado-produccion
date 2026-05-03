import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Scale,
  Terminal,
  Linkedin,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { useInView } from '@/hooks/useInView';
import StaggeredTitle from './StaggeredTitle';

const team = [
  {
    name: 'Marco Rossi',
    role: 'Abogado · Especialista en Derecho Procesal Civil · Director de DYNTEC (UNT)',
    image: '/team/marco.webp',
    bio: 'Doctor Honoris Causa por la Federación Iberoamericana de Abogados. Ex Relator y Funcionario Judicial. Primer Director de IA en un Municipio en Argentina. Lidera la defensa estratégica en casos de alta complejidad combinando experiencia judicial con dominio profundo de la tecnología.',
    isPrincipal: true,
  },
  {
    name: 'Facundo Castillo',
    role: 'Abogado asociado',
    image: '/team/facundo.webp',
    bio: 'Especialista en Derecho Laboral con enfoque en litigación estratégica contra ART. Participa activamente en la gestión de expedientes y defensa de empresas y particulares.',
    linkedin: 'https://ar.linkedin.com/in/facundo-castillo-947b1b222',
    personalBrand: {
      logoLight: '/team/castillo/logo-navy.png',
      logoDark: '/team/castillo/logo-blanco.png',
      alt: 'Facundo Castillo Abogado — marca personal',
    },
  },
  {
    name: 'Vancis Roda',
    role: 'Asesor auxiliar y perito de parte',
    image: '/team/vancis.webp',
    bio: 'Experto en análisis de evidencia informática y peritajes técnicos. Brinda el soporte científico necesario para la validación de pruebas en entornos digitales complejos.',
    linkedin: 'https://twitter.com/vancishacks',
  },
];

export default function QuienesSomos() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  // 3D Tilt effect logic for Marco's photo card
  const marcoCardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!marcoCardRef.current) return;
    const rect = marcoCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <section
      id="quienes-somos"
      ref={ref}
      className="relative py-24 md:py-32 bg-background transition-colors duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 tech-grid opacity-10" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-20 md:mb-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">
              El Estudio
            </span>
          </div>

          <StaggeredTitle
            text="Nuestro Equipo."
            highlightWords={['Equipo.']}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 font-montserrat justify-center"
          />

          <p className="text-xl md:text-2xl text-foreground/70 font-medium leading-relaxed max-w-2xl mx-auto">
            Equipo profesional multidisciplinario con experiencia en derecho, justicia y
            tecnología.
          </p>
        </div>

        {/* Marco Rossi Highlighted Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start mb-24 md:mb-32">
          {/* Left Column: Photo & Main Info */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Picture with 3D Effect */}
              <div
                className={`shrink-0 w-full md:w-[350px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-foreground/10 relative group ${
                  isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                } transition-all duration-1000 order-1`}
              >
                <div
                  ref={marcoCardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                    transition: rotate.x === 0 ? 'transform 0.5s ease-out' : 'none',
                  }}
                  className="w-full h-full relative"
                >
                  <OptimizedImage
                    src="/team/marco.webp"
                    alt="Marco Rossi"
                    className="w-full h-full object-cover object-[75%_center]"
                    blurPlaceholder={true}
                    priority={true}
                    width={400}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Short Bio */}
              <div className="flex-1 order-2">
                <h3 className="text-4xl lg:text-5xl font-black text-foreground mb-3 font-montserrat tracking-tight">
                  {team[0].name}
                </h3>
                <div className="text-accent font-bold text-lg mb-6 uppercase tracking-wider">
                  {team[0].role}
                </div>
                <p className="text-foreground/70 text-lg leading-relaxed font-medium mb-8">
                  {team[0].bio}
                </p>
                <Link
                  to="/sobre-mi"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:bg-accent hover:text-white transition-all duration-300 shadow-lg group/cta"
                >
                  Ver trayectoria, libros y medios
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover/cta:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Credentials Sidebar */}
          <div className="lg:col-span-5 bg-foreground/5 p-8 rounded-[2rem] border border-foreground/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-foreground">
              <Scale size={120} />
            </div>

            <h4 className="text-xl font-black text-foreground mb-6 relative z-10 font-montserrat">
              Credenciales Destacadas
            </h4>

            <ul className="space-y-4 relative z-10">
              {[
                {
                  text: 'Doctor Honoris Causa — Federación Iberoamericana de Abogados',
                  icon: Award,
                },
                {
                  text: 'Director de DYNTEC (UNT) — Laboratorio de IA, Innovación y Transformación Digital',
                  icon: Terminal,
                },
                {
                  text: 'Primer Director de IA en un Municipio en Argentina (San Miguel de Tucumán)',
                  icon: Lightbulb,
                },
                {
                  text: 'Posgrado UBA en Metaverso, Gaming y Web 3.0',
                  icon: BookOpen,
                },
                {
                  text: 'Especialista en Derecho Procesal Civil — Ex Relator y Funcionario Judicial',
                  icon: Scale,
                },
                {
                  text: 'Docente UNT en Derechos de las Nuevas Tecnologías',
                  icon: Lightbulb,
                },
                {
                  text: 'Coautor de 5+ libros sobre tecnologías emergentes',
                  icon: BookOpen,
                },
              ].map((cred, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 p-3 bg-card rounded-xl shadow-sm border border-foreground/5 transition-transform hover:scale-[1.02]"
                >
                  <div className="p-2 bg-accent/10 rounded-lg text-accent shrink-0">
                    <cred.icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-foreground/80 pt-1 leading-snug">
                    {cred.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Other Team Members - 2 Columns */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {team.slice(1).map((member: any, index) => (
            <div
              key={index}
              className={`fade-in-up bg-card p-8 md:p-10 rounded-[2.5rem] border border-foreground/10 shadow-lg hover:shadow-2xl transition-all duration-500 group stagger-${index + 1} ${
                isInView ? 'is-visible' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start text-center lg:text-left">
                <div className="w-32 md:w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-foreground/5 flex-shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <h4 className="text-2xl font-black text-foreground mb-2 font-montserrat">
                    {member.name}
                  </h4>
                  <div className="text-accent font-bold text-sm uppercase tracking-wider mb-6">
                    {member.role}
                  </div>
                  <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-8">
                    {member.bio}
                  </p>

                  {/* Footer: LinkedIn + (optional) marca personal */}
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-foreground/5">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors"
                    >
                      <Linkedin size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Ver Perfil
                      </span>
                    </a>

                    {member.personalBrand && (
                      <div
                        className="flex items-center gap-3"
                        title="Marca personal del abogado"
                      >
                        <span className="hidden sm:inline text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">
                          Marca personal
                        </span>
                        <img
                          src={member.personalBrand.logoLight}
                          alt={member.personalBrand.alt}
                          className="h-7 md:h-8 w-auto opacity-60 group-hover:opacity-100 transition-opacity dark:hidden"
                        />
                        <img
                          src={member.personalBrand.logoDark}
                          alt={member.personalBrand.alt}
                          className="h-7 md:h-8 w-auto opacity-60 group-hover:opacity-100 transition-opacity hidden dark:block"
                        />
                      </div>
                    )}
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

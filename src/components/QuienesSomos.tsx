import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Linkedin, ArrowRight, ExternalLink } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { useInView } from '@/hooks/useInView';
import StaggeredTitle from './StaggeredTitle';
import { credentials, HOME_CREDENTIALS } from '@/data/credentials';

const principal = {
  name: 'Marco Rossi',
  role: 'Abogado · Especialista en Derecho Procesal Civil · Director de DYNTEC (UNT)',
  bio: 'Lidera la defensa estratégica en casos de alta complejidad combinando experiencia judicial con dominio profundo de la tecnología.',
};

const partner = {
  name: 'Facundo Castillo',
  role: 'Derecho Laboral · Litigación contra ART',
  image: '/team/facundo.webp',
  bio: 'Especialista en Derecho Laboral con enfoque en litigación estratégica contra ART. Conduce la gestión de expedientes y la defensa de empresas y particulares en el fuero laboral.',
  link: 'https://ar.linkedin.com/in/facundo-castillo-947b1b222',
  personalBrand: {
    logoLight: '/team/castillo/logo-navy.png',
    logoDark: '/team/castillo/logo-blanco.png',
    alt: 'Facundo Castillo Abogado — marca personal',
  },
};

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  link?: string;
}

const associates: TeamMember[] = [
  {
    name: 'Francisco Bottini',
    role: 'Abogado asociado',
    image: '/team/bottini.webp',
    bio: 'Abogado con experiencia práctica en la Defensoría Oficial Penal. Actualmente se especializa en Derecho de Daños (UNT).',
  },
  {
    name: 'Facundo Casadey',
    role: 'Abogado asociado',
    image: '/team/casadey.webp',
    bio: 'Abogado con experiencia en Sociedades y Fundaciones.',
  },
];

const advisor: TeamMember = {
  name: 'Vancis Roda',
  role: 'Asesor auxiliar y perito de parte',
  image: '/team/vancis.webp',
  bio: 'Experto en análisis de evidencia informática y peritajes técnicos. Brinda el soporte científico necesario para la validación de pruebas en entornos digitales complejos.',
  link: 'https://twitter.com/vancishacks',
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const ProfileLink = ({ href }: { href: string }) => {
  const Icon = href.includes('linkedin.com') ? Linkedin : ExternalLink;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors"
    >
      <Icon size={18} />
      <span className="text-[10px] font-black uppercase tracking-widest">Ver Perfil</span>
    </a>
  );
};

const MemberCard = ({ member, className = '' }: { member: TeamMember; className?: string }) => (
  <div
    className={`flex flex-col bg-card p-6 md:p-8 rounded-[2rem] border border-foreground/10 shadow-lg hover:shadow-2xl transition-all duration-500 group ${className}`}
  >
    <div className="flex items-center gap-5">
      {member.image ? (
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-md border border-foreground/5 shrink-0">
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-black text-xl md:text-2xl font-montserrat"
        >
          {initials(member.name)}
        </div>
      )}
      <div>
        <h4 className="text-xl md:text-2xl font-black text-foreground font-montserrat leading-tight mb-1">
          {member.name}
        </h4>
        <div className="text-accent font-bold text-xs md:text-sm uppercase tracking-wider">
          {member.role}
        </div>
      </div>
    </div>

    {member.bio && (
      <p className="text-foreground/70 text-sm md:text-base leading-relaxed mt-5">{member.bio}</p>
    )}

    {member.link && (
      <div className="mt-auto pt-5">
        <ProfileLink href={member.link} />
      </div>
    )}
  </div>
);

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
      className="relative py-20 md:py-28 bg-background transition-colors duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 tech-grid opacity-10" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 text-center">
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

          <p className="text-lg md:text-xl text-foreground/70 font-medium leading-relaxed max-w-2xl mx-auto">
            Experiencia judicial, litigio y tecnología.
          </p>
        </div>

        {/* Marco Rossi Highlighted Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start mb-12 md:mb-16">
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
                  {principal.name}
                </h3>
                <div className="text-accent font-bold text-lg mb-6 uppercase tracking-wider">
                  {principal.role}
                </div>
                <p className="text-foreground/70 text-lg leading-relaxed font-medium mb-8">
                  {principal.bio}
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
              Credenciales destacadas
            </h4>

            <ul className="space-y-4 relative z-10">
              {credentials.slice(0, HOME_CREDENTIALS).map((cred, i) => (
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

        {/* Socio */}
        <div
          className={`fade-in-up relative bg-card rounded-[2.5rem] border border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group mb-8 lg:mb-12 ${
            isInView ? 'is-visible' : ''
          }`}
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 p-8 md:p-12 items-center md:items-stretch text-center md:text-left">
            <div className="w-48 md:w-56 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-foreground/10 shrink-0">
              <img
                src={partner.image}
                alt={partner.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="inline-flex self-center md:self-start items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-5">
                <Scale size={12} className="text-accent" />
                <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase font-montserrat">
                  Socio
                </span>
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 font-montserrat tracking-tight">
                {partner.name}
              </h3>
              <div className="text-accent font-bold text-sm md:text-base uppercase tracking-wider mb-6">
                {partner.role}
              </div>
              <p className="text-foreground/70 text-base md:text-lg leading-relaxed font-medium mb-8 max-w-2xl">
                {partner.bio}
              </p>

              <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-foreground/5">
                <ProfileLink href={partner.link} />
                <div className="flex items-center gap-3" title="Marca personal del abogado">
                  <span className="hidden sm:inline text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">
                    Marca personal
                  </span>
                  <img
                    src={partner.personalBrand.logoLight}
                    alt={partner.personalBrand.alt}
                    className="h-8 md:h-9 w-auto opacity-70 group-hover:opacity-100 transition-opacity dark:hidden"
                  />
                  <img
                    src={partner.personalBrand.logoDark}
                    alt={partner.personalBrand.alt}
                    className="h-8 md:h-9 w-auto opacity-70 group-hover:opacity-100 transition-opacity hidden dark:block"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Asociados + asesor pericial */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <div className="flex flex-col gap-6 lg:gap-8">
            {associates.map((member, index) => (
              <MemberCard
                key={member.name}
                member={member}
                className={`fade-in-up stagger-${index + 1} ${isInView ? 'is-visible' : ''}`}
              />
            ))}
          </div>

          <MemberCard
            member={advisor}
            className={`fade-in-up stagger-3 ${isInView ? 'is-visible' : ''}`}
          />
        </div>
      </div>
    </section>
  );
}

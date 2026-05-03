import { Linkedin, Instagram, Mail, MessageCircle, ArrowUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-white.svg';
import { trackSocialClick, trackWhatsAppClick, trackEmailClick } from '@/lib/analytics';
import StaggeredTitle from './StaggeredTitle';
import Magnetic from './Magnetic';

const socialLinks = [
  { icon: Linkedin, href: 'https://ar.linkedin.com/in/marcorossi9', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/marquitorossi/', label: 'Instagram' },
  { icon: Mail, href: 'mailto:dr.marcorossi9@gmail.com', label: 'Email' },
  { icon: MessageCircle, href: 'https://wa.me/5493813007791', label: 'WhatsApp' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialClick = (platform: string) => {
    if (platform === 'WhatsApp') {
      trackWhatsAppClick('footer');
    } else if (platform === 'Email') {
      trackEmailClick('footer');
    } else {
      trackSocialClick(platform.toLowerCase(), 'footer');
    }
  };

  return (
    <footer className="relative bg-[#020617] text-white overflow-hidden">
      {/* Pre-Footer Heroic CTA */}
      <div className="relative py-24 md:py-32 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="section-container relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
            <ShieldCheck size={14} className="text-accent" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Asesoría de Vanguardia</span>
          </div>

          <StaggeredTitle
            text="¿Listo para proteger tus derechos?"
            highlightWords={['proteger', 'derechos?']}
            className="text-4xl md:text-6xl lg:text-7xl font-black font-montserrat mb-8 tracking-tight justify-center text-white"
          />

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium">
            No esperes a tener un conflicto. La mejor defensa legal se construye con anticipación y estrategia.
          </p>

          <Magnetic strength={0.4}>
            <a
              href="#contacto"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative flex items-center gap-4 px-10 py-6 bg-accent text-white font-black text-lg rounded-2xl transition-all duration-500 hover:shadow-glow hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">Agendar consulta ahora</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="section-container pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <img src={logo} alt="Marco Rossi" className="h-12 w-auto mb-8 opacity-90 brightness-0 invert" />
            <p className="text-white/60 text-lg leading-relaxed max-w-sm mb-10 font-medium">
              Estrategia legal para la era digital. <br />
              Experiencia judicial, visión tecnológica.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(social.label)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white transition-all duration-300 border border-white/5"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Quick Links - Clean List */}
          <div className="lg:col-span-3 flex flex-col items-center md:items-start">
            <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-8">Navegación</h4>
            <ul className="flex flex-col items-center md:items-start gap-4 space-y-2">
              {[
                { label: 'Especialidades', href: '#especialidades' },
                { label: 'Servicios', href: '#servicios' },
                { label: 'En los medios', href: '#casos-prensa' },
                { label: 'Equipo Profesional', href: '#quienes-somos' },
                { label: 'Contacto', href: '#contacto' }
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      if (element) {
                        const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
                    }}
                    className="text-white/70 hover:text-white transition-colors text-base font-bold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-8">Oficinas</h4>
            <p className="text-white/80 text-xl font-bold mb-2">
              Tucumán, Argentina
            </p>
            <p className="text-white/50 text-sm mb-8">
              Atención global remota
            </p>

            <a href="mailto:dr.marcorossi9@gmail.com" className="text-accent hover:text-white transition-colors font-bold text-lg underline decoration-accent/30 hover:decoration-white/50 underline-offset-4">
              dr.marcorossi9@gmail.com
            </a>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center md:text-left">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
              © {currentYear} Marco Rossi. Todos los derechos reservados.
            </p>
            <Link
              to="/privacidad"
              className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors underline-offset-4 hover:underline"
            >
              Política de privacidad
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-white/30 hover:text-white transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Volver arriba</span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/50 transition-colors">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}

import { Linkedin, Instagram, Mail, MessageCircle, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-white.svg';
import { trackSocialClick, trackWhatsAppClick, trackEmailClick } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/whatsapp';

const socialLinks = [
  { icon: Linkedin, href: 'https://ar.linkedin.com/in/marcorossi9', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/marquitorossi/', label: 'Instagram' },
  { icon: Mail, href: 'mailto:dr.marcorossi9@gmail.com', label: 'Email' },
  { icon: MessageCircle, href: whatsappUrl(), label: 'WhatsApp' },
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
      <div className="section-container pt-16 pb-10 relative z-10">
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
                { label: 'Áreas de práctica', href: '#especialidades' },
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

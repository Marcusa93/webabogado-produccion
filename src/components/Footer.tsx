import { Linkedin, Instagram, Mail, MessageCircle, ArrowUp } from 'lucide-react';
import logo from '@/assets/logo-white.svg';
import { trackSocialClick, trackWhatsAppClick, trackEmailClick } from '@/lib/analytics';

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#que-esperar', label: 'Nuestro estudio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#quienes-somos', label: 'Quiénes Somos' },
  { href: '#contacto', label: 'Contacto' },
  { href: '#recursos', label: 'Recursos' },
];

const socialLinks = [
  { icon: Linkedin, href: 'https://ar.linkedin.com/in/marcorossi9', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/marquitorossi/', label: 'Instagram' },
  { icon: Mail, href: 'mailto:dr.marcorossi9@gmail.com', label: 'Email' },
  { icon: MessageCircle, href: 'https://wa.me/5493813007791', label: 'WhatsApp' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <footer className="relative bg-primary py-16 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tech-grid-dark opacity-20" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-12">
          {/* Column 1: Brand & Description */}
          <div>
            <img
              src={logo}
              alt="Marco Rossi Abogado"
              className="h-10 md:h-11 w-auto mb-6"
            />
            <p className="text-primary-foreground/70 max-w-md leading-relaxed text-sm">
              Defensa legal estratégica centrada en la protección de derechos en entornos digitales complejos.
              Experiencia judicial y técnica para una justicia moderna y efectiva.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-primary-foreground uppercase tracking-wider mb-5">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contactos (Social Links) */}
          <div>
            <h4 className="text-xs font-bold text-primary-foreground uppercase tracking-wider mb-5">
              Contactos
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(social.label)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
            <p>© {currentYear} Marco Rossi Abogado. Todos los derechos reservados.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Política de privacidad
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Términos
              </a>
              {/* Volver arriba - Discrete with arrow icon */}
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                aria-label="Volver arriba"
              >
                <span className="text-xs">Volver arriba</span>
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

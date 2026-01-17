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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img
              src={logo}
              alt="Marco Rossi Abogado"
              className="h-10 md:h-12 w-auto mb-6"
            />
            <p className="text-primary-foreground/70 max-w-md leading-relaxed mb-6">
              Defensa legal estratégica centrada en la protección de derechos en entornos digitales complejos.
              Experiencia judicial y técnica para una justicia moderna y efectiva.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(social.label)}
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-3">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground uppercase tracking-wider mb-4">
              Más
            </h4>
            <ul className="space-y-3">
              {navLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
            <p>© {currentYear} Marco Rossi Abogado. Todos los derechos reservados.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Política de privacidad
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Términos
              </a>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-all duration-300"
            aria-label="Volver arriba"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}

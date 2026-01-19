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
    <footer className="bg-background border-t border-foreground/5 pt-20 pb-10 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none" />
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <img src={logo} alt="Marco Rossi" className="h-10 w-auto mb-8 brightness-0 dark:brightness-100 opacity-80" />
            <p className="text-foreground/70 text-lg leading-relaxed max-w-sm mb-10 font-medium">
              Defensa legal estratégica para la economía digital y los negocios tecnológicos.
              Experiencia judicial y técnica para una justicia moderna y efectiva.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 flex flex-col items-center md:items-start">
            <h4 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-8">Navegación</h4>
            <ul className="flex flex-col items-center md:items-start gap-4">
              {[
                { label: 'Especialidades', href: '#especialidades' },
                { label: 'Servicios', href: '#servicios' },
                { label: 'Equipo', href: '#quienes-somos' },
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
                    className="text-foreground/60 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-8">Contactos</h4>
            <p className="text-foreground/60 text-sm font-bold mb-8 max-w-[200px] leading-relaxed">
              Tucumán, Argentina <br />
              <span className="text-accent underline">dr.marcorossi9@gmail.com</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(social.label)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-foreground/5 text-foreground/70 hover:bg-accent hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
              © {currentYear} Marco Rossi. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-foreground/30 hover:text-foreground text-[10px] font-bold uppercase tracking-widest transition-colors">Aviso Legal</a>
              <a href="#" className="text-foreground/30 hover:text-foreground text-[10px] font-bold uppercase tracking-widest transition-colors">Privacidad</a>
              <button
                onClick={scrollToTop}
                className="btn-interactive inline-flex items-center gap-1.5 text-foreground/40 hover:text-accent transition-colors"
                aria-label="Volver arriba"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">Arriba</span>
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

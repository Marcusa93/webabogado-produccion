import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logoWhite from '@/assets/logo-white.svg';
import logoNavy from '@/assets/logo-navy.svg';

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#que-esperar', label: 'Nuestro estudio' },
  { href: '#servicios', label: 'Servicios' },
  { label: 'Quiénes Somos', href: '#quienes-somos' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Active section detection
      const sections = navLinks.map(link => link.href.substring(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold for detection
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'glass border-b border-border/50 shadow-soft py-2 md:py-3'
        : 'bg-transparent py-4 md:py-6'
        }`}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#inicio');
            }}
            className="relative z-50 transition-transform active:scale-95"
          >
            <img
              src={isScrolled ? logoNavy : logoWhite}
              alt="Marco Rossi Abogado"
              className="h-8 md:h-10 lg:h-12 w-auto transition-all duration-500"
            />
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`text-sm font-bold tracking-tight transition-all duration-300 relative py-2 group ${isScrolled
                    ? (activeSection === link.href.substring(1) ? 'text-accent' : 'text-foreground/70 hover:text-foreground')
                    : (activeSection === link.href.substring(1) ? 'text-white underline-offset-8' : 'text-white/70 hover:text-white')
                    }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${activeSection === link.href.substring(1) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <a
              href="#contacto"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contacto');
              }}
              className={`inline-flex items-center px-6 py-2.5 transition-all duration-300 hover:shadow-strong rounded-lg text-sm font-black active:scale-95 ${isScrolled
                ? 'bg-primary text-primary-foreground hover:bg-accent'
                : 'bg-white text-navy-deep hover:bg-accent hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                }`}
            >
              Agendar consulta
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 z-50 transition-all active:scale-90 ${isScrolled || isMobileMenuOpen ? 'text-foreground' : 'text-white'
              }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-background/98 backdrop-blur-2xl z-40 transition-all duration-500 ${isMobileMenuOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
      >
        <nav className="flex flex-col items-center justify-center h-full px-6 text-center">
          <ul className="flex flex-col gap-8 md:gap-10">
            {navLinks.map((link, index) => (
              <li
                key={link.href}
                className={`transform transition-all duration-500 ${isMobileMenuOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
                  }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`text-2xl md:text-3xl font-black transition-colors ${activeSection === link.href.substring(1) ? 'text-accent' : 'text-foreground hover:text-accent'
                    }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className={`pt-6 transform transition-all duration-500 delay-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#contacto');
                }}
                className="inline-flex items-center px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl text-xl shadow-glow active:scale-95"
              >
                Agendar consulta
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

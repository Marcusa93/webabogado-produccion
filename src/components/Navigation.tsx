import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import logoWhite from '@/assets/logo-white.svg';
import logoNavy from '@/assets/logo-navy.svg';

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#que-esperar', label: 'Nuestro estudio' },
  { href: '#servicios', label: 'Servicios' },
  { label: 'Nuestro Equipo', href: '#quienes-somos' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Detached from Header for stability */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`lg:hidden fixed top-4 left-4 p-2 z-[100] menu-toggle rounded-full transition-colors duration-300 ${isMobileMenuOpen
          ? 'text-navy-deep bg-white/10 backdrop-blur-sm'
          : (isScrolled ? 'text-navy-deep' : 'text-white')
          }`}
        style={{ touchAction: 'manipulation' }}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 min-h-[72px] flex items-center ${isScrolled
          ? 'glass border-b border-border/50 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
          : 'bg-transparent'
          }`}
      >
        <nav className="section-container w-full">
          <div className="flex items-center justify-end lg:justify-between">

            {/* Logo */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#inicio');
              }}
              className="relative z-50 transition-transform active:scale-95 lg:flex-shrink-0 ml-auto lg:ml-0"
            >
              <img
                src={isScrolled ? logoNavy : logoWhite}
                alt="Marco Rossi Abogado"
                className="h-10 md:h-11 w-auto transition-all duration-500"
              />
            </a>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-6 xl:gap-8 ml-auto">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={`link-underline text-sm font-bold tracking-tight transition-all duration-300 relative py-2 ${isScrolled
                      ? (activeSection === link.href.substring(1) ? 'text-accent' : 'text-navy-deep/80 hover:text-accent')
                      : (activeSection === link.href.substring(1) ? 'text-white' : 'text-white/70 hover:text-white')
                      }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Theme Toggle & CTA */}
            <div className="hidden lg:flex items-center ml-8 gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${isScrolled ? 'text-navy-deep hover:bg-navy-deep/5' : 'text-white hover:bg-white/10'
                  }`}
                aria-label="Alternar tema"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#contacto');
                }}
                className="btn-interactive inline-flex items-center px-6 py-3 rounded-xl text-sm font-black bg-accent text-white hover:bg-accent-light shadow-lg"
              >
                Agendar consulta
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-navy-deep/98 backdrop-blur-3xl z-40 transition-all duration-500 ${isMobileMenuOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
      >
        <nav className="flex flex-col items-center justify-start h-full px-6 pt-28 pb-12 overflow-y-auto">
          <ul className="flex flex-col items-center gap-5 w-full max-w-xs">
            {navLinks.map((link, index) => (
              <li
                key={link.href}
                className={`w-full transform transition-all duration-500 ${isMobileMenuOpen
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
                  className={`block py-1.5 text-xl font-black transition-colors ${activeSection === link.href.substring(1) ? 'text-accent' : 'text-white/90 hover:text-accent'
                    }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className={`w-full pt-6 flex flex-col gap-4 transform transition-all duration-500 delay-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl transition-all"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={20} />
                    <span>Modo Oscuro</span>
                  </>
                ) : (
                  <>
                    <Sun size={20} />
                    <span>Modo Claro</span>
                  </>
                )}
              </button>

              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#contacto');
                }}
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-accent text-white font-black rounded-xl text-lg shadow-glow active:scale-95"
              >
                Agendar consulta
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

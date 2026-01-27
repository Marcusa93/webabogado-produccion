import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Magnetic from './Magnetic';
import UserProfileDropdown from './UserProfileDropdown';
import logoWhite from '@/assets/logo-white.svg';
import logoNavy from '@/assets/logo-navy.svg';

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#que-esperar', label: 'Nuestro estudio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#toolkit', label: 'Kit para clientes' },
  { label: 'Nuestro Equipo', href: '#quienes-somos' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navigation() {
  const { user } = useAuth();
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


      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 flex items-center px-4 md:px-6 
          ${isScrolled
            ? 'top-4 w-[95%] lg:w-[90%] max-w-6xl h-[64px] rounded-2xl md:rounded-full glass border border-border/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
            : 'top-0 w-full h-[80px] bg-background/0 backdrop-blur-0 border-b border-transparent'
          }`}
      >
        <nav className="w-full">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#inicio');
              }}
              className="relative z-50 transition-transform active:scale-95 flex-shrink-0"
            >
              <img
                src={theme === 'dark' ? logoWhite : logoNavy}
                alt="Marco Rossi Abogado"
                className={`transition-all duration-500 ${isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-11'}`}
              />
            </a>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-6 xl:gap-8 mx-auto">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                const isDark = theme === 'dark';

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className={`text-[13px] font-bold tracking-tight transition-all duration-300 relative py-2 ${isActive
                        ? 'text-accent'
                        : (isDark
                          ? 'text-white/60 hover:text-white'
                          : 'text-navy-deep/70 hover:text-accent')
                        }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full animate-in fade-in slide-in-from-bottom-1" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Theme Toggle, User Profile & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-navy-deep hover:bg-navy-deep/5'
                  }`}
                aria-label="Alternar tema"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {user && <UserProfileDropdown />}

              <Magnetic strength={0.2}>
                <a
                  href="#contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('#contacto');
                  }}
                  className={`btn-interactive inline-flex items-center rounded-xl text-xs font-black transition-all duration-500 ${isScrolled
                    ? 'px-5 py-2.5 bg-accent text-white hover:bg-accent-light'
                    : 'px-6 py-3 bg-foreground text-background hover:bg-accent hover:text-white shadow-lg'}`}
                >
                  Consultar
                </a>
              </Magnetic>
            </div>

            {/* Mobile Menu Button - Integrated in Header */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 z-[100] rounded-xl transition-all duration-300 ${isMobileMenuOpen
                ? 'text-foreground fixed top-4 right-4'
                : (theme === 'dark' ? 'text-white' : 'text-navy-deep')
                }`}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-background/98 dark:bg-navy-deep/98 backdrop-blur-3xl z-40 transition-all duration-500 ${isMobileMenuOpen
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
                  className={`block py-1.5 text-xl font-black transition-colors ${activeSection === link.href.substring(1) ? 'text-accent' : 'text-foreground/90 dark:text-white/90 hover:text-accent'
                    }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className={`w-full pt-6 flex flex-col gap-4 transform transition-all duration-500 delay-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 text-foreground dark:text-white font-bold rounded-xl transition-all"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={20} className="text-navy-deep" />
                    <span className="text-navy-deep">Modo Oscuro</span>
                  </>
                ) : (
                  <>
                    <Sun size={20} className="text-white" />
                    <span className="text-white">Modo Claro</span>
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

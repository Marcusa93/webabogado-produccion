import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Magnetic from './Magnetic';
import UserProfileDropdown from './UserProfileDropdown';
import BookingButton from './BookingButton';
import logoWhite from '@/assets/logo-white.svg';
import logoNavy from '@/assets/logo-navy.svg';

const isAnchor = (href: string) => href.startsWith('#');

// Cada link puede ser un anchor del home (`#section`) o una ruta absoluta (`/path`).
// El handler en `scrollToSection` discrimina y usa router en lugar de scroll cuando es ruta.
const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#servicios', label: 'Servicios' },
  { href: '/herramientas', label: 'Herramientas' },
  { href: '#quienes-somos', label: 'Nuestro Equipo' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navigation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

      // Active section detection — solo aplicable para anchors del home (#section).
      // Las rutas absolutas (`/herramientas`) se marcan activas por location.pathname.
      const sections = navLinks
        .filter((link) => isAnchor(link.href))
        .map((link) => link.href.substring(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
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

  // Maneja anchors (#section) y rutas absolutas (/path) de forma transparente.
  // Si estamos en una ruta != "/" y el link es un anchor, navegamos primero al
  // home y después scrolleamos.
  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    if (!isAnchor(href)) {
      navigate(href);
      return;
    }

    if (location.pathname !== '/') {
      // Vamos al home y delegamos el scroll a un microtask después del navigate.
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Alias para mantener compatibilidad con call sites previos.
  const scrollToSection = handleNavClick;

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
                const isActive = isAnchor(link.href)
                  ? location.pathname === '/' && activeSection === link.href.substring(1)
                  : location.pathname === link.href;
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
                <BookingButton
                  source="nav"
                  label="Agendar"
                  variant={isScrolled ? 'navCompact' : 'navHero'}
                  icon={false}
                />
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
                    handleNavClick(link.href);
                  }}
                  className={`block py-1.5 text-xl font-black transition-colors ${
                    (isAnchor(link.href)
                      ? location.pathname === '/' && activeSection === link.href.substring(1)
                      : location.pathname === link.href)
                      ? 'text-accent'
                      : 'text-foreground/90 dark:text-white/90 hover:text-accent'
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

              <BookingButton
                source="nav_mobile"
                label="Agendar consulta"
                variant="mobile"
                icon={false}
              />
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

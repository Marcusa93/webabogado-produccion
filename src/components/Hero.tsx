import { useState, useEffect } from 'react';
import { MessageCircle, Scale, ChevronDown } from 'lucide-react';
import PixelatedScale from './PixelatedScale';
import DigitalTerminal from './DigitalTerminal';
import ThreeBackground from './ThreeBackground';

export default function Hero() {
  const [terminalDone, setTerminalDone] = useState(false);
  const [explodeParticles, setExplodeParticles] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const handleTerminalComplete = () => {
    // Trigger explosion first
    setExplodeParticles(true);
    // Then minimize terminal after short delay
    setTimeout(() => setTerminalDone(true), 800);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show WhatsApp button after scrolling past 100vh
      if (window.scrollY > window.innerHeight) {
        setShowWhatsApp(true);
      } else {
        setShowWhatsApp(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 md:px-0 transition-colors duration-500"
    >
      {/* 3D Background Resource */}
      <ThreeBackground />

      {/* Floating WhatsApp Button (Fixed) */}
      <a
        href="https://wa.me/5493813007791"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-8 right-8 z-[100] flex items-center justify-center w-[60px] h-[60px] bg-[#25D366] rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:bg-[#20ba5a] group ${showWhatsApp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        aria-label="Consulta rápida por WhatsApp"
      >
        <div className="absolute inset-0 rounded-full animate-[pulse_2s_infinite] bg-[#25D366] opacity-30 z-[-1]" />
        <MessageCircle size={32} className="text-white fill-white" />

        {/* Tooltip on hover */}
        <div className="absolute right-full mr-4 px-3 py-1 bg-card text-foreground text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-foreground/10">
          Consulta rápida
        </div>
      </a>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-[1]" />
      <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-accent/10 via-transparent to-transparent blur-[120px] z-[1]" />

      {/* Grid Overlay (Subtle) */}
      <div className="absolute inset-0 tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 z-[1]" />

      {/* Content */}
      <div className="relative z-10 section-container py-32 md:py-40 lg:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start px-4 sm:px-6 lg:px-0">
            {/* Tagline / Microcopy */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8 opacity-0 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-accent-foreground/90 uppercase">
                Derecho · Tecnología · Estrategia
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] lg:text-7xl font-black text-foreground leading-[1.1] mb-8 md:mb-10 opacity-0 animate-fade-in-up animation-delay-200 max-w-4xl">
              Marco Rossi. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Abogado</span> que defiende tus derechos en la era digital.
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg lg:text-xl text-foreground/70 max-w-2xl mb-10 md:mb-12 opacity-0 animate-fade-in animation-delay-400 leading-relaxed font-normal">
              Los conflictos actuales requieren una visión multidisciplinaria. Nuestra experiencia dentro de la Justicia y el dominio de la tecnología nos permiten construir defensas invulnerables en entornos digitales complejos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 w-full sm:w-auto opacity-0 animate-fade-in animation-delay-500">
              {/* Primary Button */}
              <button
                onClick={() => scrollToSection('#contacto')}
                className="btn-interactive w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-accent hover:text-white transition-all duration-300 shadow-lg group text-base"
              >
                <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                Agendar consulta
              </button>

              {/* Secondary Button */}
              <button
                onClick={() => scrollToSection('#especialidades')}
                className="btn-interactive w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-bold rounded-xl border-2 border-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-lg group text-base"
              >
                <Scale size={20} className="group-hover:scale-110 transition-transform" />
                Conocé más
              </button>
            </div>
          </div>

          {/* Right: Hybrid Hero (Terminal + Particles) */}
          <div className="relative mt-16 lg:mt-0 flex items-center justify-center lg:justify-end perspective-1000 h-[400px] md:h-[500px] lg:h-auto z-0 px-4 sm:px-0">
            <div className="w-full max-w-[300px] h-[400px] md:max-w-[480px] md:h-[580px] xl:max-w-[560px] xl:h-[700px] relative flex flex-col items-center justify-center">

              {/* Layer 2: Digital Console (Foreground) */}
              <div
                className={`relative z-20 w-full transform transition-all duration-1000 ease-in-out ${terminalDone
                  ? 'opacity-0 scale-75 translate-y-10 pointer-events-none'
                  : 'opacity-100 scale-100 md:scale-95 xl:scale-100'
                  } mb-8 md:mb-12`}
              >
                <DigitalTerminal onComplete={handleTerminalComplete} />
              </div>

              {/* Layer 1: Ambient Particles (Background -> Foreground with Explosion) */}
              <div
                className={`absolute z-10 w-[500px] h-[500px] pointer-events-none flex items-center justify-center transition-all duration-1000 ease-in-out ${terminalDone
                  ? 'bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 scale-110 opacity-100 blur-0'
                  : 'bottom-[-60px] md:bottom-[-20px] xl:bottom-[0px] left-1/2 -translate-x-1/2 scale-[0.6] opacity-30 blur-[1px]'
                  }`}
              >
                <PixelatedScale triggerExplosion={explodeParticles} />
              </div>

            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <button
            onClick={() => {
              const nextSection = document.getElementById('que-esperar');
              if (nextSection) {
                const top = nextSection.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] text-foreground uppercase">Explorar</span>
            <div className="w-5 h-8 rounded-full border-2 border-foreground/30 flex justify-center p-1">
              <div className="w-1 h-3 bg-foreground/50 rounded-full animate-scroll" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

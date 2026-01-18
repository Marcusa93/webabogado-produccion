import { useState, useEffect } from 'react';
import { ArrowDown, MessageCircle, ChevronRight } from 'lucide-react';
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-deep px-4 md:px-0"
    >
      {/* 3D Background Resource */}
      <ThreeBackground />

      {/* Floating WhatsApp Button (Fixed) */}
      <a
        href="https://wa.me/5493813007791"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-8 right-8 z-[100] flex items-center justify-center w-[60px] h-[60px] rounded-full shadow-2xl transition-all duration-500 hover:scale-110 group ${showWhatsApp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        style={{
          backgroundColor: 'var(--whatsapp-green)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--whatsapp-green-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--whatsapp-green)'}
        aria-label="Consulta rápida por WhatsApp"
      >
        <div className="absolute inset-0 rounded-full animate-[pulse_2s_infinite] opacity-30 z-[-1]"
             style={{ backgroundColor: 'var(--whatsapp-green)' }} />
        <MessageCircle size={32} className="text-white fill-white" />

        {/* Tooltip on hover */}
        <div className="absolute right-full mr-4 px-3 py-1 bg-white text-navy-deep text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Consulta rápida
        </div>
      </a>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/40 via-transparent to-navy-deep z-[1]" />
      <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-accent/10 via-transparent to-transparent blur-[120px] z-[1]" />

      {/* Grid Overlay (Subtle) */}
      <div className="absolute inset-0 tech-grid-dark opacity-10 z-[1]" />

      {/* Content */}
      <div className="relative z-10 section-container py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Tagline / Microcopy */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8 opacity-0 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-accent-foreground/90 uppercase">
                Derecho · Tecnología · Estrategia
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[clamp(2rem,10vw,4.5rem)] lg:text-7xl font-black text-white leading-[1.1] mb-6 md:mb-8 opacity-0 animate-fade-in-up animation-delay-200">
              Marco Rossi. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Abogado</span> que defiende tus derechos en la era digital.
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-xl lg:text-2xl text-white/60 max-w-3xl mb-8 md:mb-12 opacity-0 animate-fade-in animation-delay-400 leading-relaxed font-medium">
              Los conflictos actuales requieren una visión multidisciplinaria. Nuestra experiencia dentro de la Justicia y el dominio de la tecnología nos permiten construir defensas invulnerables en entornos digitales complejos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto opacity-0 animate-fade-in animation-delay-500">
              <button
                onClick={() => scrollToSection('#contacto')}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-4 md:px-10 md:py-5 bg-white text-navy-deep font-black rounded-xl hover:bg-ice transition-all duration-500 shadow-strong hover:scale-[1.02] group text-sm md:text-base tap-target-enhanced"
              >
                <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                Agendar consulta
              </button>
            </div>
          </div>

          {/* Right: Hybrid Hero (Terminal + Particles) */}
          <div className="relative mt-12 lg:mt-0 flex items-center justify-center lg:justify-end perspective-1000 h-[400px] md:h-[500px] lg:h-auto z-0">
            <div className="w-[300px] h-[400px] md:w-[480px] md:h-[580px] xl:w-[560px] xl:h-[700px] relative flex flex-col items-center justify-center">

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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-700 hidden md:block">
          <button
            onClick={() => scrollToSection('#que-hago')}
            className="group flex flex-col items-center gap-3 text-white/20 hover:text-white transition-all duration-500"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-50 group-hover:opacity-100">Explorar</span>
            <div className="h-10 w-6 rounded-full border-2 border-white/10 flex justify-center p-1 group-hover:border-accent">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

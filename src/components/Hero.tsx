import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import PixelatedScale from './PixelatedScale';
import DigitalTerminal from './DigitalTerminal';
import ThreeBackground from './ThreeBackgroundLazy';
import Magnetic from './Magnetic';
import BookingButton from './BookingButton';
import { whatsappUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/lib/analytics';

export default function Hero() {
  const [terminalDone, setTerminalDone] = useState(false);
  const [explodeParticles, setExplodeParticles] = useState(false);
  // Sticky CTA bar aparece después de scrollear el primer viewport — combina
  // Reservar (CTA primario) + WhatsApp (acción rápida secundaria).
  const [showStickyCta, setShowStickyCta] = useState(false);

  const handleTerminalComplete = () => {
    // Trigger explosion first
    setExplodeParticles(true);
    // Then minimize terminal after short delay
    setTimeout(() => setTerminalDone(true), 800);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el sticky CTA bar después del primer viewport.
      setShowStickyCta(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 md:px-0 transition-colors duration-500"
    >
      {/* 3D Background Resource */}
      <ThreeBackground />

      {/* Sticky CTA Bar (post-scroll)
          Mobile: full-width fija al fondo, dos elementos.
          Desktop: cluster compacto bottom-right con Reservar + WhatsApp.
          La idea: que la acción dominante post-scroll sea reservar, no chatear. */}
      <div
        className={`fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-40 flex items-center gap-2 transition-all duration-500 ${
          showStickyCta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <BookingButton
          source="sticky"
          label="Reservar 20 min sin cargo"
          variant="primary"
          icon={true}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-foreground text-background font-black rounded-2xl text-sm sm:text-base shadow-2xl hover:bg-accent hover:text-white transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10"
        />
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('sticky')}
          className="shrink-0 flex items-center justify-center w-[52px] h-[52px] sm:w-[54px] sm:h-[54px] rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ring-1 ring-black/5"
          style={{ backgroundColor: 'var(--whatsapp-green)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--whatsapp-green-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--whatsapp-green)')}
          aria-label="Pregunta rápida por WhatsApp"
        >
          <MessageCircle size={24} className="text-white fill-white" />
        </a>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-[1]" />
      <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-accent/10 via-transparent to-transparent blur-[120px] z-[1]" />

      {/* Grid Overlay (Subtle) */}
      <div className="absolute inset-0 tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 z-[1]" />

      {/* Content */}
      <div className="relative z-10 section-container pt-28 pb-20 md:py-40 lg:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start sm:px-6 lg:px-0">
            {/* Tagline / Microcopy */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6 md:mb-8">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] md:text-xs font-bold tracking-[0.15em] text-accent uppercase">
                Estudio jurídico en Tucumán
              </span>
            </div>

            {/* Visible desde el primer frame: es el elemento LCP del home. */}
            <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] lg:text-7xl font-black text-foreground leading-[1.1] mb-6 md:mb-10 max-w-4xl">
              Defendemos tu caso con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">
                estrategia y prueba sólida.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg lg:text-xl text-foreground/70 font-semibold max-w-2xl mb-8 md:mb-12 leading-relaxed">
              Laboral y ART · Civil y daños · Penal · Empresas · Derecho digital
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Primary Button — opens Cal.com booking modal */}
              <Magnetic>
                <BookingButton
                  source="hero"
                  label="Consulta gratis · 20 min"
                  variant="primary"
                />
              </Magnetic>

              <Magnetic>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('hero')}
                  className="btn-interactive w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-all duration-300 text-base bg-[var(--whatsapp-green)] hover:bg-[var(--whatsapp-green-hover)]"
                >
                  <MessageCircle size={20} className="fill-white" />
                  Escribinos por WhatsApp
                </a>
              </Magnetic>
            </div>

            <p className="mt-5 text-xs md:text-sm text-foreground/50 font-medium leading-relaxed text-center lg:text-left max-w-md mx-auto lg:mx-0">
              Sin compromiso · Por videollamada
            </p>
          </div>

          {/* Right: Hybrid Hero (Terminal + Particles) — solo desktop, en mobile empujaba los CTA fuera de pantalla */}
          <div className="relative hidden lg:flex items-center justify-end perspective-1000 z-0">
            <div className="w-[min(90vw,300px)] h-[400px] md:w-[480px] md:h-[580px] xl:w-[560px] xl:h-[700px] relative flex flex-col items-center justify-center">

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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
          <button
            onClick={() => {
              const nextSection = document.getElementById('especialidades');
              if (nextSection) {
                const top = nextSection.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Explorar contenido - desplazar hacia abajo"
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

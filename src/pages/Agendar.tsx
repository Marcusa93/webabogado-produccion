import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Shield, Clock, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { trackAgendarPageViewed, trackBookingCompleted } from '@/lib/analytics';

const CALCOM_USERNAME = import.meta.env.VITE_CALCOM_USERNAME?.trim() || '';
const CALCOM_INITIAL_EVENT =
  import.meta.env.VITE_CALCOM_INITIAL_EVENT?.trim() || 'consulta-inicial';

const isConfigured = Boolean(CALCOM_USERNAME);
const NAMESPACE = 'agendar-page';

const PAGE_TITLE = 'Agendar consulta — Estudio Dr. Marco Rossi';
const PAGE_DESCRIPTION =
  'Elegí día y horario para tu consulta inicial. Recibís confirmación por mail con el link de la videollamada.';

export default function Agendar() {
  useEffect(() => {
    trackAgendarPageViewed();

    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    let metaDescription = document.querySelector('meta[name="description"]');
    let createdMeta = false;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
      createdMeta = true;
    }
    const previousDescription = metaDescription.getAttribute('content') || '';
    metaDescription.setAttribute('content', PAGE_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (createdMeta) {
        metaDescription.parentNode?.removeChild(metaDescription);
      } else if (previousDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, []);

  useEffect(() => {
    if (!isConfigured) return;

    let isActive = true;
    let completed = false;

    (async () => {
      try {
        const cal = await getCalApi({ namespace: NAMESPACE });
        if (!isActive) return;

        cal('ui', {
          theme: 'light',
          cssVarsPerTheme: {
            light: { 'cal-brand': '#0a1929' },
            dark: { 'cal-brand': '#0a1929' },
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });

        cal('on', {
          action: 'bookingSuccessful',
          callback: () => {
            if (completed) return;
            completed = true;
            trackBookingCompleted('agendar_page', CALCOM_INITIAL_EVENT);
          },
        });
      } catch (err) {
        console.error('[Agendar] Cal.com embed init failed:', err);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-32 pb-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] md:text-xs font-bold tracking-[0.15em] text-accent uppercase">
                Reserva directa
              </span>
            </div>

            <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-black text-foreground leading-[1.1] mb-6">
              Agendá tu consulta
            </h1>

            <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              Elegí el día y horario que mejor te queda. Confirmación inmediata por mail con
              el link de la videollamada y un recordatorio antes del turno.
            </p>
          </div>

          {/* Lo que incluye la consulta */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[
              {
                icon: Clock,
                title: 'Sin cargo',
                desc: 'La consulta inicial es gratuita y sin compromiso.',
              },
              {
                icon: MessageCircle,
                title: '30 minutos',
                desc: 'Análisis fáctico, técnico y jurídico de tu caso.',
              },
              {
                icon: Shield,
                title: 'Confidencialidad',
                desc: 'Todo lo que conversemos queda entre nosotros.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card p-5 rounded-2xl border-2 border-foreground/10 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-accent mb-3">
                  <item.icon size={20} />
                </div>
                <h3 className="font-black text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-foreground/60 text-xs font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Embed Cal.com */}
          <div className="max-w-5xl mx-auto">
            {isConfigured ? (
              <div className="bg-card rounded-3xl border border-foreground/5 shadow-lg overflow-hidden">
                <Cal
                  namespace={NAMESPACE}
                  calLink={`${CALCOM_USERNAME}/${CALCOM_INITIAL_EVENT}`}
                  style={{ width: '100%', height: '100%', minHeight: '720px' }}
                  config={{
                    layout: 'month_view',
                    theme: 'light',
                  }}
                />
              </div>
            ) : (
              <div className="bg-card rounded-3xl border border-foreground/10 p-12 text-center">
                <Clock className="mx-auto text-foreground/30 mb-4" size={32} />
                <h2 className="text-xl font-black text-foreground mb-2">
                  Próximamente
                </h2>
                <p className="text-foreground/60 max-w-md mx-auto mb-6">
                  Estamos terminando de configurar el sistema de reservas. Mientras
                  tanto, podés contactarnos directamente.
                </p>
                <a
                  href="/#contacto"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-accent hover:text-white transition-colors"
                >
                  <MessageCircle size={18} />
                  Ir al formulario de contacto
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

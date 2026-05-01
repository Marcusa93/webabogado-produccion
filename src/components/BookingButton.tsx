import { useState, useEffect, useRef } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Calendar, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { trackBookingModalOpened, trackBookingCompleted } from '@/lib/analytics';

const CALCOM_USERNAME = import.meta.env.VITE_CALCOM_USERNAME?.trim() || '';
const CALCOM_INITIAL_EVENT =
  import.meta.env.VITE_CALCOM_INITIAL_EVENT?.trim() || 'consulta-inicial';

const isConfigured = Boolean(CALCOM_USERNAME);

type Variant = 'primary' | 'secondary' | 'navCompact' | 'navHero' | 'mobile';

type BookingButtonProps = {
  source: string; // 'hero' | 'contacto' | 'nav' | etc.
  label?: string;
  eventSlug?: string;
  variant?: Variant;
  className?: string;
  icon?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    'btn-interactive w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-accent hover:text-white transition-all duration-300 shadow-lg group text-base',
  secondary:
    'btn-interactive w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-bold rounded-xl border-2 border-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-lg group text-base',
  navCompact:
    'btn-interactive inline-flex items-center rounded-xl text-xs font-black transition-all duration-500 px-5 py-2.5 bg-accent text-white hover:bg-accent-light',
  navHero:
    'btn-interactive inline-flex items-center rounded-xl text-xs font-black transition-all duration-500 px-6 py-3 bg-foreground text-background hover:bg-accent hover:text-white shadow-lg',
  mobile:
    'inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-accent text-white font-black rounded-xl text-lg shadow-glow active:scale-95',
};

export default function BookingButton({
  source,
  label = 'Agendar consulta',
  eventSlug,
  variant = 'primary',
  className,
  icon = true,
}: BookingButtonProps) {
  const [open, setOpen] = useState(false);
  const slug = eventSlug || CALCOM_INITIAL_EVENT;
  const calNamespace = `${source}-${slug}`;
  const completedRef = useRef(false);

  useEffect(() => {
    if (!open || !isConfigured) return;

    let isActive = true;
    completedRef.current = false;

    (async () => {
      try {
        const cal = await getCalApi({ namespace: calNamespace });
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
            if (completedRef.current) return;
            completedRef.current = true;
            trackBookingCompleted(source, slug);
          },
        });
      } catch (err) {
        console.error('[BookingButton] Cal.com embed init failed:', err);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [open, calNamespace, source, slug]);

  const handleOpen = () => {
    if (!isConfigured) {
      console.warn('[BookingButton] VITE_CALCOM_USERNAME not configured.');
      return;
    }
    trackBookingModalOpened(source);
    setOpen(true);
  };

  // Sin config: el botón se renderiza pero te lleva al fallback (#contacto).
  if (!isConfigured) {
    return (
      <a
        href="#contacto"
        onClick={(e) => {
          e.preventDefault();
          const el = document.querySelector('#contacto');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className={className || variantClasses[variant]}
      >
        {icon && <Calendar size={18} className="group-hover:rotate-6 transition-transform" />}
        {label}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={className || variantClasses[variant]}
        aria-haspopup="dialog"
      >
        {icon && <Calendar size={18} className="group-hover:rotate-6 transition-transform" />}
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[960px] w-[95vw] h-[85vh] sm:h-[90vh] p-0 overflow-hidden bg-card">
          <DialogTitle className="sr-only">Agendar consulta</DialogTitle>
          <DialogDescription className="sr-only">
            Elegí día y horario para tu consulta. Recibís confirmación por mail.
          </DialogDescription>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>

          <div className="w-full h-full overflow-auto bg-background">
            <Cal
              key={calNamespace}
              namespace={calNamespace}
              calLink={`${CALCOM_USERNAME}/${slug}`}
              style={{ width: '100%', height: '100%', minHeight: '600px', overflow: 'auto' }}
              config={{
                layout: 'month_view',
                theme: 'light',
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

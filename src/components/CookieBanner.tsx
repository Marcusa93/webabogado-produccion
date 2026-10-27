import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsent, setConsent, onConsentPreferencesOpen, type Consent } from '@/lib/consent';

export default function CookieBanner() {
  const [open, setOpen] = useState(() => getConsent() === null);

  useEffect(() => onConsentPreferencesOpen(() => setOpen(true)), []);

  if (!open) return null;

  const choose = (value: Consent) => {
    setOpen(false);
    setConsent(value);
  };

  return (
    <section
      aria-label="Preferencias de cookies"
      className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-md z-50 p-5 rounded-2xl bg-card border border-foreground/10 shadow-2xl"
    >
      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
        Usamos cookies de analítica (Google Analytics y Microsoft Clarity) para entender cómo se usa el
        sitio y mejorarlo. Solo se activan si aceptás.{' '}
        <Link to="/privacidad" className="font-bold text-accent hover:underline">
          Más información
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="flex-1 px-4 py-2.5 rounded-xl border border-foreground/15 text-sm font-bold text-foreground hover:bg-foreground/5 transition-colors"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="flex-1 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-accent hover:text-white transition-colors"
        >
          Aceptar
        </button>
      </div>
    </section>
  );
}

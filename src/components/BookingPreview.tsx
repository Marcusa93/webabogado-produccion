import { useEffect, useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import BookingButton from './BookingButton';

// Componente que muestra los próximos 3 slots disponibles inline,
// fetched desde /api/cal-slots (que cachea 5 min). Cada slot abre el
// modal de Cal.com pre-seleccionado en ese horario, saltando el paso
// de elegir fecha/hora en el calendario.
//
// Failure mode: si el endpoint devuelve vacío (sin slots, error de
// Cal.com, etc.), el componente se esconde (return null) — el visitante
// siempre tiene el CTA principal "Reservar" que abre el calendario completo.

type Slot = { time: string };

type SlotsResponse = {
  ok: boolean;
  slots?: Slot[];
  error?: string;
};

const TIMEZONE = 'America/Argentina/Buenos_Aires';

function formatSlotShort(iso: string): { day: string; time: string; full: string } {
  const date = new Date(iso);
  const day = date.toLocaleString('es-AR', {
    timeZone: TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const time = date.toLocaleString('es-AR', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
  // Day viene como "lun. 6 may." — sacamos puntos y capitalizamos
  const dayClean = day.replace(/\./g, '').replace(/^\w/, (c) => c.toUpperCase());
  const full = `${dayClean} · ${time}`;
  return { day: dayClean, time, full };
}

export default function BookingPreview() {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch('/api/cal-slots')
      .then((r) => r.json() as Promise<SlotsResponse>)
      .then((data) => {
        if (!alive) return;
        if (data.ok && Array.isArray(data.slots) && data.slots.length > 0) {
          setSlots(data.slots);
        } else {
          setSlots([]);
        }
      })
      .catch(() => {
        if (alive) setSlots([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Skeleton mientras carga
  if (loading) {
    return (
      <div className="rounded-2xl bg-foreground/5 border border-foreground/10 p-5 mb-5">
        <p className="text-[10px] font-bold tracking-[0.2em] text-foreground/50 uppercase mb-3">
          Próximos turnos disponibles
        </p>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-foreground/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Sin slots: no rendering. El CTA principal "Reservar" sigue ahí.
  if (!slots || slots.length === 0) return null;

  return (
    <div className="rounded-2xl bg-foreground/5 border border-foreground/10 p-5 mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold tracking-[0.2em] text-foreground/55 uppercase inline-flex items-center gap-2">
          <Calendar size={12} className="text-accent" />
          Próximos turnos disponibles
        </p>
        <span className="text-[9px] font-bold tracking-wider text-foreground/40 uppercase">
          30 min · Sin cargo
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {slots.slice(0, 3).map((slot) => {
          const { day, time } = formatSlotShort(slot.time);
          return (
            <BookingButton
              key={slot.time}
              source="preview"
              slotIso={slot.time}
              variant="primary"
              icon={false}
              label=""
              className="group flex items-center justify-between gap-4 px-4 py-3 bg-card hover:bg-foreground hover:text-background border border-foreground/10 hover:border-foreground rounded-xl transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Clock
                  size={16}
                  className="text-accent shrink-0 group-hover:text-background transition-colors"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-foreground group-hover:text-background transition-colors truncate">
                    {day}
                  </span>
                  <span className="text-xs text-foreground/55 group-hover:text-background/70 transition-colors">
                    {time}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-foreground/40 group-hover:text-background group-hover:translate-x-0.5 transition-all shrink-0"
              />
            </BookingButton>
          );
        })}
      </div>

      <p className="text-[10px] text-foreground/45 font-medium mt-3 text-center">
        Click en un horario para reservarlo · Confirmación inmediata
      </p>
    </div>
  );
}

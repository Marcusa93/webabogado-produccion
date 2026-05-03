// Microsoft Clarity loader.
// Heatmaps + session recordings, gratis y sin límite.
//
// Setup:
//   1) Crear proyecto en clarity.microsoft.com (login con cuenta Microsoft).
//   2) Pegar la URL del sitio (https://www.marcorossi.com.ar).
//   3) Copiar el "Project ID" (string corto tipo "abc123xyz").
//   4) Cargar VITE_CLARITY_PROJECT_ID en Vercel (Production + Preview).
//   5) Redeploy para que el env var entre al bundle.
//
// El script de Clarity es liviano (~10KB), async, no bloquea render.

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initClarity(projectId: string): void {
  if (typeof window === 'undefined') return;
  if (initialized) return;
  if (!projectId || !projectId.trim()) return;

  initialized = true;

  // Snippet oficial de Clarity, traducido a TS.
  // Crea window.clarity como cola de eventos hasta que cargue el script real.
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] =
      c[a] ||
      function (...args: unknown[]) {
        (c[a].q = c[a].q || []).push(args);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode?.insertBefore(t, y);
  })(window, document, 'clarity', 'script', projectId.trim());
}

// Tag custom (opcional) para segmentar sesiones por característica del visitante.
// Ej: trackClarityTag('user_type', 'returning')
export function trackClarityTag(key: string, value: string): void {
  if (typeof window === 'undefined' || !window.clarity) return;
  window.clarity('set', key, value);
}

// Identifica al usuario (opcional, útil si tenemos auth).
// CUIDADO: no pasar PII (nombres reales, emails). Usar IDs hasheados.
export function identifyClarity(userId: string): void {
  if (typeof window === 'undefined' || !window.clarity) return;
  window.clarity('identify', userId);
}

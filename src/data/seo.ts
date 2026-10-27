// Sin imports: vite.config.ts lo lee en el build para pre-renderizar el <head> de cada página.

export const SITE_URL = 'https://www.marcorossi.com.ar';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
}

export const pagesMeta = {
  agendar: {
    path: '/agendar',
    title: 'Agendar consulta — Estudio Dr. Marco Rossi',
    description:
      'Elegí día y horario para tu consulta inicial. Recibís confirmación por mail con el link de la videollamada.',
  },
  herramientas: {
    path: '/herramientas',
    title: 'Herramientas para clientes — Estudio Dr. Marco Rossi',
    description:
      'Kit de herramientas tácticas de uso inmediato: preservación de evidencia digital, check de contratos para influencers, detección de phishing y hasher criptográfico.',
  },
  sobreMi: {
    path: '/sobre-mi',
    title: 'Sobre Marco Rossi — Trayectoria, libros y presencia pública',
    description:
      'Doctor Honoris Causa por la Federación Iberoamericana de Abogados. Director de DYNTEC (UNT). Trayectoria, libros publicados, entrevistas, conferencias y presencia en medios.',
  },
  privacidad: {
    path: '/privacidad',
    title: 'Política de Privacidad — Estudio Dr. Marco Rossi',
    description:
      'Política de privacidad del Estudio Dr. Marco Rossi conforme a la Ley 25.326 de Protección de Datos Personales de la República Argentina. Cómo recolectamos, usamos y protegemos los datos personales de quienes interactúan con el sitio.',
  },
} satisfies Record<string, PageMeta>;

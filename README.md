# Marco Rossi - Abogado Digital e IA

Sitio web profesional del Dr. Marco Rossi, abogado especialista en derecho digital e inteligencia artificial.

## 🚀 Tecnologías

- **React 18** + TypeScript
- **Vite** para desarrollo y build
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **Three.js** para efectos 3D
- **Vercel Functions** (`api/`) para formulario de contacto, webhooks de Cal.com y recordatorios

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔗 URLs

- **Desarrollo**: http://localhost:8080
- **Producción**: https://marcorossi.com.ar

## 📁 Estructura

```
api/                 # Vercel Functions (contacto, Cal.com, cron de recordatorios)
src/
├── assets/          # Logos y recursos estáticos
├── components/      # Componentes reutilizables
├── data/            # Contenido estático (multimedia)
├── hooks/           # Hooks de React
├── lib/             # Utilidades, emails, analytics
└── pages/           # Páginas de la aplicación
```

## 🔐 Variables de Entorno

```env
# Frontend (públicas)
VITE_CALCOM_USERNAME=
VITE_CALCOM_INITIAL_EVENT=
VITE_GA4_MEASUREMENT_ID=
VITE_CLARITY_PROJECT_ID=

# Servidor (api/)
RESEND_API_KEY=
CONTACT_INBOX=
CAL_WEBHOOK_SECRET=
CALCOM_API_KEY=
CALCOM_EVENT_TYPE_ID=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
CRON_SECRET=
```

## 📄 Licencia

Todos los derechos reservados © Marco Rossi

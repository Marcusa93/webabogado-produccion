# Marco Rossi - Abogado Digital

Sitio web profesional para servicios legales especializados en derecho digital, inteligencia artificial y tecnología.

## 🎯 Proyecto

**Cliente:** Marco Rossi - Abogado Digital
**Target:** Influencers, empresas tech y particulares en Tucumán, Argentina
**Especialización:** Derecho digital, IA, prueba electrónica, cibercrimen

## 📚 Documentación

### Guías de Configuración
- **[ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md)** - Configuración de Google Analytics 4 y GTM
- **[GTM_TAGS_GUIDE.md](./GTM_TAGS_GUIDE.md)** - Cómo agregar tags adicionales (Facebook, LinkedIn, Hotjar)
- **[PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)** - Optimización de performance y velocidad
- **[PRIVACY_POLICY_TEMPLATE.md](./PRIVACY_POLICY_TEMPLATE.md)** - Plantilla de política de privacidad

### Características Implementadas
✅ **SEO Completo**
- Meta tags optimizados para "abogado digital tucumán"
- Schema.org structured data para Google Rich Results
- Open Graph y Twitter Cards para redes sociales
- Sitemap.xml y robots.txt

✅ **Analytics y Tracking**
- Google Tag Manager (GTM-NRWQGPW5)
- Google Analytics 4 con eventos personalizados
- Tracking de conversiones (consultas, WhatsApp, formularios)
- Scroll depth tracking

✅ **Performance**
- Code splitting (-40% bundle size)
- Lazy loading inteligente de imágenes
- Three.js solo en desktop
- Score esperado: 90+ mobile, 95+ desktop

✅ **UI/UX**
- Diseño responsive mobile-first
- Animaciones optimizadas
- Background 3D interactivo (desktop)
- Botón scroll-to-top
- WhatsApp floating button

## Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
## 🛠️ Herramientas Exclusivas (Legal-Tech)

El sitio cuenta con una sección de herramientas avanzadas para clientes y profesionales:
- **Hasheador Online**: Generación local de huellas digitales para preservación de prueba.
- **Optimizador COTIO**: Optimizador de prompts jurídicos basado en la metodología de *Justicia Algorítmica*.

---

## 🔐 Configuración de Seguridad y API

La herramienta **COTIO** requiere conexión con Google Gemini API. Por seguridad, la API Key se maneja **estrictamente en el lado del servidor** (Netlify Functions).

### Requerimientos de Entorno
Debés configurar las siguientes variables en tu panel de Netlify (Settings > Build & Deploy > Environment) o en un archivo `.env` local:

| Variable | Valor / Ejemplo | Descripción |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSy...` | Tu API Key de Google AI Studio. |
| `GEMINI_MODEL` | `gemini-1.5-flash` | Modelo a utilizar (recomendado: flash para velocidad). |

> [!IMPORTANT]
> Nunca subas el archivo `.env` al repositorio. El archivo ya está incluido en el `.gitignore` para prevenir filtraciones.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

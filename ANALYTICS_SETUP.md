# Google Analytics 4 y Google Tag Manager - Configuración

Este sitio web está configurado con:
- **Google Tag Manager (GTM)** - ID: `GTM-NRWQGPW5` ✅ ACTIVO
- **Google Analytics 4 (GA4)** - Para trackear comportamiento de usuarios y conversiones

GTM actúa como contenedor que gestiona todos los tags de analytics, permitiendo agregar/modificar tracking sin cambiar código.

## 🎯 Google Tag Manager (GTM) - YA CONFIGURADO

### ✅ Estado Actual

Google Tag Manager ya está instalado en el sitio con el ID: **GTM-NRWQGPW5**

**Ubicación del código:**
- Script principal: `index.html` línea 40-45 (en `<head>`)
- Fallback noscript: `index.html` línea 208-210 (después de `<body>`)

### ¿Qué es GTM y por qué es mejor?

**Google Tag Manager** es un contenedor de tags que te permite:
- ✅ Gestionar GA4, Facebook Pixel, LinkedIn Insight Tag desde una interfaz
- ✅ Agregar/modificar tracking sin cambiar código del sitio
- ✅ Publicar cambios instantáneamente sin re-deployar
- ✅ Crear triggers y variables personalizadas
- ✅ Versionar cambios y hacer rollback fácilmente

**Ventaja:** Ya no necesitas editar código para agregar tracking. Todo se hace desde [tagmanager.google.com](https://tagmanager.google.com).

### Acceder a GTM

1. Ve a [https://tagmanager.google.com/](https://tagmanager.google.com/)
2. Busca el contenedor **GTM-NRWQGPW5**
3. Desde ahí puedes agregar tags de GA4, Facebook, LinkedIn, etc.

---

## 🔧 Configuración de Google Analytics 4 (a través de GTM)

### Paso 1: Crear cuenta de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una cuenta si no tienes una
3. Crea una nueva **Propiedad** (Property)
4. Selecciona **GA4** (Google Analytics 4)
5. Completa los datos:
   - **Nombre de la propiedad:** Marco Rossi Abogado
   - **Zona horaria:** Argentina (GMT-3)
   - **Moneda:** Peso Argentino (ARS)

### Paso 2: Obtener el Measurement ID

1. En tu propiedad, ve a **Admin** (⚙️ en la parte inferior izquierda)
2. En la columna "Property", haz click en **Data Streams**
3. Haz click en **Add stream** → **Web**
4. Completa:
   - **Website URL:** `https://marcorossi.com.ar` (o tu dominio)
   - **Stream name:** Marco Rossi Website
5. Copia el **Measurement ID** (formato: `G-XXXXXXXXXX`)

### Paso 3: Agregar GA4 a Google Tag Manager (RECOMENDADO)

**Opción A: A través de GTM (Recomendado - Sin código)**

1. Ve a [https://tagmanager.google.com/](https://tagmanager.google.com/)
2. Abre el contenedor **GTM-NRWQGPW5**
3. Click en **Tags** → **New**
4. Configurar tag:
   - **Tag Configuration:** Google Analytics: GA4 Configuration
   - **Measurement ID:** Pega tu `G-XXXXXXXXXX`
   - **Trigger:** All Pages
5. Click **Save** y luego **Submit** → **Publish**

**Listo!** GA4 ya está funcionando sin tocar código.

### Paso 3B: Configurar en código (Alternativa)

Si prefieres hacerlo en código en lugar de GTM:

Abre el archivo `/src/components/Analytics.tsx` y reemplaza:

```typescript
const MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your actual GA4 Measurement ID
```

Por:

```typescript
const MEASUREMENT_ID = 'G-TU_ID_AQUÍ'; // Tu Measurement ID real
```

También actualiza en `/src/lib/analytics.ts` la función `trackPageView`:

```typescript
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-TU_ID_AQUÍ', { // Cambia esto también
      page_path: url,
    });
  }
};
```

**Nota:** Si usas GTM (Opción A), estos archivos son opcionales pero siguen funcionando para eventos personalizados.

## 📊 Eventos Trackeados

### Eventos Automáticos

- **Scroll Depth:** Se trackea cuando los usuarios llegan al 25%, 50%, 75%, 100% de la página
- **Page Views:** Cada vez que se carga una página

### Eventos de Conversión

1. **`consultation_request`**
   - Se dispara cuando alguien hace click en WhatsApp o envía el formulario de contacto
   - **Valor:** 1 (puedes asignarle un valor monetario después)

2. **`contact_form_submit`**
   - Cuando alguien envía el formulario de contacto
   - **Método:** 'email'

3. **`whatsapp_click`**
   - Cada vez que hacen click en un botón de WhatsApp
   - **Location:** 'contact_section', 'footer', 'hero', 'floating_button'

4. **`email_click`**
   - Cuando hacen click en tu email
   - **Location:** 'footer', etc.

5. **`social_click`**
   - Clicks en redes sociales (LinkedIn, Instagram)
   - **Platform:** 'linkedin', 'instagram'
   - **Location:** 'footer', etc.

### Otros Eventos Disponibles

- `service_interest` - Cuando alguien muestra interés en un servicio
- `media_interaction` - Clicks en videos/podcasts
- `resource_download` - Descargas de recursos
- `outbound_click` - Clicks en links externos

## 🎯 Configurar Conversiones en GA4

Para marcar `consultation_request` como conversión principal:

1. En Google Analytics, ve a **Admin** → **Events**
2. Busca el evento `consultation_request`
3. Activa el toggle **"Mark as conversion"**

Esto te permitirá ver cuántas consultas generaste por semana/mes.

## 📈 Dashboards Recomendados

### 1. Tráfico General
- **Reports** → **Acquisition** → **Overview**
- Ve de dónde vienen tus visitantes (Google, redes sociales, directo)

### 2. Comportamiento
- **Reports** → **Engagement** → **Pages and screens**
- Qué secciones leen más

### 3. Conversiones
- **Reports** → **Monetization** → **Conversions**
- Cuántas consultas recibiste

### 4. Eventos Personalizados
- **Reports** → **Engagement** → **Events**
- Todos los eventos que trackeamos (WhatsApp, scroll, etc.)

## 🔍 Verificar que funciona

1. Después de configurar el Measurement ID, despliega el sitio
2. Visita tu sitio en modo incógnito
3. Ve a Google Analytics → **Reports** → **Realtime**
4. Deberías ver "1 user active now"
5. Haz click en WhatsApp, scrollea, etc.
6. Los eventos deberían aparecer en tiempo real

## 🚨 Troubleshooting

### No veo datos en tiempo real

- Verifica que el Measurement ID esté correcto (formato `G-XXXXXXXXXX`)
- Asegúrate de haber desplegado los cambios
- Desactiva bloqueadores de anuncios (uBlock, AdBlock)
- Abre la consola del navegador (F12) y busca errores

### Los eventos no aparecen

- Los eventos pueden tardar **24-48 horas** en aparecer en reportes (no en Realtime)
- Verifica en **Realtime** → **Event name** si están llegando
- Revisa la consola del navegador por errores de JavaScript

## 📱 Bonus: Google Search Console

Para mejorar el SEO, también configura:

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Agrega tu sitio
3. Verifica la propiedad
4. Sube el sitemap: `https://marcorossi.com.ar/sitemap.xml`
5. Linkea Search Console con Analytics para ver datos de búsqueda

## 🎓 Recursos

- [Documentación oficial de GA4](https://support.google.com/analytics/answer/9304153)
- [YouTube: Curso de GA4](https://www.youtube.com/results?search_query=google+analytics+4+tutorial+español)
- [Guía de conversiones](https://support.google.com/analytics/answer/9267568)

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo.

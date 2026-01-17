# Guía de Tags Adicionales para Google Tag Manager

Esta guía te muestra cómo agregar tags importantes para marketing y analytics desde GTM sin tocar código.

## 🎯 Tags Recomendados para Tu Sitio

### Prioridad Alta (Implementar ahora)
1. ✅ **Google Analytics 4** - Tracking básico
2. ✅ **Facebook Pixel** - Remarketing en Instagram/Facebook
3. ✅ **LinkedIn Insight Tag** - Ads para empresas tech/profesionales
4. ⭐ **Google Ads Conversion** - Si usas Google Ads

### Prioridad Media (Próximos meses)
5. 📊 **Hotjar** - Heatmaps y grabaciones de sesiones
6. 🔔 **Microsoft Clarity** - Analytics visual gratuito
7. 📈 **Meta Conversions API** - Tracking mejorado de Facebook

---

## 🔵 FACEBOOK PIXEL

### ¿Por qué agregarlo?
- Remarketing a visitantes en Facebook e Instagram
- Crear audiencias similares (lookalike)
- Medir conversiones de Facebook Ads
- **Muy útil** si promocionas servicios en redes sociales

### Paso 1: Obtener tu Pixel ID

1. Ve a [Facebook Business Manager](https://business.facebook.com/)
2. Click en **"Configuración de la Empresa"** → **"Orígenes de datos"** → **"Píxeles"**
3. Click **"Agregar"** → **"Crear un píxel"**
4. Dale nombre: "Marco Rossi Website"
5. Copia el **Pixel ID** (formato: `123456789012345`)

### Paso 2: Agregar en GTM

1. Ve a [tagmanager.google.com](https://tagmanager.google.com/)
2. Abre contenedor **GTM-NRWQGPW5**
3. Click **"Tags"** → **"New"**
4. Nombre: **"Facebook Pixel - Page View"**
5. Tag Configuration:
   - Tipo: **"Custom HTML"**
   - Pega este código (reemplaza `YOUR_PIXEL_ID`):

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->
```

6. Triggering: **"All Pages"**
7. Click **"Save"**

### Paso 3: Agregar Evento de Conversión (Consulta)

1. Click **"Tags"** → **"New"**
2. Nombre: **"Facebook Pixel - Lead (Consulta)"**
3. Tag Configuration:
   - Tipo: **"Custom HTML"**
   - Código:

```html
<script>
  fbq('track', 'Lead', {
    content_name: 'Consulta Inicial',
    content_category: 'Legal Services',
    value: 100.00,
    currency: 'ARS'
  });
</script>
```

4. Triggering: Crea un nuevo trigger:
   - Tipo: **"Custom Event"**
   - Event name: `consultation_request`
   - Click **"Save"**

5. Click **"Save"** en el tag

### Paso 4: Publicar

1. Click **"Submit"** (arriba derecha)
2. Nombre de versión: "Agregado Facebook Pixel"
3. Click **"Publish"**

---

## 🔷 LINKEDIN INSIGHT TAG

### ¿Por qué agregarlo?
- **MUY RECOMENDADO** para tu target (empresas tech, influencers profesionales)
- Remarketing en LinkedIn
- Tracking de conversiones de LinkedIn Ads
- Crear audiencias de profesionales

### Paso 1: Obtener Partner ID

1. Ve a [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager/)
2. Click en tu cuenta publicitaria
3. Click **"Account Assets"** → **"Insight Tag"**
4. Click **"Install my Insight Tag"**
5. Copia el **Partner ID** (número de 6-7 dígitos)

### Paso 2: Agregar en GTM

1. GTM → **"Tags"** → **"New"**
2. Nombre: **"LinkedIn Insight Tag"**
3. Tag Configuration:
   - Tipo: **"Custom HTML"**
   - Código (reemplaza `YOUR_PARTNER_ID`):

```html
<script type="text/javascript">
_linkedin_partner_id = "YOUR_PARTNER_ID";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script><script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=YOUR_PARTNER_ID&fmt=gif" />
</noscript>
```

4. Triggering: **"All Pages"**
5. Click **"Save"**

### Paso 3: Evento de Conversión

1. **"Tags"** → **"New"**
2. Nombre: **"LinkedIn Conversion - Consulta"**
3. Tag Configuration:
   - Tipo: **"Custom HTML"**
   - Código:

```html
<script type="text/javascript">
window.lintrk('track', { conversion_id: YOUR_CONVERSION_ID });
</script>
```

4. Triggering: Custom Event `consultation_request`
5. Click **"Save"**

**Nota:** El `conversion_id` lo obtienes creando una conversión en LinkedIn Campaign Manager.

---

## 📊 HOTJAR (Heatmaps y Grabaciones)

### ¿Por qué agregarlo?
- **Heatmaps** - Ver dónde hacen click los usuarios
- **Grabaciones** - Ver sesiones reales de usuarios
- **Feedback** - Encuestas y polls
- **GRATIS** hasta 35 sesiones/día

### Paso 1: Crear Cuenta

1. Ve a [hotjar.com](https://www.hotjar.com/)
2. Crea cuenta gratuita
3. Agrega tu sitio
4. Copia el **Site ID** (número de 6-7 dígitos)

### Paso 2: Agregar en GTM

1. GTM → **"Tags"** → **"New"**
2. Nombre: **"Hotjar Tracking Code"**
3. Tag Configuration:
   - Tipo: **"Custom HTML"**
   - Código (reemplaza `YOUR_SITE_ID`):

```html
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_SITE_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

4. Triggering: **"All Pages"**
5. Advanced Settings:
   - Tag firing options: **"Once per page"**
6. Click **"Save"** → **"Publish"**

---

## 🟢 MICROSOFT CLARITY (Alternativa Gratuita a Hotjar)

### ¿Por qué agregarlo?
- 100% **GRATIS** (sin límite de sesiones)
- Heatmaps y grabaciones
- Integración con Microsoft Advertising
- **No afecta performance**

### Paso 1: Obtener Project ID

1. Ve a [clarity.microsoft.com](https://clarity.microsoft.com/)
2. Crea proyecto nuevo
3. Ingresa URL de tu sitio
4. Copia el **Project ID** (formato: `abc123xyz`)

### Paso 2: Agregar en GTM

1. GTM → **"Tags"** → **"New"**
2. Nombre: **"Microsoft Clarity"**
3. Tag Configuration:
   - Tipo: **"Custom HTML"**
   - Código (reemplaza `YOUR_PROJECT_ID`):

```html
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
</script>
```

4. Triggering: **"All Pages"**
5. Click **"Save"** → **"Publish"**

---

## 🎯 GOOGLE ADS CONVERSION TRACKING

### ¿Cuándo usarlo?
Solo si usas **Google Ads** para promocionar tus servicios.

### Paso 1: Crear Conversión en Google Ads

1. Ve a [ads.google.com](https://ads.google.com/)
2. Tools → **"Conversions"**
3. Click **"+ New conversion action"**
4. Selecciona **"Website"**
5. Tipo: **"Submit lead form"** o **"Phone calls"**
6. Copia:
   - **Conversion ID** (formato: `AW-123456789`)
   - **Conversion Label** (formato: `abc123xyz`)

### Paso 2: Agregar en GTM

1. GTM → **"Tags"** → **"New"**
2. Nombre: **"Google Ads - Consulta"**
3. Tag Configuration:
   - Tipo: **"Google Ads Conversion Tracking"**
   - Conversion ID: Pega tu ID
   - Conversion Label: Pega tu label
4. Triggering: Custom Event `consultation_request`
5. Click **"Save"** → **"Publish"**

---

## 🔥 EVENTOS PERSONALIZADOS (Ya implementados en tu código)

Tu sitio ya tiene estos eventos configurados. Solo necesitas crear triggers en GTM para usarlos:

### Eventos Disponibles:

```javascript
// De src/lib/analytics.ts
- consultation_request     // Conversión principal
- whatsapp_click          // Parámetros: location
- contact_form_submit     // Parámetros: method
- social_click            // Parámetros: platform, location
- scroll_depth            // Parámetros: percentage
- section_view            // Parámetros: section_name
- service_interest        // Parámetros: service_name
```

### Cómo crear un Trigger para estos eventos:

1. GTM → **"Triggers"** → **"New"**
2. Trigger Configuration:
   - Tipo: **"Custom Event"**
   - Event name: (elige uno de arriba, ej: `whatsapp_click`)
3. This trigger fires on: **"All Custom Events"**
4. Click **"Save"**

Ahora puedes usar este trigger en cualquier tag (Facebook, LinkedIn, etc.)

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Semana 1: Básicos
- [ ] Google Analytics 4 (vía GTM)
- [ ] Facebook Pixel + Evento Lead
- [ ] LinkedIn Insight Tag

### Semana 2: Analytics Visual
- [ ] Hotjar o Microsoft Clarity
- [ ] Revisar primeros heatmaps

### Semana 3: Ads (si aplica)
- [ ] Google Ads Conversion (si usas Ads)
- [ ] Meta Conversions API (avanzado)

### Mensual
- [ ] Revisar datos en cada plataforma
- [ ] Optimizar audiencias
- [ ] A/B testing de anuncios

---

## 🔍 VERIFICAR QUE FUNCIONAN

### Facebook Pixel
1. Instala extensión: [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Visita tu sitio
3. Click en el ícono de la extensión
4. Debería mostrar: "Pixel encontrado" ✅

### LinkedIn Insight Tag
1. Instala extensión: [LinkedIn Insight Tag Helper](https://chrome.google.com/webstore/detail/linkedin-insight-tag-help/pgogglkbkbdhhfjmbnkdpnbjplpbaini)
2. Visita tu sitio
3. Debería mostrar tag activo

### GTM Preview Mode
1. GTM → Click **"Preview"**
2. Ingresa URL de tu sitio
3. Ve qué tags disparan en cada página

---

## 💡 TIPS PRO

### 1. Organiza tus Tags
Usa nombres descriptivos:
- ✅ "Facebook Pixel - Page View"
- ✅ "LinkedIn - Consulta Conversion"
- ❌ "Tag 1"
- ❌ "Nuevo tag"

### 2. Carpetas en GTM
Agrupa tags similares:
- 📁 Analytics (GA4, Hotjar, Clarity)
- 📁 Advertising (Facebook, LinkedIn, Google Ads)
- 📁 Conversions (Todos los eventos de conversión)

### 3. Usa Variables
Para IDs que se repiten, crea variables:
- Variable: `{{Facebook Pixel ID}}`
- Valor: `123456789012345`
- Úsala en todos los tags de Facebook

### 4. Testing Antes de Publicar
Siempre usa **Preview Mode** antes de **Publish**

### 5. Versionado
Dale nombres descriptivos a cada versión:
- ✅ "v1.2 - Agregado LinkedIn Insight Tag"
- ❌ "Version 5"

---

## 🎓 RECURSOS

- [Guía oficial GTM](https://support.google.com/tagmanager)
- [Facebook Pixel Setup](https://www.facebook.com/business/help/952192354843755)
- [LinkedIn Insight Tag](https://www.linkedin.com/help/lms/answer/a427660)
- [Hotjar Installation](https://help.hotjar.com/hc/en-us/articles/115011639927)

---

## ⚠️ IMPORTANTE: PRIVACIDAD

### Cookie Consent
Si tienes usuarios de Europa (GDPR), necesitas:
1. Banner de cookies
2. Consent antes de cargar tags
3. Política de privacidad actualizada

**Recomendación:** Agregar Cookiebot o similar en GTM para gestionar consentimiento.

### Política de Privacidad
Actualiza tu política para incluir:
- Google Analytics
- Facebook Pixel
- LinkedIn Insight Tag
- Hotjar/Clarity

---

**¿Necesitas ayuda para implementar alguno?** Avísame y te guío paso a paso.

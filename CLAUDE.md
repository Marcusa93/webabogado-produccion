# CLAUDE.md — Instrucciones del proyecto

## 🛡️ REGLA DE ORO — Identidad visual del estudio

**JAMÁS** se utilizan assets, favicons, logos, branding, badges o "Made with…" de **Lovable** (ni de ninguna otra plataforma generadora) en este proyecto. Cualquier referencia a Lovable que aparezca en el código, HTML, manifest, metadata o assets debe eliminarse de inmediato.

El favicon, los logos, el OG image y todo elemento visible al usuario **deben provenir exclusivamente del manual de marca del estudio** (carpeta `Manual de marca/`).

### Favicon oficial

- Archivo: [public/favicon.svg](public/favicon.svg) — monograma **MR** blanco sobre fondo navy `#0a1929`, con esquinas redondeadas para máxima visibilidad en la pestaña.
- Apple touch icon: [public/apple-touch-icon.png](public/apple-touch-icon.png) — monograma blanco.
- Está enlazado desde [index.html](index.html) con `rel="icon" type="image/svg+xml"`, `rel="apple-touch-icon"` y `rel="mask-icon"`.
- `meta name="theme-color"` debe quedar alineado con el navy del favicon (`#0a1929`).

Si se rediseña el favicon, debe seguir tres principios obligatorios:
1. **Monograma MR del estudio** (nunca otro símbolo).
2. **Alto contraste** (fondo de marca + monograma claro) para que sea el más notorio posible en la pestaña, incluso a 16×16 px.
3. **Provenir del manual de marca oficial** (`Manual de marca/SVG/Monograma*` o `Manual de marca/PNG/Monograma solo/`).

### Si Vercel/Netlify sigue mostrando el favicon viejo

Es caché del navegador o del CDN. Forzar refresh: hard reload (Cmd+Shift+R) y/o redeploy con purga de caché. **No** volver a poner el favicon de Lovable como "fix temporal".

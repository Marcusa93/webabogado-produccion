import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { areas, areaPath } from '../src/data/areas';
import { pagesMeta, SITE_URL } from '../src/data/seo';

// La SPA sirve el mismo index.html en todas las rutas, así que Google y las redes
// verían el título y el canonical de la home en cada URL. Este plugin escribe un
// index.html por ruta con su propio <head> y genera el sitemap con esas rutas.

interface Route {
  path: string;
  title: string;
  description: string;
  jsonLd?: object[];
}

const PROVIDER = {
  '@type': 'LegalService',
  name: 'Marco Rossi Abogado',
  url: `${SITE_URL}/`,
  telephone: '+54-9-381-300-7791',
  email: 'estudio@marcorossi.com.ar',
};

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const jsonLdScript = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function areaRoutes(): Route[] {
  return areas.map((area) => {
    const url = `${SITE_URL}${areaPath(area.slug)}`;
    return {
      path: areaPath(area.slug),
      title: area.metaTitle,
      description: area.metaDescription,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: area.h1,
          serviceType: area.title,
          description: area.metaDescription,
          url,
          areaServed: { '@type': 'State', name: 'Tucumán' },
          provider: PROVIDER,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: area.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: area.title, item: url },
          ],
        },
      ],
    };
  });
}

export const prerenderRoutes = (): Route[] => [...Object.values(pagesMeta), ...areaRoutes()];

function replaceTag(html: string, pattern: RegExp, replacement: string): string {
  if (!pattern.test(html)) {
    throw new Error(`[seo-prerender] No se encontró ${pattern} en index.html`);
  }
  return html.replace(pattern, replacement);
}

function renderPage(template: string, route: Route): string {
  const url = `${SITE_URL}${route.path}`;
  const title = escapeAttr(route.title);
  const description = escapeAttr(route.description);

  let html = template;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceTag(html, /<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(
    html,
    /<meta property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${description}" />`,
  );
  html = replaceTag(html, /<meta name="twitter:url"[^>]*\/>/, `<meta name="twitter:url" content="${url}" />`);
  html = replaceTag(html, /<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(
    html,
    /<meta name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${description}" />`,
  );

  if (route.jsonLd?.length) {
    html = html.replace('</head>', `${route.jsonLd.map(jsonLdScript).join('\n')}\n</head>`);
  }
  return html;
}

function renderSitemap(paths: string[]): string {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = paths
    .map((p) => `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function seoPrerender(): Plugin {
  let outDir = 'dist';

  return {
    name: 'seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      const routes = prerenderRoutes();

      for (const route of routes) {
        const dir = path.join(outDir, route.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), renderPage(template, route));
      }

      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), renderSitemap(['/', ...routes.map((r) => r.path)]));
    },
  };
}

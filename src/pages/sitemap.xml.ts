import type { APIRoute } from 'astro';
import { nav } from '../lib/nav';

// Minimal sitemap of the site's pages. Needs SITE_URL at build time; otherwise it is empty.
export const GET: APIRoute = ({ site }) => {
  const origin = site ? (site.href.endsWith('/') ? site.href : site.href + '/') : null;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const paths = ['', ...nav.map((n) => n.path), 'get-involved/membership-form/', 'get-involved/volunteer-form/'];
  const urls = origin ? paths.map((p) => `  <url><loc>${new URL(`${base}/${p}`.replace(/^\//, ''), origin).href}</loc></url>`).join('\n') : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

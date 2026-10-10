import type { APIRoute } from 'astro';

// Allows indexing in production. Set PUBLIC_NOINDEX=true for previews/staging.
export const GET: APIRoute = ({ site }) => {
  const noindex = import.meta.env.PUBLIC_NOINDEX === 'true';
  const lines = ['User-agent: *', noindex ? 'Disallow: /' : 'Allow: /'];
  if (!noindex && site) lines.push('', `Sitemap: ${new URL('sitemap.xml', site.href.endsWith('/') ? site : site.href + '/').href}`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

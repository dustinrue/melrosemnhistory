import siteData from '../data/site.json';

export const site = siteData;
export const phoneDigits = site.phone.replace(/\D/g, '');

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Build a site-internal URL that respects the configured base path. url('visit/#store') */
export function url(path = ''): string {
  return `${base}/${path.replace(/^\//, '')}`;
}

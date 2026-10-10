// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { siteMarkdown } from './src/lib/markdown-site.mjs';
import site from './src/data/site.json' with { type: 'json' };
import volunteer from './src/data/volunteer.json' with { type: 'json' };

// Where the site is served from. Defaults suit a site at the root of its own domain.
//   SITE_URL  e.g. https://www.melrosemnhistory.com   (used for the sitemap)
//   SITE_BASE e.g. /mockups/preview/                   (only for sub-path previews)
const base = process.env.SITE_BASE || '/';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: satteri({ mdastPlugins: [siteMarkdown({ site, base, lists: { volunteer_areas: volunteer.areas, donation_types: volunteer.donations } })] }),
  },
});

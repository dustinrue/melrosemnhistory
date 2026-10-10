// Markdown plugin (Sätteri mdast) for content files.
//  1. Replaces {{tokens}} with values from src/data/site.json, so facts such as the
//     phone number are written once and can never drift between pages.
//  2. Prefixes root-relative links (/visit/) with the site base path.
//
// Tokens: {{name}} {{phone}} {{phone_digits}} {{email}} {{address1}} {{city}}
//         {{hours}} {{hoursSeason}} {{facebook}}
import { defineMdastPlugin } from 'satteri';

export function siteMarkdown({ site, base }) {
  const prefix = base.replace(/\/$/, '');
  const tokens = {
    name: site.name,
    phone: site.phone,
    phone_digits: site.phone.replace(/\D/g, ''),
    email: site.email,
    address1: site.address1,
    city: site.city,
    hours: site.hours,
    hoursSeason: site.hoursSeason,
    facebook: site.facebook,
  };
  const replace = (str) =>
    str.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
      if (!(key in tokens)) {
        throw new Error(`Unknown token {{${key}}} in Markdown content. Known tokens: ${Object.keys(tokens).join(', ')}`);
      }
      return tokens[key];
    });

  return defineMdastPlugin({
    name: 'melrose-site-markdown',
    text(node, ctx) {
      if (node.value.includes('{{')) ctx.setProperty(node, 'value', replace(node.value));
    },
    link(node, ctx) {
      let url = node.url;
      if (url.includes('{{')) url = replace(url);
      if (prefix && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(prefix + '/')) url = prefix + url;
      if (url !== node.url) ctx.setProperty(node, 'url', url);
    },
  });
}

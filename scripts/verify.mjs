// Post-build safety checks on dist/. Node standard library only; no dependencies.
//   npm run verify        (build + checks)
// Fails (exit 1) on: broken internal links/images/anchors, images without alt text,
// unreplaced {{tokens}}, empty pages, or a missing <title>/description/h1.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, sep, posix } from 'node:path';

const dist = resolve('dist');
if (!existsSync(dist)) { console.error('dist/ not found. Run `npm run build` first.'); process.exit(1); }
const base = (process.env.SITE_BASE || '/').replace(/\/?$/, '/');

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const problems = [];
const idsByFile = new Map();
for (const f of htmlFiles) idsByFile.set(f, new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));

const toFile = (urlPath) => {
  let p = decodeURIComponent(urlPath);
  if (base !== '/' && p.startsWith(base)) p = '/' + p.slice(base.length);
  const candidates = [join(dist, p), join(dist, p, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};

for (const f of htmlFiles) {
  const rel = f.slice(dist.length + 1);
  const html = readFileSync(f, 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${rel}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push(`${rel}: missing meta description`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) problems.push(`${rel}: expected exactly one <h1>`);
  if (/\{\{[^}]*\}\}/.test(text)) problems.push(`${rel}: unreplaced {{token}} in output`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt(=|\s|\/|>)/.test(m[0])) problems.push(`${rel}: <img> without alt: ${m[0].slice(0, 80)}`);
  }
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(u)) continue;
    const [path, frag] = u.split('#');
    let target = f;
    if (path) {
      const abs = path.startsWith('/') ? path : posix.join('/' + rel.split(sep).join('/').replace(/[^/]*$/, ''), path);
      target = toFile(abs);
      if (!target) { problems.push(`${rel}: broken link/asset ${u}`); continue; }
    }
    if (frag && target.endsWith('.html') && !idsByFile.get(target)?.has(frag)) problems.push(`${rel}: missing anchor ${u}`);
  }
}
// An indexable build (robots.txt allows crawling) must not carry noindex, and every page needs a canonical URL.
const robots = existsSync(join(dist, 'robots.txt')) ? readFileSync(join(dist, 'robots.txt'), 'utf8') : '';
const indexable = /^Allow:\s*\/\s*$/m.test(robots);
if (indexable) {
  for (const f of htmlFiles) {
    const rel = f.slice(dist.length + 1);
    const html = readFileSync(f, 'utf8');
    if (/<meta name="robots" content="noindex"/.test(html)) problems.push(`${rel}: has noindex but robots.txt allows crawling`);
    if (rel !== '404.html' && !/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html)) problems.push(`${rel}: missing canonical URL (set SITE_URL for the build)`);
  }
} else {
  console.warn('note: this is a noindex/staging build (robots.txt disallows crawling). Do not deploy it to production.');
}
for (const need of ['index.html', '404.html', 'robots.txt', 'sitemap.xml', '_redirects']) {
  if (!existsSync(join(dist, need))) problems.push(`dist/${need} is missing`);
}
if (problems.length) {
  console.error(`\n✖ verify found ${problems.length} problem(s):\n` + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log(`✔ verify passed: ${htmlFiles.length} pages, ${files.length} files, no broken links, alt text present.`);

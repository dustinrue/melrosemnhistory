// Post-deploy smoke test against a live URL. Node standard library only.
//   node scripts/smoke-test.mjs https://www.melrosemnhistory.com [--noindex-ok]
// Retries for up to ~3 minutes because a new deployment takes a moment to reach every edge location.
// Checks: key pages return 200; every CSS/JS/image the home page needs loads (including url() inside CSS);
// canonical + robots are sane; an indexable site has no noindex.
const base = (process.argv[2] || '').replace(/\/$/, '');
const noindexOk = process.argv.includes('--noindex-ok');
if (!base) { console.error('usage: node scripts/smoke-test.mjs <base-url> [--noindex-ok]'); process.exit(1); }

const pages = ['/', '/visit/', '/collections/', '/research/', '/get-involved/', '/about/',
  '/get-involved/membership-form/', '/get-involved/volunteer-form/'];
const fetchText = async (path) => {
  const r = await fetch(base + path, { redirect: 'manual', headers: { 'Cache-Control': 'no-cache' } });
  return { status: r.status, text: r.status === 200 ? await r.text() : '' };
};
const status = async (path) => (await fetch(base + path, { redirect: 'manual', method: 'GET' })).status;

async function runOnce() {
  const problems = [];
  const assets = new Set();
  let robotsAllows = false;
  for (const p of pages) {
    const { status: s, text } = await fetchText(p);
    if (s !== 200) { problems.push(`${p} -> HTTP ${s}`); continue; }
    if (!/<title>[^<]+<\/title>/.test(text)) problems.push(`${p}: no <title>`);
    for (const m of text.matchAll(/(?:href|src)="(\/[^"#?]+\.(?:css|js|webp|jpe?g|png|svg|ico))"/g)) assets.add(m[1]);
    if (!noindexOk && /<meta name="robots" content="noindex"/.test(text)) problems.push(`${p}: noindex on a production site`);
    if (!/<link rel="canonical" href="https?:\/\//.test(text)) problems.push(`${p}: no canonical link`);
  }
  for (const css of [...assets].filter((a) => a.endsWith('.css'))) {
    const { text } = await fetchText(css);
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      if (m[1].startsWith('/')) assets.add(m[1].split('#')[0]);
    }
  }
  for (const a of assets) {
    const s = await status(a);
    if (s !== 200) problems.push(`asset ${a} -> HTTP ${s}`);
  }
  const robots = await fetchText('/robots.txt');
  robotsAllows = /^Allow:\s*\/\s*$/m.test(robots.text);
  if (robots.status !== 200) problems.push(`/robots.txt -> HTTP ${robots.status}`);
  if (!noindexOk && !robotsAllows) problems.push('/robots.txt does not allow crawling');
  return { problems, assetCount: assets.size };
}

let last;
for (let attempt = 1; attempt <= 12; attempt++) {
  try { last = await runOnce(); } catch (e) { last = { problems: [`request failed: ${e.message}`], assetCount: 0 }; }
  if (last.problems.length === 0) {
    console.log(`✔ smoke test passed for ${base}: ${pages.length} pages, ${last.assetCount} assets (attempt ${attempt})`);
    process.exit(0);
  }
  console.log(`attempt ${attempt}: ${last.problems.length} problem(s); retrying in 15s…`);
  await new Promise((r) => setTimeout(r, 15000));
}
console.error(`✖ smoke test failed for ${base}:\n` + last.problems.map((p) => '  - ' + p).join('\n'));
process.exit(1);

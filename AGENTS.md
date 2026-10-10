# AGENTS.md — Melrose Area Historical Society website

Instructions for AI coding agents (and humans) who update or maintain this site.
**Read this whole file before changing anything.** It is the contract that keeps the site safe, cheap and consistent.

- Site: <https://www.melrosemnhistory.com> — Melrose Area Historical Society (MAHS) and the Melrose Area Museum, Melrose, Stearns County, Minnesota.
- Stack: [Astro](https://astro.build) 7 static site generator. No database, no server code, no CMS, no checkout.
- Output: plain HTML + one CSS file + ~1 KB of JavaScript, hosted for ~$0 (Cloudflare Pages preferred, GitHub Pages works).
- `CLAUDE.md` is a symlink to this file.

## 1. Who this site is for

Local residents, genealogists/family researchers, and visitors planning a trip. Many are older and on phones or slow
connections. Plain language, large readable text, fast pages, and accurate hours/phone numbers matter more than cleverness.

## 2. The contract: content is safe to change, design is not

The design was built once and approved. Day-to-day updates must **never** alter layout, colors, spacing or structure.

| Zone | Paths | Who edits it | Rule |
|---|---|---|---|
| **Content** (safe) | `src/data/**`, `src/content/**`, `src/assets/photos/**` | Anyone, including AI agents | Edit freely, following section 5. The build validates it. |
| **Design** (locked) | `src/layouts/**`, `src/components/**`, `src/styles/**`, `src/pages/**`, `src/lib/**`, `src/scripts/**`, `src/content.config.ts`, `astro.config.mjs` | Only when the owner asks for a design or structure change | Do not touch for content work. If a content request seems to need a design change, **stop and ask**. |
| **Navigation** | `src/lib/nav.ts` | Owner decision | Adding/removing menu items is a structural change. |
| **Redirects** | `public/_redirects` | Rarely | Only append when a page is renamed/removed. |

A content-only change must not modify any file in the Design zone. (A future CI check can enforce this; see section 10.)

**Non-goals decided by the owner** (do not add without being asked): online store/checkout, donations/payments, accounts,
comments, forms that post data, embedded social feeds, cookie banners, third-party trackers, JavaScript frameworks.
If a request needs any of these, stop and ask.

## 3. Quick start

```sh
npm install          # once (Node 22.12+; .nvmrc says 22)
npm run dev          # local preview at http://localhost:4321
npm run verify       # production build + safety checks. Run before every commit.
npm run preview      # serve the built dist/ locally
```

`npm run verify` = `astro build` + `scripts/verify.mjs`. It fails on: invalid data, missing photos or alt text, unknown
`{{tokens}}`, broken internal links/anchors/assets, missing `<title>`/description/single `<h1>`. **Never commit if it fails.**

## 4. Repository map

```
src/
  data/                 STRUCTURED CONTENT (JSON / text)           <- content zone
    site.json             hours, admission, address, phone, email, Facebook, map links (single source of truth)
    home.json             all home-page copy (hero, intro, tiles, story cards, band)
    pages.json            <title>, meta description, H1 and lede for every page
    timeline.json         milestones (full list on About; 3 chosen years teased on Home)
    membership.json       benefits + membership/giving levels
    board.json            officers and directors
    books.json            museum store book list
    gallery.json          captioned photos on the Visit page
    volunteer.json        volunteer areas + donation types (shown on Get Involved AND printed on the volunteer form)
    lists/*.txt           research lists, one entry per line
  content/              PROSE (Markdown)                           <- content zone
    sections/*.md         page text blocks (visit-visiting.md, about-mission.md, ...)
    stories/*.md          the 8 collection stories
  assets/photos/        photographs (any size; the build resizes + converts to WebP)
  layouts/Base.astro    <head>, top strip, header/nav, footer, analytics      <- design zone
  components/           Photo, PageHero, StorySection, Timeline, FormSheet, ...  <- design zone
  pages/                one .astro file per page + 404, robots.txt, sitemap    <- design zone
    get-involved/membership-form.astro, volunteer-form.astro   printable forms
  styles/global.css     the entire stylesheet                                  <- design zone
  lib/                  helpers, data validation (zod schemas), markdown plugin <- design zone
  scripts/site.js       mobile menu + research-list filter                     <- design zone
public/
  favicon.svg, _redirects
scripts/verify.mjs      post-build checks
scripts/deploy.sh       build + upload to Cloudflare Pages (preview | production)
needs-verification.md   wording that must be checked against a source before changing (see section 12)
tools/visual-diff/      optional screenshot comparison (section 9)
```

## 5. How to make common updates

Always run `npm run verify` afterwards.

### Facts that appear on many pages — edit ONLY `src/data/site.json`
Hours, season, admission prices, address, phone, email, Facebook URL, map links. Templates and Markdown read from here.

- Changing **hours**: edit `hours`, `hoursSeason`, `hoursDetail`, `hoursNote`. Also check the two prose spots that spell
  hours out: `src/content/sections/visit-visiting.md` (first paragraph) and `src/data/home.json` → `visitCard.hoursSub`.
- Changing **admission**: edit the `admission` array AND `admissionSummary.primary/secondary` (the short Home-page line),
  and keep them consistent.
- Changing the **phone**: edit `phone` only (format `320-256-3933`; the build rejects other formats). It is used everywhere
  including `tel:` links.
- `locationNote` and `followNote` are the small captions on the Visit page fact cards.

### Prose pages — `src/content/sections/*.md`
Plain Markdown with a small header. Fields: `title` (shown as the heading), and optionally `image`, `imageAlt`, `imageCaption`.
Every `image` **requires** `imageAlt`.

| File | Appears on |
|---|---|
| `visit-visiting.md`, `visit-see.md`, `visit-store.md` | Visit (`#see`, `#store`) |
| `collections-intro.md` | Collections intro |
| `research-intro.md` | Research intro (+ photo) |
| `involved-join.md`, `involved-volunteer.md` | Get Involved (`#membership`, `#volunteer`) |
| `about-mission.md`, `about-building.md`, `about-history.md` | About (`#mission`, `#building`, `#history`) |

Markdown you may use: paragraphs, **bold**, *italic*, links, bullet lists, `###` subheadings, and `>` blockquotes
(rendered as the gold callout box). Do **not** write raw HTML, MDX, inline styles or classes.

**Tokens** keep facts in one place. Use these instead of typing the value:
`{{phone}}` `{{phone_digits}}` (for `tel:` links) `{{email}}` `{{address1}}` `{{city}}` `{{name}}` `{{hours}}`
`{{hoursSeason}}` `{{facebook}}`. Example: `call [{{phone}}](tel:{{phone_digits}})`. An unknown token fails the build.

**List markers:** a paragraph containing only `{{list:volunteer_areas}}` or `{{list:donation_types}}` is replaced by a bullet
list built from `src/data/volunteer.json`. The same data prints on the volunteer form, so the website and the form cannot disagree.

**Links:** to another page of this site use a root-relative path (`[Visit](/visit/)`, `[the store](/visit/#store)`); the build
adds any base path. Always end page links with `/`. External links use the full `https://…` URL.

### Collection stories — `src/content/stories/*.md`
One file per story; the file name is the anchor (`gallagher.md` → `/collections/#gallagher`). Front matter:
`title`, `order` (display order, 1..n), optional `image` + `imageAlt` (+ `imageCaption`), optional `image2` + `image2Alt`.
To add a story: copy an existing file, change the fields and text. Stories appear automatically in the jump list.
Do not rename an existing story file (it would break links and the redirects).

### Lists, people and products
- **Family / oral / video histories:** `src/data/lists/*.txt`, one entry per line, alphabetical by surname. Duplicates fail the build.
  Counts and the search filter update automatically.
- **Board:** `src/data/board.json` (`officers` have `role` + `name`; `directors` is a list of names).
- **Membership levels:** `src/data/membership.json`. `kind` is `annual` or `giving`; one level may have `"featured": true`.
- **Store books:** `src/data/books.json` (`title`, `subtitle` may be an empty string).
- **Timeline:** `src/data/timeline.json`, chronological. Home teases the years listed in `home.json` → `timeline.years`
  (each must exist in `timeline.json`).
- **Volunteer areas / donation types:** `src/data/volunteer.json` (`areas`, `donations`). Updates the Get Involved page text and the
  printable volunteer form together.
- **Home page copy:** `src/data/home.json` (plain text only, no HTML).

### Photos
1. Put the photo in `src/assets/photos/` with a short kebab-case name (`schoolroom-1950.jpg`). Any size up to ~2000 px wide is fine;
   the build resizes and serves WebP. **Do not** commit multi-megabyte originals.
2. Reference it by file name in front matter or JSON (`image: schoolroom-1950.jpg`). A wrong name fails the build and lists valid names.
3. Always write meaningful `alt` text describing what is shown (not "photo of…"). Decorative-only images are a design decision.
4. Only the Society's own photos or ones the owner confirms are licensed. Stock images from the old site were deliberately **not** carried over.

### Printable forms (replaced the old PDFs)
There are no PDF files. `/get-involved/membership-form/` and `/get-involved/volunteer-form/` are normal pages designed to print on
one US Letter page (site header/footer are hidden when printing; the "Print this form" button appears when JavaScript is on, and
Ctrl/Cmd+P works regardless). They are **generated from data**: address/phone/email from `site.json`, membership levels and
prices from `membership.json`, volunteer areas and donation types from `volunteer.json`. Changing those files updates the
website and the printed forms together. Only the form wording and field layout live in the page templates
(`src/pages/get-involved/*-form.astro`, design zone). After editing a form template, print-preview it (or `Cmd+P`) and confirm it
still fits one page.

## 6. Content and tone rules

- Plain, friendly, factual; short paragraphs; no jargon.
- **Never invent** history, dates, names, prices, quotes or events. If a fact is not in this repo or supplied by the owner, ask.
- Use full dates ("Wednesday, May 6, 2026"), not "this Wednesday". Avoid time-relative wording ("new", "recently"); it goes stale.
- Spell people's and family names exactly as supplied. Flag suspected typos instead of silently "correcting" surnames.
- Do not add personal contact details of living individuals (home addresses, personal phone numbers). The Society's own phone/email are fine.
- Keep the site evergreen: time-sensitive news (events, closures) lives on the Facebook page; the site links to it.

## 7. Design system notes (for the rare design task)

- **One stylesheet:** `src/styles/global.css`. Colors are CSS variables at the top (`--brick`, `--gold`, `--cream`, …).
  Fonts are Fraunces (headings) and Source Sans 3 (body) from Google Fonts; consider self-hosting if privacy matters.
- **Breakpoints:** 900 px (nav becomes the Menu button, grids collapse) and 600 px (phone tweaks). Test at 375, 768 and 1280 px.
- **Pages are thin.** Each `src/pages/*.astro` loads validated data + Markdown and composes shared components. Prefer
  adding/adjusting a component over copying markup.
- **Accessibility is a requirement, not a nice-to-have:** one `<h1>` per page, logical heading order, text contrast ≥ 4.5:1,
  visible focus, tap targets ≥ 44 px, `alt` on every photo, skip link, `aria-current` on the active nav item, the site
  works without JavaScript (the menu and list filter are progressive enhancements).
- After any design change run the visual comparison (section 9) and get the owner's approval.
- Do not add npm dependencies, client-side frameworks, web fonts or trackers without asking.

## 8. Build, hosting and environment

**Cloudflare Pages (in production, since October 2026):**

| | |
|---|---|
| Project | `melrosemnhistory` (Direct Upload, production branch `main`), Cloudflare account "melrosemnhistory.com" |
| Live site | <https://www.melrosemnhistory.com>. The `www` DNS record is a proxied CNAME to `melrosemnhistory.pages.dev`; custom domain attached to the project. |
| Apex | `melrosemnhistory.com` -> `https://www.melrosemnhistory.com` is handled **at Cloudflare's edge** by a zone Redirect Rule named "apex-redirect" (301, keeps path and query string, so `melrosemnhistory.com/museum.html` ends at `/visit/` via the `_redirects` rules). The web2 server is not involved. The apex `A` record (proxied, `138.197.231.246`) must stay *proxied* for the rule to run, but it never reaches the origin, so it can point anywhere (e.g. `192.0.2.1`) once web2 is retired. |
| Other DNS | Mail (Google MX/SPF/DKIM), `staging`, `mail`, `ftp`, `ssh`, `autoconfig`, `autodiscover` records are unchanged. `staging.melrosemnhistory.com` still points at web2. |
| Preview | `scripts/deploy.sh preview` -> <https://preview.melrosemnhistory.pages.dev> (noindex, not counted in analytics) |
| Deploy to live | `scripts/deploy.sh production` (builds, runs `npm run verify`, uploads `dist/` with Wrangler). **This replaces the live site.** Run `preview` first for anything risky. |
| Token | account-scoped API token with **Cloudflare Pages: Edit** (and DNS edit if DNS must change), supplied through the `CF_MUSEUM` (or `CLOUDFLARE_API_TOKEN`) environment variable. Never commit it, paste it into files, or print it. |
| Rollback (page content) | redeploy the previous commit (`git checkout <sha> && scripts/deploy.sh production`), or in the dashboard: Workers & Pages -> project -> Deployments -> "Rollback to this deployment". |
| Rollback (DNS) | point the `www` CNAME back at `melrosemnhistory.com` (proxied) to serve the old web2 site again. The original records were backed up at cutover. |

`public/_redirects` and `404.html` are honoured (verified on the live domain: old `.html` and PDF URLs 301 to the new pages).
`melrosemnhistory.pages.dev` serves the same production deployment, so it is also publicly reachable (duplicate hostname; the
sitemap and links use `www`).

Direct Upload fits the planned CI: a GitHub Action can run `scripts/deploy.sh production` (store the token as a repository secret).
Caveat: Cloudflare cannot convert a Direct Upload project to Git integration later; that would mean creating a new project.

Optional improvement: add a `public/_headers` file to cache `/_astro/*` for a year
(`Cache-Control: public, max-age=31536000, immutable`).

**GitHub Pages:** build with GitHub Actions and publish `dist/`. `_redirects` is not supported there; the old `.html`
URLs would 404 unless stub pages are added. Prefer Cloudflare Pages if the old URLs matter.

**Manual publish:** `npm run verify`, then upload the contents of `dist/` to the web root.

Environment variables (see `.env.example`; set in the host dashboard or CI, not committed):

| Variable | Purpose |
|---|---|
| `SITE_URL` | Canonical origin for canonical links, social-preview tags, `sitemap.xml` and `robots.txt`. Defaults to `https://www.melrosemnhistory.com`; set it only for previews on another host. |
| `SITE_BASE` | Only when served from a sub-path (previews), e.g. `/mockups/preview/`. Leave unset in production. |
| `PUBLIC_NOINDEX` | `true` on staging/preview builds: adds `noindex` and a `Disallow: /` robots.txt. **Unset in production.** |
| `PUBLIC_UMAMI_SRC`, `PUBLIC_UMAMI_ID` | Enables the self-hosted Umami analytics snippet (both required). `scripts/deploy.sh production` sets them (the same values the old site used); staging/preview builds do not, so they are not counted. These are build-time variables: with Direct Upload, Cloudflare dashboard variables are **not** used, so change them in the script or the shell. |

Caching: CSS/JS/images get content-hashed file names (`/_astro/…`), so changed assets get new URLs automatically and never
need a cache purge. HTML pages are not hashed; after a deploy a visitor's browser may briefly show an older page.

**Legacy URLs:** every old `*.html` address redirects to its new page via `public/_redirects` (301). When you move or remove a
page, add a redirect line. Never delete existing lines.

## 9. Safety nets and how to use them

| Check | Catches |
|---|---|
| Zod schemas in `src/lib/data.ts` and `src/content.config.ts` | missing/misspelled fields, bad phone/email/URL, missing `imageAlt`, empty lists |
| `{{token}}` validation in `src/lib/markdown-site.mjs` | typos in tokens |
| `photo()` lookup in `src/lib/photos.ts` | references to photos that do not exist |
| `src/lib/lists.ts` | duplicate list entries |
| `scripts/verify.mjs` | broken links/anchors/assets, missing alt/title/description/h1, leftover tokens |
| `tools/visual-diff/` (optional, needs Chrome + Python Pillow) | accidental visual changes |

Visual comparison, e.g. before vs. after a change:

```sh
# 1. old version (the commit before your change) on port 4322
git worktree add /tmp/site-old HEAD && (cd /tmp/site-old && npm ci && npx astro build && npx astro preview --port 4322 &)
# 2. your version on port 4321
npm run build && npx astro preview --port 4321 &
# 3. compare
tools/visual-diff/shoot.sh http://localhost:4321 http://localhost:4322 /tmp/vd
python3 tools/visual-diff/diff.py /tmp/vd
```
A content-only change should differ only where the text changed. The footer year line differs by ~0.01% by design.

If a check fails: read the message (they are written to be readable), fix the content, re-run. Do not weaken a schema or
check to make a build pass.

## 10. CI plan (not set up yet)

Intended later: a GitHub Action on every PR that runs `npm ci && npm run verify`, plus a guard that fails when a PR labelled
"content" touches the Design zone (section 2). Deployment stays with Cloudflare Pages. Sketch:

```yaml
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run verify
```

## 11. Changelog policy and git

- Small, focused commits; message says what content changed (`Update 2027 museum hours`).
- Work on a branch and use the preview URL for owner review before merging to `main`.
- Never commit `node_modules/`, `dist/`, `.astro/` or `.env`.
- Upgrading Astro: do it deliberately, on a branch, only when needed; `package-lock.json` pins versions. Run `npm run verify`
  and the visual comparison before merging.

## 12. Open items to confirm with the owner

Content carried over from the 2013-era site that may be stale or inconsistent. Do not silently "fix"; ask.

1. **Phone number (decided by the owner, October 2026).** The site publishes **320-256-3933** everywhere (single source: `phone`
   in `src/data/site.json`), including the printable forms. This is the number the old site used on the hours, store and volunteer
   pages and in the old PDF forms. *History:* the old header banner and contact page showed **320-256-4996**; the site briefly
   used that number, and the owner then reverted to 3933. The owner has said 4996 may ring to a specific person, so do not
   switch back or publish both without asking. To change, edit `phone` once.
2. **Email (resolved):** confirmed by the owner as `rpaschke@meltel.com` (the old website HTML said `.net`, which was wrong).
   Consider a role address (e.g. info@) eventually.
   **Address (resolved):** `518 2nd St SE`. Melrose changed to the SE address format; the old volunteer PDF's "518 E Second Street S"
   is outdated.
3. **Hours, admission, membership prices (resolved):** the owner treats the current values as confirmed. Prices feed the website
   and the printable form from `membership.json`, so one edit updates both.
4. **Board list (resolved):** the owner confirmed it is current (a person was removed and one added during the migration).
5. **Source wording needing verification (OPEN):** see **[needs-verification.md](needs-verification.md)**. It lists each doubtful
   passage (file, exact text, why it is doubtful, how to verify). **Do not change those passages without a source**, and delete the
   entry from that file when you resolve it. Resolved so far: "Wapeton" was corrected to "Wahpeton" (owner approved).
6. **Typos fixed during migration** (so nobody "re-fixes" them): Walter Haut, August Kuhlmann, *Spirit* of St. Louis,
   Chronicle, Fort Worth, Woodland Period, Hetzel, Lake Wobegon.
7. **Fonts (resolved):** the owner is fine with loading Fraunces and Source Sans 3 from Google Fonts.
8. **Legacy source files** (original HTML, PSDs, stock photos, the old PDFs) are intentionally not in this repository.
9. **Volunteer areas / donation types (resolved):** the lists on the Get Involved page and the printed volunteer form come from
   `src/data/volunteer.json`. They were taken from the old volunteer PDF plus the old Volunteer page text, and the owner approved
   adding "Organizing displays" to the form. The form wording ("Please check one: New / Renewal", "Additional donation $") was
   also reviewed and approved.

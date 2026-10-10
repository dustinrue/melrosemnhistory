# Melrose Area Historical Society website

Static website for the Melrose Area Historical Society and the Melrose Area Museum
(melrosemnhistory.com), built with [Astro](https://astro.build). Informational only: no database,
no server, no checkout. Hosting cost is the domain.

```sh
npm install        # once
npm run dev        # http://localhost:4321, live-reloads while you edit
npm run verify     # production build + safety checks (run before every commit)
scripts/deploy.sh preview   # upload a noindex build to Cloudflare Pages (see AGENTS.md section 8)
```

Requires Node 22.12 or newer (`.nvmrc` says 22).

## Updating content

Most updates are small edits to text or data files and do not touch the design.
See **[AGENTS.md](AGENTS.md)**: it explains where everything lives, what is safe to edit,
and how to publish. It is written for AI coding agents and humans alike.

| To change… | Edit… |
|---|---|
| Hours, admission, address, phone, email, Facebook | `src/data/site.json` |
| A page's prose | `src/content/sections/*.md` |
| A collection story | `src/content/stories/*.md` |
| Board, membership levels, timeline, books | `src/data/*.json` |
| Family / oral / video history lists | `src/data/lists/*.txt` |
| Volunteer areas, donation types (also print on the form) | `src/data/volunteer.json` |
| Photos | `src/assets/photos/` |

## Publishing

Merging to `main` deploys automatically (GitHub Actions -> Cloudflare Pages). Pull requests get a checked preview URL.
Setup and details: AGENTS.md sections 8 and 10.

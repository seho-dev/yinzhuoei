# yinzhuoei.com

Seho's personal site & blog. Built with **Astro** (static output), **Tailwind CSS 4**, **Astro Content Collections** (Markdown + MDX), native **i18n** (English / 简体中文), **Pagefind** static search, deployed to **Cloudflare Workers Static Assets** via GitHub Actions.

## Commands

```bash
pnpm install
pnpm dev       # local dev server
pnpm check     # astro + typescript checks
pnpm build     # build to dist/ and generate the Pagefind index
pnpm preview   # preview the production build
pnpm deploy    # build + wrangler deploy
```

## Content

Posts live in `src/content/blog/<post>/` — one folder per post, one file per language (`en.md`, `zh.md`). The folder name is the URL slug, so a post's translations always sit side by side.

```yaml
---
title: "The Art of Building Software That Feels Right"
description: "One-sentence summary, used for SEO and RSS."
date: 2026-10-13
updated: 2026-10-13        # optional
lang: en                    # en | zh
translationKey: crafting-software   # shared key linking translations
slug: custom-url-slug       # optional; defaults to the file name
tags: [Engineering]
draft: false                # drafts are excluded from production builds
featured: true              # pinned on the home page
---
```

### Add a Markdown post

Create `src/content/blog/my-post/en.md` with the frontmatter above. The route appears automatically at `/blog/my-post`.

### Add an MDX post

Create `src/content/blog/my-post/en.mdx`. Import Astro components at the top:

```mdx
import Callout from '../../../../components/mdx/Callout.astro';

<Callout type="tip">Works without any client framework.</Callout>
```

Reusable MDX components live in `src/components/mdx/`.

### Add a translation

Create `src/content/blog/my-post/zh.md` with the **same `translationKey`**. The language switcher on the post page will link the two versions automatically. Posts without a translation simply don't show the link — nothing breaks.

## Site configuration

- Personal profile, social links, projects: `src/config.ts`
- UI strings (both languages): `src/i18n/ui.ts`
- Domain / site URL: `site` in `astro.config.mjs` and `src/config.ts`, plus `public/robots.txt`

## Theme & design tokens

All colors, fonts, spacing and motion tokens are CSS variables in `src/styles/global.css` (`:root` for light, `.dark` for dark). The theme toggle persists to `localStorage` and defaults to the system preference; an inline script in `BaseHead.astro` applies the theme before first paint (no flash).

## Deployment (Cloudflare Workers Static Assets)

The site builds to a plain static `dist/` — no SSR, no Worker script.

### First-time setup

1. Install the Wrangler CLI (already a dev dependency) and log in: `pnpm exec wrangler login`.
2. Create the Worker project by deploying once: `pnpm deploy`. The `wrangler.jsonc` in this repo defines the project (`seho-blog`) with `assets.directory = ./dist`.
3. Create a Cloudflare API token: **My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template**, with *Workers Scripts: Edit* on your account.
4. In the GitHub repo: **Settings → Secrets and variables → Actions**, add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID` (shown on the right sidebar of any zone overview in the Cloudflare dashboard)

Every push to `main` now builds and deploys automatically (`.github/workflows/deploy.yml`). PRs and non-main branches run type checks and build only (`.github/workflows/ci.yml`). Deploy logs are under the **Actions** tab; the same workflow output shows Wrangler's deployment URL.

### Custom domain

1. In the Cloudflare dashboard: **Workers & Pages → seho-blog → Settings → Domains & Routes → Add Custom Domain**.
2. Enter `yinzhuoei.com` (and `www.yinzhuoei.com` if desired). If the zone is already on Cloudflare, DNS records are created automatically; otherwise add the nameservers Cloudflare assigns at your registrar first.
3. HTTPS is issued automatically. Update `site` in `astro.config.mjs` if the domain ever changes.

## Importing existing Markdown

Drop `en.md` into a new folder under `src/content/blog/`, add the required frontmatter (`title`, `description`, `date`, `lang`, `translationKey`), and commit. The folder name becomes the URL slug. Drafts (`draft: true`) render in dev but are excluded from production.

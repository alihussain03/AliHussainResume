# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

Ali Hussain's personal engineering portfolio site (dual audience: recruiters and freelance clients). No build tooling or site code exists yet. Two files are the sources of truth — read both before building anything:

- `CONTEXT.md` — **content source of truth**: site structure, bio, experience, services, projects, skills, and contact details. Everything on the site must come from this document; **do not invent facts beyond it** (no fabricated testimonials, metrics, or projects). It also carries build notes: the homepage must let visitors self-select between a recruiter path (CV download, GitHub, email) and a client path (start a project / book a call, case studies), and projects should be framed as *Problem → What I did → Result* case studies leading with measurable outcomes.
- `brand-style-guide.html` — **design source of truth** (v2.2, "Quiet authority"). **Do not modify this file.** Copy its `:root` token block into site CSS and reference the variables; never hard-code or eyeball values.

- `.gitignore` — set up for **GitHub Pages with Jekyll** (`_site/`, `.jekyll-cache/`, `Gemfile.lock`), indicating GitHub Pages is the intended deployment target.

## Key decisions (first draft, July 2026)

- **Eleventy over Jekyll**: the `.gitignore` originally suggested Jekyll, but Ruby is not installed on the dev machine while Node is — Eleventy gives instant local preview with the same Markdown-blog benefits. Eleventy's default output dir (`_site/`) is already covered by the Jekyll-era `.gitignore`.
- **Multi-page over single-page**: separate pages (Home, About, Services, Projects, Blog, Contact) so the two audience journeys from CONTEXT.md (recruiters vs. clients) don't share one scroll. Skills folds into About rather than a standalone page, keeping the recruiter journey on one page.
- **CTAs are email links + CV file** (user's choice): `mailto:` links with pre-filled subjects per path, and a CV download button. No contact form or scheduling service in draft one.
- **Deployment target is GitHub Pages via Actions** (not the native Jekyll build): the workflow passes `--pathprefix` for the project URL and `EleventyHtmlBasePlugin` rewrites root-relative URLs — templates always use `/about/`-style paths.
- **Blog content**: only one clearly-labeled sample post exists, demonstrating the `YYYY-MM-DD-slug.md` + front-matter format. It should be deleted when real posts are written; never invent posts.
- **Environment quirk**: port 8099 on this machine silently drops HTTP traffic (likely security software). Use the default dev port 8080 or another port for local servers.

## Planned next steps (content editing for a non-technical owner)

The site owner is non-technical; the editing story should improve in two stages:

1. **Move page content into data files**: extract page content from the `.njk` templates into JSON/YAML under `src/_data/` so edits are plain-text value changes with no HTML involved. (Blog posts are already plain Markdown and can be edited via GitHub's web UI today.)
   - **Done for About, Services, and Projects**: content lives in `src/_data/` — `experience.json`, `skills.json`, `education.json` (About); `services.json` (the offering cards); `projects.json` (`highlights` + `cases`). The templates loop over them. Ampersands go in as plain `&` (Nunjucks auto-escapes). Empty `tech: []` on a role/case hides its pill row; add a new object to `projects.json`'s `cases` array to add a case study.
   - **Still inline** (candidate for the same treatment): the homepage hero + impact highlights (`index.njk`). The Services availability blurb stays inline (single block, not a repeating list).
2. **Add a git-based CMS** (e.g. Pages CMS or Decap CMS) on top of those data files: a web editing UI that commits to GitHub, with the existing Actions workflow handling rebuild/deploy. No servers, no cost, no change to how the site looks.

### Contact form (FormSubmit.co)

The contact page (`contact.njk`) posts to `https://formsubmit.co/{{ site.email }}`; all former `mailto:` CTAs across the site now point to `/contact/`, and the email/phone are no longer shown as text (phone stays in `site.json` but is unused). **Activation is required**: the first real submission triggers a one-time confirmation email to the owner — the link in it must be clicked once before the form delivers. To hide the address from page source, swap the email in the form `action` for the random `formsubmit.co/<hash>` alias from that activation email. `_next` redirects to the `/thanks/` page (absolute URL, so it must track the deployed origin). The `_honey` input is the spam honeypot. Form submit shows a JS "Sending…" state as progressive enhancement — it still works with JS disabled.

## Build and development

The site is built with **Eleventy (11ty)**. Source lives in `src/`, output in `_site/` (gitignored).

- `npm install` — install dependencies
- `npm run dev` — dev server with live reload at http://localhost:8080
- `npm run build` — build to `_site/`

Structure: layouts in `src/_includes/layouts/` (`base.njk` → `page.njk` / `post.njk`), global data in `src/_data/site.json` (contact details, links — sourced from CONTEXT.md), CSS in `src/assets/css/` (`tokens.css` is the `:root` block copied verbatim from the brand guide; `main.css` must only use `var(--*)` references). Blog posts are Markdown files in `src/blog/posts/` named `YYYY-MM-DD-slug.md` with `title`/`excerpt` front matter. The CV PDF must be placed at `src/assets/files/ali-hussain-cv.pdf` (see the README there).

Deployment is GitHub Pages via `.github/workflows/deploy.yml` (Pages source must be set to "GitHub Actions" in repo settings). The workflow passes `--pathprefix` for the project URL; the `EleventyHtmlBasePlugin` in `.eleventy.js` rewrites absolute URLs accordingly — so templates should use root-relative URLs (`/about/`, `/assets/...`).

## The brand system (must follow)

Key constraints from `brand-style-guide.html`:

- **Palette**: warm greige neutrals (`--ink #1A1917`, `--graphite`, `--stone`, `--line`, `--mist`, `--paper #F7F6F2`) plus **exactly one accent** — deep petrol `#17514A` (with `--accent-press`, `--accent-tint`, and `--accent-soft` for dark backgrounds). Never add a second accent or a "close enough" shade.
- **Typography**: two Google Fonts only — Spectral (serif, headings/wordmark) and Instrument Sans (sans, body/labels/UI). Base font size is an explicit 18px (`html { font-size: 112.5% }`); the entire type scale derives from it. Do not shrink the base on mobile.
- **Spacing**: 8px-based steps (`--s1`–`--s10`); no arbitrary spacing values.
- **Tone**: calm, premium, understated — no gradients, glows, or effects not defined in the style guide. Whitespace is deliberate.
- **Two-site strategy**: the same token system is intended to serve two sites — this quieter first-person personal site and a future, more structured studio site — differing only in register, never in tokens.
- **Conventions**: `<button class="btn ...">` for actions, `<a href>` only for navigation; the mobile menu is a no-JS `<details>` disclosure; respect `prefers-reduced-motion`.

## Installed skills

`.claude/skills/` contains the UI/UX Pro Max skill pack (installed via `uipro init --ai claude`): `ui-ux-pro-max`, `design`, `design-system`, `ui-styling`, `brand`, `slides`, `banner-design`. When these suggest palettes, fonts, or styles, the repo's own brand tokens always win — the skills are process guidance, not a license to deviate from `brand-style-guide.html`.

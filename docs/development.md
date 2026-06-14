# Development Guide

## Setup

```bash
git clone https://github.com/Shionyori/hexo-theme-shion.git
cd hexo-theme-shion
npm install
```

## Scripts

| Command           | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `npm run build`   | Build all: TypeScript → scripts/ + client JS + SCSS → CSS   |
| `npm run dev`     | Watch mode — auto-rebuild + demo server on `localhost:4000` |
| `npm run preview` | Full preview: clean → build → sync → generate → serve       |
| `npm run format`  | Format with Prettier                                        |
| `npm run clean`   | Remove built output from source/ and scripts/               |

## Project Structure

```
hexo-theme-shion/
├── src/
│   ├── ts/             Server-side TypeScript (helpers, filters, generators, tags)
│   ├── client/         Browser TypeScript (theme, search, sidebar, TOC, etc.)
│   └── scss/           SCSS stylesheets (dark mode, responsive, components)
├── layout/
│   └── _partial/       EJS templates (header, footer, sidebar, comments, etc.)
├── source/             Compiled output + static assets (CSS, JS, images)
├── languages/          i18n files (en, zh-CN, zh-TW, ja)
├── scripts/            Compiled server helpers (committed for direct theme use)
├── demo/               Standalone Hexo site for development & preview
├── tools/              Build utilities (sync, watch-client)
└── _config.yml         Theme default configuration
```

### Client Modules (`src/client/`)

| Module                | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `main.ts`             | Entry point — imports and initializes all modules, binds PJAX lifecycle |
| `theme.ts`            | Dark/light mode toggle with localStorage persistence                    |
| `search.ts`           | Fuse.js local search with modal UI and keyboard navigation              |
| `sidebar.ts`          | Mobile sidebar toggle and overlay behavior                              |
| `toc.ts`              | Table of contents with IntersectionObserver scroll spy                  |
| `pjax.ts`             | PJAX page transitions with loading bar and scroll restoration           |
| `music-player.ts`     | HTML5 Audio player with playlist, 4 play modes, keyboard shortcuts      |
| `lightbox.ts`         | Image zoom via medium-zoom CDN (lazy-loaded)                            |
| `math.ts`             | KaTeX rendering with per-post toggle and dynamic CDN loading            |
| `code-copy.ts`        | Copy-to-clipboard button on code blocks                                 |
| `animations.ts`       | Staggered entrance animations for cards, sidebar, and post sections     |
| `back-to-top.ts`      | Floating back-to-top button with scroll-aware visibility                |
| `reading-progress.ts` | Reading progress bar at page top                                        |
| `share.ts`            | Social share buttons (Twitter, Facebook, LinkedIn, copy link)           |
| `mobile-nav.ts`       | Mobile navigation menu toggle                                           |
| `header-scroll.ts`    | Header shrink/blur effect on scroll                                     |
| `card-click.ts`       | Entire post card clickable for navigation                               |
| `heading-anchors.ts`  | Anchor links on headings (hover to reveal)                              |
| `image-error.ts`      | Fallback image on load error                                            |
| `tabs.ts`             | Client-side tab switching for `{% tabs %}` tag plugin                   |

### SCSS Partials (`src/scss/`)

| Partial            | Purpose                                                      |
| ------------------ | ------------------------------------------------------------ |
| `main.scss`        | Entry point — imports all partials                           |
| `_variables.scss`  | CSS custom properties, colors, spacing, typography           |
| `_base.scss`       | Reset, typography, utility classes                           |
| `_header.scss`     | Site header with blur/scroll effects                         |
| `_sidebar.scss`    | Sidebar layout, profile, widgets, social links               |
| `_post.scss`       | Post card, article content, metadata                         |
| `_code.scss`       | Code blocks — gutter, line numbers, syntax highlighting      |
| `_music.scss`      | Music player card, controls, playlist panel                  |
| `_animation.scss`  | Entrance and transition animations                           |
| `_pjax.scss`       | PJAX loading bar animation                                   |
| `_search.scss`     | Search modal overlay and results                             |
| `_toc.scss`        | Table of contents with active heading highlight              |
| `_tabs.scss`       | Tab component styling                                        |
| `_comments.scss`   | Comment system containers                                    |
| `_footer.scss`     | Site footer                                                  |
| `_mobile-nav.scss` | Mobile slide-out navigation                                  |
| `_shion.scss`      | Shion character hero section                                 |
| `_dark.scss`       | Dark mode overrides (auto-applied via `[data-theme="dark"]`) |
| `_responsive.scss` | Responsive breakpoints and mobile layout                     |

## Contributing

1. **Fork & branch** — Fork the repo, create a feature branch from `master`
2. **Build & test** — `npm run build` must pass; verify with `npm run preview`
3. **Format** — `npm run format` before committing
4. **Commit** — Use clear commit messages
5. **Pull Request** — Open a PR to `master`

CI runs automatically via GitHub Actions on every push and PR — it checks formatting and builds the project.

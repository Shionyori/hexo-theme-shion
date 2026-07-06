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
│       └── widgets/    Sidebar widget partials (recent-posts, categories, tags, archives)
├── source/             Compiled output + static assets (CSS, JS, images)
├── languages/          i18n files (en, zh-CN, zh-TW, ja)
├── scripts/            Compiled server helpers (committed for direct theme use)
├── demo/               Standalone Hexo site for development & preview
├── tools/              Build utilities (sync, watch-client)
└── _config.yml         Theme default configuration
```

### Layout Templates

| Template                      | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `layout.ejs`                  | Root HTML shell (doctype, head, body, PJAX)  |
| `index.ejs`                   | Home page — post list                        |
| `post.ejs`                    | Single post — content, TOC, share, copyright |
| `page.ejs`                    | Generic page — title + Markdown content      |
| `friends.ejs`                 | Friends links page — card grid (see below)   |
| `archive.ejs`                 | Post archive — timeline by year              |
| `category.ejs` / `tag.ejs`    | Single category/tag — post list              |
| `categories.ejs` / `tags.ejs` | Category/tag index — list or cloud           |
| `404.ejs`                     | Not-found page with illustration             |

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

| Partial                  | Purpose                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `main.scss`              | Entry point — imports all partials                           |
| `_variables.scss`        | CSS custom properties, colors, spacing, typography           |
| `_reset.scss`            | CSS reset                                                    |
| `_typography.scss`       | Base typography                                              |
| `_layout.scss`           | Page layout, container, content wrapper                      |
| `_header.scss`           | Site header with blur/scroll effects                         |
| `_sidebar.scss`          | Sidebar cards — layout, profile, TOC, widgets                |
| `_post.scss`             | Post article content and metadata                            |
| `_post-list.scss`        | Post cards with cover images, excerpt, tags                  |
| `_code.scss`             | Code blocks — gutter, line numbers, syntax highlighting      |
| `_music.scss`            | Music player — controls, progress, playlist panel            |
| `_friends.scss`          | Friends links page — card grid with avatars                  |
| `_archive.scss`          | Archive timeline                                             |
| `_tag.scss`              | Tag cloud and tag links                                      |
| `_animation.scss`        | Entrance and transition animations                           |
| `_pjax.scss`             | PJAX loading bar animation                                   |
| `_search.scss`           | Search modal overlay and results                             |
| `_toc.scss`              | Table of contents with active heading highlight              |
| `_tabs.scss`             | Tab component styling                                        |
| `_comments.scss`         | Comment system containers                                    |
| `_footer.scss`           | Site footer                                                  |
| `_mobile-nav.scss`       | Mobile slide-out navigation                                  |
| `_shion.scss`            | Shion character hero section                                 |
| `_dark.scss`             | Dark mode overrides (auto-applied via `[data-theme="dark"]`) |
| `_responsive.scss`       | Responsive breakpoints and mobile layout                     |
| `_utilities.scss`        | Utility classes                                              |
| `_reading-progress.scss` | Reading progress bar                                         |
| `_content-elements.scss` | Rich content inside posts                                    |
| `_katex.scss`            | KaTeX math rendering                                         |

---

## Sidebar Architecture

The sidebar consists of independent **cards** — each a `<section class="sidebar-card">` that can be individually toggled via config. The `sidebar-sticky-group` wrapper handles `position: sticky` positioning only; it does not group content semantically.

### DOM Structure

**Non-post pages (home, archives, categories, friends, about):**

```
aside.site-sidebar
├── section.sidebar-card.sidebar-profile
│     avatar / author / bio / social links
│
└── div.sidebar-sticky-group          ← sticky positioning
    ├── section.sidebar-card.sidebar-music
    │     music player partial
    │
    └── section.sidebar-card.sidebar-widget   ← one per entry in sidebar.widgets
          widget partial (recent-posts / categories / tags / archives)
```

**Post pages:**

```
aside.site-sidebar.sidebar-post
└── div.sidebar-sticky-group
    ├── section.sidebar-card.sidebar-music
    └── section.sidebar-card.sidebar-toc    ← fills remaining space, scrolls internally
          .sidebar-toc-header  (home link + article title)
          .sidebar-scroll      (TOC nav, overflow-y: auto)
          .sidebar-back-home-bottom
```

### Configuration

```yaml
sidebar:
  enable: true # Master switch for entire sidebar
  position: left # left | right
  profile:
    enable: true # Toggle profile card
  avatar:
    enable: true
    image: /images/shion/avatar.png
  social:
    GitHub: https://github.com/
  widgets: # Toggle widget cards — list the ones you want
    - recent-posts
    # - categories-widget    # Uncomment to add categories card
    # - tags-widget          # Uncomment to add tag cloud card
    # - archives-widget      # Uncomment to add archives card
  recent_posts_count: 5

music:
  enable: false # Toggle music player card
```

### Per-Page Sidebar Configuration

Sidebar components are configured at three levels, resolved in `layout/_partial/sidebar.ejs`. The **primary** configuration is `sidebar.layouts` in `_config.shion.yml`:

```ejs
// Page type via Hexo helpers (page.layout is empty for generated pages)
var type = is_post()   ? 'post'
         : is_home()   ? 'index'
         : is_archive()? 'archive'
         : is_category()? 'categories'
         : is_tag()    ? 'tags'
         : page.layout || 'page';

var P = page.sidebar || {};                                // frontmatter (one-off override)
var L = (((theme.sidebar || {}).layouts) || {})[type] || {}; // layout-level (primary config)
var G = theme.sidebar || {};                               // global defaults

var cfg = function(key, fallback) {
  if (P[key] !== undefined) return P[key];                 // 1. frontmatter overrides all
  if (L[key] !== undefined) return L[key];                 // 2. layout-level config
  return fallback;                                         // 3. global default
};
```

The `enable` override is also checked in `layout/layout.ejs` to prevent rendering the `<aside>` element entirely when disabled.

**Why `is_*()` helpers?** Auto-generated pages (home, archive) have no `page.layout` — their page object comes from Hexo generators, not a `.md` file. The helpers correctly identify them.

**Primary config** — `_config.shion.yml` `sidebar.layouts` for all pages:

```yaml
sidebar:
  layouts:
    archive: { widgets: [] }
    friends: { widgets: [] }
    tags: { widgets: [] }
    categories: { widgets: [] }
    about: { widgets: [] }
    # index:      # unset = uses global widgets
```

**One-off override** — page frontmatter `sidebar:` (takes priority over layouts):

```yaml
---
title: Special
sidebar:
  music: false
---
```

### Available Widgets

| Widget key          | Partial file                    | Shows                                            |
| ------------------- | ------------------------------- | ------------------------------------------------ |
| `recent-posts`      | `widgets/recent-posts.ejs`      | N most recent posts with dates                   |
| `categories-widget` | `widgets/categories-widget.ejs` | Top 6 categories, "+N more" link to /categories/ |
| `tags-widget`       | `widgets/tags-widget.ejs`       | Top 9 tags as pills, "+N more" link to /tags/    |
| `archives-widget`   | `widgets/archives-widget.ejs`   | Last 12 months with post counts                  |

Overflow items (categories beyond 6, tags beyond 9) link to their full index page rather than expanding in-place. The sidebar is designed to be lightweight — full browsing happens on dedicated pages.

### Card Class Reference

| Class                   | Role                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| `.sidebar-card`         | Base card — surface, border, shadow, padding, entrance animation |
| `.sidebar-profile`      | Profile card variant                                             |
| `.sidebar-music`        | Music player card variant                                        |
| `.sidebar-widget`       | Widget card variant                                              |
| `.sidebar-toc`          | TOC card variant (post pages only)                               |
| `.sidebar-sticky-group` | Sticky positioning wrapper                                       |

### Entrance Animations

Cards fade in from below on page load. The CSS in `_animation.scss` uses `opacity: 0` + `translateY(20px)` with CSS transitions. JS (`animations.ts`) adds `.is-visible` via `requestAnimationFrame`, triggering the transition. Widget list items have an additional staggered cascade (each item delayed by 30ms).

---

## Friends Links Page

The friends page (`/friends/`) displays a responsive card grid of external links, driven entirely by page frontmatter.

### Setup

1. Create `source/friends/index.md`:

```markdown
---
layout: friends
title: 友链
friends:
  - name: Example Blog
    url: https://example.com
    avatar: https://example.com/avatar.jpg
    description: A great tech blog
  - name: Another Friend
    url: https://friend.com
    description: Life and code
---
```

2. Add `Friends: /friends/` to the `menu` section in `_config.yml`.

### Data Fields

| Field         | Required | Notes                                                |
| ------------- | -------- | ---------------------------------------------------- |
| `name`        | Yes      | Display name                                         |
| `url`         | Yes      | Link target. Cards without URL render as static text |
| `avatar`      | No       | Image URL. Falls back to first-character placeholder |
| `description` | No       | One-line description below the name                  |

### Behavior

- Avatar images that fail to load fall back to the name's first character (CSS-styled circle with primary color)
- Cards without a valid URL skip hover lift and are not clickable
- Links open in new tab (`target="_blank"` with `rel="noopener noreferrer"`)
- Empty state (no `friends` data or empty array) shows i18n message
- Comments are included below the grid (reuses existing comment system)

### Files

| File                     | Purpose                                            |
| ------------------------ | -------------------------------------------------- |
| `layout/friends.ejs`     | Layout — reads `page.friends`, renders card grid   |
| `src/scss/_friends.scss` | Responsive grid, avatar fallback, hover, dark mode |

---

## Contributing

1. **Fork & branch** — Fork the repo, create a feature branch from `master`
2. **Build & test** — `npm run build` must pass; verify with `npm run preview`
3. **Format** — `npm run format` before committing
4. **Commit** — Use clear commit messages
5. **Pull Request** — Open a PR to `master`

CI runs automatically via GitHub Actions on every push and PR — it checks formatting and builds the project.

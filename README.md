<p align="center">
  <img src="source/images/shion/avatar.png" width="128" alt="Shion">
</p>

<h1 align="center">hexo-theme-shion</h1>

<p align="center">
  A clean, content-first Hexo blog theme themed around Shion Yorigami (依神紫苑) from Touhou Project.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/hexo-7.x+-0E83CD?logo=hexo&style=flat-square" alt="Hexo 7.x+">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/badge/i18n-en|zh--CN|zh--TW|ja-6f42c1?style=flat-square" alt="i18n">
</p>

---

## ✨ Features

- 🌗 **Dark / Light mode** — auto-detect system preference, manual toggle (localStorage)
- 🌐 **Multi-language** — English, 简体中文, 繁體中文, 日本語
- 🔍 **Local search** — Fuse.js full-text search via `Ctrl+K` / `Cmd+K`
- 📑 **Table of contents** — auto-generated with IntersectionObserver scroll spy
- 💻 **Code highlighting** — highlight.js with light/dark theme, line numbers, copy button
- 📐 **KaTeX math** — LaTeX math rendering for technical posts
- 💬 **Comments** — Giscus, Disqus, Waline, Twikoo, Valine, Gitalk, Utterances
- 📊 **Analytics** — Google Analytics, Baidu Tongji, Busuanzi (site PV/UV)
- 🔗 **SEO** — Open Graph, Twitter Cards, JSON-LD structured data, canonical URLs
- 🏷️ **Tag plugins** — note, image, gallery, quote, details, tabs, link cards, post link cards
- 📖 **Reading time & word count** — auto-estimated per post
- 📱 **Responsive** — mobile-first layout with slide-out sidebar
- 🔼 **Back to top** — floating button with scroll-aware visibility
- 📡 **RSS ready** — compatible with `hexo-generator-feed`
- ⚠️ **Outdate warning** — configurable notice on posts older than N days
- 🎨 **Shion-themed** — color palette derived from the character, with decorative hero images

## 📦 Quick Start

### Prerequisites

- [Hexo](https://hexo.io/) ≥ 7.x
- Node.js ≥ 18

### Install

```bash
cd your-hexo-site

# Via git (recommended — easiest to receive updates)
git clone https://github.com/Shionyori/hexo-theme-shion themes/shion

# Or via npm
npm install hexo-theme-shion
```

### Enable

Edit your site's `_config.yml`:

```yaml
theme: shion
```

### Copy theme config

```bash
cp themes/shion/_config.yml _config.shion.yml
```

Edit `_config.shion.yml` to customize — this file takes precedence over the theme's default config.

## 📁 Content Organization

This theme works best with **post asset folders** enabled. Each post gets its own directory for its cover, inline images, and media.

### Enable post asset folders

In your site's `_config.yml`:

```yaml
post_asset_folder: true
```

### Recommended structure

```
source/
├── _posts/
│   ├── 2026-06-01-my-post.md
│   ├── 2026-06-01-my-post/          # hexo new auto-creates this
│   │   ├── cover.png                # ← post cover
│   │   ├── architecture-diagram.png # ← inline illustration
│   │   ├── screenshot.jpg           # ← inline illustration
│   │   └── bgm.mp3                  # ← embedded audio (future)
│   └── ...
├── images/
│   └── shion/                       # theme character images
│       ├── avatar.png               #   sidebar avatar
│       ├── hero.png                 #   homepage hero decoration
│       ├── bg.png                   #   page background
│       ├── 404.png                  #   404 page illustration
│       └── favicon.ico              #   browser tab icon
├── music/                           # global music (future)
│   ├── playlist/
│   └── bgm/
├── about/index.md
├── categories/index.md
└── tags/index.md
```

### Cover vs. inline images

Each post's asset folder holds **all** its images; only one is the cover:

| Image file | Role | How it's used |
|------------|------|---------------|
| `cover.png` (or `.jpg`, `.webp`, …) | **Cover** — displayed on the homepage card and post hero banner | Set in frontmatter: `cover: cover.png` |
| Everything else | **Inline** — illustrations, screenshots, diagrams within the article body | Referenced via `{% asset_img %}` tag in Markdown |

### Post frontmatter

```yaml
---
title: 'Post Title'
date: 2026-06-01 10:00:00
updated: 2026-06-05 14:00:00
tags:
  - Hexo
  - Tutorial
categories:
  - Tech/Frontend                    # supports parent/child categories
cover: cover.png                     # relative → post asset folder
sticky: false                        # pin to homepage (top)
toc: true                            # show table of contents
---
```

### Referencing inline images

Use the `asset_img` tag to embed images from the post's asset folder:

```njk
{% asset_img architecture-diagram.png "Architecture overview" %}
```

For global images (e.g. theme character images), use standard Markdown:

```markdown
![Shion](/images/shion/hero.png)
```

### Cover path resolution

| Cover value | Resolves to |
|-------------|-------------|
| `cover.png` | `/<post-permalink>/cover.png` (post asset folder) |
| `/images/shion/bg.png` | Site-root absolute path |
| `https://cdn.example.com/img.jpg` | External URL |

### Scaffold templates

When you run `hexo new post "Title"`, the generated frontmatter follows the scaffold at `scaffolds/post.md`. This theme's demo includes an enhanced scaffold — copy it to your site:

```bash
cp themes/shion/demo/scaffolds/post.md scaffolds/
cp themes/shion/demo/scaffolds/draft.md scaffolds/
```

## ⚙️ Configuration Reference

### Site Identity

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `favicon` | `string` | `/images/shion/favicon.ico` | Browser tab icon |
| `logo.text` | `string` | `null` | Site title in header (uses `config.title` if null) |
| `logo.image` | `string` | `null` | Logo image in header (overrides text) |

### Navigation

```yaml
menu:
  Home: /
  Archives: /archives/
  Tags: /tags/
  Categories: /categories/
  About: /about/
```

Add or remove items freely — key is the label, value is the URL path.

### Appearance

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `appearance.default_mode` | `auto \| light \| dark` | `auto` | Default color scheme |
| `appearance.font_size` | `string` | `16px` | Base font size |
| `appearance.code_theme` | `auto \| light \| dark` | `auto` | Code block color scheme |
| `appearance.reading_progress` | `boolean` | `true` | Reading progress bar at page top |

### Home Page

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `home.posts_per_page` | `number` | `10` | Posts per page (overrides Hexo `per_page` for index) |
| `home.display_excerpt` | `boolean` | `true` | Show excerpt instead of full content |
| `home.excerpt_length` | `number` | `280` | Max characters in auto-excerpt |

### Post

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `post.toc` | `boolean` | `true` | Show table of contents |
| `post.toc_max_depth` | `number` | `3` | Maximum heading depth in TOC |
| `post.copyright` | `boolean` | `true` | Show copyright notice at end of post |
| `post.reading_time` | `boolean` | `true` | Show estimated reading time |
| `post.word_count` | `boolean` | `true` | Show word count |
| `post.date_format` | `string` | `YYYY-MM-DD` | Date display format (Moment.js) |
| `post.cover.enable` | `boolean` | `true` | Enable cover images on posts |
| `post.cover.default` | `string` | `null` | Fallback cover when post has none |
| `post.share.enable` | `boolean` | `true` | Show social share buttons |
| `post.share.platforms` | `string[]` | `['twitter','facebook','linkedin','copy']` | Enabled share platforms |
| `post.copyright_license` | `string` | `CC BY-NC-SA 4.0` | License name displayed |
| `post.code.highlight` | `string` | `highlight.js` | Code highlighter |
| `post.code.line_numbers` | `boolean` | `true` | Show line numbers |
| `post.code.copy_button` | `boolean` | `true` | Show copy-to-clipboard button |
| `post.math.enable` | `boolean` | `false` | Enable KaTeX math rendering |
| `post.image.lazy_load` | `boolean` | `true` | Native lazy loading for images |
| `post.image.fancybox` | `boolean` | `true` | Click-to-zoom image lightbox |

### Sidebar

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `sidebar.enable` | `boolean` | `true` | Show sidebar |
| `sidebar.position` | `left \| right` | `left` | Sidebar position |
| `sidebar.avatar.enable` | `boolean` | `true` | Show author avatar |
| `sidebar.avatar.image` | `string` | `/images/shion/avatar.png` | Avatar image path |
| `sidebar.social` | `object` | `{ GitHub: '...' }` | Social link icons (key → URL) |
| `sidebar.widgets` | `string[]` | `['recent-posts','categories-widget','tags-widget']` | Widget display order |
| `sidebar.recent_posts_count` | `number` | `5` | Number of recent posts in widget |
| `sidebar.tagcloud_min_font` | `number` | `1.2` | Tag cloud min font size (rem) |
| `sidebar.tagcloud_max_font` | `number` | `2.8` | Tag cloud max font size (rem) |

Available social icon keys: `GitHub`, `Twitter`, `Facebook`, `Instagram`, `YouTube`, `Bilibili`, `Email`, `RSS`, `Steam`, `Discord`, `Telegram`, `LinkedIn`, `Weibo`, `Zhihu`, `Douban`, `NPM`, `Patreon`, `Reddit`, `Twitch`, `Spotify`, `Medium`, `CodePen`, `GitLab`, `StackOverflow`, `Mastodon`.

Available widgets: `recent-posts`, `categories-widget`, `tags-widget`, `tagcloud`, `archives-widget`.

### Comments

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `comments.enable` | `boolean` | `false` | Enable comments globally |
| `comments.type` | `string` | `giscus` | Comment system: `giscus`, `disqus`, `waline`, `twikoo`, `valine`, `gitalk`, `utterances` |

Each system has its own config block — see `_config.yml` for full per-system options.

### Analytics

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `analytics.google` | `string` | `null` | Google Analytics Measurement ID (e.g. `G-XXXXXXXXXX`) |
| `analytics.baidu` | `string` | `null` | Baidu Tongji site ID |

### Search

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `search.enable` | `boolean` | `true` | Enable local search |
| `search.type` | `string` | `local` | Search engine type |

Keyboard shortcut: `Ctrl+K` (Windows/Linux) or `Cmd+K` (macOS).

### Footer

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `footer.since` | `string` | `null` | Start year for copyright (e.g. `2024` → `2024 - 2026`) |
| `footer.powered_by` | `boolean` | `true` | Show "Powered by Hexo" |
| `footer.theme_by` | `boolean` | `true` | Show "Theme - Shion" |
| `footer.icp` | `string` | `null` | ICP filing number (China) |

### Shion Theme Character

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `shion.hero_enable` | `boolean` | `true` | Show hero section on homepage |
| `shion.hero_image` | `string` | `/images/shion/hero.png` | Hero decorative image |
| `shion.background_image` | `string` | `/images/shion/bg.png` | Page background decoration |
| `shion.404_image` | `string` | `/images/shion/404.png` | 404 page illustration |

### Outdate Warning

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `outdate.enable` | `boolean` | `true` | Warn on old posts |
| `outdate.days` | `number` | `365` | Days before a post is considered outdated |

### Busuanzi

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `busuanzi.enable` | `boolean` | `false` | Enable Busuanzi visitor counting |
| `busuanzi.site_uv` | `boolean` | `true` | Show unique visitors |
| `busuanzi.site_pv` | `boolean` | `true` | Show page views |

### Advanced

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `custom_css` | `string` | `null` | Path to custom CSS file |
| `custom_js` | `string` | `null` | Path to custom JS file |
| `cdn.highlightjs` | `string` | jsDelivr CDN URL | highlight.js CDN base URL |
| `cdn.katex` | `string` | jsDelivr CDN URL | KaTeX CDN base URL |
| `cdn.fusejs` | `string` | jsDelivr CDN URL | Fuse.js CDN base URL |

## 🏷️ Tag Plugins

The theme ships with custom tag plugins for rich content. Use them in your Markdown posts:

### Note

```njk
{% note info %}
This is an informational note.
{% endnote %}

{% note warning %}
Heads up! This action is irreversible.
{% endnote %}

{% note success %}
Operation completed successfully.
{% endnote %}

{% note danger %}
Critical: backup your data first.
{% endnote %}
```

### Image

```njk
{% image /path/to/image.jpg "Alt text" "Optional caption" %}
```

### Gallery

```njk
{% gallery %}
{% asset_img photo1.jpg %}
{% asset_img photo2.jpg %}
{% asset_img photo3.jpg %}
{% endgallery %}
```

### Quote

```njk
{% quote "Author Name" "Source Title" %}
The quoted text goes here.
{% endquote %}
```

### Details (Collapsible)

```njk
{% details "Click to expand" %}
Hidden content revealed on click.
{% enddetails %}
```

### Tabs

```njk
{% tabs "Tab Group Name" %}
<!-- tab Tab One -->
Content for the first tab.

<!-- tab Tab Two -->
Content for the second tab.
{% endtabs %}
```

### Link Card

```njk
{% linkCard "https://example.com" "Title" "Description" %}
```

### Post Link Card

```njk
{% postLinkCard "hello-world" %}
```

> **Tip:** When using `post_asset_folder: true`, reference post-local images with `{% asset_img filename.png "alt" %}`.

## 💬 Comment Systems

| System | Key | Setup Difficulty | Notes |
|--------|-----|:----------------:|-------|
| [Giscus](https://giscus.app/) | `giscus` | Easy | GitHub Discussions-based, no backend |
| [Disqus](https://disqus.com/) | `disqus` | Easy | Most widely used |
| [Waline](https://waline.js.org/) | `waline` | Moderate | Self-hosted, LeanCloud or Vercel |
| [Twikoo](https://twikoo.js.org/) | `twikoo` | Moderate | Self-hosted, Tencent CloudBase or Vercel |
| [Valine](https://valine.js.org/) | `valine` | Easy | LeanCloud-based, serverless |
| [Gitalk](https://github.com/gitalk/gitalk) | `gitalk` | Easy | GitHub Issues-based |
| [Utterances](https://utteranc.es/) | `utterances` | Easy | GitHub Issues-based |

```yaml
comments:
  enable: true
  type: giscus                                       # choose one
  giscus:
    repo: 'your-username/your-repo'
    repo_id: 'R_kgXXXXXXX'
    category: 'Comments'
    category_id: 'DIC_XXXXXXX'
```

## 🔧 Development

```bash
git clone https://github.com/Shionyori/hexo-theme-shion.git
cd hexo-theme-shion
npm install

npm run build         # Build all: TS → scripts/ + client JS + SCSS → CSS
npm run dev           # Watch mode — auto-rebuild + demo server on localhost:4000
npm run preview       # Full preview: clean build → generate → serve
npm run demo:server   # Start Hexo server in demo/ only
npm run format        # Format with Prettier
```

### Project Structure

```
hexo-theme-shion/
├── src/
│   ├── ts/               Server-side TypeScript (helpers, filters, generators, tags)
│   ├── client/           Browser-side TypeScript (theme, search, sidebar, TOC, etc.)
│   └── scss/             SCSS stylesheets (20+ partials, dark mode, responsive)
├── layout/               EJS templates (layout, partials, page types)
│   └── _partial/         Reusable components (header, footer, sidebar, comments, etc.)
├── source/               Compiled output + static assets (CSS, JS, images)
├── languages/            i18n files (en, zh-CN, zh-TW, ja)
├── scripts/              Compiled server helpers (committed for direct theme use)
├── demo/                 Standalone Hexo site for development & preview
├── tools/                Build utilities (sync, watch-client)
└── _config.yml           Theme default configuration
```

## 🤝 Contributing

This project uses **GitHub Flow**:

1. **Fork & branch** — Fork the repo, create a feature branch from `master`
2. **Build & test** — `npm run build` must pass; preview with `npm run preview`
3. **Commit** — Write clear commit messages describing what and why
4. **Pull Request** — Open a PR to `master`, fill out the PR template
5. **Review** — Address feedback; CI must pass before merge

> **Before opening a PR:** run `npm run format` to ensure consistent code style.

CI runs automatically via GitHub Actions (`.github/workflows/ci.yml`).

## 🙏 Credits

- **Shion Yorigami** (依神紫苑) — character by ZUN / Team Shanghai Alice (上海アリス幻樂団)
- Theme design inspired by modern tech blog aesthetics
- Built with [Hexo](https://hexo.io/), [Sass](https://sass-lang.com/), and [TypeScript](https://www.typescriptlang.org/)

## 📄 License

[MIT](LICENSE) © Shionyori

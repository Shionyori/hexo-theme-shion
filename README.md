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

- 🌗 **Dark / Light mode** — auto-detect system preference with manual toggle (localStorage)
- 🌐 **Multi-language** — English, 简体中文, 繁體中文, 日本語
- 🔍 **Local search** — Fuse.js full-text search via `Ctrl+K` / `Cmd+K`
- 📑 **Table of contents** — auto-generated with IntersectionObserver scroll spy
- 💻 **Code highlighting** — highlight.js with light/dark themes, line numbers, copy-to-clipboard button
- 📐 **KaTeX math** — LaTeX rendering for technical posts
- 🖼️ **Image features** — lazy loading, click-to-zoom lightbox, flexible `{% image %}` tag plugin
- 🏷️ **Rich tag plugins** — note, image, quote, details, tabs, link cards, post link cards
- 💬 **Comments** — Giscus, Disqus, Waline, Twikoo, Valine, Gitalk, Utterances (lazy-loaded)
- 📊 **Analytics** — Google Analytics, Baidu Tongji, Busuanzi (site PV/UV)
- 🔗 **SEO** — Open Graph, Twitter Cards, JSON-LD structured data, canonical URLs
- 📖 **Reading time & word count** — CJK-aware estimation per post
- 📱 **Responsive** — mobile-first layout with slide-out sidebar
- 🎨 **Custom fonts** — override heading/body/code font families from config
- 🔼 **Back to top** — floating button with scroll-aware visibility
- 📡 **RSS ready** — compatible with `hexo-generator-feed`
- ⚠️ **Outdate warning** — configurable notice on posts older than N days
- ✨ **Entrance animations** — staggered fade-in for cards, sidebar, and post sections

## 📦 Quick Start

### Prerequisites

- [Hexo](https://hexo.io/) ≥ 7.x
- Node.js ≥ 18

### Install

```bash
cd your-hexo-site

# Via git (recommended)
git clone https://github.com/Shionyori/hexo-theme-shion themes/shion
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

Edit `_config.shion.yml` to customize — Hexo merges this over the theme defaults.

---

## ⚙️ Configuration Reference

### Site Identity

| Key          | Type     | Default                     | Description                                         |
| ------------ | -------- | --------------------------- | --------------------------------------------------- |
| `favicon`    | `string` | `/images/shion/favicon.ico` | Browser tab icon                                    |
| `logo.text`  | `string` | `null`                      | Site title in header (falls back to `config.title`) |
| `logo.image` | `string` | `null`                      | Logo image in header (overrides text)               |

### Navigation

```yaml
menu:
  Home: /
  Archives: /archives/
  Tags: /tags/
  Categories: /categories/
  About: /about/
```

Key = label, value = URL. Add or remove items freely.

### Fonts

Override heading, body, and code font families. Leave empty to use theme defaults.

| Key               | Type     | Default | Description         |
| ----------------- | -------- | ------- | ------------------- |
| `fonts.heading`   | `string` | `null`  | Heading font family |
| `fonts.body`      | `string` | `null`  | Body font family    |
| `fonts.code`      | `string` | `null`  | Code font family    |
| `fonts.size_root` | `string` | `15px`  | Base font size      |

> To use external fonts (Google Fonts, etc.), inject `<link>` tags via `custom_css` or your site's `head` injection.

### Appearance

| Key                           | Type                    | Default | Description                      |
| ----------------------------- | ----------------------- | ------- | -------------------------------- |
| `appearance.default_mode`     | `auto \| light \| dark` | `auto`  | Default color scheme             |
| `appearance.code_theme`       | `auto \| light \| dark` | `auto`  | Code block color scheme          |
| `appearance.reading_progress` | `boolean`               | `true`  | Reading progress bar at page top |

### Home Page

| Key                    | Type      | Default | Description                          |
| ---------------------- | --------- | ------- | ------------------------------------ |
| `home.posts_per_page`  | `number`  | `10`    | Posts per page                       |
| `home.display_excerpt` | `boolean` | `true`  | Show excerpt instead of full content |
| `home.excerpt_length`  | `number`  | `280`   | Max characters in auto-excerpt       |

### Post

| Key                          | Type       | Default                                              | Description                     |
| ---------------------------- | ---------- | ---------------------------------------------------- | ------------------------------- |
| `post.toc`                   | `boolean`  | `true`                                               | Show table of contents          |
| `post.toc_max_depth`         | `number`   | `3`                                                  | Maximum heading depth in TOC    |
| `post.copyright`             | `boolean`  | `true`                                               | Show copyright notice           |
| `post.reading_time`          | `boolean`  | `true`                                               | Show estimated reading time     |
| `post.word_count`            | `boolean`  | `true`                                               | Show word count                 |
| `post.date_format`           | `string`   | `YYYY-MM-DD`                                         | Date format (Moment.js)         |
| `post.cover.enable`          | `boolean`  | `true`                                               | Show cover images               |
| `post.cover.default`         | `string`   | `/images/shion/default-cover.png`                    | Fallback cover                  |
| `post.share.enable`          | `boolean`  | `true`                                               | Show share buttons              |
| `post.share.platforms`       | `string[]` | `['twitter','facebook','linkedin','copy']`           | Enabled platforms               |
| `post.copyright_license`     | `string`   | `CC BY-NC-SA 4.0`                                    | License name                    |
| `post.copyright_license_url` | `string`   | `https://creativecommons.org/licenses/by-nc-sa/4.0/` | License URL                     |
| `post.code.highlight`        | `string`   | `highlight.js`                                       | Code highlighter                |
| `post.code.line_numbers`     | `boolean`  | `true`                                               | Show line numbers               |
| `post.code.copy_button`      | `boolean`  | `true`                                               | Show copy button on code blocks |
| `post.math.enable`           | `boolean`  | `true`                                               | Enable KaTeX math               |
| `post.math.delimiters`       | `array`    | `$$` (display), `$` (inline)                         | KaTeX delimiter pairs           |
| `post.image.lazy_load`       | `boolean`  | `true`                                               | Native lazy loading             |
| `post.image.lightbox`        | `boolean`  | `true`                                               | Click-to-zoom (medium-zoom)     |

### Sidebar

| Key                          | Type            | Default                                              | Description                   |
| ---------------------------- | --------------- | ---------------------------------------------------- | ----------------------------- |
| `sidebar.enable`             | `boolean`       | `true`                                               | Show sidebar                  |
| `sidebar.position`           | `left \| right` | `left`                                               | Sidebar position              |
| `sidebar.avatar.enable`      | `boolean`       | `true`                                               | Show author avatar            |
| `sidebar.avatar.image`       | `string`        | `/images/shion/avatar.png`                           | Avatar image path             |
| `sidebar.social`             | `object`        | `{ GitHub: '...' }`                                  | Social links (key → URL)      |
| `sidebar.widgets`            | `string[]`      | `['recent-posts','categories-widget','tags-widget']` | Widget display order          |
| `sidebar.recent_posts_count` | `number`        | `5`                                                  | Recent posts to show          |
| `sidebar.tagcloud_min_font`  | `number`        | `1.2`                                                | Tag cloud min font size (rem) |
| `sidebar.tagcloud_max_font`  | `number`        | `2.8`                                                | Tag cloud max font size (rem) |

Available social icon keys: `GitHub`, `Twitter`, `Facebook`, `Instagram`, `YouTube`, `Bilibili`, `Email`, `RSS`, `Steam`, `Discord`, `Telegram`, `LinkedIn`, `Weibo`, `Zhihu`, `Douban`, `NPM`, `Patreon`, `Reddit`, `Twitch`, `Spotify`, `Medium`, `CodePen`, `GitLab`, `StackOverflow`, `Mastodon`.

Available widgets: `recent-posts`, `categories-widget`, `tags-widget`, `tagcloud`, `archives-widget`.

### Comments

| Key               | Type      | Default  | Description                                                                      |
| ----------------- | --------- | -------- | -------------------------------------------------------------------------------- |
| `comments.enable` | `boolean` | `false`  | Enable comments                                                                  |
| `comments.type`   | `string`  | `giscus` | System: `giscus`, `disqus`, `waline`, `twikoo`, `valine`, `gitalk`, `utterances` |

Each system has its own config block — see `_config.yml` for full per-system options.

### Analytics

| Key                | Type     | Default | Description                     |
| ------------------ | -------- | ------- | ------------------------------- |
| `analytics.google` | `string` | `null`  | Google Analytics Measurement ID |
| `analytics.baidu`  | `string` | `null`  | Baidu Tongji site ID            |

### Search

| Key             | Type      | Default | Description         |
| --------------- | --------- | ------- | ------------------- |
| `search.enable` | `boolean` | `true`  | Enable local search |
| `search.type`   | `string`  | `local` | Search engine type  |

Keyboard shortcut: `Ctrl+K` / `Cmd+K`.

### Footer

| Key                 | Type      | Default | Description                                        |
| ------------------- | --------- | ------- | -------------------------------------------------- |
| `footer.since`      | `string`  | `null`  | Copyright start year (e.g. `2024` → `2024 – 2026`) |
| `footer.powered_by` | `boolean` | `true`  | Show "Powered by Hexo"                             |
| `footer.theme_by`   | `boolean` | `true`  | Show "Theme — Shion"                               |
| `footer.icp`        | `string`  | `null`  | ICP filing number (China)                          |

### Shion Character

| Key                      | Type      | Default                  | Description                   |
| ------------------------ | --------- | ------------------------ | ----------------------------- |
| `shion.hero_enable`      | `boolean` | `true`                   | Show hero section on homepage |
| `shion.hero_image`       | `string`  | `/images/shion/hero.png` | Hero decorative image         |
| `shion.background_image` | `string`  | `/images/shion/bg.png`   | Page background decoration    |
| `shion.404_image`        | `string`  | `/images/shion/404.png`  | 404 page illustration         |

### Outdate Warning

| Key              | Type      | Default | Description                               |
| ---------------- | --------- | ------- | ----------------------------------------- |
| `outdate.enable` | `boolean` | `true`  | Warn on old posts                         |
| `outdate.days`   | `number`  | `365`   | Days before a post is considered outdated |

### Busuanzi

| Key                | Type      | Default | Description             |
| ------------------ | --------- | ------- | ----------------------- |
| `busuanzi.enable`  | `boolean` | `false` | Enable visitor counting |
| `busuanzi.site_uv` | `boolean` | `true`  | Show unique visitors    |
| `busuanzi.site_pv` | `boolean` | `true`  | Show page views         |

### Advanced

| Key               | Type     | Default      | Description                 |
| ----------------- | -------- | ------------ | --------------------------- |
| `custom_css`      | `string` | `null`       | Custom CSS (path or inline) |
| `custom_js`       | `string` | `null`       | Custom JS (path or inline)  |
| `cdn.highlightjs` | `string` | jsDelivr URL | highlight.js CDN base       |
| `cdn.katex`       | `string` | jsDelivr URL | KaTeX CDN base              |
| `cdn.fusejs`      | `string` | jsDelivr URL | Fuse.js CDN base            |

---

## 📁 Content Organization

This theme works best with **post asset folders** enabled.

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
│   ├── 2026-06-01-my-post/          # auto-created by `hexo new`
│   │   ├── cover.png                # post cover
│   │   ├── diagram.png              # inline illustration
│   │   └── screenshot.jpg           # inline illustration
│   └── ...
├── images/
│   └── shion/                       # theme character images
│       ├── avatar.png
│       ├── hero.png
│       ├── bg.png
│       ├── 404.png
│       └── favicon.ico
├── about/index.md
├── categories/index.md
└── tags/index.md
```

### Cover images

| Cover value in frontmatter        | Resolves to                                       |
| --------------------------------- | ------------------------------------------------- |
| `cover.png`                       | `/<post-permalink>/cover.png` (post asset folder) |
| `/images/custom.jpg`              | Site-root absolute path                           |
| `https://cdn.example.com/img.jpg` | External URL                                      |

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
  - Tech/Frontend # supports parent/child
cover: cover.png # relative → post asset folder
toc: true # show table of contents
---
```

### Scaffold templates

Copy the enhanced scaffolds to your site:

```bash
cp themes/shion/demo/scaffolds/post.md scaffolds/
cp themes/shion/demo/scaffolds/draft.md scaffolds/
```

---

## 🏷️ Tag Plugins

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
{% image src=cover.png alt=Cover caption=Title %}
{% image src=photo.jpg alt=Photo size=600 %}
{% image src=diagram.png alt=Diagram align=center nozoom=true %}
```

Named params: `src`, `alt`, `caption`, `size` (`width height`), `align` (`left|right|center`), `nozoom`, `inline`, `class`.

### Quote

```njk
{% blockquote "Author" "Source" %}
The quoted text goes here.
{% endblockquote %}
```

### Details (Collapsible)

```njk
{% details "Click to expand" %}
Hidden content revealed on click.
{% enddetails %}
```

### Tabs

```njk
{% tabs %}
<!-- tab "First Tab" -->
Content for the first tab.

<!-- tab "Second Tab" -->
Content for the second tab.
{% endtabs %}
```

### Link Card

```njk
{% linkCard "https://example.com" "Title" "Description" %}
```

### Post Link Card

```njk
{% postLinkCard "post-slug" %}
```

> Use `{% asset_img filename.png "alt" %}` to reference images from the post asset folder.

---

## 💬 Comment Systems

| System                                     | Key          |  Setup   | Notes                                    |
| ------------------------------------------ | ------------ | :------: | ---------------------------------------- |
| [Giscus](https://giscus.app/)              | `giscus`     |   Easy   | GitHub Discussions-based                 |
| [Disqus](https://disqus.com/)              | `disqus`     |   Easy   | Most widely used                         |
| [Waline](https://waline.js.org/)           | `waline`     | Moderate | Self-hosted, LeanCloud or Vercel         |
| [Twikoo](https://twikoo.js.org/)           | `twikoo`     | Moderate | Self-hosted, Tencent CloudBase or Vercel |
| [Valine](https://valine.js.org/)           | `valine`     |   Easy   | LeanCloud-based, serverless              |
| [Gitalk](https://github.com/gitalk/gitalk) | `gitalk`     |   Easy   | GitHub Issues-based                      |
| [Utterances](https://utteranc.es/)         | `utterances` |   Easy   | GitHub Issues-based                      |

```yaml
comments:
  enable: true
  type: giscus
  giscus:
    repo: 'your-username/your-repo'
    repo_id: 'R_kgXXXXXXX'
    category: 'Comments'
    category_id: 'DIC_XXXXXXX'
```

---

## 🔧 Development

```bash
git clone https://github.com/Shionyori/hexo-theme-shion.git
cd hexo-theme-shion
npm install

npm run build          # Build all: TS → scripts/ + client JS + SCSS → CSS
npm run dev            # Watch mode — auto-rebuild + demo server on localhost:4000
npm run preview        # Full preview: clean → build → sync → generate → serve
npm run format         # Format with Prettier
```

### Project Structure

```
hexo-theme-shion/
├── src/
│   ├── ts/               Server-side TypeScript (helpers, filters, generators, tags)
│   ├── client/           Browser TypeScript (theme, search, sidebar, TOC, etc.)
│   └── scss/             SCSS stylesheets (20+ partials, dark mode, responsive)
├── layout/               EJS templates
│   └── _partial/         Reusable components (header, footer, sidebar, comments, etc.)
├── source/               Compiled output + static assets (CSS, JS, images)
├── languages/            i18n files (en, zh-CN, zh-TW, ja)
├── scripts/              Compiled server helpers (committed for direct theme use)
├── demo/                 Standalone Hexo site for development & preview
├── tools/                Build utilities (sync, watch-client)
└── _config.yml           Theme default configuration
```

---

## 🤝 Contributing

1. **Fork & branch** — Fork the repo, create a feature branch from `master`
2. **Build & test** — `npm run build` must pass; verify with `npm run preview`
3. **Format** — `npm run format` before committing
4. **Commit** — Use clear commit messages
5. **Pull Request** — Open a PR to `master`; CI must pass

CI runs automatically via GitHub Actions on every push and PR.

---

## 🙏 Credits

- **Shion Yorigami** (依神紫苑) — character by ZUN / Team Shanghai Alice (上海アリス幻樂団)
- Theme design inspired by modern tech blog aesthetics
- Built with [Hexo](https://hexo.io/), [Sass](https://sass-lang.com/), and [TypeScript](https://www.typescriptlang.org/)

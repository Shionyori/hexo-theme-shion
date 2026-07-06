# Configuration Reference

All theme settings live in `_config.shion.yml` (or the theme's `_config.yml` for defaults). Hexo deep-merges your site-level config over the theme defaults.

## Site Identity

| Key          | Type     | Default                     | Description                                         |
| ------------ | -------- | --------------------------- | --------------------------------------------------- |
| `favicon`    | `string` | `/images/shion/favicon.png` | Browser tab icon                                    |
| `logo.text`  | `string` | `null`                      | Site title in header (falls back to `config.title`) |
| `logo.image` | `string` | `null`                      | Logo image in header (overrides text)               |

## Navigation

```yaml
menu:
  Home: /
  Archives: /archives/
  Tags: /tags/
  Categories: /categories/
  About: /about/
```

Key = label, value = URL. Add or remove items freely.

## Fonts

Override heading, body, and code font families. Leave empty to use theme SCSS defaults. External font loading (Google Fonts, etc.) must be handled by you via `custom_css` or injecting `<link>` tags into the site header.

| Key               | Type     | Default   | Description         |
| ----------------- | -------- | --------- | ------------------- |
| `fonts.heading`   | `string` | see below | Heading font family |
| `fonts.body`      | `string` | see below | Body font family    |
| `fonts.code`      | `string` | see below | Code font family    |
| `fonts.size_root` | `string` | `15px`    | Base font size      |

Theme defaults:

- Heading: `'Noto Serif SC', 'Source Han Serif SC', Georgia, serif`
- Body: `'Noto Sans SC', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Code: `'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace`

## Appearance

| Key                           | Type                    | Default | Description                                   |
| ----------------------------- | ----------------------- | ------- | --------------------------------------------- |
| `appearance.default_mode`     | `auto \| light \| dark` | `auto`  | Default color scheme                          |
| `appearance.code_theme`       | `auto \| light \| dark` | `auto`  | Code block color scheme                       |
| `appearance.reading_progress` | `boolean`               | `true`  | Reading progress bar at page top              |
| `appearance.font_size`        | `string`                | `null`  | **Deprecated.** Use `fonts.size_root` instead |

## Home Page

| Key                    | Type      | Default | Description                          |
| ---------------------- | --------- | ------- | ------------------------------------ |
| `home.posts_per_page`  | `number`  | `10`    | Posts per page                       |
| `home.display_excerpt` | `boolean` | `true`  | Show excerpt instead of full content |
| `home.excerpt_length`  | `number`  | `280`   | Max characters in auto-excerpt       |

## Post

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
| `post.math.enable`           | `boolean`  | `true`                                               | Enable KaTeX math rendering     |
| `post.math.engine`           | `string`   | `katex`                                              | Math engine (currently `katex`) |
| `post.math.delimiters`       | `array`    | `$$` (display), `$` (inline)                         | KaTeX delimiter pairs           |
| `post.image.lazy_load`       | `boolean`  | `true`                                               | Native lazy loading             |
| `post.image.lightbox`        | `boolean`  | `true`                                               | Click-to-zoom (medium-zoom)     |

> **Per-post math control:** Set `math: true` or `math: false` in a post's frontmatter to override the global `post.math.enable` setting.

## Sidebar

| Key                          | Type            | Default                                              | Description                   |
| ---------------------------- | --------------- | ---------------------------------------------------- | ----------------------------- |
| `sidebar.enable`             | `boolean`       | `true`                                               | Show sidebar                  |
| `sidebar.position`           | `left \| right` | `left`                                               | Sidebar position              |
| `sidebar.avatar.enable`      | `boolean`       | `true`                                               | Show author avatar            |
| `sidebar.avatar.image`       | `string`        | `/images/shion/avatar.png`                           | Avatar image path             |
| `sidebar.social`             | `object`        | `{ GitHub: '...' }`                                  | Social links (key → URL)      |
| `sidebar.widgets`            | `string[]`      | `['recent-posts']`                                   | Widget display order          |
| `sidebar.recent_posts_count` | `number`        | `5`                                                  | Recent posts to show          |
| `sidebar.tagcloud_min_font`  | `number`        | `1.2`                                                | Tag cloud min font size (rem) |
| `sidebar.tagcloud_max_font`  | `number`        | `2.8`                                                | Tag cloud max font size (rem) |

### Social Icon Keys

`GitHub`, `Twitter`, `Facebook`, `Instagram`, `YouTube`, `Bilibili`, `Email`, `RSS`, `Steam`, `Discord`, `Telegram`, `LinkedIn`, `Weibo`, `Zhihu`, `Douban`, `NPM`, `Patreon`, `Reddit`, `Twitch`, `Spotify`, `Medium`, `CodePen`, `GitLab`, `StackOverflow`, `Mastodon`

### Available Widgets

`recent-posts`, `categories-widget`, `tags-widget`, `tagcloud`, `archives-widget`

### Per-Layout Sidebar

For pages that are auto-generated by Hexo and don't have a source `.md` file — notably the home page and archive page — use `sidebar.layouts` to configure the sidebar. This also works as a second-level default for any page type.

```yaml
sidebar:
  layouts:
    archive:            # Archive page
      widgets: []
    index:              # Home page
      widgets:
        - recent-posts
        - categories-widget
        - tags-widget
```

**Layout keys** (based on Hexo's page type detection):

| Key | Page | Detection |
|-----|------|-----------|
| `index` | Home page | `is_home()` |
| `archive` | Archives | `is_archive()` |
| `categories` | Categories index | `is_category()` |
| `tags` | Tags index | `is_tag()` |
| `post` | Post pages | `is_post()` |
| `friends` / `about` / `page` | Other pages | `page.layout` |

Each layout config supports the same keys: `enable`, `profile`, `music`, `widgets`. All optional — unset keys fall back to the global `sidebar.*` settings.

**Priority (highest to lowest):**
1. Page frontmatter `page.sidebar.*` — for pages with `.md` source files
2. `sidebar.layouts.<type>.*` — per-layout defaults
3. Global `sidebar.*` — site-wide fallback

### Per-Page Sidebar

You can override the global sidebar settings on any page via frontmatter. This is useful for customizing which components appear on specific pages — for example, showing all widgets on the home page, but only a subset on the friends page.

```yaml
---
title: My Page
sidebar:
  enable: true        # Override theme.sidebar.enable (optional)
  profile: false      # Show/hide the profile card (optional)
  music: true         # Show/hide the music player (optional)
  widgets:            # Override the widget list (optional)
    - recent-posts
    - tagcloud
---
```

All four keys (`enable`, `profile`, `music`, `widgets`) are optional. Unset keys fall back through `sidebar.layouts.<type>.*` (if configured), then to the global `sidebar.*` / `music.*` defaults.

> **Note:** Auto-generated pages (home, archive) have no `page.sidebar` — their page object is created by Hexo generators, not from a `.md` file. For these pages, use `sidebar.layouts` in `_config.shion.yml` instead.

| Key        | Type       | Global fallback                 | Description                          |
| ---------- | ---------- | ------------------------------- | ------------------------------------ |
| `enable`   | `boolean`  | `sidebar.enable`                | Show/hide the entire sidebar         |
| `profile`  | `boolean`  | `sidebar.profile.enable`        | Show/hide the profile card           |
| `music`    | `boolean`  | `music.enable`                  | Show/hide the music player           |
| `widgets`  | `string[]` | `sidebar.widgets`               | Widgets to display (empty = none)    |

**Examples:**

Hide the sidebar on a specific page:

```yaml
sidebar:
  enable: false
```

Show only profile and music (no widgets):

```yaml
sidebar:
  widgets: []
```

Show only the recent-posts widget on the friends page:

```yaml
sidebar:
  widgets:
    - recent-posts
```

Enable music on a page even when it's globally disabled:

```yaml
sidebar:
  music: true
```

> **Note:** On post pages (`layout: post`), the sidebar always shows the table of contents (TOC) instead of profile and widgets. The `profile` and `widgets` keys have no effect on post pages, but `enable` (to hide the sidebar entirely) and `music` (to toggle the player) still work.

## Friends Links Page

The theme includes a dedicated friends/buddy links page (`layout: friends`) that displays a responsive card grid of external links.

### Setup

Create `source/friends/index.md`:

```yaml
---
title: 友链
layout: friends
friends:
  - name: Example Blog
    url: https://example.com
    avatar: https://example.com/avatar.jpg
    description: A great tech blog
  - name: Another Friend
    url: https://friend.com
    avatar: /images/friend.png
    description: Life and code
---
```

Add `Friends: /friends/` to your `menu` config.

### Data Fields

| Field         | Required | Notes                                                    |
| ------------- | -------- | -------------------------------------------------------- |
| `name`        | Yes      | Display name                                             |
| `url`         | Yes      | Link target. Cards without URL render as static text     |
| `avatar`      | No       | Image URL. Falls back to first-character placeholder     |
| `description` | No       | Short description below the name                         |

### Behavior

- Avatar images that fail to load fall back to the name's first character (styled circle with primary color)
- Cards without a valid URL skip hover animation and are not clickable
- Links open in new tab (`target="_blank"` with `rel="noopener noreferrer"`)
- Empty state (no `friends` data or empty array) shows an i18n message
- Comments section is included below the card grid

## Comments

| Key               | Type      | Default  | Description                                                                              |
| ----------------- | --------- | -------- | ---------------------------------------------------------------------------------------- |
| `comments.enable` | `boolean` | `false`  | Enable comments                                                                          |
| `comments.type`   | `string`  | `giscus` | System: `giscus`, `disqus`, `waline`, `twikoo`, `valine`, `gitalk`, `utterances`, `none` |

Each system has its own config block:

<details>
<summary>Per-system options</summary>

### Giscus

| Key                 | Type      | Default    |
| ------------------- | --------- | ---------- |
| `repo`              | `string`  | `''`       |
| `repo_id`           | `string`  | `''`       |
| `category`          | `string`  | `''`       |
| `category_id`       | `string`  | `''`       |
| `mapping`           | `string`  | `pathname` |
| `strict`            | `boolean` | `false`    |
| `reactions_enabled` | `string`  | `'1'`      |
| `emit_metadata`     | `string`  | `'0'`      |
| `input_position`    | `string`  | `bottom`   |
| `lang`              | `string`  | `auto`     |

### Disqus

`disqus.shortname` — your Disqus shortname.

### Waline

`waline.serverURL` — Waline server URL.
`waline.lang` — language (default: `auto`).

### Twikoo

`twikoo.envId` — Tencent Cloud environment ID.

### Valine

`valine.appId`, `valine.appKey` — LeanCloud credentials.

### Gitalk

`gitalk.clientID`, `gitalk.clientSecret`, `gitalk.repo`, `gitalk.owner`, `gitalk.admin` — GitHub OAuth app credentials.

### Utterances

`utterances.repo` — GitHub repo (e.g. `owner/repo`).
`utterances.issue_term` — issue mapping (default: `pathname`).

</details>

## Analytics

| Key                | Type     | Default | Description                     |
| ------------------ | -------- | ------- | ------------------------------- |
| `analytics.google` | `string` | `null`  | Google Analytics Measurement ID |
| `analytics.baidu`  | `string` | `null`  | Baidu Tongji site ID            |

## Search

| Key             | Type      | Default | Description         |
| --------------- | --------- | ------- | ------------------- |
| `search.enable` | `boolean` | `true`  | Enable local search |
| `search.type`   | `string`  | `local` | Search engine type  |

Keyboard shortcut: `Ctrl+K` / `Cmd+K`.

## Footer

| Key                 | Type      | Default | Description                                        |
| ------------------- | --------- | ------- | -------------------------------------------------- |
| `footer.since`      | `string`  | `null`  | Copyright start year (e.g. `2024` → `2024 – 2026`) |
| `footer.powered_by` | `boolean` | `true`  | Show "Powered by Hexo"                             |
| `footer.theme_by`   | `boolean` | `true`  | Show "Theme — Shion"                               |
| `footer.icp`        | `string`  | `null`  | ICP filing number (China)                          |

## Shion Character

| Key                      | Type      | Default                  | Description                   |
| ------------------------ | --------- | ------------------------ | ----------------------------- |
| `shion.hero_enable`      | `boolean` | `true`                   | Show hero section on homepage |
| `shion.hero_image`       | `string`  | `/images/shion/hero.png` | Hero decorative image         |
| `shion.background_image` | `string`  | `/images/shion/bg.png`   | Page background decoration    |
| `shion.404_image`        | `string`  | `/images/shion/404.png`  | 404 page illustration         |

## Outdate Warning

| Key              | Type      | Default | Description                               |
| ---------------- | --------- | ------- | ----------------------------------------- |
| `outdate.enable` | `boolean` | `true`  | Warn on old posts                         |
| `outdate.days`   | `number`  | `365`   | Days before a post is considered outdated |

## Busuanzi

| Key                | Type      | Default | Description             |
| ------------------ | --------- | ------- | ----------------------- |
| `busuanzi.enable`  | `boolean` | `false` | Enable visitor counting |
| `busuanzi.site_uv` | `boolean` | `true`  | Show unique visitors    |
| `busuanzi.site_pv` | `boolean` | `true`  | Show page views         |

## Music Player

| Key              | Type      | Default | Description                       |
| ---------------- | --------- | ------- | --------------------------------- |
| `music.enable`   | `boolean` | `false` | Enable the sidebar music player   |
| `music.playlist` | `array`   | `[]`    | List of track objects (see below) |

Each track in the playlist:

| Track field | Type     | Required | Description                                 |
| ----------- | -------- | -------- | ------------------------------------------- |
| `name`      | `string` | yes      | Track title                                 |
| `artist`    | `string` | yes      | Artist name                                 |
| `url`       | `string` | yes      | Audio file URL (e.g. `/music/song.mp3`)     |
| `cover`     | `string` | no       | Cover image URL (empty = gradient fallback) |

Supported audio formats: MP3, OGG, WAV. The player uses the HTML5 `<audio>` element and supports native browser playback.

How to add new tracks:

```yaml
music:
  enable: true
  playlist:
    - name: 'Song Title'
      artist: 'Artist'
      url: '/music/song.mp3'
      cover: '/music/cover.png'
```

The player appears in the sidebar on all pages. When `enable: false` or the playlist is empty, nothing is rendered.

Keyboard shortcuts (global, ignored when an input is focused):

| Shortcut | Action         |
| -------- | -------------- |
| `Space`  | Play / Pause   |
| `Ctrl+→` | Next track     |
| `Ctrl+←` | Previous track |

Playback state (volume, current track, position, play mode) is saved to `localStorage` and restored on page load. Audio persists across PJAX navigation via a global `window.__musicState` instance.

## Advanced

| Key               | Type     | Default      | Description                 |
| ----------------- | -------- | ------------ | --------------------------- |
| `custom_css`      | `string` | `null`       | Custom CSS (path or inline) |
| `custom_js`       | `string` | `null`       | Custom JS (path or inline)  |
| `cdn.highlightjs` | `string` | jsDelivr URL | highlight.js CDN base       |
| `cdn.katex`       | `string` | jsDelivr URL | KaTeX CDN base              |
| `cdn.fusejs`      | `string` | jsDelivr URL | Fuse.js CDN base            |

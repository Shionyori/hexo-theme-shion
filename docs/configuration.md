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

### Nav icons

Every menu item gets a 16px icon on its left (`header.nav_icons`, default `true`),
in both the desktop header and the mobile drawer. The glyph is picked from the
menu **key**, so renaming an item to something unknown falls back to a generic
link icon instead of dropping the icon slot:

| Key (any case)               | Icon        |
| ---------------------------- | ----------- |
| `Home` / `首页` / `index`    | house       |
| `Archives` / `归档`          | archive box |
| `Tags` / `标签`              | tag         |
| `Categories` / `分类`        | folder      |
| `Friends` / `友链` / `links` | users       |
| `About` / `关于`             | info        |
| anything else                | link        |

```yaml
header:
  nav_icons: false # bare text menu
```

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

## Header

| Key                | Type      | Default | Description                                     |
| ------------------ | --------- | ------- | ----------------------------------------------- |
| `header.nav_icons` | `boolean` | `true`  | Icon to the left of every nav item              |
| `header.rss_icon`  | `boolean` | `true`  | RSS button in the header actions (needs a feed) |

## Feed

The theme does not generate the feed itself — install
[`hexo-generator-feed`](https://github.com/hexojs/hexo-generator-feed) and
configure it in the site's `_config.yml`:

```bash
pnpm add hexo-generator-feed
```

```yaml
feed:
  type: [atom, rss2] # generate both
  path: [atom.xml, rss2.xml]
  limit: 20 # entries (0 = all)
  content: true # full post text in the feed
  content_limit: 0 # 0 = do not truncate
  order_by: -date
  icon: /images/avatar.png
```

The theme then:

- emits one `<link rel="alternate">` per feed type in `<head>` (Atom and/or
  RSS 2.0 mime types), so readers and browsers discover it automatically;
- renders an RSS button in the header actions pointing at the first feed
  (`header.rss_icon: false` hides it).

Feed URLs are taken from `feed.path` (falling back to `atom.xml` / `rss2.xml`),
so a single `feed.type: atom` setup works without extra config. The legacy
`feed.atom: '/atom.xml'` string form is still supported.

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
| `post.share.platforms`       | `string[]` | all four (template default)                          | Enabled platforms, see below    |
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

| Key                          | Type            | Default                    | Description                   |
| ---------------------------- | --------------- | -------------------------- | ----------------------------- |
| `sidebar.enable`             | `boolean`       | `true`                     | Show sidebar                  |
| `sidebar.position`           | `left \| right` | `left`                     | Sidebar position              |
| `sidebar.avatar.enable`      | `boolean`       | `true`                     | Show author avatar            |
| `sidebar.avatar.image`       | `string`        | `/images/shion/avatar.png` | Avatar image path             |
| `sidebar.social`             | `object`        | `{ GitHub: '...' }`        | Social links (key → URL)      |
| `sidebar.widgets`            | `string[]`      | `['recent-posts']`¹        | Widget display order          |
| `sidebar.recent_posts_count` | `number`        | `5`                        | Recent posts to show          |
| `sidebar.tagcloud_min_font`  | `number`        | `1.2`                      | Tag cloud min font size (rem) |
| `sidebar.tagcloud_max_font`  | `number`        | `2.8`                      | Tag cloud max font size (rem) |

¹ Template default — leave `sidebar.widgets` unset to get it. The list is _not_
declared in `_config.yml`, otherwise Hexo's array merge would make it impossible
to remove entries from your site config (see [Array options](#array-options-and-_configthemeyml)).

### Social Icon Keys

`GitHub`, `Twitter`, `Facebook`, `Instagram`, `YouTube`, `Bilibili`, `Email`, `RSS`, `Steam`, `Discord`, `Telegram`, `LinkedIn`, `Weibo`, `Zhihu`, `Douban`, `NPM`, `Patreon`, `Reddit`, `Twitch`, `Spotify`, `Medium`, `CodePen`, `GitLab`, `StackOverflow`, `Mastodon`

### Available Widgets

`recent-posts`, `categories-widget`, `tags-widget`, `tagcloud`, `archives-widget`

Unknown names are ignored with a build warning that lists the valid ones:

```
WARN [shion] sidebar: unknown widget `recent-post` ignored. Available: recent-posts, categories-widget, archives-widget, tags-widget, tagcloud
```

### Array options and `_config.<theme>.yml`

Hexo merges `_config.<theme>.yml` on top of the theme defaults with
`hexo-util`'s `deepMerge`, whose array merge **appends** unseen items instead of
replacing the list. A theme-level default like `widgets: [recent-posts]` would
therefore be impossible to remove or reorder from the site config.

So for the options where the order/content is yours to decide the default lives
in the template, not in `_config.yml`:

| Option                 | Unset →            | Set → exactly your list                              |
| ---------------------- | ------------------ | ---------------------------------------------------- |
| `sidebar.widgets`      | `['recent-posts']` | e.g. `[categories-widget, tags-widget]`, `[]` = none |
| `post.share.platforms` | all four platforms | e.g. `['copy']`; `[]` = fall back to all four        |

Objects (`sidebar.social`, `sidebar.layouts`) still merge key by key, and
`sidebar.layouts.<type>.widgets: []` still means "no widgets on that page type".

### Sidebar Per-Page Configuration

Configure which sidebar components appear on each page type via `sidebar.layouts` in `_config.shion.yml`. All pages are configured in **one place** with the same structure:

```yaml
sidebar:
  widgets: # 全局默认
    - recent-posts
  layouts: # 按页面覆盖
    index: # 主页 /
    archive: # 归档 /archives/
      widgets: []
    friends: # 友链 /friends/
      widgets: []
    tags: # 标签 /tags/
      widgets: []
    categories: # 分类 /categories/
      widgets: []
    about: # 关于 /about/
      widgets: []
```

**Layout keys:**

| Key          | Page                      |
| ------------ | ------------------------- |
| `index`      | Home `/`                  |
| `archive`    | Archives `/archives/`     |
| `friends`    | Friends `/friends/`       |
| `tags`       | Tags `/tags/`             |
| `categories` | Categories `/categories/` |
| `about`      | About `/about/`           |
| `post`       | Blog posts                |
| `page`       | Other custom pages        |

Each entry supports the same 4 keys:

| Key       | Type       | Description                            |
| --------- | ---------- | -------------------------------------- |
| `enable`  | `boolean`  | Show/hide entire sidebar               |
| `profile` | `boolean`  | Show/hide profile card                 |
| `music`   | `boolean`  | Show/hide music player                 |
| `widgets` | `string[]` | Widgets to display (empty `[]` = none) |

**Resolution priority:**

1. Page frontmatter `sidebar:` (for one-off overrides in `.md` files)
2. `sidebar.layouts.<type>` (primary config location)
3. Global `sidebar.widgets` / `sidebar.enable` etc. (fallback)

> **Note:** On post pages, the sidebar shows TOC instead of profile/widgets. `enable` and `music` still apply. `profile` and `widgets` have no effect.

### Page Frontmatter Override (advanced)

For a one-off exception, add `sidebar:` to a page's `.md` frontmatter. This takes priority over `layouts` config:

```yaml
---
title: Special Page
sidebar:
  music: false
---
```

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

| Field         | Required | Notes                                                |
| ------------- | -------- | ---------------------------------------------------- |
| `name`        | Yes      | Display name                                         |
| `url`         | Yes      | Link target. Cards without URL render as static text |
| `avatar`      | No       | Image URL. Falls back to first-character placeholder |
| `description` | No       | Short description below the name                     |

### Behavior

- Avatar images that fail to load fall back to the name's first character (styled circle with primary color)
- Cards without a valid URL skip hover animation and are not clickable
- Links open in new tab (`target="_blank"` with `rel="noopener noreferrer"`)
- Empty state (no `friends` data or empty array) shows an i18n message
- Comments section is included below the card grid

## Comments

| Key                    | Type      | Default  | Description                                                                              |
| ---------------------- | --------- | -------- | ---------------------------------------------------------------------------------------- |
| `comments.enable`      | `boolean` | `false`  | Enable comments                                                                          |
| `comments.type`        | `string`  | `waline` | System: `waline`, `giscus`, `disqus`, `twikoo`, `valine`, `gitalk`, `utterances`, `none` |
| `comments.lazy`        | `boolean` | `true`   | Load the provider only when the section scrolls into view                                |
| `comments.placeholder` | `string`  | `''`     | Input placeholder (Waline / Valine, mapped to `locale.placeholder` for Waline)           |

> `type: none` (or `enable: false`) renders no comment section at all. Individual posts can
> opt out with `comments: false` in their front-matter.
>
> If a provider's required options are missing, the theme renders a themed setup notice
> instead of an empty comment box. If a provider script fails to load, it renders a retry
> card.

Comments are rebuilt after every PJAX navigation and follow the active light/dark theme.
Waline switches automatically through its `dark` selector; Giscus and Utterances switch
live via `postMessage`; Gitalk, Valine and Twikoo are re-coloured through the theme's
SCSS tokens.

Each system has its own config block:

<details>
<summary>Per-system options</summary>

### Waline (default)

Waline is a self-hosted comment system: deploy the server and database first, then point
the theme at it.

1. Deploy Waline by following the [official quick start](https://waline.js.org/guide/get-started/)
   (Vercel, Docker, or any Node.js host).
2. Set `comments.waline.serverURL` to the deployed address, e.g. `https://waline.example.com`.
3. Set `comments.enable: true`.

If `serverURL` is empty, the theme shows a themed setup notice with a link to the Waline
deployment guide instead of rendering an empty comment box.

| Key              | Type      | Default             | Description                                        |
| ---------------- | --------- | ------------------- | -------------------------------------------------- |
| `serverURL`      | `string`  | `''`                | Waline server URL (required)                       |
| `lang`           | `string`  | `auto`              | `auto` resolves from the page language             |
| `path`           | `string`  | `location.pathname` | Comment path key; leave empty for per-URL comments |
| `meta`           | `array`   | Waline default      | Commenter fields, e.g. `['nick', 'mail', 'link']`  |
| `requiredMeta`   | `array`   | `[]`                | Required fields, e.g. `['nick']`                   |
| `login`          | `string`  | `enable`            | `enable` / `disable` / `force`                     |
| `pageSize`       | `number`  | `10`                | Comments per page                                  |
| `commentSorting` | `string`  | `latest`            | `latest` / `oldest` / `hottest`                    |
| `wordLimit`      | `number`  | `0`                 | Max comment length (0 = unlimited)                 |
| `noCopyright`    | `boolean` | `false`             | Hide the "Powered by Waline" footer                |
| `noRss`          | `boolean` | `false`             | Hide the RSS link                                  |
| `imageUploader`  | `boolean` | server default      | `false` disables image upload                      |
| `search`         | `boolean` | `false`             | Enable the emoji / image search panel              |
| `reaction`       | `boolean` | `false`             | Enable comment reactions                           |
| `emoji`          | `array`   | Waline default      | Emoji CDN URLs                                     |
| `recaptchaV3Key` | `string`  | `''`                | reCAPTCHA v3 key                                   |
| `turnstileKey`   | `string`  | `''`                | Cloudflare Turnstile key                           |
| `locale`         | `object`  | `{}`                | Override UI strings, e.g. `{ placeholder: '...' }` |

All options are passed straight through to `Waline.init()`. The theme always owns `el`,
`dark` (`html[data-theme="dark"]`) and resolves `lang`; it defaults `path` to the current
URL unless you set one explicitly. `comments.placeholder` is a shortcut for
`waline.locale.placeholder`.

### Giscus

Giscus is backed by GitHub Discussions, so the repository needs three things before
visitors can post comments:

1. The repository is **public**.
2. **Discussions** is enabled under _Settings → General → Features_.
3. The [giscus GitHub App](https://github.com/apps/giscus/installations/new) is installed
   on the repository.

`repo_id`, `category` and `category_id` are shown by the
[giscus configuration page](https://giscus.app/) once the app is installed;
`repo_id` is also the repository's `R_...` node ID. If the app is missing, the theme
replaces the embed with a themed setup notice containing the install link instead of
showing a broken iframe.

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
| `input_position`    | `string`  | `top`      |
| `lang`              | `string`  | `auto`     |

### Disqus

| Key         | Type     | Default | Description      |
| ----------- | -------- | ------- | ---------------- |
| `shortname` | `string` | `''`    | Disqus shortname |

### Twikoo

| Key      | Type     | Default             | Description                           |
| -------- | -------- | ------------------- | ------------------------------------- |
| `envId`  | `string` | `''`                | Tencent Cloud / Vercel environment ID |
| `lang`   | `string` | `auto`              | Resolved from the page language       |
| `region` | `string` | `ap-shanghai`       | Tencent Cloud region                  |
| `path`   | `string` | `location.pathname` | Custom thread path                    |

Other Twikoo options are passed through to `twikoo.init()`.

### Valine

| Key              | Type     | Default             | Description                     |
| ---------------- | -------- | ------------------- | ------------------------------- |
| `appId`          | `string` | `''`                | LeanCloud App ID                |
| `appKey`         | `string` | `''`                | LeanCloud App Key               |
| `lang`           | `string` | `auto`              | Resolved from the page language |
| `path`           | `string` | `location.pathname` | Comment path key                |
| `placeholder`    | `string` | `''`                | Input placeholder               |
| `meta`           | `array`  | Valine default      | Fields to show                  |
| `requiredFields` | `array`  | `[]`                | Required fields                 |
| `pageSize`       | `number` | `10`                | Comments per page               |
| `avatar`         | `string` | Waline default      | Avatar style                    |

Other Valine options are passed through to the Valine constructor.

### Gitalk

| Key                   | Type      | Default                        | Description                        |
| --------------------- | --------- | ------------------------------ | ---------------------------------- |
| `clientID`            | `string`  | `''`                           | GitHub OAuth App Client ID         |
| `clientSecret`        | `string`  | `''`                           | GitHub OAuth App Client Secret     |
| `repo`                | `string`  | `''`                           | Repository that stores issues      |
| `owner`               | `string`  | `''`                           | Repository owner                   |
| `admin`               | `array`   | `[]`                           | GitHub usernames with admin rights |
| `id`                  | `string`  | `decodeURI(location.pathname)` | Issue identifier                   |
| `title`               | `string`  | page title                     | Issue title                        |
| `language`            | `string`  | `zh-CN`                        | Gitalk UI language                 |
| `proxy`               | `string`  | `''`                           | CORS proxy for the GitHub API      |
| `distractionFreeMode` | `boolean` | `false`                        | Enable distraction-free editing    |

Other Gitalk options are passed through.

### Utterances

| Key          | Type     | Default    | Description                |
| ------------ | -------- | ---------- | -------------------------- |
| `repo`       | `string` | `''`       | GitHub repo (`owner/repo`) |
| `issue_term` | `string` | `pathname` | Issue mapping              |
| `label`      | `string` | `''`       | Optional issue label       |

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

The local index (`search.json`) covers titles, categories, tags, excerpts **and the full
plain-text body** of every post and page, so keywords anywhere in an article are matched.
Results show a context snippet with the matched keyword highlighted.

## Footer

| Key                 | Type      | Default | Description                                        |
| ------------------- | --------- | ------- | -------------------------------------------------- |
| `footer.since`      | `string`  | `null`  | Copyright start year (e.g. `2024` → `2024 – 2026`) |
| `footer.social`     | `boolean` | `true`  | Repeat `sidebar.social` links above the copyright  |
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

## Hero Waves

On non-post pages (home, archive, tag, category and regular pages) the hero becomes a banner that ends in animated waves, and the waves double as the divider above the content. The waves are painted in the page background colour: the shore in front is solid and each wave behind it is lighter. Opacities run from `waves.opacity_back` at the back to `1` at the shore in even steps (4 layers → `.2 .47 .73 1`), so no single wave jumps out and the furthest one is faint but never invisible — raise `waves.layers` for finer steps, or `waves.opacity_back` if you want the far waves heavier. The hero image fades out across the band, so it never ends on a hard line. Post pages keep their plain cover.

Sizes mirror [astro-koharu](https://github.com/cosZone/astro-koharu): the cover is `min(60svh, 800px)` and the wave band is `clamp(3.125rem, 15svh, 9.375rem)` — its `height: 15svh` clamped to 50–150 px. The opaque shore always reaches the bottom of the band (the wave depth is capped for that), so the artwork is never exposed under the waterline, and a short page-coloured skirt below the banner hides the hairline where the water meets the page.

Tuning hero size belongs here because the banner only exists where the waves are. The whole effect is pure SVG + CSS — no JavaScript, no canvas — so it costs nothing at runtime and follows `prefers-reduced-motion` automatically.

| Key                 | Type       | Default                                     | Description                                                                                                    |
| ------------------- | ---------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `waves.enable`      | `boolean`  | `true`                                      | Turn the wave band on/off                                                                                      |
| `waves.layouts`     | `string[]` | `null`                                      | Limit to some layouts (`index`, `archive`, `categories`, `tags`, `page`, …)                                    |
| `waves.hero_height` | `string`   | `min(60svh, 800px)`                         | Banner height (bare number = `rem`). Compact pages default to `clamp(18rem, 42svh, 30rem)`                     |
| `waves.height`      | `string`   | `null` → `clamp(3.125rem, 15svh, 9.375rem)` | Water band height (astro-koharu's 15svh clamped to 50–150px); also reserved as hero bottom padding             |
| `waves.amplitude`   | `number`   | `0.8`                                       | Wave depth as a fraction of the band height (`0.2`–`1`); the waterline stays in place, only the trough deepens |
| `waves.layers`      | `number`   | `5`                                         | How many waves are stacked (`2`–`8`); more layers = finer tonal steps                                          |
| `waves.speed`       | `number`   | `1`                                         | Drift speed multiplier (`0.5` = half speed, `2` = double)                                                      |
| `waves.opacity`     | `number`   | `1`                                         | Opacity multiplier of the whole wave stack                                                                     |
| `waves.color`       | `string`   | `null`                                      | Water colour; falls back to `shore_color`, i.e. the page background                                            |
| `waves.shore_color` | `string`   | `null`                                      | Page background the waves melt into; falls back to `--color-bg-alt`                                            |

```yaml
waves:
  enable: true
  hero_height: min(60svh, 800px)
  # height: clamp(3.125rem, 15svh, 9.375rem)
  amplitude: 0.64
  layers: 5
  speed: 1
  opacity: 1
  # color: '#ffffff' # tint the water instead of using the page colour
```

Rough guide: `height` sets how much room the water takes, `amplitude` how
deep each crest dips (bigger = more dramatic waves, same waterline),
`layers` how many waves are visible, `speed` how fast they drift.

Disable it on a single page with frontmatter:

```yaml
---
title: About
waves: false
---
```

## Outdate Warning

| Key              | Type      | Default | Description                               |
| ---------------- | --------- | ------- | ----------------------------------------- |
| `outdate.enable` | `boolean` | `true`  | Warn on old posts                         |
| `outdate.days`   | `number`  | `365`   | Days before a post is considered outdated |

## Site Uptime

Live "running for X d X h X m X s" counter in the footer, counted from `since`.
The server renders the initial value (works without JS) and the client keeps it
ticking (`src/client/uptime.ts`).

| Key                 | Type      | Default  | Description                                                     |
| ------------------- | --------- | -------- | --------------------------------------------------------------- |
| `runtime.enable`    | `boolean` | `true`   | Show the uptime counter                                         |
| `runtime.since`     | `string`  | `null`   | Start date/time, any value `new Date()` parses; `null` hides it |
| `runtime.precision` | `string`  | `second` | Finest unit shown: `day`, `hour`, `minute` or `second`          |
| `runtime.label`     | `boolean` | `true`   | Show the `uptime_label` lead-in text                            |
| `runtime.icon`      | `boolean` | `true`   | Show the clock icon                                             |
| `runtime.refresh`   | `number`  | `null`   | Update interval in seconds; `null` = aligned with `precision`   |

```yaml
runtime:
  enable: true
  since: '2025-01-01T00:00:00'
  precision: hour # -> "本站已运行 288 天 4 小时"
  label: true
  icon: true
  refresh: null # auto: once an hour for `precision: hour`
```

`precision` truncates from the finest unit upwards — `second` shows all four,
`hour` shows days + hours, `day` shows days only. Each precision level is
translated per language (`uptime_day` … `uptime_second`), so unit order and
spacing stay localizable.

With `refresh: null` the counter re-renders exactly when the smallest displayed
unit changes instead of every second; set a number to override (e.g. `60`).

A future or unparsable `since` renders nothing rather than a negative counter.

## Busuanzi

| Key                | Type      | Default | Description                          |
| ------------------ | --------- | ------- | ------------------------------------ |
| `busuanzi.enable`  | `boolean` | `false` | Enable visitor counting              |
| `busuanzi.site_uv` | `boolean` | `true`  | Show unique visitors                 |
| `busuanzi.site_pv` | `boolean` | `true`  | Show page views                      |
| `busuanzi.page_pv` | `boolean` | `true`  | Show per-post views in the post meta |

Counters come from [busuanzi](https://busuanzi.ibruce.info) (third-party, free).
The service identifies the site by the `Referer` of a JSONP request, so:

- `site_uv` is de-duplicated by a session cookie (`busuanziId`) — visitors who
  block third-party cookies are counted as new on every page load, which pushes
  UV towards PV.
- Counts are keyed by hostname: switching to a custom domain starts from zero.
- Because the theme navigates with PJAX, the counter script is re-run after every
  swap (`src/client/stats.ts`), so in-site navigation counts as a real page view.
- If the script is blocked or the service is unreachable, the counters hide
  themselves instead of leaving a `-` placeholder on screen.

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

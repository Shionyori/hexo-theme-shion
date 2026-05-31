# hexo-theme-shion

A clean, content-first Hexo blog theme themed around Shion Yorigami (依神紫苑) from Touhou Project.

## Features

- Clean, responsive design with dark/light mode
- Multi-language support (English, 简体中文, 繁體中文, 日本語)
- Local search with Fuse.js (Ctrl+K / Cmd+K)
- Table of contents with scroll tracking
- Code syntax highlighting (highlight.js)
- KaTeX math rendering support
- Comment system integration (Giscus, Disqus)
- Google Analytics / Baidu Tongji support
- SEO optimized (Open Graph, Twitter Cards, JSON-LD)
- Custom tag plugins (note, image, blockquote)
- Reading time and word count estimation
- Responsive sidebar with social links
- Back to top button

## Quick Start

### Install

```bash
cd your-hexo-site
git clone https://github.com/your/hexo-theme-shion themes/shion
```

### Enable

Set `theme: shion` in your site's `_config.yml`.

### Configure

Copy `_config.yml` from the theme to your site's `_config.shion.yml`:

```bash
cp themes/shion/_config.yml _config.shion.yml
```

Edit `_config.shion.yml` to customize the theme.

## Configuration Reference

See `_config.yml` for all options with comments. Key sections:

| Section      | Description                                  |
| ------------ | -------------------------------------------- |
| `menu`       | Navigation menu items                        |
| `appearance` | Dark/light mode, font size                   |
| `home`       | Post list display options                    |
| `post`       | TOC, copyright, reading time, code highlight |
| `sidebar`    | Avatar, social links                         |
| `comments`   | Giscus or Disqus integration                 |
| `analytics`  | Google Analytics or Baidu Tongji             |
| `search`     | Local search settings                        |
| `shion`      | Shion-themed decorative images               |

## Development

```bash
git clone https://github.com/Shionyori/hexo-theme-shion.git
cd hexo-theme-shion
npm install
npm run build       # Build all (TS + SCSS + client JS)
npm run dev         # Watch mode with demo server
```

### Project Structure

```
src/
├── ts/          Server-side TypeScript (helpers, filters, generators, tags)
├── client/      Browser-side TypeScript (theme, search, sidebar, TOC)
└── scss/        SCSS stylesheets
layout/          EJS templates
source/          Compiled CSS/JS and static assets
languages/       i18n files
scripts/         Compiled server JS output
```

## Contributing

This project follows **GitHub Flow**:

1. **Fork & branch** — Fork the repo and create a feature branch from `master`
2. **Build & test** — `npm run build` must pass; preview with `npm run dev`
3. **Commit** — Write clear commit messages describing what and why
4. **Pull Request** — Open a PR to `master`, fill out the PR template, and wait for CI to pass
5. **Review** — Address feedback; once approved, squash-merge into `master`

CI runs automatically on every PR via GitHub Actions (see `.github/workflows/ci.yml`).

## Credits

- Shion Yorigami character by ZUN / Team Shanghai Alice (上海アリス幻樂団)
- Theme inspired by modern tech blog design

## License

MIT

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
│   └── scss/           SCSS stylesheets (24 partials, dark mode, responsive)
├── layout/
│   └── _partial/       EJS templates (header, footer, sidebar, comments, etc.)
├── source/             Compiled output + static assets (CSS, JS, images)
├── languages/          i18n files (en, zh-CN, zh-TW, ja)
├── scripts/            Compiled server helpers (committed for direct theme use)
├── demo/               Standalone Hexo site for development & preview
├── tools/              Build utilities (sync, watch-client)
└── _config.yml         Theme default configuration
```

## Contributing

1. **Fork & branch** — Fork the repo, create a feature branch from `master`
2. **Build & test** — `npm run build` must pass; verify with `npm run preview`
3. **Format** — `npm run format` before committing
4. **Commit** — Use clear commit messages
5. **Pull Request** — Open a PR to `master`

CI runs automatically via GitHub Actions on every push and PR — it checks formatting and builds the project.

# Tag Plugins

hexo-theme-shion includes built-in Nunjucks tag plugins for rich content.

## Note

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

Styles: `info` (blue), `warning` (yellow), `success` (green), `danger` (red).

## Image

Named-parameter mode (recommended):

```njk
{% image src=cover.png alt=Cover caption=Title %}
{% image src=photo.jpg alt=Photo size="600 400" %}
{% image src=diagram.png alt=Diagram align=center nozoom=true %}
{% image src=icon.png alt=Icon inline=true %}
{% image src=banner.jpg alt=Banner class="align-left no-zoom" %}
```

Positional mode (backward compatible):

```njk
{% image src alt "Caption text" 600 align-center %}
{% image src alt "Caption" 400 300 align-left %}
{% image src alt 800 %}
```

Positional args are parsed right-to-left: optional CSS class → optional height (px) → optional width (px) → remaining text becomes caption.

| Param     | Description                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `src`     | Image path (required)                                                                                              |
| `alt`     | Alt text                                                                                                           |
| `caption` | Figure caption                                                                                                     |
| `size`    | `"width height"` in pixels (e.g. `"600 400"`); a single number sets width                                          |
| `align`   | `left`, `center`, or `right` — adds `align-left` / `align-center` / `align-right` class                            |
| `nozoom`  | `true` to disable click-to-zoom (excludes from lightbox)                                                           |
| `inline`  | `true` for inline display (no block-level figure wrapper)                                                          |
| `class`   | Additional CSS classes (only recognized classes: `align-left`, `align-right`, `align-center`, `no-zoom`, `inline`) |

Images respect the global `post.image.lazy_load` setting and use a fallback image (`/images/shion/404.png`) on load error. When `post.image.lightbox` is enabled, images are zoomable via medium-zoom — add `nozoom=true` to exclude individual images.

## Quote

```njk
{% blockquote "Author" "Source" %}
The quoted text goes here.
{% endblockquote %}
```

Both `Author` and `Source` are optional. The tag renders a styled `<blockquote>` with an attribution footer (`— Author, Source`).

## Details (Collapsible)

```njk
{% details "Click to expand" %}
Hidden content revealed on click.
{% enddetails %}
```

## Tabs

```njk
{% tabs %}
<!-- tab "First Tab" -->
Content for the first tab.

<!-- tab "Second Tab" -->
Content for the second tab.
{% endtabs %}
```

Optionally set the active tab by index (0-based):

```njk
{% tabs 1 %}
<!-- tab "First Tab" -->
This tab starts inactive.

<!-- tab "Second Tab" -->
This tab starts active.
{% endtabs %}
```

Tab labels are defined inside `<!-- tab "Label" -->` comments. Content after each label comment (until the next label or `{% endtabs %}`) becomes that tab's panel.

## Link Card

```njk
{% linkCard "Title" "https://example.com" "Optional description" %}
```

Renders a clickable external-link card. Arguments are positional: title, URL, description (optional).

## Post Link Card

```njk
{% postLinkCard "post-slug" %}
```

Renders a card linking to another post on your site by its slug.

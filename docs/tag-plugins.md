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
```

Positional mode (backward compatible):

```njk
{% image src alt "Caption text" 600 align-center %}
```

| Param     | Description                                   |
| --------- | --------------------------------------------- |
| `src`     | Image path (required)                         |
| `alt`     | Alt text                                      |
| `caption` | Figure caption                                |
| `size`    | `"width height"` in pixels (e.g. `"600 400"`) |
| `align`   | `left`, `center`, or `right`                  |
| `nozoom`  | `true` to disable click-to-zoom               |
| `inline`  | `true` for inline display                     |
| `class`   | Additional CSS classes                        |

## Quote

```njk
{% blockquote "Author" "Source" %}
The quoted text goes here.
{% endblockquote %}
```

Both `Author` and `Source` are optional.

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

## Link Card

```njk
{% linkCard "https://example.com" "Title" "Description" %}
```

Renders a clickable card with title and description for an external URL.

## Post Link Card

```njk
{% postLinkCard "post-slug" %}
```

Renders a card linking to another post on your site by its slug.

# Authoring content pages (MDX)

Content-only pages live here as MDX files, one per language:

```
src/content/<module>/<slug>.en.mdx
src/content/<module>/<slug>.pt.mdx
```

The URL for each slug is defined in `src/config/contentManifest.ts`. The page is
rendered by `src/components/Common/MdxPage.tsx`, which picks the file matching the
current language (falling back to English).

## How to edit

Just write Markdown. Headings (`#`, `##`), paragraphs, bullet/numbered lists,
`> blockquotes`, `**bold**`, `*italic*`, links, tables and code fences all work and
are styled automatically — you do not add CSS classes.

For richer layouts, a small set of components is available **without importing them**:

| Component | Purpose | Key props |
|-----------|---------|-----------|
| `<Callout>` | Highlighted box / aside | `type` = `info \| success \| warning \| danger \| neutral`, `title` |
| `<Cards cols={2\|3\|4}>` | Responsive grid wrapping `<Card>`s | `cols` (default 3) |
| `<Card>` | A colored panel | `title`, `emoji`, `accent` = `brand \| green \| purple \| red \| yellow \| slate` |
| `<Metrics cols={2\|3\|4}>` | Grid of headline numbers | `cols` (default 3) |
| `<Metric>` | One big number + label | `value`, `label`, `accent` |
| `<VideoEmbed>` | 16:9 embedded video | `src`, `title` |
| `<Section>` | Fade-in wrapper for a block | `className` |

## The one rule that matters: blank lines

MDX mixes JSX and Markdown. **Always put a blank line between a component tag and the
Markdown inside it**, and keep tags at the start of the line (not indented). This works:

```mdx
<Cards cols={3}>

<Card emoji="🔗" title="Consistency" accent="brand">

All nodes see the same data at the same time.

- point one
- point two

</Card>

</Cards>
```

This breaks the build (no blank lines, indented closing tag):

```mdx
<Card title="Consistency">
- point one
  </Card>
```

See `theoretical-foundations/cap-theorem.en.mdx` (rich) and
`distributed-systems-101.en.mdx` (simple prose) as reference examples.

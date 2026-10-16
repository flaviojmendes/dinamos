# Authoring course content

Lessons are bilingual MDX records in the content CMS, not files under `src/content`.
Edit English and Portuguese independently in the admin editor. The public index
supplies lesson routes, titles, ordering and simulator attachments. The frontend
loads the versioned `public/content/manifest.json` first, falling back to the API.
A missing translation produces a localized unavailable message; neither titles nor
lesson bodies are replaced by the other language.

## The recurring burger restaurant example

Every lesson has a short, concept-specific example from the same burger restaurant,
placed directly below its main heading. Start with the counter and kitchen, then
extend the same business to online orders, delivery, branches and AI assistants as
the course progresses. Keep each example to one short paragraph. Explain the
mapping and any important limits; physical meals are not reversible transactions
or replicated digital records.

Use the registered component without an import, with localized text in each body:

```mdx
# Message queues

<BurgerAnalogy text="At our burger restaurant, the counter puts each order ticket into a queue. Kitchen workers take tickets as capacity becomes available, so a busy counter does not have to wait for every burger to finish. Acknowledging a ticket only after durable processing, and recognizing duplicate order IDs, prevents lost orders or repeated preparation during retries." />
```

The section label is translated automatically. Do not translate component names,
code identifiers, URLs, protocol names or product names. Translate the teaching
prose, diagram labels, code comments and example output where they are visible to
the learner. Preserve blank lines around JSX components and their Markdown.

## Publishing and verification

- `npm run content:export-static` exports published CMS records (requires the
  configured database), validates them, and creates a new immutable content version.
- `npm run content:release-reviewed` applies the reviewed bilingual release to the
  existing checked-in snapshot offline, without a database or environment file.
- `npm run content:check` compiles every released MDX body and validates locale
  metadata, titles, route consistency, and one unique burger example per lesson
  and language. Run this before publishing content changes.

The reviewed source is `server/content/courseReleaseData.ts`, used only by the API
and exporter. Corrections are matched to their original body hash and title (or an explicitly
reviewed previous release hash), so
later CMS edits are preserved. The recurring example is added only when absent.
The admin API exposes the effective text, allowing authors to edit and save it
normally. A repeated offline release with identical content does not rewrite the
manifest or discard the previous version.

Never edit files inside an existing content hash. Generate a new snapshot and
retain the previous one so cached manifests continue to resolve.

## Available MDX components

Common components are registered in `src/components/mdx/index.tsx`: `BurgerAnalogy`,
`Callout`, `Cards`, `Card`, `Metrics`, `Metric`, `Section` and `VideoEmbed`.
Markdown headings, paragraphs, tables, lists, fenced code and links receive shared
lesson styling. Keep a blank line between JSX tags and nested Markdown:

```mdx
<Card title="Consistency" accent="brand">

Explain the guarantee and its limits here.

- Include a concrete example.
- State the conditions under which it holds.

</Card>
```

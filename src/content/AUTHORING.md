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

## The animated restaurant

On a published lesson route, `BurgerAnalogy` also opens the restaurant diorama.
The same saved lesson progress used by the course builds its six permanent
stages. Watching, replaying or changing a demonstration step does not complete a
lesson. A concept can preview a station before the learner has unlocked its
permanent expansion; the interface distinguishes the demonstration from saved
construction progress. The CMS preview keeps the written example available
without requiring a course progress provider.

Keep the MDX example and both animation scripts aligned when adding or revising
a lesson:

- `src/components/restaurant/learningModel.ts` defines the canonical slug and
  route, bilingual concept title and improvement, and three bilingual teaching
  steps. Each step identifies the station the learner should observe. Register a
  new published lesson here so it participates in the restaurant's progress.
- `src/components/restaurant/visualModel.ts` defines each step's observable
  behavior: a required physical restaurant prop, source and destination stations,
  document identifier where relevant, visual cue, queue depth, blocked
  flow, failing station or peers where relevant. Author these per lesson; a shared
  animation mode must not invent a failure, successful write or transaction that
  contradicts the narration. Keep fault and blocking flags absent when no failure
  is being taught.

Every component must belong to the restaurant: staff, orders, receipts, menus,
recipe books, ingredient crates, employee badges, stockroom keys or delivery bags.
Use staff carrying and checking these objects, never abstract traffic dots, network
edges, floating computer panels or server racks. Branches must serve burgers.
Cache and replication retain and copy information on documents; they never copy
meals. A repeated ticket is visibly filed aside. Compensation issues a refund or
releases a reservation, never reverses cooking. Keep the physical action, selected
prop, identifier and narration consistent, and explain the limits of the analogy.
The lesson-by-lesson audit is recorded in `docs/restaurant-review.md`.

Review all three steps in both languages, with reduced motion, keyboard controls
and a narrow viewport. The renderer prefers WebGL and uses the same Three.js
scene through SVG when a GPU context is unavailable. Scene-load failures must
leave the written lesson and manual teaching steps usable. Run the restaurant
unit tests and `npm run test:e2e -- e2e/restaurant-scene.spec.ts` after changing the
scripts or renderer. The browser tests exercise the real engine in an isolated
mount; they do not bypass authentication or add a production testing route.

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

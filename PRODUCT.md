# Product

## Register

product

## Users

Software engineers and students learning distributed systems. They arrive in a study or practice mindset (often alongside docs, interviews prep, or coursework) and use interactive simulators, case studies, and the system editor to *run* concepts instead of reading about them. The editor doubles as a multiplayer game surface where players build architectures under live traffic and chaos.

## Product Purpose

Dinamos is a free, hands-on platform for mastering distributed systems. Its core promise: behavior you can observe, not prose. Success means a learner can build a topology, stress it, watch it fail, and understand why, all inside the browser with zero setup.

## Brand Personality

Curious, approachable, and precise. Dinamos shares Trilha Info's visual identity: Hanken Grotesk for the interface, Bricolage Grotesque for expressive headings, deep blue-black surfaces, bright pink actions, and mint progress cues. The learning workspace feels welcoming while keeping complex systems and telemetry legible.

The dark palette uses `#101218` for the canvas, `#151821` for panels, `#1b202c` for raised surfaces, `#f2f4f8` for primary text, `#a6b0c3` for supporting text, and `#323b4f` for borders. Pink (`#f23d7f`, with `#ff8ab5` for lighter accents) marks actions and selection. Mint (`#6ee7c8`) supports learning progress and healthy system states. Light mode carries the same typography and pink identity onto soft neutral surfaces.

## Anti-references

- Alarm-panel dashboards: saturated neon accents everywhere, blinking reds, "hacker terminal" cosplay.
- Generic SaaS landing aesthetics bleeding into the tool (cream backgrounds, gradient text, hero-metric cards).
- Toy-like simplification: dumbed-down controls that hide the real levers (queue depth, replicas, service time).

## Design Principles

1. **Make concepts observable.** Every concept earns a live visualization; telemetry supports explanation.
2. **The tool disappears into the task.** Standard affordances, consistent component vocabulary, no invented controls.
3. **Density with hierarchy.** Engineers want the numbers; give them dense data with clear scanning order.
4. **Give color a clear job.** Pink identifies actions and selection. Mint/amber/red/cyan distinguish system health and learning progress, with labels and icons supporting every state. Categories and ordinary navigation stay neutral.
5. **Fast feedback.** Edits reflect in the sim immediately; motion conveys state change in 150-250ms, nothing decorative.

## Accessibility & Inclusion

- WCAG AA contrast target; supporting text stays legible on its surface, and bright pink primary buttons use dark text for contrast.
- Touch layout parity: 44px minimum hit targets, bottom sheets replace hover/context-menu interactions.
- Reduced motion respected for all non-essential animation.
- i18n first-class (en/pt-BR via i18next); no text baked into imagery.

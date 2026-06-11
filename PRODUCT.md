# Product

## Register

product

## Users

Software engineers and students learning distributed systems. They arrive in a study or practice mindset (often alongside docs, interviews prep, or coursework) and use interactive simulators, case studies, and the system editor to *run* concepts instead of reading about them. The editor doubles as a multiplayer game surface where players build architectures under live traffic and chaos.

## Product Purpose

Dinamos is a free, hands-on platform for mastering distributed systems. Its core promise: behavior you can observe, not prose. Success means a learner can build a topology, stress it, watch it fail, and understand why, all inside the browser with zero setup.

## Brand Personality

Calm, precise, engineer-native. The UI reads like a well-kept command center: dark tactical surfaces, muted signal accents, monospace for data. Confidence comes from legibility and density done right, never from neon or alarm aesthetics.

## Anti-references

- Alarm-panel dashboards: saturated neon accents everywhere, blinking reds, "hacker terminal" cosplay.
- Generic SaaS landing aesthetics bleeding into the tool (cream backgrounds, gradient text, hero-metric cards).
- Toy-like simplification: dumbed-down controls that hide the real levers (queue depth, replicas, service time).

## Design Principles

1. **Show, don't tell.** Every concept earns a live visualization; telemetry beats explanation.
2. **The tool disappears into the task.** Standard affordances, consistent component vocabulary, no invented controls.
3. **Density with hierarchy.** Engineers want the numbers; give them dense data with clear scanning order.
4. **State is sacred.** Running/paused, healthy/saturated/failed, locked/editable: every state visibly distinct and color-consistent (green/amber/red/cyan signal semantics).
5. **Fast feedback.** Edits reflect in the sim immediately; motion conveys state change in 150-250ms, nothing decorative.

## Accessibility & Inclusion

- WCAG AA contrast target (tactical-label and dim tones are tuned for AA on their surfaces).
- Touch layout parity: 44px minimum hit targets, bottom sheets replace hover/context-menu interactions.
- Reduced motion respected for all non-essential animation.
- i18n first-class (en/pt-BR via i18next); no text baked into imagery.

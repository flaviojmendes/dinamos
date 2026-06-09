# Product

## Register

product

> The marketing landing page at `/` (logged-out) is a **brand** surface and is
> designed as such; the rest of the app (CommandCenter, simulators, forum,
> admin) is the primary **product** surface.

## Users

Software engineers, tech leads, and students learning distributed-systems
architecture. They arrive curious and skeptical: they want proof the material is
practical, not another theory dump. On the landing page they are evaluating
whether to invest time; inside the app they are in hands-on study mode, running
simulators and reading case studies.

## Product Purpose

"Dinamos" is a free, hands-on platform for mastering distributed systems:
interactive simulators (cache, circuit breaker, load balancer, sharding,
consensus, and more), real-world case studies (Netflix, WhatsApp, Uber,
Spotify), and a structured learning roadmap. Success = a visitor signs in and
runs their first simulator, leaving with the conviction that they should
experiment and validate, not just memorize.

## Brand Personality

Tactical, precise, expert, hands-on. The voice of an engineer who has run
systems at scale and is showing you the control room. Three words:
**operational, confident, demonstrative** (show the system running, don't just
describe it). Emotional goal: the quiet authority of a healthy ops dashboard.

## Anti-references

- Generic SaaS-cream landing pages with pastel blob illustrations.
- Bootcamp/course-seller pages heavy on hype, countdown timers, and fake scarcity.
- Flat "feature card grid + stock illustration" templates with no point of view.
- Editorial-magazine serif aesthetics (wrong register for an ops/terminal brand).

## Design Principles

1. **Show the system running.** Demonstrate distributed-systems behavior in the
   UI itself (live telemetry, flowing requests, scroll-driven topology) rather
   than describing it in prose.
2. **Operational calm.** Signal colors carry meaning (green=healthy,
   amber=section/warn, red=danger, cyan=info); never an alarm panel.
3. **Practice over theory.** Every claim is backed by a runnable artifact
   (simulator GIFs, real cases, free access).
4. **Earned motion.** Motion communicates flow and state, with a real
   `prefers-reduced-motion` fallback everywhere.
5. **Both themes are first-class.** Near-black tactical dark is the signature,
   but light mode is held to the same polish and contrast bar.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body text ≥ 4.5:1 in both themes. All scroll/loop motion has
a reduced-motion fallback (content visible by default, animation enhances). Live
telemetry decoration is `aria-hidden`; meaning is never carried by color alone
(icon + label accompany signal colors).

# Motion

Read this only when the page has motion. Default to less.

## When to move

- Motion is a layout idea, not decoration: cards that rise and stack, panels that open in turn, a sentence whose key words light up, a quote arriving line by line, a real number counting up. Each one belongs to one section and explains it.
- Ceiling: at most three sections hold the scroll (pinned, stepping through). Everything else moves only on interaction. Extra motion is offered to the designer, not added.
- Use the reference's recorded motion as evidence. `get_section_build_blueprint` can return browser-exposed animation values and observations from the screen recording. A still screenshot shows no motion; do not invent it from one.
- Small feedback is welcome: a pressed button, a hovered link, an opened menu.
- Avoid: everything fading up on scroll, parallax on text, scroll-jacking, carousels that move on their own, tilt and glow on hover.

## How to move

- Animate `transform` and `opacity` only. Never animate `width`, `height`, `top` or `left`.
- Never `transition: all`. Name the properties.
- Interaction feedback is fast: about 100 to 200ms. Exits are a little faster than entrances.
- Ease out for things arriving. No bounce unless the brand is playful.
- Motion must be interruptible: a new hover or click cancels the old one cleanly.
- Respect `prefers-reduced-motion`: remove movement, keep the content visible.
- Anything that moves on its own for more than five seconds needs a pause control.
- Content must be visible without JavaScript and before the animation runs. Animate from an already-visible state, not from hidden.
- Use `will-change` only while an element animates.

## If you use GSAP

- Install and register only the plugins used (`gsap.registerPlugin(ScrollTrigger)`).
- Use transform shorthands (`x`, `y`, `scale`, `rotation`) and `autoAlpha` instead of `opacity` plus `visibility`.
- Sequence with a timeline, not chained `delay` values. Use `stagger` instead of many separate tweens.
- Put a ScrollTrigger on the timeline, not on tweens inside it. Do not combine `scrub` with `toggleActions`.
- Create ScrollTriggers in page order, and call `ScrollTrigger.refresh()` after layout changes such as images or fonts loading.
- Handle reduced motion and breakpoints with `gsap.matchMedia()`.
- In React, use `useGSAP()` with a scoped ref so animations clean up on unmount; run nothing during server rendering.
- When several `from()` tweens animate the same property, set `immediateRender: false` on the later ones.
- Remove `markers: true` before shipping.
- Use the pointer-follow helper `gsap.quickTo()` instead of a new tween on every mouse move.

If the project already uses another motion library, use that one and apply the same principles.

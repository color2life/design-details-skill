# Craft rules

The floor. Every page passes these before the designer sees it. The brief or the designer can overrule a rule; say so when they do.

The floor is not the ceiling. These rules make a bold design work; they are never a reason to make it less bold. When a rule and a bold move collide, change the technique, not the idea.

## Tokens

- Every colour, font, radius and shadow is a custom property on `:root`, defined once. No loose hex values in components.
- One or two type families. A clear scale: few sizes, each with a job. Five type roles at most ([layout](layout.md)).
- Set `color-scheme` and `theme-color` so browser controls match the page.
- Theme the small surfaces too: text selection, focus rings, scrollbars where visible.

## Type

- Body text 16px or larger, line length about 60 to 75 characters, line height around 1.5 (serifs a little more).
- Large display type usually wants slightly tighter letter spacing; never tighter than about -0.04em. All-caps text, when used, needs a little extra spacing.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs, `font-variant-numeric: tabular-nums` where numbers line up.
- More space above a heading than below it, so it belongs to what follows.
- Proper characters: curly quotes, `…`, non-breaking spaces between numbers and units.
- Check the font actually loaded. A fallback face changes the whole design.

## Layout

- The headline, the supporting line and the main action are visible on the first screen at 1280 × 800 and on a phone.
- A content container with a maximum width that still looks right at 1920 wide.
- Group with space and alignment before reaching for borders, boxes or rules.
- One space between sections, held through the page; vary the arrangement inside, not the gap ([layout](layout.md)).
- No horizontal scroll: use `overflow-x: clip`, never `100vw` widths.
- Use `min-height: 100dvh`, not `100vh`, for full-screen sections.
- Images have explicit width and height (or aspect ratio) so nothing jumps. Lazy-load images below the first screen.

## Colour and contrast

- Text contrast at least 4.5:1 (3:1 for large text). Check secondary text and text on images, not only body text.
- Text on photos is allowed. Make it readable with a scrim or gradient behind the text, a crop that puts calm areas under it, heavier or larger type, or a solid band. Moving the text off the photo is the last resort, not the first.
- Text on a coloured background is a tint or shade of that colour, not plain grey.
- One accent colour, used sparingly. If everything is highlighted, nothing is.
- Hover and pressed states are visibly different from rest, with enough contrast.

## Interaction and access

- Real elements: `<button>` for actions, `<a>` for navigation, headings in order, one `<h1>`.
- Every interactive element has a visible `:focus-visible` style. Never remove the outline without a replacement.
- Icon-only buttons have an `aria-label`. Decorative images have empty `alt`; meaningful ones describe what they show.
- Tap targets at least 44 × 44px on touch screens.
- Forms: labels on every field, the right `type` and `autocomplete`, errors next to the field, never block paste.
- A skip link to the main content on pages with navigation.

## Copy

- Headlines name the thing and who it is for. Short, concrete, no slogans that fit any company.
- Buttons are a verb plus an object ("Book a table", "Start free trial"), never "Learn more" or "Click here".
- Sentence case. Active voice. Talk to the reader as "you".
- Little text: say it once, in the place it is needed.
- Never invent metrics, customer logos, testimonials, awards, case studies or contact details.

## Performance

- Compress images and serve modern formats at sensible sizes.
- Preload the fonts used on the first screen; load only the weights you use.
- No layout shift as the page loads.
- Nothing heavy (video, 3D, effects) blocks the first screen from showing.

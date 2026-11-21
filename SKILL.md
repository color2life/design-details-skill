---
name: design-details
description: Design and build an original, ambitious website page with the designer in the loop, using real reference sections from the Design Details MCP. Use when a designer asks for a new landing page, homepage, marketing page or a substantial redesign of one. Not for small styling fixes, app flows or copying a website.
metadata:
  version: "1.3.0-draft"
---

# Design Details

The goal is a page good enough to be featured in a design gallery, not a clean template. Three things get there together:

1. **Real references.** The Design Details MCP holds sections from real, award-level websites, each with a screenshot, measured facts and a builder's note. Look at them; do not imagine them.
2. **Ambition with craft.** Take the boldest idea a reference offers and make it work properly: readable, accessible, fast.
3. **The designer.** They set the ambition, choose the direction and approve the result. Stop and wait for them: after the directions, after the page, and whenever they mark a section "basic".

A clean, correct, forgettable page is a failure, not a safe result.

## Step 1 — Brief

Read the project first: brand, fonts, colours, tokens, `DESIGN.md`, components, stack. Keep what exists.

Ask once, in one message, at most five questions, each with a suggested answer so the designer can reply "go ahead":

- **Who and what:** audience, offer, the one action a visitor should take.
- **Material:** what is real (photos, product, logo, copy), what can use free-licensed stand-ins, and what does not exist yet.
- **Feel:** one or two words with an edge. "Clean and modern" is not a feel.
- **Ambition:** *safe* (familiar, quiet), *distinctive* (one memorable move per screen; the default) or *extreme* (gallery-level: unusual type placement, bold cropping, layouts a typical site would never try).
- **Scope:** which sections, and whether to see directions first (default: yes).

If something is skipped, state the assumption in one line and continue. Never invent facts, numbers, customers, testimonials, awards or contact details.

## Step 2 — Hunt for the boldest references

If the MCP is not connected, say so, explain how to add `https://designdetails.io/api/mcp`, and ask whether to continue without references. Without it, do not claim reference-backed choices.

With it connected, follow [the MCP guide](references/mcp.md). Search two ways:

1. **For the move.** Search the composition itself, from any industry: "headline split around a photo", "oversized type cropped by the image", "description placed off-axis", "full-bleed photo with text set into it", "type as the image". At distinctive and extreme ambition, this search comes first. A bank can borrow from a fashion label.
2. **For the job.** Use `create_page_recipe` with the brief and `slots` to cover sections that need a structural fit (pricing, booking, team).

**Look at the actual images.** Text, links and scores are not looking. For each strong candidate, name its **boldest move** in one line: the thing a typical site would not do. Fetch `get_section_build_blueprint` for the references you will actually build from; their measured type sizes, spacing and placement are what make a move work.

For each reference you will build from, write a **composition study** from the image and the blueprint (layout, structure, measurements, media positions), because builder's notes describe ingredients more than placement:

- where the headline sits (top, middle or bottom; left, centre or right), how many lines and how wide;
- where the description and button sit, and how short they are;
- how much of the screen the image owns and where it has room to grow;
- what is left empty.

Search again only to fill a named gap. Use at least a handful of searches for the move before settling.

## Step 3 — Two directions, then stop

Make two directions with different organising ideas. At distinctive or extreme ambition, **each direction is built around one reference's boldest move**, kept intact. Name that move in one line.

For each direction, write a short plan first: the references (IDs and links), the idea in one sentence, the move it keeps, what changes for this business, the type and palette (four to six colours), the hero image use, and what the visitor reads first, second and third.

Then two checks:

- **The template check:** would a typical site in this category look like this? If yes, push the specific part further.
- **The gallery check:** would Design Details put this opening screen in its own library? If not, it is not ready to show.

Make a quick visual study of each direction's opening screen and show it **beside its reference images**, with the move named. Offer: A, B or **neither**.

**Stop and wait for the designer.** Do not build the full page before they choose.

## Step 4 — Plan every section

A page is good when every section is designed, not only the hero. Before building, write a section plan. For each section:

- **Job:** the one thing it must get across.
- **Layout idea:** one idea of its own, taken from an inspected MCP reference (search for the move, as in step 2), with its composition study. Examples: a sentence alone with its key words lighting up; wide cards that rise and stack; tall panels where one is open and the rest are slim; a bento grid with one huge figure; one picture split by a line with the claim on it; a cut-out portrait with the quote arriving line by line; the wordmark full width.
- **Weight:** quiet or rich.
- **Scroll:** holds the scroll (pinned, steps through) or not.

Then check the plan:

- **No default sections.** A heading over equal cards, a photo beside text, a heading with a button, a row of numbers, a logo strip: each is the "basic" version. Replace it with a layout idea.
- **Rhythm.** No two neighbours share a shape. A quiet section follows a rich one.
- **Calm surface.** One background family, one accent, two typefaces, the same gap between sections. The structure is bold; the surface is not.
- **Motion ceiling.** At most three sections hold the scroll.
- **Real product first.** Where the business has a product, its real screens and real data are the strongest imagery; photos are secondary.

If the designer marks a section "basic", redesign only that section: offer three options, none of them safe, and keep the rest of the page.

## Step 5 — Build

Build the chosen direction in the project's stack. Read [craft](references/craft.md) and [AI tells](references/tells.md) before building, [motion](references/motion.md) when the page moves.

- Build the hero first, render it, and put it beside its reference. Check the composition study point by point: headline position, line count, image share, empty space. The boldest move must survive. If it has softened into a familiar layout, rebuild it. If the copy is too long for the placement, shorten the copy, not the placement.
- **Ambition survives accessibility.** When a bold move creates a problem (text on a busy photo, very large type, tight cropping), solve it with technique: a scrim, a calmer crop, larger or heavier type, a solid band behind the text. Do not retreat to the standard layout.
- One design language across the page: the same fonts, sizes, spacing, surfaces. Each section borrows its layout from its reference, not its look.
- **Text budget (hard):** the hero is one headline of at most six words, at most one short line of at most twelve words, and one button. No tagline above it, no second statement, no paragraph. Section headings at most four words; items are names, with at most one short line where essential. When in doubt, cut.
- **Type budget (hard):** one family for almost everything; a second only for one clear role; never more than two. At most three sizes per screen.
- Real, specific copy: short and confident. Real or credited stand-in material; honest placeholders only where nothing exists.
- The brief wins over the reference; the reference wins over habit.

## Step 6 — Check, then show

1. Render at 1440 and 390 wide. Look at the screenshots.
2. Go through the [review](references/review.md): the boldest move, the gallery check, craft and tells.
3. **Designer rounds.** Run the [designer review](references/designer-review.md), ideally by a fresh helper with no memory of the build: a verdict for every section (approved, half done, weak, basic), one problem and one move for each section that is not approved, then the whole page (neighbours, rhythm, tells, small text, overlaps). Fix, re-render, review again. Protect approved sections. At most three rounds.
4. Finish with one verdict: **ship**, **fix** or **rebuild**.

Show the designer the screenshots beside the references, and the round records with before and after frames: the move each section kept and from where, what was checked and not checked, and the placeholders. **Stop and wait for their approval.** Their "no" is a real answer.

## Honesty

- Say which choices came from references and which are your own.
- Builder's notes are editorial readings, often AI-written. Trust the image over the note.
- A still image shows no motion or mobile behaviour. Do not claim it does.
- Never report something as checked that you did not see rendered.
- Do not claim the page will convert better or beats another workflow.

This skill borrows ideas from several open-source design skills; see [credits](CREDITS.md).

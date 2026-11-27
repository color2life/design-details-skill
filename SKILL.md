---
name: design-details
description: Design and build an original, ambitious website page with the designer in the loop, using real reference sections from the Design Details MCP. Use when a designer asks for a new landing page, homepage, marketing page or a substantial redesign of one. Not for small styling fixes, app flows or copying a website.
metadata:
  version: "1.10.0"
---

# Design Details

The goal is a page good enough to be featured in a design gallery, not a clean template. Three things get there together:

1. **Real references.** The Design Details MCP holds sections from real, award-level websites, each with a screenshot, measured facts and a builder's note. Look at them; do not imagine them.
2. **Ambition with craft.** Take the boldest idea a reference offers and make it work properly: readable, accessible, fast.
3. **The designer.** They set the ambition, choose the direction and approve the result. Stop and wait for them: after the directions, after the page, and whenever they mark a section "basic".

A clean, correct, forgettable page is a failure, not a safe result. So is a page where everything is loud. The target is **one bold idea on a calm page**: the idea is remembered because nothing around it competes. [Layout and spacing](references/layout.md) is how; read it before step 3.

## Bold is not big

Giant type is one way to be bold, and the most overused one. Pages that all end in a huge word, a few small lines and one button look alike, whatever the business. The kinds of bold:

- **Type-led:** the scale and placement of the words are the idea.
- **Image-led:** one photograph or film owns the screen; the type is modest and placed with care.
- **Product-led:** the real product is the hero, large and working.
- **Object-led:** one object or illustration carries the idea.
- **Structure-led:** an unusual grid, list, sequence or interaction is the idea.
- **Quiet:** small type, wide space and one exact detail; restraint is the move.

Choose by the brief and the material, not by what looks loudest. Type should be as big as the idea needs, not as big as fits.

## Step 1 — Brief

Read the project first: brand, fonts, colours, tokens, `DESIGN.md`, components, stack. Keep what exists.

Read the **look log**, `design-details-looks.json` in the project root, if there is one. It lists the last pages made with this skill: flavour, fonts, colours, hero shape, main object, references. Read the list only; do not open the old pages. This page must not reuse a font, hero shape, main object, reference or flavour version from its last five entries, or the last entry's flavour, unless the brand or the designer asks for it.

Ask once, in one message, at most five questions, each with a suggested answer so the designer can reply "go ahead":

- **Who and what:** audience, offer, the one action a visitor should take.
- **Material:** what is real (photos, product, logo, copy), what can use free-licensed stand-ins, and what does not exist yet. If the business has a product but no screens were supplied, ask how to show it: real screens (send them or a working link), polished sample screens built for the page (suggested), or photos. Never offer sketches.
- **Flavour:** the page's look, chosen by the designer from a short menu with real examples. Follow [flavours](references/flavours.md): offer three flavours that could suit the brief and one wild card, each shown with two or three real websites from the MCP, and ask which one, or a mix of two. Never pick the category's default look on your own; when the designer says "you choose", the script draws it, not you.
- **Ambition:** *safe* (familiar, quiet), *distinctive* (one memorable move per screen; the default) or *extreme* (gallery-level: compositions a typical site would never try, of any kind above).
- **Scope:** which sections, and whether to see directions first (default: yes).

Before going on, copy the supplied facts into a **fact sheet**, one per line, word for word: the headline, names, prices, dates, times, quantities, states (in or out, open or closed, done or failed), the main example and who did what in it. Every later step is checked against it.

Show the flavour menu in the same message as the questions. If something else is skipped, state the assumption in one line and continue. Do not start step 3 without a flavour. Never invent facts, numbers, customers, testimonials, awards or contact details.

## Step 2 — Hunt for the boldest references

If the MCP is not connected, say so, explain how to add `https://designdetails.io/api/mcp`, and ask whether to continue without references. Without it, do not claim reference-backed choices: skip the searches, use the flavour version's description as the look, and write the composition study for your own idea.

With it connected, follow [the MCP guide](references/mcp.md). Search two ways:

1. **For the move.** Search for a composition, from any industry. At distinctive and extreme ambition, this search comes first. A bank can borrow from a fashion label. **Write every search yourself, from this brief:** start from what only this business has (an object, a moment, a material, a habit of its customers) and describe a layout built around it, in the words of what you would see on screen. Never send a phrase copied from this skill or from an earlier project; the same words return the same references, and every page ends up looking alike.
2. **For the job.** Use `create_page_recipe` with the brief and `slots` to cover sections that need a structural fit (pricing, booking, team).

**Spread the net.** Ask for 20 results per search (`limit: 20`) and look past the top three before choosing. Use each website at most once per page. A few loud heroes match many searches; use one only if it fits this brief better than everything else you saw, and say what else you considered.

**Look at the actual images.** Text, links and scores are not looking. For each strong candidate, name its **boldest move** in one line: the thing a typical site would not do. Fetch `get_section_build_blueprint` for the references you will actually build from; their measured type sizes, spacing and placement are what make a move work.

For each reference you will build from, write a **composition study** from the image and the blueprint (layout, structure, measurements, media positions), because builder's notes describe ingredients more than placement:

- where the headline sits (top, middle or bottom; left, centre or right), how many lines and how wide;
- where the description and button sit, and how short they are;
- how much of the screen the image owns and where it has room to grow;
- what is left empty;
- the space around the headline, between groups and between sections, in pixels or as a share of the screen.

Search again only to fill a named gap. Use at least a handful of searches for the move before settling.

## Step 3 — Two directions, then stop

**Drop the first idea.** Before searching or sketching an opening, write five hero ideas, one line each, with different main objects and at least three different shapes. Then name the one most designers given this brief would think of first (usually the headline's wording, or the product's most obvious object, acted out) and cross it out, along with any that repeats the look log. Both directions come from what is left, with different shapes and different main objects. A quiet or plain idea is allowed to win.

**The object carries a fact.** The main object must show something true and specific about this business, taken from the fact sheet, so that removing it would remove information; a visitor must read that fact right without a key. Fit the mood to the visitor: an idea that makes a serious task look like a toy is crossed out unless the brief or flavour asks for play.

**The opening is not a box of small things.** Without real product screens, it is never a card, panel, framed chart, form or sample screen, with or without its border, however nicely set; crossing out one panel and keeping another does not count. A list on the page's own ground is allowed only when one entry is the picture: at least three times the others' height, its figures at headline size (log its shape as `enlarged-row`). Draw the record itself at the scale of the screen; samples start in section two. Drawing is not inventing: depicting a supplied fact (24 ewes, a 30-second wait) in any material is allowed, as long as it adds no claim. Among the five ideas, at least one has no flat colour ground, one lets something run off the edge, and one is not "headline top-left, object beside it".

**The mark.** If the object has a unit that can be counted, stretched or placed (a print for one ewe, a bead for one second), or a part that can act again (the toy, stood up), it is the page's drawing language: it returns two or three times lower down with **new facts**, smaller, where a section truly has that fact to show. It informs or it stays out; bullets and rows of little icons are decoration.

Make two directions that **differ in kind**: two different kinds of bold from the list above. **At most one may be type-led.** Both use the **chosen flavour**; they differ in layout and in their one signature move. At distinctive or extreme ambition, **each direction is built around one reference's boldest move**, kept intact. Name that move in one line.

Each direction has **measures**, a **look** and a **layout**:

- **Measures:** the grid, the four spaces, the five type roles and the surfaces ([layout](references/layout.md)), written down before the study is drawn. Sketch three arrangements of the opening and keep one.
- **Look:** the surface system (type pairing, palette, paper or background, how photos are treated, corners and rules) from the chosen flavour and its reference website (`get_website_design`). The same for both directions and for every section.
- **Layout:** the composition, taken from the section reference whose move it keeps.

For each direction, write a short plan first: the references (IDs and links), its kind of bold, the idea in one sentence, the move it keeps, the look and where it comes from, what changes for this business, the type and palette (four to six colours), the hero image use, and what the visitor reads first, second and third.

Then two checks:

- **The blind read:** render both studies at 1440 and 390 and run the opening read in [blind read](references/blind-read.md). Its answers decide; you do not.
- **The sameness check:** put the two studies side by side, then run `node scripts/look-log.mjs check design-details-looks.json <look file>` for each (the script's first lines show the file's fields). If the two share a shape, or the script reports a repeat the brand or designer did not ask for, change it. The script matches words; also ask whether the opening would look like a logged one to someone who saw both.

Make a quick visual study of each direction's opening screen and show it **beside its reference images**, with the move named. Offer: A, B or **neither**.

**Stop and wait for the designer.** Do not build the full page before they choose.

## Step 4 — Plan every section

A page is good when it is designed as one thing by one hand, not when every section has a trick. A page where every section is clever reads as generated. Before building, write a section plan.

**Move budget (hard):** one **signature move** for the page (usually the hero) and at most **two supporting moments**. The mark may appear in any section; it is language, not a device. Every other section has no trick, but it is still **composed**: its content is made into the thing you see, at heading size or more, and the text that explains it is lead size and touches it, not across an empty column.

**Page system:** one set of measures, one mark, and compositions from [layout](references/layout.md) ("Make the content the picture"), so the page varies its arrangements but keeps one hand.

For each section (sketch three arrangements for the signature, the supporting moments and the longest section, as in [layout](references/layout.md)):

- **Focus:** the one largest thing, its support, its detail.
- **Arrangement:** columns, where each thing starts, what is left empty.
- **Job:** the one thing it must get across.
- **Role:** signature, supporting moment, or composed.
- **Structure:** for the signature and supporting moments, one idea taken from an inspected MCP reference (search written from this section's content, as in step 2), with its composition study. For the rest, which composition it uses, informed by a quiet reference when one helps.
- **Weight:** quiet or rich.
- **Scroll:** holds the scroll (pinned, steps through) or not.

Then check the plan:

- **Nothing basic.** No section is only a heading with small text, a lone table, a default stacked form, equal icon cards, a stats row or a logo strip; "heading left, text right" appears once at most. Plan the lower half before building the opening. A flavour that asks for plainness does not excuse it.
- **Keep the content.** Shortening words is right; dropping a supplied record, list or set of figures because it is hard to compose is not. Draw it.
- **Rhythm.** No two neighbours share a shape. A quiet section follows a rich one.
- **Motion ceiling.** At most three sections hold the scroll.
- **Real product first.** Where the business has a product, its real screens and real data are the strongest imagery; photos are secondary. If there is a working app (a URL or a folder), run it and screenshot the real screens.
- **No screens? Build polished samples, not sketches.** When nothing real exists (and the designer chose or did not answer), build sample screens in HTML at shipped-product quality: real type sizes, realistic data and names, the page's surfaces, quiet depth (a soft shadow or a paper edge), on the page's own ground or as one object, with no browser frame. Label them with the one word "Sample"; no other notices ("fictional", "not connected") unless the brief asks. Never draw the product's *screens* as wireframes or annotated diagrams: they read as unfinished. (Drawing the facts is different, and wanted.)

If the designer marks a section "basic" or "bad", redesign only that section: offer three options, none of them safe, and keep the rest of the page.

## Step 5 — Build

Build the chosen direction in the project's stack. Read [craft](references/craft.md) and [AI tells](references/tells.md) before building, [motion](references/motion.md) when the page moves.

- Build the hero first, render it, and put it beside its reference. Check the composition study point by point: headline position, line count, image share, empty space. The boldest move must survive. If it has softened into a familiar layout, rebuild it. If the copy is too long for the placement, shorten the supporting copy. A **supplied headline** is never reworded or cut, whatever its length: change the placement, the size or the layout instead, or ask the designer. Keep the supplied main example too (its time, names and result), or ask; do not swap it for one that suits the picture.
- **Ambition survives accessibility.** When a bold move creates a problem (text on a busy photo, very large type, tight cropping), solve it with technique: a scrim, a calmer crop, larger or heavier type, a solid band behind the text. Every word over a picture sits on a calm area, a scrim or a band; the checker measures it. Do not retreat to the standard layout.
- **What the brief puts on the first screen stays there** (a price, an allowance, the action and its field).
- **Whole facts (hard).** A number, amount or time that carries a fact stays on one line at both widths and is never printed over another figure. Names and code may wrap at a natural break. Plan the phone's size first. Code is monospaced, so every character reads true; that face does not count as a family.
- One design language across the page: the same fonts, sizes, spacing, surfaces. Each section borrows its layout from its reference, not its look.
- **Text budget (hard), set by the direction's kind:**
  - *Type-led or object-led:* one headline of at most six words, one line of at most twelve words, one button.
  - *Image-, product-, structure-led or quiet:* one headline of at most ten words, at most two short sentences (about thirty words), one filled button and at most one text link.
  - *Headline limits apply to headlines you write.* A supplied headline stays as it is.
  - *First screen:* at most 60 visible words, counting everything but the menu: labels, captions and words inside the picture. Put the full list lower down, and mark sample screens there `data-sample`.
  - *Always:* no tagline or label above the headline, no second statement. Section headings at most six words; When in doubt, cut words, not facts.
  - *Whole page:* about 450 visible words (nav, footer and legal lines not counted). Shorten sentences first; never drop a supplied record, list or set of figures to reach it. One quote per section. List every cut for the designer.
- **Type floor (hard):** body text at least 17px in near-black (or near-white on dark), at a normal weight. Small grey text is for captions only. Headings have real weight; avoid light and thin weights for anything a visitor must read.
- **Type budget (hard):** one family for almost everything; a second only for one clear role; never more than two. Five roles (display, heading, lead, body, detail), each with one size, so at most five sizes per screen; details may be 13 to 15px. An explanation beside type of 48px or more is lead size (20px or more). The largest size is set by the idea: only a type-led page uses poster type. On every other kind the headline stays smaller than the main object and under about 8% of the screen's width (115px at 1440).
- Real, specific copy: short and confident. Real or credited stand-in material; honest placeholders only where nothing exists.
- The brief wins over the reference; the reference wins over habit.

## Step 6 — Check, then show

1. Render at 1440 and 390 wide. Look at the screenshots. Then **squint** ([layout](references/layout.md)): one focus on every screen, every space on the measures.
2. Run the page checker from this skill's folder: `node scripts/check-page.mjs <page file or URL> --kind <type|image|product|object|structure|quiet> --headline "<the supplied headline>"` (leave `--headline` out when none was supplied; add `--squint <folder>` for the blurred screens). Fix every **fail** and every **warn** you can; a warn stays only when fixing it would break the idea, with that reason. It checks what a script can see (labels above headings, accent words, the type and text budgets, the supplied headline, uneven spacing, flat type, strong bands, heading edges, page word count, contrast (over pictures too), overflow, side-by-side filled buttons, script errors); it does not judge design.
3. **Fact check.** Go down the fact sheet line by line against the rendered page, at both widths: the same value, the same state, the same person. Each line is *same*, *cut* (listed for the designer) or *wrong* (fix it). Look at pictures and drawn states too, not only the words. Use every control once: it works, or it goes. Note every photo's licence and the page's weight.
4. **Blind read**, opening and page ([blind read](references/blind-read.md)). Act on every gate, then read again; two opening reads and two page reads at most, then the designer decides.
   Go through the [review](references/review.md): the boldest move, layout, craft and tells.
5. **Designer rounds.** Run the [designer review](references/designer-review.md), ideally by a fresh helper with no memory of the build: a verdict for every section (approved, half done, weak, basic), one problem and one move for each section that is not approved, then the whole page (neighbours, rhythm, tells, small text, overlaps). Fix, re-render, review again. Protect approved sections. At most three rounds. After the last fix, a fresh helper looks at the changed screens and the fact sheet once more; if none can, say "last fixes not independently reviewed".
6. Finish with one verdict: **ship**, **fix** or **rebuild**.

Show the designer the screenshots beside the references, and the round records with before and after frames: the move each section kept and from where, what was checked and not checked, and the placeholders. **Stop and wait for their approval.** Their "no" is a real answer.

Once the page is finished, record its look: `node scripts/look-log.mjs add design-details-looks.json <look file>`.

## Honesty

- A weak spot you can name and fix is a fix, not a note. Notes list only what could not be checked or what the designer must decide.
- Evidence is made when it is needed: ideas, sketches and studies exist before `site/`. Do not write them afterwards; if one was skipped, say skipped.
- Say which choices came from references and which are your own.
- Builder's notes are editorial readings, often AI-written. Trust the image over the note.
- A still image shows no motion or mobile behaviour. Do not claim it does.
- Never report something as checked that you did not see rendered.
- Do not claim the page will convert better or beats another workflow.

This skill borrows ideas from several open-source design skills; see [credits](CREDITS.md).

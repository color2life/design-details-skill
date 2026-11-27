# Layout and spacing

Use in steps 3 to 6. One bold idea, carried by a calm page. The calm is designed: it comes from size contrast, room and alignment, not from having less to say. A plain page with no idea is not calm, it is empty.

## Set the page's measures first

Write these in `review/measures.md` (or beside the plan) before any styling, and define them as tokens.

- **Grid:** twelve columns, one outer margin, one gap. Choose **two or three left edges** that headings and blocks share from top to bottom. Full-bleed is for the signature and one or two others.
- **Space, four steps:** *inside a group* (8 to 16px), *between groups* (32 to 48), *between a heading and its content* (48 to 80), *between sections* (120 to 176 at 1440 wide; 72 to 104 at 390). Use only these. Take the proportions from the references you studied when you have them.
- **Between sections, hold one value**, the same above and below. The one exception is the signature, which may touch an edge or its neighbour on purpose.
- **Type, five roles:** *display* (headline), *heading*, *lead* (any explanation beside large type), *body*, *detail* (captions, units, table heads). Each clearly different: at least 1.25 times the next one down. A fact that is a section's focus may use display or heading size.
- **Weight:** one normal, one strong. Strong marks the first thing to read; everything else is normal. Where most words are bold, nothing is.
- **Surface:** one main background, the signature's own, and at most two strong full-width bands, in the brand's colours, placed where the page needs a change of pace. A quiet tint is not a band.

## One focus for each section

Every section has three layers and no more:

1. **Focus:** one thing, clearly largest: a heading, a number, a picture, one row of a list. If the heading is the focus, the object is quiet; if the object is, the heading is.
2. **Support:** one line or one short group.
3. **Detail:** small, aligned, out of the way. It can be read; it does not call.

Two things of the same size, weight or colour strength means no focus: choose one.

- **Tables and lists:** one column leads by size or weight, the rest are normal or detail. Lines only between rows that need them, thin.
- **Boxes:** space and alignment first. A box only for a thing that is an object (a screen, a ticket, a form).
- **The exception is enlarged, not tinted.** The open row, the failed event, the late one is clearly larger and the normal rows stay small. Once per page.
- **An empty column needs a heavy opposite.** Space beside a giant figure reads as chosen; space beside a small heading reads as unfinished. Put names, filters or facts there, or close it.
- **Support touches its focus.** The line that explains a thing sits directly beside or under it, at lead size.
- **First screen:** headline, one line, action, object, with air between. The headline has clear space around it, at least its own line height, before the next thing. If the object and headline fight, the headline goes smaller or the object moves to where it has room.

## Sketch three, keep one

For the signature, each supporting moment and the longest section, write three grey-box layouts before styling: which columns each thing takes, where it starts, how tall, and **what is left empty**. They must differ in arrangement (where the eye enters, which side is empty, what overlaps or crops), not only in mirror image. Keep the one with the clearest first read that a template would not produce. One line on why it won. Include one that lets the object be much smaller than you would expect, and one much larger.


## Make the content the picture

Below the opening, most sections fail the same way: a heading, small text, a table or a form. Before writing any section ask what its content **is** (a count, a length of time, an amount, an order, a before and after, a place, a rule, a promise) and draw that:

- *A count, length or position* shown as one, to scale: things you can count, a gap you can see, a time where it belongs on the day.
- *Line against line*, when the content is a before and after: sent and received, bank and ledger, matched across the width.
- *A photograph or object carrying the labels*, when the content is a place or a thing.

These are examples; the answer may be another kind entirely. The form uses the page's own type, edges and object, never the default stacked box.

Every number, mark and position drawn must be true: if three were flagged, three show. Use each kind at most twice on a page.

Neighbouring sections never share a column split. "Heading left, text right" appears once at most. Product rows sit on the page's ground with thin rules, not in a shadowed card.

## Squint

1. **Squint:** `node scripts/check-page.mjs <page> --squint <folder>` saves every screen blurred and grey. Look at each: one shape stands out, the second is clearly second, groups are separate, empty areas look chosen. If two things tie, or the screen is an even grey, fix size, weight or space (not colour).
2. **Space:** start at the left edge and at each section's top and bottom: do they land on your measures? Fix the odd ones.

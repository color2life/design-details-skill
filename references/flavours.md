# Flavours

The flavour is the page's look: type, colour, how photos are treated, surfaces, corners and rules. The designer chooses it in step 1. It is never left to the model, because a model left alone dresses each business in its category's costume (dark serif for luxury, mono grids for tech, beige for wellness), and that is the first thing that makes a page feel generated.

## The menu

| Flavour | Type | Colour | Pictures | Surface |
|---|---|---|---|---|
| **Editorial** | a book or newspaper serif with one plain sans | paper white or one deep ground, ink, one strong accent | large, well-cropped photographs given whole columns | grid with clear columns, hairlines only where they separate |
| **Swiss** | one grotesque in two or three weights | white and black with one primary colour | photos treated as flat blocks in the grid | strict grid, no shadows, no rounded corners |
| **Warm craft** | a humanist serif or sans with character | paper tones with one earthy but saturated colour | real objects and hands, natural light, texture | soft edges, generous space, visible materials |
| **Raw** | a system or monospaced face, used big and plainly | loud flat blocks, high contrast | photos uncropped, as found | hard edges, visible structure, nothing polished |
| **Playful** | a rounded or quirky display face with a friendly sans | bright, several colours used with rules | illustration, cut-outs, stickers | rounded shapes, bouncy but controlled motion |
| **Atmospheric** | a quiet sans or serif, small and confident | dark or deeply coloured grounds | cinematic photos or film, full bleed | few elements, lots of picture, slow motion |

## Versions

Each flavour has several versions that look clearly different. Choose a version, never just the flavour, so that Editorial is not always the same book serif on the same paper.

| Flavour | Versions |
|---|---|
| **Editorial** | `newspaper` (narrow columns, condensed headlines, black on white) · `catalogue` (art book: small type, big plates, numbered works) · `report` (annual report: figures set large in plain sans, deep solid ground) · `fashion` (high-contrast display face, tight crops, stark black and white) |
| **Swiss** | `poster` (one large flat shape of colour) · `timetable` (rows, columns and times as the design) · `museum` (small type, huge empty white) · `signage` (arrows, bold colour bands, very legible) |
| **Warm craft** | `workshop` (tools, hands, raw material) · `packaging` (labels, stamps, coloured card stock) · `kitchen` (daylight, tiles, painted colour) · `textile` (woven pattern, stitched edges, rich dye) |
| **Raw** | `ticket` (receipts, perforations, plain print) · `index` (a bare list as the page) · `zine` (photocopy contrast, pasted blocks) · `utility` (form fields and tables left plain) |
| **Playful** | `sticker` (cut-outs on flat colour) · `toy` (rounded solid shapes, primary colours) · `comic` (panels and thick outlines) · `game` (pieces, boards, moves) |
| **Atmospheric** | `film` (full-bleed stills, caption-size type) · `night` (dark ground, one light source) · `weather` (sky, haze, changing colour) · `gallery` (one lit object in a coloured room) |

These are starting points, not themes. The designer can mix two ("Swiss with warm craft photos") or name their own.

## How to offer it

1. From the brief, choose **three flavours that could suit it and one wild card** that the category would never use. The category default may be one of the three only if the designer's words point to it.
2. For each, find **two or three real websites in the MCP** that show it: search with your own words for the flavour as it would look on screen (not the flavour name), or browse `list_websites`, then confirm with `get_website_design` and the images. Show the images, not a description.
3. Ask: "Which flavour, or a mix of two?" One line per option: its name, what it would mean for this business, and the sites shown.
4. If the designer says "you choose", do not choose: list two versions of each flavour on your menu that could suit the brief (leave out the category default) and let the script draw one: `node scripts/look-log.mjs pick design-details-looks.json swiss/museum swiss/signage editorial/fashion …`. Keep the first draw; do not draw again until you like it. If it truly cannot suit the brand, say why, remove that option and draw once more.
5. Without the MCP, describe each version in one line instead of showing sites.

## How it is used

- **Fonts:** start from the reference site's own typefaces and find the nearest free match; without a reference, write down three faces that suit the version and use one that is not in the look log. There is no default font. If it is the first one you thought of, look at the other two again.
- **Colour:** take it from this business's own material (its object, place or product), not from the flavour's usual ground.
- The chosen flavour and its reference site set the whole page's look. Both directions in step 3 share it; they differ in layout and in their one signature move.
- Every section uses the same look. Section references lend structure, never their own surface.
- If the brand already has fonts, colours or a design system, the flavour adapts to them; it does not replace them.

# Design Details skill

A skill for AI agents that design and build ambitious website pages with a designer in the loop, using real reference sections from the [Design Details](https://designdetails.io) MCP.

Six steps: brief, hunt for the boldest references, two directions (then stop), plan every section, build, check with designer review rounds (then show).

## Use it

- **Claude Code / agents that read skills:** copy this folder into your skills folder (for example `.claude/skills/design-details/`).
- **ChatGPT or any other chat AI:** give it `SKILL.md` and the files in `references/`, then your brief.

## Connect the MCP

Add `https://designdetails.io/api/mcp` as a remote MCP server in your AI client. Clients without MCP can use the read-only GET form, for example:

`https://designdetails.io/api/mcp?tool=search_sections&args={"q":"headline split around a photo"}`

## Files

- `SKILL.md`: the six steps
- `references/flavours.md`: the flavour menu the designer chooses the look from
- `references/craft.md`, `tells.md`, `motion.md`: build rules
- `references/review.md`, `designer-review.md`: review and designer rounds
- `references/mcp.md`: how to use the MCP
- `scripts/check-page.mjs`: a page checker that runs in a real browser (`npm i -D playwright && npx playwright install chromium`, then `node scripts/check-page.mjs page.html`)
- `CREDITS.md`: open-source skills whose ideas this one learned from

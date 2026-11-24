#!/usr/bin/env node
// Keeps a short record of each page's look so the next page does not repeat it.
//   node look-log.mjs pick  <log.json> swiss/museum editorial/fashion raw/ticket
//   node look-log.mjs check <log.json> <look.json>
//   node look-log.mjs add   <log.json> <look.json>
// look.json: {"page","flavour":"editorial/fashion","fonts":[],"colours":[],"heroShape","heroObject":["receipt","card"],"references":[]}
// Name hero objects in single plain nouns so repeats are caught.
// Set "fixed": ["fonts"] for anything the designer or the brand asked for; check skips it.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomInt } from "node:crypto";

const REMEMBER = 5;
const SHAPES = ["full-bleed-picture", "text-beside-object", "split-around-object", "centred-stack", "object-alone", "text-low", "cell-grid", "list-or-index", "sequence", "collage", "narrow-column", "product-surface", "giant-word"];
const FIELDS = ["flavour", "fonts", "heroShape", "heroObject", "references"];
const norm = (v) => String(v).trim().toLowerCase().replace(/\s+/g, " ");
const list = (v) => (Array.isArray(v) ? v : v ? [v] : []).map(norm);
const family = (v) => norm(v ?? "").split("/")[0];
const stop = (message) => { console.error(message); process.exit(2); };
const read = (path) => {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch (e) { return stop(`Cannot read ${path}: ${e.message}`); }
};

const [command, logPath, ...rest] = process.argv.slice(2);
if (!["pick", "check", "add"].includes(command) || !logPath || !rest.length) stop("Use: look-log.mjs pick <log> <flavour/version>... | check <log> <look> | add <log> <look>");
const log = existsSync(logPath) ? read(logPath) : [];
if (!Array.isArray(log)) stop(`${logPath} must hold a list.`);
const recent = log.slice(-REMEMBER);

if (command === "pick") {
  const last = family(recent.at(-1)?.flavour);
  const used = new Set(recent.map((l) => norm(l.flavour ?? "")));
  const options = [...new Set(rest.map(norm))].filter((o) => family(o) !== last && !used.has(o));
  if (!options.length) stop("Every option repeats a recent page. Offer other flavours or versions.");
  // Choose the flavour first, so listing more versions of one does not favour it.
  const families = [...new Set(options.map(family))];
  const chosen = families[randomInt(families.length)];
  const versions = options.filter((o) => family(o) === chosen);
  console.log(versions[randomInt(versions.length)]);
} else {
  const look = read(rest[0]);
  const fixed = list(look.fixed);
  const missing = ["page", "flavour", "fonts", "colours", "heroShape", "heroObject"].filter((f) => !list(look[f]).length);
  if (missing.length) stop(`Missing in the look: ${missing.join(", ")}`);
  if (!SHAPES.includes(norm(look.heroShape))) stop(`heroShape must be one of: ${SHAPES.join(", ")}`);
  if (command === "add") {
    writeFileSync(logPath, JSON.stringify([...log.filter((l) => l.page !== look.page), look], null, 2) + "\n");
    console.log(`Saved ${look.page}.`);
  } else {
    const repeats = [];
    for (const old of recent) {
      if (old.page === look.page) continue;
      for (const field of FIELDS) {
        if (fixed.includes(norm(field))) continue;
        const before = list(old[field]);
        for (const value of list(look[field])) if (before.includes(value)) repeats.push(`${field}: "${value}" was used on ${old.page}`);
      }
    }
    const previous = recent.filter((l) => l.page !== look.page).at(-1);
    if (previous && !fixed.includes("flavour") && family(previous.flavour) === family(look.flavour)) repeats.push(`flavour: ${family(look.flavour)} was the last page's flavour`);
    console.log(repeats.length ? [...new Set(repeats)].map((r) => `REPEAT  ${r}`).join("\n") : "No repeats.");
    process.exit(repeats.length ? 1 : 0);
  }
}

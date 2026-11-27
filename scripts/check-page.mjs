#!/usr/bin/env node
// Design Details page checker: what a script can see on a rendered page.
// Usage: node scripts/check-page.mjs <page.html | URL> [--kind type|image|product|object|structure|quiet] [--headline "supplied headline"] [--squint folder]
// --squint saves each desktop and phone screen blurred and grey, to judge what stands out.
// --headline fails when the page's h1 differs; --kind warns on poster type where the kind is not type-led.
// Mark a sample product screen's outer element data-sample: its words are counted apart.
// Needs Playwright (`npm i -D playwright && npx playwright install chromium`).
// Optional: PLAYWRIGHT_MODULE=<path to playwright/index.mjs>, CHROME_PATH=<chromium executable>.
// It does not judge design. Fails must be fixed; warns fixed or explained.

import path from "node:path";
import { pathToFileURL } from "node:url";

const KINDS = ["type", "image", "product", "object", "structure", "quiet"];
const args = process.argv.slice(2);
const opts = {};
let target;
let bad = false;
for (let i = 0; i < args.length; i++) {
  if (["--kind", "--headline", "--squint"].includes(args[i])) {
    const v = args[i + 1];
    if (!v || v.startsWith("--")) bad = true;
    opts[args[i++].slice(2)] = v;
  } else if (args[i].startsWith("--") || target) bad = true;
  else target = args[i];
}
if (opts.kind && !KINDS.includes(opts.kind)) bad = true;
if (!target || bad) {
  console.error("Usage: node scripts/check-page.mjs <page.html | URL> [--kind " + KINDS.join("|") + "] [--headline \"supplied headline\"] [--squint folder]");
  process.exit(2);
}
const url = /^https?:\/\//.test(target) ? target : pathToFileURL(path.resolve(target)).href;
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

// Runs inside the page. Returns [{ level, rule, detail }].
function audit(opts) {
  const out = [];
  const add = (level, rule, detail) => out.push({ level, rule, detail });
  const visible = el => {
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05;
  };
  const text = el => (el.innerText || "").replace(/\s+/g, " ").trim();
  const words = t => (t ? t.split(" ").length : 0);
  const short = t => (t.length > 60 ? t.slice(0, 57) + "…" : t);
  const px = v => parseFloat(v) || 0;
  const firstFamily = f => f.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
  const textEls = [...document.body.querySelectorAll("*")].filter(el =>
    [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && visible(el));

  // Overflow.
  if (document.documentElement.scrollWidth > innerWidth + 1) add("fail", "horizontal scroll", `page is ${document.documentElement.scrollWidth}px wide in a ${innerWidth}px window`);

  // Font families.
  const families = new Set(textEls.filter(el => !/mono|code|courier/i.test(firstFamily(getComputedStyle(el).fontFamily))).map(el => firstFamily(getComputedStyle(el).fontFamily)));
  if (families.size > 2) add("fail", "more than two typefaces", [...families].join(", "));

  // Sizes on the first screen.
  const firstScreen = textEls.filter(el => el.getBoundingClientRect().top < innerHeight);
  const sizes = new Set(firstScreen.map(el => Math.round(px(getComputedStyle(el).fontSize))));
  if (sizes.size > 5) add("warn", "more than five type sizes on the first screen", [...sizes].sort((a, b) => a - b).join(", ") + " px");

  // Type weight and size count: words by size and weight, sample screens and menus included.
  const bySize = new Map();
  let strong = 0, allWords = 0;
  for (const el of textEls) {
    const n = [...el.childNodes].filter(c => c.nodeType === 3).map(c => c.textContent).join(" ").trim().split(/\s+/).length;
    const s = getComputedStyle(el), k = Math.round(px(s.fontSize));
    bySize.set(k, (bySize.get(k) || 0) + n);
    allWords += n;
    if (Number(s.fontWeight) >= 600) strong += n;
  }
  if (bySize.size > 9) add("warn", "too many type sizes", `${bySize.size} on the page: ${[...bySize.keys()].sort((a, b) => a - b).join(", ")} px`);
  if (strong > 0.45 * allWords) add("warn", "most words are bold", `${Math.round((100 * strong) / allWords)}% at weight 600 or more; strong marks only the first thing to read`);

  // Page copy: visible words outside nav, header and footer; and the fullest screen.
  const ownWords = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(" ").trim().split(/\s+/).filter(w => /\w/.test(w)).length;
  const copyEls = textEls.filter(el => !el.closest("nav, footer, [aria-hidden='true']") && !(el.closest("header") && !el.closest("header").querySelector("h1")));
  const pageWords = copyEls.reduce((n, el) => n + ownWords(el), 0);
  if (pageWords > 600) add("fail", "too much copy", `${pageWords} visible words (aim for about 450; shorten sentences, keep records)`);
  else if (pageWords > 450) add("warn", "copy over 450 words", `${pageWords} visible words; shorten sentences, keep records`);
  // Words per screen; first screen counts words inside pictures too (aria-hidden), sample screens apart.
  const inMenu = el => el.closest("nav, footer") || (el.closest("header") && !el.closest("header").querySelector("h1"));
  const tally = new Map();
  for (const el of textEls) {
    const band = Math.floor((el.getBoundingClientRect().top + scrollY) / innerHeight);
    if (inMenu(el) || (band > 0 && el.closest("[aria-hidden='true']"))) continue;
    const t = tally.get(band) || { page: 0, sample: 0 };
    t[band > 0 && el.closest("[data-sample]") ? "sample" : "page"] += ownWords(el);
    tally.set(band, t);
  }
  for (const [band, t] of [...tally].sort((a, b) => a[0] - b[0])) {
    const where = band === 0 ? "the first screen" : `screen ${band + 1}`;
    if (band === 0 && t.page > 80) add("fail", "crowded first screen", `${t.page} words, menu not counted (at most 60)`);
    else if (band === 0 && t.page > 60) add("warn", "crowded first screen", `${t.page} words, menu not counted (at most 60)`);
    else if (band > 0 && t.page > 80) add("warn", "busy screen", `${t.page} words on ${where} (aim for about 60)`);
    if (band > 0 && t.sample > 90) add("warn", "busy sample screen", `${t.sample} words in the sample on ${where} (aim for 90)`);
  }

  // Space between sections, strong colour bands, heading edges.
  const box = el => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, width: r.width }; };
  const blocks = [...document.querySelectorAll("main section, body > section")].filter(el => visible(el) && !el.parentElement.closest("section") && box(el).width > 0.9 * innerWidth && box(el).bottom - box(el).top > 200);
  const ctx0 = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
  const solid = el => {
    for (let a = el; a; a = a.parentElement) {
      ctx0.clearRect(0, 0, 1, 1); ctx0.fillStyle = getComputedStyle(a).backgroundColor; ctx0.fillRect(0, 0, 1, 1);
      const d = ctx0.getImageData(0, 0, 1, 1).data;
      if (d[3] > 230) return [d[0], d[1], d[2]];
    }
    return [255, 255, 255];
  };
  if (innerWidth >= 1000 && blocks.length > 2) {
    const gaps = [];
    blocks.forEach((b, i) => {
      const next = blocks[i + 1];
      if (!next) return;
      const parts = el => [...el.querySelectorAll("*")].filter(e => visible(e) && (textEls.includes(e) || /^(IMG|VIDEO|CANVAS|svg|BUTTON|INPUT)$/.test(e.tagName) || (e !== el && box(e).width < 0.95 * innerWidth && (getComputedStyle(e).backgroundColor !== "rgba(0, 0, 0, 0)" || px(getComputedStyle(e).borderBottomWidth) > 0)))).map(box);
      const a = parts(b), c = parts(next);
      if (!a.length || !c.length) return;
      const end = a.reduce((m, q) => (q.bottom > m.bottom ? q : m)), start = c.reduce((m, q) => (q.top < m.top ? q : m));
      // Something full-bleed at the join is on purpose.
      if (end.width > 0.95 * innerWidth || start.width > 0.95 * innerWidth) return;
      const changed = String(solid(b)) !== String(solid(next));
      if (changed) gaps.push(Math.round(box(b).bottom - end.bottom), Math.round(start.top - box(next).top));
      else gaps.push(Math.round((start.top - end.bottom)));
    });
    const tight = gaps.filter(g => g < 88);
    if (tight.length) add("warn", "tight space between sections", `${tight.join(", ")} px (120 to 176 on desktop); all: ${gaps.join(", ")}`);
    if (gaps.length > 2 && Math.max(...gaps) > 2.3 * Math.max(1, Math.min(...gaps))) add("warn", "uneven space between sections", `${gaps.join(", ")} px; hold one value`);
    // The main background is the colour under most of the page.
    const area = new Map();
    for (const b of blocks) { const k = String(solid(b)); area.set(k, (area.get(k) || 0) + box(b).bottom - box(b).top); }
    const main = [...area].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
    const bands = blocks.slice(1).filter(b => solid(b).reduce((n, v, i) => n + Math.abs(v - main[i]), 0) > 120);
    if (bands.length > 2) add("warn", "more than two strong bands after the first screen", `${bands.length} sections`);
    const edges = [];
    for (const h of document.querySelectorAll("h1, h2")) if (visible(h) && getComputedStyle(h).textAlign !== "center") { const x = box(h).left; if (!edges.some(e => Math.abs(e - x) < 12)) edges.push(x); }
    if (edges.length > 3) add("warn", "headings start on many left edges", edges.map(Math.round).sort((a, b) => a - b).join(", ") + " px");
  }

  // A card, table or panel as the opening.
  if (innerWidth >= 1000 && opts.kind !== "product") {
    const hold = [...document.querySelectorAll("main *, body > *")].filter(el => {
      if (!visible(el) || /^(SECTION|MAIN|HEADER|FORM|NAV|FOOTER|BODY)$/.test(el.tagName) || el.closest("nav, footer, form")) return false;
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      if (r.top > innerHeight * 0.85 || r.width < 0.35 * innerWidth || r.width > 0.97 * innerWidth || r.height < 120) return false;
      const boxed = (px(s.borderTopWidth) && px(s.borderLeftWidth)) || (s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== getComputedStyle(el.parentElement).backgroundColor) || s.boxShadow !== "none" || el.tagName === "TABLE";
      const rows = [...el.querySelectorAll("tr, li, [role=row]")].filter(visible).map(x => x.getBoundingClientRect().height).sort((a, b) => a - b);
      const h1s = px(getComputedStyle(document.querySelector("h1") || document.body).fontSize);
      const open = !px(s.borderLeftWidth) && s.boxShadow === "none" && (s.backgroundColor === "rgba(0, 0, 0, 0)" || s.backgroundColor === getComputedStyle(el.parentElement).backgroundColor);
      if (open && rows.length > 2 && rows.at(-1) >= 3 * rows[rows.length >> 1] && rows.at(-1) >= 0.22 * innerHeight && [...el.querySelectorAll("*")].some(x => visible(x) && px(getComputedStyle(x).fontSize) >= h1s)) return false;
      return boxed && !el.querySelector("h1") && words(text(el)) >= 10;
    });
    if (hold.length) add("fail", "the opening is a card, table or panel", `${Math.round(hold[0].getBoundingClientRect().width)}px wide, ${words(text(hold[0]))} words: "${short(text(hold[0]))}" (draw the record itself; samples start in section two; --kind product for a real product)`);
  }
  // A figure broken over two lines.
  for (const el of document.body.querySelectorAll("*")) {
    if (!visible(el) || el.closest("svg") || px(getComputedStyle(el).fontSize) < 24) continue;
    const t = (el.textContent || "").replace(/\s+/g, "");
    if (t.length < 4 || !/^[£$€+\u2212-]?\d[\d.,:]*%?$/.test(t) || /\.\d+\.|,\d+,\d{0,2}(?!\d)/.test(t)) continue;
    // Two whole figures in one wrapper (stacked or overprinted) are not one broken figure.
    if ([...el.children].some(c => /^\d[\d.,:]*\d$/.test(c.textContent.trim()) && c.textContent.trim().length >= 4)) continue;
    const range = document.createRange(); range.selectNodeContents(el);
    const tops = [...range.getClientRects()].filter(q => q.width > 2).map(q => q.top);
    if (tops.length && Math.max(...tops) - Math.min(...tops) > 0.7 * px(getComputedStyle(el).fontSize)) add("fail", "a figure is broken over two lines", `"${t}"`);
  }
  // Figures printed over one another.
  const figs = textEls.filter(el => !el.closest("svg") && px(getComputedStyle(el).fontSize) >= 24 && /\d/.test(text(el)) && /^[£$€+\u2212-]?[\d.,:]+%?$/.test(text(el).replace(/\s/g, ""))).map(el => [el, el.getBoundingClientRect()]);
  const over = [];
  figs.forEach(([a, p], i) => figs.slice(i + 1).forEach(([b, q]) => {
    if (a.contains(b) || b.contains(a)) return;
    const w = Math.min(p.right, q.right) - Math.max(p.left, q.left), h = Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top);
    if (w > 0 && h > 0 && w * h > 0.3 * Math.min(p.width * p.height, q.width * q.height)) over.push(`"${text(a)}" and "${text(b)}"`);
  }));
  if (over.length) add("fail", "figures printed over one another", `${over.length}, e.g. ${over[0]}`);
  // The same split again and again: heading left, text right. Small explanations beside big type.
  const splits = [], faint = [];
  for (const h of document.querySelectorAll("h2")) {
    if (!visible(h) || innerWidth < 1000) continue;
    const sec = h.closest("section");
    if (!sec) continue;
    const r = h.getBoundingClientRect();
    const near = [...sec.querySelectorAll("p, dl, ul, ol, table")].filter(visible).map(e => [e, e.getBoundingClientRect()]);
    if (r.left < 0.35 * innerWidth && near.some(([, q]) => q.left > 0.45 * innerWidth && q.left > r.right - 20 && q.top < r.bottom + 60 && q.bottom > r.top)) splits.push(short(text(h)));
    const big = px(getComputedStyle(h).fontSize);
    const p = [...sec.querySelectorAll("p, dd")].find(e => visible(e) && words(text(e)) >= 6 && !e.closest("[data-sample]"));
    if (big >= 48 && p && px(getComputedStyle(p).fontSize) < 19.5) faint.push(`"${short(text(p))}" ${Math.round(px(getComputedStyle(p).fontSize))}px beside ${Math.round(big)}px`);
  }
  if (splits.length > 1) add("warn", "heading left, text right, more than once", splits.join("; "));
  if (faint.length) add("warn", "small explanation beside big type", `${faint.length}, e.g. ${faint[0]} (20px or more)`);

  // Hero headline length.
  const h1 = [...document.querySelectorAll("h1")].find(visible);
  if (!h1) add("warn", "no visible h1", "");
  else {
    const n = words(text(h1));
    const plain = t => t.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, " ").trim().replace(/\.$/, "");
    const size = px(getComputedStyle(h1).fontSize);
    if (opts.kind && opts.kind !== "type" && innerWidth >= 1000 && size > 0.08 * innerWidth) add("warn", "poster headline on a page that is not type-led", `${Math.round(size)}px (under about ${Math.round(0.08 * innerWidth)}px for ${opts.kind}-led)`);
    if (opts.headline) {
      if (plain(text(h1)) !== plain(opts.headline)) add("fail", "supplied headline changed", `"${short(text(h1))}" instead of "${short(opts.headline)}"`);
    } else if (n > 10) add("fail", "hero headline too long", `${n} words: "${short(text(h1))}"`);
    else if (n > 6) add("warn", "hero headline over six words", `${n} words (fine for image-, product-, structure-led or quiet directions): "${short(text(h1))}"`);
  }

  // Labels above headings and accent words inside headings.
  for (const h of document.querySelectorAll("h1, h2, h3")) {
    if (!visible(h)) continue;
    const hs = getComputedStyle(h);
    let prev = h.previousElementSibling;
    if (!prev && h.parentElement) prev = h.parentElement.previousElementSibling;
    if (prev && visible(prev)) {
      const t = text(prev);
      const ps = getComputedStyle(prev);
      const caps = ps.textTransform === "uppercase" || (t.length > 2 && t === t.toUpperCase() && /[A-Z]/.test(t));
      const spaced = px(ps.letterSpacing) > 0.04 * px(ps.fontSize);
      if (t && words(t) <= 6 && px(ps.fontSize) < 0.7 * px(hs.fontSize) && (caps || spaced)) add("fail", "label above a heading", `"${short(t)}" above "${short(text(h))}"`);
    }
    for (const child of h.querySelectorAll("*")) {
      if (!visible(child) || !text(child) || text(child) === text(h)) continue;
      const cs = getComputedStyle(child);
      if (cs.fontStyle !== hs.fontStyle) add("fail", "italic accent word in a heading", `"${short(text(child))}" in "${short(text(h))}"`);
      else if (cs.color !== hs.color) add("fail", "coloured accent word in a heading", `"${short(text(child))}" in "${short(text(h))}"`);
    }
  }

  // Contrast against the nearest solid background.
  // Any CSS colour (rgb, oklch, lab, color-mix…) to [r, g, b, alpha 0–1] in sRGB, via a 1px canvas.
  const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
  const seen = new Map();
  const rgba = v => {
    if (!seen.has(v)) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000"; ctx.fillStyle = v; ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      seen.set(v, [r, g, b, a / 255]);
    }
    return seen.get(v);
  };
  const lum = ([r, g, b]) => {
    const c = [r, g, b].map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const overMedia = [];
  const isLarge = s => px(s.fontSize) >= 24 || (px(s.fontSize) >= 18.66 && Number(s.fontWeight) >= 700);
  // Where the words themselves are, in page coordinates, and their colour: measured against the pixels behind them.
  const spot = el => {
    const s = getComputedStyle(el);
    const rects = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const q of range.getClientRects()) if (q.width > 2 && q.height > 2) rects.push([q.left + scrollX, q.top + scrollY, q.width, q.height]);
    }
    overMedia.push({ text: short(text(el)), fg: rgba(s.webkitTextFillColor || s.color), need: isLarge(s) ? 3 : 4.5, rects });
  };
  const low = [];
  // Pictures, films and painted layers anywhere on the page, in page coordinates.
  const media = [...document.querySelectorAll("img, video, canvas, picture, svg, *")]
    .filter(el => visible(el) && (/^(IMG|VIDEO|CANVAS|PICTURE)$/.test(el.tagName) || getComputedStyle(el).backgroundImage !== "none"))
    .map(el => { const r = el.getBoundingClientRect(); return { el, x1: r.left + scrollX, y1: r.top + scrollY, x2: r.right + scrollX, y2: r.bottom + scrollY }; });
  for (const el of textEls) {
    // Decorative text hidden from assistive technology is not read; skip it.
    if (el.closest('[aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    const cx = r.left + scrollX + r.width / 2, cy = r.top + scrollY + r.height / 2;
    if (media.some(m => m.el !== el && !el.contains(m.el) && cx >= m.x1 && cx <= m.x2 && cy >= m.y1 && cy <= m.y2)) { spot(el); continue; }
    const s = getComputedStyle(el);
    const fg = rgba(s.color);
    if (fg.length > 3 && fg[3] < 0.5) continue;
    let bg = null;
    for (let a = el; a; a = a.parentElement) {
      const as = getComputedStyle(a);
      if (as.backgroundImage !== "none") break;
      const c = rgba(as.backgroundColor);
      if (c.length === 3 || (c.length > 3 && c[3] > 0.9)) { bg = c; break; }
    }
    if (!bg && getComputedStyle(document.documentElement).backgroundImage === "none") bg = [255, 255, 255];
    if (!bg) { spot(el); continue; }
    const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
    const ratio = (l1 + 0.05) / (l2 + 0.05);
    if (ratio < (isLarge(s) ? 3 : 4.5)) low.push(`${ratio.toFixed(1)}:1 "${short(text(el))}"`);
  }
  if (low.length) add("fail", "low contrast text", `${low.length} elements, e.g. ${low.slice(0, 4).join("; ")}`);

  // Body text below the floor: paragraphs and list items a visitor must read.
  const body = [...document.querySelectorAll("p, li, dd")].filter(el => visible(el) && !el.closest("footer") && words(text(el)) >= 6);
  const smallBody = body.filter(el => px(getComputedStyle(el).fontSize) < 16.5);
  if (smallBody.length) add("warn", "body text under 17px", `${smallBody.length} of ${body.length} paragraphs, e.g. "${short(text(smallBody[0]))}" at ${Math.round(px(getComputedStyle(smallBody[0]).fontSize))}px`);
  const thin = textEls.filter(el => /^H[1-3]$/.test(el.tagName) && Number(getComputedStyle(el).fontWeight) < 400);
  if (thin.length) add("warn", "light or thin heading weight", `${thin.length} headings, e.g. "${short(text(thin[0]))}"`);

  // Tiny text.
  const tiny = textEls.filter(el => px(getComputedStyle(el).fontSize) < 12);
  if (tiny.length) add("warn", "text under 12px", `${tiny.length} elements, e.g. "${short(text(tiny[0]))}"`);

  // Two filled buttons side by side.
  const filled = el => { const c = rgba(getComputedStyle(el).backgroundColor); return c.length === 3 || (c.length > 3 && c[3] > 0.5); };
  const buttons = [...document.querySelectorAll("a, button")].filter(el => visible(el) && filled(el) && text(el));
  const pairs = buttons.filter((b, i) => buttons.some((o, j) => j !== i && o.parentElement === b.parentElement));
  if (pairs.length) add("warn", "two filled buttons side by side", pairs.slice(0, 2).map(b => `"${short(text(b))}"`).join(" and "));

  // Notices that apologise for the page.
  const sorry = textEls.map(text).filter(t => /\b(fictional|not connected|nothing is sent|sends nothing|no account (is|or payment)|preview only|demo only|is unavailable|not a real|example only)\b/i.test(t));
  if (sorry.length) add("fail", "a notice apologises for the page", `"${short(sorry[0])}" (one word, Sample, is enough)`);
  // Images without alt.
  const noAlt = [...document.querySelectorAll("img")].filter(img => !img.hasAttribute("alt"));
  if (noAlt.length) add("fail", "images without alt", `${noAlt.length}`);
  return { out, overMedia };
}

// Runs inside a blank page: a screenshot taken with the words hidden, and where they sit.
async function measureOverMedia({ png, items }) {
  const img = new Image();
  img.src = png;
  await img.decode();
  const c = Object.assign(document.createElement("canvas"), { width: img.width, height: img.height });
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const lum = (r, g, b) => {
    const f = [r, g, b].map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
  };
  const out = { low: [], mixed: [], unmeasured: 0 };
  for (const it of items) {
    const ratios = [];
    const [fr, fg, fb, fa] = it.fg;
    for (const [x, y, w, h] of it.rects) {
      if (x < 0 || y < 0 || x + w > img.width || y + h > img.height) continue;
      const d = ctx.getImageData(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))).data;
      for (let i = 0; i < d.length; i += 16) {
        const mix = (f, b) => f * fa + b * (1 - fa);
        const a = lum(mix(fr, d[i]), mix(fg, d[i + 1]), mix(fb, d[i + 2])), b = lum(d[i], d[i + 1], d[i + 2]);
        ratios.push((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05));
      }
    }
    if (!ratios.length || fa < 0.2) { out.unmeasured++; continue; }
    ratios.sort((a, b) => a - b);
    const mid = ratios[Math.floor(ratios.length / 2)], worst = ratios[Math.floor(ratios.length / 10)];
    const line = `${mid.toFixed(1)}:1 "${it.text}"`;
    if (mid < it.need) out.low.push(line);
    else if (worst < it.need) out.mixed.push(line.replace(/^\S+/, worst.toFixed(1) + ":1 in places"));
  }
  return out;
}

let fails = 0;
let warns = 0;
for (const [name, width, height] of [["desktop", 1440, 900], ["phone", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  // Script errors: a crash stops tabs, menus and motion while the screenshot still looks fine.
  const crashes = [];
  const consoleErrors = [];
  page.on("pageerror", e => crashes.push(e.message));
  page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const { out: findings, overMedia } = await page.evaluate(audit, opts);
  if (opts.squint) {
    const fs = await import("node:fs");
    fs.mkdirSync(opts.squint, { recursive: true });
    const sq = await browser.newPage({ viewport: { width, height } });
    await sq.goto(url, { waitUntil: "networkidle" });
    const total = await sq.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += height) { await sq.evaluate(v => scrollTo(0, v), y); await sq.waitForTimeout(250); }
    const png = (await sq.screenshot({ fullPage: true, animations: "disabled" })).toString("base64");
    await sq.setContent(`<style>body{margin:0}img{display:block;width:100%;filter:grayscale(1) blur(${name === "phone" ? 5 : 11}px)}</style><img src="data:image/png;base64,${png}">`);
    await sq.waitForFunction(() => document.images[0].complete);
    await sq.screenshot({ path: path.join(opts.squint, `squint-${name}.png`), fullPage: true });
    await sq.close();
  }
  if (overMedia.length) {
    let m;
    const blank = await browser.newPage();
    try {
      await page.addStyleTag({ content: "*, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; -webkit-text-stroke-color: transparent !important; text-shadow: none !important; text-decoration-color: transparent !important; transition: none !important; }" });
      const png = "data:image/png;base64," + (await page.screenshot({ fullPage: true, animations: "disabled" })).toString("base64");
      m = await blank.evaluate(measureOverMedia, { png, items: overMedia });
    } catch { m = { low: [], mixed: [], unmeasured: overMedia.length }; }
    await blank.close();
    if (m.low.length) findings.push({ level: "fail", rule: "low contrast over a picture", detail: `${m.low.length} elements, e.g. ${m.low.slice(0, 4).join("; ")}` });
    if (m.mixed.length) findings.push({ level: "warn", rule: "uneven background behind text", detail: `${m.mixed.length} elements, e.g. ${m.mixed.slice(0, 4).join("; ")}` });
    if (m.unmeasured) findings.push({ level: "warn", rule: "text over images not measured", detail: `${m.unmeasured} elements; check them by eye` });
  }
  if (crashes.length) findings.push({ level: "fail", rule: "script error", detail: `${crashes.length}, e.g. ${crashes[0].slice(0, 120)}` });
  if (consoleErrors.length) findings.push({ level: "warn", rule: "console errors", detail: `${consoleErrors.length}, e.g. ${consoleErrors[0].slice(0, 120)}` });
  console.log(`\n${name} ${width}×${height}`);
  for (const f of findings) {
    console.log(`  ${f.level.toUpperCase()}  ${f.rule}${f.detail ? `: ${f.detail}` : ""}`);
    if (f.level === "fail") fails++; else warns++;
  }
  if (!findings.length) console.log("  clean");
  await page.close();
}
await browser.close();
console.log(`\n${fails} fail, ${warns} warn`);
process.exit(fails ? 1 : 0);

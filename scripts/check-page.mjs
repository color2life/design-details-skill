#!/usr/bin/env node
// Design Details page checker: what a script can see on a rendered page.
// Usage: node scripts/check-page.mjs <page.html | URL>
// Needs Playwright (`npm i -D playwright && npx playwright install chromium`).
// Optional: PLAYWRIGHT_MODULE=<path to playwright/index.mjs>, CHROME_PATH=<chromium executable>.
// It does not judge design. Fails must be fixed; warns fixed or explained.

import path from "node:path";
import { pathToFileURL } from "node:url";

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scripts/check-page.mjs <page.html | URL>");
  process.exit(2);
}
const url = /^https?:\/\//.test(target) ? target : pathToFileURL(path.resolve(target)).href;
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

// Runs inside the page. Returns [{ level, rule, detail }].
function audit() {
  const out = [];
  const add = (level, rule, detail) => out.push({ level, rule, detail });
  const visible = el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05;
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
  const families = new Set(textEls.map(el => firstFamily(getComputedStyle(el).fontFamily)));
  if (families.size > 2) add("fail", "more than two typefaces", [...families].join(", "));

  // Sizes on the first screen.
  const firstScreen = textEls.filter(el => el.getBoundingClientRect().top < innerHeight);
  const sizes = new Set(firstScreen.map(el => Math.round(px(getComputedStyle(el).fontSize))));
  if (sizes.size > 3) add("warn", "more than three type sizes on the first screen", [...sizes].sort((a, b) => a - b).join(", ") + " px");

  // Hero headline length.
  const h1 = [...document.querySelectorAll("h1")].find(visible);
  if (!h1) add("warn", "no visible h1", "");
  else {
    const n = words(text(h1));
    if (n > 10) add("fail", "hero headline too long", `${n} words: "${short(text(h1))}"`);
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
  let unknown = 0;
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
    if (media.some(m => m.el !== el && !el.contains(m.el) && cx >= m.x1 && cx <= m.x2 && cy >= m.y1 && cy <= m.y2)) { unknown++; continue; }
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
    if (!bg) { unknown++; continue; }
    const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
    const ratio = (l1 + 0.05) / (l2 + 0.05);
    const large = px(s.fontSize) >= 24 || (px(s.fontSize) >= 18.66 && Number(s.fontWeight) >= 700);
    if (ratio < (large ? 3 : 4.5)) low.push(`${ratio.toFixed(1)}:1 "${short(text(el))}"`);
  }
  if (low.length) add("fail", "low contrast text", `${low.length} elements, e.g. ${low.slice(0, 4).join("; ")}`);
  if (unknown) add("warn", "text over images not measured", `${unknown} elements sit on a picture or gradient; check them by eye`);

  // Body text below the floor: paragraphs and list items a visitor must read.
  const body = [...document.querySelectorAll("p, li, dd")].filter(el => visible(el) && words(text(el)) >= 6);
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

  // Images without alt.
  const noAlt = [...document.querySelectorAll("img")].filter(img => !img.hasAttribute("alt"));
  if (noAlt.length) add("fail", "images without alt", `${noAlt.length}`);
  return out;
}

let fails = 0;
let warns = 0;
for (const [name, width, height] of [["desktop", 1440, 900], ["phone", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const findings = await page.evaluate(audit);
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

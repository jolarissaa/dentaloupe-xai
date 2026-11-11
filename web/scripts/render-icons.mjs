/**
 * Renders the PWA / favicon PNGs from the Dentaloupe mark in components/brand/logoPaths.js.
 *
 *   node scripts/render-icons.mjs
 *
 * Uses Playwright's headless Chromium (already a dev dependency) as the SVG rasteriser.
 * "any" icons are the navy glasses on a white rounded tile; maskable and Apple icons are
 * full-bleed white with the mark kept inside the maskable safe zone.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = readFileSync(path.join(root, "components/brand/logoPaths.js"), "utf8");
const pick = (name) => new RegExp(`export const ${name} =\\s*"([^"]+)"`).exec(src)[1];
const NAVY = pick("BRAND_NAVY");
const GREY = pick("BRAND_GREY");
const BODY = pick("MARK_NAVY");
const GLINT = pick("MARK_GLINT");
const [vx, vy, vw, vh] = pick("MARK_VIEWBOX").split(" ").map(Number);

/** @param {{bleed:boolean, scale:number}} o  scale = mark width as a share of the icon */
function svg({ bleed, scale }) {
  const S = 512;
  const w = S * scale;
  const k = w / vw;
  const tx = (S - w) / 2 - vx * k;
  const ty = (S - vh * k) / 2 - vy * k;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="100%" height="100%">
    <rect width="${S}" height="${S}" rx="${bleed ? 0 : 116}" fill="#fff"/>
    <g transform="translate(${tx} ${ty}) scale(${k})">
      <path d="${BODY}" fill="${NAVY}" fill-rule="evenodd"/>
      <path d="${GLINT}" fill="${GREY}" fill-rule="evenodd"/>
    </g>
  </svg>`;
}

const OUT = [
  ["public/icons/icon-192.png", 192, { bleed: false, scale: 0.78 }],
  ["public/icons/icon-512.png", 512, { bleed: false, scale: 0.78 }],
  ["public/icons/maskable-192.png", 192, { bleed: true, scale: 0.62 }],
  ["public/icons/maskable-512.png", 512, { bleed: true, scale: 0.62 }],
  ["public/icons/apple-touch-icon.png", 180, { bleed: true, scale: 0.7 }],
  ["public/favicon-32.png", 32, { bleed: false, scale: 0.9 }],
];

// PW_CHANNEL=msedge (or chrome) uses an installed browser instead of Playwright's own download.
const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
const page = await browser.newPage();
for (const [file, size, opts] of OUT) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg(opts)}</body></html>`
  );
  const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  writeFileSync(path.join(root, file), png);
  console.log("wrote", file);
}
await browser.close();

// Generates deterministic, locally-hosted SVG thumbnails for every product.
// Re-run with `node scripts/generate-product-thumbnails.mjs` whenever the catalog changes.
// Images are derived only from product id/name/category, so output is stable across runs
// (no network calls, no random data) — safe for predictable Playwright assertions.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../data/products.js";
import { categories } from "../data/categories.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "public", "products");

const CATEGORY_PALETTES = {
  "cat-electronics": { base: "#0f172a", accent: "#38bdf8" },
  "cat-home": { base: "#92400e", accent: "#fbbf24" },
  "cat-books": { base: "#4c1d95", accent: "#a78bfa" },
  "cat-fitness": { base: "#064e3b", accent: "#34d399" },
  "cat-grocery": { base: "#3f6212", accent: "#a3e635" },
};

const SHAPE_COUNT = 4;

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getInitials(name) {
  const words = name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const letters = words.slice(0, 2).map((word) => word[0].toUpperCase());
  return letters.join("") || "??";
}

function buildAccentShape(shapeIndex, accent) {
  switch (shapeIndex) {
    case 0:
      return `<circle cx="220" cy="40" r="70" fill="${accent}" fill-opacity="0.35" />`;
    case 1:
      return `<rect x="170" y="-20" width="120" height="120" rx="24" fill="${accent}" fill-opacity="0.35" transform="rotate(20 230 40)" />`;
    case 2:
      return `<polygon points="300,0 300,140 180,0" fill="${accent}" fill-opacity="0.35" />`;
    default:
      return `<ellipse cx="240" cy="160" rx="100" ry="60" fill="${accent}" fill-opacity="0.3" />`;
  }
}

function buildThumbnailSvg(product, category) {
  const palette = CATEGORY_PALETTES[product.categoryId] ?? { base: "#27272a", accent: "#a1a1aa" };
  const hash = hashString(product.id);
  const shapeIndex = hash % SHAPE_COUNT;
  const initials = getInitials(product.name);

  return `<svg width="320" height="240" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.name}">
  <rect width="320" height="240" fill="${palette.base}" />
  ${buildAccentShape(shapeIndex, palette.accent)}
  <circle cx="160" cy="120" r="58" fill="#ffffff" fill-opacity="0.12" />
  <text x="160" y="134" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#ffffff">${initials}</text>
  <text x="160" y="222" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" fill-opacity="0.85">${category?.name ?? ""}</text>
</svg>
`;
}

mkdirSync(OUTPUT_DIR, { recursive: true });

for (const product of products) {
  const category = categories.find((entry) => entry.id === product.categoryId) ?? null;
  const svg = buildThumbnailSvg(product, category);
  const fileName = product.image.replace("/products/", "");
  writeFileSync(join(OUTPUT_DIR, fileName), svg, "utf8");
  console.log(`Generated ${fileName}`);
}

console.log(`Done. ${products.length} thumbnails written to ${OUTPUT_DIR}`);

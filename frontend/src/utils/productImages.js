import { getImageUrl } from "./imageUrl.js";

// ============================================================
// PRODUCT PLACEHOLDER IMAGES
// ------------------------------------------------------------
// These are only used when a product has no real uploaded image
// (product.image). They used to be loosely matched to a handful of
// Unsplash stock photos keyed by category, which is why unrelated
// products (e.g. "Dell Inspiron", "Women's Denim Jacket") could end
// up showing a completely unrelated photo whenever their category
// wasn't one of the ~10 covered, or wasn't specific enough to pick
// the right photo (a "Laptops" category photo doesn't necessarily
// look like a Dell Inspiron).
//
// Instead of guessing with stock photography, this resolves a small,
// hand-drawn icon based on keywords in the product's own name (falling
// back to its category), then renders that icon on a colored chip as
// an inline SVG data URI. This is guaranteed to be visually relevant
// (we drew it to match), and has zero external network dependency —
// it can never fail to load, unlike a hotlinked photo.
// ============================================================

const ICONS = {
  laptop: {
    color: "#4F46E5",
    glyph:
      "<path d='M4 7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9H4V7Z'/><path d='M2 18.5h20l-1.2 2.1a1 1 0 0 1-.87.4H4.07a1 1 0 0 1-.87-.4L2 18.5Z'/>",
  },
  smartphone: {
    color: "#0284C7",
    glyph:
      "<rect x='7' y='2' width='10' height='20' rx='2'/><path d='M11 18.5h2' stroke-linecap='round'/>",
  },
  tablet: {
    color: "#0284C7",
    glyph:
      "<rect x='4' y='2.5' width='16' height='19' rx='2'/><path d='M11 19h2' stroke-linecap='round'/>",
  },
  monitor: {
    color: "#4F46E5",
    glyph:
      "<rect x='3' y='4' width='18' height='12' rx='1.5'/><path d='M9 20h6M12 16v4' stroke-linecap='round'/>",
  },
  keyboard: {
    color: "#475569",
    glyph:
      "<rect x='2.5' y='6' width='19' height='12' rx='1.5'/><path d='M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12' stroke-linecap='round'/>",
  },
  mouse: {
    color: "#475569",
    glyph:
      "<rect x='7' y='3' width='10' height='18' rx='5'/><path d='M12 3v7' stroke-linecap='round'/>",
  },
  headphones: {
    color: "#7C3AED",
    glyph:
      "<path d='M4 13.5a8 8 0 0 1 16 0' stroke-linecap='round'/><rect x='2.5' y='13' width='4' height='7' rx='1.5'/><rect x='17.5' y='13' width='4' height='7' rx='1.5'/>",
  },
  speaker: {
    color: "#7C3AED",
    glyph:
      "<rect x='6' y='2' width='12' height='20' rx='2'/><circle cx='12' cy='8' r='2'/><circle cx='12' cy='15' r='3.5'/>",
  },
  printer: {
    color: "#C2410C",
    glyph:
      "<path d='M6 8V3h12v5' stroke-linecap='round' stroke-linejoin='round'/><rect x='3' y='8' width='18' height='8' rx='1.5'/><path d='M6 15h12v6H6z'/>",
  },
  camera: {
    color: "#E11D48",
    glyph:
      "<path d='M4 8h3l1.6-2.4A1 1 0 0 1 9.4 5h5.2a1 1 0 0 1 .84.6L17 8h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 8Z'/><circle cx='12' cy='13.5' r='3.5'/>",
  },
  watch: {
    color: "#D97706",
    glyph:
      "<path d='M8 4h8l-.7 3.5h-6.6L8 4ZM8 20h8l-.7-3.5h-6.6L8 20Z'/><circle cx='12' cy='12' r='4.5'/><path d='M12 10v2l1.2 1.2' stroke-linecap='round'/>",
  },
  cable: {
    color: "#475569",
    glyph:
      "<path d='M5 5c3 3-3 5 0 8s-3 5 0 8' stroke-linecap='round'/><circle cx='4.2' cy='4.2' r='1.6'/><circle cx='4.2' cy='19.8' r='1.6'/>",
  },
  powerbank: {
    color: "#D97706",
    glyph:
      "<rect x='6' y='3' width='12' height='18' rx='2.5'/><path d='M10 3V1.5h4V3' stroke-linecap='round'/><path d='M13 8.5 10 13h2.3L11.5 17 15 12h-2.3L13 8.5Z'/>",
  },
  chair: {
    color: "#0D9488",
    glyph:
      "<path d='M7 3h10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V3Z'/><path d='M7 13v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3' stroke-linecap='round'/><path d='M10 18v3M14 18v3' stroke-linecap='round'/>",
  },
  desk: {
    color: "#0D9488",
    glyph:
      "<path d='M2.5 8h19M4 8v12M20 8v12M2.5 14H9' stroke-linecap='round'/>",
  },
  lamp: {
    color: "#D97706",
    glyph:
      "<path d='M7 3h10l-2.5 7h-5L7 3Z'/><path d='M12 10v7M8 21h8l-1.5-2.5h-5L8 21Z' stroke-linecap='round' stroke-linejoin='round'/>",
  },
  backpack: {
    color: "#C2410C",
    glyph:
      "<path d='M8 8V6a4 4 0 0 1 8 0v2' stroke-linecap='round'/><rect x='5' y='8' width='14' height='13' rx='3'/><path d='M9 12h6M9 16h6' stroke-linecap='round'/>",
  },
  jacket: {
    color: "#E11D48",
    glyph:
      "<path d='M9 3 6 5 3 9l2.5 2 1.5-1.5V21h10V9.5L18.5 11 21 9l-3-4-3-2-1.2 1.4a2.4 2.4 0 0 1-3.6 0L9 3Z'/>",
  },
  shirt: {
    color: "#E11D48",
    glyph:
      "<path d='M8 3 3 7l2.5 3L7 9v12h10V9l1.5 1 2.5-3-5-4a3 3 0 0 1-6 0Z'/>",
  },
  jeans: {
    color: "#E11D48",
    glyph:
      "<path d='M7 2h10l1 8-1.3 12h-2.9l-.8-9-.8 9H9.2L8 10 7 2Z'/><path d='M9.5 2v6M14.5 2v6' stroke-linecap='round'/>",
  },
  shoes: {
    color: "#E11D48",
    glyph:
      "<path d='M2.5 17.5v-3l3-1 2.5-3.5h2v3.3l4.3 1.7h5.7a1.5 1.5 0 0 1 1.5 1.5v1h-19Z' stroke-linejoin='round'/><path d='M9 13.3 11 15M2.5 17.5h19' stroke-linecap='round'/>",
  },
  perfume: {
    color: "#7C3AED",
    glyph:
      "<path d='M10 2h4v3h-4z'/><path d='M9 5h6l1.5 3.5V21a1 1 0 0 1-1 1H8.5a1 1 0 0 1-1-1V8.5L9 5Z'/><path d='M9.5 12h5' stroke-linecap='round'/>",
  },
  box: {
    color: "#64748B",
    glyph:
      "<path d='m3.5 7 8.5-4 8.5 4-8.5 4-8.5-4Z'/><path d='M3.5 7v10l8.5 4 8.5-4V7M12 11v10' stroke-linecap='round' stroke-linejoin='round'/>",
  },
};

// Ordered keyword → icon rules, most specific first so e.g. "power bank"
// matches before a looser "bank"-type rule ever could. Checked against
// the product name first, then (if nothing matches) the category.
const KEYWORD_RULES = [
  { icon: "powerbank", words: ["power bank", "powerbank", "battery pack"] },
  { icon: "laptop", words: ["laptop", "notebook", "macbook", "inspiron", "thinkpad", "chromebook", "ultrabook"] },
  // Headphones/earbuds must be checked BEFORE the smartphone rule below —
  // "phone" is a substring of "headphones", so a naive ordered check would
  // (and, during testing, did) mismatch "Wireless Headphones" as a phone.
  { icon: "headphones", words: ["headphone", "earphone", "earbud", "airpod", "headset"] },
  { icon: "smartphone", words: ["smartphone", "iphone", "cell phone", "galaxy s", "galaxy a", "pixel phone"] },
  { icon: "tablet", words: ["tablet", "ipad"] },
  { icon: "monitor", words: ["monitor", "display screen"] },
  { icon: "keyboard", words: ["keyboard"] },
  { icon: "mouse", words: ["mouse", "mice"] },
  { icon: "speaker", words: ["speaker", "soundbar"] },
  { icon: "printer", words: ["printer", "scanner"] },
  { icon: "camera", words: ["camera", "webcam", "dslr"] },
  { icon: "watch", words: ["watch"] },
  { icon: "cable", words: ["cable", "cord", "charger", "adapter"] },
  { icon: "chair", words: ["chair", "stool"] },
  { icon: "desk", words: ["desk", "table"] },
  { icon: "lamp", words: ["lamp", "light fixture"] },
  { icon: "backpack", words: ["backpack", "rucksack", "bag"] },
  { icon: "jacket", words: ["jacket", "coat", "hoodie", "sweater"] },
  { icon: "jeans", words: ["jean", "denim", "trouser", "pant"] },
  { icon: "shirt", words: ["shirt", "t-shirt", "tee", "blouse"] },
  { icon: "shoes", words: ["shoe", "sneaker", "boot", "sandal"] },
  { icon: "perfume", words: ["perfume", "parfum", "fragrance", "cologne", "scent"] },
];

// Category → icon, used only when nothing in the product's own name
// matched a keyword above.
const CATEGORY_FALLBACK = {
  Electronics: "laptop",
  Accessories: "backpack",
  Furniture: "chair",
  "Office Supplies": "printer",
};

// A plain `name.includes(word)` substring test is exactly how this file
// previously mismatched "Wireless Headphones" as a smartphone — "phone"
// is a substring of "headphones" with no word boundary between them. This
// checks the keyword as a whole word/phrase (bounded by the start/end of
// the string or a non-letter character) so "phone" can match "my phone"
// or "Phone Case" but can never match inside "headphones", "microphone",
// "saxophone", etc. This is the general fix — reordering specific rules
// (done below too, as defense-in-depth) only patches individual cases.
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const nameHasWord = (name, phrase) => {
  // `s?` tolerates simple plurals ("headphone" must still match
  // "headphones", "earbud" must match "earbuds") without reopening the
  // original bug — a bare substring match would still be too greedy, but
  // an optional trailing "s" right before the boundary is safe because
  // the preceding characters still have to match the keyword exactly.
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(phrase)}s?([^a-z0-9]|$)`, "i");
  return pattern.test(name);
};

const resolveIconKey = (product) => {
  const name = String(product?.productName || "").toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.words.some((w) => nameHasWord(name, w))) return rule.icon;
  }
  const byCategory = CATEGORY_FALLBACK[product?.category];
  if (byCategory) return byCategory;
  return "box";
};

/**
 * Builds a clean, deterministic icon-on-a-chip SVG for a product —
 * guaranteed to render (no network request) and guaranteed to match
 * what the icon key says, since it's drawn rather than photographed.
 */
export const buildIconImage = (iconKey, size = 96) => {
  const icon = ICONS[iconKey] || ICONS.box;
  const r = Math.round(size * 0.22);
  const iconSize = Math.round(size * 0.52);
  const offset = (size - iconSize) / 2;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
    <rect width='${size}' height='${size}' rx='${r}' fill='${icon.color}' fill-opacity='0.12'/>
    <g transform='translate(${offset},${offset})'>
      <svg width='${iconSize}' height='${iconSize}' viewBox='0 0 24 24' fill='none' stroke='${icon.color}' stroke-width='1.6'>
        ${icon.glyph}
      </svg>
    </g>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
};

// A plain initials placeholder — used only as the very last resort (e.g.
// a product with no name at all). Kept separate from buildIconImage so
// callers that just want "an initial in a circle" still have that option.
export const buildPlaceholder = (label = "?", size = 96) => {
  const initial = String(label).trim().charAt(0).toUpperCase() || "?";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>
    <rect width='${size}' height='${size}' rx='${Math.round(size * 0.2)}' fill='#e2e8f0'/>
    <text x='50%' y='55%' font-family='Arial, sans-serif' font-size='${Math.round(size * 0.4)}' text-anchor='middle' fill='#94a3b8'>${initial}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
};

/**
 * Resolves the best available image for a product.
 * Priority: real uploaded backend image → keyword/category-matched icon.
 * The icon stage can't fail to load (it's inline SVG, no network call),
 * so callers no longer need a separate "did the demo image fail" step —
 * but buildPlaceholder() above still exists as an absolute last resort.
 */
export const getProductImage = (product, size = 96) => {
  if (!product) return null;
  const real = getImageUrl(product.image);
  if (real) return real;
  return buildIconImage(resolveIconKey(product), size);
};

export const isDemoProductImage = (product) => !product?.image;

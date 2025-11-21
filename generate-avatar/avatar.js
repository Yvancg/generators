// generate-avatar/avatar.js
// Minimal, dependency-free SVG avatar/placeholder generator.
// Patterns: 'initials' | 'blocks' | 'circles' | 'random'. Deterministic via seed.

export function generateAvatar(options = {}) {
  const {
    text = 'AA',            // initials or label (used for 'initials' pattern)
    pattern = 'initials',   // 'initials' | 'blocks' | 'circles' | 'random'
    size = 128,             // px (width = height)
    seed = null,            // string for deterministic output
    background = null       // override background color (#hex)
  } = options;

  if (!Number.isInteger(size) || size < 32 || size > 1024) {
    throw new Error('size must be an integer in [32, 1024]');
  }

  const R = seed ? seededRNG(String(seed)) : cryptoRNG();
  const patt = pattern === 'random'
    ? pick(PATTERNS, R)
    : pattern;

  // Base color: validate/normalize background once, no repeated parse
  let baseHSL;
  if (background) {
    const rgb = parseHex(background);      // validates
    baseHSL = RGBtoHSL(rgb);
  } else {
    baseHSL = randomNiceHSL(R);
  }
  const baseRGB = HSLtoRGB(baseHSL);
  const baseHex = rgbToHex(baseRGB);

  const fg   = idealTextRGB(baseRGB);
  const acc1 = shiftHSLColor(baseHSL,  30);
  const acc2 = shiftHSLColor(baseHSL, -30);

  let svg;
  if (patt === 'initials') {
    const label = String(text || 'AA').slice(0, 3).toUpperCase();
    const len = label.length;
    const fontSize = Math.round(size * (len === 1 ? 0.58 : len === 2 ? 0.46 : 0.36));

    svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escapeXML(label)}">
  <rect width="100%" height="100%" fill="${baseHex}"/>
  <text x="50%" y="50%" dy=".35em" fill="${fg}" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial" font-size="${fontSize}" text-anchor="middle">${escapeXML(label)}</text>
</svg>`;
  } else if (patt === 'blocks') {
    const n = 4; // 4x4 grid
    const cell = size / n;
    const w = Math.ceil(cell);
    const rects = [];

    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const xx = x < n / 2 ? x : n - 1 - x; // symmetry
        const on = ((R() + xx + y) % 3) !== 0; // about 2/3 filled
        if (!on) continue;
        const col = ((x + y) & 1) ? acc1 : acc2;
        rects.push(`<rect x="${x * cell}" y="${y * cell}" width="${w}" height="${w}" fill="${col}"/>`);
      }
    }

    svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="blocks avatar">
  <rect width="100%" height="100%" fill="${baseHex}"/>
  ${rects.join('')}
</svg>`;
  } else if (patt === 'circles') {
    const count = 6;
    const circles = [];

    const maxR = Math.max(6, Math.floor(size * 0.25));
    const inner = size - 16;

    for (let i = 0; i < count; i++) {
      const r  = 6 + (R() % (maxR - 5));
      const cx = 8 + (R() % inner);
      const cy = 8 + (R() % inner);
      const col = (i & 1) ? acc1 : acc2;
      const op  = 0.35 + ((R() % 50) * 0.01); // 0.35..0.84
      circles.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" fill-opacity="${op}"/>`);
    }

    svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="circles avatar">
  <rect width="100%" height="100%" fill="${baseHex}"/>
  ${circles.join('')}
</svg>`;
  } else {
    throw new Error("pattern must be 'initials' | 'blocks' | 'circles' | 'random'");
  }

  return svg.trim();
}

// ---- helpers ----

const PATTERNS = Object.freeze(['initials', 'blocks', 'circles']);

function escapeXML(s) {
  return String(s).replace(/[&<>"']/g, c => (
    c === '&' ? '&amp;'
  : c === '<' ? '&lt;'
  : c === '>' ? '&gt;'
  : c === '"' ? '&quot;'
  : '&apos;'
  ));
}

function pick(arr, R) {
  return arr[R() % arr.length];
}

// Base color helpers

function randomNiceHSL(R) {
  const h = R() % 360;
  const s = 55 + (R() % 35); // 55..89
  const l = 45 + (R() % 20); // 45..64
  return { h, s, l };
}

function idealTextRGB({ r, g, b }) {
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

function shiftHSLColor(base, deltaH) {
  let h = base.h + deltaH;
  h = ((h % 360) + 360) % 360;
  const s = clamp(base.s + (deltaH > 0 ? -5 : 5), 35, 95);
  const l = clamp(base.l + (deltaH > 0 ? 5 : -5), 25, 85);
  return rgbToHex(HSLtoRGB({ h, s, l }));
}

function clamp(x, a, b) {
  return x < a ? a : (x > b ? b : x);
}

function parseHex(s) {
  const str = String(s);
  const h = str[0] === '#' ? str.slice(1) : str;
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error('background must be #RRGGBB');
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  const c = (n) => n.toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

// HSL/RGB conversion

function HSLtoRGB({ h, s, l }) {
  const H = ((h % 360) + 360) % 360 / 360;
  const S = s / 100;
  const L = l / 100;

  if (S === 0) {
    const v = Math.round(L * 255);
    return { r: v, g: v, b: v };
  }

  const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
  const p = 2 * L - q;

  const r = hue2rgb(p, q, H + 1 / 3);
  const g = hue2rgb(p, q, H);
  const b = hue2rgb(p, q, H - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function RGBtoHSL({ r, g, b }) {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  const max = R > G ? (R > B ? R : B) : (G > B ? G : B);
  const min = R < G ? (R < B ? R : B) : (G < B ? G : B);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === R) {
      h = (G - B) / d + (G < B ? 6 : 0);
    } else if (max === G) {
      h = (B - R) / d + 2;
    } else {
      h = (R - G) / d + 4;
    }
    h *= 60;
  }

  return {
    h,
    s: +(s * 100).toFixed(1),
    l: +(l * 100).toFixed(1)
  };
}

// RNGs

function cryptoRNG() {
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    const buf = new Uint32Array(128);
    let idx = buf.length;

    return () => {
      if (idx >= buf.length) {
        globalThis.crypto.getRandomValues(buf);
        idx = 0;
      }
      return buf[idx++] >>> 0;
    };
  }
  // fallback (not crypto-safe)
  let x = 0x9e3779b9 ^ Date.now();
  return () => {
    x = (x + 0x6d2b79f5) | 0;
    x ^= x >>> 15;
    x = Math.imul(x, 1 | x);
    x ^= x >>> 7;
    return (x ^ (x >>> 14)) >>> 0;
  };
}

function seededRNG(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return (t ^ (t >>> 14)) >>> 0;
  };
}

// Example:
// console.log(generateAvatar({ text:'YV', pattern:'initials', size:128, seed:'demo' }));
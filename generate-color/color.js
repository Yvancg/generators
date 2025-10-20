// generate-color/color.js
// Minimal, dependency-free color palette generator (HEX / RGB / HSL).
// Supports schemes: complementary, triadic, tetradic, analogous, monochrome.
// Deterministic when `seed` is provided.

export function generatePalette(options = {}) {
  const {
    base = null,                 // base color as '#RRGGBB' or 'hsl(h,s%,l%)' or 'rgb(r,g,b)'
    scheme = 'triadic',          // 'complementary' | 'triadic' | 'tetradic' | 'analogous' | 'monochrome' | 'random'
    count = 5,                   // number of colors to return
    format = 'hex',              // 'hex' | 'rgb' | 'hsl'
    seed = null                  // string for deterministic output
  } = options;

  if (!Number.isInteger(count) || count < 1) throw new Error('count must be >= 1');
  if (!['hex','rgb','hsl'].includes(format)) throw new Error('format must be hex|rgb|hsl');

  const rnd = seed ? seededRNG(String(seed)) : cryptoRNG();
  const baseHsl = base ? toHSL(parseColor(base)) : randomHSL(rnd);

  const schemeName = scheme === 'random'
    ? pick(['complementary','triadic','tetradic','analogous','monochrome'], rnd)
    : scheme;

  let hsls = [];
  switch (schemeName) {
    case 'complementary':
      hsls = spreadAngles(baseHsl, [0, 180], count, rnd);
      break;
    case 'triadic':
      hsls = spreadAngles(baseHsl, [0, 120, 240], count, rnd);
      break;
    case 'tetradic':
      hsls = spreadAngles(baseHsl, [0, 90, 180, 270], count, rnd);
      break;
    case 'analogous':
      hsls = stepsAround(baseHsl, 30, count); // ±30° window
      break;
    case 'monochrome':
      hsls = monoSteps(baseHsl, count);
      break;
    default:
      throw new Error('unknown scheme');
  }

  const out = hsls.slice(0, count).map(hsl => {
    const rgb = HSLtoRGB(hsl);
    return format === 'hex' ? rgbToHex(rgb)
         : format === 'rgb' ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
         : `hsl(${round(hsl.h)}, ${round(hsl.s)}%, ${round(hsl.l)}%)`;
  });

  return {
    base: toFormat(baseHsl, format),
    scheme: schemeName,
    colors: out,
    textOnBase: idealTextColor(HSLtoRGB(baseHsl)) // '#000000' or '#ffffff'
  };
}

// ---------- helpers ----------

function toFormat(hsl, format) {
  const rgb = HSLtoRGB(hsl);
  if (format === 'hex') return rgbToHex(rgb);
  if (format === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  return `hsl(${round(hsl.h)}, ${round(hsl.s)}%, ${round(hsl.l)}%)`;
}

function spreadAngles(base, angles, count, rnd) {
  // Repeat angles until reaching count, jitter lightness slightly
  const arr = [];
  for (let i = 0; arr.length < count; i++) {
    const a = angles[i % angles.length];
    const h = normHue(base.h + a);
    const s = clamp(base.s + jitter(rnd, 6), 5, 95);
    const l = clamp(base.l + jitter(rnd, 8), 10, 90);
    arr.push({ h, s, l });
  }
  return arr;
}

function stepsAround(base, windowDeg, count) {
  const step = (windowDeg * 2) / Math.max(1, count - 1);
  const start = base.h - windowDeg;
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({ h: normHue(start + i * step), s: base.s, l: base.l });
  }
  return arr;
}

function monoSteps(base, count) {
  const arr = [];
  const step = 60 / Math.max(1, count - 1); // vary lightness by up to ~60%
  for (let i = 0; i < count; i++) {
    const l = clamp(base.l - 30 + i * step, 5, 95);
    const s = clamp(base.s + (i % 2 ? -10 : 10), 5, 95);
    arr.push({ h: base.h, s, l });
  }
  return arr;
}

function randomHSL(rnd) {
  return { h: rnd() % 360, s: 30 + (rnd() % 60), l: 30 + (rnd() % 40) };
}

function jitter(rnd, span) { return (rnd() % (span * 2 + 1)) - span; }
function normHue(h) { return ((h % 360) + 360) % 360; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function round(x) { return Math.round(x); }

function parseColor(s) {
  if (typeof s !== 'string') throw new Error('color must be string');
  const hex = s.trim().toLowerCase();
  if (/^#?[0-9a-f]{6}$/.test(hex)) {
    const h = hex[0] === '#' ? hex.slice(1) : hex;
    return {
      r: parseInt(h.slice(0,2),16),
      g: parseInt(h.slice(2,4),16),
      b: parseInt(h.slice(4,6),16)
    };
  }
  const mRgb = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.exec(hex);
  if (mRgb) return { r: +mRgb[1], g: +mRgb[2], b: +mRgb[3] };
  const mHsl = /^hsl\((\d{1,3}),\s*(\d{1,3})%\s*,\s*(\d{1,3})%\)$/.exec(hex);
  if (mHsl) return HSLtoRGB({ h: +mHsl[1], s: +mHsl[2], l: +mHsl[3] });
  throw new Error('unsupported color format');
}

function toHSL(rgb) {
  const r = rgb.r/255, g = rgb.g/255, b = rgb.b/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h = (g-b)/d + (g<b?6:0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h *= 60;
  }
  return { h: normHue(h||0), s: +(s*100).toFixed(1), l: +(l*100).toFixed(1) };
}

function HSLtoRGB(hsl) {
  const h = normHue(hsl.h)/360, s = hsl.s/100, l = hsl.l/100;
  if (s === 0) {
    const v = Math.round(l*255);
    return { r:v, g:v, b:v };
  }
  const q = l < 0.5 ? l*(1+s) : l + s - l*s;
  const p = 2*l - q;
  const r = hue2rgb(p,q,h+1/3);
  const g = hue2rgb(p,q,h);
  const b = hue2rgb(p,q,h-1/3);
  return { r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) };
}
function hue2rgb(p,q,t){ if(t<0) t+=1; if(t>1) t-=1;
  if(t<1/6) return p+(q-p)*6*t;
  if(t<1/2) return q;
  if(t<2/3) return p+(q-p)*(2/3 - t)*6;
  return p;
}

function rgbToHex({r,g,b}) {
  const c = (n) => n.toString(16).padStart(2,'0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

// WCAG-ish text color suggestion (YIQ)
function idealTextColor({r,g,b}) {
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

function pick(arr, rnd) {
  return arr[rnd() % arr.length];
}

// RNGs
function cryptoRNG() {
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return () => {
      const u32 = new Uint32Array(1);
      globalThis.crypto.getRandomValues(u32);
      return u32[0] >>> 0;
    };
  }
  // fallback PRNG (not crypto-safe)
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
  for (let i=0;i<seed.length;i++){ h ^= seed.charCodeAt(i); h = Math.imul(h,16777619); }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h>>>15), 1|h);
    t ^= t + Math.imul(t ^ (t>>>7), 61|t);
    return (t ^ (t>>>14)) >>> 0;
  };
}

// Example usage:
// console.log(generatePalette({ base:'#3366ff', scheme:'complementary', count:5, format:'hex' }));
// console.log(generatePalette({ scheme:'analogous', count:6, format:'hsl', seed:'demo' }));
// console.log(generatePalette({ base:'hsl(200,60%,50%)', scheme:'monochrome', format:'rgb' }));

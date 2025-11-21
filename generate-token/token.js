// generate-token/token.js
// Minimal, dependency-free token generator.
// Supports UUID, hex, base64, and numeric formats with optional deterministic seed.

const HEX_ALPHABET = '0123456789abcdef';
const BASE64_URL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const NUM_ALPHABET = '0123456789';

export function generateToken(options = {}) {
  const {
    type = 'uuid', // 'uuid' | 'hex' | 'base64' | 'numeric'
    length = 32,   // only for hex/base64/numeric
    seed = null,   // optional deterministic seed
  } = options;

  const rng = seed ? seededRNG(String(seed)) : cryptoRNG();

  switch (type) {
    case 'uuid':
      return uuidv4(rng);
    case 'hex':
      return randomChars(HEX_ALPHABET, length, rng);
    case 'base64':
      return randomChars(BASE64_URL_ALPHABET, length, rng);
    case 'numeric':
      return randomChars(NUM_ALPHABET, length, rng);
    default:
      throw new Error("Invalid token type. Use 'uuid', 'hex', 'base64', or 'numeric'.");
  }
}

// ---- Helpers ----

function randomChars(chars, len, rng) {
  const n = chars.length;
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[rng() % n];
  }
  return out;
}

// RFC 4122 UUID v4 (random)
function uuidv4(rng) {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = rng() & 0xff;

  // version & variant
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = HEX_ALPHABET;
  const out = new Array(36);
  let j = 0;

  for (let i = 0; i < 16; i++) {
    const b = bytes[i];
    const hi = b >>> 4;
    const lo = b & 0x0f;
    out[j++] = hex[hi];
    out[j++] = hex[lo];

    // Insert dashes after bytes 4, 6, 8, 10 → positions 8,13,18,23
    if (i === 3 || i === 5 || i === 7 || i === 9) {
      out[j++] = '-';
    }
  }
  return out.join('');
}

// Crypto RNG returns uniform 32-bit integers with buffering
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

  // Fallback: not crypto-safe. For completeness only.
  let x = 0x9e3779b9 ^ Date.now();
  return () => {
    x = (x + 0x6d2b79f5) | 0;
    x ^= x >>> 15;
    x = Math.imul(x, 1 | x);
    x ^= x >>> 7;
    return (x ^ (x >>> 14)) >>> 0;
  };
}

// Deterministic RNG
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

// Example usage:
// console.log(generateToken({ type: 'uuid' }));
// console.log(generateToken({ type: 'hex', length: 32 }));
// console.log(generateToken({ type: 'base64', length: 16 }));
// console.log(generateToken({ type: 'numeric', length: 12 }));
// console.log(generateToken({ type: 'uuid', seed: 'demo-seed' }));

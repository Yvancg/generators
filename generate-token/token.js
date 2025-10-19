// generate-token/token.js
// Minimal, dependency-free token generator.
// Supports UUID, hex, base64, and numeric formats with optional deterministic seed.

export function generateToken(options = {}) {
  const {
    type = 'uuid', // 'uuid' | 'hex' | 'base64' | 'numeric'
    length = 32,   // only for hex/base64/numeric
    seed = null,   // optional deterministic seed
  } = options;

  const rng = seed ? seededRNG(seed) : cryptoRNG();

  if (type === 'uuid') {
    return uuidv4(rng);
  }

  if (type === 'hex') {
    return randomChars('0123456789abcdef', length, rng);
  }

  if (type === 'base64') {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    return randomChars(alphabet, length, rng);
  }

  if (type === 'numeric') {
    return randomChars('0123456789', length, rng);
  }

  throw new Error("Invalid token type. Use 'uuid', 'hex', 'base64', or 'numeric'.");
}

// ---- Helpers ----

function randomChars(charset, len, rng) {
  const chars = Array.from(charset);
  let out = '';
  for (let i = 0; i < len; i++) out += chars[rng() % chars.length];
  return out;
}

// RFC 4122 UUID v4 (random)
function uuidv4(rng) {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = rng() & 0xff;
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  return (
    hex.slice(0, 8) + '-' +
    hex.slice(8, 12) + '-' +
    hex.slice(12, 16) + '-' +
    hex.slice(16, 20) + '-' +
    hex.slice(20)
  );
}

// Crypto RNG returns uniform 32-bit integers
function cryptoRNG() {
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return () => {
      const u32 = new Uint32Array(1);
      globalThis.crypto.getRandomValues(u32);
      return u32[0] >>> 0;
    };
  }
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

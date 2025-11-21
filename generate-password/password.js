// generate-password/password.js
// Minimal, dependency-free password generator.
// Uses crypto-safe randomness and supports deterministic seeding.

// Static charsets so they are not rebuilt on every call
const SET_LOWER  = 'abcdefghijklmnopqrstuvwxyz';
const SET_UPPER  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SET_NUMBER = '0123456789';
const SET_SYMBOL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Small buffered crypto RNG for fewer getRandomValues calls
let _cryptoBuf = null;
let _cryptoIdx = 0;

function cryptoIndex(max) {
  if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
    // fallback PRNG (not crypto-safe)
    let x = 0x9e3779b9 ^ Date.now();
    x = (x + 0x6d2b79f5) | 0;
    x ^= x >>> 15;
    x = Math.imul(x, 1 | x);
    x ^= x >>> 7;
    return (x ^ (x >>> 14)) >>> 0 % max;
  }

  if (!_cryptoBuf || _cryptoIdx >= _cryptoBuf.length) {
    _cryptoBuf = new Uint32Array(128);
    globalThis.crypto.getRandomValues(_cryptoBuf);
    _cryptoIdx = 0;
  }
  return _cryptoBuf[_cryptoIdx++] % max;
}

export function generatePassword(options = {}) {
  const {
    length = 16,
    symbols = true,
    numbers = true,
    uppercase = true,
    lowercase = true,
    seed = null,
  } = options;

  let charset = '';
  if (lowercase) charset += SET_LOWER;
  if (uppercase) charset += SET_UPPER;
  if (numbers)   charset += SET_NUMBER;
  if (symbols)   charset += SET_SYMBOL;

  if (!charset) throw new Error('At least one character set must be enabled.');

  const n = charset.length;
  const out = new Array(length);

  if (seed != null) {
    const R = seededRNG(String(seed));
    for (let i = 0; i < length; i++) {
      out[i] = charset[R() % n];
    }
  } else {
    for (let i = 0; i < length; i++) {
      out[i] = charset[cryptoIndex(n)];
    }
  }

  return out.join('');
}

// ---- Helpers ---- 

function seededRNG(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

// Example usage:
// console.log(generatePassword({ length: 20, symbols: true }));
// console.log(generatePassword({ length: 12, seed: 'demo-seed' }));
// generate-password/password.js
// Minimal, dependency-free password generator.
// Requires WebCrypto for secure passwords; seed is for non-secure test fixtures only.

// Static charsets so they are not rebuilt on every call
const SET_LOWER  = 'abcdefghijklmnopqrstuvwxyz';
const SET_UPPER  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SET_NUMBER = '0123456789';
const SET_SYMBOL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Small buffered crypto RNG for fewer getRandomValues calls
let _cryptoBuf = null;
let _cryptoIdx = 0;

function cryptoIndex(max) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure randomness unavailable: crypto.getRandomValues required');
  }
  // Avoid modulo bias by rejecting the small overflow range.
  const limit = Math.floor(0x100000000 / max) * max;
  let n;
  do {
    if (!_cryptoBuf || _cryptoIdx >= _cryptoBuf.length) {
      _cryptoBuf = new Uint32Array(128);
      globalThis.crypto.getRandomValues(_cryptoBuf);
      _cryptoIdx = 0;
    }
    n = _cryptoBuf[_cryptoIdx++];
  } while (n >= limit);
  return n % max;
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

  if (!Number.isInteger(length) || length < 1 || length > 4096) {
    throw new Error('length must be an integer between 1 and 4096');
  }
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
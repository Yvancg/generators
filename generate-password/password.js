// generate-password/password.js
// Minimal, dependency-free password generator.
// Uses crypto-safe randomness and supports deterministic seeding.

export function generatePassword(options = {}) {
  const {
    length = 16,
    symbols = true,
    numbers = true,
    uppercase = true,
    lowercase = true,
    seed = null,
  } = options;

  const sets = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  let charset = '';
  if (lowercase) charset += sets.lower;
  if (uppercase) charset += sets.upper;
  if (numbers) charset += sets.number;
  if (symbols) charset += sets.symbol;

  if (!charset) throw new Error('At least one character set must be enabled.');

  const chars = Array.from(charset);
  const result = [];

  // Deterministic PRNG (if seed provided), else crypto
  const rng = seed
    ? seededRNG(seed)
    : () => cryptoRandomInt(0, chars.length);

  for (let i = 0; i < length; i++) {
    result.push(chars[rng() % chars.length]);
  }

  return result.join('');
}

// ---- Helpers ----

function cryptoRandomInt(min, max) {
  const range = max - min;
  if (range <= 0) throw new Error('Invalid range.');
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return min + (buffer[0] % range);
}

function seededRNG(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const t = (h ^= h >>> 16) >>> 0;
    return t;
  };
}

// Example usage:
// console.log(generatePassword({ length: 20, symbols: true }));
// console.log(generatePassword({ length: 12, seed: 'demo-seed' }));

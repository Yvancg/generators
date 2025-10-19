// generate-card-number/card.js
// Minimal, dependency-free Luhn-compliant card number generator.
// Supports common brands, custom prefix, length, and optional deterministic seed.

export function generateCardNumber(options = {}) {
  const {
    brand = 'visa',       // 'visa' | 'mastercard' | 'amex' | 'discover' | null
    prefix = null,        // string override for BIN/prefix (digits only)
    length = undefined,   // total length including check digit (will use brand default if omitted)
    seed = null           // optional deterministic seed (string)
  } = options;

  const brands = {
    visa:      { prefixes: ['4'],                    length: 16 },
    mastercard:{ prefixes: ['51','52','53','54','55','2221','2222','2223','2224','2225','2226','2227','2228','2229','223','224','225','226','227','228','229','23','24','25','26','270','271','2720'], length: 16 },
    amex:      { prefixes: ['34','37'],              length: 15 },
    discover:  { prefixes: ['6011','65','644','645','646','647','648','649'], length: 16 },
  };

  // choose prefix
  let chosenPrefix = '';
  if (prefix) {
    if (!/^\d+$/.test(prefix)) throw new Error('prefix must be digits only');
    chosenPrefix = prefix;
  } else if (brand && brands[brand]) {
    const pfxs = brands[brand].prefixes;
    chosenPrefix = pfxs[randomIndex(pfxs.length, seed)];
  } else {
    // random 6-digit BIN-like start
    chosenPrefix = String(randomIntRange(400000, 999999, seed));
  }

  // determine length
  const totalLen = Number.isInteger(length) ? length
    : (brand && brands[brand]) ? brands[brand].length
    : 16;

  if (chosenPrefix.length >= totalLen) {
    throw new Error('prefix too long for requested length');
  }

  const bodyLen = totalLen - chosenPrefix.length - 1; // excluding check digit
  const digits = chosenPrefix.split('').map(Number);

  // fill random digits
  const rng = seed ? seededRNG(String(seed) + chosenPrefix) : cryptoRNG();
  for (let i = 0; i < bodyLen; i++) {
    digits.push(rng() % 10);
  }

  // compute check digit via Luhn
  const check = luhnComputeCheckDigit(digits);
  digits.push(check);

  return digits.join('');
}

// ---- Helpers ----

function luhnComputeCheckDigit(digits) {
  // digits: array of numbers for all digits except check digit
  // Luhn: starting from right, double every second digit
  let sum = 0;
  const rev = digits.slice().reverse();
  for (let i = 0; i < rev.length; i++) {
    let d = rev[i];
    if (i % 2 === 0) {
      // position is 1 (from right) -> doubled on check digit side; since check digit missing, this aligns
      d = d * 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  const mod = sum % 10;
  return (mod === 0) ? 0 : (10 - mod);
}

function randomIndex(n, seed) {
  const r = (seed ? seededRNG(String(seed))() : cryptoRNG()()) >>> 0;
  return r % n;
}

function randomIntRange(min, max, seed) {
  const r = (seed ? seededRNG(String(seed))() : cryptoRNG()()) >>> 0;
  return min + (r % (max - min + 1));
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

// Deterministic integer RNG from string seed (FNV-like mix)
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
// console.log(generateCardNumber({ brand: 'visa' }));
// console.log(generateCardNumber({ brand: 'amex' }));
// console.log(generateCardNumber({ prefix: '400000', length: 16 }));
// console.log(generateCardNumber({ brand: 'mastercard', seed: 'demo' }));

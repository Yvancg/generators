// generate-ssn/ssn.js
// Minimal, dependency-free US SSN generator for testing.
// Produces structurally valid but synthetic SSNs (not tied to real people).

export function generateSSN(options = {}) {
  const {
    count = 1,          // number of SSNs to generate
    formatted = true,   // "123-45-6789" vs "123456789"
    seed = null,        // deterministic seed
    valid = true        // enforce basic SSA structural rules
  } = options;

  if (!Number.isInteger(count) || count < 1) {
    throw new Error('count must be >= 1');
  }

  const R = seed ? seededRNG(String(seed)) : cryptoRNG();

  const one = () => {
    let area, group, serial;

    if (valid) {
      // Area: 001–665 or 667–899 (0, 666, 900–999 invalid)
      const areaRange = R() % 2;
      area = areaRange === 0
        ? intIn(R, 1, 665)
        : intIn(R, 667, 899);

      // Group: 01–99 (00 invalid)
      group = intIn(R, 1, 99);

      // Serial: 0001–9999 (0000 invalid)
      serial = intIn(R, 1, 9999);
    } else {
      // Looser mode but still avoids all zeros
      area = intIn(R, 1, 999);
      group = intIn(R, 1, 99);
      serial = intIn(R, 1, 9999);
    }

    const a = String(area).padStart(3, '0');
    const g = String(group).padStart(2, '0');
    const s = String(serial).padStart(4, '0');

    return formatted ? `${a}-${g}-${s}` : `${a}${g}${s}`;
  };

  if (count === 1) return one();
  const out = new Array(count);
  for (let i = 0; i < count; i++) out[i] = one();
  return out;
}

// ---- helpers ----

function intIn(R, min, max) {
  const span = max - min + 1;
  return min + (R() % span);
}

// Crypto-safe RNG where available, falls back to fast PRNG.
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
  let x = 0x9e3779b9 ^ Date.now();
  return () => {
    x = (x + 0x6d2b79f5) | 0;
    x ^= x >>> 15;
    x = Math.imul(x, 1 | x);
    x ^= x >>> 7;
    return (x ^ (x >>> 14)) >>> 0;
  };
}

// Deterministic RNG from seed string
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

// Example quick calls:
// console.log(generateSSN()); // "123-45-6789" style
// console.log(generateSSN({ count: 3, seed: 'demo' }));
// console.log(generateSSN({ formatted: false }));
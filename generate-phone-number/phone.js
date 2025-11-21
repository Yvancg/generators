// generate-phone-number/phone.js
// Deterministic US phone number generator with state/city filters.

export function generatePhoneNumbers(options = {}) {
  const {
    state = null,
    city = null,
    count = 1,
    seed = null
  } = options;

  if (count < 1 || !Number.isInteger(count)) {
    throw new Error("count must be a positive integer");
  }

  const R = seed ? seededRNG(String(seed)) : cryptoRNG();
  const pool = pickPool({ state, city });

  const out = [];
  for (let i = 0; i < count; i++) {
    const prefix = pool[R() % pool.length];    // area code
    const mid    = String((R() % 900) + 100);  // exchange
    const end    = String((R() % 9000) + 1000); // last 4
    out.push(formatUS(prefix, mid, end));
  }
  return out.length === 1 ? out[0] : out;
}

// -----------------------------------------------
// Area code maps (small starter set, extend anytime)
// -----------------------------------------------

const STATE_AREAS = {
  CA: [213, 310, 415, 510, 619, 650, 707, 818],
  NY: [212, 315, 332, 516, 585, 607, 718, 917],
  TX: [214, 281, 346, 361, 409, 512, 713, 817],
  FL: [305, 321, 352, 386, 407, 561, 754, 813],
};

const CITY_AREAS = {
  "Los Angeles": [213, 310, 424, 818],
  "San Francisco": [415, 628],
  "New York": [212, 332, 646, 917],
  "Houston": [281, 346, 713, 832],
  "Miami": [305, 786],
};

function pickPool({ state, city }) {
  if (city && CITY_AREAS[city]) return CITY_AREAS[city];
  if (state && STATE_AREAS[state]) return STATE_AREAS[state];

  // fallback random pool
  return [
    201, 202, 203, 205, 206, 207, 208, 209,
    212, 213, 214, 215, 216, 217, 218, 219,
    310, 312, 315, 404, 415, 512, 617, 702, 818
  ];
}

// -----------------------------------------------
// Helpers
// -----------------------------------------------

function formatUS(area, mid, last) {
  return `(${area}) ${mid}-${last}`;
}

function cryptoRNG() {
  if (globalThis.crypto?.getRandomValues) {
    return () => {
      const u = new Uint32Array(1);
      crypto.getRandomValues(u);
      return u[0] >>> 0;
    };
  }
  let x = (Date.now() ^ 0x9e3779b9) >>> 0;
  return () => {
    x = Math.imul(x ^ (x >>> 15), 1 | x);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
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

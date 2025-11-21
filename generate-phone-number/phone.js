// generate-phone-number/phone.js
// Deterministic US phone number generator with state/city filters.
// Returns US-format numbers like "(415) 392-8127" in an array of strings.
//
// Example:
//   generatePhoneNumbers(); // ["(415) 392-8127"]
//   generatePhoneNumbers({ state: "CA", count: 5 });
//   generatePhoneNumbers({ city: "New York", count: 3, seed: "demo" });

export const US_AREA_CODES = Object.freeze({
  AL: [205, 251, 256, 334, 938],
  AK: [907],
  AZ: [480, 520, 602, 623, 928],
  AR: [479, 501, 870],
  CA: [
    209, 213, 279, 310, 323, 341, 369, 408, 415, 424, 442, 510, 530, 559, 562,
    619, 626, 650, 657, 661, 669, 707, 714, 747, 752, 760, 805, 818, 820, 831,
    840, 858, 909, 916, 925, 949, 951
  ],
  CO: [303, 719, 720, 970],
  CT: [203, 475, 860, 959],
  DE: [302],
  FL: [
    239, 305, 321, 352, 386, 407, 448, 561, 627, 650, 689, 727, 754, 772, 786,
    813, 850, 863, 904, 941, 954
  ],
  GA: [229, 404, 470, 478, 678, 706, 762, 770, 912],
  HI: [808],
  ID: [208, 986],
  IL: [217, 224, 309, 312, 331, 447, 464, 618, 630, 708, 773, 779, 815, 847, 872],
  IN: [219, 260, 317, 463, 574, 765, 812, 930],
  IA: [319, 515, 563, 641, 712],
  KS: [316, 620, 785, 913],
  KY: [270, 364, 502, 606, 859],
  LA: [225, 318, 337, 504, 985],
  ME: [207],
  MD: [227, 240, 301, 410, 443, 667],
  MA: [339, 351, 413, 508, 617, 774, 781, 857, 978],
  MI: [231, 248, 269, 278, 313, 517, 586, 616, 679, 734, 810, 906, 947],
  MN: [218, 320, 507, 612, 651, 763, 952],
  MS: [228, 601, 662],
  MO: [314, 417, 573, 636, 660, 816, 975],
  MT: [406],
  NE: [308, 402, 531],
  NV: [702, 725, 775],
  NH: [603],
  NJ: [201, 551, 609, 640, 732, 848, 856, 862, 908, 973],
  NM: [505, 575],
  NY: [
    212, 315, 332, 347, 516, 518, 585, 607, 631, 646, 680, 716, 718, 838, 845,
    914, 917, 929, 934
  ],
  NC: [252, 336, 472, 704, 743, 828, 910, 919, 980, 984],
  ND: [701],
  OH: [
    216, 220, 234, 330, 380, 419, 440, 513, 567, 614, 740, 937
  ],
  OK: [405, 539, 572, 580, 918],
  OR: [458, 503, 541, 971],
  PA: [
    215, 223, 267, 272, 412, 445, 484, 570, 610, 717, 724, 814, 835, 878
  ],
  RI: [401],
  SC: [803, 839, 843, 854, 864],
  SD: [605],
  TN: [423, 615, 629, 731, 865, 901, 931],
  TX: [
    210, 214, 254, 281, 325, 346, 361, 409, 430, 432, 469, 512, 682, 713, 726,
    737, 806, 817, 830, 832, 903, 915, 936, 940, 956, 972, 979
  ],
  UT: [385, 435, 801],
  VT: [802],
  VA: [276, 434, 540, 571, 703, 757, 804],
  WA: [206, 253, 360, 425, 509, 564],
  WV: [304, 681],
  WI: [262, 274, 414, 534, 608, 715, 920],
  WY: [307],
  DC: [202]
});

// Simple city-level mappings (extend as needed)
export const CITY_AREA_CODES = Object.freeze({
  'Los Angeles': [213, 310, 323, 424, 747, 818],
  'San Francisco': [415, 628],
  'New York': [212, 332, 646, 917, 929],
  'Chicago': [312, 773, 872],
  'Houston': [281, 346, 713, 832],
  'Miami': [305, 786]
});

// Flattened list of all area codes for fallback
export const ALL_US_AREA_CODES = Object.freeze(
  Array.from(
    new Set(
      Object.values(US_AREA_CODES).flat()
    )
  ).sort((a, b) => a - b)
);

/**
 * Generate one or more US phone numbers.
 *
 * @param {Object} options
 * @param {string|null} [options.state]  Two-letter state code, e.g. "CA"
 * @param {string|null} [options.city]   City name, e.g. "San Francisco"
 * @param {number} [options.count=1]     How many numbers to generate
 * @param {string|null} [options.seed]   Deterministic seed
 * @returns {string[]} Array of formatted numbers, e.g. ["(415) 392-8127"]
 */
export function generatePhoneNumbers(options = {}) {
  const {
    state = null,
    city = null,
    count = 1,
    seed = null
  } = options;

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('count must be a positive integer');
  }

  const rng = seed ? seededRNG(String(seed)) : cryptoRNG();
  const pool = resolveAreaPool(state, city);

  const out = [];
  for (let i = 0; i < count; i++) {
    const area = pick(pool, rng);
    const mid  = String((rng() % 900) + 100);   // 100–999
    const last = String((rng() % 9000) + 1000); // 1000–9999
    out.push(formatUS(area, mid, last));
  }
  return out;
}

// ---------------- helpers ----------------

function resolveAreaPool(state, city) {
  if (city && CITY_AREA_CODES[city]) {
    return CITY_AREA_CODES[city];
  }
  if (state && US_AREA_CODES[state]) {
    return US_AREA_CODES[state];
  }
  return ALL_US_AREA_CODES;
}

function formatUS(area, mid, last) {
  return `(${area}) ${mid}-${last}`;
}

function pick(arr, rng) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('pick() requires a non-empty array');
  }
  return arr[rng() % arr.length];
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
  // Fallback: not crypto-safe, but deterministic enough for tests
  let x = (Date.now() ^ 0x9e3779b9) >>> 0;
  return () => {
    x = Math.imul(x ^ (x >>> 15), 1 | x);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
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

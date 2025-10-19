// generate-lorem/lorem.js
// Minimal, dependency-free Lorem Ipsum generator.
// Supports words, sentences, paragraphs, and deterministic seeding.

export function generateLorem(options = {}) {
  const {
    units = 'sentences',          // 'words' | 'sentences' | 'paragraphs'
    count = 3,                    // how many units to return
    seed = null,                  // string for deterministic output
    dictionary = DEFAULT_DICT,    // array of words to sample from
    wordsPerSentence = [8, 16],   // [min, max]
    sentencesPerParagraph = [3, 6], // [min, max]
    capitalize = true,            // capitalize first letter of sentences
    endWithPeriod = true,         // end sentences with '.'
    separator = ' '               // joiner for top-level units
  } = options;

  if (!Array.isArray(dictionary) || dictionary.length === 0) {
    throw new Error('dictionary must be a non-empty array of words');
  }
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('count must be a positive integer');
  }

  const rng = seed ? seededRNG(seed) : cryptoRNG();

  if (units === 'words') {
    const words = Array.from({ length: count }, () => pick(dictionary, rng));
    return words.join(' ');
  }

  const makeSentence = () => {
    const n = randRange(wordsPerSentence[0], wordsPerSentence[1], rng);
    const words = Array.from({ length: n }, () => pick(dictionary, rng));
    let s = words.join(' ');
    if (capitalize) s = s.charAt(0).toUpperCase() + s.slice(1);
    if (endWithPeriod) s += '.';
    return s;
  };

  if (units === 'sentences') {
    const sents = Array.from({ length: count }, makeSentence);
    return sents.join(' ');
  }

  if (units === 'paragraphs') {
    const paras = Array.from({ length: count }, () => {
      const m = randRange(sentencesPerParagraph[0], sentencesPerParagraph[1], rng);
      const sents = Array.from({ length: m }, makeSentence);
      return sents.join(' ');
    });
    return paras.join(separator === '\n\n' ? '\n\n' : separator);
  }

  throw new Error("units must be 'words', 'sentences', or 'paragraphs'");
}

// ---- Helpers ----

function pick(arr, rng) {
  return arr[rng() % arr.length];
}

function randRange(min, max, rng) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
    throw new Error('invalid range');
  }
  const span = max - min + 1;
  return min + (rng() % span);
}

// Crypto RNG returns uniform 32-bit integers
function cryptoRNG() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return () => {
      const u32 = new Uint32Array(1);
      crypto.getRandomValues(u32);
      return u32[0] >>> 0;
    };
  }
  // Node fallback
  try {
    const { randomBytes } = await import('node:crypto');
    return () => {
      const b = randomBytes(4);
      return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
    };
  } catch {
    // Not crypto-safe. For completeness only.
    let x = 0x9e3779b9 ^ Date.now();
    return () => (x = (x + 0x6d2b79f5) | 0, x ^ (x >>> 15));
  }
}

// Deterministic integer RNG from string seed (xorshift-like mix)
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

const DEFAULT_DICT = Object.freeze([
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
  'sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore',
  'magna','aliqua','ut','enim','ad','minim','veniam','quis','nostrud',
  'exercitation','ullamco','laboris','nisi','ut','aliquip','ex','ea',
  'commodo','consequat','duis','aute','irure','dolor','in','reprehenderit',
  'in','voluptate','velit','esse','cillum','dolore','eu','fugiat','nulla',
  'pariatur','excepteur','sint','occaecat','cupidatat','non','proident',
  'sunt','in','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'
]);

// Example usage:
// console.log(generateLorem({ units: 'words', count: 10 }));
// console.log(generateLorem({ units: 'sentences', count: 2, seed: 'demo' }));
// console.log(generateLorem({ units: 'paragraphs', count: 2, separator: '\n\n' }));

// generate-lorem/lorem.js
// Minimal, dependency-free Lorem Ipsum generator.
// Works in browsers and GitHub Pages. Supports words, sentences, paragraphs, and deterministic seeding.

export function generateLorem(options = {}) {
  const {
    units = 'sentences',            // 'words' | 'sentences' | 'paragraphs'
    count = 3,                      // how many units to return
    seed = null,                    // deterministic seed string
    dictionary = DEFAULT_DICT,      // array of words to sample from
    wordsPerSentence = [8, 16],     // [min, max]
    sentencesPerParagraph = [3, 6], // [min, max]
    capitalize = true,              // capitalize first letter of sentences
    endWithPeriod = true,           // end sentences with '.'
    separator = ' '                 // join paragraphs or sentences
  } = options;

  if (!Array.isArray(dictionary) || dictionary.length === 0) {
    throw new Error('dictionary must be a non-empty array of words');
  }
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('count must be a positive integer');
  }

  const rng = seed ? seededRNG(String(seed)) : cryptoRNG();
  const dict = dictionary;
  const dictLen = dict.length;
  const [wpsMin, wpsMax] = wordsPerSentence;
  const [sppMin, sppMax] = sentencesPerParagraph;

  if (units === 'words') {
    const out = new Array(count);
    for (let i = 0; i < count; i++) {
      out[i] = dict[rng() % dictLen];
    }
    return out.join(' ');
  }

  const makeSentence = () => {
    const n = randRange(wpsMin, wpsMax, rng);
    const words = new Array(n);
    for (let i = 0; i < n; i++) {
      words[i] = dict[rng() % dictLen];
    }
    let s = words.join(' ');
    if (capitalize && s.length) s = s.charAt(0).toUpperCase() + s.slice(1);
    if (endWithPeriod) s += '.';
    return s;
  };

  if (units === 'sentences') {
    const sents = new Array(count);
    for (let i = 0; i < count; i++) {
      sents[i] = makeSentence();
    }
    return sents.join(' ');
  }

  if (units === 'paragraphs') {
    const paras = new Array(count);
    for (let i = 0; i < count; i++) {
      const m = randRange(sppMin, sppMax, rng);
      const sents = new Array(m);
      for (let j = 0; j < m; j++) {
        sents[j] = makeSentence();
      }
      paras[i] = sents.join(' ');
    }
    return paras.join(separator);
  }

  throw new Error("units must be 'words', 'sentences', or 'paragraphs'");
}

// ---- Helpers ----

function randRange(min, max, rng) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
    throw new Error('invalid range');
  }
  const span = max - min + 1;
  return min + (rng() % span);
}

// Crypto RNG returns uniform 32-bit integers, buffered for speed
function cryptoRNG() {
  if (typeof globalThis !== 'undefined' &&
      globalThis.crypto &&
      typeof globalThis.crypto.getRandomValues === 'function') {
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
  // fallback: pseudo-random (not crypto-safe)
  let x = 0x9e3779b9 ^ Date.now();
  return () => {
    x = (x + 0x6d2b79f5) | 0;
    x ^= x >>> 15;
    x = Math.imul(x, 1 | x);
    x ^= x >>> 7;
    return (x ^ (x >>> 14)) >>> 0;
  };
}

// Deterministic integer RNG from string seed (xorshift-like)
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

// Default word dictionary
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
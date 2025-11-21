// generate-dataset/dataset.js
// Minimal, dependency-free JSON/CSV generator for model fine-tuning.
// Deterministic via seed. Supports JSON, JSONL, and CSV.

export function generateDataset(options = {}) {
  const {
    count = 100,              // number of rows
    schema = defaultSchema(), // { field: spec }
    format = 'jsonl',         // 'jsonl' | 'json' | 'csv'
    seed = null,              // deterministic seed
    header = true,            // CSV header
    delimiter = ',',          // CSV delimiter
  } = options;

  if (!Number.isInteger(count) || count < 1) throw new Error('count must be >= 1');
  if (!schema || typeof schema !== 'object') throw new Error('schema must be an object');
  if (format !== 'jsonl' && format !== 'json' && format !== 'csv') {
    throw new Error("format must be 'jsonl' | 'json' | 'csv'");
  }

  const R = seed ? seededRNG(String(seed)) : cryptoRNG();

  // Precompute field names and generator functions
  const fieldNames = Object.keys(schema);
  const fieldCount = fieldNames.length;
  const gens = new Array(fieldCount);
  for (let i = 0; i < fieldCount; i++) {
    const name = fieldNames[i];
    gens[i] = makeGen(schema[name], R);
  }

  // Fast paths per format
  if (format === 'jsonl') {
    const lines = new Array(count);
    for (let i = 0; i < count; i++) {
      const row = {};
      for (let j = 0; j < fieldCount; j++) {
        row[fieldNames[j]] = gens[j](i);
      }
      lines[i] = JSON.stringify(row);
    }
    return lines.join('\n');
  }

  if (format === 'json') {
    const rows = new Array(count);
    for (let i = 0; i < count; i++) {
      const row = {};
      for (let j = 0; j < fieldCount; j++) {
        row[fieldNames[j]] = gens[j](i);
      }
      rows[i] = row;
    }
    return JSON.stringify(rows, null, 2);
  }

  // CSV
  const csv = [];
  if (header) {
    csv.push(csvLine(fieldNames, delimiter));
  }
  const lineValues = new Array(fieldCount);
  for (let i = 0; i < count; i++) {
    // build row on the fly
    for (let j = 0; j < fieldCount; j++) {
      lineValues[j] = csvCell(gens[j](i), delimiter);
    }
    csv.push(csvLine(lineValues, delimiter, true));
  }
  return csv.join('\n');
}

// ---- schema helpers ----
// Field spec can be:
// { type: 'string' | 'sentence' | 'paragraph' | 'name' | 'email' | 'uuid' | 'int' | 'float' | 'bool' | 'category' | 'date' }
// Additional options depend on type (see makeGen).

function defaultSchema() {
  return {
    id:      { type: 'uuid' },
    name:    { type: 'name' },
    email:   { type: 'email' },
    prompt:  { type: 'sentence', min: 8, max: 16 },
    target:  { type: 'category', values: ['positive','neutral','negative'] },
    score:   { type: 'float', min: 0, max: 1, decimals: 3 },
    created: { type: 'date', start: '2024-01-01', end: '2025-01-01', iso: true }
  };
}

function makeGen(spec, R) {
  if (typeof spec === 'string') spec = { type: spec };
  const t = spec.type;
  switch (t) {
    case 'uuid':     return () => uuidv4(R);
    case 'name':     return () => pick(FIRST_NAMES, R) + ' ' + pick(LAST_NAMES, R);
    case 'email':    return () => {
      const fn = slug(pick(FIRST_NAMES, R));
      const ln = slug(pick(LAST_NAMES, R));
      const dom = pick(DOMAINS, R);
      return `${fn}.${ln}@${dom}`;
    };
    case 'string':   return () => randomWords(R, spec.len ?? 8);
    case 'sentence': return () => sentence(R, spec.min ?? 8, spec.max ?? 16);
    case 'paragraph':return () => paragraph(R, spec.sentences ?? 3, spec.min ?? 8, spec.max ?? 16);
    case 'int':      return () => intIn(R, spec.min ?? 0, spec.max ?? 100);
    case 'float':    return () => floatIn(R, spec.min ?? 0, spec.max ?? 1, spec.decimals ?? 2);
    case 'bool':     return () => (R() & 1) === 1;
    case 'category': {
      const vals = spec.values && spec.values.length ? spec.values : ['a','b','c'];
      const n = vals.length;
      return () => vals[R() % n];
    }
    case 'date': {
      const start = toTime(spec.start) ?? Date.now() - 365 * 24 * 3600 * 1000;
      const end   = toTime(spec.end)   ?? Date.now();
      const span  = Math.max(1, end - start);
      const iso   = spec.iso !== false;
      return () => {
        const t = start + (R() % span);
        const d = new Date(t);
        return iso ? d.toISOString() : d.toUTCString();
      };
    }
    default:
      throw new Error(`unknown field type: ${t}`);
  }
}

// ---- text helpers ----

function sentence(R, min, max) {
  const n = intIn(R, min, max);
  const words = new Array(n);
  for (let i = 0; i < n; i++) {
    words[i] = pick(LOREM, R);
  }
  let out = words.join(' ');
  if (out.length) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out + '.';
}

function paragraph(R, sentences, min, max) {
  const arr = new Array(sentences);
  for (let i = 0; i < sentences; i++) {
    arr[i] = sentence(R, min, max);
  }
  return arr.join(' ');
}

function randomWords(R, len) {
  const arr = new Array(len);
  for (let i = 0; i < len; i++) arr[i] = pick(LOREM, R);
  return arr.join(' ');
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16) || 'user';
}

// ---- number/date helpers ----
function intIn(R, a, b) {
  const min = Math.ceil(a);
  const max = Math.floor(b);
  return min + (R() % (max - min + 1));
}

function floatIn(R, a, b, d) {
  const v = a + (R() / 0xffffffff) * (b - a);
  return +v.toFixed(d);
}

function toTime(x) {
  if (!x) return null;
  const t = Date.parse(x);
  return Number.isFinite(t) ? t : null;
}

// ---- CSV helpers ----
function csvCell(v, delim) {
  if (v == null) return '';
  const s = String(v);
  if (s.indexOf('"') !== -1 || s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1 || s.indexOf(delim) !== -1) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function csvLine(vals, delim, raw = false) {
  if (raw) return vals.join(delim);
  const n = vals.length;
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = String(vals[i]);
  return out.join(delim);
}

function pick(arr, rng) {
  const len = arr.length;
  if (!len) throw new Error('pick() requires a non-empty array');
  return arr[rng() % len];
}

// ---- RNG + UUID ----
function cryptoRNG() {
  if (globalThis.crypto?.getRandomValues) {
    // buffer for fewer getRandomValues calls
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
  // fallback (not crypto-safe)
  let x = 0x9e3779b9 ^ Date.now();
  return () => {
    x = (x + 0x6d2b79f5) | 0;
    x ^= x >>> 15;
    x = Math.imul(x, 1 | x);
    x ^= x >>> 7;
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

function uuidv4(R) {
  const b = new Uint8Array(16);
  for (let i = 0; i < 16; i++) b[i] = R() & 0xff;
  b[6] = (b[6] & 0x0f) | 0x40; // v4
  b[8] = (b[8] & 0x3f) | 0x80;
  const hexArr = new Array(32);
  for (let i = 0; i < 16; i++) {
    const v = b[i];
    hexArr[i * 2]     = HEX[v >>> 4];
    hexArr[i * 2 + 1] = HEX[v & 0x0f];
  }
  const hex = hexArr.join('');
  return (
    hex.slice(0, 8) + '-' +
    hex.slice(8, 12) + '-' +
    hex.slice(12, 16) + '-' +
    hex.slice(16, 20) + '-' +
    hex.slice(20)
  );
}

const HEX = '0123456789abcdef';

// ---- tiny dictionaries ----
const FIRST_NAMES = Object.freeze([
  'Ava','Liam','Emma','Noah','Olivia','Elijah','Sophia','Mason','Isabella','Lucas',
  'Mia','Ethan','Amelia','Logan','Harper','James','Evelyn','Benjamin','Abigail'
]);

const LAST_NAMES  = Object.freeze([
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
  'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore'
]);

const DOMAINS     = Object.freeze([
  'example.com','mail.test','demo.dev','sample.io','local.test'
]);

const LOREM = Object.freeze([
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod',
  'tempor','incididunt','ut','labore','et','dolore','magna','aliqua','ut','enim','ad','minim',
  'veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea',
  'commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse',
  'cillum','eu','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non',
  'proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'
]);

// Example quick call:
// console.log(generateDataset({ count: 3, format: 'jsonl', seed: 'demo' }));
// generate-dataset/dataset.js (optimized)
// High-performance, dependency-free JSON/CSV generator for model fine-tuning.
// Deterministic via seed. Supports JSON, JSONL, and CSV.

export function generateDataset(options = {}) {
  const {
    count = 100,
    schema = defaultSchema(),
    format = 'jsonl',
    seed = null,
    header = true,
    delimiter = ',',
  } = options;

  if (!Number.isInteger(count) || count < 1) throw new Error('count must be >= 1');
  if (!schema || typeof schema !== 'object') throw new Error('schema must be an object');
  if (format !== 'jsonl' && format !== 'json' && format !== 'csv') {
    throw new Error("format must be 'jsonl' | 'json' | 'csv'");
  }

  const R = seed ? seededRNG(String(seed)) : cryptoRNG();
  const fieldNames = Object.keys(schema);
  const fieldCount = fieldNames.length;
  const gens = new Array(fieldCount);
  
  for (let i = 0; i < fieldCount; i++) {
    gens[i] = makeGen(schema[fieldNames[i]], R);
  }

  // Pre-allocate row object template for reuse
  const rowTemplate = {};
  for (let i = 0; i < fieldCount; i++) {
    rowTemplate[fieldNames[i]] = null;
  }

  if (format === 'jsonl') {
    return generateJSONL(count, fieldCount, fieldNames, gens, rowTemplate);
  }

  if (format === 'json') {
    return generateJSON(count, fieldCount, fieldNames, gens, rowTemplate);
  }

  return generateCSV(count, fieldCount, fieldNames, gens, header, delimiter);
}

function generateJSONL(count, fieldCount, fieldNames, gens, template) {
  const lines = new Array(count);
  for (let i = 0; i < count; i++) {
    const row = Object.create(null);
    for (let j = 0; j < fieldCount; j++) {
      row[fieldNames[j]] = gens[j](i);
    }
    lines[i] = JSON.stringify(row);
  }
  return lines.join('\n');
}

function generateJSON(count, fieldCount, fieldNames, gens, template) {
  const rows = new Array(count);
  for (let i = 0; i < count; i++) {
    const row = Object.create(null);
    for (let j = 0; j < fieldCount; j++) {
      row[fieldNames[j]] = gens[j](i);
    }
    rows[i] = row;
  }
  return JSON.stringify(rows, null, 2);
}

function generateCSV(count, fieldCount, fieldNames, gens, header, delimiter) {
  const parts = [];
  let size = 0;

  if (header) {
    const headerLine = fieldNames.join(delimiter);
    parts.push(headerLine);
    size = headerLine.length + 1;
  }

  const buffer = new Array(Math.min(count, 1000)); // Batch for better perf
  let bufIdx = 0;

  for (let i = 0; i < count; i++) {
    let line = '';
    for (let j = 0; j < fieldCount; j++) {
      const val = gens[j](i);
      const cell = csvCell(val, delimiter);
      line += (j > 0 ? delimiter : '') + cell;
    }
    buffer[bufIdx++] = line;
    size += line.length + 1;

    if (bufIdx === buffer.length || i === count - 1) {
      parts.push(...buffer.slice(0, bufIdx));
      bufIdx = 0;
    }
  }

  return parts.join('\n');
}

// ---- schema helpers ----

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
  
  // Cache computed values for specs that don't change
  switch (t) {
    case 'uuid':     return () => uuidv4(R);
    case 'name':     return () => pick(FIRST_NAMES, R) + ' ' + pick(LAST_NAMES, R);
    case 'email':    return () => {
      const fn = slug(pick(FIRST_NAMES, R));
      const ln = slug(pick(LAST_NAMES, R));
      const dom = pick(DOMAINS, R);
      return `${fn}.${ln}@${dom}`;
    };
    case 'string':   {
      const len = spec.len ?? 8;
      return () => randomWords(R, len);
    }
    case 'sentence': {
      const min = spec.min ?? 8;
      const max = spec.max ?? 16;
      return () => sentence(R, min, max);
    }
    case 'paragraph': {
      const sentences = spec.sentences ?? 3;
      const min = spec.min ?? 8;
      const max = spec.max ?? 16;
      return () => paragraph(R, sentences, min, max);
    }
    case 'int': {
      const min = spec.min ?? 0;
      const max = spec.max ?? 100;
      const delta = max - min + 1;
      return () => min + (R() % delta);
    }
    case 'float': {
      const min = spec.min ?? 0;
      const max = spec.max ?? 1;
      const decimals = spec.decimals ?? 2;
      const range = max - min;
      return () => {
        const v = min + (R() / 0xffffffff) * range;
        return +v.toFixed(decimals);
      };
    }
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
  const words = [];
  words.length = n;
  for (let i = 0; i < n; i++) {
    words[i] = pick(LOREM, R);
  }
  let out = words.join(' ');
  if (out.length) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out + '.';
}

function paragraph(R, sentences, min, max) {
  const arr = [];
  arr.length = sentences;
  for (let i = 0; i < sentences; i++) {
    arr[i] = sentence(R, min, max);
  }
  return arr.join(' ');
}

function randomWords(R, len) {
  const arr = [];
  arr.length = len;
  for (let i = 0; i < len; i++) arr[i] = pick(LOREM, R);
  return arr.join(' ');
}

function slug(s) {
  const lower = String(s).toLowerCase();
  let out = '';
  for (let i = 0; i < lower.length && out.length < 16; i++) {
    const c = lower.charCodeAt(i);
    if ((c >= 48 && c <= 57) || (c >= 97 && c <= 122)) {
      out += lower[i];
    }
  }
  return out || 'user';
}

// ---- number/date helpers ----

function intIn(R, a, b) {
  return a + (R() % (b - a + 1));
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
  const needsQuote = s.includes('"') || s.includes('\n') || s.includes('\r') || s.includes(delim);
  if (needsQuote) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// ---- RNG + UUID ----

function cryptoRNG() {
  if (globalThis.crypto?.getRandomValues) {
    const buf = new Uint32Array(256); // Larger buffer
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
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hexArr = new Array(36);
  let idx = 0;
  for (let i = 0; i < 16; i++) {
    const v = b[i];
    if (i === 4 || i === 6 || i === 8 || i === 10) hexArr[idx++] = '-';
    hexArr[idx++] = HEX[v >>> 4];
    hexArr[idx++] = HEX[v & 0x0f];
  }
  return hexArr.join('');
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

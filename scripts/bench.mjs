import { writeFileSync, mkdirSync } from 'node:fs';
import { performance }              from 'node:perf_hooks';

// --- Import targets explicitly to avoid discovery misses ---
import { rows }              from '../generate-fake-data/fake.js';
import { generateLorem }     from '../generate-lorem/lorem.js';
import { generatePassword }  from '../generate-password/password.js';

// ensure output dir
mkdirSync('bench', { recursive: true });

function bench(fn, iters) {
  for (let i = 0; i < Math.min(100, iters); i++) fn(); // warmup
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) fn();
  const ms = performance.now() - t0;
  return Math.round(iters / (ms / 1000)); // ops/s
}

const iters = {
  fake:   Number(process.env.FAKE_ITERS   || 600),
  lorem:  Number(process.env.LOREM_ITERS  || 50_000),
  passwd: Number(process.env.PASS_ITERS   || 200_000),
};

const targets = [
  { name: 'fake-data', fn: () => rows(50, 1234), iters: iters.fake },
  { name: 'lorem',     fn: () => generateLorem({ units: 'sentences', count: 3 }), iters: iters.lorem },
  { name: 'password',  fn: () => generatePassword({ length: 16, symbols: true, numbers: true, uppercase: true, lowercase: true }), iters: iters.passwd },
];

let wrote = 0;
let failed = 0;

for (const t of targets) {
  try {
    const ops = bench(t.fn, t.iters);
    const color = ops > 1_000_000 ? 'brightgreen'
              :  ops >   300_000 ? 'green'
              :  ops >   100_000 ? 'blue'
              :  'lightgrey';
    const json = {
      schemaVersion: 1,
      label: 'speed',
      message: `${ops.toLocaleString()} ops/s`,
      color
    };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
    wrote++;
  } catch (e) {
    failed++;
    const json = { schemaVersion: 1, label: 'speed', message: 'error', color: 'red' };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
    console.error(`[bench:${t.name}]`, e && e.stack || e);
  }
}

console.table(targets.map(t => {
  let badge;
  try {
    const { message } = JSON.parse(String(require('node:fs').readFileSync(`bench/${t.name}.json`)));
    badge = message;
  } catch { badge = 'n/a'; }
  return { target: t.name, iters: t.iters.toLocaleString(), badge };
}));

if (!wrote || failed) process.exit(1);

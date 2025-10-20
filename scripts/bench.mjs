import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

// imports unchanged...

mkdirSync('bench', { recursive: true });

async function bench(fn, iters) {
  for (let i = 0; i < Math.min(100, iters); i++) await fn(); // warmup
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) await fn();
  const ms = performance.now() - t0;
  return Math.round(iters / (ms / 1000)); // ops/s
}

const targets = [
  { name: 'card',      fn: () => generateCard({ brand: 'visa', seed: 'bench' }), iters: 100_000 },
  { name: 'fake-data', fn: () => rows(50, 1234), iters: 600 },
  { name: 'hash',      fn: () => generateHash('benchmark', 'sha-256'), iters: 10_000 },
  { name: 'lorem',     fn: () => generateLorem({ units: 'sentences', count: 3 }), iters: 50_000 },
  { name: 'password',  fn: () => generatePassword({ length: 16, symbols: true, numbers: true, uppercase: true, lowercase: true }), iters: 200_000 },
  { name: 'token',     fn: () => generateToken({ type: 'hex', length: 32 }), iters: 100_000 },
];

let wrote = 0;
let failed = 0;

for (const t of targets) {
  try {
    const ops = await bench(t.fn, t.iters); // await async bench
    const color = ops > 1_000_000 ? 'brightgreen'
              :  ops >   300_000 ? 'green'
              :  ops >   100_000 ? 'blue'
              :  'lightgrey';
    const json = { schemaVersion: 1, label: 'speed', message: `${ops.toLocaleString()} ops/s`, color };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
    wrote++;
  } catch (e) {
    failed++;
    const json = { schemaVersion: 1, label: 'speed', message: 'error', color: 'red' };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
    console.error(`[bench:${t.name}]`, e?.stack || e);
  }
}

console.table(targets.map(t => {
  let badge = 'n/a';
  try {
    const { message } = JSON.parse(String(readFileSync(`bench/${t.name}.json`)));
    badge = message;
  } catch {}
  return { target: t.name, iters: t.iters.toLocaleString(), badge };
}));

if (!wrote || failed) process.exit(1);
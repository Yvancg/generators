import { writeFileSync, mkdirSync } from 'node:fs';
import { performance }              from 'node:perf_hooks';

// --- Import targets explicitly to avoid discovery misses ---
import { isUrlSafe }    			from '../generate-password/password.js';

function bench(fn, iters) {
  for (let i = 0; i < Math.min(100, iters); i++) fn();
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) fn();
  const ms = performance.now() - t0;
  return Math.round(iters / (ms / 1000)); // ops/s
}

const targets = [
  { name: 'url',    fn: () => isUrlSafe('https://example.com?q=1'),             iters: 20000 },
];

let wrote = 0;
for (const t of targets) {
  try {
    const ops = bench(t.fn, t.iters);
    const color = ops > 1_000_000 ? 'brightgreen'
                : ops >   300_000 ? 'green'
                : ops >   100_000 ? 'blue'
                : 'lightgrey';
    const json = {
      schemaVersion: 1,
      label: 'speed',
      message: `${ops.toLocaleString()} ops/s`,
      color
    };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
    wrote++;
  } catch {
    const json = { schemaVersion: 1, label: 'speed', message: 'error', color: 'red' };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
  }
}
if (!wrote) process.exit(1);

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDataset } from '../generate-dataset/dataset.js';
import { generateSlug } from '../generate-slug/slug.js';
import { generatePhoneNumbers } from '../generate-phone-number/phone.js';
import { generateAvatar } from '../generate-avatar/avatar.js';
import { rows } from '../generate-fake-data/fake.js';
import { generatePrompt } from '../generate-prompt/prompt.js';
import { generateSSN } from '../generate-ssn/ssn.js';

test('date fixtures cover long ranges rather than a first 49-day window', () => {
  const dates = generateDataset({
    format: 'json', count: 100, seed: 'year-fixture',
    schema: { date: { type: 'date', start: '2024-01-01', end: '2025-01-01' } }
  });
  const values = JSON.parse(dates).map(r => Date.parse(r.date));
  const start = Date.parse('2024-01-01'), end = Date.parse('2025-01-01');
  assert.ok(values.every(v => v >= start && v < end));
  assert.ok(values.some(v => v > Date.parse('2024-09-01')));
  assert.throws(() => generateDataset({
    count: 1, schema: { date: { type: 'date', start: '2025-01-01', end: '2024-01-01' } }
  }), /date end/);
});

test('slug folding preserves essential Indic combining marks', () => {
  assert.equal(generateSlug('हिन्दी'), 'हिन्दी');
  assert.equal(generateSlug('Café déjà vu'), 'cafe-deja-vu');
  assert.equal(generateSlug('हिन्दी भाषा'), 'हिन्दी-भाषा');
});

test('fake phone numbers use reserved 555-01xx block and honor filters', () => {
  const phones = generatePhoneNumbers({ state: 'CA', count: 10, seed: 'fixture' });
  assert.equal(phones.length, 10);
  for (const phone of phones) assert.match(phone, /^\(\d{3}\) 555-01\d{2}$/);
  assert.throws(() => generatePhoneNumbers({ state: 'ZZ' }), /unsupported state/);
  assert.throws(() => generatePhoneNumbers({ city: 'Unknownville' }), /unsupported city/);
  assert.throws(() => generatePhoneNumbers({ city: 'Los Angeles', state: 'TX' }), /city does not match state/);
  assert.match(generatePhoneNumbers({ city: 'Los Angeles', state: 'CA' })[0], /^\(\d{3}\) 555-01\d{2}$/);
});

test('avatar escapes text in SVG markup', () => {
  const svg = generateAvatar({ text: '<&', seed: 'fixture' });
  assert.ok(svg.includes('&lt;&amp;'));
  assert.ok(!svg.includes('><&</text>'));
  assert.throws(() => generateAvatar({ size: 1 }), /size/);
});

test('fake data is reproducible and structured', () => {
  const a = rows(2, 'fixture');
  assert.equal(a.length, 2);
  assert.deepEqual(a, rows(2, 'fixture'));
  assert.match(a[0].email, /@/);
});

test('prompt placeholder rendering is deterministic', () => {
  assert.equal(generatePrompt('text', 'Write about {topic|upper}', { topic: 'testing' }), 'Write about TESTING');
  assert.throws(() => generatePrompt('unknown', '{topic}', { topic: 'test' }), /type/);
});

test('SSNs remain formatted fictional fixtures rather than verified identities', () => {
  const list = generateSSN({ count: 5, seed: 'fixture' });
  assert.equal(list.length, 5);
  for (const value of list) assert.match(value, /^\d{3}-\d{2}-\d{4}$/);
  assert.deepEqual(list, generateSSN({ count: 5, seed: 'fixture' }));
});

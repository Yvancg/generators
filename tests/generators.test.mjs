import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePassword } from '../generate-password/password.js';
import { generateToken } from '../generate-token/token.js';
import { generatePalette } from '../generate-color/color.js';
import { generateCardNumber } from '../generate-card-number/card.js';
import { generateHash } from '../generate-hash/hash.js';
import { generateDataset } from '../generate-dataset/dataset.js';
import { generateLorem } from '../generate-lorem/lorem.js';

test('passwords use valid characters and reject invalid lengths', () => {
  const p = generatePassword({ length: 32 });
  assert.equal(p.length, 32);
  assert.equal(generatePassword({ length: 16, seed: 'fixture' }), generatePassword({ length: 16, seed: 'fixture' }));
  assert.throws(() => generatePassword({ length: -1 }), /length/);
  assert.throws(() => generatePassword({ lowercase: false, uppercase: false, numbers: false, symbols: false }), /character set/);
});

test('random tokens have the requested length and valid alphabet', () => {
  assert.match(generateToken({ type: 'uuid' }), /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/);
  assert.match(generateToken({ type: 'hex', length: 64 }), /^[0-9a-f]{64}$/);
  assert.match(generateToken({ type: 'base64', length: 32 }), /^[a-zA-Z0-9_-]{32}$/);
  assert.equal(generateToken({ type: 'numeric', seed: 'demo' }), generateToken({ type: 'numeric', seed: 'demo' }));
  assert.throws(() => generateToken({ type: 'hex', length: -10 }), /length/);
});

test('color ranges are checked before conversion', () => {
  assert.equal(generatePalette({ base: 'rgb(30,50,90)', count: 2 }).colors.length, 2);
  assert.throws(() => generatePalette({ base: 'rgb(999,2,3)' }), /RGB/);
  assert.throws(() => generatePalette({ base: 'hsl(200,200%,50%)' }), /HSL/);
});

test('card number passes Luhn', () => {
  const digits = generateCardNumber({ brand: 'mastercard', seed: 'fixture' });
  assert.equal(digits.length, 16);
  let sum = 0, double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) { d *= 2; if (d > 9) d -= 9; }
    sum += d; double = !double;
  }
  assert.equal(sum % 10, 0);
});

test('known hash vectors and compact structured output', async () => {
  assert.equal(await generateHash('hello', 'sha-256'), '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  assert.equal(await generateHash('hello', 'md5'), '5d41402abc4b2a76b9719d911017c592');
  assert.equal(JSON.parse(generateDataset({ count: 2, format: 'json', seed: 'demo' })).length, 2);
  assert.equal(generateLorem({ count: 4, units: 'words', seed: 'demo' }).split(' ').length, 4);
});

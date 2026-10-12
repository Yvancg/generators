import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSlug } from '../generate-slug/slug.js';

test('slugs normalize whitespace, punctuation and accents', () => {
  assert.equal(generateSlug('Hello World! 2026'), 'hello-world-2026');
  assert.equal(generateSlug('  Café déjà vu!  '), 'cafe-deja-vu');
  assert.equal(generateSlug('A   B___C'), 'a-b-c');
  assert.equal(generateSlug('💡Idea: 2026'), 'idea-2026');
  assert.equal(generateSlug('---'), '');
});
test('slugs preserve non-Latin letters and use code point boundaries', () => {
  assert.equal(generateSlug('你好 世界'), '你好-世界');
  assert.equal(generateSlug('你好世界', { maxLength: 2 }), '你好');
  assert.equal(generateSlug('Straße & Co'), 'straße-co');
});
test('slugs support a strict maximum length', () => {
  assert.equal(generateSlug('Hello World', { maxLength: 5 }), 'hello');
  assert.equal(generateSlug('Hello World', { maxLength: 6 }), 'hello');
  assert.equal(generateSlug('Hello World', { maxLength: 7 }), 'hello-w');
});
test('slugs reject invalid arguments rather than silently coercing', () => {
  assert.throws(() => generateSlug(123), TypeError);
  assert.throws(() => generateSlug('hello', { maxLength: 0 }), RangeError);
  assert.throws(() => generateSlug('hello', { maxLength: 2.5 }), RangeError);
  assert.throws(() => generateSlug('hello', { maxLength: -1 }), RangeError);
});

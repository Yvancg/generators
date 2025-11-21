// generate-hash/hash.js
// Minimal, dependency-free hash generator supporting MD5 and SHA-256.
// Uses native SubtleCrypto when available; deterministic, ESM-safe.

const encoder = new TextEncoder();

// Precomputed MD5 tables (so they are not rebuilt on every call)
const MD5_S = [
  7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
  5,9,14,20, 5,9,14,20, 5,9,14,20, 5,9,14,20,
  4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
  6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21
];

const MD5_K = (() => {
  const k = new Int32Array(64);
  for (let i = 0; i < 64; i++) {
    k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32);
  }
  return k;
})();

// Reusable buffer helpers for SHA-256 hex encoding
const HEX_CHARS = '0123456789abcdef';

/**
 * Async hash generator.
 * input: string
 * algorithm: 'sha-256' | 'md5'
 */
export async function generateHash(input, algorithm = 'sha-256') {
  if (typeof input !== 'string') throw new Error('input must be a string');

  const algo = algorithm.toLowerCase();
  if (algo !== 'md5' && algo !== 'sha-256') {
    throw new Error("algorithm must be 'md5' or 'sha-256'");
  }

  if (algo === 'md5') {
    // Pure JS MD5 – now with precomputed tables and tighter loops
    return md5(input);
  }

  // SHA-256 via WebCrypto / SubtleCrypto
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}

// -------- Internal minimal MD5 (optimized) --------

function md5(str) {
  const x = toBlocks(str);
  let A = 0x67452301 | 0;
  let B = 0xefcdab89 | 0;
  let C = 0x98badcfe | 0;
  let D = 0x10325476 | 0;

  for (let i = 0; i < x.length; i += 16) {
    let a = A, b = B, c = C, d = D;

    for (let j = 0; j < 64; j++) {
      let F, g;
      if (j < 16) {
        F = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        F = (d & b) | (~d & c);
        g = (5 * j + 1) & 15;
      } else if (j < 48) {
        F = b ^ c ^ d;
        g = (3 * j + 5) & 15;
      } else {
        F = c ^ (b | ~d);
        g = (7 * j) & 15;
      }
      const tmp = d;
      d = c;
      c = b;
      const t = (a + F + MD5_K[j] + x[i + g]) | 0;
      a = tmp;
      b = (b + rotl(t, MD5_S[j])) | 0;
    }

    A = (A + a) | 0;
    B = (B + b) | 0;
    C = (C + c) | 0;
    D = (D + d) | 0;
  }

  return wordsToHex(A, B, C, D);
}

// Convert string → MD5 512-bit padded blocks as Uint32Array
function toBlocks(str) {
  const msg = encoder.encode(str);
  const len = msg.length;
  const bitLen = len * 8;

  // total length: original + 1 (0x80) + 8 (len) rounded up to multiple of 64
  const totalLen = (((len + 9 + 63) >> 6) << 6);
  const withOne = new Uint8Array(totalLen);
  withOne.set(msg);
  withOne[len] = 0x80;

  const view = new DataView(withOne.buffer);
  // write low 32 bits of bit length at end (sufficient for reasonable input sizes)
  view.setUint32(totalLen - 8, bitLen >>> 0, true);

  const blocks = new Uint32Array(totalLen >>> 2);
  for (let i = 0; i < blocks.length; i++) {
    blocks[i] = view.getUint32(i << 2, true);
  }
  return blocks;
}

function rotl(x, n) {
  return (x << n) | (x >>> (32 - n));
}

// Pack 4 words → 16 bytes → hex without intermediate arrays
function wordsToHex(A, B, C, D) {
  const buf = new Uint8Array(16);
  const view = new DataView(buf.buffer);
  view.setUint32(0,  A, true);
  view.setUint32(4,  B, true);
  view.setUint32(8,  C, true);
  view.setUint32(12, D, true);
  return bytesToHex(buf);
}

// Shared hex encoder for MD5 + SHA-256
function bytesToHex(bytes) {
  const len = bytes.length;
  let out = '';
  out += ''; // ensure string type
  for (let i = 0; i < len; i++) {
    const v = bytes[i];
    out += HEX_CHARS[v >>> 4] + HEX_CHARS[v & 0x0f];
  }
  return out;
}

// Example usage:
// console.log(await generateHash('hello','sha-256'));
// console.log(await generateHash('hello','md5'));
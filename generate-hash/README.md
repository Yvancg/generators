# generate-hash

[![hash gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/hash.js.json)](../metrics/hash.js.json)
[![hash ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/hash.json)](../bench/hash.json)

**generate-hash** creates cryptographic and legacy hashes (SHA-256, MD5) for text input.  
Lightweight, dependency-free, and browser-compatible.

---

## 🚀 Why

Many hash utilities rely on large crypto packages or Node-only APIs.  
`generate-hash` uses native WebCrypto when available and includes a minimal MD5 fallback — ideal for secure client-side hashing, data integrity checks, or reproducible signatures.

---

## 🌟 Features

- ✅ SHA-256 (via SubtleCrypto) and MD5 (pure JS)  
- ✅ Browser, Node.js, Deno, Bun support  
- ✅ Minimal, dependency-free ESM  
- ✅ Deterministic, repeatable output  
- ✅ UTF-8 input handling  

---

## 📦 Usage

```js
import { generateHash } from './hash.js';

// SHA-256 hash
console.log(await generateHash('hello world', 'sha-256'));
// → 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'

// MD5 hash
console.log(await generateHash('hello world', 'md5'));
// → '5eb63bbbe01eeed093cb22bb8f5acdc3'
```

---

## 🧠 API

```ts
generateHash(input: string, algorithm?: 'sha-256' | 'md5'): Promise<string>
```
Returns a lowercase hex-encoded hash string.

---

## Example Output

```bash
SHA-256 → b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
MD5      → 5eb63bbbe01eeed093cb22bb8f5acdc3
```


Supports SHA-256 via native Web Crypto and MD5 through a small legacy implementation. MD5 is insecure for passwords and other security-sensitive purposes; use an appropriate password-hashing algorithm for credentials.

## 🧪 Browser test

Open `hash-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Hash Test](https://yvancg.github.io/generators/generate-hash/hash-test.html)

---

## 🛠 Development

This module is standalone. Copy `hash.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./hash.js').then(async m=>console.log(await m.generateHash('test','sha-256')))"
```

---

## 🔒 Notes

•	Uses WebCrypto crypto.subtle.digest when available.
• MD5 is not secure — use only for checksums or legacy compatibility.
• SHA-256 is cryptographically safe for most integrity uses.
  
---

## 🪪 License

MIT License  

Copyright (c) 2025 **Y Consulting LLC**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

## ❤️ Support the project

If this library helped you, consider sponsoring its maintenance.

### GitHub Sponsors

[👉 Sponsor me on GitHub](https://github.com/sponsors/yvancg)

### Buy Me a Coffee

[☕ Support via BuyMeACoffee](https://buymeacoffee.com/yconsulting)

### Direct Contribution

[💸 Direct Contribution via Paypal](https://www.paypal.com/ncp/payment/4HT7CA3E7HYBA)

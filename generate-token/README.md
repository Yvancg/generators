# generate-token

[![token gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/token.js.json)](../metrics/token.js.json)
[![token ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/token.json)](../bench/token.json)

**generate-token** cryptographically generates random token or API key (hex, base64, UUID).

---

## 🚀 Why

Many token generators depend on heavy libraries or unsafe randomness.  
`generate-token` is minimal, deterministic (if seeded), and dependency-free — perfect for reproducible tests, mock APIs, and secure token generation.

---

## 🌟 Features

- ✅ Cryptographically secure randomness (`crypto.getRandomValues`)  
- ✅ Supports `uuid`, `hex`, `base64`, and `numeric` formats  
- ✅ Deterministic output via `seed` for reproducible results  
- ✅ Works in Node.js, Deno, Bun, and browsers  
- ✅ No dependencies — pure ESM  

---

## 📦 Usage

```js
import { generateToken } from './token.js';

// Generate a UUID (default)
console.log(generateToken());
// → 'd3b44a76-8c5b-4f7b-89c7-4f47f60dc0a1'

// Generate a 32-character hex token
console.log(generateToken({ type: 'hex', length: 32 }));
// → '4fa91c28a7b53d1c2e64a9f6bc71d4ce'

// Generate a 16-character base64 token
console.log(generateToken({ type: 'base64', length: 16 }));
// → 'QkVbSy9xY1Z0Z1hP'

// Generate a numeric token
console.log(generateToken({ type: 'numeric', length: 10 }));
// → '5829034710'

// Deterministic UUID
console.log(generateToken({ type: 'uuid', seed: 'demo-seed' }));
// → always the same UUID for that seed
```

---

## 🧠 API

```ts
generateToken(options?: TokenOptions): string

type TokenOptions = {
  type?: 'uuid' | 'hex' | 'base64' | 'numeric';
  length?: number;   // ignored for uuid
  seed?: string | null;
};
```
Returns a token string in the specified format.

---

## Example Output

```bash
{
  "uuid": "f33a9a3e-dc2b-4b3b-a29e-8adad58a4770",
  "hex": "8e97ab4c291d5a7fbe21004da05a7f1b",
  "base64": "X1pjUWFkR2x4R2E=",
  "numeric": "5829034710"
}
```

## 🧪 Browser test

Open `token-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Token Test](https://yvancg.github.io/generators/generate-token/token-test.html)

---

## 🛠 Development

This module is standalone. Copy `token.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./token.js').then(m=>console.log(m.generateToken({type:'uuid'})))"
```

---

## 🔒 Notes

•	Uses browser or Node crypto API when available.
•	The seed option makes output deterministic (useful for tests, not production).
•	All randomness and output formats are self-contained; no external entropy sources.
  
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

[💸 Direct Contribution via Paypal](https://paypal.me/ComicStylePortrait)

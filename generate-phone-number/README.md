# generate-phone-number

[![phone gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/phone.js.json)](../metrics/phone.js.json)
[![phone ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/phone.json)](../bench/phone.json)

**generate-password** creates realistic US phone numbers, optionally scoped by state or city.
It supports deterministic seeding, batch generation, and consistent formatting.

---

## 🚀 Why

Most phone number generators rely on external datasets or inconsistent formatting.
`generate-password` is a clean, deterministic module that runs everywhere with zero dependencies.

---

## 🌟 Features

-	✅ US-format phone numbers (AAA) BBB-CCCC
-	✅ Optional state targeting (area-code mapping)
-	✅ Optional city mapping when supported
-	✅ Deterministic output via seed
-	✅ Generate one or many at once
-	✅ Works in Node.js, Deno, Bun, and browsers
-	✅ Zero dependencies — pure ES module

---

## 📦 Usage

```js
import { generatePhoneNumbers } from './phone.js';

// Generate a single random US phone number
console.log(generatePhoneNumbers());
// → ["(415) 392-8127"]

// Generate 5 phone numbers from California
console.log(generatePhoneNumbers({ state: "CA", count: 5 }));
// → ["(213) 555-4821", "(415) 290-1833", ...]

// Deterministic list with seed
console.log(generatePhoneNumbers({ count: 3, seed: "demo" }));
// → ["(646) 201-4922", "(305) 440-9821", "(512) 933-4408"]

// Target a specific city (if known)
console.log(generatePhoneNumbers({ city: "San Francisco", count: 2 }));
// → ["(415) 328-9012", "(628) 440-5511"]
```

---

## Options

| Option   | Type              | Default | Description                                 |
|----------|-------------------|---------|---------------------------------------------|
| state    | string / null     | null    | Restrict area codes to a US state           |
| city     | string / null     | null    | Restrict area codes to a specific city      |
| count    | number            | 1       | How many phone numbers to generate          |
| seed     | string / null     | null    | Deterministic generation if provided        |

---

## 🧠 API

### `generatePhoneNumbers(options?: PhoneOptions): string[]`

**Options**
```ts
type PhoneOptions = {
  state?: string | null;
  city?: string | null;
  count?: number;
  seed?: string | null;
};
```
Returns an array of formatted US phone numbers.

---

Generated phone numbers use the reserved fictional 555-0100 through 555-0199 block. Unknown states and cities now raise errors instead of silently ignoring filters. The city map currently supports Los Angeles only; state-only and unfiltered generation remain available. Area-code assignments may evolve, so do not use this utility for live phone-number verification.

## 🧪 Browser test

Open `phone-test.html` in your browser  
or try the hosted demo 👉🏻 
[Phone Number Generator Test](https://yvancg.github.io/generators/generate-phone-number/phone-test.html)

---

## 🛠 Development

This module is standalone. Copy `phone.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./phone.js').then(m=>console.log(m.generatePhoneNumbers({count:3})))"
```

---

## 🔒 Notes

• Uses crypto.getRandomValues() for randomness when available.
• Deterministic seed mode is for testing only.
• Area code mappings are simplified for consistency and stability.
  
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

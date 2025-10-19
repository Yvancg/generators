# generate-card-number

[![card gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/card.js.json)](../metrics/card.js.json)
[![card ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/card.json)](../bench/card.json)

**generate-card-number** creates valid, Luhn-compliant card numbers, expiry dates, and CVCs for testing and demo environments.

---

## 🚀 Why

Most credit card generators depend on unsafe randomness or incomplete patterns.  
`generate-card-number` is deterministic (optional `seed`), dependency-free, and pure ESM — ideal for secure, offline test data generation.

---

## 🌟 Features

- ✅ Valid Luhn-compliant card numbers  
- ✅ Supports Visa, Mastercard, Amex, Discover  
- ✅ Generates expiry (`MM/YY`) and valid 3–4-digit CVC  
- ✅ Deterministic output via `seed`  
- ✅ Works in Node, Deno, Bun, and browser  
- ✅ Zero dependencies  

---

## 📦 Usage

```js
import { generateCard } from './card.js';

// Generate Visa test card
console.log(generateCard({ brand: 'visa' }));
// → { number: '4111111111111111', brand: 'visa', expiry: '08/28', cvc: '123' }

// Deterministic Mastercard (same seed → same card)
console.log(generateCard({ brand: 'mastercard', seed: 'demo-seed' }));
// → { number: '5555555555554444', brand: 'mastercard', expiry: '04/27', cvc: '952' }

// Custom prefix and length
console.log(generateCard({ prefix: '400000', length: 16 }));
// → { number: '4000001234567899', brand: 'visa', expiry: '10/26', cvc: '573' }
```

---

## 🧠 API

```ts
type CardOptions = {
  brand?: 'visa' | 'mastercard' | 'amex' | 'discover' | null;
  prefix?: string | null;     // custom BIN/prefix
  length?: number;            // total length (default brand standard)
  seed?: string | null;       // deterministic seed
  maxExpiryYears?: number;    // random expiry within N years (default 5)
};

type Card = {
  number: string;    // Luhn-valid card number
  brand: string;     // detected or provided brand
  expiry: string;    // MM/YY format
  cvc: string;       // 3- or 4-digit code
};
```

**`generateCardNumber(opts)`**

Returns a raw card number only (no expiry or CVC).

**`generateExpiry(opts)`**

Generates a valid expiry date object within the next N years.

**`generateCVC(opts)`**

Returns a random CVC string (4 digits for Amex, else 3).

---

## Example Output

```bash
{
  "number": "4111738941524499",
  "brand": "visa",
  "expiry": "09/28",
  "cvc": "317"
}
```

## 🧪 Browser test

Open `card-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Card Number Test](https://yvancg.github.io/generators/generate-card-number/card-test.html)

---

## 🛠 Development

This module is standalone. Copy `card.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./card.js').then(m=>console.log(m.generateCard({brand:'visa'})))"
```

---

## 🔒 Notes

•	Generated cards are not real and will fail live payment processing.
•	CVC and expiry are randomly generated and valid only for testing.
•	Safe for use in mock APIs, sandbox systems, or demo dashboards.
  
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

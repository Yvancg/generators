# generate-fake-data

[![fake gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/fake.js.json)](../metrics/fake.js.json)
[![fake ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/fake-data.json)](../bench/fake-data.json)

**generate-fake-data** creates seedable, dependency-free fake data for tests, demos, and AI dataset prototyping.

---

## 🚀 Why

Most fake data libraries rely on massive datasets or unsafe randomness.
`generate-fake-data` is small, deterministic, and dependency-free — ideal for reproducible test runs, mock APIs, or synthetic AI inputs.

---

## 🌟 Features

- ✅ Deterministic output via `seed`
- ✅ Names, emails, phones (E.164-ish), addresses, companies
- ✅ Pure ESM, no deps, O(n)
- ✅ Works in Node, Deno, Bun, or browser
- ✅ Generates entire fake datasets in O(n)

---

## 📦 Usage

```js
import { rows, rng, user } from './fake.js';

// Generate deterministic fake dataset
console.log(rows(3, 42));
// → array of 3 user objects

// Generate a single deterministic user
const R = rng(42);
console.log(user(R));
// → { id: "u_123456", name: "Emma Brown", ... }
```

---

## 🧠 API

```ts
rng(seed?: number|string): () => number
rows(count?: number, seed?: number|string): Array<User>
user(R?: () => number): User
firstName(R): string
lastName(R): string
fullName(R): string
email(name?: string, R?, domain?: string): string
phoneE164(R, cc?: string): string
address(R): { line1, city, state, zip, country }
company(R): string
```
Returns a string containing the generated password.

---

## Example Output

```bash
{
  "id": "u_391823",
  "name": "Ava Johnson",
  "email": "ava.johnson@example.com",
  "phone": "+15554443322",
  "address": {
    "line1": "8741 Maple St",
    "city": "Austin",
    "state": "TX",
    "zip": "78701",
    "country": "US"
  },
  "company": "Quantum Labs"
}
```

## 🧪 Browser test

Open `fake-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Fake Data Test](https://yvancg.github.io/generators/generate-fake-data/fake-test.html)

---

## 🛠 Development

This module is standalone. Copy `fake.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./fake.js').then(m=>console.log(m.rows(3,42)))"
```

---

## 🔒 Notes

•	Phone format is simple +CC + 10 digits for portability.
•	Datasets are tiny on purpose; extend arrays as needed.
•	No PII sources; all names/domains are generic.
  
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

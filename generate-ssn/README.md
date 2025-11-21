# generate-ssn

[![ssn gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/ssn.js.json)](../metrics/ssn.js.json)
[![ssn ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/ssn.json)](../bench/ssn.json)

**generate-ssn** creates synthetic but structurally valid US Social Security Numbers for testing.  
It supports formatted or unformatted output, deterministic seeding, and optional SSA validity rules.


---

## 🚀 Why

Test datasets often need realistic identifiers without using real personal information.  
`generate-ssn` is pure ESM and dependency-free, making it a safe way to generate fake SSNs for demos, fixtures, or QA workloads.

---

## 🌟 Features

- Generate synthetic US SSNs
- Optional formatting (123-45-6789)
- Optional SSA structure validation
- Deterministic output when seed is provided
- Works in Node, Bun, Deno, and browser

---

## 📦 Usage

```js
import { generateSSN } from './ssn.js';

// Single SSN
console.log(generateSSN());

// Multiple, deterministic
console.log(generateSSN({ count: 5, seed: 'demo' }));

// Raw digits only
console.log(generateSSN({ formatted: false }));

// Strict SSA rules
console.log(generateSSN({ valid: true }));
```

---

## 🧠 API

```ts
generateSSN(options?: SSNOptions): string | string[]

type SSNOptions = {
  count?: number;       // default 1
  seed?: string | null; // deterministic output
  formatted?: boolean;  // default true → 123-45-6789
  valid?: boolean;      // enforce basic SSA rules, default true
}
```


---

## Example Output

```txt
123-45-6789
532-20-1184
009-73-5511
```


## 🧪 Browser test

Open `ssn-test.html` in your browser  
or try the hosted demo  
[Generate SSN Test](https://yvancg.github.io/generators/generate-ssn/ssn-test.html)

---

## 🛠 Development

This module is standalone. Copy `san.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./ssn.js').then(m=>console.log(m.generateSSN({ count: 3, seed: 'demo' })))"
```

---

## 🔒 Notes

• Generates only synthetic SSNs  
• Does not produce real or assignable numbers  
• Deterministic mode ensures reproducible datasets  
• Safe for testing, QA, demos, mock users, and fixtures
  
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

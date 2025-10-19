# generate-password

[![password gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/password.js.json)](../metrics/password.js.json)
[![password ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/password.json)](../bench/password.json)

**generate-password** creates random, strong passwords suitable for authentication, testing, or demo accounts.  
It supports length, charset control, and reproducible outputs when a seed is provided.

---

## 🚀 Why

Most password generators depend on heavy libraries, weak pseudo-randomness, or unsafe string operations.  
`generate-password` is a small, auditable, and crypto-safe module that runs everywhere with zero dependencies.

---

## 🌟 Features

- ✅ Uses `crypto.getRandomValues()` for secure entropy  
- ✅ Optional deterministic seeding for reproducible outputs  
- ✅ Customizable character sets (symbols, numbers, uppercase, lowercase)  
- ✅ Works in Node.js, Deno, Bun, and browsers  
- ✅ Zero dependencies — pure ES module  

---

## 📦 Usage

```js
import { generatePassword } from './password.js';

generatePassword();
// → 'fP8!cN9^hK2@xQ4?'

generatePassword({ length: 20, symbols: false });
// → 'aJh7yP3bLq0vFs2TmR8z'

generatePassword({ length: 12, seed: 'demo-seed' });
// → 'Xp7aK4FqJr2b'
```

---

## Options

| Option     | Type          | Default | Description                     |
|-------------|---------------|----------|---------------------------------|
| `length`   | number        | 16       | Password length                 |
| `symbols`  | boolean       | true     | Include special characters      |
| `numbers`  | boolean       | true     | Include digits                  |
| `uppercase`| boolean       | true     | Include A–Z                     |
| `lowercase`| boolean       | true     | Include a–z                     |
| `seed`     | string / null | null     | Deterministic output if provided |

---

## 🧠 API

### `generatePassword(options?: GenerateOptions): string`

**Options**
```ts
type GenerateOptions = {
  length?: number;
  symbols?: boolean;
  numbers?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  seed?: string | null;
};
```
Returns a string containing the generated password.

---

## 🧪 Browser test

Open `password-test.html` in your browser  
or try the hosted demo 👉🏻 
[Password Generator Test](https://yvancg.github.io/generators/generate-password/password-test.html)

---

## 🛠 Development

This module is standalone. Copy `password.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./password.js').then(m=>console.log(m.generatePassword({length:16})))"
```

---

## 🔒 Notes

•	Uses crypto.getRandomValues() or crypto.randomBytes() for randomness.
•	Deterministic seed mode is for testing only.
•	No external dependencies or network calls.
  
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

### Custom link
[💸 Direct contribution](https://wise.com/pay/me/yvanc7)

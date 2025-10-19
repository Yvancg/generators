# generate-card-number

[![card gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/card.js.json)](../metrics/card.js.json)
[![card ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/card.json)](../bench/card.json)

**generate-card-number** creates seedable, dependency-free fake data for tests, demos, and AI dataset prototyping.

---

## 🚀 Why

Most Lorem Ipsum tools depend on large libraries or unsafe random generators.  
`generate-card-number` is compact, deterministic, and dependency-free — ideal for reproducible content, AI dataset stubs, or testing pipelines.

---

## 🌟 Features

- ✅ Deterministic output via `seed`  
- ✅ Generates words, sentences, or paragraphs  
- ✅ Adjustable word and sentence ranges  
- ✅ Capitalization and punctuation options  
- ✅ Works in Node.js, Deno, Bun, or browser  
- ✅ Zero dependencies — pure ESM  

---

## 📦 Usage

```js
import { generateCard } from './card.js';

console.log(generateCard({ brand: 'visa', seed: 'demo' }));
// -> { number: '4111...1234', brand: 'visa', expiry: '09/28', cvc: '123' }
```

---

## 🧠 API

```ts
generateLorem(options?: LoremOptions): string

type LoremOptions = {
  units?: 'words' | 'sentences' | 'paragraphs';
  count?: number;
  seed?: string | null;
  dictionary?: string[];
  wordsPerSentence?: [number, number];
  sentencesPerParagraph?: [number, number];
  capitalize?: boolean;
  endWithPeriod?: boolean;
  separator?: string;
};
```
Returns a string of generated Lorem Ipsum text.

---

## Example Output

```bash
Lorem ipsum dolor sit amet consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```
With a seed:
```bash
console.log(generateLorem({ units: 'sentences', count: 2, seed: 'demo' }));
# Lorem dolore pariatur anim exercitation officia.
# Fugiat id consequat tempor in voluptate.
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
node --input-type=module -e "import('./card.js').then(m=>console.log(m.generateLorem({units:'sentences',count:2})))"
```

---

## 🔒 Notes

•	Output is synthetic and reproducible — no external data.
•	All randomness uses crypto.getRandomValues when available.
•	Use the seed option for deterministic test results.
  
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

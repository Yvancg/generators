# generate-lorem

[![lorem gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/lorem.js.json)](../metrics/lorem.js.json)
[![lorem ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/lorem.json)](../bench/lorem.json)

**generate-lorem** creates seedable, dependency-free fake data for tests, demos, and AI dataset prototyping.

---

## 🚀 Why

Most Lorem Ipsum tools depend on large libraries or unsafe random generators.  
`generate-lorem` is compact, deterministic, and dependency-free — ideal for reproducible content, AI dataset stubs, or testing pipelines.

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
import { generateLorem } from './lorem.js';

// Generate 10 words
console.log(generateLorem({ units: 'words', count: 10 }));

// Generate 2 sentences
console.log(generateLorem({ units: 'sentences', count: 2 }));

// Generate 3 paragraphs with a seed
console.log(generateLorem({ units: 'paragraphs', count: 3, seed: 'demo', separator: '\n\n' }));
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

Open `lorem-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Lorem Ipsum Test](https://yvancg.github.io/generators/generate-lorem/lorem-test.html)

---

## 🛠 Development

This module is standalone. Copy `lorem.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./lorem.js').then(m=>console.log(m.generateLorem({units:'sentences',count:2})))"
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

[💸 Direct Contribution via Paypal](https://www.paypal.com/ncp/payment/4HT7CA3E7HYBA)

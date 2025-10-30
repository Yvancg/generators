# generate-prompt

[![prompt gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/prompt.js.json)](../metrics/prompt.js.json)
[![prompt ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/prompt.json)](../bench/prompt.json)

**generate-prompt** builds dynamic AI prompt templates for text, code, and image generation.  
It supports `{placeholders}`, transformations, helper macros, and reproducible seeding.

---

## 🚀 Why

Most prompt templating systems are heavy or tied to frameworks.  
`generate-prompt` is lightweight, portable, and works directly in browsers or edge environments — perfect for LLM and generative AI experiments.

---

## 🌟 Features

- ✅ Supports `{placeholders}` and `{{helpers}}`  
- ✅ Built-in transforms (upper, lower, title, json, etc.)  
- ✅ Deterministic helper output via `seed`  
- ✅ Works in Node.js, Deno, Bun, or browser  
- ✅ Includes ready-to-use text, code, and image prompt presets  
- ✅ Zero dependencies — pure ESM  

---

## 📦 Usage

```js
import { generatePrompt } from './prompt.js';

// Basic usage
console.log(
  generatePrompt('text', 'Write a {tone} tweet about {topic}', {
    tone: 'funny',
    topic: 'AI startups'
  })
);
// → "Write a funny tweet about AI startups"

// Code prompt
console.log(
  generatePrompt('code', 'Write {language} code that {instruction}', {
    language: 'Python',
    instruction: 'parses JSON safely'
  })
);
// → "You are an expert Python assistant.\nWrite Python code that parses JSON safely"

// Image prompt
console.log(
  generatePrompt('image', 'A {style} {subject} with {lighting} lighting', {
    subject: 'portrait of a robot',
    style: 'cyberpunk',
    lighting: 'neon'
  })
);
// → "IMAGE PROMPT: A cyberpunk portrait of a robot with neon lighting"
```

---

## 🧠 API

```ts
generatePrompt(
  type?: 'text' | 'code' | 'image',
  template?: string,
  vars?: Record<string, any>,
  options?: {
    seed?: string | null;
    trim?: boolean;
    fallback?: string;
    transforms?: Record<string, (s: string) => string>;
    allowUnknown?: boolean;
  }
): string
```
### Built-in Helpers
•	`{{NOW_ISO}}` → current ISO timestamp
•	`{{RAND_INT:min,max}}` → random integer (seedable)

### Built-in Transforms
•	`|upper`, `|lower`, `|title`, `|snake`, `|kebab`, `|json`

---

## Example Output

```bash
Write a funny tweet about AI startups. Audience: founders. 2025-10-20T09:00:00.000Z
```
With a seed:
```bash
{{RAND_INT:1,10}} → 7  (deterministic)
```

## 🧪 Browser test

Open `prompt-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Prompt Test](https://yvancg.github.io/generators/generate-prompt/prompt-test.html)

---

## 🛠 Development

This module is standalone. Copy `prompt.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./prompt.js').then(m=>console.log(m.generatePrompt('text','{tone} {topic}',{tone:'cool',topic:'AI'})))"
```

---

## 🔒 Notes

• Output is pure string — no model-specific tokens.
• Helpers and transforms are sandboxed and auditable.
• Seed ensures deterministic helper randomness for testing.
  
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

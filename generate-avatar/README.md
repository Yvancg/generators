# generate-avatar

[![avatar gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/avatar.js.json)](../metrics/avatar.js.json)
[![avatar ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/avatar.json)](../bench/avatar.json)

**generate-avatar** creates deterministic or random SVG avatars and placeholders.  
It supports initials, geometric blocks, and abstract circles — all reproducible via seed.


---

## 🚀 Why

Most avatar generators rely on external graphics libraries or canvas APIs.  
`generate-avatar` is pure ESM and dependency-free, perfect for mock profiles, placeholder images, or synthetic dataset visuals.

---

## 🌟 Features

- ✅ Generate avatars by pattern (`initials`, `blocks`, `circles`, or `random`)  
- ✅ Deterministic output with `seed`  
- ✅ Adjustable size and background color  
- ✅ Returns inline SVG string (ready to embed or download)  
- ✅ Works in Node.js, Deno, Bun, or browser  

---

## 📦 Usage

```js
import { generateAvatar } from './avatar.js';

// Initials avatar
console.log(generateAvatar({ text: 'YV', pattern: 'initials', size: 128, seed: 'demo' }));

// Block pattern avatar
console.log(generateAvatar({ pattern: 'blocks', size: 128, seed: 'bench' }));

// Random circle pattern avatar
console.log(generateAvatar({ pattern: 'circles', size: 256 }));
```

---

## 🧠 API

```ts
generateAvatar(options?: AvatarOptions): string

type AvatarOptions = {
  text?: string;                 // initials or label
  pattern?: 'initials' | 'blocks' | 'circles' | 'random';
  size?: number;                 // default 128
  seed?: string | null;          // deterministic seed
  background?: string | null;    // base color (#hex, rgb, or hsl)
};
```
Returns an SVG string that can be directly inserted into the DOM or written to a file.

---

## Example Output

```html
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#3366ff" width="128" height="128"/>
  <text x="50%" y="55%" fill="#fff" font-size="48" text-anchor="middle" font-family="sans-serif">YV</text>
</svg>
```


## 🧪 Browser test

Open `avatar-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Avatar Test](https://yvancg.github.io/generators/generate-avatar/avatar-test.html)

---

## 🛠 Development

This module is standalone. Copy `avatar.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./avatar.js').then(m=>console.log(m.generateAvatar({text:'AI',pattern:'blocks',seed:'demo'})))"
```

---

## 🔒 Notes

• Uses crypto.getRandomValues when available for secure randomness.
• Fully deterministic when seed is provided.
• Ideal for UI placeholders, mock APIs, and synthetic datasets.
  
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

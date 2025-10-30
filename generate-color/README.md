# generate-color

[![color gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/color.js.json)](../metrics/color.js.json)
[![color ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/color.json)](../bench/color.json)

**generate-color** creates deterministic or random color palettes in HEX, RGB, or HSL format.  
It supports common schemes like complementary, triadic, tetradic, analogous, and monochrome.

---

## 🚀 Why

Most color generators depend on UI libraries or design APIs.  
`generate-color` is a standalone, dependency-free module ideal for AI image prompt generation, UI prototyping, or random theme creation.

---

## 🌟 Features

- ✅ Generate palettes by scheme (complementary, triadic, tetradic, etc.)  
- ✅ Supports `hex`, `rgb`, or `hsl` formats  
- ✅ Deterministic seeding for reproducible results  
- ✅ Works in Node.js, Deno, Bun, or browser  
- ✅ Returns ideal text color (`#000` or `#fff`) for accessibility contrast  

---

## 📦 Usage

```js
import { generatePalette } from './color.js';

// Generate a triadic palette from a base color
console.log(generatePalette({ base: '#3366ff', scheme: 'triadic', count: 5, format: 'hex' }));

// Generate an analogous palette (HSL)
console.log(generatePalette({ scheme: 'analogous', count: 6, format: 'hsl', seed: 'demo' }));

// Generate a monochrome RGB palette
console.log(generatePalette({ base: 'hsl(200,60%,50%)', scheme: 'monochrome', format: 'rgb' }));
```

---

## 🧠 API

```ts
generatePalette(options?: PaletteOptions): {
  base: string;
  scheme: string;
  colors: string[];
  textOnBase: string;
}

type PaletteOptions = {
  base?: string;                 // #hex | rgb() | hsl()
  scheme?: 'complementary' | 'triadic' | 'tetradic' | 'analogous' | 'monochrome' | 'random';
  count?: number;                // default 5
  format?: 'hex' | 'rgb' | 'hsl';
  seed?: string | null;
};
```

---

## Example Output

```bash
{
  "base": "#3366ff",
  "scheme": "triadic",
  "colors": ["#3366ff", "#ff33cc", "#33ff66"],
  "textOnBase": "#ffffff"
}
```


## 🧪 Browser test

Open `color-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Color Test](https://yvancg.github.io/generators/generate-color/color-test.html)

---

## 🛠 Development

This module is standalone. Copy `color.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./color.js').then(m=>console.log(m.generatePalette({scheme:'triadic'})))"
```

---

## 🔒 Notes

• Uses crypto.getRandomValues when available for high entropy.
• Deterministic when seed is supplied.
• Designed for visual and data generation — not cryptography.
  
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

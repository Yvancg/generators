# generate-dataset

[![dataset gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/dataset.js.json)](../metrics/dataset.js.json)
[![dataset ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/dataset.json)](../bench/dataset.json)

**generate-dataset** creates deterministic or random datasets for model fine-tuning or synthetic data pipelines.  
It supports JSON, JSONL, and CSV output formats, with customizable schemas and seeding for reproducibility.

---

## 🚀 Why

Most dataset generators depend on heavy data libraries or external APIs.  
`generate-dataset` is a pure, dependency-free module — ideal for AI prompt/response generation, model evaluation, or structured data testing.

---

## 🌟 Features

- ✅ Generate JSON, JSONL, or CSV datasets  
- ✅ Fully customizable schema per field  
- ✅ Deterministic output via `seed`  
- ✅ Built-in types: `uuid`, `name`, `email`, `sentence`, `float`, `category`, etc.  
- ✅ Works in Node.js, Deno, Bun, or browser  
- ✅ Zero dependencies  

---

## 📦 Usage

```js
import { generateDataset } from './dataset.js';

// Generate 3 rows of JSONL with default schema
console.log(generateDataset({ count: 3, format: 'jsonl', seed: 'demo' }));

// Custom schema with numeric and categorical fields
const schema = {
  id: { type: 'uuid' },
  text: { type: 'sentence', min: 6, max: 12 },
  label: { type: 'category', values: ['positive', 'neutral', 'negative'] },
  score: { type: 'float', min: 0, max: 1, decimals: 3 }
};

console.log(generateDataset({ count: 5, schema, format: 'csv', seed: 'demo' }));
```

---

## 🧠 API

```ts
generateDataset(options?: DatasetOptions): string

type DatasetOptions = {
  count?: number;                    // number of rows
  schema?: Record<string, FieldSpec>; // schema definition
  format?: 'jsonl' | 'json' | 'csv'; // default: jsonl
  seed?: string | null;              // deterministic seed
  header?: boolean;                  // include header for CSV
  delimiter?: string;                // CSV delimiter
};

type FieldSpec = {
  type: 'uuid' | 'name' | 'email' | 'sentence' | 'paragraph' | 'int' | 'float' | 'bool' | 'category' | 'date';
  min?: number;
  max?: number;
  decimals?: number;
  values?: string[];
  start?: string;
  end?: string;
  iso?: boolean;
};
```

---

## Example Output

```bash
{"id":"87d1a0b1-f0a9-4e6e-8d57-12dca0d8f43b","name":"Liam Brown","email":"liam.brown@example.com","prompt":"Lorem ipsum dolor sit amet consectetur adipiscing elit.","target":"positive","score":0.913,"created":"2025-03-15T12:34:56.000Z"}
{"id":"aa32e97e-45cb-4b16-a124-cc85f113dfb9","name":"Emma Wilson","email":"emma.wilson@example.com","prompt":"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","target":"neutral","score":0.227,"created":"2024-11-10T09:44:23.000Z"}
```


## 🧪 Browser test

Open `dataset-test.html` in your browser  
or try the hosted demo 👉🏻 
[Generate Dataset Test](https://yvancg.github.io/generators/generate-dataset/dataset-test.html)

---

## 🛠 Development

This module is standalone. Copy `dataset.js` into your project.  
No `npm install` or build step required.

Run quick test in Node:
```bash
node --input-type=module -e "import('./dataset.js').then(m=>console.log(m.generateDataset({count:3,format:'jsonl',seed:'demo'})))"
```

---

## 🔒 Notes

• Deterministic when seed is supplied
• Uses crypto.getRandomValues where available
• Ideal for model training data, mock APIs, or reproducible datasets
  
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

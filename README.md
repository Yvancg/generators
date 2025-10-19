# Generators

A collection of minimal, dependency-free generators for developers, testers, and AI builders.

## Overview

**Generators** provides fast, auditable modules for creating random or structured content — passwords, fake data, prompts, datasets, colors, and more — without large dependencies or opaque APIs. Each module is designed for portability, reproducibility, and simplicity.

Available modules:

- **generate-password** — Credit card validator with Luhn check and brand detection (Visa, Mastercard, Amex, etc.).  
  [![password gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/password.js.json)](./metrics/password.js.json)
  [![password ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/password.json)](./bench/password.json)

All helpers are designed for use in:
- Browsers (ESM)
- Node.js / Deno / Bun (import)
- Edge runtimes (Cloudflare Workers, Vercel Edge, etc.)

Each module has its own `README.md`, tests, and can be imported individually.

## 🔗 Live Demos (GitHub Pages)

You can try each generator interactively in your browser:

- [Generate Fake Data Test](https://yvancg.github.io/generators/generate-password/password-test.html)

Each page loads its respective module and allows interactive validation.

## Install

`npm i @yvancg/generators`  # or per-module packages when published

## API Guarantees

- No eval or dynamic code.
- Regexes fuzz-tested for catastrophic backtracking.

## Design Principles

1. **Deterministic randomness**: Supports fixed seeds for reproducibility.
2. **Zero dependencies**: Small and secure.
3. **Cross-runtime**: Runs anywhere ESM works.
4. **Predictable output**: Always valid and formatted.
5. **Composable**: Each generator is a pure function.

## Example Usage

```js
import { validateCard } from './is-card-safe/card.js';

console.log(isVatSafe('DE123456789'));                      // { ok: true, country: 'DE', ... }
```

## Folder Structure

```
generators/
  ├─ .github/
  │   └─ FUNDING.yml
  ├─ LICENSE
  ├─ README.md
  ├─ SECURITY.md
  ├─ generate-password/
  └─ generate-fake-data/
```

## Security Notes

- Uses `crypto.getRandomValues` or `crypto.randomBytes` for entropy.
- No external network requests.
- All JSON/YAML outputs sanitized.

## Contributing

Pull requests for additional safe validators (e.g., IBAN, domain names, etc.) are welcome. Please maintain the following rules:

- Pure ESM or TypeScript modules
- No external dependencies
- 100% test coverage
- Keep logic under 150 lines per module

## License

Licensed under the **MIT License** — see [LICENSE](./LICENSE).

## Funding

If you find this project useful, please consider sponsoring its continued maintenance and security audits.

You can sponsor this project through:

- GitHub Sponsors: [https://github.com/sponsors/yvancg](https://github.com/sponsors/yvancg)
- Or any link listed in `.github/FUNDING.yml`

---

© 2025 Y Consulting LLC / Validators Project

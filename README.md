# Generators

A collection of minimal, dependency-free generators for developers, testers, and AI builders.

## Overview

**Generators** provides fast, auditable modules for creating random or structured content — passwords, fake data, prompts, datasets, colors, and more — without large dependencies or opaque APIs. Each module is designed for portability, reproducibility, and simplicity.

Available modules:

- **generate-avatar** — SVG avatar and placeholder generator with initials or geometric patterns  
  [![avatar gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/avatar.js.json)](./metrics/avatar.js.json)
  [![avatar ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/avatar.json)](./bench/avatar.json)

- **generate-card-number** — Valid Luhn-compliant card number generator with realistic expiry and CVC for testing.  
  [![card gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/card.js.json)](./metrics/card.js.json)
  [![card ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/card.json)](./bench/card.json)

- **generate-color** — Random or deterministic color palette generator (HEX, RGB, HSL)  
  [![color gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/color.js.json)](./metrics/color.js.json)
  [![color ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/color.json)](./bench/color.json)

- **generate-dataset** — Generate structured JSON, JSONL, or CSV datasets for model fine-tuning or testing.  
  [![dataset gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/dataset.js.json)](./metrics/dataset.js.json)
  [![dataset ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/dataset.json)](./bench/dataset.json)

- **generate-fake-data** — Seedable, dependency-free fake data generator.  
  [![fake gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/fake.js.json)](../metrics/fake.js.json)
  [![fake ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/fake-data.json)](../bench/fake-data.json)

- **generate-hash** — Cryptographic and legacy hash generator (SHA-256, MD5) for text inputs.  
  [![hash gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/hash.js.json)](./metrics/hash.js.json)
  [![hash ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/hash.json)](./bench/hash.json)

- **generate-lorem** — Deterministic Lorem Ipsum text generator for placeholders, tests, and AI datasets.  
[![lorem gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/lorem.js.json)](../metrics/lorem.js.json)
[![lorem ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/lorem.json)](../bench/lorem.json)

- **generate-password** — Cryptographically secure password generation (or seeded, non-secure test fixtures).  
  [![password gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/password.js.json)](./metrics/password.js.json)
  [![password ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/password.json)](./bench/password.json)

- **generate-phone-number** — US phone number generator with state filtering, city filtering, and bulk generation.  
  [![phone gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/phone.js.json)](../metrics/phone.js.json)
[![phone ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/phone.json)](../bench/phone.json)

- **generate-prompt** — Template-based AI prompt generator for text, code, and image models.  
  [![prompt gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/prompt.js.json)](./metrics/prompt.js.json)
  [![prompt ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/prompt.json)](./bench/prompt.json)

- **generate-ssn** — Synthetic US Social Security number generator for fixtures and test data only.  
  [![ssn gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/ssn.js.json)](./metrics/ssn.js.json)
  [![ssn ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/ssn.json)](./bench/ssn.json)

- **generate-token** — Cryptographically secure token and UUID generator for authentication, API keys, and identifiers.  
  [![token gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/metrics/token.js.json)](../metrics/token.js.json)
  [![token ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/generators/main/bench/token.json)](../bench/token.json)

All helpers are designed for use in:
- Browsers (ESM)
- Node.js / Deno / Bun (import)
- Edge runtimes (Cloudflare Workers, Vercel Edge, etc.)

Modules can be imported independently. Browser demos and a dependency-free Node regression suite are included.

## 🔗 Live Demos (GitHub Pages)

You can try each generator interactively in your browser:

- [Generate Avatar Test](https://yvancg.github.io/generators/generate-avatar/avatar-test.html)
- [Generate Card Number Test](https://yvancg.github.io/generators/generate-card-number/card-test.html)
- [Generate Color Test](https://yvancg.github.io/generators/generate-color/color-test.html)
- [Generate Dataset Test](https://yvancg.github.io/generators/generate-dataset/dataset-test.html)
- [Generate Fake Data Test](https://yvancg.github.io/generators/generate-fake-data/fake-test.html)
- [Generate Hash Test](https://yvancg.github.io/generators/generate-hash/hash-test.html)
- [Generate Lorem Ipsum Test](https://yvancg.github.io/generators/generate-lorem/lorem-test.html)
- [Generate Password Test](https://yvancg.github.io/generators/generate-password/password-test.html)
- [Generate Phone Number Test](https://yvancg.github.io/generators/generate-phone-number/phone-test.html)
- [Generate Prompt Test](https://yvancg.github.io/generators/generate-prompt/prompt-test.html)
- [Generate SSN Test](https://yvancg.github.io/generators/generate-ssn/ssn-test.html)
- [Generate Token Test](https://yvancg.github.io/generators/generate-token/token-test.html)

Each page loads its respective module and allows interactive validation.

## Use
Import individual ESM modules directly; no build step or dependency installation is required.

To run the regression tests with Node.js 22+:

~~~bash
node --experimental-default-type=module --test tests/*.test.mjs
~~~

## Security and compatibility
- `generatePassword()` and `generateToken()` **require `crypto.getRandomValues` without a seed** and throw when secure randomness is unavailable. Run only in environments with Web Crypto.
- `seed` produces **predictable test data**. Never use seeded passwords or tokens as real credentials or secrets.
- Password and token lengths must be integers from 1 to 4096 (UUID ignores `length`); disable-all-charsets is invalid for passwords.
- `generateHash()` supports `sha-256` and `md5`. MD5 is legacy and unsuitable for password storage or security-sensitive integrity.
- `generatePalette()` rejects out-of-range RGB/HSL values. Fake contact details and card numbers are for tests only.

## Design Principles

1. **Deterministic randomness**: Supports fixed seeds for reproducibility.
2. **Zero dependencies**: Small and secure.
3. **Cross-runtime**: Runs anywhere ESM works.
4. **Predictable output**: Always valid and formatted.
5. **Composable**: Each generator is a pure function.

## Example usage
~~~js
import { generatePassword } from './generate-password/password.js';
import { generateToken } from './generate-token/token.js';
import { generatePalette } from './generate-color/color.js';
import { generateHash } from './generate-hash/hash.js';
import { generatePhoneNumbers } from './generate-phone-number/phone.js';
import { generateCard } from './generate-card-number/card.js';
import { rows, rng } from './generate-fake-data/fake.js';

console.log(generatePassword({ length: 20 }));          // secure random password
console.log(generateToken({ type: 'hex', length: 32 })); // secure random token
console.log(generateToken({ type: 'uuid', seed: 'test' })); // predictable fixture only
console.log(generatePalette({ base: '#3366ff', count: 3 }).colors);
console.log(await generateHash('hello', 'sha-256'));
console.log(generatePhoneNumbers({ state: 'CA', count: 2, seed: 'test' }));
console.log(generateCard({ brand: 'visa', seed: 'test' })); // simulated test card
console.log(rows(2, 'test'));
~~~

## Folder Structure

```
generators/
  ├─ .github/
  │   ├─ workflows/
  │   └─ FUNDING.yml
  ├─ LICENSE
  ├─ README.md
  ├─ SECURITY.md
  ├─ package.json
  ├─ scripts/
  │   └─ bench.mjs
  ├─ generate-avatar/
  ├─ generate-card-number/
  ├─ generate-color/
  ├─ generate-fake-data/
  ├─ generate-hash/
  ├─ generate-lorem/
  ├─ generate-password/
  ├─ generate-phone-number/
  ├─ generate-prompt/
  ├─ generate-ssn/
  └─ generate-token/
```

## Security Notes

- Credential generators require Web Crypto for unseeded randomness.
- No external network requests.
- Deterministic seeds and simulated identifiers are for test fixtures, not production credentials.

## Contributing

Pull requests for small, standalone generators are welcome. Please maintain the following rules:

- Pure ESM or TypeScript modules
- No external dependencies
- Regression tests for changed behavior
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

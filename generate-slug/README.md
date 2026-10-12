# generate-slug

A small, dependency-free Unicode-aware slug generator for titles and URL path segments.

## Usage

~~~js
import { generateSlug } from './slug.js';

generateSlug('Hello World! 2026'); // 'hello-world-2026'
generateSlug('Café déjà vu'); // 'cafe-deja-vu'
generateSlug('你好 世界'); // '你好-世界'
generateSlug('Hello World', { maxLength: 6 }); // 'hello'
~~~

Normalizes Unicode with NFKD, removes Latin accent marks, preserves other scripts' combining marks, lowercases, and joins runs of punctuation/whitespace with hyphens. Retains non-Latin letters and combining marks instead of discarding them.

maxLength is an optional positive integer limiting Unicode code points (not bytes); a trailing hyphen is removed after truncation. Returns an empty string if no letters/numbers remain. Throws on non-string input or invalid maxLength.

For inclusion in a URL, encode the result as a path segment using encodeURIComponent() when necessary. Slugs are not guaranteed unique, do not transliterate every script to ASCII, and are not a URL security sanitizer.

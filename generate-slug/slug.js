/**
 * Create a Unicode-aware, URL-path-friendly slug without dependencies.
 * Letters and numbers are retained; separators collapse to '-'.
 */
export function generateSlug(text, { maxLength = null } = {}) {
  if (typeof text !== 'string') throw new TypeError('text must be a string');
  if (maxLength !== null && (!Number.isInteger(maxLength) || maxLength < 1)) {
    throw new RangeError('maxLength must be a positive integer');
  }

  let slug = text.normalize('NFKD')
    // Fold Latin accents, but keep marks essential to other scripts.
    .replace(/(\p{Script=Latin})\p{M}+/gu, '$1')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  if (maxLength !== null) slug = Array.from(slug).slice(0, maxLength).join('').replace(/-+$/g, '');
  return slug;
}

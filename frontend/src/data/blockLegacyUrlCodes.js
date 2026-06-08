/** @typedef {Record<string, string>} LegacyBlockMap */

/** Old indexed block path segment → canonical `block-*` slug (keep in sync with backend `legacy_block_redirect_data.py`). */
export const LEGACY_BLOCK_SHORT_TO_SLUG = /** @type {LegacyBlockMap} */ ({
  A: 'block-a',
  B: 'block-b',
  C: 'block-c',
  D: 'block-d',
  E: 'block-e',
  F: 'block-f',
  G: 'block-g',
  H: 'block-h',
  I: 'block-i',
  J: 'block-j',
  K: 'block-k',
  L: 'block-l',
  M: 'block-m',
  O: 'block-o',
  P: 'block-p',
  Q: 'block-q',
  R: 'block-r',
  S: 'block-s',
  T: 'block-t',
  V: 'block-v',
  AE: 'block-ae',
  P2: 'block-p2',
  'Ext.': 'block-ext',
  Ext: 'block-ext',
})

/** Categories that used legacy single-letter block segments in URLs. */
export const LEGACY_BLOCK_REDIRECT_CATEGORIES = new Set([
  'plots',
  'house',
  'farm-house',
  'flat',
  'commercial-plots',
  'office',
  'shop',
  'all',
])

/**
 * If `pathname` uses a legacy block segment, return the canonical path (with trailing slash).
 * @param {string} pathname
 * @returns {string | null}
 */
export function legacyBlockRedirectPath(pathname) {
  const trimmed = String(pathname || '').replace(/\/+$/, '')
  const parts = trimmed.split('/').filter(Boolean)
  if (parts.length < 3 || parts[0] !== 'properties') return null

  const category = parts[1]
  if (!LEGACY_BLOCK_REDIRECT_CATEGORIES.has(category)) return null

  const shortCode = parts[2]
  if (!shortCode || shortCode.startsWith('block-')) return null

  const blockSlug =
    LEGACY_BLOCK_SHORT_TO_SLUG[shortCode] ??
    LEGACY_BLOCK_SHORT_TO_SLUG[shortCode.toUpperCase()] ??
    LEGACY_BLOCK_SHORT_TO_SLUG[shortCode.replace(/\.$/, '')]

  if (!blockSlug || blockSlug === shortCode) return null

  const tail = parts.slice(3)
  const segments = ['properties', category, blockSlug, ...tail]
  return `/${segments.join('/')}/`
}

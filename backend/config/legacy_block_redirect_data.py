"""
Legacy property URL path segments (single-letter / shorthand block codes) → canonical `block-*` slugs.

Indexed examples: /properties/farm-house/A/listing-slug → /properties/farm-house/block-a/listing-slug/
Mirrored in `frontend/src/data/blockLegacyUrlCodes.js` and `deploy/nginx-legacy-block-redirects.conf`.
"""

PROPERTY_CATEGORY_SLUGS = frozenset(
    {
        'all',
        'plots',
        'house',
        'farm-house',
        'flat',
        'commercial-plots',
        'office',
        'shop',
    }
)

# Short code as it appeared in old URLs → new block slug segment (without leading slash).
LEGACY_BLOCK_SHORT_TO_SLUG: dict[str, str] = {
    'A': 'block-a',
    'B': 'block-b',
    'C': 'block-c',
    'D': 'block-d',
    'E': 'block-e',
    'F': 'block-f',
    'G': 'block-g',
    'H': 'block-h',
    'I': 'block-i',
    'J': 'block-j',
    'K': 'block-k',
    'L': 'block-l',
    'M': 'block-m',
    'O': 'block-o',
    'P': 'block-p',
    'Q': 'block-q',
    'R': 'block-r',
    'S': 'block-s',
    'T': 'block-t',
    'V': 'block-v',
    'AE': 'block-ae',
    'P2': 'block-p2',
    'Ext.': 'block-ext',
    'Ext': 'block-ext',
}

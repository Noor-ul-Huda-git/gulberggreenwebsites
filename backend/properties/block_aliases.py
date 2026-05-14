"""
Map canonical block labels (from the SPA PROPERTY_BLOCK_OPTIONS) to legacy shorthand
stored in SQLite/admin (e.g. "Block B" ↔ "B", "Block A Executive" ↔ "AE").

The list/detail pages still match URLs via Property.block_slug; only the listing filter needed OR expansion.
"""

from django.db.models import Q

# Keys must match frontend `PROPERTY_BLOCK_OPTIONS` entries exactly (case-sensitive).
BLOCK_FILTER_ALIASES = {
    'Block Executive': ('Executive Block (Greens)',),
    'Block A': ('A', 'A (Greens)', 'AA'),
    'Block A Executive': ('AE', 'A-Executive'),
    'Block A Executive 2': (),
    'Block A Executive premium': (),
    'Block B': ('B', 'B (Greens)'),
    'Block C': ('C', 'C (Greens)'),
    'Block D': ('D', 'D (Greens)'),
    'D Markaz': (),
    'Block E': ('E', 'E (Greens)'),
    'Block E Executive': ('E-Executive',),
    'Block F': ('F', 'F (Greens)'),
    'Block F Executive 1': ('F Executive 1', 'F1'),
    'Block F Executive 2': ('F Executive 2', 'F2'),
    'Block F Executive 3': ('F Executive 3', 'F3'),
    'Block F Executive 4': ('F Executive 4', 'F4'),
    'Block G': ('G', 'G (Greens)'),
    'Block H': ('H', 'H (Greens)'),
    'Block I': ('I', 'I (Greens)'),
    'Block J': ('J',),
    'Block K': ('K',),
    'Block L': ('L',),
    'Block M': ('M',),
    'Block O': ('O',),
    # DB currently uses bare "P" for some plots; historically also P-1 / P1.
    'Block P1': ('P', 'P-1', 'P1'),
    'Block P2': ('P2', 'P-2'),
    'Block P3': ('P3', 'P-3'),
    'Block P4': ('P4', 'P-4'),
    'Block Q': ('Q',),
    'Block R': ('R',),
    'Block S': ('S',),
    'Block T': ('T',),
    'Block V': ('V',),
}


def block_match_q(canonical_filter: str) -> Q | None:
    raw = (canonical_filter or '').strip()
    if not raw:
        return None

    aliases = BLOCK_FILTER_ALIASES.get(raw, ())
    variants: list[str] = []
    seen: set[str] = set()

    def add(v: str) -> None:
        t = v.strip()
        if not t:
            return
        key = t.lower()
        if key not in seen:
            seen.add(key)
            variants.append(t)

    add(raw)
    for a in aliases:
        add(str(a))

    q = Q(block__iexact=variants[0])
    for v in variants[1:]:
        q |= Q(block__iexact=v)
    return q

/** Matches backend `properties.Property.ListingType` */
export const LISTING_TYPE_OPTIONS = [
  { value: '', label: 'All listing types' },
  { value: 'plots', label: 'Plots' },
  { value: 'commercial_plots', label: 'Commercial Plots' },
  { value: 'farmhouse', label: 'Farmhouse' },
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat' },
  { value: 'office', label: 'Office' },
  { value: 'shop', label: 'Shop' },
]

/** Block labels must match `Property.block` in admin for API filters (`block__iexact`). */
export const PROPERTY_BLOCK_OPTIONS = [
  'Executive Block (Greens)',
  'A (Greens)',
  'B (Greens)',
  'C (Greens)',
  'D (Greens)',
  'E (Greens)',
  'AA',
  'A',
  'A-Executive',
  'B',
  'C',
  'D',
  'E',
  'E-Executive',
  'F',
  'F-Executive',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P-1',
  'P-2',
  'P-3',
  'P-4',
  'Q',
  'R',
  'S',
  'T',
  'V',
]

export const PROPERTY_CATEGORY_SEO = {
  plots: {
    listingType: 'plots',
    breadcrumb: 'Plots',
    metaTitle: 'Plots for Sale in Gulberg Greens Islamabad | IBECHS',
    metaDescription:
      'Explore residential plots for sale in Gulberg Greens Islamabad. Available in 5 Marla, 7 Marla, 10 Marla, 1 Kanal and 2 Kanal. Secure gated community by IBECHS.',
    h1: 'Plots for Sale in Gulberg Greens Islamabad',
    canonical: 'https://gulberggreens.com.pk/properties/plots/',
  },
  flat: {
    listingType: 'flat',
    breadcrumb: 'Flats',
    metaTitle: 'Flats for Sale & Rent in Gulberg Greens Islamabad',
    metaDescription:
      'Find modern studio, 1 bedroom, 2 bedroom and 3 bedroom flats for sale and rent in Gulberg Greens Islamabad. Quality construction, secure living and all essential amenities.',
    h1: 'Flats for Sale and Rent in Gulberg Greens Islamabad',
    canonical: 'https://gulberggreens.com.pk/properties/flat/',
  },
  'commercial-plots': {
    listingType: 'commercial_plots',
    breadcrumb: 'Commercial Plots',
    metaTitle: 'Commercial Plots for Sale in Gulberg Greens Islamabad',
    metaDescription:
      'Invest in commercial plots in Gulberg Greens Islamabad. Prime business location on Islamabad Expressway with strong growth potential and high long-term returns.',
    h1: 'Commercial Plots for Sale in Gulberg Greens Islamabad',
    canonical: 'https://gulberggreens.com.pk/properties/commercial-plots/',
  },
  'farm-house': {
    listingType: 'farmhouse',
    breadcrumb: 'Farmhouses',
    metaTitle: 'Farmhouses for Sale in Gulberg Greens Islamabad | Luxury',
    metaDescription:
      'Discover luxury farmhouses for sale in Gulberg Greens Islamabad. Spacious land, lush greenery and peaceful lifestyle available in 4 Kanal, 5 Kanal and 10 Kanal options.',
    h1: 'Luxury Farmhouses for Sale in Gulberg Greens Islamabad',
    canonical: 'https://gulberggreens.com.pk/properties/farm-house/',
  },
  office: {
    listingType: 'office',
    breadcrumb: 'Office',
    metaTitle: 'Office Space for Sale & Rent in Gulberg Greens Islamabad',
    metaDescription:
      'Explore office spaces for sale and rent in Gulberg Greens Islamabad. Ideal for startups and businesses in a secure, well-connected commercial environment on Islamabad Expressway.',
    h1: 'Office Space for Sale and Rent in Gulberg Greens Islamabad',
    canonical: 'https://gulberggreens.com.pk/properties/office/',
  },
  shop: {
    listingType: 'shop',
    breadcrumb: 'Shops',
    metaTitle: 'Shops for Sale in Gulberg Greens Islamabad | Retail Units',
    metaDescription:
      'Buy shops in Gulberg Greens Islamabad at prime locations with high foot traffic. Perfect for retail business and long-term investment in a secure gated community.',
    h1: 'Shops for Sale in Gulberg Greens Islamabad',
    canonical: 'https://gulberggreens.com.pk/properties/shop/',
  },
  house: {
    listingType: 'house',
    breadcrumb: 'Houses',
    metaTitle: 'Houses for Sale in Gulberg Greens Islamabad',
    metaDescription:
      'Find luxury houses for sale in Gulberg Greens Islamabad. Modern design, secure gated community and comfortable family living. Available in 5 Marla, 7 Marla, 10 Marla and 1 Kanal.',
    h1: 'Houses for Sale in Gulberg Greens Islamabad',
    canonical: 'https://gulberggreens.com.pk/properties/house/',
  },
}

export const PROPERTY_LISTING_TYPE_SLUGS = Object.fromEntries(
  Object.entries(PROPERTY_CATEGORY_SEO).map(([slug, config]) => [config.listingType, slug]),
)

export const PROPERTY_TYPE_LABELS = {
  plots: 'Plots',
  flat: 'Flats',
  house: 'Houses',
  farmhouse: 'Farmhouses',
  commercial_plots: 'Commercial Plots',
  office: 'Office Spaces',
  shop: 'Shops',
}

export const PROPERTY_TYPE_DESCRIPTIONS = {
  plots: 'residential plots',
  flat: 'modern flats and apartments',
  house: 'luxury houses',
  farmhouse: 'luxury farmhouses',
  commercial_plots: 'commercial plots',
  office: 'office spaces',
  shop: 'shops and retail units',
}

export function slugifyPropertyBlock(block) {
  const normalized = String(block || '')
    .trim()
    .replace(/\(([^)]+)\)/g, ' $1')
    .replace(/^block\s+/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return normalized ? `block-${normalized}` : ''
}

export function formatPropertyBlockLabel(block) {
  const clean = String(block || '').trim().replace(/\s+/g, ' ')
  if (!clean) return ''
  if (/^block\s/i.test(clean) || /^executive\s+block/i.test(clean)) return clean
  return `Block ${clean}`
}

export function propertyBlockFromSlug(blockSlug) {
  const normalized = String(blockSlug || '').replace(/\/+$/g, '')
  return PROPERTY_BLOCK_OPTIONS.find((block) => slugifyPropertyBlock(block) === normalized) || ''
}

export function isPropertyBlockSlug(value) {
  return Boolean(propertyBlockFromSlug(value))
}

export function propertyBlockPath(categorySlug, block) {
  const blockSlug = slugifyPropertyBlock(block)
  return categorySlug && blockSlug ? `/properties/${categorySlug}/${blockSlug}` : '/properties'
}

export function propertyBlockSeo(categorySlug, block) {
  const category = PROPERTY_CATEGORY_SEO[categorySlug]
  if (!category || !block) return null

  const blockLabel = formatPropertyBlockLabel(block)
  const typeLabel = PROPERTY_TYPE_LABELS[category.listingType] || category.breadcrumb
  const typeDescription = PROPERTY_TYPE_DESCRIPTIONS[category.listingType] || category.breadcrumb.toLowerCase()
  const route = `${propertyBlockPath(categorySlug, block)}/`

  return {
    listingType: category.listingType,
    breadcrumb: blockLabel,
    block,
    blockSlug: slugifyPropertyBlock(block),
    metaTitle: `${typeLabel} for Sale in ${blockLabel} | Gulberg Greens Islamabad`,
    metaDescription: `Explore ${typeDescription} for sale in ${blockLabel}, Gulberg Greens Islamabad. Secure gated community by IBECHS. Browse available listings and contact us today.`,
    h1: `${typeLabel} for Sale in ${blockLabel}, Gulberg Greens Islamabad`,
    canonical: `https://gulberggreens.com.pk${route}`,
  }
}

export function propertyDetailPath(property) {
  const categorySlug = PROPERTY_LISTING_TYPE_SLUGS[property?.listing_type]
  if (categorySlug && property?.slug) return `/properties/${categorySlug}/${property.slug}`
  return property?.slug ? `/properties/${property.slug}` : '/properties'
}

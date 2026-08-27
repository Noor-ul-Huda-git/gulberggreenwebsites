import { contactInfo, homeFaqItems } from '../src/data/siteContent.js'

export const SITE_ORIGIN = 'https://gulberggreens.com.pk'

const API_HOST = process.env.SEO_API_HOST || 'gulberggreens.com.pk'
const API_BASE = (process.env.SEO_API_BASE_URL || `${SITE_ORIGIN}/api`).replace(/\/+$/, '')

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function jsonLdScript(data) {
  const json = JSON.stringify(data, null, 2)
    .split('\n')
    .map((line) => `      ${line}`)
    .join('\n')
  return `    <script type="application/ld+json">\n${json}\n    </script>`
}

export function injectSeo(html, seo, { jsonLd = [] } = {}) {
  const title = `<title>${escapeHtml(seo.metaTitle)}</title>`
  const description = `<meta name="description" content="${escapeHtml(seo.metaDescription)}" />`
  const canonical = `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`
  const robots = '<meta name="robots" content="index, follow" />'

  let next = html
    .replace(/<title>[\s\S]*?<\/title>/i, title)
    .replace(/\s*<meta\s+name=["']description["'][^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+name=["']robots["'][^>]*>\s*/gi, '\n')
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, '\n')
    .replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n')

  next = next.replace(
    /(<meta\s+name=["']viewport["'][^>]*>\s*)/i,
    `$1\n    ${description}\n    ${canonical}\n    ${robots}\n    `,
  )

  if (jsonLd.length) {
    const blocks = jsonLd.map(jsonLdScript).join('\n')
    next = next.replace('</head>', `${blocks}\n  </head>`)
  }

  return next
}

export function routeDir(distRoot, route) {
  const clean = route.replace(/^\/|\/$/g, '')
  return clean ? `${distRoot}/${clean}` : distRoot
}

async function apiFetch(url) {
  const headers = { Accept: 'application/json' }
  if (/127\.0\.0\.1|localhost/.test(API_BASE)) {
    headers.Host = API_HOST
  }
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`API ${url} returned ${response.status}`)
  }
  return response.json()
}

export async function fetchAllFromApi(resourcePath) {
  const results = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const data = await apiFetch(`${API_BASE}${resourcePath}?page=${page}`)
    if (Array.isArray(data)) {
      results.push(...data)
      break
    }
    if (!Array.isArray(data.results)) {
      throw new Error(`Unexpected API shape for ${resourcePath}`)
    }
    results.push(...data.results)
    hasMore = Boolean(data.next)
    page += 1
  }

  return results
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function trailingSlugNumber(slug) {
  const clean = String(slug || '').trim()
  if (!clean) return ''
  const match = clean.match(/(\d+)\s*$/)
  return match ? match[1] : ''
}

function formatMarlasValue(value) {
  if (value == null || value === '') return ''
  const num = Number(value)
  if (!Number.isNaN(num) && Number.isInteger(num)) return String(num)
  return String(value).replace(/\.0+$/, '')
}

function formatArea(property) {
  if (!property || property.area_marlas == null || property.area_marlas === '') return '-'
  const unit = property.area_unit_display || 'Marla'
  const marlas = formatMarlasValue(property.area_marlas)
  const plural = Number(marlas) === 1 || unit.endsWith('s') ? '' : 's'
  return `${marlas} ${unit}${plural}`
}

function formatBlockLabel(block, location) {
  if (block != null && String(block).trim() !== '') {
    const text = String(block).trim()
    if (/^block\s/i.test(text)) return text
    return `Block ${text}`
  }
  if (location != null && String(location).trim() !== '') {
    const first = String(location).split(',')[0].trim()
    return first || '-'
  }
  return '-'
}

function formatPkr(value) {
  if (value == null || value === '') return ''
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)

  const abs = Math.abs(n)
  const units = [
    { value: 10000000, label: 'Crore' },
    { value: 100000, label: 'Lac' },
    { value: 1000, label: 'Thousand' },
  ]

  for (const unit of units) {
    if (abs >= unit.value) {
      const compact = (n / unit.value).toFixed(2).replace(/\.?0+$/, '')
      return `PKR ${compact} ${unit.label}`
    }
  }

  return `PKR ${n.toLocaleString('en-PK')}`
}

function propertyImage(property) {
  if (property.featured_image_url) return property.featured_image_url
  if (Array.isArray(property.images) && property.images[0]?.url) return property.images[0].url
  return undefined
}

export function propertyPageSeo(property) {
  const blockLabel = formatBlockLabel(property.block, property.location)
  const sizeLabel = formatArea(property)
  const priceLabel = property.price != null && property.price !== '' ? formatPkr(property.price) : ''
  const serialNumber = trailingSlugNumber(property.slug)
  const titleParts = [
    serialNumber ? `${property.title || 'Property'} (${serialNumber})` : property.title || 'Property',
    blockLabel,
    sizeLabel,
    priceLabel,
  ].filter((value) => value && value !== '-')

  const descriptionSource =
    stripHtml(property.description) ||
    stripHtml(property.short_description) ||
    stripHtml(property.meta_description) ||
    `${property.title} in ${property.location || property.block || 'Gulberg Greens Islamabad'}.`

  return {
    metaTitle: `${titleParts.join(', ')} | Gulberg Greens Islamabad`,
    metaDescription: descriptionSource.slice(0, 130).trim(),
    canonical: property.canonical_url,
  }
}

export function newsPageSeo(post) {
  const excerpt = post.excerpt || stripHtml(post.description)
  const description =
    excerpt && excerpt.trim()
      ? excerpt.trim().slice(0, 130)
      : 'Latest news and updates from Gulberg Greens Islamabad.'

  return {
    metaTitle: post.title,
    metaDescription: description,
    canonical: `${SITE_ORIGIN}/latest-updates/${post.slug}/`,
  }
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gulberg Greens Islamabad',
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/logo-112x112.png`,
  }
}

export function buildHomeSchemas() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gulberg Greens Islamabad',
    alternateName: ['IBECHS', 'Gulberg Islamabad', 'Gulberg Greens IBECHS'],
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/logo-112x112.png`,
    description:
      "Gulberg Greens Islamabad is Pakistan's most trusted CDA-approved gated community developed by IBECHS since 2005.",
    foundingDate: '2005',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'HM Tower, 5th Floor, Office No. 402, Gulberg Greens',
      addressLocality: 'Islamabad',
      addressCountry: 'PK',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-331-000-0060',
      contactType: 'sales',
      email: contactInfo.email,
    },
    sameAs: [
      'https://www.youtube.com/@gulberggreens_ibechs',
      'https://www.instagram.com/gulberggreens.ibechs/?hl=en',
      'https://www.tiktok.com/@gulberggreens.ibechs',
      'https://x.com/gulberg_ibechs',
    ],
  }

  const realEstateAgentSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Gulberg Greens Islamabad — Official IBECHS Sales Office',
    url: SITE_ORIGIN,
    telephone: '+92-331-000-0060',
    email: contactInfo.email,
    priceRange: 'PKR 1.2 Crore — 50 Crore',
    description:
      'Official sales platform of Gulberg Greens Islamabad. CDA approved gated community by IBECHS. Residential plots, farmhouses, houses, flats and commercial properties.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'HM Tower, 5th Floor, Office No. 402',
      addressLocality: 'Islamabad',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.6265',
      longitude: '72.9936',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    hasMap: `${SITE_ORIGIN}/gulberg-map/`,
  }

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gulberg Greens Islamabad',
    url: SITE_ORIGIN,
    description:
      'Official website of Gulberg Greens Islamabad. IBECHS CDA approved gated community. Browse plots, farmhouses, houses and flats for sale.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_ORIGIN}/properties/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.paragraphs.join(' '),
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Gulberg Greens Islamabad',
        item: `${SITE_ORIGIN}/`,
      },
    ],
  }

  return [organizationSchema, realEstateAgentSchema, webSiteSchema, faqPageSchema, breadcrumbSchema]
}

export function buildPropertySchema(property, canonical) {
  const image = propertyImage(property)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.meta_title || property.title,
    description: property.meta_description || property.short_description || property.title,
    url: canonical,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${property.block || 'Gulberg Greens'}, Gulberg Greens`,
      addressLocality: 'Islamabad',
      addressCountry: 'PK',
    },
    offers: {
      '@type': 'Offer',
      price: property.price || undefined,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    },
  }

  if (image) schema.image = image
  return schema
}

export function buildNewsArticleSchema(post, canonical) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt || stripHtml(post.description),
    url: canonical,
    datePublished: post.published_at,
    author: {
      '@type': 'Person',
      name: post.author_name || 'Gulberg Greens Islamabad',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gulberg Greens Islamabad',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/logo-112x112.png`,
      },
    },
  }

  if (post.primary_image) schema.image = post.primary_image
  return schema
}

import { contactInfo, homeFaqItems } from '../../data/siteContent.js'
import { propertyDetailPath } from '../../data/propertyListingTypes.js'

/*
 * Homepage schema (JSON-LD)
 * One <script> with a single @graph:
 * RealEstateAgent + LocalBusiness, WebSite, WebPage, BreadcrumbList, FAQPage
 */

const SITE = 'https://gulberggreens.com.pk'
const HOME = `${SITE}/`

const AGENT_ID = `${SITE}/#agent`
const WEBSITE_ID = `${SITE}/#website`

// Must match metadata.title in src/app/page.js exactly
const HOME_PAGE_TITLE = 'Gulberg Greens Islamabad — Official IBECHS Gated Community'

const siteConfig = {
  name: 'Gulberg Greens Islamabad',
  agentName: 'Gulberg Greens Islamabad - Sales Office',
  description:
    'Gulberg Greens Islamabad is a CDA-approved gated community developed by Intelligence Bureau ' +
    'Employees Cooperative Housing Society (IBECHS) on Gulberg Expressway, Islamabad.',
  logo: `${SITE}/logo-112x112.png`,
  image: `${SITE}/images/gulberg-greens-islamabad-official-ibechs-gated-community.webp`,
  telephone: '+92-331-000-0060', // same as GBP
  email: contactInfo?.email || 'info@gulberggreens.com.pk',
  address: {
    streetAddress: 'Gulberg Expy, Gulberg Greens Block B', // same as GBP
    addressLocality: 'Islamabad',
    postalCode: '44000',
    addressCountry: 'PK',
  },
  geo: { latitude: 33.6028641, longitude: 73.1596398 }, // GBP pin
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  gbp: {
    mapsUrl: 'https://www.google.com/maps?cid=7900486113179915900',
    name: 'Gulberg Greens Islamabad', // exact GBP name
  },
  hasMap: 'https://www.google.com/maps?cid=7900486113179915900',
  /*
   * GBP rating (4.6, 227 reviews).
   * Keep null until the same rating is also shown on the homepage.
   * When it is shown, change to: { value: 4.6, count: 227 }
   */
  rating: { value: null, count: null },
  sameAs: [
    'https://www.facebook.com/gulberggreens.ibechs/',
    'https://www.instagram.com/gulberggreens.ibechs/',
    'https://www.youtube.com/@gulberggreens_ibechs',
    'https://www.tiktok.com/@gulberggreens.ibechs',
    'https://www.pinterest.com/gulberggreensibechs/',
    'https://x.com/gulberg_ibechs',
    'https://www.threads.com/@gulberggreens.ibechs',
    'https://www.quora.com/profile/Gulberg-Greens-Islamabad-4',
  ],
  propertyPages: [
    { name: 'Properties', url: `${SITE}/properties/` },
    { name: 'Plots for Sale', url: `${SITE}/properties/plots/` },
    { name: 'Commercial Plots for Sale', url: `${SITE}/properties/commercial-plots/` },
    { name: 'Farmhouses for Sale', url: `${SITE}/properties/farm-house/` },
    { name: 'Houses for Sale', url: `${SITE}/properties/house/` },
    { name: 'Flats for Sale', url: `${SITE}/properties/flat/` },
    { name: 'Shops for Sale', url: `${SITE}/properties/shop/` },
    { name: 'Offices for Sale', url: `${SITE}/properties/office/` },
  ],
}

function absoluteUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return `${SITE}${withSlash.startsWith('/') ? '' : '/'}${withSlash}`
}

// Accepts the same listings shown on the homepage cards
function toSchemaListings(listings) {
  if (!Array.isArray(listings)) return []

  return listings
    .map((p) => ({
      title: p?.title || '',
      url: p?.url ? absoluteUrl(p.url) : absoluteUrl(propertyDetailPath(p)),
    }))
    .filter((l) => l.title && l.url)
}

function buildHomepageSchema(listings = []) {
  const s = siteConfig
  const items = toSchemaListings(listings)
  const hasRating = Boolean(s.rating.value && s.rating.count)

  const agent = {
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    '@id': AGENT_ID,
    name: s.agentName,
    url: HOME,
    description: s.description,
    logo: { '@type': 'ImageObject', url: s.logo },
    image: s.image,
    telephone: s.telephone,
    email: s.email,
    address: { '@type': 'PostalAddress', ...s.address },
    geo: { '@type': 'GeoCoordinates', ...s.geo },
    areaServed: { '@type': 'City', name: 'Islamabad' },
    ...(s.openingHours.length
      ? {
          openingHoursSpecification: s.openingHours.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    sameAs: [...s.sameAs, ...(s.gbp.mapsUrl ? [s.gbp.mapsUrl] : [])],
    ...(s.hasMap ? { hasMap: s.hasMap } : {}),
    ...(s.gbp.name && s.gbp.name !== s.agentName ? { alternateName: s.gbp.name } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Properties in Gulberg Greens Islamabad',
      url: `${SITE}/properties/`,
      itemListElement: s.propertyPages
        .filter((x) => x.url !== `${SITE}/properties/`)
        .map((x) => ({ '@type': 'OfferCatalog', name: x.name, url: x.url })),
    },
    ...(hasRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: s.rating.value,
            reviewCount: s.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: HOME,
    name: s.name,
    publisher: { '@id': AGENT_ID },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/properties/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const webpage = {
    '@type': 'WebPage',
    '@id': `${HOME}#webpage`,
    url: HOME,
    name: HOME_PAGE_TITLE,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': AGENT_ID },
    breadcrumb: { '@id': `${HOME}#breadcrumb` },
    inLanguage: 'en',
    hasPart: [
      ...s.propertyPages.map((x) => ({ '@type': 'CollectionPage', name: x.name, url: x.url })),
      { '@type': 'CollectionPage', name: 'Latest Updates', url: `${SITE}/latest-updates/` },
      { '@type': 'WebPage', name: 'Gulberg Map', url: `${SITE}/gulberg-map/` },
    ],
    ...(items.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            name: 'Latest Properties in Gulberg Greens Islamabad',
            numberOfItems: items.length,
            itemListElement: items.map((l, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: l.url,
              name: l.title,
            })),
          },
        }
      : {}),
  }

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${HOME}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gulberg Greens Islamabad', item: HOME },
    ],
  }

  // Same FAQ array that the homepage FAQ section renders, so text always matches
  const faq = {
    '@type': 'FAQPage',
    '@id': `${HOME}#faq`,
    mainEntity: (homeFaqItems || []).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: (item.paragraphs || []).join(' '),
      },
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [agent, website, webpage, breadcrumb, faq],
  }
}

export default function HomePageSchema({ listings = [] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildHomepageSchema(listings)).replace(/</g, '\\u003c'),
      }}
    />
  )
}
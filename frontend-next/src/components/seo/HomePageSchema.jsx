import { contactInfo } from '../../data/siteContent.js'
import { homeFaqItems } from '../../data/siteContent.js'

const SITE = 'https://gulberggreens.com.pk'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gulberg Greens Islamabad',
  alternateName: ['IBECHS', 'Gulberg Islamabad', 'Gulberg Greens IBECHS'],
  url: SITE,
  logo: `${SITE}/logo-112x112.png`,
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
  url: SITE,
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
  hasMap: `${SITE}/gulberg-map/`,
}

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Gulberg Greens Islamabad',
  url: SITE,
  description:
    'Official website of Gulberg Greens Islamabad. IBECHS CDA approved gated community. Browse plots, farmhouses, houses and flats for sale.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE}/properties/?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

function faqPageSchema() {
  return {
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
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Gulberg Greens Islamabad',
      item: `${SITE}/`,
    },
  ],
}

function SchemaScript({ data }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

export default function HomePageSchema() {
  return (
    <>
      <SchemaScript data={organizationSchema} />
      <SchemaScript data={realEstateAgentSchema} />
      <SchemaScript data={webSiteSchema} />
      <SchemaScript data={faqPageSchema()} />
      <SchemaScript data={breadcrumbSchema} />
    </>
  )
}

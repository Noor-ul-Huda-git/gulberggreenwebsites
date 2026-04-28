import { propertyDetailPath } from '../../data/propertyListingTypes.js'

function propertyImage(property) {
  if (property.featured_image_url) return property.featured_image_url
  if (Array.isArray(property.images) && property.images[0]?.url) return property.images[0].url
  return undefined
}

function PropertySchema({ property }) {
  if (!property) return null

  const url = property.canonical_url || `https://gulberggreens.com.pk${propertyDetailPath(property).replace(/\/?$/, '/')}`
  const image = propertyImage(property)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.meta_title || property.title,
    description: property.meta_description || property.short_description || property.title,
    url,
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

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default PropertySchema

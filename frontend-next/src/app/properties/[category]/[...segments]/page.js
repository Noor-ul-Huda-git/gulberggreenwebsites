import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import PropertiesClient from '../../PropertiesClient'
import PropertyDetailClient from '../../../../components/properties/PropertyDetailClient.jsx'

import {
  PROPERTY_CATEGORY_SEO,
  propertyBlockFromSlug,
} from '../../../../data/propertyListingTypes.js'

import { fetchProperties, fetchProperty } from '../../../../lib/api.js'

function parsePropertyListResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

async function getSimilarProperties(property) {
  if (!property) {
    return {
      similarAround: [],
      similarByAgent: [],
    }
  }

  try {
    const listingType = property.listing_type
    const block = property.block?.trim()
    const agentPhone = property.agency_name?.trim()

    const aroundParams = {
      listing_type: listingType || undefined,
      block: block || undefined,
    }

    const [aroundData, agentData] = await Promise.all([
      fetchProperties({
        ...aroundParams,
        page: '1',
      }),

      agentPhone
        ? fetchProperties({
            listing_type: listingType || undefined,
            agent_phone: agentPhone,
            page: '1',
          })
        : Promise.resolve({ results: [] }),
    ])

    const similarAround = parsePropertyListResponse(aroundData)
      .filter((item) => item.slug !== property.slug)
      .slice(0, 12)

    const similarByAgent = agentPhone
      ? parsePropertyListResponse(agentData)
          .filter((item) => item.slug !== property.slug)
          .slice(0, 12)
      : []

    return {
      similarAround,
      similarByAgent,
    }
  } catch (error) {
    console.error('PROPERTY SIMILAR LISTINGS SERVER FETCH ERROR:', error)

    return {
      similarAround: [],
      similarByAgent: [],
    }
  }
}

export async function generateMetadata({ params }) {
  const { category, segments = [] } = await params

  const seo = PROPERTY_CATEGORY_SEO[category]

  if (!seo) {
    return {
      title: 'Properties | Gulberg Greens Islamabad',
    }
  }

  // /properties/category/block/
  if (segments.length === 1) {
    const block = propertyBlockFromSlug(segments[0])

    if (block) {
      const blockSlug = segments[0]

      return {
        title: `${seo.breadcrumb} for Sale in ${block} | Gulberg Greens Islamabad`,
        description: `Explore ${seo.breadcrumb.toLowerCase()} for sale in ${block}, Gulberg Greens Islamabad. Secure gated community by IBECHS. Browse available listings and contact us today.`,
        alternates: {
          canonical: `https://gulberggreens.com.pk/properties/${category}/${blockSlug}/`,
        },
      }
    }

    // Legacy:
    // /properties/category/property-slug/
    const property = await fetchProperty({
      slug: segments[0],
      categorySlug: category,
    })

    if (!property) {
      return {
        title: 'Property Not Found | Gulberg Greens Islamabad',
        description: 'The requested property could not be found.',
      }
    }

    return {
      title: property.meta_title || property.title || 'Property',
      description:
        property.meta_description ||
        property.short_description ||
        property.title ||
        'Property for sale in Gulberg Greens Islamabad.',
      alternates: {
        canonical:
          property.canonical_url ||
          `https://gulberggreens.com.pk/properties/${category}/${segments[0]}/`,
      },
    }
  }

  // /properties/category/block/property-slug/
  if (segments.length === 2) {
    const [blockSlug, slug] = segments

    const block = propertyBlockFromSlug(blockSlug)

    if (!block) {
      return {
        title: 'Property Not Found | Gulberg Greens Islamabad',
        description: 'The requested property could not be found.',
      }
    }

    const property = await fetchProperty({
      slug,
      categorySlug: category,
      block: blockSlug,
    })

    if (!property) {
      return {
        title: 'Property Not Found | Gulberg Greens Islamabad',
        description: 'The requested property could not be found.',
      }
    }

    return {
      title: property.meta_title || property.title || 'Property',
      description:
        property.meta_description ||
        property.short_description ||
        property.title ||
        'Property for sale in Gulberg Greens Islamabad.',
      alternates: {
        canonical:
          property.canonical_url ||
          `https://gulberggreens.com.pk/properties/${category}/${blockSlug}/${slug}/`,
      },
    }
  }

  return {
    title: 'Property Not Found | Gulberg Greens Islamabad',
  }
}

export default async function PropertyRoutePage({ params }) {
  const { category, segments = [] } = await params

  const seo = PROPERTY_CATEGORY_SEO[category]

  if (!seo) {
    notFound()
  }

  // /properties/category/block/
  if (segments.length === 1) {
    const block = propertyBlockFromSlug(segments[0])

    if (block) {
      return (
        <Suspense>
          <PropertiesClient
            forcedListingType={seo.listingType || ''}
            forcedBlock={block}
          />
        </Suspense>
      )
    }

    // Legacy:
    // /properties/category/property-slug/
    const property = await fetchProperty({
      slug: segments[0],
      categorySlug: category,
    })

    if (!property) {
      notFound()
    }

    const { similarAround, similarByAgent } =
      await getSimilarProperties(property)

    return (
      <PropertyDetailClient
        categorySlug={category}
        slug={segments[0]}
        initialProperty={property}
        initialSimilarAround={similarAround}
        initialSimilarByAgent={similarByAgent}
      />
    )
  }

  // /properties/category/block/property-slug/
  if (segments.length === 2) {
    const [blockSlug, slug] = segments

    const block = propertyBlockFromSlug(blockSlug)

    if (!block) {
      notFound()
    }

    const property = await fetchProperty({
      slug,
      categorySlug: category,
      block: blockSlug,
    })

    if (!property) {
      notFound()
    }

    const { similarAround, similarByAgent } =
      await getSimilarProperties(property)

    return (
      <PropertyDetailClient
        categorySlug={category}
        block={blockSlug}
        slug={slug}
        initialProperty={property}
        initialSimilarAround={similarAround}
        initialSimilarByAgent={similarByAgent}
      />
    )
  }

  notFound()
}
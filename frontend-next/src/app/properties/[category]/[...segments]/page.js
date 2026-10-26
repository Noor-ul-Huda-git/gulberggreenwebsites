import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import PropertiesClient from '../../PropertiesClient'
import PropertyDetailClient from '../../../../components/properties/PropertyDetailClient.jsx'

import {
  PROPERTY_CATEGORY_SEO,
  propertyBlockFromSlug,
} from '../../../../data/propertyListingTypes.js'

import { fetchProperties, fetchProperty } from '../../../../lib/api.js'

/*
 * Size segment: /properties/plots/block-h/7-marla/
 */
const SIZE_SLUG_RE = /^(\d+(?:\.\d+)?)-(marla|kanal)s?$/

/*
 * Size pages sirf Plots, Commercial Plots, Farmhouse aur House ke liye.
 */
const SIZE_ENABLED_LISTING_TYPES = new Set([
  'plots',
  'commercialplots',
  'farmhouse',
  'house',
])

function categoryAllowsSize(seo) {
  const key = String(seo?.listingType || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

  // "all" (koi property type nahi) par bhi size chalta hai
  return !key || SIZE_ENABLED_LISTING_TYPES.has(key)
}

/*
 * /properties/all/{block}/ — jab property type na chuna ho.
 */
const ALL_CATEGORY_SEO = {
  listingType: '',
  breadcrumb: 'Properties',
}

function categorySeoFor(category) {
  return (
    PROPERTY_CATEGORY_SEO[category] ||
    (category === 'all' ? ALL_CATEGORY_SEO : null)
  )
}

function sizeLabelFromSlug(slug) {
  const m = SIZE_SLUG_RE.exec(String(slug || '').trim().toLowerCase())

  if (!m) return ''

  const unit = m[2] === 'kanal' ? 'Kanal' : 'Marla'

  return `${Number(m[1])} ${unit}`
}

function parsePropertyListResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

/*
 * Block page ke search ke liye saari listings (sab pages)
 * server se load hoti hain. Browser se API call nahi hoti,
 * is liye local aur live dono jagah kaam karta hai.
 */
async function getAllProperties() {
  try {
    const first = await fetchProperties({ page: '1' })

    if (Array.isArray(first)) return first

    const firstList = parsePropertyListResponse(first)
    const total = Number(first?.count || 0)
    const pageSize = firstList.length || 12
    const totalPages =
      total > firstList.length ? Math.ceil(total / pageSize) : 1

    const all = [...firstList]
    const BATCH = 6

    for (let start = 2; start <= totalPages; start += BATCH) {
      const requests = []

      for (let pg = start; pg < start + BATCH && pg <= totalPages; pg += 1) {
        requests.push(
          fetchProperties({ page: String(pg) })
            .then(parsePropertyListResponse)
            .catch(() => []),
        )
      }

      const results = await Promise.all(requests)
      results.forEach((list) => all.push(...list))
    }

    const seen = new Set()

    return all.filter((p) => {
      const key = p?.id ?? p?.slug
      if (key == null) return true
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  } catch (error) {
    console.error('BLOCK PAGE PROPERTIES SERVER FETCH ERROR:', error)
    return []
  }
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

  const seo = categorySeoFor(category)

  if (!seo) {
    return {
      title: 'Properties | Gulberg Greens Islamabad',
    }
  }

  // /properties/category/size/
  if (
    segments.length === 1 &&
    categoryAllowsSize(seo) &&
    sizeLabelFromSlug(segments[0])
  ) {
    const sizeLabel = sizeLabelFromSlug(segments[0])

    return {
      title: `${sizeLabel} ${seo.breadcrumb} for Sale | Gulberg Greens Islamabad`,
      description: `Explore ${sizeLabel} ${seo.breadcrumb.toLowerCase()} for sale in Gulberg Greens Islamabad. Secure gated community by IBECHS. Browse available listings and contact us today.`,
      alternates: {
        canonical: `https://gulberggreens.com.pk/properties/${category}/${segments[0]}/`,
      },
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

    // /properties/category/block/size/
    const sizeLabel = categoryAllowsSize(seo) ? sizeLabelFromSlug(slug) : ''

    if (sizeLabel) {
      return {
        title: `${sizeLabel} ${seo.breadcrumb} for Sale in ${block} | Gulberg Greens Islamabad`,
        description: `Explore ${sizeLabel} ${seo.breadcrumb.toLowerCase()} for sale in ${block}, Gulberg Greens Islamabad. Secure gated community by IBECHS. Browse available listings and contact us today.`,
        alternates: {
          canonical: `https://gulberggreens.com.pk/properties/${category}/${blockSlug}/${slug}/`,
        },
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

  const seo = categorySeoFor(category)

  if (!seo) {
    notFound()
  }

  // /properties/category/size/
  if (
    segments.length === 1 &&
    categoryAllowsSize(seo) &&
    sizeLabelFromSlug(segments[0])
  ) {
    const initialItems = await getAllProperties()

    return (
      <Suspense>
        <PropertiesClient initialItems={initialItems} />
      </Suspense>
    )
  }

  // /properties/category/block/
  if (segments.length === 1) {
    const block = propertyBlockFromSlug(segments[0])

    if (block) {
      const initialItems = await getAllProperties()

      return (
        <Suspense>
          <PropertiesClient
            forcedListingType={seo.listingType || ''}
            forcedBlock={block}
            initialItems={initialItems}
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

    // /properties/category/block/size/
    if (categoryAllowsSize(seo) && sizeLabelFromSlug(slug)) {
      const initialItems = await getAllProperties()

      return (
        <Suspense>
          <PropertiesClient
            forcedListingType={seo.listingType || ''}
            forcedBlock={block}
            initialItems={initialItems}
          />
        </Suspense>
      )
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
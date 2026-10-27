import { notFound, permanentRedirect } from 'next/navigation'
import { Suspense } from 'react'
import PropertiesClient from '../PropertiesClient'
import PropertyDetailClient from '../../../components/properties/PropertyDetailClient.jsx'
import {
  PROPERTY_CATEGORY_SEO,
  propertyDetailPath,
} from '../../../data/propertyListingTypes.js'
import { fetchProperties, fetchProperty } from '../../../lib/api.js'

/*
 * Sirf size wala URL: /properties/5-marla/ ya /properties/5-kanal/
 */
const SIZE_SLUG_RE = /^(\d+(?:\.\d+)?)-(marla|kanal)s?$/

/*
 * Individual listing (description) pages: noindex, nofollow.
 */
const LISTING_ROBOTS = { index: false, follow: false }

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
 * Bina block wali listing ka link: /properties/listing-name/
 * Pehle yeh 404 deta tha. Ab listing dhoondi jati hai.
 */
async function getListingBySlug(slug) {
  try {
    return await fetchProperty({ slug })
  } catch (error) {
    console.error('LISTING (NO BLOCK) SERVER FETCH ERROR:', error)
    return null
  }
}

function normalizePath(path) {
  return `/${String(path || '').replace(/^\/+|\/+$/g, '')}/`
}

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
    console.error('SIZE PAGE PROPERTIES SERVER FETCH ERROR:', error)
    return []
  }
}

export async function generateMetadata({ params }) {
  const { category } = await params
  const seo = PROPERTY_CATEGORY_SEO[category]

  if (!seo) {
    const sizeLabel = sizeLabelFromSlug(category)

    if (sizeLabel) {
      return {
        title: `${sizeLabel} Properties for Sale | Gulberg Greens Islamabad`,
        description: `Explore ${sizeLabel} properties for sale in Gulberg Greens Islamabad. Secure gated community by IBECHS. Browse available listings and contact us today.`,
        alternates: {
          canonical: `https://gulberggreens.com.pk/properties/${category}/`,
        },
      }
    }

    // Bina block wali listing: /properties/listing-name/
    const property = await getListingBySlug(category)

    if (property) {
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
            `https://gulberggreens.com.pk/properties/${category}/`,
        },
        // Listing page: noindex, nofollow
        robots: LISTING_ROBOTS,
      }
    }

    return {
      title: 'Properties | Gulberg Greens Islamabad',
    }
  }

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonical,
    },
  }
}

export default async function PropertyCategoryPage({ params }) {
  const { category } = await params
  const seo = PROPERTY_CATEGORY_SEO[category]

  if (!seo) {
    // /properties/5-marla/
    if (sizeLabelFromSlug(category)) {
      const initialItems = await getAllProperties()

      return (
        <Suspense>
          <PropertiesClient initialItems={initialItems} />
        </Suspense>
      )
    }

    // Bina block wali listing: /properties/listing-name/
    const property = await getListingBySlug(category)

    // Property delete ho chuki hai: 404 ki jagah /properties/ par bhejo
    if (!property) {
      permanentRedirect('/properties/')
    }

    /*
     * Agar listing ka ab sahi (type + block wala) URL ban sakta hai,
     * to purane link se wahan permanent redirect.
     */
    const properPath = normalizePath(propertyDetailPath(property))

    if (properPath !== normalizePath(`/properties/${category}`)) {
      permanentRedirect(properPath)
    }

    return (
      <PropertyDetailClient
        slug={category}
        initialProperty={property}
      />
    )
  }

  /*
   * Type page: /properties/plots/, /properties/farm-house/ waghera.
   * Listings server se aati hain (size aur block pages ki tarah),
   * taake local aur live dono jagah property type ki listings dikhein.
   */
  const initialItems = await getAllProperties()

  return (
    <Suspense>
      <PropertiesClient initialItems={initialItems} />
    </Suspense>
  )
}
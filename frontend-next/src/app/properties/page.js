export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import PropertiesClient from './PropertiesClient'
import { STATIC_PAGE_SEO } from '../../data/staticPageSeo.js'
import { fetchProperties } from '../../lib/api.js'

export const metadata = {
  title: "Properties for Sale & Rent in Gulberg Greens Islamabad",
  description:
    "Browse plots, farmhouses, houses, flats, shops and offices for sale and rent " +
    "in Gulberg Greens Islamabad. Updated daily with new listings.",
  alternates: { canonical: "/properties/" },
};

function parsePropertyListResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

/*
 * Saari listings (sirf pehla page nahi) server se load hoti hain,
 * taake search box har available listing dhoond sake.
 */
async function getInitialProperties() {
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
    console.error('PROPERTIES SERVER FETCH ERROR:', error)
    return []
  }
}

export default async function PropertiesPage() {
  const initialItems = await getInitialProperties()

  return (
    <Suspense>
      <PropertiesClient initialItems={initialItems} />
    </Suspense>
  )
}

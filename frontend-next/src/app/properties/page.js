import { Suspense } from 'react'
import PropertiesClient from './PropertiesClient'
import { STATIC_PAGE_SEO } from '../../data/staticPageSeo.js'
import { fetchProperties } from '../../lib/api.js'

export const metadata = {
  title: STATIC_PAGE_SEO.properties.metaTitle,
  description: STATIC_PAGE_SEO.properties.metaDescription,
}

function parsePropertyListResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

async function getInitialProperties() {
  try {
    const data = await fetchProperties({
      page: '1',
    })

    return parsePropertyListResponse(data)
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
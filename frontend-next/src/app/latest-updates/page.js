import { Suspense } from 'react'
import NewsIndex from './NewsIndex'
import { STATIC_PAGE_SEO } from '../../data/staticPageSeo.js'
import { fetchNewsPosts } from '../../lib/api.js'

export const metadata = {
  title: STATIC_PAGE_SEO.latestUpdates.metaTitle,
  description: STATIC_PAGE_SEO.latestUpdates.metaDescription,
}

function parseNewsListResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

async function getNewsPage(page = 1) {
  try {
    const response = await fetchNewsPosts({ page })

    return {
      results: parseNewsListResponse(response),
      count: Number(response?.count || 0),
      totalPages: Number(response?.totalPages || 1),
      invalidPage: Boolean(response?.invalidPage),
    }
  } catch (error) {
    console.error('LATEST UPDATES SERVER ERROR:', error)

    return {
      results: [],
      count: 0,
      totalPages: 1,
      invalidPage: false,
      error: 'Unable to load articles. Please try again shortly.',
    }
  }
}

export default async function LatestUpdatesPage({ searchParams }) {
  const params = await searchParams

  const rawPage = params?.page
  const parsedPage = Number.parseInt(
    Array.isArray(rawPage) ? rawPage[0] : rawPage || '1',
    10,
  )

  const page =
    Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1

  const initialData = await getNewsPage(page)

  return (
    <Suspense>
      <NewsIndex
        initialPosts={initialData.results}
        initialTotalCount={initialData.count}
        initialTotalPages={initialData.totalPages}
        initialError={initialData.error || null}
        initialPage={page}
        invalidPage={initialData.invalidPage}
      />
    </Suspense>
  )
}
/** Base API URL, normalized (no trailing slash). */
function getApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
  return String(raw).replace(/\/+$/, '')
}

export async function fetchProperties(params = {}) {
  const url = new URL(`${getApiBase()}/properties/`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch properties')
  }

  return response.json()
}

export async function fetchProperty(slug) {
  const response = await fetch(`${getApiBase()}/properties/${encodeURIComponent(slug)}/`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch property')
  }

  return response.json()
}

/** Fallback if API omits `page_size` (older deployments). */
const NEWS_PAGE_SIZE_FALLBACK = 20

/**
 * @param {{ page?: number }} [params]
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{ results: Array, count: number, totalPages: number, next: string | null, previous: string | null, invalidPage?: boolean }>}
 */
export async function fetchNewsPosts(params = {}, options = {}) {
  const url = new URL(`${getApiBase()}/news/`)
  const pageNum = Math.max(1, Number.parseInt(String(params.page ?? '1'), 10) || 1)
  url.searchParams.set('page', String(pageNum))

  const response = await fetch(url, { signal: options.signal })

  /** DRF returns 404 only for out-of-range page numbers, not for an empty list. */
  if (response.status === 404 && pageNum > 1) {
    return {
      results: [],
      count: 0,
      totalPages: 1,
      next: null,
      previous: null,
      invalidPage: true,
    }
  }

  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Failed to fetch news')
  }

  if (Array.isArray(data)) {
    return {
      results: data,
      count: data.length,
      totalPages: 1,
      next: null,
      previous: null,
      invalidPage: false,
    }
  }

  if (data && typeof data === 'object' && Array.isArray(data.results)) {
    const results = data.results
    const countRaw = data.count
    const count = Number(countRaw)
    const safeCount = Number.isFinite(count) ? count : results.length
    const pageSizeRaw = data.page_size
    const pageSizeNum = Number(pageSizeRaw)
    const pageSize = Number.isFinite(pageSizeNum) && pageSizeNum > 0 ? pageSizeNum : NEWS_PAGE_SIZE_FALLBACK
    const totalPages = Math.max(1, Math.ceil(safeCount / pageSize))

    return {
      results,
      count: safeCount,
      totalPages,
      next: data.next ?? null,
      previous: data.previous ?? null,
      invalidPage: false,
    }
  }

  throw new Error('Failed to fetch news')
}

/** @returns {Promise<object | null>} */
export async function fetchNewsPost(slug) {
  const response = await fetch(`${getApiBase()}/news/${encodeURIComponent(slug)}/`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch article')
  }

  return response.json()
}

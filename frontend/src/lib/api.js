/**
 * Base API URL, normalized (no trailing slash).
 * Relative values like `/api` (from VITE_API_BASE_URL) must be resolved with `window.location.origin`
 * so `new URL(...)` works in the browser; a path-only string is not a valid single-arg URL.
 */
function getApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL
  if (fromEnv) {
    let raw = String(fromEnv).trim().replace(/\/+$/, '')
    if (typeof window !== 'undefined' && raw.startsWith('/')) {
      raw = `${window.location.origin}${raw}`
    }
    return raw
  }
  if (typeof window !== 'undefined') {
    const { hostname } = window.location
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${window.location.origin}/api`.replace(/\/+$/, '')
    }
  }
  return 'http://127.0.0.1:8000/api'
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

export async function fetchProperty({ slug, categorySlug, block } = {}) {
  const encodedSlug = encodeURIComponent(String(slug || '').trim())
  const encodedCategory = encodeURIComponent(String(categorySlug || '').trim())
  const encodedBlock = encodeURIComponent(String(block || '').trim())
  const detailPath =
    encodedCategory && encodedBlock
      ? `${getApiBase()}/properties/${encodedCategory}/${encodedBlock}/${encodedSlug}/`
      : `${getApiBase()}/properties/${encodedSlug}/`
  const response = await fetch(detailPath)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch property')
  }

  return response.json()
}

/**
 * Submit the property inquiry form to the API (stored as ListingEmail; one per listing per email).
 * @param {number} propertyId
 * @param {{ name: string, email: string, phone: string, message: string }} payload
 * @returns {Promise<{ ok: true, detail?: string } | { duplicate: true, detail: string }>}
 */
export async function submitPropertyListingEmail(propertyId, payload) {
  const response = await fetch(`${getApiBase()}/properties/${Number(propertyId)}/listing-emails/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
  let data = {}
  try {
    data = await response.json()
  } catch {
    /* non-JSON body */
  }
  if (response.status === 201 || response.status === 200) {
    return { ok: true, detail: typeof data.detail === 'string' ? data.detail : undefined }
  }
  if (response.status === 409) {
    return {
      duplicate: true,
      detail: typeof data.detail === 'string' ? data.detail : 'You have already submitted an inquiry for this listing.',
    }
  }
  const raw =
    (typeof data.detail === 'string' && data.detail) ||
    (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) ||
    (data.email && Array.isArray(data.email) && data.email[0]) ||
    (data.name && Array.isArray(data.name) && data.name[0])
  throw new Error(raw || `Request failed (${response.status})`)
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

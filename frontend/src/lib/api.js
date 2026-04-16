const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export async function fetchProperties(params = {}) {
  const url = new URL(`${API_BASE_URL}/properties/`)

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
  const response = await fetch(`${API_BASE_URL}/properties/${encodeURIComponent(slug)}/`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch property')
  }

  return response.json()
}

/** @returns {Promise<Array>} */
export async function fetchNewsPosts() {
  const response = await fetch(`${API_BASE_URL}/news/`)

  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.results ?? []
}

/** @returns {Promise<object | null>} */
export async function fetchNewsPost(slug) {
  const response = await fetch(`${API_BASE_URL}/news/${encodeURIComponent(slug)}/`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch article')
  }

  return response.json()
}

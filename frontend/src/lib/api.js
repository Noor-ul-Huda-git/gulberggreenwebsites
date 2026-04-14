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

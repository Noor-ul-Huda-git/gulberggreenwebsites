import { getGulbergMapPdfUrl } from './gulbergMapPdf.js'

let started = false

/**
 * Hint the browser to fetch the master-plan PDF early (low priority) so opening the map page
 * often hits a warm HTTP cache. Uses the same URL as GulbergMapPdfViewer (env override included).
 */
export function prefetchGulbergMapPdf() {
  if (started || typeof document === 'undefined') return
  started = true

  try {
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData) return
  } catch {
    /* ignore */
  }

  const pathOrUrl = getGulbergMapPdfUrl()
  if (!pathOrUrl) return

  let href
  try {
    href =
      pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')
        ? pathOrUrl
        : new URL(pathOrUrl, window.location.origin).href
  } catch {
    return
  }

  const already = [...document.querySelectorAll('link[rel="prefetch"]')].some((el) => {
    try {
      const raw = el.getAttribute('href')
      if (!raw) return false
      return new URL(raw, window.location.origin).href === href
    } catch {
      return false
    }
  })
  if (already) return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  try {
    link.fetchPriority = 'low'
  } catch {
    /* optional */
  }
  document.head.appendChild(link)
}

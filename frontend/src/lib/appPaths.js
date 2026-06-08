/** Public site origin — canonical URLs always use this host. */
export const SITE_ORIGIN = 'https://gulberggreens.com.pk'

/**
 * Normalize an app pathname to the site-wide trailing-slash format (home stays `/`).
 * @param {string} pathname
 * @returns {string}
 */
export function normalizeAppPath(pathname) {
  const raw = String(pathname || '').trim()
  if (!raw || raw === '/') return '/'
  const without = raw.replace(/\/+$/, '')
  return `${without}/`
}

/**
 * Build an internal route path with trailing slash.
 * @param {...string} segments
 * @returns {string}
 */
export function appPath(...segments) {
  const parts = segments
    .flat()
    .map((s) => String(s || '').replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
  if (!parts.length) return '/'
  return `/${parts.join('/')}/`
}

/**
 * Absolute canonical URL for a pathname (always trailing slash except home).
 * @param {string} pathname
 * @param {string} [origin]
 * @returns {string}
 */
export function canonicalHref(pathname, origin = SITE_ORIGIN) {
  const path = normalizeAppPath(pathname)
  if (path === '/') return `${origin}/`
  return `${origin}${path}`
}

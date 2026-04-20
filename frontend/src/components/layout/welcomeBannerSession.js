/**
 * Set when the user reaches `/` via in-app navigation (not the first paint of a full load).
 * `performance.navigation` / PerformanceNavigationTiming `type` stays `reload` for the whole
 * SPA session after one refresh, so we cannot rely on `type === 'reload'` alone.
 */
export const WELCOME_CLIENT_NAV_TO_HOME_KEY = 'gulberg_welcome_client_nav_home_timeorigin'

export function markClientNavigationToHome() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(WELCOME_CLIENT_NAV_TO_HOME_KEY, String(performance.timeOrigin))
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Full reload of `/` only, and at most once per document load (navbar Home must not re-trigger).
 */
export function shouldShowWelcomeBannerOnMount() {
  if (typeof window === 'undefined') return false
  const nav = performance.getEntriesByType?.('navigation')?.[0]
  if (!nav || nav.type !== 'reload') return false
  const path = window.location.pathname || '/'
  if (path !== '/' && path !== '') return false
  const origin = String(performance.timeOrigin)
  try {
    if (sessionStorage.getItem(WELCOME_CLIENT_NAV_TO_HOME_KEY) === origin) return false
  } catch {
    /* ignore */
  }
  return true
}

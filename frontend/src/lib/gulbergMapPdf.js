/**
 * Master plan PDF — served only from Django static files: `backend/static/maps/gulberg-greens.pdf`
 * → URL `/static/maps/gulberg-greens.pdf`.
 *
 * Local dev: run Django (`python manage.py runserver`) and Vite; Vite proxies `/static` to port 8000.
 * Production: nginx (or Django) must serve `/static/` after `collectstatic`.
 *
 * Override: `VITE_GULBERG_MAP_PDF_URL` (absolute URL or root-relative path).
 */
export const GULBERG_MAP_PDF_PATH = '/static/maps/gulberg-greens.pdf'

export function getGulbergMapPdfUrl() {
  const fromEnv = import.meta.env.VITE_GULBERG_MAP_PDF_URL
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).trim()
  }
  return GULBERG_MAP_PDF_PATH
}

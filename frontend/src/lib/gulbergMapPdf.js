/**
 * Master plan PDF — default: `frontend/public/maps/gulberg-greens.pdf` → `/maps/gulberg-greens.pdf`.
 * Vite copies `public/` into `dist/` so production nginx can serve this file with sendfile (fast).
 *
 * Avoid huge PDFs at `/static/...` through Django/Gunicorn only — that path often buffers in the app
 * server and is slow for 40MB+ files. Prefer `/maps/...` from the same host as the SPA.
 *
 * Override: `VITE_GULBERG_MAP_PDF_URL` (e.g. CDN URL or `/static/maps/...` if nginx aliases static).
 */
export const GULBERG_MAP_PDF_PATH = '/maps/gulberg-greens-new.pdf'

export function getGulbergMapPdfUrl() {
  const fromEnv = import.meta.env.VITE_GULBERG_MAP_PDF_URL
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).trim()
  }
  return GULBERG_MAP_PDF_PATH
}

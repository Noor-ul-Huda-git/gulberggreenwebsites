
export const GULBERG_MAP_PDF_PATH = '/maps/gulberg-greens-new.pdf'

export function getGulbergMapPdfUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_GULBERG_MAP_PDF_URL

  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).trim()
  }

  return GULBERG_MAP_PDF_PATH
}
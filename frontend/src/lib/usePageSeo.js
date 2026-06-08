import { useEffect } from 'react'
import { canonicalHref } from './appPaths.js'

function upsertMeta(name, content) {
  let tag = document.head.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
  return tag
}

function upsertCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
  return tag
}

export function usePageSeo(seo) {
  useEffect(() => {
    if (!seo) return undefined

    const previousTitle = document.title
    const previousDescription = document.head.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    const previousCanonical = document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
    const previousRobots = document.head.querySelector('meta[name="robots"]')?.getAttribute('content') || ''

    const selfCanonical =
      typeof window !== 'undefined' ? canonicalHref(window.location.pathname) : seo.canonical

    /** When set (e.g. news under both `/news/` and `/latest-updates/`), forces one preferred URL for search engines. */
    const canonicalHrefValue = seo.canonicalOverride || selfCanonical || seo.canonical

    document.title = seo.metaTitle
    upsertMeta('description', seo.metaDescription)
    upsertMeta('robots', 'index, follow')
    upsertCanonical(canonicalHrefValue)

    return () => {
      document.title = previousTitle
      if (previousDescription) upsertMeta('description', previousDescription)
      if (previousCanonical) upsertCanonical(previousCanonical)
      if (previousRobots) upsertMeta('robots', previousRobots)
    }
  }, [seo])
}

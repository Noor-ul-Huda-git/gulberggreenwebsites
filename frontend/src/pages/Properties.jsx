import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import PageBreadcrumbs from '../components/layout/PageBreadcrumbs.jsx'
import PageHero from '../components/layout/PageHero.jsx'
import { IconBath, IconBed, IconPhone, IconRuler, IconWhatsAppBrand } from '../components/properties/PropertyIcons.jsx'
import {
  LISTING_TYPE_OPTIONS,
  PROPERTY_BLOCK_OPTIONS,
  PROPERTY_CATEGORY_SEO,
  PROPERTY_LISTING_TYPE_SLUGS,
  propertyBlockFromSlug,
  propertyBlockSeo,
  propertyDetailPath,
  slugifyPropertyBlock,
} from '../data/propertyListingTypes.js'
import { contactInfo } from '../data/siteContent.js'
import { STATIC_PAGE_SEO } from '../data/staticPageSeo.js'
import { fetchProperties } from '../lib/api.js'

const MARLA_FILTER_OPTIONS = [5, 7, 10, 20, 30, 40]
const ROOM_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8]

const ALLOWED_LISTING_TYPE = new Set(
  LISTING_TYPE_OPTIONS.map((o) => o.value).filter(Boolean),
)

/** Stable string compare for SPA filter query (order-independent). */
function filterQueryFingerprint(sp) {
  const entries = [...sp.entries()].filter(([, v]) => v !== null && String(v).trim() !== '')
  entries.sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([k, v]) => `${k}=${v}`).join('&')
}

/** Filters stored only in query (listing type / block live in path when chosen). Aliases stripped on rebuild. */
const EXTRA_FILTER_KEYS = [
  'search',
  'min_price',
  'max_price',
  'min_marlas',
  'max_marlas',
  'min_marla',
  'max_marla',
  'bedrooms',
  'baths',
]

/** Always removed from canonical query (encoded in pathname when applicable). */
const LISTING_TYPE_QUERY_KEY = 'listing_type'

/**
 * Extra filters + listing_type (never in query when path has a category) + block (only on bare `/properties`).
 */
const ALL_REWRITTABLE_QUERY_KEYS = [...EXTRA_FILTER_KEYS, LISTING_TYPE_QUERY_KEY, 'block']

function normalizeListingPath(pathname) {
  const p = pathname.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

/** Canonical listing URL: `/properties`, `/properties/{category}`, or `/properties/{category}/{blockSlug}`. */
function desiredPropertiesListingPath(listingType, blockLabel) {
  if (!listingType) return '/properties'
  const slug = PROPERTY_LISTING_TYPE_SLUGS[listingType]
  if (!slug) return '/properties'
  const blockSeg = slugifyPropertyBlock(String(blockLabel || '').trim())
  if (!blockSeg) return `/properties/${slug}`
  return `/properties/${slug}/${blockSeg}`
}

function isBarePropertiesListingPath(pathname) {
  return normalizeListingPath(pathname) === '/properties'
}

/**
 * Hydration helpers: extras always from query; listing_type/block from query ONLY on `/properties`
 * when path does not already encode a category. Path always wins when category or block slug is present.
 */
function readExtraFiltersFromSearchParams(sp) {
  const get = (k) => sp.get(k)?.trim() ?? ''
  const minMarlas = get('min_marlas') || get('min_marla')
  const maxMarlas = get('max_marlas') || get('max_marla')
  return {
    search: get('search') || '',
    minPrice: get('min_price') || '',
    maxPrice: get('max_price') || '',
    minMarlas: minMarlas || '',
    maxMarlas: maxMarlas || '',
    bedrooms: get('bedrooms') || '',
    baths: get('baths') || '',
  }
}

function readListingTypeFromSearchWhenAllowed(searchParams, forcedListingType, pathname) {
  if (forcedListingType) return ''
  if (!isBarePropertiesListingPath(pathname)) return ''
  const lt = searchParams.get('listing_type')?.trim() ?? ''
  return lt && ALLOWED_LISTING_TYPE.has(lt) ? lt : ''
}

function readBlockFromSearchWhenAllowed(searchParams, forcedBlock) {
  if (forcedBlock) return ''
  return searchParams.get('block')?.trim() ?? ''
}

/** First render must match the URL so the URL-sync effect does not strip query params before layout runs. */
function createInitialFilterSnapshot(pathname, search, forcedListingType, forcedBlock) {
  const qp = new URLSearchParams(String(search || '').replace(/^\?/, ''))
  const extras = readExtraFiltersFromSearchParams(qp)
  const brNum = Number(extras.bedrooms)
  const baNum = Number(extras.baths)

  let listingType = ''
  let block = ''
  if (forcedListingType) {
    listingType = forcedListingType
    block = forcedBlock ? String(forcedBlock) : ''
  } else {
    listingType = readListingTypeFromSearchWhenAllowed(qp, forcedListingType, pathname)
    block = readBlockFromSearchWhenAllowed(qp, forcedBlock)
  }

  return {
    search: extras.search,
    minPrice: extras.minPrice,
    maxPrice: extras.maxPrice,
    minMarlas: extras.minMarlas,
    maxMarlas: extras.maxMarlas,
    bedrooms: extras.bedrooms && ROOM_COUNT_OPTIONS.includes(brNum) ? String(brNum) : '',
    baths: extras.baths && ROOM_COUNT_OPTIONS.includes(baNum) ? String(baNum) : '',
    listingType,
    block,
  }
}

/** Rebuild query: price/marlas/beds/search + optional `block` only on `/properties` (no category in path). */
function buildExtraFilterSearchParams(extras, baseParams) {
  const p = new URLSearchParams(typeof baseParams === 'string' ? baseParams : baseParams?.toString() || '')
  for (const k of ALL_REWRITTABLE_QUERY_KEYS) p.delete(k)
  if (extras.search) p.set('search', extras.search)
  if (extras.minPrice) p.set('min_price', String(extras.minPrice).trim())
  if (extras.maxPrice) p.set('max_price', String(extras.maxPrice).trim())
  if (extras.minMarlas) p.set('min_marlas', String(extras.minMarlas).trim())
  if (extras.maxMarlas) p.set('max_marlas', String(extras.maxMarlas).trim())
  if (extras.bedrooms) p.set('bedrooms', String(extras.bedrooms).trim())
  if (extras.baths) p.set('baths', String(extras.baths).trim())
  if (extras.blockForQuery) p.set('block', String(extras.blockForQuery).trim())
  return p
}

function canonicalListingUrlKey(pathname, search) {
  const path = normalizeListingPath(pathname)
  const qs = new URLSearchParams(String(search || '').replace(/^\?/, ''))
  const fp = filterQueryFingerprint(qs)
  return fp ? `${path}?${fp}` : path
}

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

function formatCompactPkr(value) {
  if (value == null || value === '') return 'Price on request'
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)

  const abs = Math.abs(n)
  const units = [
    { value: 10000000, label: 'Crore' },
    { value: 100000, label: 'Lac' },
    { value: 1000, label: 'Thousand' },
  ]

  for (const unit of units) {
    if (abs >= unit.value) {
      const compact = (n / unit.value).toFixed(2).replace(/\.?0+$/, '')
      return `PKR ${compact} ${unit.label}`
    }
  }

  return `PKR ${n.toLocaleString('en-PK')}`
}

function getPlainDescription(property) {
  const source = property.short_description || property.description || ''
  return source.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatMarlasValue(value) {
  if (value == null || value === '') return ''
  const num = Number(value)
  if (!Number.isNaN(num) && Number.isInteger(num)) return String(num)
  return String(value).replace(/\.0+$/, '')
}

function formatArea(property) {
  if (property.area_marlas == null || property.area_marlas === '') return ''
  const unit = property.area_unit_display || 'Marla'
  const marlas = formatMarlasValue(property.area_marlas)
  const plural = Number(marlas) === 1 || unit.endsWith('s') ? '' : 's'
  return `${marlas} ${unit}${plural}`
}

function getSizeMeta(property) {
  const meta = []

  if (property.area_marlas != null && property.area_marlas !== '') {
    meta.push({
      key: 'area',
      icon: IconRuler,
      label: formatArea(property),
    })
  }

  if (property.bedrooms != null && property.bedrooms !== '') {
    meta.push({
      key: 'bedrooms',
      icon: IconBed,
      label: `${property.bedrooms} Bed`,
    })
  }

  if (property.baths != null && property.baths !== '') {
    meta.push({
      key: 'baths',
      icon: IconBath,
      label: `${property.baths} Bath`,
    })
  }

  return meta
}

function whatsappHref(title) {
  const phone = contactInfo.phone.replace(/\D/g, '')
  const text = encodeURIComponent(`Assalam o Alaikum, I am interested in: ${title}`)
  return `https://wa.me/${phone}?text=${text}`
}

/**
 * Listing CTAs — same pattern as property detail sidebar (CALL + WhatsApp, solid #00a651),
 * compact for cards (`min-h` / type / icons smaller than detail).
 */
/** Capped width; centered on small screens, flush left from `md` up */
const LISTING_CTA_ROW = 'mx-auto flex w-[min(100%,18.5rem)] min-w-0 items-stretch gap-1.5 md:mx-0'
const LISTING_CTA_H = 'min-h-[40px] h-10 py-1.5'
const listingCtaSolidBaseSm = `property-listing-call-cta flex min-h-0 flex-1 flex-row items-center justify-center gap-1.5 rounded-none bg-[#00a651] px-2 !text-white shadow-none transition hover:bg-[#008f47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 active:scale-[0.98] ${LISTING_CTA_H}`
const listingCtaCallLinkClassSm = `${listingCtaSolidBaseSm} text-[11px] font-bold uppercase tracking-[0.06em]`
const listingCtaWhatsAppLinkClassSm = `${listingCtaSolidBaseSm} min-w-0 text-[11px] font-semibold`

function IconListView({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconGridView({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function cardImageUrl(p) {
  if (p.featured_image_url) return p.featured_image_url
  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0].url) {
    return p.images[0].url
  }
  return null
}

const listParent = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
}

const listItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function Properties() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathParts = useMemo(() => {
    const normalized = location.pathname.replace(/\/+$/, '')
    const prefix = '/properties/'
    return normalized.startsWith(prefix) ? normalized.slice(prefix.length).split('/').filter(Boolean) : []
  }, [location.pathname])
  const categorySlug = pathParts[0] || ''
  const blockSlug = pathParts[1] || ''
  const forcedBlock = useMemo(() => propertyBlockFromSlug(blockSlug), [blockSlug])
  const categorySeo = PROPERTY_CATEGORY_SEO[categorySlug] || null
  const blockSeo = useMemo(
    () => (forcedBlock ? propertyBlockSeo(categorySlug, forcedBlock) : null),
    [categorySlug, forcedBlock],
  )
  const pageSeo = blockSeo || categorySeo || STATIC_PAGE_SEO.properties
  const forcedListingType = categorySeo?.listingType || ''

  const [searchInput, setSearchInput] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).search,
  )
  const [search, setSearch] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).search,
  )
  const [listingType, setListingType] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).listingType,
  )
  const [block, setBlock] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).block,
  )
  /** When true, listing type / block from local state wins over path (so user can pick "All"). */
  const [listingTypeChosenByUser, setListingTypeChosenByUser] = useState(false)
  const [blockChosenByUser, setBlockChosenByUser] = useState(false)
  const [minPrice, setMinPrice] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).minPrice,
  )
  const [maxPrice, setMaxPrice] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).maxPrice,
  )
  const [minMarlas, setMinMarlas] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).minMarlas,
  )
  const [maxMarlas, setMaxMarlas] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).maxMarlas,
  )
  const [bedrooms, setBedrooms] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).bedrooms,
  )
  const [baths, setBaths] = useState(
    () => createInitialFilterSnapshot(location.pathname, location.search, forcedListingType, forcedBlock).baths,
  )
  const [items, setItems] = useState([])
  const [nextPageToLoad, setNextPageToLoad] = useState(2)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('list')

  const effectiveListingType = listingTypeChosenByUser ? listingType.trim() : listingType.trim() || forcedListingType

  const blockTrimmed = block.trim()
  const effectiveBlock = blockChosenByUser ? blockTrimmed : blockTrimmed || forcedBlock

  const minMarlaSelectOptions = useMemo(() => {
    const base = [...MARLA_FILTER_OPTIONS]
    if (minMarlas === '') return base
    const sel = Number(minMarlas)
    if (!Number.isFinite(sel) || base.includes(sel)) return base
    return [...base, sel].sort((a, b) => a - b)
  }, [minMarlas])

  const maxMarlaSelectOptions = useMemo(() => {
    const base = [...MARLA_FILTER_OPTIONS]
    if (maxMarlas === '') return base
    const sel = Number(maxMarlas)
    if (!Number.isFinite(sel) || base.includes(sel)) return base
    return [...base, sel].sort((a, b) => a - b)
  }, [maxMarlas])

  useLayoutEffect(() => {
    const qp = new URLSearchParams(location.search.replace(/^\?/, ''))
    const extras = readExtraFiltersFromSearchParams(qp)
    setSearch(extras.search)
    setSearchInput(extras.search)
    setMinPrice(extras.minPrice)
    setMaxPrice(extras.maxPrice)
    setMinMarlas(extras.minMarlas)
    setMaxMarlas(extras.maxMarlas)

    const brNum = Number(extras.bedrooms)
    setBedrooms(extras.bedrooms && ROOM_COUNT_OPTIONS.includes(brNum) ? String(brNum) : '')

    const baNum = Number(extras.baths)
    setBaths(extras.baths && ROOM_COUNT_OPTIONS.includes(baNum) ? String(baNum) : '')

    setListingTypeChosenByUser(false)
    setBlockChosenByUser(false)

    if (forcedListingType) {
      setListingType(forcedListingType)
    } else {
      const lt = readListingTypeFromSearchWhenAllowed(qp, forcedListingType, location.pathname)
      setListingType(lt)
    }

    if (forcedBlock) {
      setBlock(forcedBlock)
    } else {
      const bl = readBlockFromSearchWhenAllowed(qp, forcedBlock)
      setBlock(bl)
    }
  }, [location.pathname, location.search, forcedListingType, forcedBlock])

  useEffect(() => {
    const previousTitle = document.title
    const previousDescription = document.head.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    const previousCanonical = document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
    const previousRobots = document.head.querySelector('meta[name="robots"]')?.getAttribute('content') || ''

    const selfCanonical =
      typeof window !== 'undefined'
        ? window.location.pathname === '/'
          ? window.location.origin
          : `${window.location.origin}${window.location.pathname}`
        : pageSeo.canonical

    document.title = pageSeo.metaTitle
    upsertMeta('description', pageSeo.metaDescription)
    upsertMeta('robots', 'index, follow')
    upsertCanonical(selfCanonical || pageSeo.canonical)

    return () => {
      document.title = previousTitle
      if (previousDescription) upsertMeta('description', previousDescription)
      if (previousCanonical) upsertCanonical(previousCanonical)
      if (previousRobots) upsertMeta('robots', previousRobots)
    }
  }, [pageSeo])

  useEffect(() => {
    const t = window.setTimeout(() => setSearch(searchInput), 380)
    return () => window.clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    const desiredPath = desiredPropertiesListingPath(effectiveListingType, effectiveBlock)
    const baseQs = new URLSearchParams(location.search.replace(/^\?/, ''))
    const nextQs = buildExtraFilterSearchParams(
      {
        search,
        minPrice,
        maxPrice,
        minMarlas,
        maxMarlas,
        bedrooms,
        baths,
        blockForQuery:
          !effectiveListingType && String(effectiveBlock || '').trim() ? String(effectiveBlock).trim() : '',
      },
      baseQs,
    )
    const targetKey = canonicalListingUrlKey(desiredPath, nextQs.toString())
    const currentKey = canonicalListingUrlKey(location.pathname, location.search)
    if (targetKey === currentKey) return
    navigate({ pathname: desiredPath, search: nextQs.toString() }, { replace: true })
  }, [
    effectiveListingType,
    effectiveBlock,
    search,
    minPrice,
    maxPrice,
    minMarlas,
    maxMarlas,
    bedrooms,
    baths,
    navigate,
    location.pathname,
    location.search,
  ])

  const filterParams = useMemo(
    () => ({
      search: search || undefined,
      listing_type: effectiveListingType || undefined,
      block: effectiveBlock.trim() || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      min_marlas: minMarlas || undefined,
      max_marlas: maxMarlas || undefined,
      bedrooms: bedrooms || undefined,
      baths: baths || undefined,
    }),
    [search, effectiveListingType, effectiveBlock, minPrice, maxPrice, minMarlas, maxMarlas, bedrooms, baths],
  )

  const filterKey = useMemo(() => JSON.stringify(filterParams), [filterParams])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setNextPageToLoad(2)
    ;(async () => {
      try {
        const data = await fetchProperties({
          ...filterParams,
          page: '1',
        })
        if (cancelled) return
        const list = Array.isArray(data) ? data : data.results ?? []
        setItems(list)
        setHasMore(Boolean(data.next))
      } catch {
        if (!cancelled) {
          setItems([])
          setError('We could not load listings right now. Please try again in a moment.')
          setHasMore(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [filterKey])

  const loadMore = async () => {
    if (!hasMore || loadingMore || loading) return
    setLoadingMore(true)
    try {
      const data = await fetchProperties({
        ...filterParams,
        page: String(nextPageToLoad),
      })
      const list = Array.isArray(data) ? data : data.results ?? []
      setItems((prev) => [...prev, ...list])
      setHasMore(Boolean(data.next))
      setNextPageToLoad((p) => p + 1)
    } catch {
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }

  const resetFilters = () => {
    setSearchInput('')
    setSearch('')
    setListingTypeChosenByUser(false)
    setBlockChosenByUser(false)
    setListingType(forcedListingType)
    setBlock(forcedBlock)
    setMinPrice('')
    setMaxPrice('')
    setMinMarlas('')
    setMaxMarlas('')
    setBedrooms('')
    setBaths('')
    const cleared = new URLSearchParams(location.search.replace(/^\?/, ''))
    for (const k of ALL_REWRITTABLE_QUERY_KEYS) cleared.delete(k)
    navigate({ pathname: location.pathname, search: cleared.toString() }, { replace: true })
  }

  const showLoadMore = hasMore && items.length > 0

  return (
    <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
      <PageHero overlay="dark">
        <div className="container-shell flex min-h-[min(44vh,480px)] flex-col justify-center px-4 pb-14 pt-28 md:min-h-[min(48vh,520px)] md:pb-16 md:pt-32">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#31C950] [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] md:text-xs">
              Curated inventory
            </p>
            <h1 className="mt-4 font-[Poppins,Manrope,system-ui,sans-serif] text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] md:text-4xl lg:text-[2.6rem]">
              {pageSeo.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/88 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] md:text-base">
              {pageSeo.metaDescription}
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-12 w-full max-w-5xl"
          >
            <div className="pointer-events-none absolute -inset-1 rounded-[1.75rem] bg-gradient-to-r from-[#31C950]/35 via-white/10 to-[#4d9af6]/25 opacity-80 blur-xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Search</span>
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Title, block, keywords…"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none ring-0 transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:bg-black/30 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Listing type
                  </span>
                  <select
                    value={effectiveListingType}
                    onChange={(e) => {
                      setListingTypeChosenByUser(true)
                      setListingType(e.target.value)
                    }}
                    className="appearance-none rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  >
                    {LISTING_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.value} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Block</span>
                  <select
                    value={effectiveBlock}
                    onChange={(e) => {
                      setBlockChosenByUser(true)
                      setBlock(e.target.value)
                    }}
                    className="appearance-none rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  >
                    <option value="" className="bg-slate-900 text-white">
                      Any block
                    </option>
                    {PROPERTY_BLOCK_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Min price</span>
                  <input
                    inputMode="numeric"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="PKR"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Max price</span>
                  <input
                    inputMode="numeric"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="PKR"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
                <div className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Marlas</span>
                  <div className="flex gap-2">
                    <select
                      value={minMarlas}
                      onChange={(e) => setMinMarlas(e.target.value)}
                      aria-label="Min marlas"
                      className="min-w-0 flex-1 appearance-none rounded-xl border border-white/25 bg-black/20 px-3 py-3 text-[14px] text-white outline-none transition focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                    >
                      <option value="" className="bg-slate-900 text-white">
                        Min
                      </option>
                      {minMarlaSelectOptions.map((n) => (
                        <option key={`min-marla-${n}`} value={String(n)} className="bg-slate-900 text-white">
                          {n} Marla{n === 1 ? '' : 's'}
                        </option>
                      ))}
                    </select>
                    <select
                      value={maxMarlas}
                      onChange={(e) => setMaxMarlas(e.target.value)}
                      aria-label="Max marlas"
                      className="min-w-0 flex-1 appearance-none rounded-xl border border-white/25 bg-black/20 px-3 py-3 text-[14px] text-white outline-none transition focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                    >
                      <option value="" className="bg-slate-900 text-white">
                        Max
                      </option>
                      {maxMarlaSelectOptions.map((n) => (
                        <option key={`max-marla-${n}`} value={String(n)} className="bg-slate-900 text-white">
                          {n} Marla{n === 1 ? '' : 's'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Bedrooms</span>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="appearance-none rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  >
                    <option value="" className="bg-slate-900 text-white">
                      Any
                    </option>
                    {ROOM_COUNT_OPTIONS.map((n) => (
                      <option key={n} value={String(n)} className="bg-slate-900 text-white">
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Baths</span>
                  <select
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className="appearance-none rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  >
                    <option value="" className="bg-slate-900 text-white">
                      Any
                    </option>
                    {ROOM_COUNT_OPTIONS.map((n) => (
                      <option key={n} value={String(n)} className="bg-slate-900 text-white">
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5">
                <p className="text-[12px] text-white/65">
                  {loading ? 'Updating results…' : `${items.length} listing${items.length === 1 ? '' : 's'} shown`}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 transition hover:border-[#31C950]/55 hover:bg-[#31C950]/15"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </Motion.div>
        </div>
      </PageHero>

      <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%)]">
        <div className="container-shell pb-12 pt-5 sm:pt-6 md:pb-16 md:pt-8 lg:pb-20 lg:pt-10">
          <div className="mb-6 border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <PageBreadcrumbs
              variant="onLight"
              className="border-b border-slate-100 pb-3"
              items={[
                { to: '/', label: 'Home' },
                categorySeo ? { to: '/properties', label: 'Properties' } : { label: 'Properties' },
                ...(categorySeo ? [{ to: blockSeo ? `/properties/${categorySlug}` : undefined, label: categorySeo.breadcrumb }] : []),
                ...(blockSeo ? [{ label: blockSeo.breadcrumb }] : []),
              ]}
            />
            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-slate-600">
                {loading ? 'Loading listings…' : `${items.length} listing${items.length === 1 ? '' : 's'} found`}
              </p>

              <div className="inline-flex w-full items-center border border-slate-200 bg-white sm:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  className={`inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition sm:flex-none ${
                    viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <IconListView className="h-4 w-4" />
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex flex-1 items-center justify-center gap-2 border-l border-slate-200 px-3 py-2 text-sm font-medium transition sm:flex-none ${
                    viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <IconGridView className="h-4 w-4" />
                  Grid
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-rose-100 bg-rose-50/80 px-5 py-4 text-sm text-rose-800"
            >
              {error}
            </Motion.p>
          ) : null}

          {loading && !items.length ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-100/80 bg-white shadow-sm"
                >
                  <div className="aspect-[16/10] bg-slate-200" />
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-20 rounded bg-slate-200" />
                    <div className="h-5 w-full rounded bg-slate-200" />
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && !items.length && !error ? (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-sm"
            >
              <p className="text-lg font-semibold text-slate-800">No properties match your filters yet</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
                Try widening the price band, clearing the block, or searching with a shorter keyword. New inventory is
                added regularly from the admin panel.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#31C950] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(49,201,80,0.35)] transition hover:bg-[#28b048]"
              >
                Reset all filters
              </button>
            </Motion.div>
          ) : null}

          {items.length ? (
            <Motion.div
              key={`${filterKey}-${viewMode}`}
              variants={listParent}
              initial="hidden"
              animate="show"
              className={viewMode === 'list' ? 'space-y-5' : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}
            >
              {items.map((p) => {
                const img = cardImageUrl(p)
                const sizeMeta = getSizeMeta(p)
                const description = getPlainDescription(p)
                const propertyHref = propertyDetailPath(p)
                const telHref = `tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`

                return (
                  <Motion.article
                    key={`${p.id}-${p.slug}`}
                    variants={listItem}
                    whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                    className={`group relative overflow-hidden border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] ${
                      viewMode === 'list' ? 'rounded-xl shadow-sm' : 'rounded-lg shadow-sm'
                    }`}
                  >
                    {viewMode === 'list' ? (
                      <div className="grid gap-0 md:grid-cols-[minmax(280px,380px)_1fr]">
                        <Link to={propertyHref} className="relative block overflow-hidden bg-slate-100">
                          <div className="relative aspect-[16/11] h-full min-h-[190px] md:min-h-full">
                            {img ? (
                              <Motion.img
                                src={img}
                                alt=""
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-50 text-[12px] font-medium text-slate-400">
                                Image coming soon
                              </div>
                            )}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-80" />
                            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                              {p.is_featured ? (
                                <span className="bg-[#ef4444] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                                  Super Hot
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col p-4 md:p-6">
                          <h2 className="text-[1.1rem] font-semibold leading-snug tracking-tight text-slate-900 transition group-hover:text-[#1a3553] md:text-[1.38rem]">
                            <Link to={propertyHref} className="line-clamp-2">
                              {p.title}
                            </Link>
                          </h2>

                          <p className="mt-2 text-[1.35rem] font-semibold leading-none tracking-tight text-[#1a3553] md:text-[1.55rem]">
                            {formatCompactPkr(p.price)}
                          </p>

                          {p.block ? (
                            <p className="mt-1.5 text-[14px] text-slate-700 md:mt-2 md:text-[15px]">
                              Block {p.block}
                            </p>
                          ) : null}

                          {sizeMeta.length ? (
                            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-medium text-slate-700 md:mt-3 md:gap-x-4 md:gap-y-2 md:text-[13px]">
                              {sizeMeta.map((item) => {
                                const Icon = item.icon
                                return (
                                  <span key={item.key} className="inline-flex items-center gap-1.5">
                                    <Icon className="text-slate-700" size="h-4 w-4" />
                                    {item.label}
                                  </span>
                                )
                              })}
                            </div>
                          ) : null}

                          {description ? (
                            <div className="mt-3 md:mt-4">
                              <p className="line-clamp-2 text-[14px] leading-relaxed text-slate-600 md:line-clamp-3 md:text-sm">{description}</p>
                              <Link
                                to={propertyHref}
                                className="mt-1 hidden text-sm font-semibold text-[#31C950] transition hover:text-[#28b048] md:inline-flex"
                              >
                                See more
                              </Link>
                            </div>
                          ) : null}

                          <div className="mt-4 border-t border-slate-100 pt-3 md:mt-5 md:pt-4">
                            <div className={LISTING_CTA_ROW}>
                              <a
                                href={telHref}
                                className={listingCtaCallLinkClassSm}
                                aria-label={`Call about ${p.title}`}
                              >
                                <IconPhone className="shrink-0 !text-white" size="h-5 w-5" strokeWidth={2.1} />
                                CALL
                              </a>
                              <a
                                href={whatsappHref(p.title)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={listingCtaWhatsAppLinkClassSm}
                                aria-label={`WhatsApp about ${p.title}`}
                              >
                                <IconWhatsAppBrand className="shrink-0 text-white" size="h-5 w-5" />
                                WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col">
                        <Link to={propertyHref} className="relative block overflow-hidden bg-slate-100">
                          <div className="relative aspect-[16/11]">
                            {img ? (
                              <Motion.img
                                src={img}
                                alt=""
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-50 text-[12px] font-medium text-slate-400">
                                Image coming soon
                              </div>
                            )}
                            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                              {p.is_featured ? (
                                <span className="bg-[#ef4444] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                                  Super Hot
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>

                        <div className="flex flex-1 flex-col p-4">
                          <p className="text-[11px] text-slate-400">
                            {p.block ? `Block ${p.block}` : p.listing_type_display || 'Property'}
                          </p>

                          <p className="mt-2 text-[1.1rem] font-semibold leading-none text-[#1a3553]">
                            {formatCompactPkr(p.price)}
                          </p>

                          <h2 className="mt-2 text-[1.05rem] font-semibold leading-snug text-slate-900">
                            <Link to={propertyHref} className="line-clamp-2">
                              {p.title}
                            </Link>
                          </h2>

                          {sizeMeta.length ? (
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium text-slate-700">
                              {sizeMeta.map((item) => {
                                const Icon = item.icon
                                return (
                                  <span key={item.key} className="inline-flex items-center gap-1">
                                    <Icon className="text-slate-700" size="h-4 w-4" />
                                    {item.label}
                                  </span>
                                )
                              })}
                            </div>
                          ) : null}

                          {description ? (
                            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{description}</p>
                          ) : null}

                          <div className="mt-auto w-full pt-4">
                            <div className={LISTING_CTA_ROW}>
                              <a
                                href={telHref}
                                className={listingCtaCallLinkClassSm}
                                aria-label={`Call about ${p.title}`}
                              >
                                <IconPhone className="shrink-0 !text-white" size="h-5 w-5" strokeWidth={2.1} />
                                CALL
                              </a>
                              <a
                                href={whatsappHref(p.title)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={listingCtaWhatsAppLinkClassSm}
                                aria-label={`WhatsApp about ${p.title}`}
                              >
                                <IconWhatsAppBrand className="shrink-0 text-white" size="h-5 w-5" />
                                WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Motion.article>
                )
              })}
            </Motion.div>
          ) : null}

          {showLoadMore ? (
            <div className="mt-12 flex justify-center">
              <Motion.button
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-slate-200 bg-white px-8 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-800 shadow-sm transition hover:border-[#31C950]/45 hover:bg-[#31C950]/6 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? 'Loading…' : 'Load more listings'}
              </Motion.button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Properties

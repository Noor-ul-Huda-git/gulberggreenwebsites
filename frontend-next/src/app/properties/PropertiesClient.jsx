'use client'

import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion as Motion } from 'framer-motion'
import PageBreadcrumbs from '../../components/layout/PageBreadcrumbs.jsx'
import {
  IconBath,
  IconBed,
  IconCamera,
  IconExpandArea,
  IconPhone,
  IconRuler,
  IconShieldCheck,
  IconWhatsAppBrand,
} from '../../components/properties/PropertyIcons.jsx'
import {
  LISTING_TYPE_OPTIONS,
  PROPERTY_BLOCK_OPTIONS,
  PROPERTY_CATEGORY_SEO,
  PROPERTY_LISTING_TYPE_SLUGS,
  propertyBlockFromSlug,
  propertyBlockSeo,
  propertyDetailPath,
  slugifyPropertyBlock,
} from '../../data/propertyListingTypes.js'
import { contactInfo } from '../../data/siteContent.js'
import { STATIC_PAGE_SEO } from '../../data/staticPageSeo.js'
import { fetchProperties } from '../../lib/api.js'
import { appPath } from '../../lib/appPaths.js'

/*
 * Size options shown in the search box (values are in Marla).
 * 1 Kanal = 20 Marla
 */

const EMPTY_PROPERTIES = []

const SIZE_OPTIONS = [
  { value: '', label: 'Any Size' },
  { value: '5', label: '5 Marla' },
  { value: '7', label: '7 Marla' },
  { value: '10', label: '10 Marla' },
  { value: '20', label: '1 Kanal' },
  { value: '30', label: '1.5 Kanal' },
  { value: '40', label: '2 Kanal' },
  { value: '50', label: '2.5 Kanal' },
  { value: '60', label: '3 Kanal' },
  { value: '70', label: '3.5 Kanal' },
]

const ROOM_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8]

const ALLOWED_LISTING_TYPE = new Set(
  LISTING_TYPE_OPTIONS.map((o) => o.value).filter(Boolean),
)

/* =========================================================
   URL HELPERS (SEO URL structure unchanged)
   ========================================================= */

function filterQueryFingerprint(sp) {
  const entries = [...sp.entries()].filter(
    ([, v]) => v !== null && String(v).trim() !== '',
  )
  entries.sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([k, v]) => `${k}=${v}`).join('&')
}

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

const LISTING_TYPE_QUERY_KEY = 'listing_type'

const ALL_REWRITTABLE_QUERY_KEYS = [
  ...EXTRA_FILTER_KEYS,
  LISTING_TYPE_QUERY_KEY,
  'block',
]

function normalizeListingPath(pathname) {
  const p = pathname.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

/**
 * Canonical listing URL:
 * /properties/
 * /properties/{category}/
 * /properties/{category}/{blockSlug}/
 */
function desiredPropertiesListingPath(listingType, blockLabel) {
  const blockSeg = slugifyPropertyBlock(String(blockLabel || '').trim())

  if (!listingType) {
    if (!blockSeg) return appPath('properties')
    return appPath('properties', 'all', blockSeg)
  }

  const slug = PROPERTY_LISTING_TYPE_SLUGS[listingType]

  if (!slug) {
    if (!blockSeg) return appPath('properties')
    return appPath('properties', 'all', blockSeg)
  }

  if (!blockSeg) return appPath('properties', slug)

  return appPath('properties', slug, blockSeg)
}

function isBarePropertiesListingPath(pathname) {
  return normalizeListingPath(pathname) === '/properties'
}

function readExtraFiltersFromSearchParams(sp) {
  const get = (k) => sp.get(k)?.trim() ?? ''

  return {
    search: get('search'),
    minPrice: get('min_price'),
    maxPrice: get('max_price'),
    minMarlas: get('min_marlas') || get('min_marla'),
    maxMarlas: get('max_marlas') || get('max_marla'),
    bedrooms: get('bedrooms'),
    baths: get('baths'),
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

function validRoomCount(value) {
  const n = Number(value)
  return value && ROOM_COUNT_OPTIONS.includes(n) ? String(n) : ''
}

function createInitialFilterSnapshot(pathname, search, forcedListingType, forcedBlock) {
  const qp = new URLSearchParams(String(search || '').replace(/^\?/, ''))
  const extras = readExtraFiltersFromSearchParams(qp)

  const listingType = forcedListingType
    ? forcedListingType
    : readListingTypeFromSearchWhenAllowed(qp, forcedListingType, pathname)

  const block = forcedBlock
    ? String(forcedBlock)
    : readBlockFromSearchWhenAllowed(qp, forcedBlock)

  return {
    ...extras,
    bedrooms: validRoomCount(extras.bedrooms),
    baths: validRoomCount(extras.baths),
    listingType,
    block,
  }
}

function buildExtraFilterSearchParams(extras, baseParams) {
  const p = new URLSearchParams(
    typeof baseParams === 'string' ? baseParams : baseParams?.toString() || '',
  )

  for (const k of ALL_REWRITTABLE_QUERY_KEYS) p.delete(k)

  const pairs = [
    ['search', extras.search],
    ['min_price', extras.minPrice],
    ['max_price', extras.maxPrice],
    ['min_marlas', extras.minMarlas],
    ['max_marlas', extras.maxMarlas],
    ['bedrooms', extras.bedrooms],
    ['baths', extras.baths],
  ]

  for (const [key, value] of pairs) {
    if (value) p.set(key, String(value).trim())
  }

  return p
}

function canonicalListingUrlKey(pathname, search) {
  const path = normalizeListingPath(pathname)
  const qs = new URLSearchParams(String(search || '').replace(/^\?/, ''))
  const fp = filterQueryFingerprint(qs)
  return fp ? `${path}?${fp}` : path
}

/* =========================================================
   DISPLAY HELPERS
   ========================================================= */

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

  return String(source)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatMarlasValue(value) {
  if (value == null || value === '') return ''

  const num = Number(value)
  if (!Number.isNaN(num) && Number.isInteger(num)) return String(num)

  return String(value).replace(/\.?0+$/, '')
}

function formatArea(property) {
  if (property.area_marlas == null || property.area_marlas === '') return ''

  const unit = property.area_unit_display || 'Marla'
  const marlas = formatMarlasValue(property.area_marlas)
  const plural = Number(marlas) === 1 || unit.endsWith('s') ? '' : 's'

  return `${marlas} ${unit}${plural}`
}

/* =========================================================
   FILTER MATCHING (flexible, so small spelling/format
   differences between dropdown values and API data
   don't hide existing properties)
   ========================================================= */

// "Farm House", "farm_house", "FARMHOUSE" -> "farmhouse"
function norm(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

// "Block A", "block-a", "A" -> "a"   |   "Executive Block" -> "executive"
function normBlock(value) {
  return norm(value).replace(/^block/, '').replace(/block$/, '')
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null
  const n = Number(value)
  return Number.isNaN(n) ? null : n
}

// Converts the property's area to Marla (1 Kanal = 20 Marla)
function propertyAreaInMarlas(property) {
  const n = Number(property.area_marlas)
  if (property.area_marlas == null || property.area_marlas === '' || Number.isNaN(n)) {
    return NaN
  }

  const unit = String(property.area_unit_display || property.area_unit || '').toLowerCase()

  return unit.includes('kanal') ? n * 20 : n
}

// Singular form so "plots"/"plot" and "Plots"/"PLOTS" compare equal
function normType(value) {
  return norm(value).replace(/s$/, '')
}

/*
 * Dropdown values (plots, commercial_plots, farmhouse, house, flat,
 * office, shop) are the same keys the admin saves in
 * property.listing_type, so that field is compared first.
 * listing_type_display ("PLOTS", "FARMHOUSE") is a fallback.
 */
function matchesListingType(property, selected) {
  const option = LISTING_TYPE_OPTIONS.find((o) => o.value === selected)
  const wanted = new Set([normType(selected), normType(option?.label)].filter(Boolean))
  if (!wanted.size) return true

  if (property.listing_type) {
    return wanted.has(normType(property.listing_type))
  }

  return wanted.has(normType(property.listing_type_display))
}

function matchesBlock(property, selectedBlock) {
  const wanted = normBlock(selectedBlock)
  if (!wanted) return true

  if (property.block) {
    return normBlock(property.block) === wanted
  }

  // If the block field is empty, look in the location text
  const location = norm(property.location)
  return location.includes(`block${wanted}`) || location.includes(`${wanted}block`)
}

function filterProperties(source, filters) {
  const wantedSearch = norm(filters.search)
  const wantedType = filters.listing_type || ''
  const wantedBlock = filters.block || ''
  const minM = toNumberOrNull(filters.min_marlas)
  const maxM = toNumberOrNull(filters.max_marlas)
  const minP = toNumberOrNull(filters.min_price)
  const maxP = toNumberOrNull(filters.max_price)
  const beds = toNumberOrNull(filters.bedrooms)
  const baths = toNumberOrNull(filters.baths)

  return source.filter((p) => {
    if (wantedSearch) {
      const text = norm(
        [
          p.title,
          p.slug,
          p.location,
          p.block,
          p.listing_type,
          p.listing_type_display,
          p.category,
          p.plot_number,
          p.short_description,
          getPlainDescription(p),
        ].join(' '),
      )
      if (!text.includes(wantedSearch)) return false
    }

    if (wantedType && !matchesListingType(p, wantedType)) return false

    if (wantedBlock && !matchesBlock(p, wantedBlock)) return false

    if (minM !== null || maxM !== null) {
      const area = propertyAreaInMarlas(p)
      if (Number.isNaN(area)) return false
      if (minM !== null && area < minM - 0.01) return false
      if (maxM !== null && area > maxM + 0.01) return false
    }

    if ((minP !== null || maxP !== null) && p.price != null && p.price !== '') {
      const price = Number(p.price)
      if (!Number.isNaN(price)) {
        if (minP !== null && price < minP) return false
        if (maxP !== null && price > maxP) return false
      }
    }

    if (beds !== null && Number(p.bedrooms) < beds) return false
    if (baths !== null && Number(p.baths) < baths) return false

    return true
  })
}

function extractRecords(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.results)) return response.results
  if (Array.isArray(response?.data)) return response.data
  return []
}

/*
 * Full listing kept in memory for the browser session, so moving
 * between /properties and the SEO filter URLs never loses it.
 */
let allPropertiesCache = []

function rememberAllProperties(list) {
  if (Array.isArray(list) && list.length >= allPropertiesCache.length) {
    allPropertiesCache = list
  }
}

/*
 * Updates the address bar (SEO URL structure unchanged) without
 * reloading the page, so the listing already on screen is filtered
 * in place instead of being fetched again for the new URL.
 * usePathname/useSearchParams stay in sync (Next.js 14.1+).
 */
function replaceUrlWithoutReload(href) {
  if (typeof window === 'undefined') return

  const current = `${window.location.pathname}${window.location.search}`
  if (current === href) return

  // Wait one tick so the Next.js router has finished initializing
  window.setTimeout(() => {
    const now = `${window.location.pathname}${window.location.search}`
    if (now !== href) window.history.replaceState(null, '', href)
  }, 0)
}

// Fresh API data first, then any server items the API didn't return
function mergeById(fresh, existing) {
  const seen = new Set()
  const merged = []

  for (const item of [...fresh, ...existing]) {
    const key = item?.id ?? item?.slug
    if (key == null) {
      merged.push(item)
      continue
    }
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }

  return merged
}

/* =========================================================
   WHATSAPP / IMAGES
   ========================================================= */

function whatsappHref(property, propertyHref, imageUrl) {
  const phone = contactInfo.phone.replace(/\D/g, '')

  const absolutePropertyUrl = propertyHref.startsWith('http')
    ? propertyHref
    : `https://gulberggreens.com.pk${propertyHref.startsWith('/') ? '' : '/'}${propertyHref}`

  let absoluteImageUrl = imageUrl || ''

  if (absoluteImageUrl) {
    if (absoluteImageUrl.startsWith('http://127.0.0.1:8000')) {
      absoluteImageUrl = absoluteImageUrl.replace(
        'http://127.0.0.1:8000',
        'https://gulberggreens.com.pk',
      )
    } else if (absoluteImageUrl.startsWith('/')) {
      absoluteImageUrl = `https://gulberggreens.com.pk${absoluteImageUrl}`
    } else if (!absoluteImageUrl.startsWith('http')) {
      absoluteImageUrl = `https://gulberggreens.com.pk/${absoluteImageUrl.replace(/^\/+/, '')}`
    }
  }

  const text = encodeURIComponent(
    [
      `Assalam o Alaikum, I am interested in: ${property?.title || ''}`,
      '',
      `Property Link: ${absolutePropertyUrl}`,
      `Property Image: ${absoluteImageUrl || 'Image available on the property page'}`,
    ].join('\n'),
  )

  return `https://wa.me/${phone}?text=${text}`
}

function IconLocation({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function IconListView({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path
        d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGridView({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path
        d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const DEFAULT_PROPERTY_IMAGE =
  '/images/gulberg-greens-islamabad-official-ibechs-gated-community-640w.webp'

function cardImageUrl(p) {
  if (p.card_image_url) return p.card_image_url
  if (p.featured_image_url) return p.featured_image_url

  if (p.featured_image) {
    return p.featured_image.startsWith('http')
      ? p.featured_image
      : `http://127.0.0.1:8000${p.featured_image.startsWith('/') ? '' : '/'}${p.featured_image}`
  }

  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0].url) {
    return p.images[0].url
  }

  return DEFAULT_PROPERTY_IMAGE
}

function handleImageError(e) {
  const currentSrc = e.currentTarget.src || ''

  if (currentSrc.includes('/media/') && !currentSrc.includes('gulberggreens.com.pk')) {
    const parts = currentSrc.split('/media/')
    if (parts[1]) {
      e.currentTarget.src = `https://gulberggreens.com.pk/media/${parts[1]}`
      return
    }
  }

  if (!currentSrc.includes('gulberg-greens-islamabad-official-ibechs-gated-community')) {
    e.currentTarget.src = DEFAULT_PROPERTY_IMAGE
  }
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

const selectClass =
  'h-11 w-full appearance-none rounded-[9px] border border-slate-200 bg-white pl-10 pr-9 text-[13px] text-[#24476c] outline-none transition hover:border-slate-300 focus:border-[#008f82] focus:ring-2 focus:ring-[#008f82]/10'

const filterLabelClass =
  'text-[11px] font-semibold uppercase tracking-[0.12em] text-[#355477]'

/* =========================================================
   COMPONENT
   ========================================================= */

function Properties({ initialItems = EMPTY_PROPERTIES }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlSearch = searchParams.toString()

  const pathParts = useMemo(() => {
    const normalized = pathname.replace(/\/+$/, '')
    const prefix = '/properties/'

    return normalized.startsWith(prefix)
      ? normalized.slice(prefix.length).split('/').filter(Boolean)
      : []
  }, [pathname])

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

  const initialSnapshot = useMemo(
    () => createInitialFilterSnapshot(pathname, urlSearch, forcedListingType, forcedBlock),
    [pathname, urlSearch, forcedListingType, forcedBlock],
  )

  /* ---------------- filter state ---------------- */

  const [searchInput, setSearchInput] = useState(initialSnapshot.search)
  const [search, setSearch] = useState(initialSnapshot.search)
  const [listingType, setListingType] = useState(initialSnapshot.listingType)
  const [block, setBlock] = useState(initialSnapshot.block)
  const [listingTypeChosenByUser, setListingTypeChosenByUser] = useState(false)
  const [blockChosenByUser, setBlockChosenByUser] = useState(false)

  // Kept internally so old URLs keep working (not shown in UI)
  const [minPrice, setMinPrice] = useState(initialSnapshot.minPrice)
  const [maxPrice, setMaxPrice] = useState(initialSnapshot.maxPrice)
  const [minMarlas, setMinMarlas] = useState(initialSnapshot.minMarlas)
  const [maxMarlas, setMaxMarlas] = useState(initialSnapshot.maxMarlas)
  const [bedrooms, setBedrooms] = useState(initialSnapshot.bedrooms)
  const [baths, setBaths] = useState(initialSnapshot.baths)

  const [size, setSize] = useState(
    initialSnapshot.minMarlas && initialSnapshot.minMarlas === initialSnapshot.maxMarlas
      ? initialSnapshot.minMarlas
      : '',
  )

  /* ---------------- data state ---------------- */

  const startingItems = useMemo(() => {
    const serverItems = Array.isArray(initialItems) ? initialItems : []
    return allPropertiesCache.length
      ? mergeById(allPropertiesCache, serverItems)
      : serverItems
  }, [initialItems])

  const [sourceItems, setSourceItems] = useState(startingItems)
  const [sourceLoading, setSourceLoading] = useState(!startingItems.length)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('list')

  /*
   * The search box always filters the FULL listing.
   * - Server items and the in-memory copy of the full list are shown first.
   * - Fresh API data is then loaded and merged in.
   * An error is only shown when there is no listing at all to show.
   */
  useEffect(() => {
    let cancelled = false

    const known = startingItems

    if (known.length) {
      rememberAllProperties(known)
      setSourceItems(known)
      setSourceLoading(false)
    } else {
      setSourceLoading(true)
    }

    async function loadProperties() {
      try {
        const response = await fetchProperties()
        const records = extractRecords(response)

        if (cancelled) return

        if (records.length) {
          const merged = mergeById(records, known)
          rememberAllProperties(merged)
          setSourceItems(merged)
          setError(null)
        }
      } catch (err) {
        if (!cancelled && !known.length && !allPropertiesCache.length) {
          setError('No Properties Found. Try Again.')
        }
      } finally {
        if (!cancelled) setSourceLoading(false)
      }
    }

    loadProperties()

    return () => {
      cancelled = true
    }
  }, [startingItems])

  const effectiveListingType = listingTypeChosenByUser
    ? listingType.trim()
    : listingType.trim() || forcedListingType

  const blockTrimmed = block.trim()

  const effectiveBlock = blockChosenByUser ? blockTrimmed : blockTrimmed || forcedBlock || ''

  /* ---------------- sync state from URL ---------------- */

  useLayoutEffect(() => {
    const qp = new URLSearchParams(urlSearch.replace(/^\?/, ''))
    const extras = readExtraFiltersFromSearchParams(qp)

    setSearch(extras.search)
    setSearchInput(extras.search)
    setMinPrice(extras.minPrice)
    setMaxPrice(extras.maxPrice)
    setMinMarlas(extras.minMarlas)
    setMaxMarlas(extras.maxMarlas)
    setBedrooms(validRoomCount(extras.bedrooms))
    setBaths(validRoomCount(extras.baths))
    setSize(
      extras.minMarlas && extras.minMarlas === extras.maxMarlas ? extras.minMarlas : '',
    )

    setListingTypeChosenByUser(false)
    setBlockChosenByUser(false)

    setListingType(
      forcedListingType ||
        readListingTypeFromSearchWhenAllowed(qp, forcedListingType, pathname),
    )

    setBlock(forcedBlock || readBlockFromSearchWhenAllowed(qp, forcedBlock))
  }, [pathname, urlSearch, forcedListingType, forcedBlock])

  /* ---------------- search debounce ---------------- */

  useEffect(() => {
    const t = window.setTimeout(() => setSearch(searchInput), 380)
    return () => window.clearTimeout(t)
  }, [searchInput])

  /* ---------------- URL synchronization (SEO paths unchanged) ---------------- */

  useEffect(() => {
    const desiredPath = desiredPropertiesListingPath(effectiveListingType, effectiveBlock)

    const baseQs = new URLSearchParams(urlSearch.replace(/^\?/, ''))

    const nextQs = buildExtraFilterSearchParams(
      { search, minPrice, maxPrice, minMarlas, maxMarlas, bedrooms, baths },
      baseQs,
    )

    const targetKey = canonicalListingUrlKey(desiredPath, nextQs.toString())
    const currentKey = canonicalListingUrlKey(pathname, urlSearch)

    if (targetKey === currentKey) return

    const nextSearch = nextQs.toString()
    replaceUrlWithoutReload(nextSearch ? `${desiredPath}?${nextSearch}` : desiredPath)
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
    pathname,
    urlSearch,
  ])

  /* ---------------- filtering ---------------- */

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
    [
      search,
      effectiveListingType,
      effectiveBlock,
      minPrice,
      maxPrice,
      minMarlas,
      maxMarlas,
      bedrooms,
      baths,
    ],
  )

  const filterKey = useMemo(() => JSON.stringify(filterParams), [filterParams])

  // Filtering is instant and always runs on the full loaded list
  const items = useMemo(
    () => filterProperties(sourceItems, filterParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sourceItems, filterKey],
  )

  /* ---------------- handlers ---------------- */

  const handleSizeChange = (value) => {
    setSize(value)
    setMinMarlas(value || '')
    setMaxMarlas(value || '')
  }

  const handleFindProperties = () => {
    setSearch(searchInput)

    document
      .getElementById('listings')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resetFilters = () => {
    setSearchInput('')
    setSearch('')
    setListingTypeChosenByUser(false)
    setBlockChosenByUser(false)
    setListingType(forcedListingType)
    setBlock(forcedBlock || '')
    setMinPrice('')
    setMaxPrice('')
    setMinMarlas('')
    setMaxMarlas('')
    setBedrooms('')
    setBaths('')
    setSize('')

    const cleared = new URLSearchParams(urlSearch.replace(/^\?/, ''))
    for (const k of ALL_REWRITTABLE_QUERY_KEYS) cleared.delete(k)

    const clearedSearch = cleared.toString()
    replaceUrlWithoutReload(clearedSearch ? `${pathname}?${clearedSearch}` : pathname)
  }

  /* ---------------- render ---------------- */

  return (
    <div className="min-h-screen bg-[#f6f9fa] font-[Poppins,Manrope,system-ui,sans-serif]">
      {/* =====================================================
          HERO / FILTER AREA
          ===================================================== */}

      <section className="border-b border-slate-100 bg-[#f6f9fa]">
        <div className="container-shell px-4 pb-10 pt-24 md:pb-12 md:pt-28">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-5xl"
          >
            <div className="mb-7 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#31C950]">
                Curated inventory
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] text-[#1a3553] md:text-4xl">
                {pageSeo.h1}
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
                {pageSeo.metaDescription}
              </p>
            </div>

            {/* FILTER CARD */}

            <div className="rounded-[1.25rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_15px_40px_rgba(15,23,42,0.07)] md:px-6 md:py-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.35fr_1.05fr_1fr_auto] lg:items-end">
                {/* LOCATION / BLOCK */}

                <label className="flex flex-col gap-1.5 text-left">
                  <span className={filterLabelClass}>Location / Block</span>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#008f82]">
                      <IconLocation className="h-5 w-5" />
                    </span>

                    <select
                      value={effectiveBlock}
                      onChange={(e) => {
                        setBlockChosenByUser(true)
                        setBlock(e.target.value)
                      }}
                      className={selectClass}
                    >
                      <option value="">All Locations / Blocks</option>

                      {PROPERTY_BLOCK_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                {/* PROPERTY TYPE */}

                <label className="flex flex-col gap-1.5 text-left">
                  <span className={filterLabelClass}>Property Type</span>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#008f82]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                        <path d="M4 20V9l8-5 8 5v11H4Z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>

                    <select
                      value={effectiveListingType}
                      onChange={(e) => {
                        setListingTypeChosenByUser(true)
                        setListingType(e.target.value)
                      }}
                      className={selectClass}
                    >
                      {LISTING_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                {/* SIZE */}

                <label className="flex flex-col gap-1.5 text-left">
                  <span className={filterLabelClass}>Size</span>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#008f82]">
                      <IconRuler className="h-5 w-5" />
                    </span>

                    <select
                      value={size}
                      onChange={(e) => handleSizeChange(e.target.value)}
                      className={selectClass}
                    >
                      {SIZE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                {/* FIND PROPERTIES */}

                <button
                  type="button"
                  onClick={handleFindProperties}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] bg-[#008f82] px-5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(0,143,130,0.18)] transition hover:bg-[#00796f] hover:shadow-[0_10px_22px_rgba(0,143,130,0.23)] focus:outline-none focus:ring-2 focus:ring-[#008f82]/20 active:scale-[0.98] lg:min-w-[126px]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" strokeLinecap="round" />
                  </svg>

                  <span>Find Properties</span>
                </button>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* =====================================================
          LISTINGS
          ===================================================== */}

      <div id="listings" className="scroll-mt-24 border-b border-slate-100 bg-white">
        <div className="container-shell pb-12 pt-6 sm:pt-7 md:pb-16 md:pt-8 lg:pb-20 lg:pt-10">
          {/* BREADCRUMBS + VIEW */}

          <div className="mb-6 border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <PageBreadcrumbs
              variant="onLight"
              className="border-b border-slate-100 pb-3"
              items={[
                { to: '/', label: 'Home' },

                categorySeo
                  ? { to: '/properties', label: 'Properties' }
                  : { label: 'Properties' },

                ...(categorySeo
                  ? [
                      {
                        to: blockSeo ? `/properties/${categorySlug}` : undefined,
                        label: categorySeo.breadcrumb,
                      },
                    ]
                  : []),

                ...(blockSeo ? [{ label: blockSeo.breadcrumb }] : []),
              ]}
            />

            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-slate-600">
                {sourceLoading
                  ? 'Loading listings…'
                  : `${items.length} listing${items.length === 1 ? '' : 's'} found`}
              </p>

              <div className="inline-flex w-full items-center border border-slate-200 bg-white sm:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  className={`inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition sm:flex-none ${
                    viewMode === 'list' ? 'bg-[#1a3553] text-white' : 'text-slate-600 hover:bg-slate-50'
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
                    viewMode === 'grid' ? 'bg-[#1a3553] text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <IconGridView className="h-4 w-4" />
                  Grid
                </button>
              </div>
            </div>
          </div>

          {/* ERROR */}

          {error ? (
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-800"
            >
              {error}
            </Motion.p>
          ) : null}

          {/* LOADING */}

          {sourceLoading && !items.length ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
                >
                  <div className="aspect-[16/10] bg-slate-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-20 rounded bg-slate-200" />
                    <div className="h-5 w-full rounded bg-slate-200" />
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* EMPTY */}

          {!sourceLoading && !items.length && !error ? (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-sm"
            >
              <p className="text-lg font-semibold text-slate-800">
                No properties match your filters yet
              </p>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
                Try widening the price band, clearing the block, or searching with a shorter keyword. New inventory is added regularly from the admin panel.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#008f82] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#00796f]"
              >
                Reset all filters
              </button>
            </Motion.div>
          ) : null}

          {/* =================================================
              PROPERTY CARDS
              ================================================= */}

          {items.length ? (
            <Motion.div
              key={`${filterKey}-${viewMode}`}
              variants={listParent}
              initial="hidden"
              animate="show"
              className={viewMode === 'list' ? 'space-y-3' : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}
            >
              {items.map((p) => {
                const img = cardImageUrl(p)
                const description = getPlainDescription(p)
                const propertyHref = propertyDetailPath(p)
                const imageCount = Array.isArray(p.images) && p.images.length > 0 ? p.images.length : 1
                const telHref = `tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`
                const locationText =
                  p.location || (p.block ? `Gulberg Greens - Block ${p.block}` : 'Gulberg Greens')
                const areaText = formatArea(p)

                return (
                  <Motion.article
                    key={`${p.id}-${p.slug}`}
                    variants={listItem}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                    }}
                    className="group relative w-full max-w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                  >
                    {viewMode === 'list' ? (
                      /* ================= LIST VIEW ================= */

                      <div className="grid h-[140px] w-full max-w-full grid-cols-[112px_minmax(0,1fr)] overflow-hidden sm:h-[165px] sm:grid-cols-[160px_minmax(0,1fr)] md:h-[215px] md:grid-cols-[270px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
                        {/* IMAGE */}

                        <div className="relative h-full w-full overflow-hidden bg-slate-100">
                          <Link href={propertyHref} className="block h-full w-full">
                            <Motion.img
                              src={img}
                              alt={p.title || 'Gulberg Greens Property'}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={handleImageError}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
                          </Link>

                          <div className="pointer-events-none absolute left-1 top-1 flex items-center gap-1 sm:left-3 sm:top-3">
                            {p.is_featured ? (
                              <span className="rounded bg-[#ef4444] px-1 py-0.5 text-[7px] font-bold uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
                                FEATURED
                              </span>
                            ) : null}

                            <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[#22a45a] shadow-sm sm:h-5 sm:w-5">
                              <IconShieldCheck className="h-2.5 w-2.5 text-[#22a45a] sm:h-3.5 sm:w-3.5" />
                            </div>
                          </div>

                          <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[8px] font-medium text-white backdrop-blur-sm sm:bottom-3 sm:left-3 sm:text-[11px]">
                            <IconCamera className="h-2.5 w-2.5 text-white sm:h-3.5 sm:w-3.5" />
                            <span>{imageCount}</span>
                          </div>
                        </div>

                        {/* CONTENT */}

                        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden p-1.5 pb-10 sm:justify-between sm:p-3 md:p-4">
                          <div className="min-w-0">
                            <h2 className="truncate text-[11px] font-bold leading-snug text-slate-900 transition group-hover:text-[#0d8272] sm:text-[14px] md:text-[15px]">
                              <Link href={propertyHref} className="block truncate">
                                {p.title}
                              </Link>
                            </h2>

                            <p className="mt-0.5 truncate text-[13px] font-extrabold tracking-tight text-[#0f243c] sm:mt-1 sm:text-lg md:text-xl">
                              {formatCompactPkr(p.price)}
                            </p>

                            <p className="mt-0.5 flex items-center gap-0.5 truncate text-[9px] font-medium text-slate-500 sm:mt-1 sm:gap-1 sm:text-xs">
                              <IconLocation className="h-2.5 w-2.5 shrink-0 text-[#0d9488] sm:h-3.5 sm:w-3.5" />
                              <span className="truncate">{locationText}</span>
                            </p>

                            <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1 overflow-hidden sm:mt-1.5 sm:gap-1.5">
                              {p.listing_type_display ? (
                                <span className="shrink-0 rounded bg-[#e6f7f4] px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#0d8272] sm:px-1.5 sm:text-[10px]">
                                  {p.listing_type_display}
                                </span>
                              ) : null}

                              {p.block ? (
                                <span className="shrink-0 rounded bg-[#f1f5f9] px-1 py-0.5 text-[8px] font-semibold text-[#475569] sm:px-1.5 sm:text-[10px]">
                                  Block {p.block}
                                </span>
                              ) : null}

                              {p.bedrooms && Number(p.bedrooms) > 0 ? (
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold text-slate-700 sm:text-[11px]">
                                  <IconBed className="h-2.5 w-2.5 text-slate-500 sm:h-3 sm:w-3" />
                                  {p.bedrooms}
                                </span>
                              ) : null}

                              {p.baths && Number(p.baths) > 0 ? (
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold text-slate-700 sm:text-[11px]">
                                  <IconBath className="h-2.5 w-2.5 text-slate-500 sm:h-3 sm:w-3" />
                                  {p.baths}
                                </span>
                              ) : null}

                              {areaText ? (
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold text-slate-700 sm:text-[11px]">
                                  <IconExpandArea className="h-2.5 w-2.5 text-slate-500 sm:h-3 sm:w-3" />
                                  {areaText}
                                </span>
                              ) : null}
                            </div>

                            {description ? (
                              <p className="mt-1 hidden text-xs font-normal leading-relaxed text-slate-500 sm:line-clamp-1 md:line-clamp-2">
                                {description}
                              </p>
                            ) : null}
                          </div>

                          {/* ACTIONS */}

                          <div className="absolute bottom-2 left-1.5 right-1.5 flex min-w-0 items-center justify-between border-t border-slate-100 pt-1 sm:static sm:mt-auto sm:w-full sm:pt-2">
                            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                              <a
                                href={whatsappHref(p, propertyHref, img)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-[36px] shrink-0 items-center justify-center rounded-md border border-[#25D366] bg-white px-0 py-0.5 text-[10px] font-semibold text-slate-800 transition hover:bg-[#25D366] hover:text-white active:scale-95 sm:w-auto sm:gap-1 sm:px-3 sm:py-1 sm:text-xs"
                                aria-label={`WhatsApp about ${p.title}`}
                              >
                                <IconWhatsAppBrand className="h-3 w-3 shrink-0 text-[#25D366] sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </a>

                              <a
                                href={telHref}
                                className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-[#22c55e] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#16a34a] active:scale-95 sm:gap-1 sm:px-3.5 sm:py-1 sm:text-xs"
                                aria-label={`Call about ${p.title}`}
                              >
                                <IconPhone className="h-3 w-3 shrink-0 text-white sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                                <span className="text-white">CALL</span>
                              </a>
                            </div>

                            <Link
                              href={propertyHref}
                              className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 sm:px-3.5 sm:py-1 sm:text-xs"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ================= GRID VIEW ================= */

                      <div className="flex h-full flex-col">
                        <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                          <Link href={propertyHref} className="block h-full w-full">
                            <Motion.img
                              src={img}
                              alt={p.title || 'Gulberg Greens Property'}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={handleImageError}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
                          </Link>

                          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5">
                            {p.is_featured ? (
                              <span className="rounded bg-[#ef4444] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                FEATURED
                              </span>
                            ) : null}

                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#22a45a] shadow-sm">
                              <IconShieldCheck className="h-3.5 w-3.5 text-[#22a45a]" />
                            </div>
                          </div>

                          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                            <IconCamera className="h-3.5 w-3.5 text-white" />
                            <span>{imageCount}</span>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                          <h2 className="text-sm font-bold text-slate-900 transition group-hover:text-[#0d8272]">
                            <Link href={propertyHref} className="line-clamp-1">
                              {p.title}
                            </Link>
                          </h2>

                          <p className="mt-1.5 text-xl font-extrabold tracking-tight text-[#0f243c]">
                            {formatCompactPkr(p.price)}
                          </p>

                          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <IconLocation className="h-3.5 w-3.5 shrink-0 text-[#0d9488]" />
                            <span className="truncate">{locationText}</span>
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {p.listing_type_display ? (
                              <span className="rounded bg-[#e6f7f4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d8272]">
                                {p.listing_type_display}
                              </span>
                            ) : null}

                            {p.block ? (
                              <span className="rounded bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                                Block {p.block}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                            {p.bedrooms && Number(p.bedrooms) > 0 ? (
                              <span className="inline-flex items-center gap-1">
                                <IconBed className="h-3.5 w-3.5 text-slate-600" />
                                {p.bedrooms}
                              </span>
                            ) : null}

                            {p.baths && Number(p.baths) > 0 ? (
                              <span className="inline-flex items-center gap-1">
                                <IconBath className="h-3.5 w-3.5 text-slate-600" />
                                {p.baths}
                              </span>
                            ) : null}

                            {areaText ? (
                              <span className="inline-flex items-center gap-1">
                                <IconExpandArea className="h-3.5 w-3.5 text-slate-600" />
                                {areaText}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-auto pt-4">
                            <div className="flex items-center gap-2">
                              <a
                                href={whatsappHref(p, propertyHref, img)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[#25D366] bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-[#25D366] hover:text-white active:scale-95"
                                aria-label={`WhatsApp about ${p.title}`}
                              >
                                <IconWhatsAppBrand className="h-4 w-4 text-[#25D366]" />
                                <span>WhatsApp</span>
                              </a>

                              <a
                                href={telHref}
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#22c55e] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#16a34a] active:scale-95"
                                aria-label={`Call about ${p.title}`}
                              >
                                <IconPhone className="h-4 w-4 text-white" strokeWidth={2} />
                                <span className="text-white">CALL</span>
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
        </div>
      </div>
    </div>
  )
}

export default Properties
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import { motion as Motion } from 'framer-motion'

import PageBreadcrumbs from '../components/layout/PageBreadcrumbs.jsx'

import PageHero from '../components/layout/PageHero.jsx'

import {
  IconBath,
  IconBed,
  IconCamera,
  IconExpandArea,
  IconFlame,
  IconPhone,
  IconRuler,
  IconShieldCheck,
  IconWhatsAppBrand,
} from '../components/properties/PropertyIcons.jsx'

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

import { appPath, canonicalHref } from '../lib/appPaths.js'

/*
 * Size options shown in the search box.
 *
 * Marla:
 * 5, 7, 10, 20, 30, 40
 *
 * Kanal:
 * 1 Kanal = 20 Marla
 * 2 Kanal = 40 Marla
 */
const SIZE_OPTIONS = [
  { value: '', label: 'Any Size' },
  { value: '5', label: '5 Marla' },
  { value: '7', label: '7 Marla' },
  { value: '10', label: '10 Marla' },
  { value: '20', label: '1 Kanal' },
   { value: '30', label: '2 Kanal' },
  { value: '40', label: ' 4 Kanal' },
   { value: '50', label: '5 Kanal' },
    { value: '60', label: '9 Kanal' },
     { value: '70', label:'10 Kanal' },
]

const ROOM_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8]

const ALLOWED_LISTING_TYPE = new Set(
  LISTING_TYPE_OPTIONS.map((o) => o.value).filter(Boolean),
)

/**
 * Stable string compare for SPA filter query.
 */
function filterQueryFingerprint(sp) {
  const entries = [...sp.entries()].filter(
    ([, v]) => v !== null && String(v).trim() !== '',
  )

  entries.sort(([a], [b]) => a.localeCompare(b))

  return entries.map(([k, v]) => `${k}=${v}`).join('&')
}

/**
 * Filters stored only in query string.
 *
 * Listing type and block use path segments.
 *
 * Existing query keys are intentionally retained so existing
 * SEO/filter URLs continue to work.
 */
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
 *
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

/**
 * Hydration helpers.
 *
 * Path always wins when category/block exists.
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

function readListingTypeFromSearchWhenAllowed(
  searchParams,
  forcedListingType,
  pathname,
) {
  if (forcedListingType) return ''

  if (!isBarePropertiesListingPath(pathname)) return ''

  const lt = searchParams.get('listing_type')?.trim() ?? ''

  return lt && ALLOWED_LISTING_TYPE.has(lt) ? lt : ''
}

function readBlockFromSearchWhenAllowed(searchParams, forcedBlock) {
  if (forcedBlock) return ''

  return searchParams.get('block')?.trim() ?? ''
}

/**
 * First render must match the URL.
 */
function createInitialFilterSnapshot(
  pathname,
  search,
  forcedListingType,
  forcedBlock,
) {
  const qp = new URLSearchParams(
    String(search || '').replace(/^\?/, ''),
  )

  const extras = readExtraFiltersFromSearchParams(qp)

  const brNum = Number(extras.bedrooms)
  const baNum = Number(extras.baths)

  let listingType = ''
  let block = ''

  if (forcedListingType) {
    listingType = forcedListingType
    block = forcedBlock ? String(forcedBlock) : ''
  } else if (forcedBlock) {
    listingType = readListingTypeFromSearchWhenAllowed(
      qp,
      forcedListingType,
      pathname,
    )

    block = String(forcedBlock)
  } else {
    listingType = readListingTypeFromSearchWhenAllowed(
      qp,
      forcedListingType,
      pathname,
    )

    block = readBlockFromSearchWhenAllowed(qp, forcedBlock)
  }

  return {
    search: extras.search,
    minPrice: extras.minPrice,
    maxPrice: extras.maxPrice,
    minMarlas: extras.minMarlas,
    maxMarlas: extras.maxMarlas,

    /*
     * These are kept internally only so old URLs continue to work.
     * They are no longer shown as UI filters.
     */
    bedrooms:
      extras.bedrooms &&
      ROOM_COUNT_OPTIONS.includes(brNum)
        ? String(brNum)
        : '',

    baths:
      extras.baths &&
      ROOM_COUNT_OPTIONS.includes(baNum)
        ? String(baNum)
        : '',

    listingType,
    block,
  }
}

/**
 * Rebuild query.
 *
 * Existing URL structure remains unchanged.
 */
function buildExtraFilterSearchParams(extras, baseParams) {
  const p = new URLSearchParams(
    typeof baseParams === 'string'
      ? baseParams
      : baseParams?.toString() || '',
  )

  for (const k of ALL_REWRITTABLE_QUERY_KEYS) {
    p.delete(k)
  }

  if (extras.search) {
    p.set('search', extras.search)
  }

  if (extras.minPrice) {
    p.set('min_price', String(extras.minPrice).trim())
  }

  if (extras.maxPrice) {
    p.set('max_price', String(extras.maxPrice).trim())
  }

  if (extras.minMarlas) {
    p.set('min_marlas', String(extras.minMarlas).trim())
  }

  if (extras.maxMarlas) {
    p.set('max_marlas', String(extras.maxMarlas).trim())
  }

  if (extras.bedrooms) {
    p.set('bedrooms', String(extras.bedrooms).trim())
  }

  if (extras.baths) {
    p.set('baths', String(extras.baths).trim())
  }

  return p
}

function canonicalListingUrlKey(pathname, search) {
  const path = normalizeListingPath(pathname)

  const qs = new URLSearchParams(
    String(search || '').replace(/^\?/, ''),
  )

  const fp = filterQueryFingerprint(qs)

  return fp ? `${path}?${fp}` : path
}

function upsertMeta(name, content) {
  let tag = document.head.querySelector(
    `meta[name="${name}"]`,
  )

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)

  return tag
}

function upsertCanonical(href) {
  let tag = document.head.querySelector(
    'link[rel="canonical"]',
  )

  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }

  tag.setAttribute('href', href)

  return tag
}

function formatCompactPkr(value) {
  if (value == null || value === '') {
    return 'Price on request'
  }

  const n = Number(value)

  if (Number.isNaN(n)) {
    return String(value)
  }

  const abs = Math.abs(n)

  const units = [
    { value: 10000000, label: 'Crore' },
    { value: 100000, label: 'Lac' },
    { value: 1000, label: 'Thousand' },
  ]

  for (const unit of units) {
    if (abs >= unit.value) {
      const compact = (n / unit.value)
        .toFixed(2)
        .replace(/\.?0+$/, '')

      return `PKR ${compact} ${unit.label}`
    }
  }

  return `PKR ${n.toLocaleString('en-PK')}`
}

function getPlainDescription(property) {
  const source =
    property.short_description ||
    property.description ||
    ''

  return source
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

  if (!Number.isNaN(num) && Number.isInteger(num)) {
    return String(num)
  }

  return String(value).replace(/\.?0+$/, '')
}

function formatArea(property) {
  if (
    property.area_marlas == null ||
    property.area_marlas === ''
  ) {
    return ''
  }

  const unit = property.area_unit_display || 'Marla'
  const marlas = formatMarlasValue(property.area_marlas)

  const plural =
    Number(marlas) === 1 || unit.endsWith('s')
      ? ''
      : 's'

  return `${marlas} ${unit}${plural}`
}

function getSizeMeta(property) {
  const meta = []

  if (
    property.area_marlas != null &&
    property.area_marlas !== ''
  ) {
    meta.push({
      key: 'area',
      icon: IconRuler,
      label: formatArea(property),
    })
  }

  if (
    property.bedrooms != null &&
    property.bedrooms !== ''
  ) {
    meta.push({
      key: 'bedrooms',
      icon: IconBed,
      label: `${property.bedrooms} Bed`,
    })
  }

  if (
    property.baths != null &&
    property.baths !== ''
  ) {
    meta.push({
      key: 'baths',
      icon: IconBath,
      label: `${property.baths} Bath`,
    })
  }

  return meta
}

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

/**
 * Listing CTA row.
 */
const LISTING_CTA_ROW =
  'flex min-w-0 items-center gap-2'

const listingCtaBase =
  'inline-flex min-h-[34px] items-center justify-center gap-1.5 border px-3 py-1.5 text-[10px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]'

const listingCtaWhatsApp =
  `${listingCtaBase} border-[#22a45a] bg-white text-[#179447] hover:bg-[#f0faf4]`

const listingCtaCall =
  `${listingCtaBase} border-[#22a45a] bg-[#22a45a] text-white hover:bg-[#16843f]`

function IconCheckCircle({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />

      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLocation({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
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

    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
}

const listItem = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function Properties() {
  const location = useLocation()
  const navigate = useNavigate()

  const pathParts = useMemo(() => {
    const normalized = location.pathname.replace(/\/+$/, '')
    const prefix = '/properties/'

    return normalized.startsWith(prefix)
      ? normalized
          .slice(prefix.length)
          .split('/')
          .filter(Boolean)
      : []
  }, [location.pathname])

  const categorySlug = pathParts[0] || ''
  const blockSlug = pathParts[1] || ''

  const forcedBlock = useMemo(
    () => propertyBlockFromSlug(blockSlug),
    [blockSlug],
  )

  const categorySeo =
    PROPERTY_CATEGORY_SEO[categorySlug] || null

  const blockSeo = useMemo(
    () =>
      forcedBlock
        ? propertyBlockSeo(categorySlug, forcedBlock)
        : null,
    [categorySlug, forcedBlock],
  )

  const pageSeo =
    blockSeo ||
    categorySeo ||
    STATIC_PAGE_SEO.properties

  const forcedListingType =
    categorySeo?.listingType || ''

  const initialSnapshot =
    createInitialFilterSnapshot(
      location.pathname,
      location.search,
      forcedListingType,
      forcedBlock,
    )

  const [searchInput, setSearchInput] = useState(
    initialSnapshot.search,
  )

  const [search, setSearch] = useState(
    initialSnapshot.search,
  )

  const [listingType, setListingType] = useState(
    initialSnapshot.listingType,
  )

  const [block, setBlock] = useState(
    initialSnapshot.block,
  )

  const [
    listingTypeChosenByUser,
    setListingTypeChosenByUser,
  ] = useState(false)

  const [
    blockChosenByUser,
    setBlockChosenByUser,
  ] = useState(false)

  /*
   * These states remain internally so existing URLs/API
   * filters are not broken.
   *
   * They are NOT displayed in the new filter UI.
   */
  const [minPrice, setMinPrice] = useState(
    initialSnapshot.minPrice,
  )

  const [maxPrice, setMaxPrice] = useState(
    initialSnapshot.maxPrice,
  )

  const [minMarlas, setMinMarlas] = useState(
    initialSnapshot.minMarlas,
  )

  const [maxMarlas, setMaxMarlas] = useState(
    initialSnapshot.maxMarlas,
  )

  const [bedrooms, setBedrooms] = useState(
    initialSnapshot.bedrooms,
  )

  const [baths, setBaths] = useState(
    initialSnapshot.baths,
  )

  /*
   * New visible Size filter.
   *
   * If URL contains equal min/max marlas,
   * that value is selected automatically.
   */
  const initialSize =
    initialSnapshot.minMarlas &&
    initialSnapshot.minMarlas ===
      initialSnapshot.maxMarlas
      ? initialSnapshot.minMarlas
      : ''

  const [size, setSize] = useState(initialSize)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('list')

  const effectiveListingType =
    listingTypeChosenByUser
      ? listingType.trim()
      : listingType.trim() || forcedListingType

  const blockTrimmed = block.trim()

  const effectiveBlock =
    blockChosenByUser
      ? blockTrimmed
      : blockTrimmed || forcedBlock

  useLayoutEffect(() => {
    const qp = new URLSearchParams(
      location.search.replace(/^\?/, ''),
    )

    const extras = readExtraFiltersFromSearchParams(qp)

    setSearch(extras.search)
    setSearchInput(extras.search)

    setMinPrice(extras.minPrice)
    setMaxPrice(extras.maxPrice)

    setMinMarlas(extras.minMarlas)
    setMaxMarlas(extras.maxMarlas)

    /*
     * If old URL has bedrooms/baths, keep them internally.
     * They simply aren't visible in the UI anymore.
     */
    const brNum = Number(extras.bedrooms)

    setBedrooms(
      extras.bedrooms &&
        ROOM_COUNT_OPTIONS.includes(brNum)
        ? String(brNum)
        : '',
    )

    const baNum = Number(extras.baths)

    setBaths(
      extras.baths &&
        ROOM_COUNT_OPTIONS.includes(baNum)
        ? String(baNum)
        : '',
    )

    /*
     * Size is selected when min/max are equal.
     */
    setSize(
      extras.minMarlas &&
        extras.minMarlas === extras.maxMarlas
        ? extras.minMarlas
        : '',
    )

    setListingTypeChosenByUser(false)
    setBlockChosenByUser(false)

    if (forcedListingType) {
      setListingType(forcedListingType)
    } else {
      const lt =
        readListingTypeFromSearchWhenAllowed(
          qp,
          forcedListingType,
          location.pathname,
        )

      setListingType(lt)
    }

    if (forcedBlock) {
      setBlock(forcedBlock)
    } else {
      const bl =
        readBlockFromSearchWhenAllowed(
          qp,
          forcedBlock,
        )

      setBlock(bl)
    }
  }, [
    location.pathname,
    location.search,
    forcedListingType,
    forcedBlock,
  ])

  useEffect(() => {
    const previousTitle = document.title

    const previousDescription =
      document.head
        .querySelector(
          'meta[name="description"]',
        )
        ?.getAttribute('content') || ''

    const previousCanonical =
      document.head
        .querySelector(
          'link[rel="canonical"]',
        )
        ?.getAttribute('href') || ''

    const previousRobots =
      document.head
        .querySelector('meta[name="robots"]')
        ?.getAttribute('content') || ''

    const selfCanonical =
      typeof window !== 'undefined'
        ? canonicalHref(
            window.location.pathname,
          )
        : pageSeo.canonical

    document.title = pageSeo.metaTitle

    upsertMeta(
      'description',
      pageSeo.metaDescription,
    )

    upsertMeta(
      'robots',
      'index, follow',
    )

    upsertCanonical(
      selfCanonical || pageSeo.canonical,
    )

    return () => {
      document.title = previousTitle

      if (previousDescription) {
        upsertMeta(
          'description',
          previousDescription,
        )
      }

      if (previousCanonical) {
        upsertCanonical(previousCanonical)
      }

      if (previousRobots) {
        upsertMeta(
          'robots',
          previousRobots,
        )
      }
    }
  }, [pageSeo])

  useEffect(() => {
    const t = window.setTimeout(
      () => setSearch(searchInput),
      380,
    )

    return () => window.clearTimeout(t)
  }, [searchInput])

  /*
   * URL synchronization.
   *
   * IMPORTANT:
   * Existing SEO pathname structure is unchanged.
   */
  useEffect(() => {
    const desiredPath =
      desiredPropertiesListingPath(
        effectiveListingType,
        effectiveBlock,
      )

    const baseQs = new URLSearchParams(
      location.search.replace(/^\?/, ''),
    )

    const nextQs =
      buildExtraFilterSearchParams(
        {
          search,
          minPrice,
          maxPrice,
          minMarlas,
          maxMarlas,
          bedrooms,
          baths,
        },
        baseQs,
      )

    const targetKey =
      canonicalListingUrlKey(
        desiredPath,
        nextQs.toString(),
      )

    const currentKey =
      canonicalListingUrlKey(
        location.pathname,
        location.search,
      )

    if (targetKey === currentKey) {
      return
    }

    navigate(
      {
        pathname: desiredPath,
        search: nextQs.toString(),
      },
      {
        replace: true,
      },
    )
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

      listing_type:
        effectiveListingType || undefined,

      block:
        effectiveBlock.trim() || undefined,

      /*
       * Existing API filtering remains intact.
       */
      min_price:
        minPrice || undefined,

      max_price:
        maxPrice || undefined,

      min_marlas:
        minMarlas || undefined,

      max_marlas:
        maxMarlas || undefined,

      bedrooms:
        bedrooms || undefined,

      baths:
        baths || undefined,
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

  const filterKey = useMemo(
    () => JSON.stringify(filterParams),
    [filterParams],
  )

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const data = await fetchProperties({
          ...filterParams,
          page: '1',
        })

        if (cancelled) return

        const list = Array.isArray(data)
          ? data
          : data.results ?? []

        setItems(list)
      } catch {
        if (!cancelled) {
          setItems([])

          setError(
            'We could not load listings right now. Please try again in a moment.',
          )

        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [filterKey])

  /*
   * New Size filter handler.
   *
   * We keep the existing API/query structure:
   * min_marlas = selected size
   * max_marlas = selected size
   */
  const handleSizeChange = (value) => {
    setSize(value)

    if (!value) {
      setMinMarlas('')
      setMaxMarlas('')
      return
    }

    setMinMarlas(value)
    setMaxMarlas(value)
  }

  const handleFindProperties = () => {
    /*
     * Existing filters already update automatically.
     * This simply applies the current search input immediately
     * instead of waiting for the debounce.
     */
    setSearch(searchInput)
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
    setSize('')

    const cleared = new URLSearchParams(
      location.search.replace(/^\?/, ''),
    )

    for (const k of ALL_REWRITTABLE_QUERY_KEYS) {
      cleared.delete(k)
    }

    navigate(
      {
        pathname: location.pathname,
        search: cleared.toString(),
      },
      {
        replace: true,
      },
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f9fa] font-[Poppins,Manrope,system-ui,sans-serif]">
      {/* =====================================================
          CLEAN HERO / FILTER AREA
          ===================================================== */}

      <section className="border-b border-slate-100 bg-[#f6f9fa]">
        <div className="container-shell px-4 pb-10 pt-24 md:pb-12 md:pt-28">
          <Motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="mx-auto w-full max-w-5xl"
          >
            {/* PAGE CONTENT */}

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
              {/* BUY / RENT */}

              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setListingTypeChosenByUser(true)
                      setListingType('sale')
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      effectiveListingType === 'sale'
                        ? 'bg-[#e4f4f1] text-[#008f82]'
                        : 'text-[#536b86] hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">
                      ⌂
                    </span>
                    BUY
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setListingTypeChosenByUser(true)
                      setListingType('rent')
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      effectiveListingType === 'rent'
                        ? 'bg-[#e4f4f1] text-[#008f82]'
                        : 'text-[#536b86] hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">
                      ▱
                    </span>
                    RENT
                  </button>
                </div>
              </div>

              {/* MAIN THREE FILTERS */}

              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-[1.35fr_1.05fr_1fr_auto] lg:items-end">
                {/* LOCATION / BLOCK */}

                <label className="flex flex-col gap-1.5 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#355477]">
                    Location / Block
                  </span>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#008f82]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path
                          d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <circle
                          cx="12"
                          cy="10"
                          r="2.5"
                        />
                      </svg>
                    </span>

                    <select
                      value={effectiveBlock}
                      onChange={(e) => {
                        setBlockChosenByUser(true)
                        setBlock(e.target.value)
                      }}
                      className="h-11 w-full appearance-none rounded-[9px] border border-slate-200 bg-white pl-10 pr-9 text-[13px] text-[#24476c] outline-none transition hover:border-slate-300 focus:border-[#008f82] focus:ring-2 focus:ring-[#008f82]/10"
                    >
                      <option value="">
                        All Locations / Blocks
                      </option>

                      {PROPERTY_BLOCK_OPTIONS.map(
                        (opt) => (
                          <option
                            key={opt}
                            value={opt}
                          >
                            {opt}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </label>

                {/* PROPERTY TYPE */}

                <label className="flex flex-col gap-1.5 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#355477]">
                    Property Type
                  </span>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#008f82]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path
                          d="M4 20V9l8-5 8 5v11H4Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M9 20v-6h6v6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    <select
                      value={effectiveListingType}
                      onChange={(e) => {
                        setListingTypeChosenByUser(true)
                        setListingType(e.target.value)
                      }}
                      className="h-11 w-full appearance-none rounded-[9px] border border-slate-200 bg-white pl-10 pr-9 text-[13px] text-[#24476c] outline-none transition hover:border-slate-300 focus:border-[#008f82] focus:ring-2 focus:ring-[#008f82]/10"
                    >
                      {LISTING_TYPE_OPTIONS.map(
                        (opt) => (
                          <option
                            key={opt.label}
                            value={opt.value}
                          >
                            {opt.label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </label>

                {/* SIZE */}

                <label className="flex flex-col gap-1.5 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#355477]">
                    Size
                  </span>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#008f82]">
                      <IconRuler className="h-5 w-5" />
                    </span>

                    <select
                      value={size}
                      onChange={(e) =>
                        handleSizeChange(
                          e.target.value,
                        )
                      }
                      className="h-11 w-full appearance-none rounded-[9px] border border-slate-200 bg-white pl-10 pr-9 text-[13px] text-[#24476c] outline-none transition hover:border-slate-300 focus:border-[#008f82] focus:ring-2 focus:ring-[#008f82]/10"
                    >
                      {SIZE_OPTIONS.map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </label>

                {/* FIND PROPERTIES */}

                <button
                  type="button"
                  onClick={handleFindProperties}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] bg-[#008f82] px-5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(0,143,130,0.18)] transition hover:bg-[#00796f] hover:shadow-[0_10px_22px_rgba(0,143,130,0.23)] focus:outline-none focus:ring-2 focus:ring-[#008f82]/20 active:scale-[0.98] lg:min-w-[126px]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />

                    <path
                      d="m20 20-4-4"
                      strokeLinecap="round"
                    />
                  </svg>

                  <span>
                    Find Properties
                  </span>
                </button>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* =====================================================
          LISTINGS
          ===================================================== */}

      <div className="border-b border-slate-100 bg-white">
        <div className="container-shell pb-12 pt-6 sm:pt-7 md:pb-16 md:pt-8 lg:pb-20 lg:pt-10">
          {/* BREADCRUMBS + VIEW */}

          <div className="mb-6 border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <PageBreadcrumbs
              variant="onLight"
              className="border-b border-slate-100 pb-3"
              items={[
                {
                  to: '/',
                  label: 'Home',
                },

                categorySeo
                  ? {
                      to: '/properties',
                      label: 'Properties',
                    }
                  : {
                      label: 'Properties',
                    },

                ...(categorySeo
                  ? [
                      {
                        to: blockSeo
                          ? `/properties/${categorySlug}`
                          : undefined,

                        label:
                          categorySeo.breadcrumb,
                      },
                    ]
                  : []),

                ...(blockSeo
                  ? [
                      {
                        label:
                          blockSeo.breadcrumb,
                      },
                    ]
                  : []),
              ]}
            />

            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-slate-600">
                {loading
                  ? 'Loading listings…'
                  : `${items.length} listing${
                      items.length === 1
                        ? ''
                        : 's'
                    } found`}
              </p>

              <div className="inline-flex w-full items-center border border-slate-200 bg-white sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    setViewMode('list')
                  }
                  aria-pressed={
                    viewMode === 'list'
                  }
                  className={`inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition sm:flex-none ${
                    viewMode === 'list'
                      ? 'bg-[#1a3553] text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <IconListView className="h-4 w-4" />
                  List
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setViewMode('grid')
                  }
                  aria-pressed={
                    viewMode === 'grid'
                  }
                  className={`inline-flex flex-1 items-center justify-center gap-2 border-l border-slate-200 px-3 py-2 text-sm font-medium transition sm:flex-none ${
                    viewMode === 'grid'
                      ? 'bg-[#1a3553] text-white'
                      : 'text-slate-600 hover:bg-slate-50'
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
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="rounded-xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-800"
            >
              {error}
            </Motion.p>
          ) : null}

          {/* LOADING */}

          {loading && !items.length ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {[1, 2, 3, 4, 5, 6].map(
                (i) => (
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
                ),
              )}
            </div>
          ) : null}

          {/* EMPTY */}

          {!loading &&
          !items.length &&
          !error ? (
            <Motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
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
              className={
                viewMode === 'list'
                  ? 'space-y-3'
                  : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
              }
            >
              {items.map((p) => {
                const img = cardImageUrl(p)
                const description = getPlainDescription(p)
                const propertyHref = propertyDetailPath(p)
                const imageCount = Array.isArray(p.images) && p.images.length > 0 ? p.images.length : 1
                const telHref = `tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`

                return (
                  <Motion.article
                    key={`${p.id}-${p.slug}`}
                    variants={listItem}
                    whileHover={{
                      y: -2,
                      transition: {
                        duration: 0.25,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    className="group relative w-full max-w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                  >
                    {viewMode === 'list' ? (
                      /* =================================================
                         LIST VIEW (Side-by-side Mobile & Desktop Responsive)
                         ================================================= */
                      <div className="grid w-full max-w-full grid-cols-[100px_minmax(0,1fr)] sm:grid-cols-[160px_minmax(0,1fr)] md:grid-cols-[270px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)] h-[128px] sm:h-[165px] md:h-[215px] overflow-hidden">
                        {/* LEFT: IMAGE SECTION */}
                        <div className="relative h-full w-full overflow-hidden bg-slate-100">
                          <Link to={propertyHref} className="block h-full w-full">
                            <Motion.img
                              src={img}
                              alt={p.title || 'Gulberg Greens Property'}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={handleImageError}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
                          </Link>

                          {/* TOP-LEFT: BADGES */}
                          <div className="pointer-events-none absolute left-1 top-1 sm:left-3 sm:top-3 flex items-center gap-1">
                            {p.is_featured ? (
                              <span className="rounded bg-[#ef4444] px-1 py-0.5 text-[7px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                FEATURED
                              </span>
                            ) : null}
                            <div className="flex h-3.5 w-3.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white text-[#22a45a] shadow-sm">
                              <IconShieldCheck className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-[#22a45a]" />
                            </div>
                          </div>

                          {/* BOTTOM-LEFT: IMAGE COUNT */}
                          <div className="absolute bottom-1 left-1 sm:bottom-3 sm:left-3 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[8px] sm:text-[11px] font-medium text-white backdrop-blur-sm">
                            <IconCamera className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-white" />
                            <span>{imageCount}</span>
                          </div>
                        </div>

                        {/* RIGHT: CONTENT SECTION */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between p-1.5 sm:p-3 md:p-4 overflow-hidden">
                          <div className="min-w-0">
                            {/* 1. TITLE AT THE TOP */}
                            <h2 className="text-[11px] sm:text-[14px] md:text-[15px] font-bold text-slate-900 leading-snug transition group-hover:text-[#0d8272] truncate">
                              <Link to={propertyHref} className="truncate block">
                                {p.title}
                              </Link>
                            </h2>

                            {/* 2. PRICE */}
                            <p className="mt-0.5 sm:mt-1 text-[13px] sm:text-lg md:text-xl font-extrabold tracking-tight text-[#0f243c] truncate">
                              {formatCompactPkr(p.price)}
                            </p>

                            {/* 3. LOCATION */}
                            <p className="mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-medium text-slate-500 truncate">
                              <IconLocation className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0 text-[#0d9488]" />
                              <span className="truncate">
                                {p.location || (p.block ? `Gulberg Greens - Block ${p.block}` : 'Gulberg Greens')}
                              </span>
                            </p>

                            {/* 4. TAGS & SPECS (Single compact row) */}
                            <div className="mt-0.5 sm:mt-1.5 flex flex-wrap items-center gap-1 sm:gap-1.5 min-w-0 overflow-hidden">
                              {p.listing_type_display ? (
                                <span className="rounded bg-[#e6f7f4] px-1 py-0.2 sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[#0d8272] shrink-0">
                                  {p.listing_type_display}
                                </span>
                              ) : null}

                              {p.block ? (
                                <span className="rounded bg-[#f1f5f9] px-1 py-0.2 sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[10px] font-semibold text-[#475569] shrink-0">
                                  Block {p.block}
                                </span>
                              ) : null}

                              {p.bedrooms && Number(p.bedrooms) > 0 ? (
                                <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-semibold text-slate-700 shrink-0">
                                  <IconBed className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-500" />
                                  {p.bedrooms}
                                </span>
                              ) : null}

                              {p.baths && Number(p.baths) > 0 ? (
                                <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-semibold text-slate-700 shrink-0">
                                  <IconBath className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-500" />
                                  {p.baths}
                                </span>
                              ) : null}

                              {formatArea(p) ? (
                                <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-semibold text-slate-700 shrink-0">
                                  <IconExpandArea className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-500" />
                                  {formatArea(p)}
                                </span>
                              ) : null}
                            </div>

                            {/* 5. DESCRIPTION (Hidden on phone screens to maintain compact height) */}
                            {description ? (
                              <p className="mt-1 hidden sm:line-clamp-1 md:line-clamp-2 text-xs font-normal leading-relaxed text-slate-500">
                                {description}
                              </p>
                            ) : null}
                          </div>

                          {/* 6. BOTTOM ACTION BAR */}
                          <div className="mt-auto flex w-full min-w-0 items-center justify-between border-t border-slate-100 pt-1 sm:pt-2">
                            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                              {/* WHATSAPP */}
                              <a
                                href={whatsappHref(p, propertyHref, img)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 sm:gap-1 rounded-md border border-[#25D366] bg-white px-1.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-slate-800 transition hover:bg-[#25D366] hover:text-white active:scale-95 shrink-0"
                                aria-label={`WhatsApp about ${p.title}`}
                              >
                                <IconWhatsAppBrand className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-[#25D366]" />
                                <span>WhatsApp</span>
                              </a>

                              {/* CALL */}
                              <a
                                href={telHref}
                                className="inline-flex items-center gap-0.5 sm:gap-1 rounded-md bg-[#22c55e] px-2 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white shadow-sm transition hover:bg-[#16a34a] active:scale-95 shrink-0"
                                aria-label={`Call about ${p.title}`}
                              >
                                <IconPhone className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-white" strokeWidth={2} />
                                <span className="text-white">CALL</span>
                              </a>
                            </div>

                            {/* DETAILS */}
                            <Link
                              to={propertyHref}
                              className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-1.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* =================================================
                         GRID VIEW
                         ================================================= */
                      <div className="flex h-full flex-col">
                        <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                          <Link to={propertyHref} className="block h-full w-full">
                            <Motion.img
                              src={img}
                              alt={p.title || 'Gulberg Greens Property'}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={handleImageError}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
                          </Link>

                          {/* TOP-LEFT: BADGES */}
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

                          {/* BOTTOM-LEFT: IMAGE COUNT */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                            <IconCamera className="h-3.5 w-3.5 text-white" />
                            <span>{imageCount}</span>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                          {/* 1. TITLE AT TOP */}
                          <h2 className="text-sm font-bold text-slate-900 transition group-hover:text-[#0d8272]">
                            <Link to={propertyHref} className="line-clamp-1">
                              {p.title}
                            </Link>
                          </h2>

                          {/* 2. PRICE */}
                          <p className="mt-1.5 text-xl font-extrabold tracking-tight text-[#0f243c]">
                            {formatCompactPkr(p.price)}
                          </p>

                          {/* 3. LOCATION */}
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <IconLocation className="h-3.5 w-3.5 shrink-0 text-[#0d9488]" />
                            <span className="truncate">
                              {p.location || (p.block ? `Gulberg Greens - Block ${p.block}` : 'Gulberg Greens')}
                            </span>
                          </p>

                          {/* 4. TAGS & SPECS */}
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

                          {/* META (BEDS, BATHS, AREA) */}
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

                            {formatArea(p) ? (
                              <span className="inline-flex items-center gap-1">
                                <IconExpandArea className="h-3.5 w-3.5 text-slate-600" />
                                {formatArea(p)}
                              </span>
                            ) : null}
                          </div>

                          {/* BOTTOM ACTION BAR */}
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

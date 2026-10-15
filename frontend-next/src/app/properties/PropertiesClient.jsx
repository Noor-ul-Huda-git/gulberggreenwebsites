'use client'

import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
  { value: '12', label: '12 Marla' },
  { value: '20', label: '1 Kanal' },
  { value: '40', label: '2 Kanal' },
  { value: '80', label: '4 Kanal' },
  { value: '100', label: '5 Kanal' },
  { value: '180', label: '9 Kanal' },
  { value: '200', label: '10 Kanal' },
]

/*
 * Size URL mein path ke aakhir mein aata hai:
 *   /properties/plots/block-h/7-marla/
 *   /properties/farm-house/block-a/5-kanal/
 * Dropdown ki value Marla mein hai (5 Kanal = 100).
 */
const SIZE_SLUG_RE = /^(\d+(?:\.\d+)?)-(marla|kanal)s?$/

function sizeSlugToValue(slug) {
  const m = SIZE_SLUG_RE.exec(String(slug || '').trim().toLowerCase())

  if (!m) return ''

  const n = Number(m[1])

  if (!Number.isFinite(n) || n <= 0) return ''

  const marlas = m[2] === 'kanal' ? n * 20 : n

  return String(Number(marlas.toFixed(2)))
}

function isSizeSlug(slug) {
  return sizeSlugToValue(slug) !== ''
}

function sizeValueToSlug(value) {
  const v = String(value || '').trim()

  if (!v) return ''

  const opt = SIZE_OPTIONS.find((o) => o.value === v)

  if (opt) return opt.label.toLowerCase().replace(/\s+/g, '-')

  const n = Number(v)

  if (!Number.isFinite(n) || n <= 0) return ''

  return n % 20 === 0 ? `${n / 20}-kanal` : `${n}-marla`
}

/*
 * Size filter sirf in categories ke liye hai.
 * Flat, Shop aur Office par size dropdown, URL aur heading mein size nahi aata.
 */
const SIZE_ENABLED_LISTING_TYPES = new Set([
  'plots',
  'commercialplots',
  'farmhouse',
  'house',
])

function listingTypeAllowsSize(listingType) {
  const key = String(listingType || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

  return !key || SIZE_ENABLED_LISTING_TYPES.has(key)
}

function sizeLabelFromValue(value) {
  const v = String(value || '').trim()

  if (!v) return ''

  const opt = SIZE_OPTIONS.find((o) => o.value === v)

  if (opt) return opt.label

  const slug = sizeValueToSlug(v)

  if (!slug) return ''

  const [num, unit] = slug.split('-')

  return `${num} ${unit === 'kanal' ? 'Kanal' : 'Marla'}`
}

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
  'size',
  'bedrooms',
  'baths',
]

/* =========================================================
 * INVENTORY MATCHING (search box ↔ listings)
 *
 * Admin mein size apni unit mein save hota hai
 * (jaise 5 + Kanal), jab ke Size dropdown ki value
 * Marla mein hai (5 Kanal = 100). Isliye har listing
 * ka area pehle Marla mein convert kar ke match hota hai.
 * Block aur property type bhi naam ke farq (Block A / A)
 * ke baghair match hote hain.
 * ========================================================= */

const MARLAS_PER_UNIT = {
  marla: 1,
  kanal: 20,
  square_feet: 1 / 272.25,
  square_yards: 1 / 30.25,
}

const SIZE_MATCH_TOLERANCE = 0.05

function propertyAreaUnitKey(p) {
  const raw = String(
    p?.area_unit || p?.area_unit_display || 'marla',
  )
    .toLowerCase()
    .replace(/[^a-z]/g, '')

  if (raw.startsWith('kanal')) return 'kanal'
  if (raw.includes('feet') || raw.includes('sqft')) return 'square_feet'
  if (raw.includes('yard')) return 'square_yards'

  return 'marla'
}

function propertyAreaInMarlas(p) {
  if (p?.area_marlas == null || p.area_marlas === '') return null

  const n = Number(p.area_marlas)

  if (!Number.isFinite(n)) return null

  return n * MARLAS_PER_UNIT[propertyAreaUnitKey(p)]
}

function normalizeMatchKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function normalizeBlockKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/\bblock\b/g, ' ')
    .replace(/[^a-z0-9]+/g, '')
}

function propertyMatchesFilters(p, f) {
  if (f.listingType) {
    const wanted = normalizeMatchKey(f.listingType)

    if (
      normalizeMatchKey(p.listing_type) !== wanted &&
      normalizeMatchKey(p.listing_type_display) !== wanted
    ) {
      return false
    }
  }

  if (f.block) {
    const wantedKey = normalizeBlockKey(f.block)
    const wantedSlug = slugifyPropertyBlock(f.block)

    const sameKey =
      wantedKey && normalizeBlockKey(p.block) === wantedKey

    const sameSlug =
      wantedSlug && slugifyPropertyBlock(String(p.block || '')) === wantedSlug

    if (!sameKey && !sameSlug) return false
  }

  const minM = f.minMarlas !== '' && f.minMarlas != null ? Number(f.minMarlas) : null
  const maxM = f.maxMarlas !== '' && f.maxMarlas != null ? Number(f.maxMarlas) : null

  if (
    (minM != null && Number.isFinite(minM)) ||
    (maxM != null && Number.isFinite(maxM))
  ) {
    const area = propertyAreaInMarlas(p)

    if (area == null) return false
    if (minM != null && Number.isFinite(minM) && area < minM - SIZE_MATCH_TOLERANCE) return false
    if (maxM != null && Number.isFinite(maxM) && area > maxM + SIZE_MATCH_TOLERANCE) return false
  }

  const minP = f.minPrice ? Number(f.minPrice) : null
  const maxP = f.maxPrice ? Number(f.maxPrice) : null

  if (
    (minP != null && Number.isFinite(minP)) ||
    (maxP != null && Number.isFinite(maxP))
  ) {
    const price = Number(p.price)

    if (p.price == null || p.price === '' || !Number.isFinite(price)) return false
    if (minP != null && Number.isFinite(minP) && price < minP) return false
    if (maxP != null && Number.isFinite(maxP) && price > maxP) return false
  }

  if (f.bedrooms && Number(p.bedrooms) !== Number(f.bedrooms)) return false
  if (f.baths && Number(p.baths) !== Number(f.baths)) return false

  const q = String(f.search || '').trim().toLowerCase()

  if (q) {
    const haystack = [
      p.title,
      p.location,
      p.block ? `block ${p.block}` : '',
      p.listing_type_display,
      p.purpose,
      p.category,
      p.short_description,
      String(p.description || '').replace(/<[^>]*>/g, ' '),
    ]
      .join(' ')
      .toLowerCase()

    const words = q.split(/\s+/).filter(Boolean)

    if (!words.every((w) => haystack.includes(w))) return false
  }

  return true
}

function parseInventoryResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

/*
 * Poori inventory ek dafa load hoti hai (sab pages),
 * taake neeche dikhne wali har listing search mein bhi mile.
 */
let fullInventoryPromise = null

function loadFullInventory() {
  if (fullInventoryPromise) return fullInventoryPromise

  fullInventoryPromise = (async () => {
    const first = await fetchProperties({ page: '1' })

    if (Array.isArray(first)) return first

    const firstList = parseInventoryResponse(first)
    const total = Number(first?.count || 0)
    const pageSize = firstList.length || 12
    const totalPages =
      total > firstList.length ? Math.ceil(total / pageSize) : 1

    const all = [...firstList]
    const BATCH = 6

    for (let start = 2; start <= totalPages; start += BATCH) {
      const pages = []

      for (let pg = start; pg < start + BATCH && pg <= totalPages; pg += 1) {
        pages.push(
          fetchProperties({ page: String(pg) })
            .then(parseInventoryResponse)
            .catch(() => []),
        )
      }

      const results = await Promise.all(pages)
      results.forEach((list) => all.push(...list))
    }

    const seen = new Set()

    return all.filter((p) => {
      const key = p?.id ?? p?.slug
      if (key == null) return true
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  })()

  fullInventoryPromise.catch(() => {
    fullInventoryPromise = null
  })

  return fullInventoryPromise
}

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
function desiredPropertiesListingPath(listingType, blockLabel, sizeValue = '') {
  const base = desiredPropertiesBasePath(listingType, blockLabel)
  const sizeSeg = sizeValueToSlug(sizeValue)

  if (!sizeSeg) return base

  return base.endsWith('/') ? `${base}${sizeSeg}/` : `${base}/${sizeSeg}`
}

function desiredPropertiesBasePath(listingType, blockLabel) {
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
function readExtraFiltersFromSearchParams(sp, pathSizeValue = '') {
  const get = (k) => sp.get(k)?.trim() ?? ''

  const sizeValue = pathSizeValue || sizeSlugToValue(get('size'))

  const minMarlas = sizeValue || get('min_marlas') || get('min_marla')
  const maxMarlas = sizeValue || get('max_marlas') || get('max_marla')

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
  pathSizeValue = '',
) {
  const qp = new URLSearchParams(
    String(search || '').replace(/^\?/, ''),
  )

  const extras = readExtraFiltersFromSearchParams(qp, pathSizeValue)

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
function buildExtraFilterSearchParams(extras, baseParams, sizeInPath = false) {
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

  const minM = String(extras.minMarlas || '').trim()
  const maxM = String(extras.maxMarlas || '').trim()

  if (minM && minM === maxM && sizeValueToSlug(minM)) {
    /*
     * Ek size chuna hai: category wale page par size path mein
     * jata hai (/7-marla/), warna ?size=7-marla
     */
    if (!sizeInPath) {
      p.set('size', sizeValueToSlug(minM))
    }
  } else {
    if (minM) p.set('min_marlas', minM)
    if (maxM) p.set('max_marlas', maxM)
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
    : `https://gulberggreens.com.pk${
        propertyHref.startsWith('/') ? '' : '/'
      }${propertyHref}`

  let absoluteImageUrl = imageUrl || ''

  if (absoluteImageUrl) {
    if (
      absoluteImageUrl.startsWith(
        'http://127.0.0.1:8000',
      )
    ) {
      absoluteImageUrl = absoluteImageUrl.replace(
        'http://127.0.0.1:8000',
        'https://gulberggreens.com.pk',
      )
    } else if (absoluteImageUrl.startsWith('/')) {
      absoluteImageUrl = `https://gulberggreens.com.pk${absoluteImageUrl}`
    } else if (!absoluteImageUrl.startsWith('http')) {
      absoluteImageUrl = `https://gulberggreens.com.pk/${absoluteImageUrl.replace(
        /^\/+/,
        '',
      )}`
    }
  }

  const text = encodeURIComponent(
    [
      `Assalam o Alaikum, I am interested in: ${
        property?.title || ''
      }`,
      '',
      `Property Link: ${absolutePropertyUrl}`,
      `Property Image: ${
        absoluteImageUrl ||
        'Image available on the property page'
      }`,
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
      : `http://127.0.0.1:8000${
          p.featured_image.startsWith('/') ? '' : '/'
        }${p.featured_image}`
  }

  if (
    Array.isArray(p.images) &&
    p.images.length > 0 &&
    p.images[0].url
  ) {
    return p.images[0].url
  }

  return DEFAULT_PROPERTY_IMAGE
}

function handleImageError(e) {
  const currentSrc = e.currentTarget.src || ''

  if (
    currentSrc.includes('/media/') &&
    !currentSrc.includes('gulberggreens.com.pk')
  ) {
    const parts = currentSrc.split('/media/')

    if (parts[1]) {
      e.currentTarget.src =
        `https://gulberggreens.com.pk/media/${parts[1]}`
      return
    }
  }

  if (
    !currentSrc.includes(
      'gulberg-greens-islamabad-official-ibechs-gated-community',
    )
  ) {
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

function Properties({ initialItems = [] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlSearch = searchParams.toString()

  const pathParts = useMemo(() => {
    const normalized = pathname.replace(/\/+$/, '')
    const prefix = '/properties/'

    return normalized.startsWith(prefix)
      ? normalized
          .slice(prefix.length)
          .split('/')
          .filter(Boolean)
      : []
  }, [pathname])

  /*
   * /properties/5-marla/ — pehla hissa size ho to wo category nahi.
   */
  const firstPathIsSize = isSizeSlug(pathParts[0] || '')

  const categorySlug = firstPathIsSize ? '' : pathParts[0] || ''
  const restPathParts = firstPathIsSize
    ? pathParts
    : pathParts.slice(1)

  const sizePathSlug =
    restPathParts.find((part) => isSizeSlug(part)) || ''

  const blockSlug =
    restPathParts.find((part) => !isSizeSlug(part)) || ''

  const pathSizeValue = sizeSlugToValue(sizePathSlug)

  const forcedBlock = useMemo(
    () => propertyBlockFromSlug(blockSlug),
    [blockSlug],
  )

  const categorySeo =
    PROPERTY_CATEGORY_SEO[categorySlug] || null

  const blockSeo = useMemo(
    () =>
      forcedBlock
        ? propertyBlockSeo(
            categorySlug,
            forcedBlock,
          )
        : null,
    [categorySlug, forcedBlock],
  )

  const pageSeo =
    blockSeo ||
    categorySeo ||
    STATIC_PAGE_SEO.properties

  const forcedListingType =
    categorySeo?.listingType || ''

  const initialSnapshot = useMemo(
    () =>
      createInitialFilterSnapshot(
        pathname,
        urlSearch,
        forcedListingType,
        forcedBlock,
        pathSizeValue,
      ),
    [
      pathname,
      urlSearch,
      forcedListingType,
      forcedBlock,
      pathSizeValue,
    ],
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

  /*
   * Size chuna ho to heading aur description mein size bhi aata hai:
   *   "5 Kanal Farmhouses for Sale in Block A, Gulberg Greens Islamabad"
   * Size na ho to heading pehle jaisi rehti hai.
   */
  const sizeAllowedForType = listingTypeAllowsSize(
    listingTypeChosenByUser
      ? listingType.trim()
      : listingType.trim() || forcedListingType,
  )

  const selectedSizeLabel = sizeAllowedForType
    ? sizeLabelFromValue(size)
    : ''

  const displaySeo = useMemo(() => {
    if (!selectedSizeLabel) return pageSeo

    const typeLabel = categorySeo?.breadcrumb || 'Properties'
    const where = forcedBlock
      ? `${forcedBlock}, Gulberg Greens Islamabad`
      : 'Gulberg Greens Islamabad'

    return {
      ...pageSeo,
      h1: `${selectedSizeLabel} ${typeLabel} for Sale in ${where}`,
      metaDescription: `Explore ${selectedSizeLabel} ${typeLabel.toLowerCase()} for sale in ${where}. Secure gated community by IBECHS. Browse available listings and contact us today.`,
    }
  }, [selectedSizeLabel, pageSeo, categorySeo, forcedBlock])

  const [serverItems] = useState(
    Array.isArray(initialItems) ? initialItems : [],
  )

  /*
   * null = abhi load ho rahi hai, array = poori inventory,
   * false = load nahi hui (server wali listings dikhengi).
   */
  const [inventory, setInventory] = useState(null)
  const [error] = useState(null)
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
      urlSearch.replace(/^\?/, ''),
    )

    const extras = readExtraFiltersFromSearchParams(qp, pathSizeValue)

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
          pathname,
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
    pathname,
    urlSearch,
    forcedListingType,
    forcedBlock,
    pathSizeValue,
  ])

  /*
   * Flat / Shop / Office chunne par size khud hat jata hai.
   */
  useEffect(() => {
    if (sizeAllowedForType) return

    if (size || minMarlas || maxMarlas) {
      setSize('')
      setMinMarlas('')
      setMaxMarlas('')
    }
  }, [sizeAllowedForType, size, minMarlas, maxMarlas])

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
    const sizeValueForPath =
      minMarlas && minMarlas === maxMarlas ? minMarlas : ''

    /*
     * Size hamesha path ke aakhir mein:
     *   /properties/5-marla/
     *   /properties/plots/block-h/7-marla/
     *   /properties/all/block-f-executive-4/2-kanal/
     */
    const sizeInPath = Boolean(sizeValueToSlug(sizeValueForPath))

    const desiredPath =
      desiredPropertiesListingPath(
        effectiveListingType,
        effectiveBlock,
        sizeInPath ? sizeValueForPath : '',
      )

    const baseQs = new URLSearchParams(
      urlSearch.replace(/^\?/, ''),
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
        sizeInPath,
      )

    const targetKey =
      canonicalListingUrlKey(
        desiredPath,
        nextQs.toString(),
      )

    const currentKey =
      canonicalListingUrlKey(
        pathname,
        urlSearch,
      )

    if (targetKey === currentKey) {
      return
    }

    const nextSearch = nextQs.toString()

    const nextHref = nextSearch
      ? `${desiredPath}?${nextSearch}`
      : desiredPath

    router.replace(nextHref)
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
    router,
    pathname,
    urlSearch,
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

    loadFullInventory()
      .then((list) => {
        if (!cancelled) setInventory(Array.isArray(list) ? list : false)
      })
      .catch(() => {
        if (!cancelled) setInventory(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const loading = inventory === null

  const items = useMemo(() => {
    /*
     * Browser wali inventory aur server wali listings dono
     * jor kar (duplicate hata kar) filter hoti hain. Agar
     * browser se load fail ho jaye to bhi server wali
     * saari listings search mein milengi.
     */
    const seen = new Set()
    const source = [
      ...(Array.isArray(inventory) ? inventory : []),
      ...serverItems,
    ].filter((p) => {
      const key = p?.id ?? p?.slug
      if (key == null) return true
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return source.filter((p) =>
      propertyMatchesFilters(p, {
        search,
        listingType: effectiveListingType,
        block: effectiveBlock.trim(),
        minPrice,
        maxPrice,
        minMarlas,
        maxMarlas,
        bedrooms,
        baths,
      }),
    )
  }, [
    inventory,
    serverItems,
    search,
    effectiveListingType,
    effectiveBlock,
    minPrice,
    maxPrice,
    minMarlas,
    maxMarlas,
    bedrooms,
    baths,
  ])
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
      urlSearch.replace(/^\?/, ''),
    )

    for (const k of ALL_REWRITTABLE_QUERY_KEYS) {
      cleared.delete(k)
    }

    const clearedSearch = cleared.toString()

    const clearedHref = clearedSearch
      ? `${pathname}?${clearedSearch}`
      : pathname

    router.replace(clearedHref)
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
                {displaySeo.h1}
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
                {displaySeo.metaDescription}
              </p>
            </div>

            {/* FILTER CARD */}

            <div className="rounded-[1.25rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_15px_40px_rgba(15,23,42,0.07)] md:px-6 md:py-6">
              {false ? (
                <>
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
                          âŒ‚
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
                          â–±
                        </span>
                        RENT
                      </button>
                    </div>
                  </div>
                </>
              ) : null}

              {/* MAIN THREE FILTERS */}

              <div
                className={`grid gap-4 md:grid-cols-2 lg:items-end ${
                  sizeAllowedForType
                    ? 'lg:grid-cols-[1.35fr_1.05fr_1fr_auto]'
                    : 'lg:grid-cols-[1.35fr_1.05fr_auto]'
                }`}
              >
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

                {/* SIZE (sirf Plots, Commercial Plots, Farmhouse, House) */}

                {sizeAllowedForType ? (
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
                ) : null}

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
                        to:
                          blockSeo || selectedSizeLabel
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
                        to: selectedSizeLabel
                          ? `/properties/${categorySlug}/${blockSlug}`
                          : undefined,
                        label:
                          blockSeo.breadcrumb,
                      },
                    ]
                  : []),

                ...(selectedSizeLabel && categorySeo
                  ? [
                      {
                        label: selectedSizeLabel,
                      },
                    ]
                  : []),
              ]}
            />

            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-slate-600">
                {loading
                  ? 'Loading listingsâ€¦'
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
                const description =
                  getPlainDescription(p)

                const propertyHref =
                  propertyDetailPath(p)

                const imageCount =
                  Array.isArray(p.images) &&
                  p.images.length > 0
                    ? p.images.length
                    : 1

                const telHref =
                  `tel:${contactInfo.phone.replace(
                    /[^\d+]/g,
                    '',
                  )}`

                return (
                  <Motion.article
                    key={`${p.id}-${p.slug}`}
                    variants={listItem}
                    whileHover={{
                      y: -2,
                      transition: {
                        duration: 0.25,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      },
                    }}
                    className="group relative w-full max-w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                  >
                    {viewMode === 'list' ? (
                      /* =================================================
                         LIST VIEW
                         ================================================= */

                      <div className="grid h-[140px] w-full max-w-full grid-cols-[112px_minmax(0,1fr)] overflow-hidden sm:h-[165px] sm:grid-cols-[160px_minmax(0,1fr)] md:h-[215px] md:grid-cols-[270px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
                        {/* LEFT: IMAGE SECTION */}

                        <div className="relative h-full w-full overflow-hidden bg-slate-100">
                          <Link
                            href={propertyHref}
                            className="block h-full w-full"
                          >
                            <Motion.img
                              src={img}
                              alt={
                                p.title ||
                                'Gulberg Greens Property'
                              }
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={
                                handleImageError
                              }
                            />

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
                          </Link>

                          {/* TOP-LEFT: BADGES */}

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

                          {/* BOTTOM-LEFT: IMAGE COUNT */}

                          <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[8px] font-medium text-white backdrop-blur-sm sm:bottom-3 sm:left-3 sm:text-[11px]">
                            <IconCamera className="h-2.5 w-2.5 text-white sm:h-3.5 sm:w-3.5" />

                            <span>
                              {imageCount}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT: CONTENT SECTION */}

                        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden p-1.5 pb-10 sm:justify-between sm:p-3 md:p-4">
                          <div className="min-w-0">
                            {/* 1. TITLE AT THE TOP */}

                            <h2 className="truncate text-[11px] font-bold leading-snug text-slate-900 transition group-hover:text-[#0d8272] sm:text-[14px] md:text-[15px]">
                              <Link
                                href={propertyHref}
                                className="block truncate"
                              >
                                {p.title}
                              </Link>
                            </h2>

                            {/* 2. PRICE */}

                            <p className="mt-0.5 truncate text-[13px] font-extrabold tracking-tight text-[#0f243c] sm:mt-1 sm:text-lg md:text-xl">
                              {formatCompactPkr(
                                p.price,
                              )}
                            </p>

                            {/* 3. LOCATION */}

                            <p className="mt-0.5 flex items-center gap-0.5 truncate text-[9px] font-medium text-slate-500 sm:mt-1 sm:gap-1 sm:text-xs">
                              <IconLocation className="h-2.5 w-2.5 shrink-0 text-[#0d9488] sm:h-3.5 sm:w-3.5" />

                              <span className="truncate">
                                {p.location ||
                                  (p.block
                                    ? `Gulberg Greens - Block ${p.block}`
                                    : 'Gulberg Greens')}
                              </span>
                            </p>

                            {/* 4. TAGS & SPECS */}

                            <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1 overflow-hidden sm:mt-1.5 sm:gap-1.5">
                              {p.listing_type_display ? (
                                <span className="shrink-0 rounded bg-[#e6f7f4] px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#0d8272] sm:px-1.5 sm:text-[10px]">
                                  {
                                    p.listing_type_display
                                  }
                                </span>
                              ) : null}

                              {p.block ? (
                                <span className="shrink-0 rounded bg-[#f1f5f9] px-1 py-0.5 text-[8px] font-semibold text-[#475569] sm:px-1.5 sm:text-[10px]">
                                  Block {p.block}
                                </span>
                              ) : null}

                              {p.bedrooms &&
                              Number(p.bedrooms) >
                                0 ? (
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold text-slate-700 sm:text-[11px]">
                                  <IconBed className="h-2.5 w-2.5 text-slate-500 sm:h-3 sm:w-3" />

                                  {p.bedrooms}
                                </span>
                              ) : null}

                              {p.baths &&
                              Number(p.baths) >
                                0 ? (
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold text-slate-700 sm:text-[11px]">
                                  <IconBath className="h-2.5 w-2.5 text-slate-500 sm:h-3 sm:w-3" />

                                  {p.baths}
                                </span>
                              ) : null}

                              {formatArea(p) ? (
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold text-slate-700 sm:text-[11px]">
                                  <IconExpandArea className="h-2.5 w-2.5 text-slate-500 sm:h-3 sm:w-3" />

                                  {formatArea(p)}
                                </span>
                              ) : null}
                            </div>

                            {/* 5. DESCRIPTION */}

                            {description ? (
                              <p className="mt-1 hidden text-xs font-normal leading-relaxed text-slate-500 sm:line-clamp-1 md:line-clamp-2">
                                {description}
                              </p>
                            ) : null}
                          </div>

                          {/* 6. BOTTOM ACTION BAR */}

                          <div className="absolute bottom-2 left-1.5 right-1.5 flex min-w-0 items-center justify-between border-t border-slate-100 pt-1 sm:static sm:mt-auto sm:w-full sm:pt-2">
                            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                              {/* WHATSAPP */}

                              <a
                                href={whatsappHref(
                                  p,
                                  propertyHref,
                                  img,
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-[36px] shrink-0 items-center justify-center rounded-md border border-[#25D366] bg-white px-0 py-0.5 text-[10px] font-semibold text-slate-800 transition hover:bg-[#25D366] hover:text-white active:scale-95 sm:w-auto sm:gap-1 sm:px-3 sm:py-1 sm:text-xs"
                                aria-label={`WhatsApp about ${p.title}`}
                              >
                                <IconWhatsAppBrand className="h-3 w-3 shrink-0 text-[#25D366] sm:h-3.5 sm:w-3.5" />

                                <span className="hidden sm:inline">
                                  WhatsApp
                                </span>
                              </a>

                              {/* CALL */}

                              <a
                                href={telHref}
                                className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-[#22c55e] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#16a34a] active:scale-95 sm:gap-1 sm:px-3.5 sm:py-1 sm:text-xs"
                                aria-label={`Call about ${p.title}`}
                              >
                                <IconPhone
                                  className="h-3 w-3 shrink-0 text-white sm:h-3.5 sm:w-3.5"
                                  strokeWidth={2}
                                />

                                <span className="text-white">
                                  CALL
                                </span>
                              </a>
                            </div>

                            {/* DETAILS */}

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
                      /* =================================================
                         GRID VIEW
                         ================================================= */

                      <div className="flex h-full flex-col">
                        <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                          <Link
                            href={propertyHref}
                            className="block h-full w-full"
                          >
                            <Motion.img
                              src={img}
                              alt={
                                p.title ||
                                'Gulberg Greens Property'
                              }
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={
                                handleImageError
                              }
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

                            <span>
                              {imageCount}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                          {/* 1. TITLE AT TOP */}

                          <h2 className="text-sm font-bold text-slate-900 transition group-hover:text-[#0d8272]">
                            <Link
                              href={propertyHref}
                              className="line-clamp-1"
                            >
                              {p.title}
                            </Link>
                          </h2>

                          {/* 2. PRICE */}

                          <p className="mt-1.5 text-xl font-extrabold tracking-tight text-[#0f243c]">
                            {formatCompactPkr(
                              p.price,
                            )}
                          </p>

                          {/* 3. LOCATION */}

                          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <IconLocation className="h-3.5 w-3.5 shrink-0 text-[#0d9488]" />

                            <span className="truncate">
                              {p.location ||
                                (p.block
                                  ? `Gulberg Greens - Block ${p.block}`
                                  : 'Gulberg Greens')}
                            </span>
                          </p>

                          {/* 4. TAGS & SPECS */}

                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {p.listing_type_display ? (
                              <span className="rounded bg-[#e6f7f4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d8272]">
                                {
                                  p.listing_type_display
                                }
                              </span>
                            ) : null}

                            {p.block ? (
                              <span className="rounded bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                                Block {p.block}
                              </span>
                            ) : null}
                          </div>

                          {/* META */}

                          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                            {p.bedrooms &&
                            Number(p.bedrooms) >
                              0 ? (
                              <span className="inline-flex items-center gap-1">
                                <IconBed className="h-3.5 w-3.5 text-slate-600" />

                                {p.bedrooms}
                              </span>
                            ) : null}

                            {p.baths &&
                            Number(p.baths) >
                              0 ? (
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
                                href={whatsappHref(
                                  p,
                                  propertyHref,
                                  img,
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[#25D366] bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-[#25D366] hover:text-white active:scale-95"
                                aria-label={`WhatsApp about ${p.title}`}
                              >
                                <IconWhatsAppBrand className="h-4 w-4 text-[#25D366]" />

                                <span>
                                  WhatsApp
                                </span>
                              </a>

                              <a
                                href={telHref}
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#22c55e] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#16a34a] active:scale-95"
                                aria-label={`Call about ${p.title}`}
                              >
                                <IconPhone
                                  className="h-4 w-4 text-white"
                                  strokeWidth={2}
                                />

                                <span className="text-white">
                                  CALL
                                </span>
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
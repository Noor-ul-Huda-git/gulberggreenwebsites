import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import {
  IconBath,
  IconBed,
  IconBuilding,
  IconChevronLeft,
  IconChevronRight,
  IconMail,
  IconPhone,
  IconPin,
  IconRuler,
  IconWhatsAppBrand,
} from '../components/properties/PropertyIcons.jsx'
import PropertySchema from '../components/seo/PropertySchema.jsx'
import { propertyDetailPath } from '../data/propertyListingTypes.js'
import { contactInfo } from '../data/siteContent.js'
import { fetchProperties, fetchProperty, submitPropertyListingEmail } from '../lib/api.js'

/** Primary heading / strip — matches site nav emphasis */
const BRAND_NAVY = '#1a3553'

function formatPkr(value) {
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

function formatRelativeTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  const diffMs = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.floor(diffMs / minute))
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }
  if (diffMs < day) {
    const hours = Math.max(1, Math.floor(diffMs / hour))
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }
  if (diffMs < week) {
    const days = Math.max(1, Math.floor(diffMs / day))
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  const weeks = Math.max(1, Math.floor(diffMs / week))
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`
}

/**
 * Details grid — prefer `block`; if empty, use the first segment of `location`
 * (e.g. "Block A, Gulberg Greens, Islamabad").
 */
function formatBlockLabel(block, location) {
  if (block != null && String(block).trim() !== '') {
    const t = String(block).trim()
    if (/^block\s/i.test(t)) return t
    return `Block ${t}`
  }
  if (location != null && String(location).trim() !== '') {
    const first = String(location).split(',')[0].trim()
    return first || '-'
  }
  return '-'
}

function galleryUrls(p) {
  const urls = []
  if (p.featured_image_url) urls.push(p.featured_image_url)
  if (Array.isArray(p.images)) {
    for (const im of p.images) {
      if (im.url && !urls.includes(im.url)) urls.push(im.url)
    }
  }
  return urls.length ? urls : []
}

function normalizeDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

function hasPhoneDigits(value) {
  return normalizeDigits(value).length >= 7
}

function whatsappHref(title, phoneNumber) {
  const phone = normalizeDigits(phoneNumber || contactInfo.phone)
  const text = encodeURIComponent(`Assalam o Alaikum, I am interested in: ${title}`)
  return `https://wa.me/${phone}?text=${text}`
}

/** Sidebar — twin solid #00a651 CTAs, square corners, CALL (left) then WhatsApp (right). */
const DETAIL_CTA_H = 'min-h-[52px] py-3'
const detailCtaRowClass = 'flex w-full min-w-0 items-stretch gap-2'
const detailCtaSolidBase = `property-listing-call-cta flex min-h-0 flex-1 flex-row items-center justify-center gap-2 rounded-none bg-[#00a651] px-4 !text-white shadow-none transition hover:bg-[#008f47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 active:scale-[0.98] ${DETAIL_CTA_H}`
const detailCtaCallBtnClass = `${detailCtaSolidBase} cursor-pointer text-[13px] uppercase tracking-[0.07em]`
const detailCtaWhatsAppLinkClass = `${detailCtaSolidBase} min-w-0 text-[14px] font-semibold`

function formatReference(property) {
  if (property.slug) return property.slug.toUpperCase()
  if (property.id != null) return `ID${property.id}`
  return 'PROPERTY'
}

function trailingSlugNumber(slug) {
  const clean = String(slug || '').trim()
  if (!clean) return ''
  const m = clean.match(/(\d+)\s*$/)
  return m ? m[1] : ''
}

function formatMarlasValue(value) {
  if (value == null || value === '') return ''
  const num = Number(value)
  if (!Number.isNaN(num) && Number.isInteger(num)) return String(num)
  return String(value).replace(/\.0+$/, '')
}

function formatArea(property) {
  if (!property || property.area_marlas == null || property.area_marlas === '') return '-'
  const unit = property.area_unit_display || 'Marla'
  const marlas = formatMarlasValue(property.area_marlas)
  const plural = Number(marlas) === 1 || unit.endsWith('s') ? '' : 's'
  return `${marlas} ${unit}${plural}`
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncateMeta(value, max = 155) {
  const text = stripHtml(value)
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trim()}…`
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

function IconUser({ className = '', size = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`${size} ${className}`.trim()} aria-hidden>
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20a7 7 0 0114 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function parsePropertyListResponse(data) {
  return Array.isArray(data) ? data : data.results ?? []
}

function cardImageUrl(p) {
  if (p.featured_image_url) return p.featured_image_url
  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0].url) {
    return p.images[0].url
  }
  return null
}

function primaryListingPhone(p) {
  const a1 = p.agency_name?.trim() || ''
  const a2 = p.agent_phone?.trim() || ''
  if (hasPhoneDigits(a1)) return a1
  if (hasPhoneDigits(a2)) return a2
  return contactInfo.phone
}

function SimilarListingsCarousel({ title, items }) {
  const scrollRef = useRef(null)

  const scrollBy = (delta) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-3xl text-lg font-semibold leading-snug tracking-tight text-slate-900 md:text-xl">{title}</p>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-360)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 transition hover:border-[#31C950]/35 hover:text-[#31C950]"
            aria-label="Scroll left"
          >
            <IconChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(360)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 transition hover:border-[#31C950]/35 hover:text-[#31C950]"
            aria-label="Scroll right"
          >
            <IconChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-5 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p) => {
          const img = cardImageUrl(p)
          const photoCount = Array.isArray(p.images) ? p.images.length : 0
          const line = p.location || (p.block ? `Block ${p.block}` : '')
          const tel = primaryListingPhone(p).replace(/\s/g, '')
          return (
            <article
              key={`${p.id}-${p.slug}`}
              className="w-[min(100%,280px)] shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
            >
              <Link to={propertyDetailPath(p)} className="relative block">
                <div className="relative aspect-[4/3] bg-slate-100">
                  {img ? (
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[12px] text-slate-400">No image</div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                  <div className="absolute left-2 top-2 flex gap-2">
                    {p.is_featured ? (
                      <span className="bg-[#ef4444] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">Hot</span>
                    ) : null}
                    <span className="bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-900">Titanium</span>
                  </div>

                  <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded bg-black/55 px-2 py-1 text-[11px] font-medium text-white">
                    <span className="inline-flex items-center gap-1">
                      <span aria-hidden>📷</span>
                      {Math.max(photoCount, img ? 1 : 0)}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 flex items-center gap-2 text-white/90">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-black/45 text-[12px]" aria-hidden>
                      📍
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-black/45 text-[12px]" aria-hidden>
                      ↗
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-black/45 text-[12px]" aria-hidden>
                      ♡
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500">
                  <span>Added: {formatRelativeTime(p.created_at)}</span>
                  <span className="inline-flex items-center gap-2 text-[12px]">
                    <span aria-hidden>🔥</span>
                    <span aria-hidden>🛡️</span>
                  </span>
                </div>

                <p className="mt-3 text-[17px] font-semibold tabular-nums tracking-tight text-slate-900">{formatPkr(p.price)}</p>
                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-slate-700">{line || p.title}</p>

                {p.area_marlas != null ? (
                  <p className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-slate-800">
                    <span className="text-slate-500" aria-hidden>
                      ⇅
                    </span>
                    {formatArea(p)}
                  </p>
                ) : null}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(`Inquiry: ${p.title}`)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-[#31C950]/35 bg-white px-3 py-2 text-[12px] font-semibold text-[#31C950] transition hover:bg-[#31C950]/8"
                  >
                    <IconMail size="h-4 w-4" />
                    Email
                  </a>
                  <a
                    href={`tel:${tel}`}
                    className="property-listing-call-cta inline-flex items-center justify-center gap-2 rounded-none bg-[#00a651] px-3 py-2 text-[12px] uppercase tracking-[0.07em] !text-white transition hover:bg-[#008f47]"
                  >
                    <IconPhone className="!text-white" size="h-4 w-4" strokeWidth={2} />
                    CALL
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/** Renders CKEditor HTML or legacy plain text (admin may still have old content). */
function PropertyDescriptionBody({ html }) {
  const raw = html?.trim() ?? ''
  if (!raw) return null

  if (/<[a-z][\s\S]*>/i.test(raw)) {
    return (
      <div
        className="property-description-body max-w-full text-[15px] leading-[1.75] text-slate-700 [&_img]:h-auto [&_img]:max-w-full [&_table]:max-w-full [&_a]:font-medium [&_a]:text-[#1a3553] [&_a]:underline [&_a]:decoration-[#31C950]/40 [&_a]:underline-offset-[3px] [&_a]:transition hover:[&_a]:text-[#31C950] hover:[&_a]:decoration-[#31C950] [&_strong]:font-semibold [&_em]:italic [&_h2]:mt-8 [&_h2]:font-semibold [&_h2]:text-[#1a3553] [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-[#1a3553] [&_h4]:mt-4 [&_h4]:font-semibold [&_h4]:text-slate-800 [&_p+p]:mt-4 [&_p]:leading-[1.75] [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#31C950]/45 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_hr]:my-8 [&_hr]:border-slate-200"
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    )
  }

  return (
    <div className="space-y-4 text-[15px] leading-[1.75] text-slate-700">
      {raw.split(/\n\n+/).map((block, i) => (
        <p key={i} className="whitespace-pre-line">
          {block}
        </p>
      ))}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-9" style={{ backgroundColor: BRAND_NAVY }} />
      <div className="container-shell max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 aspect-[21/9] max-h-[min(56vh,520px)] animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  )
}

function PropertyDetail() {
  const { categorySlug = '', block = '', slug = '' } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [inquiryStatus, setInquiryStatus] = useState(null)
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [showCallModal, setShowCallModal] = useState(false)
  const [showInquirySuccessModal, setShowInquirySuccessModal] = useState(false)
  const [copiedField, setCopiedField] = useState('')
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [similarAround, setSimilarAround] = useState([])
  const [similarByAgent, setSimilarByAgent] = useState([])
  const [mobileFavorite, setMobileFavorite] = useState(false)

  const handleMobileShare = useCallback(async () => {
    if (!property) return
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, url })
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      }
    } catch {
      /* user cancelled or unsupported */
    }
  }, [property])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setActiveIndex(0)
    setActiveTab('overview')
    setDescriptionExpanded(false)
    setShowCallModal(false)
    setCopiedField('')
    setSimilarAround([])
    setSimilarByAgent([])
    setInquiryStatus(null)
    setInquiryMessage('')
    setInquiryForm({ name: '', email: '', phone: '', message: '' })
    setShowInquirySuccessModal(false)
    ;(async () => {
      try {
        const data = await fetchProperty({ slug, categorySlug, block: decodeURIComponent(block) })
        if (cancelled) return
        if (!data) {
          setProperty(null)
          setError('notfound')
        } else {
          setProperty(data)
        }
      } catch {
        if (!cancelled) {
          setProperty(null)
          setError('error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, categorySlug, block])

  const images = useMemo(() => (property ? galleryUrls(property) : []), [property])

  useEffect(() => {
    if (!property) return undefined

    const previousTitle = document.title
    const previousDescription = document.head.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    const previousCanonical = document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
    const previousRobots = document.head.querySelector('meta[name="robots"]')?.getAttribute('content') || ''

    const blockLabel = formatBlockLabel(property.block, property.location)
    const sizeLabel = formatArea(property)
    const priceLabel = property.price != null && property.price !== '' ? formatPkr(property.price) : ''
    const serialNumber = trailingSlugNumber(property.slug)
    const titleParts = [
      serialNumber ? `${property.title || 'Property'} (${serialNumber})` : property.title || 'Property',
      blockLabel,
      sizeLabel,
      priceLabel,
    ].filter((v) => v && v !== '-')
    const title = `${titleParts.join(', ')} | Gulberg Greens Islamabad`
    const descriptionSource =
      stripHtml(property.description) ||
      stripHtml(property.short_description) ||
      stripHtml(property.meta_description) ||
      `${property.title} in ${property.location || property.block || 'Gulberg Greens Islamabad'}.`
    const description = descriptionSource.slice(0, 130).trim()
    const canonical =
      typeof window !== 'undefined'
        ? window.location.pathname === '/'
          ? window.location.origin
          : `${window.location.origin}${window.location.pathname}`
        : property.canonical_url || `https://gulberggreens.com.pk${propertyDetailPath(property)}`

    document.title = title
    upsertMeta('description', description)
    upsertMeta('robots', 'index, follow')
    upsertCanonical(canonical)

    return () => {
      document.title = previousTitle
      if (previousDescription) upsertMeta('description', previousDescription)
      if (previousCanonical) upsertCanonical(previousCanonical)
      if (previousRobots) upsertMeta('robots', previousRobots)
    }
  }, [property])

  useEffect(() => {
    setActiveIndex(0)
  }, [images.length, slug])

  useEffect(() => {
    if (!property) return undefined

    let cancelled = false
    ;(async () => {
      try {
        const listingType = property.listing_type
        const block = property.block?.trim()
        const agentPhone = property.agency_name?.trim()

        const aroundParams = {
          listing_type: listingType || undefined,
          block: block || undefined,
        }

        const [aroundData, agentData] = await Promise.all([
          fetchProperties({ ...aroundParams, page: '1' }),
          hasPhoneDigits(agentPhone)
            ? fetchProperties({
                listing_type: listingType || undefined,
                agent_phone: agentPhone,
                page: '1',
              })
            : Promise.resolve({ results: [] }),
        ])

        if (cancelled) return

        const aroundList = parsePropertyListResponse(aroundData)
          .filter((p) => p.slug !== property.slug)
          .slice(0, 12)

        const agentList = hasPhoneDigits(agentPhone)
          ? parsePropertyListResponse(agentData)
              .filter((p) => p.slug !== property.slug)
              .slice(0, 12)
          : []

        setSimilarAround(aroundList)
        setSimilarByAgent(agentList)
      } catch {
        if (!cancelled) {
          setSimilarAround([])
          setSimilarByAgent([])
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [property])

  const goPrev = useCallback(() => {
    if (images.length < 2) return
    setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    if (images.length < 2) return
    setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const handleInquiryChange = (field) => (event) => {
    setInquiryForm((prev) => ({ ...prev, [field]: event.target.value }))
    setInquiryStatus(null)
    setInquiryMessage('')
  }

  const handlePhoneChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '').replace(/^92/, '').slice(0, 10)
    setInquiryForm((prev) => ({ ...prev, phone: digits }))
    setInquiryStatus(null)
    setInquiryMessage('')
  }

  const inquiryFormLocked = inquiryStatus === 'sent' || inquiryStatus === 'duplicate'

  const handleInquirySubmit = async (event) => {
    event.preventDefault()
    if (!property?.id || inquiryFormLocked) return
    setInquiryStatus('sending')
    setInquiryMessage('')
    try {
      const result = await submitPropertyListingEmail(property.id, {
        name: inquiryForm.name.trim(),
        email: inquiryForm.email.trim(),
        phone: inquiryForm.phone,
        message: inquiryForm.message.trim(),
      })
      if (result.duplicate) {
        setInquiryStatus('duplicate')
        setInquiryMessage(result.detail)
        return
      }
      if (result.ok !== true) {
        setInquiryStatus('error')
        setInquiryMessage('Unexpected response from server. Please try again.')
        return
      }
      setInquiryStatus('sent')
      setInquiryMessage(result.detail || 'Your inquiry has been received. Our team will get back to you soon.')
    } catch (err) {
      setInquiryStatus('error')
      setInquiryMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  useEffect(() => {
    if (inquiryStatus === 'sent') {
      setShowInquirySuccessModal(true)
    }
  }, [inquiryStatus])

  const handleCopy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(key)
      window.setTimeout(() => {
        setCopiedField((current) => (current === key ? '' : current))
      }, 1800)
    } catch {
      setCopiedField('')
    }
  }

  if (loading) {
    return <DetailSkeleton />
  }

  if (error === 'error') {
    return (
      <div className="min-h-[50vh] bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_100%)] px-4 py-14 sm:px-6 sm:py-20">
        <div className="container-shell mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-lg font-semibold text-[#1a3553]">Something went wrong</p>
            <p className="mt-2 text-sm text-slate-600">Please try again shortly.</p>
            <Link
              to="/properties"
              className="mt-8 inline-flex rounded-lg bg-[#31C950] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_-8px_rgba(49,201,80,0.55)] transition hover:bg-[#28b048]"
            >
              Back to properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error === 'notfound' || !property) {
    return (
      <div className="min-h-[50vh] bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_100%)] px-4 py-14 sm:px-6 sm:py-20">
        <div className="container-shell mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-lg font-semibold text-[#1a3553]">Listing not found</p>
            <p className="mt-2 text-sm text-slate-600">It may have been removed or unpublished.</p>
            <Link
              to="/properties"
              className="mt-8 inline-flex rounded-lg bg-[#31C950] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_-8px_rgba(49,201,80,0.55)] transition hover:bg-[#28b048]"
            >
              Back to properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const activeUrl = images[activeIndex] ?? null
  const addressLine = property.location || (property.block ? `Block ${property.block} · Gulberg Greens, Islamabad` : 'Gulberg Greens, Islamabad')
  const callContacts = [
    {
      key: 'agent-1',
      label: property.agent_name?.trim() || 'Agent 1',
      phone: property.agency_name?.trim() || '',
    },
    {
      key: 'agent-2',
      label: property.agent_mobile?.trim() || 'Agent 2',
      phone: property.agent_phone?.trim() || '',
    },
  ].filter((item) => hasPhoneDigits(item.phone))
  const effectiveCallContacts = callContacts.length
    ? callContacts
    : [{ key: 'office-contact', label: 'Office contact', phone: contactInfo.phone }]
  const primaryContactPhone = effectiveCallContacts[0]?.phone || contactInfo.phone
  const callReference = formatReference(property)
  const propertyFacts = [
    { key: 'type', label: 'Type', value: property.listing_type_display || property.listing_type || '-' },
    { key: 'purpose', label: 'Purpose', value: property.purpose || '-' },
    {
      key: 'plot_no',
      label: 'Plot No',
      value: property.plot_number != null && String(property.plot_number).trim() !== '' ? String(property.plot_number).trim() : '-',
    },
    { key: 'block', label: 'Block', value: formatBlockLabel(property.block, property.location) },
    {
      key: 'size',
      label: 'Size',
      value: formatArea(property),
    },
    {
      key: 'category',
      label: 'Category',
      value: property.category != null && String(property.category).trim() !== '' ? String(property.category).trim() : '-',
    },
    { key: 'beds', label: 'Bed Room', value: property.bedrooms != null ? `${property.bedrooms}` : '-' },
    { key: 'baths', label: 'Bath Room', value: property.baths != null ? `${property.baths}` : '-' },
    { key: 'price', label: 'Price', value: property.price != null && property.price !== '' ? formatPkr(property.price) : '-' },
    { key: 'added', label: 'Added', value: formatRelativeTime(property.created_at) },
  ]
  const detailTabs = [
    { id: 'overview', label: 'Details' },
    ...(property.short_description ? [{ id: 'summary', label: 'Summary' }] : []),
    ...(property.description ? [{ id: 'description', label: 'Description' }] : []),
  ]

  const aroundLabel =
    property.location?.trim() ||
    (property.block?.trim() ? `Block ${property.block.trim()}` : '') ||
    'this area'
  const similarAroundTitle = `Similar ${property.listing_type_display || property.listing_type || 'listings'} around ${aroundLabel}`
  const similarAgentTitle = `Similar ${property.listing_type_display || property.listing_type || 'listings'} by ${property.agent_name?.trim() || 'this agent'}`

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    const section = document.getElementById(tabId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%)] font-[Poppins,Manrope,system-ui,sans-serif] text-slate-900">
      <PropertySchema property={property} />
      {showCallModal ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="property-call-modal-title">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close call details"
            onClick={() => setShowCallModal(false)}
          />
          <div className="relative z-10 max-h-[min(92vh,720px)] w-full max-w-[30rem] overflow-y-auto overflow-x-hidden rounded-xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.3)]">
            <div className="h-2 bg-[#31C950]" />
            <div className="px-4 pb-6 pt-5 sm:px-7 sm:pb-8 sm:pt-6">
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                className="absolute right-5 top-5 text-slate-400 transition hover:text-slate-700"
                aria-label="Close call details"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <p id="property-call-modal-title" className="text-center text-[1.35rem] font-semibold tracking-tight text-[#1a3553] sm:text-[2rem]">
                Contact Us
              </p>
              <div className="mt-5 divide-y divide-slate-200 rounded-lg border border-slate-100 bg-white sm:mt-7">
                {effectiveCallContacts.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[#111111]">
                      <IconPhone className="text-[#111111]" size="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-slate-400">{item.label}</p>
                      <a href={`tel:${item.phone.replace(/\s/g, '')}`} className="mt-1 block break-all text-[1.05rem] text-[#0ea5e9] hover:text-[#0284c7]">
                        {item.phone}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleCopy(item.key, item.phone)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 self-stretch rounded-md border border-slate-200 px-3 py-2.5 text-[1rem] font-medium text-[#31C950] transition hover:border-[#31C950]/40 hover:bg-[#31C950]/5 hover:text-[#28b048] sm:self-center sm:border-0 sm:px-0 sm:py-0"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
                        <path d="M9 9h10v11H9z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {copiedField === item.key ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-7 text-center text-[1rem] leading-8 text-slate-700">
                Please quote property reference
                <br />
                <span className="font-semibold text-[#1a3553]">{callReference}</span>
                <br />
                when calling us.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {showInquirySuccessModal
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 px-4 py-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="inquiry-success-title"
            >
              <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close success message"
                onClick={() => setShowInquirySuccessModal(false)}
              />
              <div className="relative z-10 w-full max-w-[26rem] overflow-hidden rounded-2xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]">
                <div className="h-1 w-full bg-[#5cb85c]" aria-hidden />
                <button
                  type="button"
                  onClick={() => setShowInquirySuccessModal(false)}
                  className="absolute right-4 top-4 z-20 text-slate-400 transition hover:text-slate-700"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="px-8 pb-9 pt-12 text-center sm:px-10">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#5cb85c] shadow-[0_8px_24px_rgba(92,184,92,0.35)]">
                    <svg viewBox="0 0 24 24" className="h-11 w-11 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p id="inquiry-success-title" className="mt-6 text-2xl font-bold tracking-tight text-[#5cb85c]">
                    Success!
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-slate-800">
                    Your message has been sent successfully. You will receive a reply at the email address you provided.
                  </p>
                  <p className="mt-5 text-[14px] leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Note:</strong> Please add{' '}
                    <span className="font-semibold text-[#1a3553]">{contactInfo.email}</span> to your email safelist or
                    whitelist so our reply is not filtered as spam.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowInquirySuccessModal(false)}
                    className="mt-8 inline-flex min-w-[8.5rem] items-center justify-center rounded-md bg-[#428bca] px-10 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-[#357ebd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#428bca]"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      <div className="hidden border-b border-slate-200/80 bg-white lg:block">
        <div className="container-shell max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <h1 className="max-w-5xl break-words text-[1.5rem] font-medium leading-[1.2] tracking-[-0.025em] text-slate-800 md:text-[1.75rem] lg:text-[1.875rem]">
              {property.title}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500 md:text-[13px]">
              <IconPin className="text-[#31C950]" size="h-3.5 w-3.5" aria-hidden />
              {addressLine}
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell max-w-7xl px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="grid min-w-0 gap-5 lg:grid-cols-12 lg:items-start lg:gap-6">
          <div className="min-w-0 max-lg:-mx-4 lg:col-span-8">
            <div className="mb-2 flex items-center lg:hidden">
              <Link
                to="/properties"
                className="inline-flex items-center gap-1 py-1 text-[13px] font-semibold text-[#1a3553] transition hover:text-[#00a651]"
              >
                <IconChevronLeft size="h-5 w-5" />
                Properties
              </Link>
            </div>
            <div className="relative w-full max-w-full overflow-hidden border border-slate-200 bg-slate-200 shadow-[0_4px_24px_-4px_rgba(26,53,83,0.12)] max-lg:rounded-none max-lg:border-x-0 lg:rounded-lg">
              <div className="group relative aspect-[16/11] min-h-[260px] w-full sm:min-h-[340px] lg:min-h-[520px]">
                <AnimatePresence mode="wait">
                  {activeUrl ? (
                    <Motion.img
                      key={activeUrl}
                      src={activeUrl}
                      alt=""
                      initial={{ opacity: 0.85 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.85 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
                      Photos coming soon
                    </div>
                  )}
                </AnimatePresence>

                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-none border-0 bg-transparent text-white/90 opacity-100 shadow-none [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))] transition duration-200 hover:text-[#31C950] focus-visible:opacity-100 sm:pointer-events-none sm:text-white/0 sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:text-white/90 sm:group-hover:opacity-100"
                      aria-label="Previous photo"
                    >
                      <IconChevronLeft />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-none border-0 bg-transparent text-white/90 opacity-100 shadow-none [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))] transition duration-200 hover:text-[#31C950] focus-visible:opacity-100 sm:pointer-events-none sm:text-white/0 sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:text-white/90 sm:group-hover:opacity-100"
                      aria-label="Next photo"
                    >
                      <IconChevronRight />
                    </button>
                  </>
                ) : null}

                {images.length > 1 ? (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 lg:hidden" aria-hidden>
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 w-1.5 rounded-full transition ${idx === activeIndex ? 'bg-white' : 'bg-white/45'}`}
                        aria-label={`Photo ${idx + 1}`}
                      />
                    ))}
                  </div>
                ) : null}

                {images.length ? (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded border border-white/25 bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm max-lg:bottom-10 lg:bottom-4 lg:left-4 lg:right-auto">
                    <span aria-hidden>📷</span>
                    <span>
                      {activeIndex + 1}/{images.length}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-0 space-y-3 border-b border-slate-200 bg-white px-3 py-3 lg:hidden">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 text-[1.35rem] font-semibold tabular-nums leading-tight tracking-tight text-slate-900">
                  {formatPkr(property.price)}
                </p>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setMobileFavorite((v) => !v)}
                    className="flex h-10 w-10 items-center justify-center rounded-none text-slate-600 transition hover:text-[#00a651]"
                    aria-label={mobileFavorite ? 'Remove from saved' : 'Save listing'}
                  >
                    <svg viewBox="0 0 24 24" fill={mobileFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
                      <path d="M12 21s-6.716-4.11-8.5-8.5C2.716 8.11 5.58 4 9.5 4c1.74 0 3.41.81 4.5 2.09A6.98 6.98 0 0114.5 4c3.92 0 6.784 4.11 6 8.5C18.716 16.89 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleMobileShare()}
                    className="flex h-10 w-10 items-center justify-center rounded-none text-slate-600 transition hover:text-[#00a651]"
                    aria-label="Share listing"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
                      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v15" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-[12px] leading-snug text-slate-500">{addressLine}</p>
              {property.area_marlas != null ? (
                <p className="flex items-center gap-2 text-[13px] font-medium text-slate-800">
                  <IconRuler className="text-[#00a651]" size="h-4 w-4" aria-hidden />
                  {formatArea(property)}
                </p>
              ) : null}
              <div className="mx-auto flex w-[90%] max-w-full items-stretch justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCallModal(true)}
                  className={`${detailCtaCallBtnClass} min-w-0 flex-1`}
                  aria-label="View phone numbers to call"
                >
                  <IconPhone className="shrink-0 !text-white" size="h-7 w-7" strokeWidth={2.1} />
                  CALL
                </button>
                <a
                  href={whatsappHref(property.title, primaryContactPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${detailCtaWhatsAppLinkClass} min-w-0 flex-1`}
                  aria-label={`WhatsApp about ${property.title}`}
                >
                  <IconWhatsAppBrand className="shrink-0 text-white" size="h-7 w-7" />
                  WhatsApp
                </a>
              </div>
            </div>

            {images.length > 1 ? (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {images.map((url, idx) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition sm:h-20 sm:w-28 ${
                      idx === activeIndex ? 'border-[#31C950] ring-2 ring-[#31C950]/20' : 'border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-3 hidden border-b border-slate-200 bg-white py-3 lg:block">
              {property.area_marlas != null ? (
                <div className="flex items-center gap-3 px-1 sm:px-2">
                  <IconRuler className="text-[#1a3553]" size="h-4 w-4" />
                  <div>
                    <p className="text-[16px] font-semibold text-[#1a3553]">{formatMarlasValue(property.area_marlas)}</p>
                    <p className="text-[11px] text-slate-500">{property.area_unit_display || 'Marla'}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-3 w-full max-w-full overflow-x-auto overscroll-x-contain max-lg:-mx-4 max-lg:px-0">
              <div className="flex w-full min-w-0 items-stretch border-b border-slate-200 bg-white max-lg:gap-0 lg:w-max lg:max-w-none lg:gap-1 lg:rounded-lg lg:border lg:border-slate-200 lg:bg-slate-100 lg:p-1">
                {detailTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`min-w-0 flex-1 shrink-0 px-2 py-2.5 text-[12px] font-medium transition sm:px-4 sm:py-3 sm:text-[13px] max-lg:border-b-2 max-lg:border-transparent max-lg:text-center lg:rounded-full lg:px-5 ${
                      activeTab === tab.id
                        ? 'max-lg:border-[#00a651] max-lg:text-[#00a651] lg:bg-white lg:text-[#1a3553] lg:shadow-sm'
                        : 'max-lg:text-slate-600 lg:hover:bg-white/8'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_16px_48px_-24px_rgba(26,53,83,0.45)]"
              >
                <div className="hidden border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5 lg:block">
                  <p className="mt-2 break-words text-[1.45rem] font-medium tabular-nums tracking-[-0.02em] text-slate-800 sm:text-[1.65rem] md:text-[1.85rem]">
                    {formatPkr(property.price)}
                  </p>

                  <div className={`mt-4 min-w-0 ${detailCtaRowClass}`}>
                    <button
                      type="button"
                      onClick={() => setShowCallModal(true)}
                      className={detailCtaCallBtnClass}
                      aria-label="View phone numbers to call"
                    >
                      <IconPhone className="shrink-0 !text-white" size="h-7 w-7" strokeWidth={2.1} />
                      CALL
                    </button>
                    <a
                      href={whatsappHref(property.title, primaryContactPhone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={detailCtaWhatsAppLinkClass}
                      aria-label={`WhatsApp about ${property.title}`}
                    >
                      <IconWhatsAppBrand className="shrink-0 text-white" size="h-7 w-7" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Customer inquiry</p>
                  <form onSubmit={(e) => void handleInquirySubmit(e)} className="mt-4 min-w-0 space-y-3">
                    <div className="flex min-w-0 items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-[#31C950]/55 focus-within:bg-white">
                      <span className="mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-500 sm:mr-3">
                        <IconUser size="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={inquiryForm.name}
                        onChange={handleInquiryChange('name')}
                        placeholder="Your name"
                        required
                        disabled={inquiryFormLocked}
                        className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                    <div className="flex min-w-0 items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-[#31C950]/55 focus-within:bg-white">
                      <span className="mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-500 sm:mr-3">
                        <IconMail size="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        value={inquiryForm.email}
                        onChange={handleInquiryChange('email')}
                        placeholder="Your email"
                        required
                        disabled={inquiryFormLocked}
                        className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                    <div className="flex min-w-0 items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-[#31C950]/55 focus-within:bg-white">
                      <span className="mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[#31C950]/20 bg-[#31C950]/10 text-[#31C950] sm:mr-3">
                        <IconPhone size="h-4 w-4" />
                      </span>
                      <span className="mr-1.5 shrink-0 text-base font-medium text-slate-900 sm:mr-2">+92</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={inquiryForm.phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        placeholder="3001234567"
                        disabled={inquiryFormLocked}
                        className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                    <textarea
                      rows={4}
                      value={inquiryForm.message}
                      onChange={handleInquiryChange('message')}
                      placeholder={`I would like to inquire about ${property.title}`}
                      disabled={inquiryFormLocked}
                      className="w-full resize-y rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[#31C950]/55 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={inquiryFormLocked || inquiryStatus === 'sending'}
                      className="property-listing-call-cta inline-flex w-full min-h-[52px] items-center justify-center gap-2 rounded-none bg-[#00a651] px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.07em] !text-white shadow-none transition hover:bg-[#008f47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <IconMail className="!text-white" size="h-5 w-5" />
                      {inquiryStatus === 'sending' ? 'Sending…' : 'Send Email'}
                    </button>
                  </form>

                  <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    {inquiryStatus === 'duplicate' ? (
                      <p className="mt-3 text-[13px] leading-relaxed text-amber-800">{inquiryMessage}</p>
                    ) : null}
                    {inquiryStatus === 'error' ? (
                      <p className="mt-3 text-[13px] leading-relaxed text-rose-700">{inquiryMessage}</p>
                    ) : null}
                  </div>
                </div>
              </Motion.div>
            </div>
          </aside>
        </div>
      </div>

      <div className="container-shell max-w-7xl px-4 pb-10 pt-2 sm:px-6 lg:px-8 lg:pb-14">
        <div className="grid min-w-0 gap-6 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-8">
            <Motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* <section id="overview" className="scroll-mt-28">
                <p className="text-xl font-semibold tracking-tight text-[#1a3553] md:text-2xl">Overview</p>
              </section> */}

              <div className="mt-4" id="overview">
                <h3 className="text-[1.35rem] font-semibold tracking-tight text-[#1a3553]">Details</h3>
                <div className="mt-4 max-lg:divide-y max-lg:divide-slate-200 max-lg:overflow-hidden max-lg:rounded-none max-lg:border max-lg:border-slate-200 max-lg:bg-white grid gap-x-6 gap-y-3 md:grid-cols-2">
                  {propertyFacts.map((item) => (
                    <div
                      key={item.key}
                      className="max-lg:flex max-lg:items-center max-lg:justify-between max-lg:gap-3 max-lg:bg-white max-lg:px-3 max-lg:py-3 grid grid-cols-1 gap-1 bg-slate-50/70 px-4 py-3 sm:grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] sm:items-center sm:gap-x-4 md:grid-cols-[10rem_minmax(0,1fr)] lg:bg-slate-50/70"
                    >
                      <span className="text-[12px] font-medium text-slate-500 max-lg:shrink-0 sm:text-[13px] md:text-[15px] lg:font-normal lg:text-slate-700">
                        {item.label}
                      </span>
                      <span className="min-w-0 max-w-[65%] text-right text-[14px] font-semibold text-slate-900 max-lg:truncate sm:text-[15px] md:font-medium md:text-[#1a3553] lg:max-w-none lg:text-left">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {property.short_description ? (
                <div id="summary" className="mt-6 scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-lg font-semibold leading-snug text-[#1a3553] md:text-xl">{property.short_description}</p>
                </div>
              ) : null}

              {property.description ? (
                <div id="description" className="mt-6 scroll-mt-28">
                  <h3 className="text-xl font-semibold tracking-tight text-[#1a3553] md:text-2xl">Description</h3>
                  <div className="mt-4 min-w-0 overflow-x-auto rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <div className={descriptionExpanded ? 'min-w-0' : 'relative max-h-[220px] min-w-0 overflow-hidden'}>
                      <PropertyDescriptionBody html={property.description} />
                      {!descriptionExpanded ? (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/92 to-transparent" />
                      ) : null}
                    </div>
                    <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => setDescriptionExpanded((prev) => !prev)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#31C950] transition hover:text-[#28b048]"
                      >
                        {descriptionExpanded ? 'Read less' : 'Read more'}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className={`h-4 w-4 transition-transform ${descriptionExpanded ? 'rotate-180' : ''}`}
                          aria-hidden
                        >
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </Motion.div>
          </div>
        </div>
      </div>

      {similarAround.length > 0 || similarByAgent.length > 0 ? (
        <div className="container-shell max-w-7xl min-w-0 px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <SimilarListingsCarousel title={similarAroundTitle} items={similarAround} />
          <SimilarListingsCarousel title={similarAgentTitle} items={similarByAgent} />
        </div>
      ) : null}
    </div>
  )
}

export default PropertyDetail

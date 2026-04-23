import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import PageBreadcrumbs from '../components/layout/PageBreadcrumbs.jsx'
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
} from '../components/properties/PropertyIcons.jsx'
import { contactInfo } from '../data/siteContent.js'
import { fetchProperties, fetchProperty } from '../lib/api.js'

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
      const compact = (n / unit.value).toFixed(1).replace(/\.0$/, '')
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

function formatReference(property) {
  if (property.slug) return property.slug.toUpperCase()
  if (property.id != null) return `ID${property.id}`
  return 'PROPERTY'
}

function buildInquiryMailto(property, form) {
  const subject = `Inquiry: ${property.title}`
  const body = [
    `Property: ${property.title}`,
    form.name ? `Name: ${form.name}` : null,
    form.email ? `Email: ${form.email}` : null,
    form.phone ? `Phone: +92 ${form.phone}` : null,
    '',
    form.message || 'I would like to get more details about this property.',
  ]
    .filter(Boolean)
    .join('\n')

  return `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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
        <h2 className="max-w-3xl text-lg font-semibold leading-snug tracking-tight text-slate-900 md:text-xl">{title}</h2>
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
              <Link to={`/properties/${p.slug}`} className="relative block">
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
                    {p.area_marlas} Marla{Number(p.area_marlas) === 1 ? '' : 's'}
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
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#31C950] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#28b048]"
                  >
                    <IconPhone size="h-4 w-4" />
                    Call
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
      <div className="border-b border-slate-100 bg-white">
        <div className="container-shell max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <PageBreadcrumbs
            variant="onLight"
            items={[{ to: '/', label: 'Home' }, { to: '/properties', label: 'Properties' }, { label: 'Loading…' }]}
          />
        </div>
      </div>
      <div className="container-shell max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 aspect-[21/9] max-h-[min(56vh,520px)] animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  )
}

function PropertyDetail() {
  const { slug } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [inquiryStatus, setInquiryStatus] = useState(null)
  const [showCallModal, setShowCallModal] = useState(false)
  const [copiedField, setCopiedField] = useState('')
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [similarAround, setSimilarAround] = useState([])
  const [similarByAgent, setSimilarByAgent] = useState([])

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
    ;(async () => {
      try {
        const data = await fetchProperty(slug)
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
  }, [slug])

  const images = useMemo(() => (property ? galleryUrls(property) : []), [property])

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
  }

  const handlePhoneChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '').replace(/^92/, '').slice(0, 10)
    setInquiryForm((prev) => ({ ...prev, phone: digits }))
    setInquiryStatus(null)
  }

  const handleInquirySubmit = (event) => {
    event.preventDefault()
    window.location.href = buildInquiryMailto(property, inquiryForm)
    setInquiryStatus('sent')
  }

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
          <PageBreadcrumbs
            variant="onLight"
            className="mb-10"
            items={[{ to: '/', label: 'Home' }, { to: '/properties', label: 'Properties' }, { label: 'Error' }]}
          />
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
          <PageBreadcrumbs
            variant="onLight"
            className="mb-10"
            items={[{ to: '/', label: 'Home' }, { to: '/properties', label: 'Properties' }, { label: 'Not found' }]}
          />
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
      value: property.area_marlas != null ? `${property.area_marlas} Marla${Number(property.area_marlas) === 1 ? '' : 's'}` : '-',
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

              <h2 id="property-call-modal-title" className="text-center text-[1.35rem] font-semibold tracking-tight text-[#1a3553] sm:text-[2rem]">
                Contact Us
              </h2>
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

      <div className="border-b border-slate-200/80 bg-white">
        <div className="container-shell max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <PageBreadcrumbs
            variant="onLight"
            className="mb-3"
            items={[
              { to: '/', label: 'Home' },
              { to: '/properties', label: 'Properties' },
              { label: property.title },
            ]}
          />
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
          <div className="min-w-0 lg:col-span-8">
            <div className="relative w-full max-w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-200 shadow-[0_4px_24px_-4px_rgba(26,53,83,0.12)]">
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

                {images.length ? (
                  <div className="absolute bottom-4 left-4 rounded-md border border-white/20 bg-[#1a3553]/85 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm">
                    {activeIndex + 1} / {images.length} photos
                  </div>
                ) : null}
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

            <div className="mt-3 border-b border-slate-200 bg-white py-3">
              {property.area_marlas != null ? (
                <div className="flex items-center gap-3 px-1 sm:px-2">
                  <IconRuler className="text-[#1a3553]" size="h-4 w-4" />
                  <div>
                    <p className="text-[16px] font-semibold text-[#1a3553]">{property.area_marlas}</p>
                    <p className="text-[11px] text-slate-500">Marla</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-3 w-full max-w-full overflow-x-auto overscroll-x-contain">
              <div className="flex w-max min-w-max max-w-none items-center gap-1 bg-[#111111] p-1 text-white" style={{width: "100%", borderRadius: "5px", background: "gray"}}>
                {detailTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`shrink-0 rounded-full px-4 py-2.5 text-[12px] font-medium transition sm:px-5 sm:py-3 sm:text-[13px] ${
                      activeTab === tab.id ? 'bg-white text-[#1a3553] shadow-sm' : 'hover:bg-white/8'
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
                <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5">
                  {/* <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Price</p> */}
                  <p className="mt-2 break-words text-[1.45rem] font-medium tabular-nums tracking-[-0.02em] text-slate-800 sm:text-[1.65rem] md:text-[1.85rem]">
                    {formatPkr(property.price)}
                  </p>

                  <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row">
                    <a
                      href={whatsappHref(property.title, primaryContactPhone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-2 rounded-md border border-[#31C950]/30 bg-white px-4 py-3 text-[14px] font-semibold text-[#31C950] transition hover:bg-[#31C950]/8"
                    >
                      WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowCallModal(true)}
                      className="inline-flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-2 rounded-md bg-[#31C950] px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-[#28b048]"
                    >
                      <IconPhone />
                      Call
                    </button>
                  </div>
                </div>

                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Customer inquiry</p>
                  <form onSubmit={handleInquirySubmit} className="mt-4 min-w-0 space-y-3">
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
                        className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400"
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
                        className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400"
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
                        className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <textarea
                      rows={4}
                      value={inquiryForm.message}
                      onChange={handleInquiryChange('message')}
                      placeholder={`I would like to inquire about ${property.title}`}
                      className="w-full resize-y rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[#31C950]/55 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#31C950]/30 bg-[#31C950] px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#28b048]"
                    >
                      <IconMail size="h-4 w-4" />
                      Send Email
                    </button>
                  </form>

                  <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    {inquiryStatus === 'sent' ? (
                      <p className="mt-3 text-[12px] text-[#31C950]">Your email app has been opened for this inquiry.</p>
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
                <h2 className="text-xl font-semibold tracking-tight text-[#1a3553] md:text-2xl">Overview</h2>
              </section> */}

              <div className="mt-4" id="overview">
                <h3 className="text-[1.35rem] font-semibold tracking-tight text-[#1a3553]">Details</h3>
                <div className="mt-4 grid gap-x-6 gap-y-3 md:grid-cols-2">
                  {propertyFacts.map((item) => (
                    <div
                      key={item.key}
                      className="grid grid-cols-1 gap-1 bg-slate-50/70 px-4 py-3 sm:grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] sm:items-center sm:gap-x-4 md:grid-cols-[10rem_minmax(0,1fr)]"
                    >
                      <span className="text-[13px] font-medium text-slate-700 sm:text-[15px] sm:font-normal">{item.label}</span>
                      <span className="min-w-0 break-words text-[15px] font-medium text-[#1a3553] md:truncate">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {property.short_description ? (
                <div id="summary" className="mt-6 scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold leading-snug text-[#1a3553] md:text-xl">{property.short_description}</h2>
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

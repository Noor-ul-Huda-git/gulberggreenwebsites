import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import {
  IconBath,
  IconBed,
  IconBuilding,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconMail,
  IconPhone,
  IconPin,
  IconRuler,
} from '../components/properties/PropertyIcons.jsx'
import { contactInfo } from '../data/siteContent.js'
import { fetchProperty } from '../lib/api.js'

/** Primary heading / strip — matches site nav emphasis */
const BRAND_NAVY = '#1a3553'

function formatPkr(value) {
  if (value == null || value === '') return 'Price on request'
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `PKR ${n.toLocaleString('en-PK')}`
  }
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

/** Renders CKEditor HTML or legacy plain text (admin may still have old content). */
function PropertyDescriptionBody({ html }) {
  const raw = html?.trim() ?? ''
  if (!raw) return null

  if (/<[a-z][\s\S]*>/i.test(raw)) {
    return (
      <div
        className="property-description-body max-w-none text-[15px] leading-[1.75] text-slate-700 [&_a]:font-medium [&_a]:text-[#1a3553] [&_a]:underline [&_a]:decoration-[#31C950]/40 [&_a]:underline-offset-[3px] [&_a]:transition hover:[&_a]:text-[#31C950] hover:[&_a]:decoration-[#31C950] [&_strong]:font-semibold [&_em]:italic [&_h2]:mt-8 [&_h2]:font-semibold [&_h2]:text-[#1a3553] [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-[#1a3553] [&_h4]:mt-4 [&_h4]:font-semibold [&_h4]:text-slate-800 [&_p+p]:mt-4 [&_p]:leading-[1.75] [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#31C950]/45 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_hr]:my-8 [&_hr]:border-slate-200"
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
  const { slug } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setActiveIndex(0)
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

  const goPrev = useCallback(() => {
    if (images.length < 2) return
    setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    if (images.length < 2) return
    setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
  }, [images.length])

  if (loading) {
    return <DetailSkeleton />
  }

  if (error === 'error') {
    return (
      <div className="min-h-[50vh] bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_100%)] px-4 py-24 text-center">
        <p className="text-lg font-semibold text-[#1a3553]">Something went wrong</p>
        <p className="mt-2 text-sm text-slate-600">Please try again shortly.</p>
        <Link
          to="/properties"
          className="mt-8 inline-flex rounded-lg bg-[#31C950] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_-8px_rgba(49,201,80,0.55)] transition hover:bg-[#28b048]"
        >
          Back to properties
        </Link>
      </div>
    )
  }

  if (error === 'notfound' || !property) {
    return (
      <div className="min-h-[50vh] bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_100%)] px-4 py-24 text-center">
        <p className="text-lg font-semibold text-[#1a3553]">Listing not found</p>
        <p className="mt-2 text-sm text-slate-600">It may have been removed or unpublished.</p>
        <Link
          to="/properties"
          className="mt-8 inline-flex rounded-lg bg-[#31C950] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_-8px_rgba(49,201,80,0.55)] transition hover:bg-[#28b048]"
        >
          Back to properties
        </Link>
      </div>
    )
  }

  const activeUrl = images[activeIndex] ?? null
  const addressLine = property.location || (property.block ? `Block ${property.block} · Gulberg Greens, Islamabad` : 'Gulberg Greens, Islamabad')

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%)] font-[Poppins,Manrope,system-ui,sans-serif] text-slate-900">
      <div
        className="flex h-9 items-center justify-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white/95"
        style={{ backgroundColor: BRAND_NAVY }}
      >
        Gulberg Greens · Islamabad
      </div>

      <div className="border-b border-slate-200/80 bg-white">
        <div className="container-shell max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <nav className="text-[12px] text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="transition hover:text-[#31C950]">
                  Home
                </Link>
              </li>
              <li className="text-slate-300">/</li>
              <li>
                <Link to="/properties" className="transition hover:text-[#31C950]">
                  Properties
                </Link>
              </li>
              <li className="text-slate-300">/</li>
              <li className="line-clamp-1 max-w-[min(100%,280px)] font-medium text-[#1a3553]">{property.title}</li>
            </ol>
          </nav>

          <div className="mt-7 flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0 flex-1">
              {property.is_featured ? (
                <span className="inline-block rounded-md bg-[#31C950] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_4px_14px_rgba(49,201,80,0.35)]">
                  Featured listing
                </span>
              ) : null}
              <h1 className="mt-3 max-w-4xl text-[1.65rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1a3553] md:text-[2rem] lg:text-[2.25rem]">
                {property.title}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-[15px] text-slate-600">
                <IconPin className="text-[#31C950]" size="h-4 w-4" aria-hidden />
                {addressLine}
              </p>
            </div>
            <Link
              to="/contact-us"
              className="shrink-0 rounded-lg border-2 border-[#31C950]/35 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a3553] shadow-sm transition hover:border-[#31C950] hover:bg-[#31C950]/[0.08]"
            >
              Contact office
            </Link>
          </div>
        </div>
      </div>

      {/* Hero gallery */}
      <div className="border-b border-slate-200/80 bg-[linear-gradient(180deg,#f4f7f9_0%,#fafbfc_100%)]">
        <div className="container-shell max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="relative overflow-hidden rounded-xl bg-slate-200 shadow-[0_4px_24px_-4px_rgba(26,53,83,0.12)] ring-1 ring-slate-200/60">
            <div className="relative aspect-[21/9] min-h-[220px] w-full max-h-[min(56vh,560px)] sm:min-h-[280px]">
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
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/95 text-[#1a3553] shadow-lg backdrop-blur-sm transition hover:border-[#31C950]/40 hover:text-[#31C950]"
                    aria-label="Previous photo"
                  >
                    <IconChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/95 text-[#1a3553] shadow-lg backdrop-blur-sm transition hover:border-[#31C950]/40 hover:text-[#31C950]"
                    aria-label="Next photo"
                  >
                    <IconChevronRight />
                  </button>
                </>
              ) : null}

              {images.length ? (
                <div className="absolute bottom-4 left-4 rounded-lg border border-white/20 bg-[#1a3553]/85 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm">
                  {activeIndex + 1} / {images.length} photos
                </div>
              ) : null}
            </div>
          </div>

          {images.length > 1 ? (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {images.map((url, idx) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-28 ${
                    idx === activeIndex
                      ? 'border-[#31C950] shadow-[0_0_0_1px_rgba(49,201,80,0.4)] ring-2 ring-[#31C950]/25'
                      : 'border-transparent opacity-80 ring-1 ring-slate-200/80 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="container-shell max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Main column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <Motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#31C950]">Asking price</p>
              <p className="mt-2 text-[2rem] font-semibold tracking-tight text-[#1a3553] md:text-[2.35rem]">{formatPkr(property.price)}</p>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 border-b border-slate-200/90 pb-8 text-[15px] text-slate-700 sm:gap-x-8">
                <span className="inline-flex min-w-0 max-w-full items-center gap-2.5">
                  <IconBuilding className="text-[#31C950]" />
                  <span className="min-w-0">{property.listing_type_display || 'Property'}</span>
                </span>
                {property.bedrooms != null ? (
                  <span className="inline-flex min-w-0 max-w-full items-center gap-2.5">
                    <IconBed className="text-[#31C950]" />
                    <span className="min-w-0">
                      {property.bedrooms} bed{property.bedrooms === 1 ? '' : 's'}
                    </span>
                  </span>
                ) : null}
                {property.baths != null ? (
                  <span className="inline-flex min-w-0 max-w-full items-center gap-2.5">
                    <IconBath className="text-[#31C950]" />
                    <span className="min-w-0">
                      {property.baths} bath{property.baths === 1 ? '' : 's'}
                    </span>
                  </span>
                ) : null}
                {property.area_marlas != null ? (
                  <span className="inline-flex min-w-0 max-w-full items-center gap-2.5">
                    <IconRuler className="text-[#31C950]" />
                    <span className="min-w-0">
                      {property.area_marlas} marla{property.area_marlas === 1 ? '' : 's'}
                    </span>
                  </span>
                ) : null}
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6">
                {[
                  { label: 'Listing type', value: property.listing_type_display || property.listing_type, icon: IconBuilding },
                  { label: 'Block', value: property.block || '—', icon: IconPin },
                  { label: 'Area', value: property.area_marlas != null ? `${property.area_marlas} marlas` : '—', icon: IconRuler },
                  { label: 'Bedrooms', value: property.bedrooms != null ? String(property.bedrooms) : '—', icon: IconBed },
                  { label: 'Baths', value: property.baths != null ? String(property.baths) : '—', icon: IconBath },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="flex gap-3 rounded-xl border border-slate-200/90 bg-white/80 px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                  >
                    <span className="mt-0.5 text-[#31C950]">
                      {createElement(icon, { className: 'text-[#31C950]', size: 'h-5 w-5' })}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1 text-[15px] font-semibold text-[#1a3553]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {property.short_description ? (
                <h2 className="mt-12 text-lg font-semibold leading-snug text-[#1a3553] md:text-xl">{property.short_description}</h2>
              ) : null}

              {property.description ? (
                <div className="mt-10">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#31C950]/35 to-transparent" aria-hidden />
                    <h3 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#31C950]">Overview</h3>
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#31C950]/35 to-transparent" aria-hidden />
                  </div>
                  <div className="mt-6 rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8">
                    <PropertyDescriptionBody html={property.description} />
                  </div>
                </div>
              ) : null}

              <div className="mt-12 rounded-xl border border-[#31C950]/20 bg-[#31C950]/[0.06] p-6 md:p-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a3553]">Why this listing</h3>
                <ul className="mt-4 list-none space-y-3 text-[15px] leading-relaxed text-slate-700">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#31C950]" aria-hidden />
                    <span>Official listing published by Gulberg Greens sales &amp; marketing.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#31C950]" aria-hidden />
                    <span>Verified details — confirm possession, transfer, and dimensions with our team before you transact.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#31C950]" aria-hidden />
                    <span>Need a site visit? Use Contact office to coordinate with the sales desk.</span>
                  </li>
                </ul>
              </div>
            </Motion.div>
          </div>

          {/* Sidebar — sticky contact card */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_16px_48px_-24px_rgba(26,53,83,0.45)] ring-1 ring-slate-200/40"
              >
                <div
                  className="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white"
                  style={{ backgroundColor: BRAND_NAVY }}
                >
                  Gulberg Greens
                </div>
                <div className="flex items-start gap-3 border-b border-slate-100 bg-[linear-gradient(90deg,rgba(49,201,80,0.08)_0%,transparent_100%)] px-5 py-4">
                  <IconCalendar className="mt-0.5 text-[#31C950]" size="h-5 w-5" aria-hidden />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Sales office hours</p>
                    <p className="mt-1 text-[14px] leading-snug text-[#1a3553]">{contactInfo.hours}</p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#31C950]/35 bg-[#31C950]/10 text-[14px] font-bold tracking-wide text-[#1a3553]">
                    GG
                  </div>
                  <p className="mt-5 text-lg font-semibold text-[#1a3553]">Sales &amp; marketing</p>
                  <p className="mt-1 text-[13px] text-slate-600">Gulberg Greens Islamabad</p>

                  <div className="mt-8 space-y-3">
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1a3553]/25 bg-white py-3 text-[14px] font-semibold text-[#1a3553] shadow-sm transition hover:border-[#1a3553] hover:bg-[#1a3553] hover:text-white"
                    >
                      <IconPhone />
                      Call
                    </a>
                    <a
                      href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(`Inquiry: ${property.title}`)}`}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#31C950] py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(49,201,80,0.55)] transition hover:bg-[#28b048]"
                    >
                      <IconMail />
                      Email
                    </a>
                  </div>

                  <Link
                    to="/contact-us"
                    className="mt-4 block text-center text-[13px] font-medium text-[#1a3553] underline decoration-[#31C950]/35 underline-offset-4 transition hover:text-[#31C950]"
                  >
                    Full contact form
                  </Link>
                </div>
              </Motion.div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail

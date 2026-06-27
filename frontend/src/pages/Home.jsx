import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LogoMarquee from '../components/home/LogoMarquee.jsx'
import HomePageSchema from '../components/seo/HomePageSchema.jsx'
import { IconWhatsAppBrand } from '../components/properties/PropertyIcons.jsx'
import {
  HOME_APPROVALS,
  HOME_BLOCKS,
  HOME_DEVELOPMENT,
  HOME_FAQ_SECTION,
  HOME_FOOTER_BLURB,
  HOME_HERO,
  HOME_INVESTMENT,
  HOME_LAKE,
  HOME_LISTINGS,
  HOME_LIFESTYLE,
  HOME_LOCATION,
  HOME_PLATFORM_HUB,
  HOME_TRUST_FEATURES,
} from '../data/homePageContent.js'
import { propertyDetailPath } from '../data/propertyListingTypes.js'
import { STATIC_PAGE_SEO } from '../data/staticPageSeo.js'
import { contactInfo, homeFaqItems, mapEmbedUrl } from '../data/siteContent.js'
import { fetchProperties } from '../lib/api.js'
import { usePageSeo } from '../lib/usePageSeo.js'
import brandAlliedBank from '../assets/Brands/allied-bank-limited-logo.png'
import brandBankAlfalah from '../assets/Brands/bank-alfalah-logo.png'
import brandMcb from '../assets/Brands/mcb-logo.png'
import brandBankOfPunjab from '../assets/Brands/Bank-of-punjab-Logo.png'
import brandSoneriBank from '../assets/Brands/Soneri-Bank-Logo-Vector.png'
import brandStandardChartered from '../assets/Brands/Standard-Chartered_logo-for-website.png'
import brandRoots from '../assets/Brands/ROOTS-WHITE-LOGO-01.png'
import brandFroebels from '../assets/Brands/Irrx6mJi.jpg'
import brandBeaconhouse from '../assets/Brands/beaconhouse-logo.png'
import brandRiphah from '../assets/Brands/RIU-logo.png'
import brandFutureWorld from '../assets/Brands/png.png'
import brandToniGuy from '../assets/Brands/Toni_and_Guy_logo.png'
import brandDepilex from '../assets/Brands/images.png'
import brandBurgerLab from '../assets/Brands/images (1).png'
import brandNayatel from '../assets/Brands/NAYATEL-logo-vector.png'
import brandTransworld from '../assets/Brands/Transworld-home-logo.png'
import brandPtcl from '../assets/Brands/pakistan-ptcl-telecommunication-broadband-telephone-ptcl-logo.jpg'
import regAuthCopyUntitled1 from '../assets/Authorities/Copy-of-Untitled-1-150x150-1.webp'
import regAuth5 from '../assets/Authorities/5-150x150-1.webp'
import regAuth3 from '../assets/Authorities/3-150x150-1.webp'
import regAuth2 from '../assets/Authorities/2-150x150-1.webp'
import regAuth4 from '../assets/Authorities/4-150x150-1.webp'
import regAuth1 from '../assets/Authorities/1-150x150-1.webp'
import regAuthCopyUntitled3 from '../assets/Authorities/Copy-of-Untitled-3-150x150-1.webp'
import regAuthCopyUntitled2 from '../assets/Authorities/Copy-of-Untitled-2-150x150-1.webp'

const DEFAULT_WA_MESSAGE =
  'Assalam o Alaikum, I would like more information about Gulberg Greens Islamabad.'

function whatsAppContactHref(message = DEFAULT_WA_MESSAGE) {
  let d = String(contactInfo.phone || '').replace(/\D/g, '')
  if (d.startsWith('0')) d = d.slice(1)
  if (!d.startsWith('92') && d.length === 10) d = `92${d}`
  return `https://wa.me/${d}?text=${encodeURIComponent(message)}`
}

const registrationLogos = [
  { src: regAuthCopyUntitled1, alt: 'Authority registration' },
  { src: regAuth5, alt: 'Authority registration' },
  { src: regAuth3, alt: 'Authority registration' },
  { src: regAuth2, alt: 'CDA Islamabad' },
  { src: regAuth4, alt: 'Authority registration' },
  { src: regAuth1, alt: 'Authority registration' },
  { src: regAuthCopyUntitled3, alt: 'Authority registration' },
  { src: regAuthCopyUntitled2, alt: 'Authority registration' },
]

const topBrandsLogos = [
  { alt: 'Allied Bank', src: brandAlliedBank },
  { alt: 'Bank Alfalah', src: brandBankAlfalah },
  { alt: 'MCB Bank', src: brandMcb },
  { alt: 'The Bank of Punjab', src: brandBankOfPunjab },
  { alt: 'Soneri Bank', src: brandSoneriBank },
  { alt: 'Standard Chartered', src: brandStandardChartered },
  { alt: 'Roots International Schools & Colleges', src: brandRoots },
  { alt: "Froebel's International School", src: brandFroebels },
  { alt: 'Beaconhouse School System', src: brandBeaconhouse },
  { alt: 'Riphah International University', src: brandRiphah },
  { alt: 'Future World Schools & Colleges', src: brandFutureWorld },
  { alt: 'Toni & Guy', src: brandToniGuy },
  { alt: 'Depilex', src: brandDepilex },
  { alt: 'Burger Lab', src: brandBurgerLab },
  { alt: 'Nayatel', src: brandNayatel },
  { alt: 'Transworld', src: brandTransworld },
  { alt: 'PTCL', src: brandPtcl },
]

const TRUST_CARD_ACCENTS = {
  shield: { surface: 'bg-white ring-1 ring-slate-200/80 shadow-[0_14px_44px_-18px_rgba(15,23,42,0.14)]', iconBg: 'bg-amber-500/16', icon: 'text-amber-700' },
  connectivity: { surface: 'bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-200/85', iconBg: 'bg-slate-500/14', icon: 'text-slate-700' },
  quality: { surface: 'bg-gradient-to-br from-sky-50/95 via-white to-white ring-1 ring-sky-100/75', iconBg: 'bg-sky-500/16', icon: 'text-sky-600' },
  leaf: { surface: 'bg-gradient-to-br from-teal-50/90 via-white to-white ring-1 ring-teal-100/75', iconBg: 'bg-teal-500/16', icon: 'text-teal-700' },
}

const AMENITY_CAROUSEL_GAP_PX = 32

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

function parsePropertyListResponse(data) {
  return Array.isArray(data) ? data : data.results ?? []
}

function homeFeaturedImageUrl(p) {
  if (p.featured_image_url) return p.featured_image_url
  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0].url) return p.images[0].url
  return null
}

function SeoImage({ image, priority = false, className = '' }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      title={image.title}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  )
}

function SectionCtaLink({ to, label }) {
  return (
    <Link
      to={to}
      className="group/cta relative inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#31C950] transition-colors hover:text-[#28b048]"
    >
      <span className="relative">
        {label}
        <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#31C950] transition-transform duration-300 ease-out group-hover/cta:scale-x-100" />
      </span>
      <svg className="h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-1" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}

function SplitImageSection({ image, imageFirst = false, children, className = '' }) {
  return (
    <article className={`group/card overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-black/[0.03] md:rounded-3xl ${className}`}>
      <div className="grid gap-0 md:grid-cols-2 md:items-stretch">
        <div className={`flex flex-col justify-center p-8 md:p-10 lg:p-12 ${imageFirst ? 'md:order-2' : ''}`}>{children}</div>
        <div className={`relative min-h-[240px] overflow-hidden bg-slate-100 md:min-h-[360px] ${imageFirst ? 'md:order-1' : ''}`}>
          <SeoImage image={image} className="h-full w-full object-cover" />
        </div>
      </div>
    </article>
  )
}

function CategoryIcon({ name, iconClassName = 'text-[#31C950]' }) {
  const common = `h-6 w-6 ${iconClassName}`
  if (name === 'quality') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3l2.2 4.5L19 8.5l-3.5 3.4.8 4.9L12 15.8 7.7 16.8l.8-4.9L5 8.5l4.8-1L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3l8 3v6.5c0 5.5-3.4 10.4-8 11.5-4.6-1.1-8-6-8-11.5V6l8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    )
  }
  if (name === 'connectivity') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 21c4.2-3.4 7-7.8 7-12a7 7 0 10-14 0c0 4.2 2.8 8.6 7 12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 20c8-1 12-7 12-16-6 2-10 6-12 12a8 8 0 0012 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function CarouselChevron({ direction, className }) {
  const isLeft = direction === 'left'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={isLeft ? 'M14.5 6.5L9 12l5.5 5.5' : 'M9.5 6.5L15 12l-5.5 5.5'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FaqToggleIcon({ open, className = '' }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[#1a3553] transition-[border-color,background-color,color] duration-200 ${
        open ? 'border-[#31C950]/50 bg-[#31C950]/12 text-[#1a9e38]' : 'border-slate-200/90 bg-slate-50/90'
      } ${className}`.trim()}
      aria-hidden
    >
      {open ? (
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 8h12" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2v12M2 8h12" strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}

function Home() {
  usePageSeo(STATIC_PAGE_SEO.home)
  const location = useLocation()

  const trustCarouselRef = useRef(null)
  const [faqOpenIndex, setFaqOpenIndex] = useState(null)
  const [trustSlide, setTrustSlide] = useState(0)
  const [trustItemsVisible, setTrustItemsVisible] = useState(4)
  const [trustTx, setTrustTx] = useState(0)
  const [trustCardWidth, setTrustCardWidth] = useState(0)
  const [homeFeaturedListings, setHomeFeaturedListings] = useState([])
  const [showDeferredSections, setShowDeferredSections] = useState(false)

  const trustCards = HOME_TRUST_FEATURES.items
  const trustMaxSlide = Math.max(0, trustCards.length - trustItemsVisible)
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetchProperties({ page: '1' })
        if (cancelled) return
        let list = parsePropertyListResponse(res)
        list = [...list].sort((a, b) => {
          if (Boolean(b.is_featured) !== Boolean(a.is_featured)) return Number(b.is_featured) - Number(a.is_featured)
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        })
        setHomeFeaturedListings(list.slice(0, 5))
      } catch {
        if (!cancelled) setHomeFeaturedListings([])
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const mq = () => {
      const w = window.innerWidth
      const next = w >= 1024 ? 4 : w >= 640 ? 2 : 1
      setTrustItemsVisible(next)
      const max = Math.max(0, trustCards.length - next)
      setTrustSlide((s) => Math.min(s, max))
    }
    mq()
    window.addEventListener('resize', mq)
    return () => window.removeEventListener('resize', mq)
  }, [trustCards.length])

  useLayoutEffect(() => {
    const vp = trustCarouselRef.current
    if (!vp) return undefined
    const gap = AMENITY_CAROUSEL_GAP_PX
    const measure = () => {
      const vw = vp.clientWidth
      if (vw <= 0) return
      const n = trustItemsVisible
      const cardW = (vw - gap * Math.max(0, n - 1)) / n
      setTrustCardWidth(cardW)
      setTrustTx(trustSlide * (cardW + gap))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [trustItemsVisible, trustSlide])

  useEffect(() => {
    if (location.hash === '#home-faq-heading') {
      setShowDeferredSections(true)
    }
  }, [location.hash])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    let cancelled = false
    const reveal = () => {
      if (!cancelled) setShowDeferredSections(true)
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(reveal, { timeout: 1200 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }
    const timer = window.setTimeout(reveal, 300)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
      <HomePageSchema />

      {/* SECTION 1 — HERO */}
      <section className="relative flex min-h-[min(92vh,920px)] flex-col overflow-hidden">
        <SeoImage
          image={HOME_HERO.image}
          priority
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/45" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(100%,42rem)] bg-gradient-to-r from-slate-950/60 via-slate-950/30 to-transparent" aria-hidden />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-20 sm:px-6 md:py-24">
          <div className="container-shell w-full text-left">
            <div className="max-w-3xl">
              <h1 className="font-[Poppins,Manrope,system-ui,sans-serif] text-[1.85rem] font-bold leading-[1.15] tracking-[-0.035em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)] md:text-[2.35rem] lg:text-[2.85rem]">
                {HOME_HERO.h1}
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-[1.75] text-white/92 [text-shadow:0_1px_16px_rgba(0,0,0,0.4)] md:mt-6 md:text-[17px]">
                {HOME_HERO.body}
              </p>
              <div className="mt-8">
                <a
                  href={whatsAppContactHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2 rounded-full border-2 border-white/95 bg-white/[0.08] px-8 py-3.5 text-sm font-semibold !text-white shadow-lg backdrop-blur-md transition hover:border-[#31C950] hover:bg-[#31C950]"
                  aria-label="Chat on WhatsApp about Gulberg Greens"
                >
                  <IconWhatsAppBrand className="shrink-0 text-white" size="h-5 w-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TRUST FEATURE CARDS */}
      <section className="relative z-10 -mt-10 pb-8 pt-5 md:-mt-12 md:pb-10" aria-labelledby="trust-features-heading">
        <div className="container-shell">
          <h2 id="trust-features-heading" className="mt-10 mb-8 text-center text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl">
            {HOME_TRUST_FEATURES.h2}
          </h2>
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <button
              type="button"
              onClick={() => setTrustSlide((s) => Math.max(0, s - 1))}
              disabled={trustSlide <= 0}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-sm disabled:opacity-35"
              aria-label="Previous trust features"
            >
              <CarouselChevron direction="left" className="h-5 w-5" />
            </button>
            <div ref={trustCarouselRef} className="min-w-0 flex-1 overflow-hidden">
              <div
                className={prefersReducedMotion ? 'flex' : 'flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'}
                style={{ gap: `${AMENITY_CAROUSEL_GAP_PX}px`, transform: `translate3d(-${trustTx}px, 0, 0)` }}
              >
                {trustCards.map((card) => {
                  const palette = TRUST_CARD_ACCENTS[card.icon] || TRUST_CARD_ACCENTS.shield
                  return (
                    <article key={card.id} className="shrink-0" style={{ width: trustCardWidth > 0 ? `${trustCardWidth}px` : undefined }}>
                      <div className={`min-h-[260px] rounded-2xl p-6 ${palette.surface}`}>
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${palette.iconBg}`}>
                          <CategoryIcon name={card.icon} iconClassName={palette.icon} />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-[#1a2332]">{card.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.body}</p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTrustSlide((s) => Math.min(trustMaxSlide, s + 1))}
              disabled={trustSlide >= trustMaxSlide}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-sm disabled:opacity-35"
              aria-label="Next trust features"
            >
              <CarouselChevron direction="right" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — OFFICIAL PLATFORM */}
      <section className="border-t border-slate-100 bg-[#fafbfc] py-14 md:py-20" aria-labelledby="platform-heading">
        <div className="container-shell">
          <SplitImageSection image={HOME_PLATFORM_HUB.image} imageFirst>
            <h2 id="platform-heading" className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl">
              {HOME_PLATFORM_HUB.h2}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.8] text-slate-600 md:text-base">{HOME_PLATFORM_HUB.body}</p>
            <nav className="mt-8 flex flex-wrap gap-2" aria-label="Property categories">
              {HOME_PLATFORM_HUB.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-full border border-[#31C950]/35 bg-[#31C950]/10 px-4 py-2 text-sm font-semibold text-[#1a3553] transition hover:bg-[#31C950] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SplitImageSection>
        </div>
      </section>

      {/* SECTION 4 — LATEST LISTINGS */}
      {homeFeaturedListings.length > 0 ? (
        <section className="border-t border-slate-100 bg-white py-12 md:py-16" aria-labelledby="home-listings-heading">
          <div className="container-shell">
            <h2 id="home-listings-heading" className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl">
              {HOME_LISTINGS.h2}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">{HOME_LISTINGS.body}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
              {homeFeaturedListings.map((p) => {
                const img = homeFeaturedImageUrl(p)
                return (
                  <Link
                    key={p.id}
                    to={propertyDetailPath(p)}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition hover:border-[#31C950]/35 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      {img ? (
                        <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">No photo</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <p className="text-[13px] font-semibold text-[#1a3553]">{formatCompactPkr(p.price)}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-700 sm:text-[13px]">{p.title}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-8">
              <SectionCtaLink to={HOME_LISTINGS.cta.to} label={HOME_LISTINGS.cta.label} />
            </div>
          </div>
        </section>
      ) : null}

      {/* SECTION 5 — LAKE */}
      <section className="relative isolate min-h-[min(72vh,780px)] overflow-hidden" aria-labelledby="lake-heading">
        <div className="absolute inset-0">
          <SeoImage image={HOME_LAKE.image} className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/50 to-emerald-950/35" aria-hidden />
        </div>
        <div className="container-shell relative flex min-h-[min(72vh,780px)] flex-col justify-center py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 id="lake-heading" className="text-3xl font-bold leading-tight tracking-[-0.03em] text-white md:text-4xl lg:text-5xl">
              {HOME_LAKE.h2}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-[1.75] text-white/90 md:text-lg">{HOME_LAKE.body}</p>
          </div>
        </div>
      </section>

      {showDeferredSections ? (
        <>
          {/* SECTION 6 — DEVELOPMENT STATUS */}
          <section className="border-t border-slate-100 bg-white py-14 md:py-20" aria-labelledby="development-heading">
            <div className="container-shell space-y-10">
              <SplitImageSection image={HOME_DEVELOPMENT.image}>
                <h2 id="development-heading" className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl">
                  {HOME_DEVELOPMENT.h2}
                </h2>
                <h3 className="mt-6 text-lg font-semibold text-[#1a3553]">{HOME_DEVELOPMENT.current.h3}</h3>
                <p className="mt-2 text-[15px] leading-[1.8] text-slate-600">{HOME_DEVELOPMENT.current.body}</p>
                <h3 className="mt-6 text-lg font-semibold text-[#1a3553]">{HOME_DEVELOPMENT.upcoming.h3}</h3>
                <p className="mt-2 text-[15px] leading-[1.8] text-slate-600">{HOME_DEVELOPMENT.upcoming.body}</p>
                <div className="mt-8">
                  <SectionCtaLink to={HOME_DEVELOPMENT.cta.to} label={HOME_DEVELOPMENT.cta.label} />
                </div>
              </SplitImageSection>
            </div>
          </section>

          {/* SECTION 7 — BLOCKS */}
          <section className="border-t border-slate-100 bg-[#fafbfc] py-14 md:py-20" aria-labelledby="blocks-heading">
            <div className="container-shell">
              <h2 id="blocks-heading" className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl">
                {HOME_BLOCKS.h2}
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-[1.8] text-slate-600 md:text-base">{HOME_BLOCKS.intro}</p>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-[#1a3553]">{HOME_BLOCKS.residential.h3}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{HOME_BLOCKS.residential.body}</p>
                  <nav className="mt-5 flex flex-wrap gap-2" aria-label="Residential plot blocks">
                    {HOME_BLOCKS.residential.links.map((link) => (
                      <Link key={link.to} to={link.to} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#1a3553] hover:border-[#31C950] hover:text-[#31C950]">
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-[#1a3553]">{HOME_BLOCKS.farmhouse.h3}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{HOME_BLOCKS.farmhouse.body}</p>
                  <nav className="mt-5 flex flex-wrap gap-2" aria-label="Farmhouse blocks">
                    {HOME_BLOCKS.farmhouse.links.map((link) => (
                      <Link key={link.to} to={link.to} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#1a3553] hover:border-[#31C950] hover:text-[#31C950]">
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8 — INVESTMENT */}
          <section className="border-t border-slate-100 bg-white py-14 md:py-20" aria-labelledby="investment-heading">
            <div className="container-shell">
              <SplitImageSection image={HOME_INVESTMENT.image} imageFirst>
                <h2 id="investment-heading" className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl">
                  {HOME_INVESTMENT.h2}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.8] text-slate-600 md:text-base">{HOME_INVESTMENT.body}</p>
                <h3 className="mt-6 text-lg font-semibold text-[#1a3553]">{HOME_INVESTMENT.installment.h3}</h3>
                <p className="mt-2 text-[15px] leading-[1.8] text-slate-600">{HOME_INVESTMENT.installment.body}</p>
                <div className="mt-8">
                  <SectionCtaLink to={HOME_INVESTMENT.cta.to} label={HOME_INVESTMENT.cta.label} />
                </div>
              </SplitImageSection>
            </div>
          </section>

          {/* SECTION 9 — LIFESTYLE */}
          <section className="border-t border-slate-100 bg-white py-12 md:py-16" aria-labelledby="lifestyle-heading">
            <div className="container-shell mb-8 md:mb-10">
              <h2 id="lifestyle-heading" className="mx-auto max-w-4xl text-center text-xl font-bold text-[#1a3553] md:text-2xl">
                {HOME_LIFESTYLE.h2}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-center text-[15px] leading-relaxed text-slate-600">{HOME_LIFESTYLE.body}</p>
            </div>
            <LogoMarquee logos={topBrandsLogos} />
          </section>

          {/* SECTION 10 — APPROVALS */}
          <section className="border-t border-slate-100 bg-[#fafbfc] py-12 md:py-16" aria-labelledby="registrations-heading">
            <div className="container-shell mb-8 md:mb-10">
              <h2 id="registrations-heading" className="mx-auto max-w-4xl text-center text-xl font-bold text-[#1a3553] md:text-2xl">
                {HOME_APPROVALS.h2}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-center text-[15px] leading-relaxed text-slate-600">{HOME_APPROVALS.body}</p>
              <p className="mx-auto mt-6 max-w-4xl text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {HOME_APPROVALS.marqueeTitle}
              </p>
            </div>
            <LogoMarquee logos={registrationLogos} />
          </section>

          {/* SECTION 11 — FAQ */}
          <section
            id="home-faq-heading"
            className="scroll-mt-28 border-t border-slate-200 bg-white py-16 md:scroll-mt-32 md:py-24"
            aria-labelledby="faq-section-heading"
          >
            <div className="container-shell px-4 sm:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2 id="faq-section-heading" className="text-2xl font-bold tracking-[-0.03em] text-[#1a3553] md:text-3xl">
                  {HOME_FAQ_SECTION.h2}
                </h2>
              </div>
              <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-3 md:mt-14 md:grid-cols-2 md:gap-4">
                {homeFaqItems.map((item, index) => {
                  const open = faqOpenIndex === index
                  return (
                    <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                      <h3 className="m-0 text-base font-semibold">
                        <button
                          type="button"
                          id={`faq-trigger-${item.id}`}
                          aria-expanded={open}
                          aria-controls={`faq-panel-${item.id}`}
                          onClick={() => setFaqOpenIndex(open ? null : index)}
                          className="flex w-full items-start gap-4 px-5 py-4 text-left text-[#1a2332] md:px-6 md:py-5"
                        >
                          <FaqToggleIcon open={open} className="mt-0.5" />
                          <span className="min-w-0 flex-1">{item.question}</span>
                        </button>
                      </h3>
                      <div id={`faq-panel-${item.id}`} role="region" aria-labelledby={`faq-trigger-${item.id}`} hidden={!open} className={open ? 'border-t border-slate-100 bg-slate-50/40 px-5 pb-5 pt-1 md:px-6 md:pb-6' : ''}>
                        <div className="space-y-3 pl-[3.25rem] md:pl-[3.75rem]">
                          {item.paragraphs.map((para, pIdx) => (
                            <p key={pIdx} className="text-[14px] leading-[1.75] text-slate-600 md:text-[15px]">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* SECTION 12 — LOCATION */}
          <section className="border-t border-slate-100 bg-[#fafbfc] py-14 md:py-20" aria-labelledby="location-heading">
            <div className="container-shell">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div>
                  <h2 id="location-heading" className="text-2xl font-bold tracking-[-0.03em] text-[#1a3553] md:text-3xl">
                    {HOME_LOCATION.h2}
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-slate-600">{HOME_LOCATION.body}</p>
                  <h3 className="mt-8 text-lg font-semibold text-[#1a3553]">{HOME_LOCATION.visit.h3}</h3>
                  <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-slate-600">
                    {HOME_LOCATION.visit.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <SectionCtaLink to={HOME_LOCATION.cta.to} label={HOME_LOCATION.cta.label} />
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg ring-1 ring-black/[0.04]">
                  <iframe
                    title="Gulberg Greens Islamabad on Google Maps"
                    src={mapEmbedUrl}
                    className="aspect-[4/3] min-h-[280px] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 13 — FOOTER BLURB */}
          <section className="border-t border-slate-200 bg-white py-12 md:py-14" aria-labelledby="home-footer-blurb">
            <div className="container-shell max-w-3xl text-center">
              <h3 id="home-footer-blurb" className="text-lg font-semibold text-[#1a3553] md:text-xl">
                {HOME_FOOTER_BLURB.h3}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">{HOME_FOOTER_BLURB.body}</p>
            </div>
          </section>
        </>
      ) : (
        <div className="h-16 border-t border-slate-100 bg-white" aria-hidden />
      )}
    </div>
  )
}

export default Home

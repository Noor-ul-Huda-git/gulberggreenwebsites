
'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import LogoMarquee from './LogoMarquee.jsx'
import HomePageSchema from '../seo/HomePageSchema.jsx'
import {
  IconCamera,
  IconExpandArea,
  IconPhone,
  IconPin,
  IconShieldCheck,
  IconWhatsAppBrand,
} from '../properties/PropertyIcons.jsx'

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
} from '../../data/homePageContent.js'

import { propertyDetailPath } from '../../data/propertyListingTypes.js'

import { STATIC_PAGE_SEO } from '../../data/staticPageSeo.js'

import {
  contactInfo,
  homeFaqItems,
  mapEmbedUrl,
} from '../../data/siteContent.js'
import {  fetchProperties } from '../../lib/api.js'
import brandAlliedBank from '../../assets/Brands/allied-bank-limited-logo.png'
import brandBankAlfalah from '../../assets/Brands/bank-alfalah-logo.png'
import brandMcb from '../../assets/Brands/mcb-logo.png'
import brandBankOfPunjab from '../../assets/Brands/Bank-of-punjab-Logo.png'
import brandSoneriBank from '../../assets/Brands/Soneri-Bank-Logo-Vector.png'
import brandStandardChartered from '../../assets/Brands/Standard-Chartered_logo-for-website.png'
import brandRoots from '../../assets/Brands/ROOTS-WHITE-LOGO-01.png'
import brandFroebels from '../../assets/Brands/Irrx6mJi.jpg'
import brandBeaconhouse from '../../assets/Brands/beaconhouse-logo.png'
import brandRiphah from '../../assets/Brands/RIU-logo.png'
import brandFutureWorld from '../../assets/Brands/png.png'
import brandToniGuy from '../../assets/Brands/Toni_and_Guy_logo.png'
import brandDepilex from '../../assets/Brands/images.png'
import brandBurgerLab from '../../assets/Brands/images (1).png'
import brandNayatel from '../../assets/Brands/NAYATEL-logo-vector.png'
import brandTransworld from '../../assets/Brands/Transworld-home-logo.png'
import brandPtcl from '../../assets/Brands/pakistan-ptcl-telecommunication-broadband-telephone-ptcl-logo.jpg'
import regAuthCopyUntitled1 from '../../assets/Authorities/Copy-of-Untitled-1-150x150-1.webp'
import regAuth5 from '../../assets/Authorities/5-150x150-1.webp'
import regAuth3 from '../../assets/Authorities/3-150x150-1.webp'
import regAuth2 from '../../assets/Authorities/2-150x150-1.webp'
import regAuth4 from '../../assets/Authorities/4-150x150-1.webp'
import regAuth1 from '../../assets/Authorities/1-150x150-1.webp'
import regAuthCopyUntitled3 from '../../assets/Authorities/Copy-of-Untitled-3-150x150-1.webp'
import regAuthCopyUntitled2 from '../../assets/Authorities/Copy-of-Untitled-2-150x150-1.webp'

const YOUTUBE_CHANNEL_ID = 'UCyHnLIXIJyBPCoU4jZpXcew'

const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`

const YOUTUBE_RSS_PROXY_URL =
  'https://api.rss2json.com/v1/api.json?rss_url='

const DEFAULT_WA_MESSAGE =
  'Assalam o Alaikum, I would like more information about Gulberg Greens Islamabad.'

function whatsAppContactHref(message = DEFAULT_WA_MESSAGE) {
  let d = String(contactInfo.phone || '').replace(/\D/g, '')

  if (d.startsWith('0')) d = d.slice(1)
  if (!d.startsWith('92') && d.length === 10) d = `92${d}`

  return `https://wa.me/${d}?text=${encodeURIComponent(message)}`
}

const registrationLogos = [
  { src: regAuthCopyUntitled1.src, alt: 'Authority registration' },
  { src: regAuth5.src, alt: 'Authority registration' },
  { src: regAuth3.src, alt: 'Authority registration' },
  { src: regAuth2.src, alt: 'CDA Islamabad' },
  { src: regAuth4.src, alt: 'Authority registration' },
  { src: regAuth1.src, alt: 'Authority registration' },
  { src: regAuthCopyUntitled3.src, alt: 'Authority registration' },
  { src: regAuthCopyUntitled2.src, alt: 'Authority registration' },
]

const topBrandsLogos = [
  { alt: 'Allied Bank', src: brandAlliedBank.src },
  { alt: 'Bank Alfalah', src: brandBankAlfalah.src },
  { alt: 'MCB Bank', src: brandMcb.src },
  { alt: 'The Bank of Punjab', src: brandBankOfPunjab.src },
  { alt: 'Soneri Bank', src: brandSoneriBank.src },
  { alt: 'Standard Chartered', src: brandStandardChartered.src },
  { alt: 'Roots International Schools & Colleges', src: brandRoots.src },
  { alt: "Froebel's International School", src: brandFroebels.src },
  { alt: 'Beaconhouse School System', src: brandBeaconhouse.src },
  { alt: 'Riphah International University', src: brandRiphah.src },
  { alt: 'Future World Schools & Colleges', src: brandFutureWorld.src },
  { alt: 'Toni & Guy', src: brandToniGuy.src },
  { alt: 'Depilex', src: brandDepilex.src },
  { alt: 'Burger Lab', src: brandBurgerLab.src },
  { alt: 'Nayatel', src: brandNayatel.src },
  { alt: 'Transworld', src: brandTransworld.src },
  { alt: 'PTCL', src: brandPtcl.src },
]

const TRUST_CARD_ACCENTS = {
  shield: {
    surface:
      'bg-white ring-1 ring-slate-200/80 shadow-[0_14px_44px_-18px_rgba(15,23,42,0.14)]',
    iconBg: 'bg-amber-500/16',
    icon: 'text-amber-700',
  },
  connectivity: {
    surface:
      'bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-200/85',
    iconBg: 'bg-slate-500/14',
    icon: 'text-slate-700',
  },
  quality: {
    surface:
      'bg-gradient-to-br from-sky-50/95 via-white to-white ring-1 ring-sky-100/75',
    iconBg: 'bg-sky-500/16',
    icon: 'text-sky-600',
  },
  leaf: {
    surface:
      'bg-gradient-to-br from-teal-50/90 via-white to-white ring-1 ring-teal-100/75',
    iconBg: 'bg-teal-500/16',
    icon: 'text-teal-700',
  },
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
      const compact = (n / unit.value)
        .toFixed(2)
        .replace(/\.?0+$/, '')

      return `PKR ${compact} ${unit.label}`
    }
  }

  return `PKR ${n.toLocaleString('en-PK')}`
}

function parsePropertyListResponse(data) {
  return Array.isArray(data) ? data : data?.results ?? []
}

const MOBILE_IMAGE_MEDIA = '(max-width: 768px)'

function publicImageBase(src) {
  if (!src?.startsWith('/images/') || !src.endsWith('.webp')) {
    return null
  }

  return src.replace(/(-\d+w)?\.webp$/i, '')
}

/**
 * Mobile-only variants (480w + 640w) — desktop <img src> stays full quality.
 */
function publicMobileSrcSet(src) {
  const base = publicImageBase(src)

  if (!base) return undefined

  return `${base}-480w.webp 480w, ${base}-640w.webp 640w`
}

function homeFeaturedFullImageUrl(p) {
  if (p.featured_image_url) return p.featured_image_url

  if (
    Array.isArray(p.images) &&
    p.images.length > 0 &&
    p.images[0].url
  ) {
    return p.images[0].url
  }

  return null
}

function homeListingDescription(p) {
  return String(p.description || p.short_description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function homeListingArea(p) {
  if (p.area_marlas == null || p.area_marlas === '') {
    return ''
  }

  const value = Number(p.area_marlas)

  const displayValue =
    Number.isFinite(value) && Number.isInteger(value)
      ? String(value)
      : String(p.area_marlas).replace(/\.0+$/, '')

  const unit = p.area_unit_display || 'Marla'

  const suffix =
    Number(displayValue) === 1 || unit.endsWith('s') ? '' : 's'

  return `${displayValue} ${unit}${suffix}`
}

function homeListingWhatsAppHref(property, propertyHref, imageUrl) {
  const message = [
    'Assalam o Alaikum, I am interested in this property:',
    `Property: ${property.title || 'Gulberg Greens property'}`,
    `Property link: ${propertyHref}`,
    ...(imageUrl ? [`Image link: ${imageUrl}`] : []),
  ].join('\n')

  return whatsAppContactHref(message)
}

function SeoImage({
  image,
  priority = false,
  className = '',
  mobileSizes = '100vw',
}) {
  const mobileSrcSet = publicMobileSrcSet(image.src)

  const imgProps = {
    src: image.src,
    alt: image.alt,
    title: image.title,
    className,
    loading: priority ? 'eager' : 'lazy',
    fetchPriority: priority ? 'high' : 'auto',
    decoding: 'async',
  }

  if (!mobileSrcSet) {
    return <img {...imgProps} />
  }

  return (
    <picture>
      <source
        media={MOBILE_IMAGE_MEDIA}
        srcSet={mobileSrcSet}
        sizes={mobileSizes}
        type="image/webp"
      />

      <img {...imgProps} />
    </picture>
  )
}

function SectionCtaLink({ to, label }) {
  return (
    <Link
      href={to}
      className="group/cta relative inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#31C950] transition-colors hover:text-[#28b048]"
    >
      <span className="relative">
        {label}

        <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#31C950] transition-transform duration-300 ease-out group-hover/cta:scale-x-100" />
      </span>

      <svg
        className="h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}

function SplitImageSection({
  image,
  imageFirst = false,
  children,
  className = '',
}) {
  return (
    <article
      className={`group/card overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-black/[0.03] md:rounded-3xl ${className}`}
    >
      <div className="grid gap-0 md:grid-cols-2 md:items-stretch">
        <div
          className={`flex flex-col justify-center p-8 md:p-10 lg:p-12 ${
            imageFirst ? 'md:order-2' : ''
          }`}
        >
          {children}
        </div>

        <div
          className={`relative min-h-[240px] overflow-hidden bg-slate-100 md:min-h-[360px] ${
            imageFirst ? 'md:order-1' : ''
          }`}
        >
          <SeoImage
            image={image}
            mobileSizes="(max-width: 768px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </article>
  )
}

function CategoryIcon({
  name,
  iconClassName = 'text-[#31C950]',
}) {
  const common = `h-6 w-6 ${iconClassName}`

  if (name === 'quality') {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 3l2.2 4.5L19 8.5l-3.5 3.4.8 4.9L12 15.8 7.7 16.8l.8-4.9L5 8.5l4.8-1L12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'shield') {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 3l8 3v6.5c0 5.5-3.4 10.4-8 11.5-4.6-1.1-8-6-8-11.5V6l8-3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'connectivity') {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 21c4.2-3.4 7-7.8 7-12a7 7 0 10-14 0c0 4.2 2.8 8.6 7 12z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <circle
          cx="12"
          cy="10"
          r="2"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 20c8-1 12-7 12-16-6 2-10 6-12 12a8 8 0 0012 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CarouselChevron({ direction, className }) {
  const isLeft = direction === 'left'

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d={
          isLeft
            ? 'M14.5 6.5L9 12l5.5 5.5'
            : 'M9.5 6.5L15 12l-5.5 5.5'
        }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FaqToggleIcon({ open, className = '' }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[#1a3553] transition-[border-color,background-color,color] duration-200 ${
        open
          ? 'border-[#31C950]/50 bg-[#31C950]/12 text-[#1a9e38]'
          : 'border-slate-200/90 bg-slate-50/90'
      } ${className}`.trim()}
      aria-hidden
    >
      {open ? (
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M2 8h12"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M8 2v12M2 8h12"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  )
}
function Home({
  initialFeaturedListings = [],
  initialNewsPosts = [],
}) {
  console.log('CLIENT INITIAL FEATURED:', initialFeaturedListings)
  console.log('INITIAL FEATURED COUNT:', initialFeaturedListings.length)


  const trustCarouselRef = useRef(null)

  const [faqOpenIndex, setFaqOpenIndex] = useState(null)
  const [trustSlide, setTrustSlide] = useState(0)
  const [trustItemsVisible, setTrustItemsVisible] = useState(4)
  const [trustTx, setTrustTx] = useState(0)
  const [trustCardWidth, setTrustCardWidth] = useState(0)
  const [isTrustMobile, setIsTrustMobile] = useState(false)
 const [homeFeaturedListings, setHomeFeaturedListings] = useState(
  Array.isArray(initialFeaturedListings) ? initialFeaturedListings : [])
  console.log('HOME FEATURED COUNT:', homeFeaturedListings.length)
  const [showDeferredSections, setShowDeferredSections] = useState(false)
 const [homeNewsPosts, setHomeNewsPosts] = useState(
  Array.isArray(initialNewsPosts) ? initialNewsPosts : [],
)
  const [homeYoutubeVideos, setHomeYoutubeVideos] = useState([])
    useEffect(() => {
    let cancelled = false

    const loadYoutubeVideos = async () => {
      try {
        const response = await fetch(
          `${YOUTUBE_RSS_PROXY_URL}${encodeURIComponent(
            YOUTUBE_FEED_URL
          )}`
        )

        if (!response.ok) {
          throw new Error('Failed to load YouTube feed')
        }

        const data = await response.json()

        const videos = Array.isArray(data?.items)
          ? data.items
              .filter(
                (item) =>
                  item?.guid ||
                  item?.link
              )
              .slice(0, 6)
              .map((item) => {
                let id = ''

                if (item?.guid) {
                  id = String(item.guid)
                    .split(':')
                    .pop()
                }

                if (!id && item?.link) {
                  try {
                    id =
                      new URL(
                        item.link
                      ).searchParams.get('v') || ''
                  } catch {
                    id = ''
                  }
                }

                return {
                  id,
                  title:
                    item?.title ||
                    'Gulberg Greens Islamabad',
                  publishedAt:
                    item?.pubDate || '',
                }
              })
              .filter((video) => video.id)
          : []

        if (!cancelled) {
          setHomeYoutubeVideos(videos)
        }
      } catch {
        if (!cancelled) {
          setHomeYoutubeVideos([])
        }
      }
    }

    void loadYoutubeVideos()

    return () => {
      cancelled = true
    }
  }, [])

  const trustCards = HOME_TRUST_FEATURES.items

  const trustMaxSlide = Math.max(
    0,
    trustCards.length - trustItemsVisible
  )

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

 

  useEffect(() => {
    const mq = () => {
      const w = window.innerWidth

      const next =
        w >= 1024 ? 4 : w >= 640 ? 2 : 1

      setIsTrustMobile(w < 640)
      setTrustItemsVisible(next)

      const max = Math.max(
        0,
        trustCards.length - next
      )

      setTrustSlide((s) =>
        Math.min(s, max)
      )
    }

    mq()

    window.addEventListener('resize', mq)

    return () =>
      window.removeEventListener(
        'resize',
        mq
      )
  }, [trustCards.length])

  useLayoutEffect(() => {
    const vp = trustCarouselRef.current

    if (!vp) return undefined

    const gap = AMENITY_CAROUSEL_GAP_PX

    const measure = () => {
      const vw = vp.clientWidth

      if (vw <= 0) return

      const n = trustItemsVisible

      const cardW =
        (vw - gap * Math.max(0, n - 1)) /
        n

      setTrustCardWidth(cardW)

      setTrustTx(
        trustSlide * (cardW + gap)
      )
    }

    measure()

    const ro = new ResizeObserver(measure)

    ro.observe(vp)

    return () => ro.disconnect()
  }, [trustItemsVisible, trustSlide])

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hash ===
        '#home-faq-heading'
    ) {
      setShowDeferredSections(true)
    }
  }, [])

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return undefined
    }

    let cancelled = false

    const reveal = () => {
      if (!cancelled) {
        setShowDeferredSections(true)
      }
    }

    if (
      'requestIdleCallback' in
      window
    ) {
      const id =
        window.requestIdleCallback(
          reveal,
          { timeout: 1200 }
        )

      return () => {
        cancelled = true
        window.cancelIdleCallback(
          id
        )
      }
    }

    const timer =
      window.setTimeout(
        reveal,
        300
      )

    return () => {
      cancelled = true
      window.clearTimeout(
        timer
      )
    }
  }, [])

  return (
    <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
         <HomePageSchema listings={homeFeaturedListings} />

      {/* SECTION 1 — HERO */}
      <section className="relative flex min-h-0 flex-col overflow-hidden md:min-h-[min(92vh,920px)]">
        <SeoImage
          image={HOME_HERO.image}
          priority
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/45" />

        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[min(100%,42rem)] bg-gradient-to-r from-slate-950/60 via-slate-950/30 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex flex-none flex-col justify-start px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-20 md:flex-1 md:justify-center md:py-24">
          <div className="container-shell w-full text-left">
            <div className="max-w-3xl">
              <h1 className="mt-6 font-[Poppins,Manrope,system-ui,sans-serif] text-[1.85rem] font-bold leading-[1.15] tracking-[-0.035em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)] md:mt-0 md:text-[2.35rem] lg:text-[2.85rem]">
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
                  <IconWhatsAppBrand
                    className="shrink-0 text-white"
                    size="h-5 w-5"
                  />

                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — LATEST LISTINGS */}
      {homeFeaturedListings.length > 0 ? (
        <section
          className="border-t border-slate-100 bg-white py-12 md:py-16"
          aria-labelledby="home-listings-heading"
        >
          <div className="container-shell">
            <h2
              id="home-listings-heading"
              className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl"
            >
              {HOME_LISTINGS.h2}
            </h2>

            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
              {HOME_LISTINGS.body}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:gap-5">
              {homeFeaturedListings.map((p) => {
                const fullImg =
                  homeFeaturedFullImageUrl(
                    p
                  )

                const mobileImg =
                  p.card_image_url

                const propertyHref =
                  propertyDetailPath(
                    p
                  )

                const description =
                  homeListingDescription(
                    p
                  )

                const area =
                  homeListingArea(p)

                const imageCount =
                  Array.isArray(
                    p.images
                  ) &&
                  p.images.length >
                    0
                    ? p.images.length
                    : fullImg
                      ? 1
                      : 0

                const location =
                  p.location ||
                  (p.block
                    ? `Gulberg Greens - Block ${p.block}`
                    : 'Gulberg Greens')

                const telHref = `tel:${String(
                  contactInfo.phone || ''
                ).replace(
                  /[^\d+]/g,
                  ''
                )}`

                return (
                  <article
                    key={p.id}
                    className="group w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                  >
                    <div className="grid h-[140px] w-full grid-cols-[112px_minmax(0,1fr)] overflow-hidden sm:h-[185px] sm:grid-cols-[220px_minmax(0,1fr)] md:h-[188px] md:grid-cols-[240px_minmax(0,1fr)]">
                      <div className="relative h-full w-full overflow-hidden bg-slate-100">
                        <Link
                          href={propertyHref}
                          className="block h-full w-full"
                          aria-label={`View ${p.title}`}
                        >
                          {fullImg ? (
                            mobileImg ? (
                              <picture className="block h-full w-full">
                                <source
                                  media={
                                    MOBILE_IMAGE_MEDIA
                                  }
                                  srcSet={
                                    mobileImg
                                  }
                                  sizes="112px"
                                  type="image/webp"
                                />

                                <img
                                  src={fullImg}
                                  alt=""
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  decoding="async"
                                  width={320}
                                  height={240}
                                />
                              </picture>
                            ) : (
                              <img
                                src={fullImg}
                                alt=""
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                                width={320}
                                height={240}
                              />
                            )
                          ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-slate-400">
                              No photo
                            </div>
                          )}

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
                        </Link>

                        <div className="pointer-events-none absolute left-1 top-1 flex items-center gap-1 sm:left-3 sm:top-3">
                          {p.is_featured ? (
                            <span className="rounded bg-[#ef4444] px-1 py-0.5 text-[7px] font-bold uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
                              Featured
                            </span>
                          ) : null}

                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[#22a45a] shadow-sm sm:h-5 sm:w-5">
                            <IconShieldCheck className="h-2.5 w-2.5 text-[#22a45a] sm:h-3.5 sm:w-3.5" />
                          </span>
                        </div>

                        {imageCount ? (
                          <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[8px] font-medium text-white backdrop-blur-sm sm:bottom-3 sm:left-3 sm:text-[11px]">
                            <IconCamera className="h-2.5 w-2.5 text-white sm:h-3.5 sm:w-3.5" />
                            <span>
                              {imageCount}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden p-2 pb-10 sm:p-3 sm:pb-12 md:p-4 md:pb-14">
                        <div className="min-w-0">
                          <h3 className="truncate text-[11px] font-bold leading-snug text-slate-900 transition group-hover:text-[#0d8272] sm:text-[14px] md:text-[15px]">
                            <Link
                              href={
                                propertyHref
                              }
                              className="block truncate"
                            >
                              {p.title}
                            </Link>
                          </h3>

                          <p className="mt-0.5 truncate text-[13px] font-extrabold tracking-tight text-[#0f243c] sm:mt-1 sm:text-lg md:text-xl">
                            {formatCompactPkr(
                              p.price
                            )}
                          </p>

                          <p className="mt-0.5 flex items-center gap-0.5 truncate text-[9px] font-medium text-slate-500 sm:mt-1 sm:gap-1 sm:text-xs">
                            <IconPin className="h-2.5 w-2.5 text-[#0d9488] sm:h-3.5 sm:w-3.5" />

                            <span className="truncate">
                              {location}
                            </span>
                          </p>

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

                            {area ? (
                              <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold text-slate-700 sm:text-[11px]">
                                <IconExpandArea className="h-2.5 w-2.5 text-slate-500 sm:h-3 sm:w-3" />
                                {area}
                              </span>
                            ) : null}
                          </div>

                          {description ? (
                            <p className="mt-1 hidden text-xs font-normal leading-relaxed text-slate-500 sm:line-clamp-1">
                              {description}
                            </p>
                          ) : null}
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 flex min-w-0 items-center justify-between border-t border-slate-100 pt-1 sm:bottom-3 sm:left-3 sm:right-3 sm:pt-2 md:left-4 md:right-4">
                          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                            <a
                              href={homeListingWhatsAppHref(
                                p,
                                propertyHref,
                                fullImg
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-[36px] shrink-0 items-center justify-center rounded-md border border-[#25D366] bg-white px-0 py-0.5 text-[10px] font-semibold text-slate-800 transition hover:bg-[#25D366] hover:text-white sm:w-auto sm:gap-1 sm:px-3 sm:py-1 sm:text-xs"
                              aria-label={`WhatsApp about ${p.title}`}
                            >
                              <IconWhatsAppBrand className="h-3 w-3 shrink-0 text-[#25D366] sm:h-3.5 sm:w-3.5" />

                              <span className="hidden sm:inline">
                                WhatsApp
                              </span>
                            </a>

                            <a
                              href={
                                telHref
                              }
                              className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-[#22c55e] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#16a34a] sm:gap-1 sm:px-3.5 sm:py-1 sm:text-xs"
                              aria-label={`Call about ${p.title}`}
                            >
                              <IconPhone
                                className="h-3 w-3 shrink-0 text-white sm:h-3.5 sm:w-3.5"
                                strokeWidth={
                                  2
                                }
                              />

                              <span>
                                CALL
                              </span>
                            </a>
                          </div>

                          <Link
                            href={
                              propertyHref
                            }
                            className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 sm:px-3.5 sm:py-1 sm:text-xs"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-8">
              <SectionCtaLink
                to={HOME_LISTINGS.cta.to}
                label={
                  HOME_LISTINGS.cta.label
                }
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* SECTION 2 — TRUST FEATURE CARDS */}
      <section
        className="relative z-10 -mt-10 pb-8 pt-5 md:-mt-12 md:pb-10"
        aria-labelledby="trust-features-heading"
      >
        <div className="container-shell">
          <h2
            id="trust-features-heading"
            className="mt-10 mb-8 text-center text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl"
          >
            {
              HOME_TRUST_FEATURES.h2
            }
          </h2>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
            <button
              type="button"
              onClick={() =>
                setTrustSlide(
                  (s) =>
                    Math.max(
                      0,
                      s - 1
                    )
                )
              }
              disabled={
                trustSlide <= 0
              }
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-sm disabled:opacity-35 md:flex"
              aria-label="Previous trust features"
            >
              <CarouselChevron
                direction="left"
                className="h-5 w-5"
              />
            </button>

            <div
              ref={
                trustCarouselRef
              }
              className="min-w-0 w-full flex-1 overflow-hidden md:w-auto"
            >
              <div
                className={
                  isTrustMobile
                    ? 'flex flex-col gap-3'
                    : prefersReducedMotion
                      ? 'flex'
                      : 'flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                }
                style={{
                  gap: isTrustMobile
                    ? '12px'
                    : `${AMENITY_CAROUSEL_GAP_PX}px`,
                  transform:
                    isTrustMobile
                      ? 'none'
                      : `translate3d(-${trustTx}px, 0, 0)`,
                }}
              >
                {trustCards.map(
                  (card) => {
                    const palette =
                      TRUST_CARD_ACCENTS[
                        card.icon
                      ] ||
                      TRUST_CARD_ACCENTS.shield

                    return (
                      <article
                        key={card.id}
                        className={
                          isTrustMobile
                            ? 'w-full'
                            : 'shrink-0'
                        }
                        style={{
                          width:
                            isTrustMobile
                              ? '100%'
                              : trustCardWidth >
                                  0
                                ? `${trustCardWidth}px`
                                : undefined,
                        }}
                      >
                        <div
                          className={`flex h-[118px] items-center gap-4 overflow-hidden rounded-2xl p-4 md:block md:h-auto md:min-h-[260px] md:p-6 ${palette.surface}`}
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:h-14 md:w-14 ${palette.iconBg}`}
                          >
                            <CategoryIcon
                              name={
                                card.icon
                              }
                              iconClassName={
                                palette.icon
                              }
                            />
                          </div>

                          <div className="min-w-0 md:min-w-0">
                            <h3 className="text-base font-semibold leading-snug text-[#1a2332] md:mt-5 md:text-lg">
                              {
                                card.title
                              }
                            </h3>

                            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600 md:mt-2 md:line-clamp-none">
                              {
                                card.body
                              }
                            </p>
                          </div>
                        </div>
                      </article>
                    )
                  }
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setTrustSlide(
                  (s) =>
                    Math.min(
                      trustMaxSlide,
                      s + 1
                    )
                )
              }
              disabled={
                trustSlide >=
                trustMaxSlide
              }
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-sm disabled:opacity-35 md:flex"
              aria-label="Next trust features"
            >
              <CarouselChevron
                direction="right"
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — OFFICIAL PLATFORM */}
      <section
        className="border-t border-slate-100 bg-[#fafbfc] py-14 md:py-20"
        aria-labelledby="platform-heading"
      >
        <div className="container-shell">
          <SplitImageSection
            image={
              HOME_PLATFORM_HUB.image
            }
            imageFirst
          >
            <h2
              id="platform-heading"
              className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl"
            >
              {
                HOME_PLATFORM_HUB.h2
              }
            </h2>

            <p className="mt-4 text-[15px] leading-[1.8] text-slate-600 md:text-base">
              {
                HOME_PLATFORM_HUB.body
              }
            </p>

            <nav
              className="mt-8 flex flex-wrap gap-2"
              aria-label="Property categories"
            >
              {HOME_PLATFORM_HUB.links.map(
                (link) => (
                  <Link
                    key={link.to}
                    href={link.to}
                    className="rounded-full border border-[#31C950]/35 bg-[#31C950]/10 px-4 py-2 text-sm font-semibold text-[#1a3553] transition hover:bg-[#31C950] hover:text-white"
                  >
                    {
                      link.label
                    }
                  </Link>
                )
              )}
            </nav>
          </SplitImageSection>
        </div>
      </section>

      {/* SECTION 5 — LAKE */}
      <section
        className="relative isolate min-h-[min(72vh,780px)] overflow-hidden"
        aria-labelledby="lake-heading"
      >
        <div className="absolute inset-0">
          <SeoImage
            image={
              HOME_LAKE.image
            }
            className="h-full w-full object-cover object-center"
          />

          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/50 to-emerald-950/35"
            aria-hidden
          />
        </div>

        <div className="container-shell relative flex min-h-[min(72vh,780px)] flex-col justify-center py-16 md:py-24">
          <div className="max-w-3xl">
            <h2
              id="lake-heading"
              className="text-3xl font-bold leading-tight tracking-[-0.03em] text-white md:text-4xl lg:text-5xl"
            >
              {HOME_LAKE.h2}
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-[1.75] text-white/90 md:text-lg">
              {HOME_LAKE.body}
            </p>
          </div>
        </div>
      </section>

      {showDeferredSections ? (
        <>
          {/* SECTION 6 — DEVELOPMENT STATUS */}
          <section
            className="border-t border-slate-100 bg-white py-14 md:py-20"
            aria-labelledby="development-heading"
          >
            <div className="container-shell space-y-10">
              <SplitImageSection
                image={
                  HOME_DEVELOPMENT.image
                }
              >
                <h2
                  id="development-heading"
                  className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl"
                >
                  {
                    HOME_DEVELOPMENT.h2
                  }
                </h2>

                <h3 className="mt-6 text-lg font-semibold text-[#1a3553]">
                  {
                    HOME_DEVELOPMENT
                      .current.h3
                  }
                </h3>

                <p className="mt-2 text-[15px] leading-[1.8] text-slate-600">
                  {
                    HOME_DEVELOPMENT
                      .current.body
                  }
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#1a3553]">
                  {
                    HOME_DEVELOPMENT
                      .upcoming.h3
                  }
                </h3>

                <p className="mt-2 text-[15px] leading-[1.8] text-slate-600">
                  {
                    HOME_DEVELOPMENT
                      .upcoming.body
                  }
                </p>

                <div className="mt-8">
                  <SectionCtaLink
                    to={
                      HOME_DEVELOPMENT
                        .cta.to
                    }
                    label={
                      HOME_DEVELOPMENT
                        .cta.label
                    }
                  />
                </div>
              </SplitImageSection>
            </div>
          </section>

          {/* SECTION 7 — BLOCKS */}
          <section
            className="border-t border-slate-100 bg-[#fafbfc] py-14 md:py-20"
            aria-labelledby="blocks-heading"
          >
            <div className="container-shell">
              <h2
                id="blocks-heading"
                className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl"
              >
                {HOME_BLOCKS.h2}
              </h2>

              <p className="mt-4 max-w-3xl text-[15px] leading-[1.8] text-slate-600 md:text-base">
                {
                  HOME_BLOCKS.intro
                }
              </p>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-[#1a3553]">
                    {
                      HOME_BLOCKS
                        .residential
                        .h3
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {
                      HOME_BLOCKS
                        .residential
                        .body
                    }
                  </p>

                  <nav
                    className="mt-5 flex flex-wrap gap-2"
                    aria-label="Residential plot blocks"
                  >
                    {HOME_BLOCKS.residential.links.map(
                      (link) => (
                        <Link
                          key={
                            link.to
                          }
                          href={
                            link.to
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#1a3553] hover:border-[#31C950] hover:text-[#31C950]"
                        >
                          {
                            link.label
                          }
                        </Link>
                      )
                    )}
                  </nav>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-[#1a3553]">
                    {
                      HOME_BLOCKS
                        .farmhouse
                        .h3
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {
                      HOME_BLOCKS
                        .farmhouse
                        .body
                    }
                  </p>

                  <nav
                    className="mt-5 flex flex-wrap gap-2"
                    aria-label="Farmhouse blocks"
                  >
                    {HOME_BLOCKS.farmhouse.links.map(
                      (link) => (
                        <Link
                          key={
                            link.to
                          }
                          href={
                            link.to
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#1a3553] hover:border-[#31C950] hover:text-[#31C950]"
                        >
                          {
                            link.label
                          }
                        </Link>
                      )
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8 — INVESTMENT */}
          <section
            className="border-t border-slate-100 bg-white py-14 md:py-20"
            aria-labelledby="investment-heading"
          >
            <div className="container-shell">
              <SplitImageSection
                image={
                  HOME_INVESTMENT.image
                }
                imageFirst
              >
                <h2
                  id="investment-heading"
                  className="text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl"
                >
                  {
                    HOME_INVESTMENT.h2
                  }
                </h2>

                <p className="mt-4 text-[15px] leading-[1.8] text-slate-600 md:text-base">
                  {
                    HOME_INVESTMENT.body
                  }
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#1a3553]">
                  {
                    HOME_INVESTMENT
                      .installment
                      .h3
                  }
                </h3>

                <p className="mt-2 text-[15px] leading-[1.8] text-slate-600">
                  {
                    HOME_INVESTMENT
                      .installment
                      .body
                  }
                </p>

                <div className="mt-8">
                  <SectionCtaLink
                    to={
                      HOME_INVESTMENT
                        .cta.to
                    }
                    label={
                      HOME_INVESTMENT
                        .cta.label
                    }
                  />
                </div>
              </SplitImageSection>
            </div>
          </section>

          {/* SECTION 9 — LIFESTYLE */}
          <section
            className="border-t border-slate-100 bg-white py-12 md:py-16"
            aria-labelledby="lifestyle-heading"
          >
            <div className="container-shell mb-8 md:mb-10">
              <h2
                id="lifestyle-heading"
                className="mx-auto max-w-4xl text-center text-xl font-bold text-[#1a3553] md:text-2xl"
              >
                {
                  HOME_LIFESTYLE.h2
                }
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-center text-[15px] leading-relaxed text-slate-600">
                {
                  HOME_LIFESTYLE.body
                }
              </p>
            </div>

            <LogoMarquee
              logos={
                topBrandsLogos
              }
            />
          </section>

          {/* SECTION 10 — APPROVALS */}
          <section
            className="border-t border-slate-100 bg-[#fafbfc] py-12 md:py-16"
            aria-labelledby="registrations-heading"
          >
            <div className="container-shell mb-8 md:mb-10">
              <h2
                id="registrations-heading"
                className="mx-auto max-w-4xl text-center text-xl font-bold text-[#1a3553] md:text-2xl"
              >
                {
                  HOME_APPROVALS.h2
                }
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-center text-[15px] leading-relaxed text-slate-600">
                {
                  HOME_APPROVALS.body
                }
              </p>

              <p className="mx-auto mt-6 max-w-4xl text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {
                  HOME_APPROVALS.marqueeTitle
                }
              </p>
            </div>

            <LogoMarquee
              logos={
                registrationLogos
              }
            />
          </section>

          {/* SECTION 11 — SOCIAL MEDIA */}
          <section
            className="border-t border-slate-100 bg-white py-14 md:py-20"
            aria-labelledby="social-media-heading"
          >
            <div className="container-shell">
              <div className="mx-auto max-w-3xl text-center">
                <h2
                  id="social-media-heading"
                  className="text-2xl font-bold tracking-[-0.03em] text-[#1a3553] md:text-3xl"
                >
                  Stay Connected Across Social Media
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600 md:text-base">
                  Regular updates, property walkthroughs, and community news are shared across Gulberg Greens Islamabad's official social media channels.
                </p>

                <h3 className="mt-8 text-lg font-semibold text-[#1a3553]">
                  YouTube
                </h3>

                {homeYoutubeVideos.length >
                0 ? (
                  <div className="mx-auto mt-5 grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {homeYoutubeVideos.map(
                      (video) => (
                        <article
                          key={
                            video.id
                          }
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#31C950]/50 hover:shadow-md"
                        >
                          <div className="aspect-video w-full overflow-hidden bg-slate-100">
                            <iframe
                              title={
                                video.title
                              }
                              src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                              className="h-full w-full border-0"
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>

                          <div className="p-4">
                            <h4 className="line-clamp-2 text-sm font-semibold leading-relaxed text-[#1a3553]">
                              {
                                video.title
                              }
                            </h4>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                ) : (
                  <div className="mx-auto mt-5 flex aspect-video w-full max-w-4xl items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-400">
                    Official YouTube videos will appear here.
                  </div>
                )}

                <div
                  className="mt-8 flex flex-wrap items-center justify-center gap-3"
                  aria-label="Social media links"
                >
                  {[
                    {
                      label: 'Facebook',
                      href: 'https://www.facebook.com/share/18n263NYvD/',
                    },
                    {
                      label: 'Instagram',
                      href: 'https://www.instagram.com/gulberggreens.ibechs?stkn=MWlwcGQ1aXhlYW10NA==',
                    },
                    {
                      label: 'TikTok',
                      href: 'https://www.tiktok.com/@gulberggreensibechs?is_from_webapp=1&sender_device=pc',
                    },
                    {
                      label: 'X',
                      href: 'https://x.com/gulberg_ibechs?s=20',
                    },
                  ].map(
                    (social) => (
                      <a
                        key={
                          social.label
                        }
                        href={
                          social.href
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={
                          social.label
                        }
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-[#1a3553] shadow-sm transition hover:-translate-y-0.5 hover:border-[#31C950] hover:bg-[#31C950] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31C950] focus-visible:ring-offset-2"
                      >
                        {social.label ===
                        'Facebook'
                          ? 'f'
                          : social.label ===
                              'Instagram'
                            ? '◎'
                            : social.label ===
                                'TikTok'
                              ? '♪'
                              : social.label ===
                                  'Pinterest'
                                ? 'P'
                                : social.label ===
                                    'X'
                                  ? 'X'
                                  : '@'}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 12 — LATEST UPDATES */}
          <section
            className="border-t border-slate-100 bg-[#fafbfc] py-14 md:py-20"
            aria-labelledby="latest-updates-heading"
          >
            <div className="container-shell">
              <div className="mx-auto max-w-3xl text-center">
                <h2
                  id="latest-updates-heading"
                  className="text-2xl font-bold tracking-[-0.03em] text-[#1a3553] md:text-3xl"
                >
                  Latest Updates from Gulberg Greens Islamabad
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600 md:text-base">
                  News, development milestones, and society announcements are posted regularly to keep residents and investors informed.
                </p>
              </div>

              {homeNewsPosts.length >
              0 ? (
                <div className="mt-10 grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {homeNewsPosts.map(
                    (post) => {
                      const href = `/latest-updates/${post.slug}/`

                      return (
                        <article
                          key={
                            post.slug
                          }
                          className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-100/90 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.03] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]"
                        >
                          <Link
                            href={href}
                            className="group flex h-full min-h-0 flex-col rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-[#31C950] focus-visible:ring-offset-2"
                          >
                            {post.primary_image ? (
                              <div className="relative flex aspect-[16/10] shrink-0 items-center justify-center overflow-hidden bg-slate-100">
                                <img
                                  src={
                                    post.primary_image
                                  }
                                  alt=""
                                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div
                                className="aspect-[16/10] shrink-0 bg-gradient-to-br from-slate-100 to-slate-50"
                                aria-hidden
                              />
                            )}

                            <div className="flex min-h-0 flex-1 flex-col p-6 md:p-7">
                              <h3 className="font-[Poppins,Manrope,system-ui,sans-serif] text-lg font-semibold leading-snug tracking-[-0.02em] text-[#1a2332] transition group-hover:text-[#31C950] md:text-xl">
                                {
                                  post.title
                                }
                              </h3>

                              <p className="mt-auto pt-4 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                                {post.published_at
                                  ? new Intl.DateTimeFormat(
                                      'en-GB',
                                      {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                      }
                                    ).format(
                                      new Date(
                                        post.published_at
                                      )
                                    ).toUpperCase()
                                  : ''}
                              </p>
                            </div>
                          </Link>
                        </article>
                      )
                    }
                  )}
                </div>
              ) : null}

              <div className="mt-8 text-center">
                <SectionCtaLink
                  to="/latest-updates/"
                  label="View All Updates"
                />
              </div>
            </div>
          </section>

          {/* SECTION 11 — FAQ */}
          <section
            id="home-faq-heading"
            className="scroll-mt-28 border-t border-slate-200 bg-white py-16 md:scroll-mt-32 md:py-24"
            aria-labelledby="faq-section-heading"
          >
            <div className="container-shell px-4 sm:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2
                  id="faq-section-heading"
                  className="text-2xl font-bold tracking-[-0.03em] text-[#1a3553] md:text-3xl"
                >
                  {
                    HOME_FAQ_SECTION.h2
                  }
                </h2>
              </div>

              <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-3 md:mt-14 md:grid-cols-2 md:gap-4">
                {homeFaqItems.map(
                  (item, index) => {
                    const open =
                      faqOpenIndex ===
                      index

                    return (
                      <div
                        key={
                          item.id
                        }
                        className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm"
                      >
                        <h3 className="m-0 text-base font-semibold">
                          <button
                            type="button"
                            id={`faq-trigger-${item.id}`}
                            aria-expanded={
                              open
                            }
                            aria-controls={`faq-panel-${item.id}`}
                            onClick={() =>
                              setFaqOpenIndex(
                                open
                                  ? null
                                  : index
                              )
                            }
                            className="flex w-full items-start gap-4 px-5 py-4 text-left text-[#1a2332] md:px-6 md:py-5"
                          >
                            <FaqToggleIcon
                              open={
                                open
                              }
                              className="mt-0.5"
                            />

                            <span className="min-w-0 flex-1">
                              {
                                item.question
                              }
                            </span>
                          </button>
                        </h3>

                        <div
                          id={`faq-panel-${item.id}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${item.id}`}
                          hidden={!open}
                          className={
                            open
                              ? 'border-t border-slate-100 bg-slate-50/40 px-5 pb-5 pt-1 md:px-6 md:pb-6'
                              : ''
                          }
                        >
                          <div className="space-y-3 pl-[3.25rem] md:pl-[3.75rem]">
                            {item.paragraphs.map(
                              (
                                para,
                                pIdx
                              ) => (
                                <p
                                  key={
                                    pIdx
                                  }
                                  className="text-[14px] leading-[1.75] text-slate-600 md:text-[15px]"
                                >
                                  {
                                    para
                                  }
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          </section>

          {/* SECTION 13 — LOCATION */}
          <section
            className="border-t border-slate-100 bg-[#fafbfc] py-14 md:py-20"
            aria-labelledby="location-heading"
          >
            <div className="container-shell">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div>
                  <h2
                    id="location-heading"
                    className="text-2xl font-bold tracking-[-0.03em] text-[#1a3553] md:text-3xl"
                  >
                    {
                      HOME_LOCATION.h2
                    }
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                    {
                      HOME_LOCATION.body
                    }
                  </p>

                  <h3 className="mt-8 text-lg font-semibold text-[#1a3553]">
                    {
                      HOME_LOCATION
                        .visit.h3
                    }
                  </h3>

                  <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-slate-600">
                    {HOME_LOCATION.visit.lines.map(
                      (line) => (
                        <li
                          key={line}
                        >
                          {
                            line
                          }
                        </li>
                      )
                    )}
                  </ul>

                  <div className="mt-8">
                    <SectionCtaLink
                      to={
                        HOME_LOCATION
                          .cta.to
                      }
                      label={
                        HOME_LOCATION
                          .cta.label
                      }
                    />
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

          {/* SECTION 14 — FOOTER BLURB */}
          <section
            className="border-t border-slate-200 bg-white py-12 md:py-14"
            aria-labelledby="home-footer-blurb"
          >
            <div className="container-shell max-w-3xl text-center">
              <h3
                id="home-footer-blurb"
                className="text-lg font-semibold text-[#1a3553] md:text-xl"
              >
                {
                  HOME_FOOTER_BLURB.h3
                }
              </h3>

              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                {
                  HOME_FOOTER_BLURB.body
                }
              </p>
            </div>
          </section>
        </>
      ) : (
        <div
          className="h-16 border-t border-slate-100 bg-white"
          aria-hidden
        />
      )}
    </div>
  )
}

export default Home

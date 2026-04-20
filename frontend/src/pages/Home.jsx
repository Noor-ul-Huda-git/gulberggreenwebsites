import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LogoMarquee from '../components/home/LogoMarquee.jsx'
import { fetchProperties } from '../lib/api.js'
import { homeSocialShowcase, mapDirectionsUrl, mapEmbedUrl } from '../data/siteContent.js'
import heroBg from '../assets/bg.png'
// import lakeBg from '../assets/lake.jpg'
import lakeBg from '../assets/lake2.png'
import imgGullbergMall from '../assets/gullbergmall.png'
import imgHouses from '../assets/houses.png'
import imgHelipad from '../assets/helipad.png'
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

const spotlightRows = [
  {
    id: 'plot-development',
    kicker: 'Development',
    title: 'Current Status of Plot Development',
    body:
      'Several residential blocks are currently undergoing rapid development, with infrastructure construction and possession milestones being achieved across key sectors.',
    image: imgGullbergMall,
    imageAlt: 'Aerial view of lit commercial and residential development along a main road at night',
    imageFirst: false,
    cta: { label: 'Latest updates', to: '/news' },
  },
  {
    id: 'plots-blocks',
    kicker: 'Master plan',
    title: 'Quick Overview of Plots & Blocks',
    body:
      'The community is divided into multiple residential and farmhouse blocks, offering a wide range of plot sizes for diverse living and investment needs—including residential plots, apartments, houses, and expansive farmhouses for modern, comfortable living.',
    image: imgHouses,
    imageAlt: 'Aerial view of residential blocks, greenery, and water',
    imageFirst: true,
    cta: { label: 'View properties', to: '/properties' },
  },
  {
    id: 'heliport',
    kicker: 'Infrastructure',
    title: "Pakistan's First Public Heliport",
    body:
      "Pakistan's first public heliport is being developed within the community, offering modern aviation facilities to enhance connectivity and support future growth—underscoring a commitment to innovation and premium infrastructure.",
    image: imgHelipad,
    imageAlt: 'Helicopter on a circular landing pad under a clear sky',
    imageFirst: false,
    cta: { label: 'Project insights', to: '/gulberg-map' },
  },
]

const REGISTRATION_LOGOS_BASE =
  'https://gulberggreens.com.pk/wp-content/uploads/2025/12'

/** Order matches original site carousel (8 slides) */
const registrationLogos = [
  { src: `${REGISTRATION_LOGOS_BASE}/Copy-of-Untitled-1-150x150-1.webp`, alt: 'Authority registration' },
  { src: `${REGISTRATION_LOGOS_BASE}/5-150x150-1.webp`, alt: 'Authority registration' },
  { src: `${REGISTRATION_LOGOS_BASE}/3-150x150-1.webp`, alt: 'Authority registration' },
  { src: `${REGISTRATION_LOGOS_BASE}/2-150x150-1.webp`, alt: 'CDA Islamabad' },
  { src: `${REGISTRATION_LOGOS_BASE}/4-150x150-1.webp`, alt: 'Authority registration' },
  { src: `${REGISTRATION_LOGOS_BASE}/1-150x150-1.webp`, alt: 'Authority registration' },
  { src: `${REGISTRATION_LOGOS_BASE}/Copy-of-Untitled-3-150x150-1.webp`, alt: 'Authority registration' },
  { src: `${REGISTRATION_LOGOS_BASE}/Copy-of-Untitled-2-150x150-1.webp`, alt: 'Authority registration' },
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

/** px — must match `gap` on the amenities carousel track (used for slide math + layout). */
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
      const compact = (n / unit.value).toFixed(1).replace(/\.0$/, '')
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

/** Distinct but on-brand surfaces so cards read as separate tiles, not one slab. */
const AMENITY_CARD_ACCENTS = {
  emerald: {
    surface:
      'bg-white ring-1 ring-slate-200/80 shadow-[0_14px_44px_-18px_rgba(15,23,42,0.14)] hover:shadow-[0_22px_52px_-18px_rgba(15,23,42,0.2)]',
    iconBg: 'bg-[#31C950]/14',
    icon: 'text-[#1a9e38]',
  },
  sky: {
    surface:
      'bg-gradient-to-br from-sky-50/95 via-white to-white ring-1 ring-sky-100/75 shadow-[0_14px_44px_-18px_rgba(14,116,144,0.12)] hover:shadow-[0_22px_52px_-20px_rgba(14,116,144,0.16)]',
    iconBg: 'bg-sky-500/16',
    icon: 'text-sky-600',
  },
  amber: {
    surface:
      'bg-gradient-to-br from-amber-50/90 via-white to-white ring-1 ring-amber-100/80 shadow-[0_14px_44px_-18px_rgba(180,83,9,0.11)] hover:shadow-[0_22px_52px_-20px_rgba(180,83,9,0.15)]',
    iconBg: 'bg-amber-500/16',
    icon: 'text-amber-700',
  },
  teal: {
    surface:
      'bg-gradient-to-br from-teal-50/90 via-white to-white ring-1 ring-teal-100/75 shadow-[0_14px_44px_-18px_rgba(15,118,110,0.11)] hover:shadow-[0_22px_52px_-20px_rgba(15,118,110,0.15)]',
    iconBg: 'bg-teal-500/16',
    icon: 'text-teal-700',
  },
  violet: {
    surface:
      'bg-gradient-to-br from-violet-50/90 via-white to-white ring-1 ring-violet-100/75 shadow-[0_14px_44px_-18px_rgba(109,40,217,0.09)] hover:shadow-[0_22px_52px_-20px_rgba(109,40,217,0.13)]',
    iconBg: 'bg-violet-500/16',
    icon: 'text-violet-700',
  },
  slate: {
    surface:
      'bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-200/85 shadow-[0_14px_44px_-18px_rgba(15,23,42,0.11)] hover:shadow-[0_22px_52px_-20px_rgba(15,23,42,0.16)]',
    iconBg: 'bg-slate-500/14',
    icon: 'text-slate-700',
  },
}

const categoryCards = [
  {
    title: 'High Quality',
    description:
      'Developed by experienced professionals in architecture, construction, and engineering, ensuring high standards of quality and craftsmanship.',
    icon: 'quality',
    accent: 'emerald',
  },
  {
    title: 'All Luxuries',
    description:
      'A complete lifestyle featuring lush parks, serene surroundings, entertainment options, and modern facilities for comfortable living.',
    icon: 'luxury',
    accent: 'sky',
  },
  {
    title: 'Complete Security',
    description:
      'A secure, gated environment with 24/7 monitoring, offering residents peace of mind and a safe living experience.',
    icon: 'shield',
    accent: 'amber',
  },
  {
    title: 'Green Environment',
    description:
      'Designed as a sustainable community that harmonizes with nature, promoting eco-friendly living without compromising modern comforts.',
    icon: 'leaf',
    accent: 'teal',
  },
  {
    title: 'Educational Facilities',
    description:
      'Gulberg Greens offers nearby schools and colleges, providing quality education and convenience for families and residents.',
    icon: 'school',
    accent: 'violet',
  },
  {
    title: 'Strategic Location & Connectivity',
    description:
      'Gulberg Greens enjoys strategic access to Islamabad Expressway, ensuring fast connectivity to Rawalpindi, airport, business hubs, and major city centers.',
    icon: 'connectivity',
    accent: 'slate',
  },
]

function PinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5a4.25 4.25 0 00-4.25 4.25c0 3.19 4.25 7.88 4.25 7.88s4.25-4.69 4.25-7.88A4.25 4.25 0 0010 2.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="6.75" r="1.2" fill="currentColor" />
    </svg>
  )
}

function ChevronSelect({ className }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CategoryIcon({ name, iconClassName = 'text-[#31C950]' }) {
  const common = `h-6 w-6 ${iconClassName}`
  if (name === 'quality') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l2.2 4.5L19 8.5l-3.5 3.4.8 4.9L12 15.8 7.7 16.8l.8-4.9L5 8.5l4.8-1L12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'luxury') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3c.8 1.6 2.3 2.9 4 3.5-1 1.4-1.6 3-1.6 4.7 0 3.3 2.7 6 6 6v1H5v-1c3.3 0 6-2.7 6-6 0-1.7-.6-3.3-1.6-4.7 1.7-.6 3.2-1.9 4-3.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l8 3v6.5c0 5.5-3.4 10.4-8 11.5-4.6-1.1-8-6-8-11.5V6l8-3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'school') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5L12 7l8 3.5v8H4v-8zM9 21v-6h6v6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'connectivity') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 21c4.2-3.4 7-7.8 7-12a7 7 0 10-14 0c0 4.2 2.8 8.6 7 12z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2" fill="currentColor" />
      </svg>
    )
  }
  if (name === 'home') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'leaf') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 20c8-1 12-7 12-16-6 2-10 6-12 12a8 8 0 0012 4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'building') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 20V8l8-4 8 4v12M9 20v-5h6v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18V6M4 18h16M4 18l4-6 4 4 4-8 4 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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
        d={isLeft ? 'M14.5 6.5L9 12l5.5 5.5' : 'M9.5 6.5L15 12l-5.5 5.5'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SocialPlatformGlyph({ platform, className = 'h-6 w-6' }) {
  const c = `${className} shrink-0`
  switch (platform) {
    case 'facebook':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.75 0-1 .5-1 1.25V12h2.75l-.45 3H14v7.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M7.8 2h8.4A5.8 5.8 0 0122 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8A5.8 5.8 0 012 16.2V7.8A5.8 5.8 0 017.8 2zm-.2 2A3.8 3.8 0 004 7.8v8.4A3.8 3.8 0 007.6 20h8.8a3.8 3.8 0 003.6-3.8V7.8A3.8 3.8 0 0016.4 4H7.6zm8.25 1.75a.9.9 0 110 1.8.9.9 0 010-1.8zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.33 6.33 0 00-1.88.33 6.34 6.34 0 00-4.4 6.04 6.34 6.34 0 106.34-6.34c-.04 0-.09 0-.13.01V8.42a8.92 8.92 0 004.77 1.39v-3.12z" />
        </svg>
      )
    case 'google':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )
    default:
      return null
  }
}

function Home() {
  const amenityCarouselRef = useRef(null)

  const [amenitySlide, setAmenitySlide] = useState(0)
  const [amenityItemsVisible, setAmenityItemsVisible] = useState(4)
  const [amenityTx, setAmenityTx] = useState(0)
  const [amenityCardWidth, setAmenityCardWidth] = useState(0)
  const [homeFeaturedListings, setHomeFeaturedListings] = useState([])

  const amenityMaxSlide = Math.max(0, categoryCards.length - amenityItemsVisible)

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetchProperties({ page: '1' })
        if (cancelled) return
        let list = parsePropertyListResponse(res)
        list = [...list].sort((a, b) => {
          if (Boolean(b.is_featured) !== Boolean(a.is_featured)) return Number(b.is_featured) - Number(a.is_featured)
          const tb = new Date(b.created_at || 0).getTime()
          const ta = new Date(a.created_at || 0).getTime()
          return tb - ta
        })
        setHomeFeaturedListings(list.slice(0, 5))
      } catch {
        if (!cancelled) setHomeFeaturedListings([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const mq = () => {
      const w = window.innerWidth
      const next = w >= 1024 ? 4 : w >= 640 ? 2 : 1
      setAmenityItemsVisible(next)
      const max = Math.max(0, categoryCards.length - next)
      setAmenitySlide((s) => Math.min(s, max))
    }
    mq()
    window.addEventListener('resize', mq)
    return () => window.removeEventListener('resize', mq)
  }, [])

  useLayoutEffect(() => {
    const vp = amenityCarouselRef.current
    if (!vp) return undefined

    const gap = AMENITY_CAROUSEL_GAP_PX

    const measure = () => {
      const vw = vp.clientWidth
      if (vw <= 0) return
      const n = amenityItemsVisible
      const cardW = (vw - gap * Math.max(0, n - 1)) / n
      setAmenityCardWidth(cardW)
      setAmenityTx(amenitySlide * (cardW + gap))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [amenityItemsVisible, amenitySlide])

  return (
    <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
      <section className="relative min-h-[min(92vh,920px)] overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/35" />

        {/* <div className="container-shell relative flex min-h-[min(92vh,920px)] flex-col justify-end pb-14 pt-28 md:pb-20 md:pt-36">
          <div className="max-w-3xl">
            <p className="text-[15px] font-medium text-slate-600 md:text-base">The Best Way To</p>
            <h1 className="mt-2 text-[2.35rem] font-bold leading-[1.12] tracking-[-0.03em] text-[#1a2332] md:text-[3.25rem] lg:text-[3.75rem]">
              Find Your Perfect Home
            </h1>
          </div>

          <div className="mt-10 md:mt-12">
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_-12px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06]">
              <div className="flex border-b border-slate-100 bg-slate-50/80 px-3 pt-3 md:px-4 md:pt-4">
                <button
                  type="button"
                  onClick={() => setListingMode('buy')}
                  className={`rounded-t-lg px-5 py-2.5 text-[13px] font-semibold tracking-wide transition md:px-8 ${
                    listingMode === 'buy'
                      ? 'bg-[#31C950] text-white shadow-sm'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200/80'
                  }`}
                >
                  For Buy
                </button>
                <button
                  type="button"
                  onClick={() => setListingMode('rent')}
                  className={`ml-2 rounded-t-lg px-5 py-2.5 text-[13px] font-semibold tracking-wide transition md:px-8 ${
                    listingMode === 'rent'
                      ? 'bg-[#31C950] text-white shadow-sm'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200/80'
                  }`}
                >
                  For Rent
                </button>
              </div>

              <form
                className="flex flex-col gap-4 p-4 lg:flex-row lg:items-stretch lg:gap-0 lg:p-5"
                onSubmit={(e) => {
                  e.preventDefault()
                }}
              >
                <label className="flex min-h-[52px] flex-1 items-center gap-3 border-slate-200 px-2 lg:border-r lg:px-4">
                  <PinIcon className="h-5 w-5 shrink-0 text-[#31C950]" />
                  <input
                    type="search"
                    name="location"
                    placeholder="Entry Landmark Location"
                    className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    autoComplete="off"
                  />
                </label>

                <div className="hidden h-auto w-px bg-slate-200 lg:block" aria-hidden />

                <label className="relative flex min-h-[52px] flex-1 items-center border-slate-200 px-2 lg:border-r lg:px-4">
                  <select
                    name="propertyType"
                    defaultValue="all"
                    className="w-full cursor-pointer appearance-none rounded-lg border-0 bg-transparent py-2 pr-8 text-[14px] font-medium text-slate-800 focus:outline-none focus:ring-0"
                  >
                    <option value="all">All Properties</option>
                    <option value="plot">Plots</option>
                    <option value="house">Houses</option>
                    <option value="apartment">Apartments</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  <ChevronSelect className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#31C950]" />
                </label>

                <label className="relative flex min-h-[52px] flex-1 items-center border-slate-200 px-2 lg:border-r lg:px-4">
                  <select
                    name="rooms"
                    defaultValue="any"
                    className="w-full cursor-pointer appearance-none rounded-lg border-0 bg-transparent py-2 pr-8 text-[14px] font-medium text-slate-800 focus:outline-none focus:ring-0"
                  >
                    <option value="any">Room</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                  <ChevronSelect className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#31C950]" />
                </label>

                <label className="relative flex min-h-[52px] flex-1 items-center border-slate-200 px-2 lg:border-r lg:px-4">
                  <select
                    name="price"
                    defaultValue="any"
                    className="w-full cursor-pointer appearance-none rounded-lg border-0 bg-transparent py-2 pr-8 text-[14px] font-medium text-slate-800 focus:outline-none focus:ring-0"
                  >
                    <option value="any">Any price</option>
                    <option value="low">Under 10M</option>
                    <option value="mid">10M – 30M</option>
                    <option value="high">30M+</option>
                  </select>
                  <ChevronSelect className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#31C950]" />
                </label>

                <div className="flex items-stretch lg:min-w-[200px] lg:pl-2">
                  <Link
                    to="/properties"
                    className="flex w-full items-center justify-center rounded-xl bg-[#31C950] px-6 py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-[#28b048] lg:py-0"
                  >
                    Search Now
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div> */}
      </section>

      <section
        className="relative z-10 -mt-10 pb-8 pt-5 md:-mt-12 md:pb-10"
        aria-labelledby="amenities-carousel-heading"
      >
        <div className="container-shell">
          {/* <h2
            id="amenities-carousel-heading"
            className="mb-8 text-center text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl"
          >
            Amenities
          </h2> */}

          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <button
              type="button"
              onClick={() => setAmenitySlide((s) => Math.max(0, s - 1))}
              disabled={amenitySlide <= 0}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.04] transition hover:border-[#31C950]/80 hover:bg-[#31C950]/10 hover:text-[#31C950] disabled:pointer-events-none disabled:opacity-35"
              aria-label="Previous amenities"
            >
              <CarouselChevron direction="left" className="h-5 w-5" />
            </button>

            <div
              ref={amenityCarouselRef}
              className="min-w-0 flex-1 overflow-hidden"
            >
              <div
                className={
                  prefersReducedMotion
                    ? 'flex'
                    : 'flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                }
                style={{
                  gap: `${AMENITY_CAROUSEL_GAP_PX}px`,
                  transform: `translate3d(-${amenityTx}px, 0, 0)`,
                }}
              >
                {categoryCards.map((card) => {
                  const palette = AMENITY_CARD_ACCENTS[card.accent]
                  const cardBody = (
                    <>
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${palette.iconBg}`}
                      >
                        <CategoryIcon name={card.icon} iconClassName={palette.icon} />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#1a2332]">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
                    </>
                  )

                  return (
                    <article
                      key={card.title}
                      data-carousel-card
                      className="shrink-0"
                      style={{
                        width:
                          amenityCardWidth > 0 ? `${amenityCardWidth}px` : undefined,
                      }}
                    >
                      <div
                        className={`min-h-[288px] rounded-2xl p-6 ${palette.surface}`}
                      >
                        {cardBody}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAmenitySlide((s) => Math.min(amenityMaxSlide, s + 1))}
              disabled={amenitySlide >= amenityMaxSlide}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.04] transition hover:border-[#31C950]/80 hover:bg-[#31C950]/10 hover:text-[#31C950] disabled:pointer-events-none disabled:opacity-35"
              aria-label="Next amenities"
            >
              <CarouselChevron direction="right" className="h-5 w-5" />
            </button>
          </div>

          {/* <p className="mt-4 text-center text-xs text-slate-400" aria-live="polite">
            Showing {amenitySlide + 1}–{amenitySlide + amenityItemsVisible} of {categoryCards.length}
          </p> */}
        </div>
      </section>


      <section
        className="relative overflow-hidden border-t border-slate-100/80 bg-white pb-12 pt-9 md:pb-14 md:pt-10"
        aria-labelledby="guidance-heading"
      >
        <div className="pointer-events-none absolute -left-40 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#31C950]/[0.06] blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" aria-hidden />
        <div className="container-shell relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600/90 md:text-[13px]">
              Clarity &amp; confidence
            </p>
            <h2
              id="guidance-heading"
              className="mt-3 bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-600 bg-clip-text text-2xl font-semibold tracking-[-0.02em] text-transparent md:text-[1.85rem]"
            >
              Trusted Real Estate Guidance
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.75] text-slate-600 md:mt-6 md:text-lg md:leading-relaxed">
              We provide transparent, up-to-date guidance on residential plots, farmhouses, payment plans, and
              development updates. Our focus is on delivering accurate information and practical insights to help
              buyers and investors make confident, informed decisions.
            </p>
          </div>
        </div>
      </section>

      {homeFeaturedListings.length > 0 ? (
        <section className="border-t border-slate-100 bg-[#fafbfc] py-10 md:py-14" aria-labelledby="home-listings-heading">
          <div className="container-shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="home-listings-heading" className="text-xl font-bold tracking-[-0.02em] text-[#1a2332] md:text-2xl">
                  Latest listings
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-600 md:text-[15px]">
                  Fresh properties from our catalogue — open any card for full details, photos, and contact options.
                </p>
              </div>
              <Link
                to="/properties"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#31C950] transition hover:text-[#28b048]"
              >
                View all properties
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
              {homeFeaturedListings.map((p) => {
                const img = homeFeaturedImageUrl(p)
                return (
                  <Link
                    key={p.id}
                    to={`/properties/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#31C950]/35 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      {img ? (
                        <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">No photo</div>
                      )}
                      {p.is_featured ? (
                        <span className="absolute left-2 top-2 rounded bg-[#ef4444] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <p className="text-[13px] font-semibold tabular-nums text-[#1a3553]">{formatCompactPkr(p.price)}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-700 sm:text-[13px]">{p.title}</p>
                      {p.location ? (
                        <p className="mt-2 line-clamp-1 text-[11px] text-slate-500">{p.location}</p>
                      ) : null}
                      <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#31C950] group-hover:underline">
                        View listing
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}
      
      <section
        className="relative isolate min-h-[min(88vh,920px)] overflow-hidden"
        aria-labelledby="lake-heading"
      >
        <div className="absolute inset-0">
          <img
            src={lakeBg}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/55 to-emerald-950/40"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_100%,rgba(49,201,80,0.15),transparent_55%)] mix-blend-soft-light opacity-90"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]"
            aria-hidden
          />
        </div>

        <div className="container-shell relative flex min-h-[min(88vh,920px)] flex-col justify-center py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
              Signature waterfront
            </div>
            <h2
              id="lake-heading"
              className="mt-6 text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.35)] md:text-5xl md:leading-[1.08] lg:text-[3.15rem]"
            >
              Pakistan&rsquo;s Largest Man-Made Lake
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-[1.75] text-white/88 md:text-lg">
              At the center of Gulberg Islamabad sits its signature man-made lake, spread across 1,500 kanals.
              This waterfront combines scenic views with a modern lifestyle—leisure areas, wellness spaces, and
              peaceful lake-facing residences for a calm, refined living experience.
            </p>
            <div className="mt-10">
              <Link
                to="/properties"
                className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-white/95 bg-white/[0.07] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[box-shadow,background-color,border-color,color] duration-200 hover:border-[#31C950] hover:bg-[#31C950] hover:text-white hover:shadow-[0_20px_50px_-12px_rgba(49,201,80,0.55)]"
              >
                <span className="relative z-10">Get Started</span>
                <svg className="relative z-10 h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent opacity-90"
          aria-hidden
        />
      </section>


      

      <section
        className="relative border-t border-slate-100 bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%,#f9fafb_100%)] py-16 md:py-24"
        aria-label="Project highlights"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(49,201,80,0.06),transparent_50%)]" aria-hidden />
        <div className="container-shell relative">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#31C950] md:text-[13px]">
              Scale &amp; progress
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#1a2332] md:text-3xl">
              Built for long-term growth
            </h2>
            <p className="mt-3 text-sm text-slate-500 md:text-base">
              Infrastructure, inventory, and landmark projects—presented with clarity.
            </p>
          </div>

          <div className="flex flex-col gap-10 md:gap-14 lg:gap-16">
            {spotlightRows.map((row) => (
              <article
                key={row.id}
                className="group/card relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.03] transition-[box-shadow,border-color] duration-200 md:rounded-3xl hover:border-[#31C950]/30 hover:shadow-[0_32px_64px_-28px_rgba(15,23,42,0.14)]"
              >
                <div className="grid gap-0 md:grid-cols-2 md:items-stretch">
                  <div
                    className={`relative flex flex-col justify-center border-l-[3px] border-slate-100 p-8 pl-9 transition-[border-color] duration-300 ease-out group-hover/card:border-[#31C950] md:p-10 md:pl-11 lg:p-12 lg:pl-12 xl:p-14 xl:pl-14 ${
                      row.imageFirst ? 'md:order-2' : ''
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#31C950]/90">
                      {row.kicker}
                    </span>
                    <h3 className="mt-3 text-xl font-bold leading-tight tracking-[-0.02em] text-[#1a2332] md:text-2xl lg:text-[1.65rem]">
                      {row.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-[1.8] text-slate-600 md:text-base">{row.body}</p>
                    {row.cta ? (
                      <Link
                        to={row.cta.to}
                        className="group/cta relative mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#31C950] transition-colors hover:text-[#28b048]"
                      >
                        <span className="relative">
                          {row.cta.label}
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
                    ) : null}
                  </div>

                  <div
                    className={`relative min-h-[220px] overflow-hidden bg-slate-100 md:min-h-[320px] ${
                      row.imageFirst ? 'md:order-1' : ''
                    }`}
                  >
                    <div
                      className="absolute inset-0 z-[1] bg-gradient-to-br from-slate-900/10 via-transparent to-emerald-900/15 opacity-60"
                      aria-hidden
                    />
                    <div className="absolute inset-0 origin-center">
                      <img
                        src={row.image}
                        alt={row.imageAlt}
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-1/3 bg-gradient-to-t from-slate-950/25 to-transparent opacity-70 md:opacity-100"
                      aria-hidden
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-slate-100 bg-white py-12 md:py-16"
        aria-labelledby="registrations-heading"
      >
        <div className="container-shell mb-8 md:mb-10">
          <h2
            id="registrations-heading"
            className="mx-auto max-w-4xl text-center text-lg font-bold leading-snug tracking-[-0.02em] text-[#1a3553] sm:text-xl md:text-2xl"
          >
            Some Authentic Registrations of Gulberg Islamabad
          </h2>
        </div>

        <LogoMarquee logos={registrationLogos} />
      </section>

      <section
        className="border-t border-slate-100 bg-white py-12 md:py-16"
        aria-labelledby="brands-facilities-heading"
      >
        <div className="container-shell mb-8 md:mb-10">
          <h2
            id="brands-facilities-heading"
            className="mx-auto max-w-4xl text-center text-lg font-bold leading-snug tracking-[-0.02em] text-[#1a3553] sm:text-xl md:text-2xl"
          >
            Top Brands and Facilities
          </h2>
        </div>

        <LogoMarquee logos={topBrandsLogos} />
      </section>

      <section
        className="border-t border-slate-100 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] py-12 md:py-16"
        aria-labelledby="social-showcase-heading"
      >
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="social-showcase-heading" className="text-xl font-bold tracking-[-0.02em] text-[#1a3553] md:text-2xl">
              {homeSocialShowcase.heading}
            </h2>
            <p className="mt-3 text-sm text-slate-600 md:text-[15px]">{homeSocialShowcase.subheading}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeSocialShowcase.items.map((item) => {
              const externalHref =
                item.platform === 'google' ? homeSocialShowcase.googleReviewsUrl : item.href
              const hasEmbed = Boolean(item.embedSrc && item.embedSrc.trim())

              return (
                <div
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-black/[0.03]"
                >
                  {hasEmbed ? (
                    <div className="aspect-video w-full bg-slate-900">
                      <iframe
                        src={item.embedSrc}
                        title={item.title}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={externalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50 to-slate-100/80 px-4 text-center transition hover:from-[#31C950]/10 hover:to-sky-50"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1a3553] shadow-md ring-1 ring-slate-200/80">
                        <SocialPlatformGlyph platform={item.platform} className="h-7 w-7" />
                      </span>
                      <span className="text-sm font-semibold text-[#1a3553]">{item.title}</span>
                      <span className="text-xs text-slate-600">{item.subtitle}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#31C950]">
                        Open →
                      </span>
                    </a>
                  )}

                  {hasEmbed ? (
                    <a
                      href={externalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-t border-slate-100 px-4 py-3 text-center text-[12px] font-semibold text-[#31C950] hover:bg-slate-50"
                    >
                      View on {item.title}
                    </a>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 md:py-16" aria-labelledby="home-location-heading">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <h2 id="home-location-heading" className="text-xl font-bold tracking-[-0.02em] text-[#1a3553] md:text-2xl">
                Gulberg Greens — location
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                Visit the project on the map, get directions, and explore the surrounding access to Islamabad Expressway
                and key city routes.
              </p>
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#31C950]/40 bg-[#31C950]/10 px-5 py-2.5 text-sm font-semibold text-[#1a3553] transition hover:bg-[#31C950]/20"
              >
                Open in Google Maps
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg ring-1 ring-black/[0.04]">
              <iframe
                title="Gulberg Greens Islamabad on Google Maps"
                src={mapEmbedUrl}
                className="aspect-[4/3] min-h-[260px] w-full border-0 md:min-h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home

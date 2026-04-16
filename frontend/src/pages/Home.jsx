import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LogoMarquee from '../components/home/LogoMarquee.jsx'
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

function Home() {
  const amenityCarouselRef = useRef(null)
  const lakeRef = useRef(null)
  const guidanceRef = useRef(null)
  const spotlightRowRefs = useRef([])

  const [amenitySlide, setAmenitySlide] = useState(0)
  const [amenityItemsVisible, setAmenityItemsVisible] = useState(4)
  const [amenityTx, setAmenityTx] = useState(0)
  const [amenityCardWidth, setAmenityCardWidth] = useState(0)
  const [lakeVisible, setLakeVisible] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [guidanceVisible, setGuidanceVisible] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [spotlightRowsVisible, setSpotlightRowsVisible] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? [true, true, true]
      : [false, false, false],
  )

  const amenityMaxSlide = Math.max(0, categoryCards.length - amenityItemsVisible)

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (entry.target === lakeRef.current) setLakeVisible(true)
          if (entry.target === guidanceRef.current) setGuidanceVisible(true)
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )

    const lakeNode = lakeRef.current
    const guideNode = guidanceRef.current
    if (lakeNode) observer.observe(lakeNode)
    if (guideNode) observer.observe(guideNode)

    return () => {
      if (lakeNode) observer.unobserve(lakeNode)
      if (guideNode) observer.unobserve(guideNode)
      observer.disconnect()
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const idx = spotlightRowRefs.current.indexOf(entry.target)
          if (idx === -1) continue
          setSpotlightRowsVisible((prev) => {
            if (prev[idx]) return prev
            const next = [...prev]
            next[idx] = true
            return next
          })
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -7% 0px' },
    )

    const rowNodes = spotlightRowRefs.current.filter(Boolean)

    rowNodes.forEach((node) => {
      observer.observe(node)
    })

    return () => {
      rowNodes.forEach((node) => {
        observer.unobserve(node)
      })
      observer.disconnect()
    }
  }, [prefersReducedMotion])

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
                  const faceClasses = `flex h-full flex-col rounded-2xl p-6 ${palette.surface} [backface-visibility:hidden] [-webkit-backface-visibility:hidden]`
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
                      {prefersReducedMotion ? (
                        <div
                          className={`h-full rounded-2xl p-6 transition hover:-translate-y-0.5 ${palette.surface}`}
                        >
                          {cardBody}
                        </div>
                      ) : (
                        <div
                          tabIndex={0}
                          role="group"
                          aria-label={card.title}
                          className="group relative min-h-[288px] w-full cursor-default rounded-2xl outline-none [perspective:1200px] focus-visible:ring-2 focus-visible:ring-[#31C950]/70 focus-visible:ring-offset-2"
                        >
                          <div
                            className="relative min-h-[288px] w-full origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]"
                          >
                            <div className={`absolute inset-0 ${faceClasses}`}>{cardBody}</div>
                            <div
                              className={`absolute inset-0 ${faceClasses} [transform:rotateY(180deg)]`}
                              aria-hidden
                            >
                              {cardBody}
                            </div>
                          </div>
                        </div>
                      )}
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
        ref={guidanceRef}
        className="relative overflow-hidden border-t border-slate-100/80 bg-white pb-12 pt-9 md:pb-14 md:pt-10"
        aria-labelledby="guidance-heading"
      >
        <div
          className="pointer-events-none absolute -left-40 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#31C950]/[0.06] blur-3xl motion-reduce:opacity-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl motion-reduce:opacity-0"
          aria-hidden
        />
        <div className="container-shell relative">
          <div
            className={`mx-auto max-w-2xl text-center motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
              guidanceVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            } transition-[opacity,transform] duration-[850ms] motion-reduce:transition-none`}
            style={{
              transitionDelay: guidanceVisible && !prefersReducedMotion ? '80ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
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
      
      <section
        ref={lakeRef}
        className="relative isolate min-h-[min(88vh,920px)] overflow-hidden"
        aria-labelledby="lake-heading"
      >
        <div className="absolute inset-0">
          <img
            src={lakeBg}
            alt=""
            className={`h-full w-full object-cover object-center will-change-transform ${
              lakeVisible && !prefersReducedMotion ? 'lake-ken-burns-active' : ''
            }`}
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
            <div
              className={`inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                lakeVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              } motion-reduce:transition-none`}
              style={{
                transitionDelay: lakeVisible && !prefersReducedMotion ? '0ms' : '0ms',
                transitionProperty: 'opacity, transform',
                transitionDuration: '800ms',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              Signature waterfront
            </div>
            <h2
              id="lake-heading"
              className={`mt-6 text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.35)] md:text-5xl md:leading-[1.08] lg:text-[3.15rem] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                lakeVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } motion-reduce:transition-none`}
              style={{
                transitionDelay: lakeVisible && !prefersReducedMotion ? '90ms' : '0ms',
                transitionProperty: 'opacity, transform',
                transitionDuration: '900ms',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              Pakistan&rsquo;s Largest Man-Made Lake
            </h2>
            <p
              className={`mt-6 max-w-2xl text-base leading-[1.75] text-white/88 md:text-lg motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                lakeVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } motion-reduce:transition-none`}
              style={{
                transitionDelay: lakeVisible && !prefersReducedMotion ? '200ms' : '0ms',
                transitionProperty: 'opacity, transform',
                transitionDuration: '900ms',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              At the center of Gulberg Islamabad sits its signature man-made lake, spread across 1,500 kanals.
              This waterfront combines scenic views with a modern lifestyle—leisure areas, wellness spaces, and
              peaceful lake-facing residences for a calm, refined living experience.
            </p>
            <div
              className={`mt-10 motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                lakeVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } motion-reduce:transition-none`}
              style={{
                transitionDelay: lakeVisible && !prefersReducedMotion ? '320ms' : '0ms',
                transitionProperty: 'opacity, transform',
                transitionDuration: '900ms',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <Link
                to="/properties"
                className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-white/95 bg-white/[0.07] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out hover:-translate-y-1 hover:border-[#31C950] hover:bg-[#31C950] hover:text-white hover:shadow-[0_20px_50px_-12px_rgba(49,201,80,0.55)] motion-reduce:hover:translate-y-0"
              >
                <span className="relative z-10">Get Started</span>
                <svg
                  className="relative z-10 h-4 w-4 transition-transform duration-300 ease-out group-hover/btn:translate-x-1.5"
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
            {spotlightRows.map((row, index) => (
              <article
                key={row.id}
                ref={(el) => {
                  spotlightRowRefs.current[index] = el
                }}
                className={`group/card relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.03] transition-[opacity,transform,box-shadow,border-color] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 md:rounded-3xl ${
                  spotlightRowsVisible[index]
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-14 opacity-0'
                } hover:border-[#31C950]/30 hover:shadow-[0_32px_64px_-28px_rgba(15,23,42,0.14)] motion-reduce:transition-none`}
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
                      className="absolute inset-0 z-[1] bg-gradient-to-br from-slate-900/10 via-transparent to-emerald-900/15 opacity-60 transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:opacity-40 motion-reduce:transition-none"
                      aria-hidden
                    />
                    <div
                      className="absolute inset-0 origin-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [transform:translate3d(0,0,0)] group-hover/card:scale-[1.045] motion-reduce:group-hover/card:scale-100"
                    >
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

    </div>
  )
}

export default Home

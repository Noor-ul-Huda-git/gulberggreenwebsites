'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import LogoMarquee from './LogoMarquee.jsx'
import HomePageSchema from '../seo/HomePageSchema.jsx'
import { fontVariables } from '../../lib/fonts.js'
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

import {
  contactInfo,
  homeFaqItems,
  mapEmbedUrl,
} from '../../data/siteContent.js'
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

const DEFAULT_WA_MESSAGE =
  'Assalam o Alaikum, I would like more information about Gulberg Greens Islamabad.'

function whatsAppContactHref(message = DEFAULT_WA_MESSAGE) {
  let d = String(contactInfo.phone || '').replace(/\D/g, '')

  if (d.startsWith('0')) d = d.slice(1)
  if (!d.startsWith('92') && d.length === 10) d = `92${d}`

  return `https://wa.me/${d}?text=${encodeURIComponent(message)}`
}

const TEL_HREF = `tel:${String(contactInfo.phone || '').replace(/[^\d+]/g, '')}`

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

/** Hero ke neeche wali stats strip (hero ke text se li gayi figures). */
const HOME_STATS = [
  { value: '9,000+', label: 'acres on Gulberg Expressway' },
  { value: '2005', label: 'developed by IBECHS since' },
  { value: '1,500', label: 'kanal residential lake' },
  { value: '~80%', label: 'green spaces' },
  { value: '70%+', label: 'fully developed (2026)' },
]

const HOME_SOCIAL_LINKS = [
  { label: 'Facebook', short: 'f', href: 'https://www.facebook.com/share/18n263NYvD/' },
  {
    label: 'Instagram',
    short: '◎',
    href: 'https://www.instagram.com/gulberggreens.ibechs?stkn=MWlwcGQ1aXhlYW10NA==',
  },
  {
    label: 'TikTok',
    short: '♪',
    href: 'https://www.tiktok.com/@gulberggreensibechs?is_from_webapp=1&sender_device=pc',
  },
  { label: 'X', short: 'X', href: 'https://x.com/gulberg_ibechs?s=20' },
]

/* =========================================================
 * EXPLORE SECTION (footer se upar) — sara content yahan hai.
 * Koi link badalna, hatana ya add karna ho to sirf
 * neeche ki lists mein { label, href } edit karein.
 * ========================================================= */

const HOME_EXPLORE_COLUMNS = [
  {
    title: 'Plots for Sale',
    href: '/properties/plots/',
    links: [
      { label: '5 Marla Plot', href: '/properties/plots/5-marla/' },
      { label: '7 Marla Plot', href: '/properties/plots/7-marla/' },
      { label: '10 Marla Plot', href: '/properties/plots/10-marla/' },
      { label: '12 Marla Plot', href: '/properties/plots/12-marla/' },
      { label: '1 Kanal Plot', href: '/properties/plots/1-kanal/' },
      { label: '2 Kanal Plot', href: '/properties/plots/2-kanal/' },
    ],
  },
  {
    title: 'Houses for Sale',
    href: '/properties/house/',
    links: [
      { label: '5 Marla House', href: '/properties/house/5-marla/' },
      { label: '7 Marla House', href: '/properties/house/7-marla/' },
      { label: '10 Marla House', href: '/properties/house/10-marla/' },
      { label: '12 Marla House', href: '/properties/house/12-marla/' },
      { label: '1 Kanal House', href: '/properties/house/1-kanal/' },
    ],
  },
  {
    title: 'Farmhouses for Sale',
    href: '/properties/farm-house/',
    oneColumn: true,
    links: [
      { label: '4 Kanal Farmhouse', href: '/properties/farm-house/4-kanal/' },
      { label: '5 Kanal Farmhouse', href: '/properties/farm-house/5-kanal/' },
      { label: '10 Kanal Farmhouse', href: '/properties/farm-house/10-kanal/' },
    ],
  },
]

/** Residential blocks slider: ek page par kitne blocks. */
const BLOCKS_PER_PAGE = 10

/* ---------------- icons (design ke mutabiq) ---------------- */

const ICON_PATHS = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  pin: (
    <>
      <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  road: <path d="M8 3 5 21M16 3l3 18M12 4v3M12 10v3M12 16v3" />,
  camera: (
    <>
      <path d="M3 7h3l2-3h8l2 3h3v12H3Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  map: (
    <>
      <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7Z" />
      <path d="M9 4v13M15 7v13" />
    </>
  ),
  tree: (
    <>
      <path d="M12 3c3 0 5 2.4 5 5.2 1.8.6 3 2.2 3 4.1 0 2.4-2 4.2-4.4 4.2H8.4C6 16.5 4 14.7 4 12.3c0-1.9 1.2-3.5 3-4.1C7 5.4 9 3 12 3Z" />
      <path d="M12 10v11" />
    </>
  ),
  chat: (
    <>
      <path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12Z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
}

function Icon({ name, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.2a9.7 9.7 0 0 0-8.3 14.8L2.4 21.6l4.8-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.2-.4-.3Z"
      />
    </svg>
  )
}

function PlayIcon() {
  return (
    <span className="gg-play" aria-hidden>
      <i>
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      </i>
    </span>
  )
}

const TRUST_ICON = {
  shield: 'shield',
  connectivity: 'road',
  quality: 'camera',
  leaf: 'leaf',
}

const VISIT_LINE_ICONS = ['pin', 'clock', 'phone', 'mail']

/* ---------------- helpers (pehle wale, waise hi) ---------------- */

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

  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0].url) {
    return p.images[0].url
  }

  return null
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

  const suffix = Number(displayValue) === 1 || unit.endsWith('s') ? '' : 's'

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

function formatPostDate(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
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

function MoreLink({ to, label }) {
  return (
    <Link href={to} className="gg-more">
      {label}
      <Icon name="arrow" />
    </Link>
  )
}

function SliderArrows({ label, onPrev, onNext, disabledPrev, disabledNext }) {
  return (
    <div className="gg-snav">
      <button
        type="button"
        className="gg-prev"
        aria-label={`Previous ${label}`}
        onClick={onPrev}
        disabled={disabledPrev}
      >
        <Icon name="arrow" />
      </button>
      <button
        type="button"
        className="gg-next"
        aria-label={`Next ${label}`}
        onClick={onNext}
        disabled={disabledNext}
      >
        <Icon name="arrow" />
      </button>
    </div>
  )
}

function SliderDots({ count, active, className = '' }) {
  if (count < 2) return null

  return (
    <div className={`gg-dots ${className}`.trim()} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} className={i === active ? 'gg-on' : undefined} />
      ))}
    </div>
  )
}

/** Gol (looping) slider ka index — YouTube aur Latest Updates dono ke liye. */
function useLoopIndex(count) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= count) setIndex(0)
  }, [count, index])

  const prev = useCallback(
    () => setIndex((i) => (count ? (i - 1 + count) % count : 0)),
    [count]
  )
  const next = useCallback(
    () => setIndex((i) => (count ? (i + 1) % count : 0)),
    [count]
  )

  return [Math.min(index, Math.max(0, count - 1)), setIndex, prev, next]
}

/** Featured item ke baad wale (zyada se zyada 3) items — left side ke chhote cards. */
function sideItems(items, index) {
  const n = items.length
  const out = []

  for (let k = 1; k <= Math.min(3, n - 1); k += 1) {
    const j = (index + k) % n
    out.push({ item: items[j], index: j })
  }

  return out
}

/* ---------------- YouTube: 3 chhote left + 1 bara right ---------------- */

function VideoSplit({ videos, index, onSelect }) {
  const [playingId, setPlayingId] = useState(null)
  const featured = videos[index]

  // Slide badle to chalti video band ho jaye
  useEffect(() => {
    setPlayingId(null)
  }, [index])

  if (!featured) return null

  const isPlaying = playingId === featured.id

  return (
    <div className="gg-split">
      <div className="gg-side">
        {sideItems(videos, index).map(({ item, index: j }) => (
          <button
            key={item.id}
            type="button"
            className="gg-mini"
            onClick={() => onSelect(j)}
          >
            <span className="gg-mini-ph">
              <img
                src={`https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`}
                alt=""
                className="gg-cover"
                loading="lazy"
                decoding="async"
                width={320}
                height={180}
              />
              <PlayIcon />
            </span>
            <span>
              <b>{item.title}</b>
            </span>
          </button>
        ))}
      </div>

      {isPlaying ? (
        <div className="gg-feat gg-feat-video">
          <iframe
            title={featured.title}
            src={`https://www.youtube-nocookie.com/embed/${featured.id}?rel=0&autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          type="button"
          className="gg-feat"
          onClick={() => setPlayingId(featured.id)}
          aria-label={`Play video: ${featured.title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${featured.id}/hqdefault.jpg`}
            alt=""
            className="gg-cover"
            loading="lazy"
            decoding="async"
            width={480}
            height={360}
          />
          <PlayIcon />
          <span className="gg-feat-t">
            <span className="gg-date">YouTube · Gulberg Greens Islamabad</span>
            <span className="gg-feat-title">{featured.title}</span>
          </span>
        </button>
      )}
    </div>
  )
}

/* ---------------- Latest updates: 3 chhote left + 1 bara right ---------------- */

function PostSplit({ posts, index, onSelect }) {
  const featured = posts[index]

  if (!featured) return null

  return (
    <div className="gg-split">
      <div className="gg-side">
        {sideItems(posts, index).map(({ item, index: j }) => (
          <button
            key={item.slug}
            type="button"
            className="gg-mini"
            onClick={() => onSelect(j)}
          >
            <span className="gg-mini-ph">
              {item.primary_image ? (
                <img
                  src={item.primary_image}
                  alt=""
                  className="gg-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
            </span>
            <span>
              {item.published_at ? (
                <span className="gg-date">{formatPostDate(item.published_at)}</span>
              ) : null}
              <b>{item.title}</b>
            </span>
          </button>
        ))}
      </div>

      <Link href={`/latest-updates/${featured.slug}/`} className="gg-feat">
        {featured.primary_image ? (
          <img
            src={featured.primary_image}
            alt=""
            className="gg-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <span className="gg-feat-t">
          {featured.published_at ? (
            <span className="gg-date">{formatPostDate(featured.published_at)}</span>
          ) : null}
          <h3>{featured.title}</h3>
        </span>
      </Link>
    </div>
  )
}

/* ---------------- Residential blocks slider (10 per page) ---------------- */

function chunk(list, size) {
  const pages = []

  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size))
  }

  return pages
}

function BlockChips({ links }) {
  return links.map((link) => (
    <Link
      key={link.to}
      href={link.to}
      className={link.label.length > 8 ? 'gg-wide' : undefined}
    >
      {link.label}
    </Link>
  ))
}

function ResidentialBlocksCard() {
  const trackRef = useRef(null)
  const [page, setPage] = useState(0)
  const pages = chunk(HOME_BLOCKS.residential.links, BLOCKS_PER_PAGE)

  useEffect(() => {
    const track = trackRef.current

    if (!track) return undefined

    let timer = 0

    const onScroll = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        const w = track.clientWidth || 1
        setPage(Math.round(track.scrollLeft / w))
      }, 80)
    }

    track.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.clearTimeout(timer)
      track.removeEventListener('scroll', onScroll)
    }
  }, [])

  const goTo = (p) => {
    const track = trackRef.current

    if (!track) return

    const target = Math.max(0, Math.min(pages.length - 1, p))
    track.scrollTo({ left: target * track.clientWidth })
    setPage(target)
  }

  return (
    <div className="gg-bcard">
      <div className="gg-bcard-top">
        <span className="gg-bcard-ic">
          <Icon name="map" />
        </span>
        <h3>{HOME_BLOCKS.residential.h3}</h3>
        {pages.length > 1 ? (
          <SliderArrows
            label="blocks"
            onPrev={() => goTo(page - 1)}
            onNext={() => goTo(page + 1)}
            disabledPrev={page <= 0}
            disabledNext={page >= pages.length - 1}
          />
        ) : null}
      </div>

      <p>{HOME_BLOCKS.residential.body}</p>

      {/* Saare block links HTML mein hain (Google sab follow kare); slider sirf dikhata hai */}
      <nav aria-label="Residential plot blocks">
        <div ref={trackRef} className="gg-btrack">
          {pages.map((links, i) => (
            <div key={i} className="gg-bpage gg-bchips">
              <BlockChips links={links} />
            </div>
          ))}
        </div>
      </nav>

      <SliderDots count={pages.length} active={page} className="gg-bdots" />
    </div>
  )
}

/* ---------------- Explore column ---------------- */

/*
 * SEO notes:
 * - Saare links page ke HTML mein shuru se hain ("Show more" ke peeche
 *   chhupe nahi), taake Google har link dekhe aur follow kare.
 * - Column ka naam heading tag (h3) nahi, sirf link hai. Is tarah
 *   "Plots for Sale" jaise keywords homepage ki headings nahi bante,
 *   aur ranking asal pages (/properties/plots/ waghera) ko milti hai.
 */
function HomeExploreColumn({ column }) {
  return (
    <div className={`gg-ecol ${column.oneColumn ? 'gg-ecol-one' : ''}`.trim()}>
      <p className="gg-ecol-title">
        {column.href ? <Link href={column.href}>{column.title}</Link> : column.title}
      </p>

      <ul className="gg-elinks">
        {column.links.map((link) => (
          <li key={`${link.href}-${link.label}`} className="min-w-0">
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------- Mobile: Call + WhatsApp toggle ---------------- */

function ContactDial() {
  const [open, setOpen] = useState(false)
  const dialRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onDocClick = (e) => {
      if (dialRef.current && !dialRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={dialRef} className={`gg-dial ${open ? 'gg-open' : ''}`.trim()}>
      <div className="gg-dial-acts" id="gg-dial-actions">
        <a
          className="gg-dact gg-dact-call"
          href={TEL_HREF}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          <span className="gg-dact-lbl">Call now</span>
          <span className="gg-dact-ico">
            <Icon name="phone" />
          </span>
        </a>
        <a
          className="gg-dact gg-dact-wa"
          href={whatsAppContactHref()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          <span className="gg-dact-lbl">WhatsApp</span>
          <span className="gg-dact-ico">
            <WhatsAppIcon />
          </span>
        </a>
      </div>

      <button
        type="button"
        className="gg-dial-btn"
        aria-expanded={open}
        aria-controls="gg-dial-actions"
        aria-label="Contact us: call or WhatsApp"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="chat" className="gg-i-open" />
        <Icon name="close" className="gg-i-close" />
      </button>
    </div>
  )
}

/* ========================================================= */

function Home({ initialFeaturedListings = [], initialNewsPosts = [] }) {
  const [faqOpenIndex, setFaqOpenIndex] = useState(0)
  const [homeFeaturedListings] = useState(
    Array.isArray(initialFeaturedListings) ? initialFeaturedListings : []
  )
  const [showDeferredSections, setShowDeferredSections] = useState(false)
  const [homeNewsPosts] = useState(
    Array.isArray(initialNewsPosts) ? initialNewsPosts : []
  )
  const [homeYoutubeVideos, setHomeYoutubeVideos] = useState([])
  const [showMap, setShowMap] = useState(false)

  const [videoIndex, setVideoIndex, prevVideo, nextVideo] = useLoopIndex(
    homeYoutubeVideos.length
  )
  const [postIndex, setPostIndex, prevPost, nextPost] = useLoopIndex(
    homeNewsPosts.length
  )

  useEffect(() => {
    let cancelled = false

    const loadYoutubeVideos = async () => {
      try {
        const response = await fetch('/api/youtube/videos/')

        if (!response.ok) {
          throw new Error('Unable to load YouTube videos')
        }

        const data = await response.json()

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.results)
              ? data.results
              : Array.isArray(data?.videos)
                ? data.videos
                : []
        const videos = items
          .map((item) => {
            const videoUrl = item?.link || item?.url || ''
            const id =
              item?.id?.videoId ||
              item?.video_id ||
              item?.videoId ||
              item?.id ||
              item?.guid?.split(':').pop() ||
              (() => {
                try {
                  return new URL(videoUrl).searchParams.get('v')
                } catch {
                  return null
                }
              })()

            return {
              id: typeof id === 'string' ? id : '',
              title: item?.title || 'Gulberg Greens Islamabad',
              publishedAt:
                item?.publishedAt || item?.published_at || item?.pubDate || '',
            }
          })
          .filter((video) => video.id && !video.id.includes('/'))
          .slice(0, 6)

        if (!cancelled) {
          setHomeYoutubeVideos(videos)
        }
      } catch (error) {
        console.error('YouTube videos load failed:', error)

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

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hash === '#home-faq-heading'
    ) {
      setShowDeferredSections(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    let cancelled = false

    const reveal = () => {
      if (!cancelled) {
        setShowDeferredSections(true)
      }
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

  const [heroLead, heroAccent] = HOME_HERO.h1.split(' — ')
  const faqHalf = Math.ceil(homeFaqItems.length / 2)
  const faqColumns = [homeFaqItems.slice(0, faqHalf), homeFaqItems.slice(faqHalf)]

  return (
    <div className={`gg-home ${fontVariables}`}>
      <HomePageSchema listings={homeFeaturedListings} />

      {/* WhatsApp button isi zone ke andar sticky hai — footer se pehle ruk jata hai */}
      <div className="gg-wa-zone">
        <div className="gg-wa-rail">
          <a
            className="gg-wa-float"
            href={whatsAppContactHref()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* SECTION 1 — HERO */}
        <section className="gg-hero gg-on-dark">
          <SeoImage image={HOME_HERO.image} priority className="gg-cover" />
          <div className="gg-hero-shade" aria-hidden />

          <div className="gg-wrap">
            <span className="gg-eyebrow">
              Gulberg Expressway · Islamabad
            </span>

            <h1>
              {heroAccent ? (
                <>
                  {heroLead} — <em>{heroAccent}</em>
                </>
              ) : (
                HOME_HERO.h1
              )}
            </h1>

            <p>{HOME_HERO.body}</p>

                        <div className="gg-hero-cta">
              <Link href={HOME_LISTINGS.cta.to} className="gg-btn gg-btn-emerald">
                {HOME_LISTINGS.cta.label}
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </section>

        <div className="gg-stats">
          <div className="gg-wrap">
            <div className="gg-stats-in">
              {HOME_STATS.map((stat) => (
                <div key={stat.label} className="gg-stat">
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2 — LATEST LISTINGS */}
        {homeFeaturedListings.length > 0 ? (
          <section aria-labelledby="home-listings-heading">
            <div className="gg-wrap">
              <div className="gg-sh">
                <div>
                  <span className="gg-eyebrow">Listings</span>
                  <h2 id="home-listings-heading">{HOME_LISTINGS.h2}</h2>
                  <p>{HOME_LISTINGS.body}</p>
                </div>
                <MoreLink to={HOME_LISTINGS.cta.to} label={HOME_LISTINGS.cta.label} />
              </div>

              <div className="gg-cards">
                {homeFeaturedListings.map((p) => {
                  const fullImg = homeFeaturedFullImageUrl(p)
                  const mobileImg = p.card_image_url
                  const propertyHref = propertyDetailPath(p)
                  const area = homeListingArea(p)
                  const imageCount =
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images.length
                      : fullImg
                        ? 1
                        : 0
                  const location =
                    p.location ||
                    (p.block ? `Gulberg Greens - Block ${p.block}` : 'Gulberg Greens')

                  return (
                    <article key={p.id} className="gg-pc">
                      <Link
                        href={propertyHref}
                        className="gg-pc-ph"
                        aria-label={`View ${p.title}`}
                      >
                        {fullImg ? (
                          mobileImg ? (
                            <picture>
                              <source
                                media={MOBILE_IMAGE_MEDIA}
                                srcSet={mobileImg}
                                type="image/webp"
                              />
                              <img
                                src={fullImg}
                                alt=""
                                className="gg-cover"
                                loading="lazy"
                                decoding="async"
                                width={640}
                                height={400}
                              />
                            </picture>
                          ) : (
                            <img
                              src={fullImg}
                              alt=""
                              className="gg-cover"
                              loading="lazy"
                              decoding="async"
                              width={640}
                              height={400}
                            />
                          )
                        ) : (
                          <span className="gg-pc-none">No photo</span>
                        )}

                        {p.is_featured ? <span className="gg-tag">Featured</span> : null}

                        {imageCount ? (
                          <span className="gg-cnt">
                            <Icon name="camera" className="h-3.5 w-3.5" />
                            {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
                          </span>
                        ) : null}
                      </Link>

                      <div className="gg-pc-bd">
                        <div className="gg-price">{formatCompactPkr(p.price)}</div>

                        <h3>
                          <Link href={propertyHref}>{p.title}</Link>
                        </h3>

                        <div className="gg-loc">
                          <Icon name="pin" />
                          <span>{location}</span>
                        </div>

                        <div className="gg-facts">
                          {p.listing_type_display ? <span>{p.listing_type_display}</span> : null}
                          {p.block ? <span>Block {p.block}</span> : null}
                          {area ? <span>{area}</span> : null}
                        </div>

                        <div className="gg-acts">
                          <a
                            href={homeListingWhatsAppHref(p, propertyHref, fullImg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gg-btn gg-btn-wa"
                            aria-label={`WhatsApp about ${p.title}`}
                          >
                            <WhatsAppIcon />
                            WhatsApp
                          </a>
                          <a
                            href={TEL_HREF}
                            className="gg-btn gg-btn-forest"
                            aria-label={`Call about ${p.title}`}
                          >
                            <Icon name="phone" />
                            Call
                          </a>
                          <Link
                            href={propertyHref}
                            className="gg-btn gg-btn-line gg-det"
                            aria-label={`Details: ${p.title}`}
                          >
                            <Icon name="arrow" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}

                <Link href={HOME_LISTINGS.cta.to} className="gg-pc gg-pc-cta gg-on-dark">
                  <span className="gg-eyebrow">All blocks</span>
                  <b>Browse all properties</b>
                  <p>Plots, houses, farmhouses, apartments and commercial properties.</p>
                  <span className="gg-btn gg-btn-emerald" style={{ alignSelf: 'flex-start' }}>
                    {HOME_LISTINGS.cta.label}
                    <Icon name="arrow" />
                  </span>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* SECTION 3 — WHY / TRUST FEATURES */}
        <section className="gg-why" aria-labelledby="trust-features-heading">
          <div className="gg-wrap">
            <div className="gg-sh gg-center">
              <div className="gg-center">
                <span className="gg-eyebrow">Why us</span>
                <h2 id="trust-features-heading">{HOME_TRUST_FEATURES.h2}</h2>
              </div>
            </div>

            <div className="gg-why-grid">
              {HOME_TRUST_FEATURES.items.map((card) => (
                <article key={card.id} className="gg-wcard">
                  <span className="gg-wcard-ic">
                    <Icon name={TRUST_ICON[card.icon] || 'shield'} />
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — OFFICIAL PLATFORM */}
        <section aria-labelledby="platform-heading">
          <div className="gg-wrap">
            <div className="gg-platform gg-on-dark">
              <div className="gg-art">
                <SeoImage
                  image={HOME_PLATFORM_HUB.image}
                  mobileSizes="100vw"
                  className="gg-cover"
                />
                <div className="gg-badge">
                  <b>FTN Marketing</b>
                  <span>Sales &amp; marketing platform for Gulberg Greens Islamabad</span>
                </div>
              </div>

              <div className="gg-txt">
                <span className="gg-eyebrow">About this platform</span>
                <h2 id="platform-heading">{HOME_PLATFORM_HUB.h2}</h2>
                <p>{HOME_PLATFORM_HUB.body}</p>

                <nav className="gg-pills" aria-label="Property categories">
                  {HOME_PLATFORM_HUB.links.map((link) => (
                    <Link key={link.to} href={link.to}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — LAKE */}
        <section className="gg-lake gg-on-dark" aria-labelledby="lake-heading">
          <SeoImage image={HOME_LAKE.image} className="gg-cover" />
          <div className="gg-lake-shade" aria-hidden />

          <div className="gg-wrap">
            <div className="gg-lake-box">
              <span className="gg-eyebrow">Signature feature</span>
              <h2 id="lake-heading">{HOME_LAKE.h2}</h2>
              <p>{HOME_LAKE.body}</p>
              <div className="gg-chips">
                <span>Block A</span>
                <span>Block B</span>
                <span>Executive Block</span>
              </div>
            </div>
          </div>
        </section>

        {showDeferredSections ? (
          <>
            {/* SECTION 6 — DEVELOPMENT STATUS */}
            <section className="gg-lazy" aria-labelledby="development-heading">
              <div className="gg-wrap">
                <div className="gg-dev">
                  <div className="gg-pic">
                    <SeoImage image={HOME_DEVELOPMENT.image} className="gg-cover" />
                    <div className="gg-ov">
                      <b>70%+</b>
                      <span>developed</span>
                    </div>
                  </div>

                  <div className="gg-dev-body">
                    <span className="gg-eyebrow">Progress</span>
                    <h2 id="development-heading">{HOME_DEVELOPMENT.h2}</h2>

                    <div className="gg-blk">
                      <h3>{HOME_DEVELOPMENT.current.h3}</h3>
                      <div className="gg-bar" role="img" aria-label="Over 70% developed">
                        <i />
                      </div>
                      <p>{HOME_DEVELOPMENT.current.body}</p>
                    </div>

                    <div className="gg-blk">
                      <h3>{HOME_DEVELOPMENT.upcoming.h3}</h3>
                      <p>{HOME_DEVELOPMENT.upcoming.body}</p>
                    </div>

                    <MoreLink
                      to={HOME_DEVELOPMENT.cta.to}
                      label={HOME_DEVELOPMENT.cta.label}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 7 — BLOCKS */}
            <section className="gg-blocks gg-lazy" aria-labelledby="blocks-heading">
              <div className="gg-wrap">
                <div className="gg-sh">
                  <div>
                    <span className="gg-eyebrow">Blocks</span>
                    <h2 id="blocks-heading">{HOME_BLOCKS.h2}</h2>
                    <p>{HOME_BLOCKS.intro}</p>
                  </div>
                </div>

                <div className="gg-bgrid">
                  <ResidentialBlocksCard />

                  <div className="gg-bcard">
                    <div className="gg-bcard-top">
                      <span className="gg-bcard-ic">
                        <Icon name="tree" />
                      </span>
                      <h3>{HOME_BLOCKS.farmhouse.h3}</h3>
                    </div>

                    <p>{HOME_BLOCKS.farmhouse.body}</p>

                    <nav className="gg-bchips" aria-label="Farmhouse blocks">
                      <BlockChips links={HOME_BLOCKS.farmhouse.links} />
                    </nav>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 8 — INVESTMENT */}
            <section className="gg-lazy" aria-labelledby="investment-heading">
              <div className="gg-wrap">
                <div className="gg-inv">
                  <div className="gg-pic">
                    <SeoImage image={HOME_INVESTMENT.image} className="gg-cover" />
                  </div>

                  <div className="gg-txt">
                    <span className="gg-eyebrow">Investment</span>
                    <h2 id="investment-heading">{HOME_INVESTMENT.h2}</h2>

                    <div className="gg-inv-cols">
                      <p>{HOME_INVESTMENT.body}</p>

                      <div className="gg-plan">
                        <h3>{HOME_INVESTMENT.installment.h3}</h3>
                        <p>{HOME_INVESTMENT.installment.body}</p>
                        {HOME_INVESTMENT.installment.badges?.length ? (
                          <ul>
                            {HOME_INVESTMENT.installment.badges.map((badge) => (
                              <li key={badge}>{badge}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>

                    <Link
                      href={HOME_INVESTMENT.cta.to}
                      className="gg-btn gg-btn-forest"
                      style={{ alignSelf: 'flex-start' }}
                    >
                      {HOME_INVESTMENT.cta.label}
                      <Icon name="arrow" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 9 — LIFESTYLE */}
            <section
              className="gg-lazy"
              style={{ paddingTop: 20 }}
              aria-labelledby="lifestyle-heading"
            >
              <div className="gg-wrap gg-center">
                <span className="gg-eyebrow">Lifestyle</span>
                <h2
                  id="lifestyle-heading"
                  style={{ fontSize: 30, color: 'var(--gg-forest)', marginTop: 8 }}
                >
                  {HOME_LIFESTYLE.h2}
                </h2>
                <p className="gg-lead">{HOME_LIFESTYLE.body}</p>

                <div className="gg-mq">
                  <LogoMarquee
                    logos={topBrandsLogos}
                    label="Brands and institutions in Gulberg Greens"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 10 — APPROVALS (strip ulti direction mein) */}
            <section
              className="gg-lazy"
              style={{ paddingTop: 8 }}
              aria-labelledby="registrations-heading"
            >
              <div className="gg-wrap gg-center">
                <h2
                  id="registrations-heading"
                  style={{ fontSize: 22, color: 'var(--gg-forest)', maxWidth: '40ch' }}
                >
                  {HOME_APPROVALS.h2}
                </h2>
                <p className="gg-lead" style={{ maxWidth: '66ch' }}>
                  {HOME_APPROVALS.body}
                </p>
                <p className="gg-approvals-title">{HOME_APPROVALS.marqueeTitle}</p>

                <div className="gg-mq">
                  <LogoMarquee
                    logos={registrationLogos}
                    reverse
                    label="Official registrations and approvals"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 11 — SOCIAL MEDIA / YOUTUBE */}
            <section className="gg-social gg-on-dark gg-lazy" aria-labelledby="social-media-heading">
              <div className="gg-wrap">
                <div className="gg-sh">
                  <div>
                    <span className="gg-eyebrow">Watch</span>
                    <h2 id="social-media-heading">Stay Connected Across Social Media</h2>
                    <p>
                      Regular updates, property walkthroughs, and community news are shared across Gulberg Greens Islamabad&apos;s official social media channels.
                    </p>
                  </div>
                  {homeYoutubeVideos.length > 1 ? (
                    <SliderArrows label="video" onPrev={prevVideo} onNext={nextVideo} />
                  ) : null}
                </div>

                {homeYoutubeVideos.length > 0 ? (
                  <>
                    <VideoSplit
                      videos={homeYoutubeVideos}
                      index={videoIndex}
                      onSelect={setVideoIndex}
                    />
                    <SliderDots count={homeYoutubeVideos.length} active={videoIndex} />
                  </>
                ) : (
                  <div className="gg-empty">Official YouTube videos will appear here.</div>
                )}

                <div className="gg-socials" role="group" aria-label="Social media links">
                  {HOME_SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      {social.short}
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 12 — LATEST UPDATES */}
            <section className="gg-lazy" aria-labelledby="latest-updates-heading">
              <div className="gg-wrap">
                <div className="gg-sh">
                  <div>
                    <span className="gg-eyebrow">News</span>
                    <h2 id="latest-updates-heading">
                      Latest Updates from Gulberg Greens Islamabad
                    </h2>
                    <p>
                      News, development milestones, and society announcements are posted regularly to keep residents and investors informed.
                    </p>
                  </div>
                  {homeNewsPosts.length > 1 ? (
                    <SliderArrows label="update" onPrev={prevPost} onNext={nextPost} />
                  ) : null}
                </div>

                {homeNewsPosts.length > 0 ? (
                  <>
                    <PostSplit
                      posts={homeNewsPosts}
                      index={postIndex}
                      onSelect={setPostIndex}
                    />
                    <SliderDots count={homeNewsPosts.length} active={postIndex} />
                  </>
                ) : null}

                <p style={{ textAlign: 'center', marginTop: 22 }}>
                  <MoreLink to="/latest-updates/" label="View All Updates" />
                </p>
              </div>
            </section>

            {/* SECTION 13 — FAQ */}
            <section
              id="home-faq-heading"
              className="gg-faq scroll-mt-28 md:scroll-mt-32"
              aria-labelledby="faq-section-heading"
            >
              <div className="gg-wrap">
                <div className="gg-sh gg-center">
                  <div className="gg-center">
                    <span className="gg-eyebrow">FAQ</span>
                    <h2 id="faq-section-heading">{HOME_FAQ_SECTION.h2}</h2>
                  </div>
                </div>

                <div className="gg-fgrid">
                  {faqColumns.map((column, c) => (
                    <div key={c} className="gg-fcol">
                      {column.map((item, i) => {
                        const index = c === 0 ? i : faqHalf + i
                        const open = faqOpenIndex === index

                        return (
                          <div key={item.id} className="gg-fitem">
                            <h3>
                              <button
                                type="button"
                                id={`faq-trigger-${item.id}`}
                                aria-expanded={open}
                                aria-controls={`faq-panel-${item.id}`}
                                onClick={() => setFaqOpenIndex(open ? null : index)}
                              >
                                <span>{item.question}</span>
                                <i aria-hidden>+</i>
                              </button>
                            </h3>

                            <div
                              id={`faq-panel-${item.id}`}
                              role="region"
                              aria-labelledby={`faq-trigger-${item.id}`}
                              hidden={!open}
                            >
                              {item.paragraphs.map((para, pIdx) => (
                                <p key={pIdx}>{para}</p>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 14 — LOCATION (map sirf click par load hota hai — speed) */}
            <section className="gg-lazy" aria-labelledby="location-heading">
              <div className="gg-wrap">
                <div className="gg-locg">
                  <div className="gg-locg-body">
                    <span className="gg-eyebrow">Location</span>
                    <h2 id="location-heading">{HOME_LOCATION.h2}</h2>
                    <p>{HOME_LOCATION.body}</p>

                    <div className="gg-office">
                      <h3 className="gg-sub" style={{ margin: 0 }}>
                        {HOME_LOCATION.visit.h3}
                      </h3>
                      <ul>
                        {HOME_LOCATION.visit.lines.map((line, i) => (
                          <li key={line}>
                            <Icon name={VISIT_LINE_ICONS[i] || 'pin'} />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <MoreLink to={HOME_LOCATION.cta.to} label={HOME_LOCATION.cta.label} />
                  </div>

                  <div className="gg-map">
                    {showMap ? (
                      <iframe
                        title="Gulberg Greens Islamabad on Google Maps"
                        src={mapEmbedUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <SeoImage image={HOME_HERO.image} className="gg-cover" />
                        <div className="gg-map-shade" aria-hidden />
                        <div className="gg-map-pin" aria-hidden>
                          <div className="gg-map-card">
                            <b>Gulberg Greens Islamabad</b>
                            <span>Gulberg Expressway, Islamabad</span>
                          </div>
                          <i />
                        </div>
                        <button
                          type="button"
                          className="gg-btn gg-btn-emerald gg-map-open"
                          onClick={() => setShowMap(true)}
                        >
                          <Icon name="pin" />
                          Show Google Map
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 15 — FOOTER BLURB */}
            <section className="gg-about" aria-labelledby="home-footer-blurb">
              <div className="gg-wrap">
                <h3 id="home-footer-blurb">{HOME_FOOTER_BLURB.h3}</h3>
                <p>{HOME_FOOTER_BLURB.body}</p>
              </div>
            </section>
          </>
        ) : (
          <div style={{ height: 64 }} aria-hidden />
        )}

        {/* SECTION 16 — EXPLORE LINKS (footer se upar alag section) */}
        <section className="gg-explore" aria-labelledby="home-explore-heading">
          <div className="gg-wrap">
            <div className="gg-sh">
              <div>
                <span className="gg-eyebrow">Explore</span>
                <h2 id="home-explore-heading">Explore Gulberg Greens Islamabad</h2>
                <p>Browse properties by type and size.</p>
              </div>
            </div>

            {/* 3 barabar columns; Plots aur Houses ke chips 2 columns, Farmhouses 1 column */}
            <nav
              aria-label="Explore properties in Gulberg Greens Islamabad"
              className="gg-ecols"
            >
              {HOME_EXPLORE_COLUMNS.map((column) => (
                <HomeExploreColumn key={column.title} column={column} />
              ))}
            </nav>
          </div>
        </section>
      </div>

      {/* Mobile: Call + WhatsApp toggle (desktop par chhupa rehta hai) */}
      <ContactDial />
    </div>
  )
}

export default Home
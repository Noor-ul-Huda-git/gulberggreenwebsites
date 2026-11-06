'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logoGulbergGreens from '../../assets/logo-gulberg-greens-0.png'
import { fontVariables } from '../../lib/fonts.js'

const homeNavItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Latest updates', to: '/latest-updates/', end: false },
  { label: 'Gulberg Map', to: '/gulberg-map/', end: false },
  { label: 'Contact Us', to: '/contact/', end: false },
]

function ArrowIcon({ className = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 10.5C20 15.5 12 21 12 21S4 15.5 4 10.5a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 3.5 4.5 5.6c-.7.7-.8 1.8-.3 2.7 2.4 4.5 6 8.1 10.5 10.5.9.5 2 .4 2.7-.3l2.1-2.1c.6-.6.6-1.6 0-2.2l-2.3-2.3c-.5-.5-1.3-.6-1.9-.2l-1.6 1c-1.8-.9-3.3-2.4-4.2-4.2l1-1.6c.4-.6.3-1.4-.2-1.9L8.8 3.5c-.6-.6-1.6-.6-2.2 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.7v8h3.3Z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="15" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.6 7.1a5.9 5.9 0 0 1-3.5-1.2v7.3a5.8 5.8 0 1 1-5-5.7v3a2.8 2.8 0 1 0 2.1 2.7V2.5h2.9a5.8 5.8 0 0 0 3.5 2.7v1.9Z" />
    </svg>
  )
}

const socialClass =
  'grid h-[26px] w-[26px] place-items-center rounded-full bg-white/10 !text-white transition-colors duration-200 hover:bg-[#10B981] hover:!text-[#03251B]'

/**
 * Top bar scroll ke sath upar chala jata hai; neeche wala navbar
 * har page par sticky rehta hai (top se bottom tak sath chalta hai).
 */
function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const path = pathname || '/'

  const handleNavItemClick = () => {
    setMobileOpen(false)
  }

  const getItemActive = (item) => {
    if (item.label === 'Home') {
      return path === '/'
    }

    if (item.label === 'Latest updates') {
      return path.startsWith('/latest-updates') || path.startsWith('/news')
    }

    if (item.label === 'Gulberg Map') {
      return path.startsWith('/gulberg-map')
    }

    if (item.label === 'Contact Us') {
      return path.startsWith('/contact') || path.startsWith('/contact-us')
    }

    return false
  }

  return (
    <>
      {/* Top Contact & Social Bar */}
      <div
        className={`${fontVariables} w-full bg-[#064E3B] text-[13px] text-[#D1FAE5] [font-family:var(--font-body),system-ui,sans-serif]`}
      >
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 px-[18px] py-[9px] md:px-7">
          <div className="flex min-w-0 flex-wrap items-center gap-x-[22px] gap-y-1">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Office%20%23402%2C%20HM%20Tower%2C%20Gulberg%20Greens%2C%20Islamabad%2C%20Pakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-w-0 items-center gap-[7px] transition-colors hover:text-white md:inline-flex"
              aria-label="Office address"
            >
              <span className="shrink-0 text-[#10B981]">
                <LocationIcon />
              </span>
              <span className="truncate">
                Gulberg Expy, Gulberg Greens Gulberg Greens Block B Islamabad, 44000, Pakistan
              </span>
            </a>

            <a
              href="tel:+923310000060"
              className="inline-flex items-center gap-[7px] whitespace-nowrap transition-colors hover:text-white"
              aria-label="Call Gulberg Greens"
            >
              <span className="text-[#10B981]">
                <PhoneIcon />
              </span>
              <span>+92 3310000060</span>
            </a>

            <a
              href="mailto:info@gulberggreens.com.pk"
              className="hidden items-center gap-[7px] whitespace-nowrap transition-colors hover:text-white lg:inline-flex"
              aria-label="Email Gulberg Greens"
            >
              <span className="text-[#10B981]">
                <MailIcon />
              </span>
              <span>info@gulberggreens.com.pk</span>
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://www.facebook.com/gulberggreens.ibechs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gulberg Greens Facebook"
              className={socialClass}
            >
              <FacebookIcon />
            </a>

            <a
              href="https://www.youtube.com/@gulberggreens_ibechs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gulberg Greens YouTube"
              className={socialClass}
            >
              <YouTubeIcon />
            </a>

            <a
              href="https://www.tiktok.com/@gulberggreensibechs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gulberg Greens TikTok"
              className={socialClass}
            >
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar — sticky */}
      <header
        className={`${fontVariables} sticky top-0 z-[80] w-full border-b border-[#D3ECE0] bg-white/[0.97] shadow-[0_6px_18px_rgba(6,78,59,0.06)] backdrop-blur-md [font-family:var(--font-body),system-ui,sans-serif]`}
      >
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-5 px-[18px] py-[9px] md:px-7">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => setMobileOpen(false)}
          >
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/logo-gulberg-greens-mobile.webp"
                type="image/webp"
              />

              <img
                src={logoGulbergGreens.src}
                alt="Gulberg Greens Islamabad"
                className="h-10 w-auto max-w-[min(100%,220px)] object-contain object-left mix-blend-multiply md:h-[42px]"
                width={560}
                height={154}
              />
            </picture>
          </Link>

          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Primary">
            {homeNavItems.map((item) => {
              const active = getItemActive(item)

              return (
                <Link
                  key={item.label}
                  href={item.to}
                  onClick={handleNavItemClick}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-[14px] py-[9px] text-[15px] font-bold transition-colors duration-200 hover:bg-[#EEF8F3] hover:!text-[#064E3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] ${
                    active ? 'bg-[#EEF8F3] !text-[#064E3B]' : '!text-[#0F1F19]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/properties/"
              className="group hidden min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full bg-[#064E3B] px-[18px] text-[14px] font-extrabold !text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#065F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 md:inline-flex"
            >
              Browse Properties
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowIcon />
              </span>
            </Link>

            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF8F3] text-[#064E3B] transition-colors duration-200 hover:bg-[#D3ECE0] lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-home"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div
            id="mobile-nav-home"
            className="border-t border-[#D3ECE0] bg-white px-[18px] py-4 shadow-[0_14px_30px_rgba(6,78,59,0.12)] lg:hidden"
          >
            <nav className="flex flex-col gap-1.5" aria-label="Mobile primary">
              {homeNavItems.map((item) => {
                const active = getItemActive(item)

                return (
                  <Link
                    key={item.label}
                    href={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-[16px] font-bold transition-colors duration-200 ${
                      active
                        ? 'bg-[#EEF8F3] !text-[#064E3B]'
                        : '!text-[#0F1F19] hover:bg-[#EEF8F3]'
                    }`}
                    onClick={handleNavItemClick}
                  >
                    <span>{item.label}</span>
                    <ArrowIcon className="h-4 w-4 text-[#10B981]" />
                  </Link>
                )
              })}

              <Link
                href="/properties/"
                className="mt-2 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#064E3B] px-4 text-[15px] font-extrabold !text-white transition-colors duration-200 hover:bg-[#065F46]"
                onClick={() => setMobileOpen(false)}
              >
                Browse Properties
                <ArrowIcon />
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  )
}

export default Header
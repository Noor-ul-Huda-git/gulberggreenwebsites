import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import logoGulbergGreens from '../../assets/logo-gulberg-greens-0.png'

const homeNavItems = [
  { label: 'Home', to: '/', end: true, hasDropdown: true },
  { label: 'Latest updates', to: '/latest-updates/', end: false, hasDropdown: true },
  { label: 'Gulberg Map', to: '/gulberg-map/', end: false, hasDropdown: true },
  
  { label: 'Contact Us', to: '/contact/', end: false, hasDropdown: true },
]

function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 4.25L6 7.75L9.5 4.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PropertiesCtaIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className="opacity-95"
    >
      <path
        d="M3.25 14.5V7.75c0-.69.56-1.25 1.25-1.25h1.5c.69 0 1.25.56 1.25 1.25V14.5M8.75 14.5V5.25c0-.69.56-1.25 1.25-1.25h1.5c.69 0 1.25.56 1.25 1.25v9.25M14.25 14.5V9.75c0-.69-.56-1.25-1.25-1.25h-1.5c-.69 0-1.25.56-1.25 1.25v4.75"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 14.5h13"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
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
        strokeWidth="1.6"
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
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M20 10.5C20 15.5 12 21 12 21S4 15.5 4 10.5a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
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
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
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
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.7v8h3.3Z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg
      width="19"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.6 7.1a5.9 5.9 0 0 1-3.5-1.2v7.3a5.8 5.8 0 1 1-5-5.7v3a2.8 2.8 0 1 0 2.1 2.7V2.5h2.9a5.8 5.8 0 0 0 3.5 2.7v1.9Z" />
    </svg>
  )
}

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const path = location.pathname
  const hash = location.hash
  const isHomePage = path === '/' || path === ''

  const handleNavItemClick = (item) => (e) => {
    if (item.to === '/#home-faq-heading' && (path === '/' || path === '')) {
      e.preventDefault()

      navigate('/#home-faq-heading', { replace: true })

      window.requestAnimationFrame(() => {
        document
          .getElementById('home-faq-heading')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
      })
    }

    setMobileOpen(false)
  }

  const getItemActive = (item) => {
    if (item.label === 'Home') {
      return path === '/' && hash === ''
    }

    if (item.label === 'FAQ') {
      return path === '/' && hash === '#home-faq-heading'
    }

    if (item.label === 'Latest updates') {
      return (
        path.startsWith('/latest-updates') ||
        path.startsWith('/news')
      )
    }

    if (item.label === 'Gulberg Map') {
      return path.startsWith('/gulberg-map')
    }

    if (item.label === 'Contact Us') {
      return (
        path.startsWith('/contact') ||
        path.startsWith('/contact-us')
      )
    }

    return false
  }

  return (
    <header
      className={`${
        isHomePage ? 'fixed inset-x-0 top-0' : 'sticky top-0'
      } z-[80] w-full border-b border-slate-200/80 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.08)]`}
    >
      {/* Top Contact & Social Bar */}
      <div className="w-full bg-gradient-to-r from-[#102a43] via-[#1a4262] to-[#17605d] text-white sm:bg-none sm:bg-[#0b2d4b]">
        <div className="container-shell relative flex min-h-[76px] items-start justify-between gap-4 px-4 py-2 sm:min-h-[38px] sm:items-center sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-col items-start gap-y-1 pr-24 text-[11px] font-medium leading-tight sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1 sm:pr-0 sm:text-[12px] sm:leading-normal">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Office%20%23402%2C%20HM%20Tower%2C%20Gulberg%20Greens%2C%20Islamabad%2C%20Pakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[#31C950]"
              aria-label="Office address"
            >
              <span className="text-[#f2c230]">
                <LocationIcon />
              </span>
              <span>Office #402, HM Tower Gulberg Greens Islamabad, Pakistan</span>
            </a>

            <a
              href="tel:+923375098243"
              className="inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[#31C950]"
              aria-label="Call Gulberg Greens"
            >
              <span className="text-[#f2c230]">
                <PhoneIcon />
              </span>
              <span>+92 3310000060</span>
            </a>

            <a
              href="mailto:Info@gacadvisors.com"
              className="inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[#31C950]"
              aria-label="Email Gulberg Greens"
            >
              <span className="text-[#f2c230]">
                <MailIcon />
              </span>
              <span>info@gulberggreens.com.pk</span>
            </a>
          </div>

          <div className="absolute bottom-2 right-4 flex shrink-0 items-center gap-4 sm:static">
            <a
              href="https://www.facebook.com/gulberggreens.ibechs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gulberg Greens Facebook"
              className="inline-flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-0.5 hover:text-[#31C950]"
            >
              <FacebookIcon />
            </a>

            <a
              href="https://www.youtube.com/@gulberggreens_ibechs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gulberg Greens YouTube"
              className="inline-flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-0.5 hover:text-[#31C950]"
            >
              <YouTubeIcon />
            </a>

            <a
              href="https://www.tiktok.com/@gulberggreensibechs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gulberg Greens TikTok"
              className="inline-flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-0.5 hover:text-[#31C950]"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-shell flex items-center justify-between gap-4 py-4 md:py-5">
        <NavLink
          to="/"
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
              src={logoGulbergGreens}
              alt="Gulberg Greens Islamabad"
              className="h-11 w-auto max-w-[min(100%,260px)] object-contain object-left md:h-14"
              width={560}
              height={154}
            />
          </picture>
        </NavLink>

        <nav
          className="hidden items-center gap-3 xl:gap-4 lg:flex"
          aria-label="Primary"
        >
          {homeNavItems.map((item) => {
            const active = getItemActive(item)

            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                onClick={handleNavItemClick(item)}
                className={`
                  inline-flex
                  origin-center
                  items-center
                  rounded-lg
                  px-3
                  py-2.5
                  font-[Poppins,Manrope,system-ui,sans-serif]
                  text-[15px]
                  leading-none
                  tracking-[0.02em]
                  transition-all
                  duration-200
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#31C950]/35
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-white
                  ${
                    active
                      ? 'scale-105 bg-[#31C950]/10 font-semibold text-[#31C950] underline decoration-[#31C950] decoration-[2.5px] underline-offset-[7px]'
                      : 'font-medium text-slate-700'
                  }
                `}
              >
                {item.label}

                {item.hasDropdown ? (
                  <ChevronDown className="ml-1 h-3 w-3" />
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            to="/properties/"
            className="group hidden items-center gap-2 rounded-xl border border-[#31C950]/25 bg-[#31C950] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_2px_14px_rgba(49,201,80,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#28b048] hover:bg-[#28b048] hover:shadow-[0_6px_22px_rgba(49,201,80,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31C950]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:inline-flex"
          >
            <span className="relative text-inherit">
              Browse properties
            </span>

            <span className="text-white transition-transform duration-200 group-hover:translate-x-0.5">
              <PropertiesCtaIcon />
            </span>
          </NavLink>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#1a3553] shadow-sm transition-all duration-200 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-home"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav-home"
          className="border-t border-slate-200 bg-white px-6 py-4 shadow-lg lg:hidden"
        >
          <nav
            className="flex flex-col gap-2"
            aria-label="Mobile primary"
          >
            {homeNavItems.map((item) => {
              const active = getItemActive(item)

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={`
                    group
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border-b
                    border-slate-100
                    px-3
                    py-3
                    font-[Poppins,Manrope,system-ui,sans-serif]
                    text-[16px]
                    tracking-[0.02em]
                    transition-all
                    duration-200
                    ${
                      active
                        ? 'bg-[#31C950]/10 font-semibold text-[#31C950]'
                        : 'font-medium text-slate-800'
                    }
                  `}
                  onClick={handleNavItemClick(item)}
                >
                  <span>{item.label}</span>

                  {item.hasDropdown ? (
                    <ChevronDown className="h-3 w-3 text-[#31C950]" />
                  ) : null}
                </NavLink>
              )
            })}

            <NavLink
              to="/properties/"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-[#31C950]/35 bg-[#31C950] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_3px_14px_rgba(49,201,80,0.25)] transition-all duration-200 hover:bg-[#28b048] hover:shadow-[0_6px_20px_rgba(49,201,80,0.32)]"
              onClick={() => setMobileOpen(false)}
            >
              Browse properties
              <PropertiesCtaIcon />
            </NavLink>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default Header

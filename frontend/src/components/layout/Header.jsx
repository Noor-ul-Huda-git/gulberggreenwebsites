import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import logoGulbergGreens from '../../assets/logo-gulberg-greens-0.png'
import { isPropertiesListingExplorerPath } from '../../data/propertyListingTypes.js'

const homeNavItems = [
  { label: 'Home', to: '/', end: true, hasDropdown: true },
  { label: 'Latest updates', to: '/latest-updates/', end: false, hasDropdown: true },
  { label: 'Gulberg Map', to: '/gulberg-map/', end: false, hasDropdown: true },
  { label: 'FAQ', to: '/#home-faq-heading', end: false, hasDropdown: true },
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
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="opacity-95">
      <path
        d="M3.25 14.5V7.75c0-.69.56-1.25 1.25-1.25h1.5c.69 0 1.25.56 1.25 1.25V14.5M8.75 14.5V5.25c0-.69.56-1.25 1.25-1.25h1.5c.69 0 1.25.56 1.25 1.25v9.25M14.25 14.5V9.75c0-.69-.56-1.25-1.25-1.25h-1.5c-.69 0-1.25.56-1.25 1.25v4.75"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.5 14.5h13" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const path = location.pathname
  const hash = location.hash

  const handleNavItemClick = (item) => (e) => {
    if (item.to === '/#home-faq-heading' && (path === '/' || path === '')) {
      e.preventDefault()
      navigate('/#home-faq-heading', { replace: true })
      window.requestAnimationFrame(() => {
        document.getElementById('home-faq-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
    setMobileOpen(false)
  }
  /** Dark hero image + scrim — listing explorer (/properties plus category/block filter paths). */
  const isPropertiesListing = isPropertiesListingExplorerPath(path)
  const isDarkHeroNav =
    path.startsWith('/news') || path.startsWith('/latest-updates') || path.startsWith('/gulberg-map') || isPropertiesListing

  return (
    <header className="absolute inset-x-0 top-0 z-[80] bg-transparent">
      <div className="container-shell flex items-center justify-between gap-4 py-5 md:py-6">
        <NavLink to="/" className="flex shrink-0 items-center" onClick={() => setMobileOpen(false)}>
          <picture>
            <source media="(max-width: 768px)" srcSet="/logo-gulberg-greens-mobile.webp" type="image/webp" />
            <img
              src={logoGulbergGreens}
              alt="Gulberg Greens Islamabad"
              className={`h-11 w-auto max-w-[min(100%,260px)] object-contain object-left md:h-14 ${
                isDarkHeroNav ? 'drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)]' : ''
              }`}
              width={560}
              height={154}
            />
          </picture>
        </NavLink>

        <nav className="hidden items-center gap-8 xl:gap-10 lg:flex" aria-label="Primary">
          {homeNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={handleNavItemClick(item)}
              className={({ isActive }) => {
                const faqActive = item.to === '/#home-faq-heading' && path === '/' && hash === '#home-faq-heading'
                const active =
                  isActive ||
                  faqActive ||
                  (item.to === '/latest-updates' && (path.startsWith('/latest-updates') || path.startsWith('/news'))) ||
                  (item.to === '/contact' && (path.startsWith('/contact') || path.startsWith('/contact-us'))) ||
                  (item.to === '/gulberg-map' && path.startsWith('/gulberg-map'))
                const navBase =
                  'inline-flex origin-center items-center rounded-md px-1.5 py-1 font-[Poppins,Manrope,system-ui,sans-serif] text-[15px] leading-none tracking-[0.02em] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:scale-[1.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
                if (isDarkHeroNav) {
                  return `${navBase} [text-shadow:0_1px_4px_rgba(0,0,0,0.55)] focus-visible:ring-white/50 focus-visible:ring-offset-transparent ${
                    active
                      ? '!scale-105 !font-semibold !text-[#31C950] underline decoration-[#31C950] decoration-[2.5px] underline-offset-[8px] drop-shadow-[0_0_20px_rgba(49,201,80,0.25)]'
                      : 'font-medium !text-white/86 hover:!text-white'
                  }`
                }
                return `${navBase} focus-visible:ring-[#31C950]/35 focus-visible:ring-offset-white ${
                  active
                    ? '!scale-105 font-semibold text-[#31C950] underline decoration-[#31C950] decoration-[2.5px] underline-offset-[8px]'
                    : 'font-medium text-slate-600 hover:text-[#1a3553]'
                }`
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            to="/properties/"
            className={`group hidden items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition duration-300 md:inline-flex ${
              isDarkHeroNav
                ? 'border-2 border-white bg-white !text-[#1a3553] shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:bg-white hover:!text-[#1a3553] hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
                : 'border border-[#31C950]/25 bg-[#31C950] text-white shadow-[0_2px_14px_rgba(49,201,80,0.35)] hover:border-[#28b048] hover:bg-[#28b048] hover:shadow-[0_6px_22px_rgba(49,201,80,0.4)]'
            }`}
          >
            <span className="relative text-inherit">Browse properties</span>
            <span className={isDarkHeroNav ? 'text-[#1a3553]' : 'text-white'}>
              <PropertiesCtaIcon />
            </span>
          </NavLink>

          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border backdrop-blur-sm lg:hidden ${
              isDarkHeroNav
                ? 'border-white/45 bg-black/25 text-white'
                : 'border-white/40 bg-white/15 text-[#1a2332]'
            }`}
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
          className="border-t border-white/25 bg-white/95 px-6 py-4 shadow-lg backdrop-blur-md lg:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile primary">
            {homeNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) => {
                  const faqActive = item.to === '/#home-faq-heading' && path === '/' && hash === '#home-faq-heading'
                  const active =
                    isActive ||
                    faqActive ||
                    (item.to === '/latest-updates' && (path.startsWith('/latest-updates') || path.startsWith('/news'))) ||
                    (item.to === '/contact' && (path.startsWith('/contact') || path.startsWith('/contact-us'))) ||
                    (item.to === '/gulberg-map' && path.startsWith('/gulberg-map'))
                  return `flex items-center justify-between border-b border-slate-100 py-2.5 font-[Poppins,Manrope,system-ui,sans-serif] text-[16px] tracking-[0.02em] transition-colors ${
                    active
                      ? 'font-semibold text-[#31C950]'
                      : 'font-medium text-slate-800'
                  }`
                }}
                onClick={handleNavItemClick(item)}
              >
                {item.label}
                {item.hasDropdown ? <ChevronDown className="h-3 w-3 text-[#31C950]" /> : null}
              </NavLink>
            ))}
            <NavLink
              to="/properties/"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-[#31C950]/35 bg-[#31C950]/12 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a3553] transition hover:bg-[#31C950]/22"
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

import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import logoGulbergGreens from '../../assets/logo-gulberg-greens-0.png'

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
    <header className={`${isHomePage ? 'fixed inset-x-0 top-0' : 'sticky top-0'} z-[80] w-full border-b border-slate-200/80 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.08)]`}>
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

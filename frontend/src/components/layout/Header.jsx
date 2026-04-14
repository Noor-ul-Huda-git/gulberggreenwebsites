import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'About', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'Map', to: '/gulberg-map' },
  { label: 'News & Insights', to: '/latest-updates' },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-slate-200">
        <div className="container-shell flex items-center justify-between py-2 text-[11px] text-slate-500">
          <span>Islamabad</span>
          <NavLink to="/contact-us" className="transition hover:text-slate-900">
            Contact Us
          </NavLink>
        </div>
      </div>
      <div className="container-shell flex items-center justify-between gap-6 py-5">
        <NavLink to="/" className="flex items-center gap-3 text-[#1a3553]">
          <div>
            <p className="text-[2.05rem] font-semibold leading-[0.88] tracking-[-0.05em]">
              GULBERG
            </p>
            <p className="text-[2.05rem] font-semibold leading-[0.88] tracking-[-0.05em]">
              GREENS
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/contact-us"
          className="hidden text-[13px] text-slate-600 transition hover:text-slate-900 md:block"
        >
          Contact Us
        </NavLink>
      </div>
    </header>
  )
}

export default Header

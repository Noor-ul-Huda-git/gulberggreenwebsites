import { Link } from 'react-router-dom'
import { contactInfo } from '../../data/siteContent.js'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="container-shell flex flex-col gap-8 py-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-end gap-10">
          <div>
            <p className="text-[1.8rem] font-semibold leading-[0.88] tracking-[-0.05em] text-[#1a3553]">
              GULBERG
            </p>
            <p className="text-[1.8rem] font-semibold leading-[0.88] tracking-[-0.05em] text-[#1a3553]">
              GREENS
            </p>
          </div>
          <div className="hidden gap-4 text-[11px] lg:flex">
            <Link to="/">Home</Link>
            <Link to="/latest-updates">News & Insights</Link>
            <Link to="/contact-us">Contact Us</Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[11px] lg:items-end">
          <p>{contactInfo.address}</p>
          <p>{contactInfo.phone}</p>
          <p>{contactInfo.email}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

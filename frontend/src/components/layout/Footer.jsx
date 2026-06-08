import { Link, useLocation } from 'react-router-dom'
import {
  brandNavy,
  contactInfo,
  footerAbout,
  mapEmbedUrl,
  socialLinks,
} from '../../data/siteContent.js'

function SocialGlyph({ id }) {
  const common = 'h-[17px] w-[17px] fill-current'
  switch (id) {
    case 'x':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M18.24 2.25h3.43l-7.5 8.57L23 21.77h-7.06l-5.52-7.22-6.32 7.22H.75l8.02-9.16L1 2.25h7.25l5.02 6.64 5.97-6.64zM17.08 19.8h1.9L6.92 4.1H4.8l12.28 15.7z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 00.5 6.2 40 40 0 000 12a40 40 0 00.6 5.8 3 3 0 002.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 002.1-2.1 40 40 0 00.6-5.8 40 40 0 00-.6-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M7.8 2h8.4A5.8 5.8 0 0122 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8A5.8 5.8 0 012 16.2V7.8A5.8 5.8 0 017.8 2zm-.2 2A3.8 3.8 0 004 7.8v8.4A3.8 3.8 0 007.6 20h8.8a3.8 3.8 0 003.6-3.8V7.8A3.8 3.8 0 0016.4 4H7.6zm8.25 1.75a.9.9 0 110 1.8.9.9 0 010-1.8zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      )
    case 'medium':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M13.54 12a6.34 6.34 0 01-6.31 6.39A6.34 6.34 0 010 12a6.34 6.34 0 016.39-6.39A6.34 6.34 0 0113.54 12zm7.42 0c0 3.54-1.77 6.39-3.96 6.39S13.04 15.54 13.04 12s1.77-6.39 3.96-6.39S20.96 8.46 20.96 12zM24 12c0 3.31-.53 6-1.19 6s-1.19-2.69-1.19-6 .53-6 1.19-6S24 8.69 24 12z" />
        </svg>
      )
    case 'quora':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M12.07 21.5c-1.32 0-2.54-.22-3.65-.65l-1.2 2.1c-.28.5-.85.68-1.35.4a1 1 0 01-.4-1.35l1.08-1.9a9.95 9.95 0 01-3.55-7.6c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm0-17a7 7 0 100 14 7 7 0 000-14zm.5 10.5h-1v-1.2c0-.55.45-1 1-1h.5a2 2 0 002-2v-.3a2 2 0 00-2-2h-1a2 2 0 00-2 2v.5h-1.5V11a3.5 3.5 0 013.5-3.5h1A3.5 3.5 0 0116 11v.3a3.48 3.48 0 01-2.43 3.32c.27.35.43.78.43 1.25V15z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.33 6.33 0 00-1.88.33 6.34 6.34 0 00-4.4 6.04 6.34 6.34 0 106.34-6.34c-.04 0-.09 0-.13.01V8.42a8.92 8.92 0 004.77 1.39v-3.12z" />
        </svg>
      )
    case 'bluesky':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 11.088c-1.496-2.395-4.935-6.154-7.882-7.792C2.293 2.378.5 3.457.5 5.304V18.6c0 2.034 2.265 3.131 3.93 2.015 2.73-1.706 6.51-5.452 7.57-6.948.04-.06.12-.06.16 0 1.06 1.496 4.84 5.242 7.57 6.948 1.665 1.116 3.93.019 3.93-2.015V5.304c0-1.847-1.793-2.926-3.618-2.008-2.947 1.638-6.386 5.397-7.882 7.792z" />
        </svg>
      )
    case 'dribbble':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 23.5C5.65 23.5.5 18.35.5 12S5.65.5 12 .5 23.5 5.65 23.5 12 18.35 23.5 12 23.5zm8.9-10.2c-.35-.12-3.15-1.04-6.35-.48.13.28.26.57.38.85 2.4-.3 5.5.28 5.97.38-.02-.25-.06-.5-.1-.75zm-1.05-2.45c-.08 0-4.55-.92-7.95.26.22.45.44.9.64 1.35 3.05-1.15 7.15-1.05 7.3-1.05.02-.52.02-1.02-.01-1.56zM12 3.5c-1.95 0-3.75.55-5.3 1.5 0 .02 1.95 3.8 5.65 6.35 2.1-2.8 2.95-5.25 3.15-5.95-1-.55-2.1-.9-3.5-.9zm-6.9 2.1c-1.85 2.1-2.95 4.85-2.95 7.9 0 1.05.15 2.05.4 3 0-.05 3.95-1.25 8.05-.35-1.15-3.25-3.35-6.45-5.5-10.55z" />
        </svg>
      )
    case 'pinterest':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 0C5.38 0 0 5.06 0 11.38c0 4.68 2.87 8.8 7.15 10.23-.1-.87-.18-2.21.04-3.16.19-.82 1.25-5.24 1.25-5.24s-.32-.64-.32-1.58c0-1.48.86-2.58 1.93-2.58.9 0 1.34.68 1.34 1.5 0 .92-.59 2.3-.9 3.57-.25 1.07.54 1.95 1.58 1.95 1.9 0 3.36-2 3.36-4.89 0-2.56-1.84-4.35-4.47-4.35-3.05 0-4.84 2.3-4.84 4.67 0 .92.35 1.92.79 2.46.09.1.1.19.08.29-.09.37-.29 1.19-.33 1.35-.05.22-.18.27-.41.16-1.53-.71-2.49-2.94-2.49-4.73 0-3.85 2.78-7.4 8.01-7.4 4.22 0 7.5 3 7.5 7.07 0 4.19-2.64 7.56-6.31 7.56-1.23 0-2.39-.64-2.79-1.4l-.76 2.9c-.28 1.07-1.03 2.41-1.53 3.23 1.15.35 2.37.54 3.64.54 6.62 0 12-5.06 12-11.38C24 5.06 18.62 0 12 0z" />
        </svg>
      )
    default:
      return null
  }
}

function ContactRow({ icon, label, children }) {
  return (
    <div className="group flex gap-4">
      <span
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-[#1a3553] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition group-hover:border-[#31C950]/35 group-hover:text-[#31C950]"
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <div className="mt-1 text-[15px] leading-snug text-slate-700">{children}</div>
      </div>
    </div>
  )
}

function IconPin() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 22s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 6.75h16v10.5H4V6.75z" strokeLinejoin="round" />
      <path d="M4.6 7.35L12 12.2l7.45-4.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M15.5 14.2l2.85 2.85a1.2 1.2 0 010 1.7l-1.5 1.5a12 12 0 01-12.8-12.8l1.52-1.5a1.2 1.2 0 011.68 0l2.9 2.85a1.2 1.2 0 010 1.7l-2.02 2.02a8 8 0 003.57 3.58l2.02-2.02a1.2 1.2 0 011.7 0z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconClock() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 8.25V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Footer() {
  const location = useLocation()
  /** News, contact, map & properties pages carry their own layout — hide the large map block; keep contact columns + bottom bar. */
  const showLocationMap =
    !location.pathname.startsWith('/news') &&
    !location.pathname.startsWith('/latest-updates') &&
    !location.pathname.startsWith('/contact') &&
    !location.pathname.startsWith('/contact-us') &&
    !location.pathname.startsWith('/gulberg-map') &&
    !location.pathname.startsWith('/properties')
  /** Contact page already has full contact content — hide the duplicate about + get-in-touch block. */
  const showAboutContactBlock = !location.pathname.startsWith('/contact') && !location.pathname.startsWith('/contact-us')

  return (
    <footer className="border-t border-slate-200/80">
      {showLocationMap ? (
      <section
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#f9fafb_100%)]"
        aria-labelledby="footer-map-heading"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/90 to-transparent"
          aria-hidden
        />
        <div className="container-shell px-4 py-12 sm:px-6 md:py-16 lg:py-[4.25rem]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-xl lg:max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#31C950] md:text-xs">Location</p>
              <h2
                id="footer-map-heading"
                className="mt-3 font-[Poppins,Manrope,system-ui,sans-serif] text-2xl font-semibold tracking-[-0.03em] text-[#1a3553] sm:text-[1.75rem] md:text-[2rem]"
              >
                Gulberg Greens, Islamabad
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600 md:text-base">
                Gulberg Expressway — centrally connected to the capital. Use the map to explore the estate boundary, or open
                directions when visiting our sales office.
              </p>
            </div>
            {/* <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch xl:flex-row">
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-5 py-3.5 text-[13px] font-semibold text-[#1a3553] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition hover:border-[#31C950]/50 hover:bg-[#31C950]/[0.06] hover:text-[#0f2744]"
              >
                Open in Google Maps
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M7 17L17 7M17 7H9M17 7v8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <Link
                to="/gulberg-map/"
                className="inline-flex items-center justify-center rounded-xl bg-[#1a3553] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_10px_40px_-12px_rgba(26,53,83,0.45)] transition hover:bg-[#142a42]"
              >
                Project map on site
              </Link>
            </div> */}
          </div>

          <div className="relative mt-10 md:mt-12">
            <div
              className="relative overflow-hidden rounded-2xl bg-slate-200 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.06)] ring-1 ring-white/80 md:rounded-3xl"
            >
              <div className="aspect-[16/10] min-h-[260px] w-full sm:min-h-[300px] md:aspect-[2/1] md:min-h-[340px] lg:min-h-[380px]">
                <iframe
                  title="Gulberg Greens Islamabad on Google Maps"
                  src={mapEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400 md:text-left">
              Map data © Google — for reference only; confirm routes before travel.
            </p>
          </div>
        </div>
      </section>
      ) : null}

      {showAboutContactBlock ? (
        <section className="border-t border-slate-100 bg-white" aria-labelledby="footer-about-heading">
            <div className="container-shell px-4 py-14 sm:px-6 md:py-16 lg:py-20">
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:gap-x-14">
                <div className="lg:col-span-6">
                  <div className="inline-flex h-1 w-10 rounded-full bg-[#31C950]" aria-hidden />
                  <h2
                    id="footer-about-heading"
                    className="mt-5 font-[Poppins,Manrope,system-ui,sans-serif] text-xl font-semibold tracking-[-0.02em] text-[#1a3553] md:text-2xl"
                  >
                    Official sales &amp; marketing platform
                  </h2>
                  <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-slate-600 md:text-[17px] md:leading-[1.8]">
                    {footerAbout}
                  </p>
                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Connect</p>
                    <ul className="mt-5 flex flex-wrap gap-2.5" aria-label="Social media">
                      {socialLinks.map((item) => (
                        <li key={item.id}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white text-[#1a3553] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#31C950]/55 hover:bg-[#31C950] hover:text-white hover:shadow-[0_8px_24px_-8px_rgba(49,201,80,0.55)]"
                            aria-label={item.label}
                          >
                            <SocialGlyph id={item.id} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] lg:col-span-6 lg:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#31C950]">Get in touch</p>
                  <h2 className="mt-3 font-[Poppins,Manrope,system-ui,sans-serif] text-xl font-semibold tracking-[-0.02em] text-[#1a3553] md:text-2xl">
                    Sales office
                  </h2>
                  <address className="mt-8 space-y-7 not-italic">
                    <ContactRow label="Address" icon={<IconPin />}>
                      {contactInfo.address}
                    </ContactRow>
                    <ContactRow label="Email" icon={<IconMail />}>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="font-medium text-[#1a3553] underline decoration-slate-300 underline-offset-[5px] transition hover:decoration-[#31C950] hover:text-[#31C950]"
                      >
                        {contactInfo.email}
                      </a>
                    </ContactRow>
                    <ContactRow label="Phone" icon={<IconPhone />}>
                      <a
                        href="tel:+923310000060"
                        className="font-medium text-[#1a3553] underline decoration-slate-300 underline-offset-[5px] transition hover:decoration-[#31C950] hover:text-[#31C950]"
                      >
                        {contactInfo.phone}
                      </a>
                    </ContactRow>
                    <ContactRow label="Hours" icon={<IconClock />}>
                      <span className="text-slate-700">{contactInfo.hours}</span>
                    </ContactRow>
                  </address>
                </div>
              </div>
            </div>
        </section>
      ) : null}

      {/* Legal / navigation bar — high-contrast text on brand navy */}
      <div className="border-t border-white/[0.1]" style={{ backgroundColor: brandNavy }}>
        <div className="container-shell flex flex-col gap-6 px-4 py-8 text-white sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 md:py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-10">
            <div>
              <p className="text-[1.35rem] font-semibold leading-[0.9] tracking-[-0.03em] text-white">
                GULBERG
              </p>
              <p className="text-[1.35rem] font-semibold leading-[0.9] tracking-[-0.03em] text-white">
                GREENS
              </p>
            </div>
            <p className="max-w-xs text-[11px] leading-relaxed text-white/80">
              © {new Date().getFullYear()} Gulberg Greens Islamabad. All rights reserved.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-medium tracking-wide"
            aria-label="Footer"
            style={{display: 'none'}}
          >
            <Link
              to="/"
              className="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Home
            </Link>
            <Link
              to="/properties/"
              className="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Properties
            </Link>
            <Link
              to="/latest-updates/"
              className="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              News
            </Link>
            <Link
              to="/gulberg-map/"
              className="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Gulberg Map
            </Link>
            <Link
              to="/contact/"
              className="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer

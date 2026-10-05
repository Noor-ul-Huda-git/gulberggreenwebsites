'use client'

import { useState } from 'react'
import PageBreadcrumbs from '../../components/layout/PageBreadcrumbs.jsx'
import {
  contactInfo,
  contactPageIntro,
  mapDirectionsUrl,
  mapEmbedUrl,
} from '../../data/siteContent.js'

const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'general', label: 'General inquiry' },
  { value: 'visit', label: 'Book a site visit' },
  { value: 'residential', label: 'Residential plots & inventory' },
  { value: 'commercial', label: 'Commercial / business opportunities' },
  { value: 'farmhouse', label: 'Farmhouse & premium zones' },
  { value: 'investment', label: 'Investment & payment guidance' },
]

function IconPhone({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path
        d="M15.5 14.2l2.85 2.85a1.2 1.2 0 010 1.7l-1.5 1.5a12 12 0 01-12.8-12.8l1.52-1.5a1.2 1.2 0 011.68 0l2.9 2.85a1.2 1.2 0 010 1.7l-2.02 2.02a8 8 0 003.57 3.58l2.02-2.02a1.2 1.2 0 011.7 0z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconMail({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 6.75h16v10.5H4V6.75z" strokeLinejoin="round" />
      <path d="M4.6 7.35L12 12.2l7.45-4.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconClock({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 8.25V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ContactUs({ seo }) {
 {seo.h1}
  const [status, setStatus] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setStatus(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('sent')
    window.setTimeout(() => setStatus(null), 8000)
  }

  return (
    <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif] text-slate-800">
      {/* Top: intro + form */}
      <section
        className="relative overflow-hidden border-b border-slate-200/60 bg-[linear-gradient(165deg,#f8fafc_0%,#eef2f7_48%,#e8edf5_100%)]"
        aria-labelledby="contact-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(49,201,80,0.07),transparent)]"
          aria-hidden
        />
        <div className="container-shell relative px-4 py-14 sm:px-6 md:py-20 lg:py-24">
          <PageBreadcrumbs
            variant="onLight"
            className="mb-10"
            items={[{ to: '/', label: 'Home' }, { label: 'Contact Us' }]}
          />
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-20">
            <div className="max-w-xl lg:max-w-none">
              {/* <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#31C950]">Contact</p> */}
              <h1
                id="contact-heading"
                className="mt-4 font-[Poppins,Manrope,system-ui,sans-serif] text-[1.65rem] font-semibold leading-[1.18] tracking-[-0.03em] text-[#1a3553] sm:text-3xl md:text-[2.05rem] lg:text-[2.15rem]"
              >
                {seo.h1}
              </h1>
              <p className="mt-6 text-[15px] leading-[1.75] text-slate-600 md:text-[17px] md:leading-[1.78]">
                {contactPageIntro}
              </p>

              <div className="mt-12 space-y-10 border-t border-slate-200/80 pt-10">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-[#1a3553]">Get in touch</h2>
                  <ul className="mt-5 space-y-4">
                    <li>
                      <a
                        href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                        className="group flex items-start gap-4 rounded-xl border border-transparent p-1 transition hover:border-slate-200/80 hover:bg-white/60"
                      >
                        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-[#1a3553] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition group-hover:border-[#31C950]/40 group-hover:text-[#31C950]">
                          <IconPhone className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0 pt-1">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Phone
                          </span>
                          <span className="mt-1 block text-[17px] font-semibold tabular-nums text-[#1a3553] transition group-hover:text-[#142a42]">
                            {contactInfo.phone}
                          </span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="group flex items-start gap-4 rounded-xl border border-transparent p-1 transition hover:border-slate-200/80 hover:bg-white/60"
                      >
                        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-[#1a3553] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition group-hover:border-[#31C950]/40 group-hover:text-[#31C950]">
                          <IconMail className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0 pt-1">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Email
                          </span>
                          <span className="mt-1 block break-all text-[16px] font-semibold text-[#1a3553] underline decoration-slate-200 underline-offset-[5px] transition group-hover:decoration-[#31C950]/60">
                            {contactInfo.email}
                          </span>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-[#1a3553]">
                    <IconClock className="h-5 w-5 text-[#31C950]" />
                    Hours
                  </h2>
                  <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-slate-600">
                    {contactInfo.hoursLines.map((row) => (
                      <li key={row.label} className="flex flex-wrap gap-x-2 gap-y-1">
                        <span className="min-w-[5.5rem] font-medium text-slate-700">{row.label}</span>
                        <span className="text-slate-600">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:pt-1">
              <div className="relative rounded-[1.35rem] border border-slate-200/90 bg-white/95 p-7 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.45),0_0_0_1px_rgba(15,23,42,0.04)] sm:p-9 md:p-10">
                <div
                  className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(49,201,80,0.12),transparent_42%,transparent)] opacity-90"
                  aria-hidden
                />
                <div className="relative">
                  <p className="text-[15px] leading-relaxed text-slate-600 md:text-[16px]">
                    Fill out the form below and our property consultant will contact you shortly.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="contact-name" className="text-[12px] font-semibold text-slate-700">
                          Your name
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          value={form.name}
                          onChange={handleChange('name')}
                          placeholder="Your name"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-[15px] text-slate-900 outline-none ring-[#31C950]/0 transition placeholder:text-slate-400 focus:border-[#31C950]/50 focus:bg-white focus:ring-4 focus:ring-[#31C950]/12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contact-email" className="text-[12px] font-semibold text-slate-700">
                          Your email
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={form.email}
                          onChange={handleChange('email')}
                          placeholder="Your email"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#31C950]/50 focus:bg-white focus:ring-4 focus:ring-[#31C950]/12"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="contact-phone" className="text-[12px] font-semibold text-slate-700">
                          Phone number
                        </label>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={handleChange('phone')}
                          placeholder="Phone number"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#31C950]/50 focus:bg-white focus:ring-4 focus:ring-[#31C950]/12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contact-service" className="text-[12px] font-semibold text-slate-700">
                          Service
                        </label>
                        <div className="relative">
                          <select
                            id="contact-service"
                            name="service"
                            required
                            value={form.service}
                            onChange={handleChange('service')}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pr-10 text-[15px] text-slate-900 outline-none transition focus:border-[#31C950]/50 focus:bg-white focus:ring-4 focus:ring-[#31C950]/12"
                          >
                            {serviceOptions.map((opt) => (
                              <option key={opt.value || 'placeholder'} value={opt.value} disabled={opt.value === ''}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-message" className="text-[12px] font-semibold text-slate-700">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange('message')}
                        placeholder="Message"
                        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#31C950]/50 focus:bg-white focus:ring-4 focus:ring-[#31C950]/12"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-2 sm:items-stretch">
                      <button
                        type="submit"
                        className="w-full rounded-full bg-[#2563eb] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_40px_-18px_rgba(37,99,235,0.45)] transition hover:bg-[#1d4ed8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31C950] sm:mx-auto sm:w-auto sm:min-w-[200px]"
                      >
                        Send
                      </button>
                      {status === 'sent' ? (
                        <p className="text-center text-[13px] text-slate-500" role="status">
                          Thank you — your message has been noted. We will respond shortly.
                        </p>
                      ) : (
                        <p className="text-center text-[12px] text-slate-400">
                          Prefer a call? Reach us directly at{' '}
                          <a className="font-medium text-[#1a3553] underline decoration-slate-200 underline-offset-2 hover:text-[#31C950]" href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                            {contactInfo.phone}
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map + visit */}
      <section className="bg-white" aria-labelledby="visit-heading">
        <div className="container-shell px-4 py-16 sm:px-6 md:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-16">
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[1.25rem] border border-slate-200/90 bg-slate-100 shadow-[0_28px_70px_-32px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/[0.04] md:rounded-2xl">
                <div className="aspect-[4/3] min-h-[260px] w-full sm:aspect-[16/10] md:min-h-[320px]">
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
              <p className="mt-3 text-[11px] text-slate-400">
                Map data © Google — for reference only; confirm routes before travel.
              </p>
            </div>

            <div className="order-1 lg:order-2 lg:pl-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#31C950]">Location</p>
              <h2
                id="visit-heading"
                className="mt-3 font-[Poppins,Manrope,system-ui,sans-serif] text-2xl font-semibold tracking-[-0.03em] text-[#1a3553] sm:text-[1.75rem] md:text-[2rem]"
              >
                Visit us
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-500 md:text-base">
                Gulberg Expressway — centrally connected within Islamabad. Our sales office welcomes walk-ins during business
                hours; Sundays by appointment.
              </p>
              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/80 px-6 py-6 md:px-7 md:py-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-400">Address</p>
                <p className="mt-3 text-[16px] font-medium leading-[1.65] text-[#1a3553] md:text-[17px]">
                  {contactInfo.address}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-[13px] font-semibold text-[#1a3553] shadow-[0_2px_12px_rgba(15,23,42,0.06)] transition hover:border-[#31C950]/45 hover:bg-[#31C950]/[0.06]"
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
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#31C950] px-6 py-3.5 text-[13px] font-semibold text-white shadow-[0_12px_36px_-16px_rgba(49,201,80,0.65)] transition hover:bg-[#28b048]"
                >
                  Call now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs

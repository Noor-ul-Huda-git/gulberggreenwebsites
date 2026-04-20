import { IconPhone, IconWhatsApp } from '../properties/PropertyIcons.jsx'
import { contactInfo } from '../../data/siteContent.js'

function normalizeWaNumber(phone) {
  let d = String(phone || '').replace(/\D/g, '')
  if (d.startsWith('0')) d = d.slice(1)
  if (d.startsWith('92')) return d
  if (d.length === 10) return `92${d}`
  return d
}

const defaultWaText =
  'Assalam o Alaikum, I would like more information about Gulberg Greens Islamabad.'

/**
 * Fixed Call + WhatsApp — scrolls with viewport (position: fixed).
 * Mobile: stacked on the right, vertically in the thumb-reach band.
 * Desktop: lower-right corner.
 * Light, outlined FAB style (differs from Property Detail sidebar CTAs).
 */
function FloatingContactActions() {
  const tel = contactInfo.phone.replace(/\s/g, '')
  const wa = `https://wa.me/${normalizeWaNumber(contactInfo.phone)}?text=${encodeURIComponent(defaultWaText)}`

  const fabBase =
    'pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border shadow-[0_4px_24px_-6px_rgba(15,23,42,0.12)] backdrop-blur-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] sm:h-[3.625rem] sm:w-[3.625rem]'

  return (
    <div
      className="pointer-events-none fixed z-[90] flex flex-col gap-3 max-sm:right-[max(0.75rem,env(safe-area-inset-right))] max-sm:top-[58%] max-sm:-translate-y-1/2 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-[max(1rem,env(safe-area-inset-right))] sm:top-auto sm:translate-y-0"
      role="region"
      aria-label="Quick contact"
    >
      <a
        href={`tel:${tel}`}
        className={`${fabBase} group border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.14)] hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400`}
        aria-label={`Call ${contactInfo.phone}`}
      >
        <IconPhone
          className="text-[#94a3b8] transition-colors group-hover:text-[#31C950]"
          size="h-[23px] w-[23px]"
          strokeWidth={2}
        />
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={`${fabBase} border-emerald-200/90 bg-emerald-50/95 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-emerald-400/80`}
        aria-label="Chat on WhatsApp"
      >
        <IconWhatsApp className="text-emerald-600/90" size="h-[22px] w-[22px]" />
      </a>
    </div>
  )
}

export default FloatingContactActions

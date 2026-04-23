import { IconPhone, IconWhatsAppBrand } from '../properties/PropertyIcons.jsx'
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
 * Call: light FAB. WhatsApp: brand green, filled logomark, stronger shadow (readable on any hero).
 */
function FloatingContactActions() {
  const tel = contactInfo.phone.replace(/\s/g, '')
  const wa = `https://wa.me/${normalizeWaNumber(contactInfo.phone)}?text=${encodeURIComponent(defaultWaText)}`

  const fabCall =
    'pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#31C950]/35 bg-white shadow-[0_6px_28px_-8px_rgba(15,23,42,0.2)] backdrop-blur-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] sm:h-[3.625rem] sm:w-[3.625rem]'

  const fabWa =
    'pointer-events-auto flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border-2 border-[#128C7E]/90 bg-[#25D366] text-white shadow-[0_10px_36px_-6px_rgba(37,211,102,0.65),0_4px_16px_-4px_rgba(15,23,42,0.2)] transition hover:bg-[#20BD5A] hover:shadow-[0_12px_40px_-6px_rgba(37,211,102,0.72)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] active:scale-[0.97] sm:h-16 sm:w-16'

  return (
    <div
      className="pointer-events-none fixed z-[90] flex flex-col gap-3 max-sm:right-[max(0.75rem,env(safe-area-inset-right))] max-sm:top-[58%] max-sm:-translate-y-1/2 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-[max(1rem,env(safe-area-inset-right))] sm:top-auto sm:translate-y-0"
      role="region"
      aria-label="Quick contact"
    >
      <a
        href={`tel:${tel}`}
        className={`${fabCall} group hover:border-[#31C950]/55 hover:shadow-[0_8px_32px_-8px_rgba(49,201,80,0.25)] focus-visible:outline-[#31C950]/60`}
        aria-label={`Call ${contactInfo.phone}`}
      >
        <IconPhone
          className="text-[#31C950] transition-colors group-hover:text-[#28b048]"
          size="h-[24px] w-[24px]"
          strokeWidth={2}
        />
      </a>
      <a
      style={{border: '0px'}}
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={fabWa}
        aria-label="Chat on WhatsApp"
      >
        <IconWhatsAppBrand className="text-white" size="h-[30px] w-[30px] sm:h-8 sm:w-8" />
      </a>
    </div>
  )
}

export default FloatingContactActions

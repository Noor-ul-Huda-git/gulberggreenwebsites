/** Thin stroke icons — GOODHAUS / editorial listing style */

/**
 * Always applies explicit dimensions + shrink-0 so passing only color utilities
 * (e.g. `text-[#31C950]`) cannot strip width/height and blow up the SVG layout.
 */
function svgIconClass(className, size = 'h-[18px] w-[18px]') {
  return `inline-block shrink-0 ${size} ${className ?? ''}`.trim()
}

export function IconBed({ className, size = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 12V19M4 12C4 10.5 5.5 9 8 9h8c2.5 0 4 1.5 4 3v7M4 12H2M20 12h2" strokeLinecap="round" />
      <path d="M8 9V7a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBath({ className, size = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        d="M6 12h15v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zM6 12V9a2 2 0 012-2h1M6 12H3M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconRuler({ className, size = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 20L20 4M8 4h2M14 4h2M4 14v2M4 8v2M14 20h2M8 20h2M20 8v2M20 14v2" strokeLinecap="round" />
    </svg>
  )
}

export function IconBuilding({ className, size = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18M6 22H4a1 1 0 01-1-1v-6M6 22h12M18 22h2a1 1 0 001-1v-6M10 6h4M10 10h4M10 14h1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPin({ className, size = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 22s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconChevronLeft({ className, size = 'h-6 w-6' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconChevronRight({ className, size = 'h-6 w-6' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPhone({ className, size = 'h-[18px] w-[18px]', strokeWidth = 1.5 }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden>
      <path
        d="M15.5 14.2l2.85 2.85a1.2 1.2 0 010 1.7l-1.5 1.5a12 12 0 01-12.8-12.8l1.52-1.5a1.2 1.2 0 011.68 0l2.9 2.85a1.2 1.2 0 010 1.7l-2.02 2.02a8 8 0 003.57 3.58l2.02-2.02a1.2 1.2 0 011.7 0z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Outline chat bubble — floating WhatsApp FAB; matches thin editorial icon set. */
export function IconWhatsApp({ className, size = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        d="M20.5 12a8.5 8.5 0 01-8.5 8.5c-1.55 0-3-.4-4.25-1.1L3.5 21l1.65-3.85A8.45 8.45 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 018.5 8.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Filled WhatsApp logomark (bubble + phone). Use with `text-white` on brand green (#25D366) buttons. */
export function IconWhatsAppBrand({ className, size = 'h-[26px] w-[26px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  )
}

export function IconMail({ className, size = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 6.75h16v10.5H4V6.75z" strokeLinejoin="round" />
      <path d="M4.6 7.35L12 12.2l7.45-4.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCalendar({ className, size = 'h-[18px] w-[18px]' }) {
  return (
    <svg className={svgIconClass(className, size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M7.5 4.5v2M16.5 4.5v2M4.5 9h15M6 4.5h12a1.5 1.5 0 011.5 1.5v13a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

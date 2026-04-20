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

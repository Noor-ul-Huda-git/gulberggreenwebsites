import { Link } from 'react-router-dom'

/**
 * Accessible breadcrumb trail. Last item should omit `to` (current page).
 * Uses `!text-*` on links so colors win over global `a { color: inherit }` in index.css.
 *
 * @param {{ to?: string, label: string }[]} items
 * @param {'onDark' | 'onLight'} variant — hero (dark scrim) vs content areas
 */
function PageBreadcrumbs({ items, variant = 'onLight', className = '' }) {
  if (!items?.length) return null

  const isDark = variant === 'onDark'
  const sepClass = isDark ? 'text-[#31C950]/45' : 'text-[#31C950]/35'
  const linkClass = isDark
    ? '!text-[#86efac] transition [text-shadow:0_1px_10px_rgba(0,0,0,0.45)] hover:!text-[#bbf7d0] focus-visible:rounded-sm focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-[#31C950]'
    : '!text-[#31C950] transition hover:!text-[#28b048] focus-visible:rounded-sm focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-[#31C950]'
  const currentClass = isDark
    ? 'font-semibold !text-[#4ade80] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]'
    : 'font-semibold !text-[#15803d]'

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-snug tracking-[-0.01em] md:text-[13.5px]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${i}-${item.label}`} className="flex min-w-0 items-center gap-x-2">
              {i > 0 ? (
                <span className={`select-none font-light ${sepClass}`} aria-hidden>
                  /
                </span>
              ) : null}
              {isLast || !item.to ? (
                <span className={`min-w-0 truncate ${currentClass}`} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className={`min-w-0 truncate ${linkClass}`}>
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default PageBreadcrumbs

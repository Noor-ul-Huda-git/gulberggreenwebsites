import heroBg from '../../assets/nbgn.jpg'

/**
 * @param {'light' | 'dark'} overlay — `light` matches home hero; `dark` adds a legible scrim for white hero text + light nav.
 */
function PageHero({ children, className = '', sectionClassName = '', overlay = 'light' }) {
  const isDark = overlay === 'dark'

  return (
    <section
      className={`relative min-h-[min(48vh,520px)] w-full overflow-hidden md:min-h-[min(52vh,580px)] ${sectionClassName}`}
    >
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Base overlay */}
      <div
        className={
          isDark
            ? 'absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60'
            : 'absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/35'
        }
        aria-hidden
      />
      {/* Extra top scrim so the absolute header + first line of hero stay readable on any photo */}
      {isDark ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent md:h-48"
          aria-hidden
        />
      ) : null}

      <div className={`relative z-10 ${className}`}>{children}</div>
    </section>
  )
}

export default PageHero

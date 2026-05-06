import { useEffect, useRef, useState } from 'react'

const LIST_CLASS =
  'flex shrink-0 items-center gap-10 py-4 pl-4 pr-4 md:gap-14 md:pl-6 md:pr-6 lg:gap-16 lg:py-5'

const FIGURE_CLASS =
  'm-0 flex h-24 w-32 items-center justify-center sm:h-28 sm:w-36 md:h-32 md:w-44 lg:h-36 lg:w-48'

const IMG_CLASS =
  'max-h-full w-auto max-w-full object-contain opacity-90 transition duration-300 hover:opacity-100'

/** px/s when not dragging */
const SPEED_DEFAULT = -52

function LogoMarquee({ logos }) {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const draggingRef = useRef(false)
  const lastPointerXRef = useRef(0)
  const rafRef = useRef(0)
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (prefersReduced) return undefined
    const track = trackRef.current
    if (!track) return undefined

    let last = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const loopW = track.scrollWidth / 2
      if (loopW <= 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (!draggingRef.current) {
        offsetRef.current += SPEED_DEFAULT * dt
        offsetRef.current = ((offsetRef.current % loopW) + loopW) % loopW
        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [prefersReduced])

  const applyOffsetDelta = (dx) => {
    const track = trackRef.current
    if (!track) return
    const loopW = track.scrollWidth / 2
    if (loopW <= 0) return
    offsetRef.current -= dx
    offsetRef.current = ((offsetRef.current % loopW) + loopW) % loopW
    track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`
  }

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = true
    lastPointerXRef.current = e.clientX
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastPointerXRef.current
    lastPointerXRef.current = e.clientX
    applyOffsetDelta(dx)
  }

  const endDrag = (e) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const onLostPointerCapture = () => {
    draggingRef.current = false
  }

  return (
    <div
      className={
        prefersReduced
          ? 'relative overflow-hidden'
          : 'relative cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing'
      }
      role={!prefersReduced ? 'region' : undefined}
      aria-label={!prefersReduced ? 'Logo strip. Click and drag to scroll horizontally.' : undefined}
      {...(!prefersReduced
        ? {
            onPointerDown,
            onPointerMove,
            onPointerUp: endDrag,
            onPointerCancel: endDrag,
            onLostPointerCapture,
          }
        : {})}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-16 md:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-16 md:w-24"
        aria-hidden
      />

      <div className="overflow-hidden py-2">
        {prefersReduced ? (
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-4 md:gap-x-14 lg:gap-x-16">
            {logos.map((logo) => (
              <li key={logo.src} className="flex list-none">
                <figure className={FIGURE_CLASS}>
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={IMG_CLASS}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <div ref={trackRef} className="logo-marquee-track flex w-max will-change-transform">
            {[0, 1].map((dup) => (
              <ul key={dup} className={LIST_CLASS} aria-hidden={dup === 1}>
                {logos.map((logo) => (
                  <li key={`${dup}-${logo.src}`} className="flex list-none shrink-0">
                    <figure className={FIGURE_CLASS}>
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className={IMG_CLASS}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LogoMarquee

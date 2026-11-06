'use client'

import { useEffect, useRef, useState } from 'react'

/* Har logo ek safed "tile" card mein — emerald homepage design */
const LIST_CLASS = 'flex shrink-0 items-center gap-[18px] py-2 pr-[18px]'

const FIGURE_CLASS =
  'm-0 flex h-20 w-[130px] items-center justify-center rounded-2xl border border-[#D3ECE0] bg-white p-3 md:h-[100px] md:w-[170px]'

const IMG_CLASS =
  'max-h-full w-auto max-w-full object-contain opacity-90 transition duration-300 hover:opacity-100'

/** Edges par logos dheere se gayab hon (kisi bhi background par chalta hai) */
const EDGE_FADE =
  'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)'

/** px/s when not dragging */
const SPEED_DEFAULT = -52

/**
 * reverse = true → strip ulti direction mein chalti hai (approvals wali strip).
 */
function LogoMarquee({ logos, reverse = false, label }) {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const draggingRef = useRef(false)
  const hoverRef = useRef(false)
  const lastPointerXRef = useRef(0)
  const rafRef = useRef(0)
  const [prefersReduced, setPrefersReduced] = useState(false)

  const speed = reverse ? -SPEED_DEFAULT : SPEED_DEFAULT

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

      // Mouse upar ho to strip ruk jati hai (design ke mutabiq)
      if (!draggingRef.current && !hoverRef.current) {
        offsetRef.current += speed * dt
        offsetRef.current = ((offsetRef.current % loopW) + loopW) % loopW
        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [prefersReduced, speed])

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

  const onPointerEnter = (e) => {
    if (e.pointerType === 'mouse') hoverRef.current = true
  }

  const onPointerLeave = () => {
    hoverRef.current = false
  }

  return (
    <div
      className={
        prefersReduced
          ? 'relative w-full min-w-0 overflow-hidden'
          : 'relative w-full min-w-0 cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing'
      }
      style={
        prefersReduced
          ? undefined
          : { WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }
      }
      role={!prefersReduced ? 'region' : undefined}
      aria-label={
        !prefersReduced
          ? label || 'Logo strip. Click and drag to scroll horizontally.'
          : undefined
      }
      {...(!prefersReduced
        ? {
            onPointerDown,
            onPointerMove,
            onPointerUp: endDrag,
            onPointerCancel: endDrag,
            onLostPointerCapture,
            onPointerEnter,
            onPointerLeave,
          }
        : {})}
    >
      {prefersReduced ? (
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-[18px] p-0 py-2">
          {logos.map((logo, index) => (
            <li key={`${index}-${logo.src}`} className="flex list-none">
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
        <div
          ref={trackRef}
          className="logo-marquee-track flex w-max will-change-transform"
        >
          {[0, 1].map((dup) => (
            <ul
              key={dup}
              className={`m-0 list-none p-0 ${LIST_CLASS}`}
              aria-hidden={dup === 1}
            >
              {logos.map((logo, index) => (
                <li
                  key={`${dup}-${index}-${logo.src}`}
                  className="flex shrink-0 list-none"
                >
                  <figure className={FIGURE_CLASS}>
                    <img
                      src={logo.src}
                      alt={dup === 1 ? '' : logo.alt}
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
  )
}

export default LogoMarquee
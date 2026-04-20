import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { shouldShowWelcomeBannerOnMount } from './welcomeBannerSession.js'

const MotionBanner = motion.div

/** Visible hold before exit starts (ms) — site is already painted underneath */
const VISIBLE_MS = 1000
/** Slide-out upward — reveals page below */
const EXIT_DURATION = 0.65

function WelcomeBanner() {
  const [show, setShow] = useState(shouldShowWelcomeBannerOnMount)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!show) return undefined
    const delay = reduceMotion ? Math.min(VISIBLE_MS, 700) : VISIBLE_MS
    const id = window.setTimeout(() => setShow(false), delay)
    return () => window.clearTimeout(id)
  }, [reduceMotion, show])

  useEffect(() => {
    if (!show) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [show])

  const ease = [0.25, 0.1, 0.25, 1]
  const initial = reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }

  const animate = reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }

  const exit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }
    : {
        y: '-100%',
        opacity: 1,
        transition: { duration: EXIT_DURATION, ease },
      }

  const transition = reduceMotion ? { duration: 0 } : { duration: 0 }

  return (
    <AnimatePresence>
      {show ? (
        <MotionBanner
          key="welcome-banner"
          className="fixed inset-0 z-[100] flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,rgba(15,23,42,0.72)_0%,rgba(255,255,255,0.04)_48%,rgba(15,23,42,0.66)_100%)] px-6 backdrop-blur-[3px] supports-[backdrop-filter]:bg-[linear-gradient(180deg,rgba(15,23,42,0.62)_0%,rgba(255,255,255,0.03)_48%,rgba(15,23,42,0.56)_100%)]"
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          style={reduceMotion ? undefined : { willChange: 'transform' }}
          role="status"
          aria-labelledby="welcome-banner-title"
          aria-live="polite"
        >
          <p
            id="welcome-banner-title"
            className="petit-formal-script-regular m-0 max-w-5xl text-center text-white [text-shadow:0_2px_24px_rgba(15,23,42,0.55),0_0_36px_rgba(0,0,0,0.25)]"
          >
            <span className="text-6xl tracking-normal sm:text-7xl md:text-8xl lg:text-9xl">
              Gulberg
            </span>
            <span className="text-6xl tracking-normal text-[#31C950] sm:text-7xl md:text-8xl lg:text-9xl [text-shadow:0_2px_20px_rgba(15,23,42,0.5),0_0_28px_rgba(49,201,80,0.35)]">
              {' '}
              Greens
            </span>
            <span className="mt-6 block text-xl tracking-normal text-slate-200 sm:text-2xl md:mt-7 md:text-3xl [text-shadow:0_1px_16px_rgba(15,23,42,0.45)]">
              Islamabad
            </span>
          </p>
        </MotionBanner>
      ) : null}
    </AnimatePresence>
  )
}

export default WelcomeBanner

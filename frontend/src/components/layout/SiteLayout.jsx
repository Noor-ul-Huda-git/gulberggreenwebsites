import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation, useRoutes } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { appRouteObjects } from '../../appRoutes.jsx'
import FloatingContactActions from './FloatingContactActions.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import WelcomeBanner from './WelcomeBanner.jsx'
import { markClientNavigationToHome } from './welcomeBannerSession.js'

const MotionPage = motion.div

const isHomePath = (p) => p === '/' || p === ''

function SiteLayout() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const locationRef = useRef(location)
  /** Must run before WelcomeBanner mounts: effects run too late for its useState initializer. */
  const prevPathnameRef = useRef(location.pathname)
  const pathname = location.pathname
  const prevPathname = prevPathnameRef.current
  if (!isHomePath(prevPathname) && isHomePath(pathname)) {
    markClientNavigationToHome()
  }
  prevPathnameRef.current = pathname

  useEffect(() => {
    locationRef.current = location
  }, [location])

  /** SPA navigations keep scroll position by default — reset to top when the path changes (e.g. listing → property detail). */
  useLayoutEffect(() => {
    const html = document.documentElement
    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = prevBehavior
  }, [pathname])

  /**
   * `displayLocation` lags real `location` during pathname transitions (exit animation).
   * For the same pathname, keep it in sync when only search/hash change (e.g. news pagination).
   */
  useEffect(() => {
    if (
      location.pathname === displayLocation.pathname &&
      (location.search !== displayLocation.search || location.hash !== displayLocation.hash)
    ) {
      setDisplayLocation(location)
    }
  }, [location, displayLocation.pathname, displayLocation.search, displayLocation.hash])

  const element = useRoutes(appRouteObjects, displayLocation)

  const isHomePage = pathname === '/' || pathname === ''
  /** Listing-only: dark hero + full bleed. Detail `/properties/:slug` uses padded main + light header. */
  const isPropertiesListing = pathname === '/properties' || pathname === '/properties/'
  const isContactPage = pathname === '/contact-us' || pathname === '/contact-us/'
  const isPropertyRoute = pathname.startsWith('/properties')
  const showFloatingContact = !isHomePage && !isPropertyRoute && !isContactPage
  /** Header is overlay. Full-bleed heroes (home, news, map) start at the top; others need main offset so content clears the bar. */
  const mainTopPad =
    pathname !== '/' &&
    !pathname.startsWith('/news') &&
    !pathname.startsWith('/gulberg-map') &&
    !isPropertiesListing
      ? 'pt-[5.75rem] md:pt-24'
      : ''

  const reduceMotion = useReducedMotion()
  /** Fade only — avoids slide motion site-wide (better for accessibility & calmer UX). */
  const pageTransition = { duration: reduceMotion ? 0.12 : 0.22, ease: 'easeOut' }

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <div className="page-shell">
      <Header />
      <main className={mainTopPad}>
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => setDisplayLocation(locationRef.current)}
        >
          <MotionPage
            key={location.pathname}
            className="w-full"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            {element}
          </MotionPage>
        </AnimatePresence>
      </main>
      <Footer />
      {showFloatingContact ? <FloatingContactActions /> : null}
      {/** Full-screen welcome splash only on the home route */}
      {isHomePage ? <WelcomeBanner /> : null}
    </div>
  )
}

export default SiteLayout

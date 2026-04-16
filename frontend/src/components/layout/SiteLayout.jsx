import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation, useRoutes } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { appRouteObjects } from '../../appRoutes.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import WelcomeBanner from './WelcomeBanner.jsx'

const MotionPage = motion.div

function SiteLayout() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const locationRef = useRef(location)
  useEffect(() => {
    locationRef.current = location
  }, [location])

  const element = useRoutes(appRouteObjects, displayLocation)

  const { pathname } = location
  /** Listing-only: dark hero + full bleed. Detail `/properties/:slug` uses padded main + light header. */
  const isPropertiesListing = pathname === '/properties' || pathname === '/properties/'
  /** Header is overlay. Full-bleed heroes (home, news, map) start at the top; others need main offset so content clears the bar. */
  const mainTopPad =
    pathname !== '/' &&
    !pathname.startsWith('/news') &&
    !pathname.startsWith('/gulberg-map') &&
    !isPropertiesListing
      ? 'pt-[5.75rem] md:pt-24'
      : ''

  const reduceMotion = useReducedMotion()
  const pageTransition = reduceMotion
    ? { duration: 0.15, ease: 'easeOut' }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }

  const pageVariants = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
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
      {/** Full-screen splash last in DOM / z-[100] so the route paints underneath, then reveals on exit */}
      <WelcomeBanner />
    </div>
  )
}

export default SiteLayout

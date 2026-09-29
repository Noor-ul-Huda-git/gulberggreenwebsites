import { useLocation, useRoutes } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
import { appRouteObjects } from '../../appRoutes.jsx'
import { isPropertiesListingExplorerPath } from '../../data/propertyListingTypes.js'
import FloatingContactActions from './FloatingContactActions.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
// import WelcomeBanner from './WelcomeBanner.jsx'
// import { markClientNavigationToHome } from './welcomeBannerSession.js'

// const isHomePath = (p) => p === '/' || p === ''

function SiteLayout() {
  const location = useLocation()
  /** WelcomeBanner (disabled): run before banner mounts for session flag. */
  // const prevPathnameRef = useRef(location.pathname)
  const pathname = location.pathname
  // const prevPathname = prevPathnameRef.current
  // if (!isHomePath(prevPathname) && isHomePath(pathname)) {
  //   markClientNavigationToHome()
  // }
  // prevPathnameRef.current = pathname

  /**
   * Reset scroll on route change, except when navigating to an in-page hash (e.g. /#home-faq-heading).
   * Hash targets are scrolled in a follow-up effect so the destination section can mount first.
   */
  useLayoutEffect(() => {
    if (location.hash) return
    const html = document.documentElement
    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = prevBehavior
  }, [pathname, location.hash])

  useEffect(() => {
    const id = location.hash.replace(/^#/, '')
    if (!id) return undefined
    const scrollToTarget = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const t = window.setTimeout(scrollToTarget, 80)
    const t2 = window.setTimeout(scrollToTarget, 400)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
    }
  }, [pathname, location.hash])

  const element = useRoutes(appRouteObjects)

  /** Listing explorer (/properties… with filters + dark hero) — padded main skips so header overlays hero like /properties. */
  const isPropertiesListing = isPropertiesListingExplorerPath(pathname)
  const isContactPage = pathname === '/contact' || pathname === '/contact/' || pathname === '/contact-us' || pathname === '/contact-us/'
  const isPropertyRoute = pathname.startsWith('/properties')
  /** Home + inner pages; omitted on `/properties/*` (listing/detail have inline CTAs) and contact page. */
  const showFloatingContact = !isPropertyRoute && !isContactPage
  /** Header is overlay. Full-bleed heroes (home, news, map) start at the top; others need main offset so content clears the bar. */
  const mainTopPad =
    pathname === '/'
      ? 'pt-[4.75rem] md:pt-0'
      : pathname !== '/' &&
    !pathname.startsWith('/news') &&
    !pathname.startsWith('/latest-updates') &&
    !pathname.startsWith('/gulberg-map') &&
    !isPropertiesListing
      ? 'pt-[5.75rem] md:pt-24'
      : ''

  return (
    <div className="page-shell">
      <Header />
      <main className={mainTopPad}>{element}</main>
      <Footer />
      {showFloatingContact ? <FloatingContactActions /> : null}
      {/** Full-screen welcome splash only on the home route (temporarily disabled) */}
      {/* {isHomePage ? <WelcomeBanner /> : null} */}
    </div>
  )
}

export default SiteLayout

import { lazy, Suspense } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { appPath } from './lib/appPaths.js'

const ContactUs = lazy(() => import('./pages/ContactUs.jsx'))
const GulbergMap = lazy(() => import('./pages/GulbergMap.jsx'))
const NewsArticle = lazy(() => import('./pages/NewsArticle.jsx'))
const NewsIndex = lazy(() => import('./pages/NewsIndex.jsx'))
const Properties = lazy(() => import('./pages/Properties.jsx'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail.jsx'))
const PropertyRouteResolver = lazy(() => import('./pages/PropertyRouteResolver.jsx'))

function withSuspense(element) {
  return <Suspense fallback={<div className="min-h-[20vh] bg-white" />}>{element}</Suspense>
}

/** Client-side 301-style redirect to the same path with a trailing slash. */
function AppendTrailingSlashRedirect() {
  const { pathname, search, hash } = useLocation()
  const target = pathname.endsWith('/') ? pathname : `${pathname}/`
  return <Navigate to={{ pathname: target, search, hash }} replace />
}

/** Flat route objects for `useRoutes(routes, displayLocation)` — order: specific before wildcard. */
export const appRouteObjects = [
  { path: '/', element: <Home /> },
  { path: '/latest-updates/', element: withSuspense(<NewsIndex />) },
  { path: '/latest-updates/:slug/', element: withSuspense(<NewsArticle />) },
  { path: '/latest-updates', element: <AppendTrailingSlashRedirect /> },
  { path: '/latest-updates/:slug', element: <AppendTrailingSlashRedirect /> },
  { path: '/news/', element: <Navigate to="/latest-updates/" replace /> },
  { path: '/news', element: <Navigate to="/latest-updates/" replace /> },
  { path: '/news/:slug/', element: withSuspense(<NewsArticle />) },
  { path: '/news/:slug', element: <AppendTrailingSlashRedirect /> },
  { path: '/gulberg-map/', element: withSuspense(<GulbergMap />) },
  { path: '/gulberg-map', element: <AppendTrailingSlashRedirect /> },
  { path: '/contact/', element: withSuspense(<ContactUs />) },
  { path: '/contact', element: <AppendTrailingSlashRedirect /> },
  { path: '/contact-us/', element: <Navigate to="/contact/" replace /> },
  { path: '/contact-us', element: <Navigate to="/contact/" replace /> },
  { path: '/properties/', element: withSuspense(<Properties />) },
  { path: '/properties/all/', element: withSuspense(<Properties />) },
  { path: '/properties/plots/', element: withSuspense(<Properties />) },
  { path: '/properties/flat/', element: withSuspense(<Properties />) },
  { path: '/properties/commercial-plots/', element: withSuspense(<Properties />) },
  { path: '/properties/farm-house/', element: withSuspense(<Properties />) },
  { path: '/properties/office/', element: withSuspense(<Properties />) },
  { path: '/properties/shop/', element: withSuspense(<Properties />) },
  { path: '/properties/house/', element: withSuspense(<Properties />) },
  { path: '/properties/:categorySlug/:block/:slug/', element: withSuspense(<PropertyDetail />) },
  { path: '/properties/:categorySlug/:slug/', element: withSuspense(<PropertyRouteResolver />) },
  { path: '/properties/:slug/', element: withSuspense(<PropertyDetail />) },
  { path: '/properties/:categorySlug/:block/:slug', element: <AppendTrailingSlashRedirect /> },
  { path: '/properties/:categorySlug/:slug', element: <AppendTrailingSlashRedirect /> },
  { path: '/properties/:slug', element: <AppendTrailingSlashRedirect /> },
  { path: '/properties', element: <Navigate to={appPath('properties')} replace /> },
  { path: '*', element: <Navigate to="/" replace /> },
]

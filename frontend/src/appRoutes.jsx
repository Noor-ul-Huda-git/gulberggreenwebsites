import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'

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

/** Flat route objects for `useRoutes(routes, displayLocation)` — order: specific before wildcard. */
export const appRouteObjects = [
  { path: '/', element: <Home /> },
  { path: '/latest-updates', element: withSuspense(<NewsIndex />) },
  { path: '/latest-updates/:slug', element: withSuspense(<NewsArticle />) },
  { path: '/news', element: <Navigate to="/latest-updates" replace /> },
  { path: '/news/:slug', element: withSuspense(<NewsArticle />) },
  { path: '/gulberg-map', element: withSuspense(<GulbergMap />) },
  { path: '/contact', element: withSuspense(<ContactUs />) },
  { path: '/contact-us', element: <Navigate to="/contact" replace /> },
  { path: '/properties', element: withSuspense(<Properties />) },
  { path: '/properties/plots', element: withSuspense(<Properties />) },
  { path: '/properties/flat', element: withSuspense(<Properties />) },
  { path: '/properties/commercial-plots', element: withSuspense(<Properties />) },
  { path: '/properties/farm-house', element: withSuspense(<Properties />) },
  { path: '/properties/office', element: withSuspense(<Properties />) },
  { path: '/properties/shop', element: withSuspense(<Properties />) },
  { path: '/properties/house', element: withSuspense(<Properties />) },
  { path: '/properties/:categorySlug/:block/:slug', element: withSuspense(<PropertyDetail />) },
  { path: '/properties/:categorySlug/:slug', element: withSuspense(<PropertyRouteResolver />) },
  { path: '/properties/:slug', element: withSuspense(<PropertyDetail />) },
  { path: '*', element: <Navigate to="/" replace /> },
]

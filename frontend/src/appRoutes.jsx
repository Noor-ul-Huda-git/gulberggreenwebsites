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

function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
      <a href="/" className="mt-6 inline-block font-medium text-[#1a3553] underline">
        Back to home
      </a>
    </div>
  )
}

/**
 * Canonical trailing-slash routes only. Legacy URL 301s and slash normalization are handled by
 * nginx (`deploy/nginx-legacy-*.conf`, `nginx-trailing-slash.conf`) and Django `seo_redirects.py`.
 */
export const appRouteObjects = [
  { path: '/', element: <Home /> },
  { path: '/latest-updates/', element: withSuspense(<NewsIndex />) },
  { path: '/latest-updates/:slug/', element: withSuspense(<NewsArticle />) },
  { path: '/news/:slug/', element: withSuspense(<NewsArticle />) },
  { path: '/gulberg-map/', element: withSuspense(<GulbergMap />) },
  { path: '/contact/', element: withSuspense(<ContactUs />) },
  { path: '/faq/', element: <Navigate to="/#home-faq-heading" replace /> },
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
  { path: '*', element: <NotFound /> },
]

import { Navigate } from 'react-router-dom'
import ContactUs from './pages/ContactUs.jsx'
import GulbergMap from './pages/GulbergMap.jsx'
import Home from './pages/Home.jsx'
import NewsArticle from './pages/NewsArticle.jsx'
import NewsIndex from './pages/NewsIndex.jsx'
import Properties from './pages/Properties.jsx'
import PropertyDetail from './pages/PropertyDetail.jsx'
import PropertyRouteResolver from './pages/PropertyRouteResolver.jsx'

/** Flat route objects for `useRoutes(routes, displayLocation)` — order: specific before wildcard. */
export const appRouteObjects = [
  { path: '/', element: <Home /> },
  { path: '/latest-updates', element: <NewsIndex /> },
  { path: '/latest-updates/:slug', element: <NewsArticle /> },
  { path: '/news', element: <Navigate to="/latest-updates" replace /> },
  { path: '/news/:slug', element: <NewsArticle /> },
  { path: '/gulberg-map', element: <GulbergMap /> },
  { path: '/contact', element: <ContactUs /> },
  { path: '/contact-us', element: <Navigate to="/contact" replace /> },
  { path: '/properties', element: <Properties /> },
  { path: '/properties/plots', element: <Properties /> },
  { path: '/properties/flat', element: <Properties /> },
  { path: '/properties/commercial-plots', element: <Properties /> },
  { path: '/properties/farm-house', element: <Properties /> },
  { path: '/properties/office', element: <Properties /> },
  { path: '/properties/shop', element: <Properties /> },
  { path: '/properties/house', element: <Properties /> },
  { path: '/properties/:categorySlug/:block/:slug', element: <PropertyDetail /> },
  { path: '/properties/:categorySlug/:slug', element: <PropertyRouteResolver /> },
  { path: '/properties/:slug', element: <PropertyDetail /> },
  { path: '*', element: <Navigate to="/" replace /> },
]

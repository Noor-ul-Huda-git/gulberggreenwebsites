import { Navigate } from 'react-router-dom'
import ContactUs from './pages/ContactUs.jsx'
import GulbergMap from './pages/GulbergMap.jsx'
import Home from './pages/Home.jsx'
import NewsArticle from './pages/NewsArticle.jsx'
import NewsIndex from './pages/NewsIndex.jsx'
import Properties from './pages/Properties.jsx'
import PropertyDetail from './pages/PropertyDetail.jsx'

/** Flat route objects for `useRoutes(routes, displayLocation)` — order: specific before wildcard. */
export const appRouteObjects = [
  { path: '/', element: <Home /> },
  { path: '/news', element: <NewsIndex /> },
  { path: '/news/:slug', element: <NewsArticle /> },
  { path: '/gulberg-map', element: <GulbergMap /> },
  { path: '/contact-us', element: <ContactUs /> },
  { path: '/properties', element: <Properties /> },
  { path: '/properties/:slug', element: <PropertyDetail /> },
  { path: '*', element: <Navigate to="/" replace /> },
]

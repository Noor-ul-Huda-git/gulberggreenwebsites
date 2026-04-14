import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout.jsx'
import ContactUs from './pages/ContactUs.jsx'
import GulbergMap from './pages/GulbergMap.jsx'
import Home from './pages/Home.jsx'
import LatestUpdates from './pages/LatestUpdates.jsx'
import Properties from './pages/Properties.jsx'

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/latest-updates" element={<LatestUpdates />} />
        <Route path="/gulberg-map" element={<GulbergMap />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App

import { Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout.jsx'

function App() {
  return (
    <Routes>
      <Route path="*" element={<SiteLayout />} />
    </Routes>
  )
}

export default App
 
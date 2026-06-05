import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { BikeDetail } from './pages/BikeDetail'
import { Compare } from './pages/Compare'
import { Garage } from './pages/Garage'
import { Setup } from './pages/Setup'
import { Routes as RoutesPage } from './pages/Routes'
import { TerrainEnduro } from './pages/TerrainEnduro'
import { Recommendation } from './pages/Recommendation'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/bike/:id" element={<BikeDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/terrain" element={<TerrainEnduro />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/recommendation" element={<Recommendation />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  )
}

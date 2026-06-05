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
            <Route path="/routes" element={<RoutesPage />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  )
}

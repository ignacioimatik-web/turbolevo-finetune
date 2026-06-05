import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { BikeCard } from '../components/BikeCard'

export function Garage() {
  const { bikes, garage } = useAppState()
  const garageBikes = bikes.filter(b => garage.bikes.includes(b.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
          Mi Garaje
        </h1>
        <p className="text-xs text-text-muted font-mono mt-0.5">
          {garage.bikes.length} {garage.bikes.length === 1 ? 'bici guardada' : 'bicis guardadas'}
        </p>
      </div>

      {garageBikes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {garageBikes.map(bike => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 panel">
          <div className="text-5xl mb-4 opacity-10 font-mono">★</div>
          <p className="text-sm text-text-muted mb-2">Tu garaje está vacío</p>
          <p className="text-xs text-text-muted mb-6">
          Guarda tus bicis favoritas desde el catálogo
          </p>
          <Link to="/catalog" className="btn-primary text-xs">
            Explorar catálogo
          </Link>
        </div>
      )}
    </div>
  )
}

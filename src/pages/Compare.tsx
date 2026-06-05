import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { ComparisonTable } from '../components/ComparisonTable'
import { BikeCard } from '../components/BikeCard'

export function Compare() {
  const { bikes, compare } = useAppState()
  const compareBikes = bikes.filter(b => compare.includes(b.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
          Comparador
        </h1>
        <p className="text-xs text-text-muted font-mono mt-0.5">
          Compara hasta 3 modelos lado a lado
        </p>
      </div>

      {compare.length > 0 && compare.length < 3 && (
        <div className="mb-8">
          <p className="text-xs text-text-muted mb-4">
            Añade {3 - compare.length} modelo{compare.length === 2 ? '' : 's'} más desde el catálogo
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bikes
              .filter(b => !compare.includes(b.id))
              .slice(0, 3 - compare.length)
              .map(bike => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
          </div>
        </div>
      )}

      {compareBikes.length > 0 && (
        <div className="panel p-5">
          <ComparisonTable bikes={compareBikes} />
        </div>
      )}

      {compare.length === 0 && (
        <div className="text-center py-20 panel">
          <div className="text-4xl mb-4 opacity-20 font-mono">⇄</div>
          <p className="text-sm text-text-muted mb-2">No hay modelos seleccionados</p>
          <p className="text-xs text-text-muted mb-6">
            Añade bicis al comparador desde el catálogo
          </p>
          <Link to="/catalog" className="btn-primary text-xs">
            Ir al catálogo
          </Link>
        </div>
      )}
    </div>
  )
}

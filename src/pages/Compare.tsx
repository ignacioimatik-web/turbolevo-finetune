import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { ComparisonTable } from '../components/ComparisonTable'
import { BikeCard } from '../components/BikeCard'

export function Compare() {
  const { bikes, compare } = useAppState()
  const compareBikes = bikes.filter(b => compare.includes(b.id))
  const remainingSlots = 4 - compare.length
  const suggestions = bikes.filter(b => !compare.includes(b.id)).slice(0, remainingSlots)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
          Comparador
        </h1>
        <p className="text-xs text-text-muted font-mono mt-0.5">
          Compara hasta 4 modelos lado a lado
        </p>
      </div>

      {/* Comparison table when 2+ selected */}
      {compareBikes.length >= 2 && (
        <div className="panel p-4 sm:p-5 mb-8">
          <ComparisonTable bikes={compareBikes} />
        </div>
      )}

      {/* Stats bar when comparing */}
      {compareBikes.length >= 2 && compareBikes.length < 4 && (
        <div className="panel p-4 sm:p-5 mb-8">
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">
            Añade <span className="text-accent font-bold">{remainingSlots}</span> modelo{remainingSlots !== 1 ? 's' : ''} más para una comparativa completa
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {suggestions.map(bike => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        </div>
      )}

      {/* Single bike selected — prompt to add more */}
      {compareBikes.length === 1 && (
        <div className="mb-8">
          <div className="panel p-5 mb-6">
            <div className="text-center">
              <div className="text-3xl mb-3 opacity-30 font-mono">1/4</div>
              <p className="text-sm text-text-primary font-bold mb-1">Solo hay un modelo seleccionado</p>
              <p className="text-xs text-text-muted mb-5">
                Añade al menos 2 bicis para activar la comparativa
              </p>
            </div>
            <div className="max-w-sm mx-auto">
              <BikeCard bike={compareBikes[0]} />
            </div>
          </div>

          <div className="panel p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">
              Sugerencias para completar ({remainingSlots} disponible{remainingSlots !== 1 ? 's' : ''})
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {suggestions.map(bike => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {compare.length === 0 && (
        <div className="text-center py-16 panel">
          <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <p className="text-sm font-bold text-text-primary mb-1">No hay modelos seleccionados</p>
          <p className="text-xs text-text-muted mb-2 max-w-sm mx-auto">
            Selecciona bicicletas desde el catálogo pulsando «Comparar» y vuelve aquí para ver la tabla comparativa.
          </p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <Link to="/catalog" className="btn-primary text-xs">
              Ir al catálogo
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { icon: '⚡', label: 'Compara hasta 4 modelos' },
              { icon: '▲', label: 'Mejor batería destacado' },
              { icon: '▼', label: 'Menor peso resaltado' },
              { icon: '⇄', label: 'Elimina con un clic' },
            ].map(f => (
              <div key={f.label} className="bg-bg-secondary/30 border border-border rounded-xl px-3 py-3 text-center">
                <div className="text-lg mb-1 opacity-50">{f.icon}</div>
                <p className="text-[9px] font-mono text-text-muted">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

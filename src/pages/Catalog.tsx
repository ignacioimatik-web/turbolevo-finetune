import { useState } from 'react'
import { BikeCard } from '../components/BikeCard'
import { FilterBar } from '../components/FilterBar'
import { useAppState } from '../context/AppContext'
import { filterBikes, DEFAULT_FILTERS } from '../utils/helpers'
import type { FilterState } from '../types'

export function Catalog() {
  const { bikes } = useAppState()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const filtered = filterBikes(bikes, filters)

  const hasFilters =
    filters.brands.length > 0 ||
    filters.useTypes.length > 0 ||
    filters.search

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
            Catálogo
          </h1>
          <p className="text-xs text-text-muted font-mono mt-0.5">
            {bikes.length} modelos · {filtered.length} resultados
            {hasFilters && ` · con filtros activos`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary text-[10px] lg:hidden"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          {showFilters ? 'Cerrar' : 'Filtros'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className={`lg:w-64 xl:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="lg:sticky lg:top-24">
            <FilterBar filters={filters} setFilters={setFilters} results={filtered.length} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(bike => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          ) : (
            <div className="panel p-12 text-center">
              <div className="text-3xl mb-4 opacity-20 font-mono">◇</div>
              <p className="text-sm text-text-muted mb-2">No hay resultados</p>
              <p className="text-xs text-text-muted mb-6">Prueba con otros filtros</p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="btn-primary text-xs"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

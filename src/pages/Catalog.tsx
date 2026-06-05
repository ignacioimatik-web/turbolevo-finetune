import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BikeCard } from '../components/BikeCard'
import { FilterBar } from '../components/FilterBar'
import { useAppState } from '../context/AppContext'
import { filterBikes, createDefaultFilters, formatNumber } from '../utils/helpers'
import type { FilterState, UseType } from '../types'

const ACTIVE_COLOR = '#84cc16'

export function Catalog() {
  const { bikes } = useAppState()
  const [searchParams] = useSearchParams()
  const usoParam = searchParams.get('uso') as UseType | null
  const defaultFilters = useMemo(() => createDefaultFilters(bikes), [bikes])
  const initialFilters: FilterState = usoParam && ['trail', 'enduro', 'bikepark', 'rutas-largas'].includes(usoParam)
    ? { ...defaultFilters, useTypes: [usoParam] }
    : defaultFilters
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [showFilters, setShowFilters] = useState(false)
  const filtered = useMemo(() => filterBikes(bikes, filters), [bikes, filters])

  const activeCount = [
    filters.brands.length,
    filters.motorBrands.length,
    filters.useTypes.length,
    filters.search ? 1 : 0,
    filters.priceRange[0] !== defaultFilters.priceRange[0] || filters.priceRange[1] !== defaultFilters.priceRange[1] ? 1 : 0,
    filters.travelRange[0] !== defaultFilters.travelRange[0] || filters.travelRange[1] !== defaultFilters.travelRange[1] ? 1 : 0,
    filters.rearTravelRange[0] !== defaultFilters.rearTravelRange[0] || filters.rearTravelRange[1] !== defaultFilters.rearTravelRange[1] ? 1 : 0,
    filters.batteryRange[0] !== defaultFilters.batteryRange[0] || filters.batteryRange[1] !== defaultFilters.batteryRange[1] ? 1 : 0,
    filters.weightRange[0] !== defaultFilters.weightRange[0] || filters.weightRange[1] !== defaultFilters.weightRange[1] ? 1 : 0,
    filters.motorTorqueRange[0] !== defaultFilters.motorTorqueRange[0] || filters.motorTorqueRange[1] !== defaultFilters.motorTorqueRange[1] ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 rounded-full bg-accent" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
              Catálogo de e-bikes
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-0.5 ml-4">
            <span className="text-xs text-text-muted font-mono">
              {bikes.length} modelos · {filtered.length} resultados
            </span>
            {activeCount > 0 && (
              <span className="chip-accent text-[9px]">
                {activeCount} filtro{activeCount !== 1 ? 's' : ''} activo{activeCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary text-[10px] lg:hidden"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          {showFilters ? 'Cerrar' : 'Filtros'}
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-accent text-black text-[8px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile filter overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <div className="absolute inset-x-0 bottom-0 top-16 bg-bg-primary border-t border-border overflow-y-auto px-4 py-5 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Filtros</span>
                <button onClick={() => setShowFilters(false)} className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-accent-hover transition-colors">
                  Cerrar
                </button>
              </div>
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                results={filtered.length}
                bikes={bikes}
              />
            </div>
          </div>
        )}

        {/* Filters sidebar */}
        <aside className={`hidden lg:block lg:w-64 xl:w-72 shrink-0`}>
          <div className="lg:sticky lg:top-24 space-y-4">
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              results={filtered.length}
              bikes={bikes}
            />
          </div>
        </aside>

        {/* Results grid */}
        <div className="flex-1 min-w-0">
          {filtered.length > 0 ? (
            <>
              {activeCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-4 animate-fade-in">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Filtrado:</span>
                  {filters.brands.map(b => (
                    <span key={b} className="chip-accent text-[9px]">
                      {b}
                      <button onClick={() => setFilters({ ...filters, brands: filters.brands.filter(x => x !== b) })} className="ml-1.5 hover:text-accent-hover">✕</button>
                    </span>
                  ))}
                  {filters.motorBrands.map(m => (
                    <span key={m} className="chip-accent text-[9px]">
                      Motor: {m}
                      <button onClick={() => setFilters({ ...filters, motorBrands: filters.motorBrands.filter(x => x !== m) })} className="ml-1.5 hover:text-accent-hover">✕</button>
                    </span>
                  ))}
                  {filters.useTypes.map(t => (
                    <span key={t} className="chip-accent text-[9px]">
                      {t}
                      <button onClick={() => setFilters({ ...filters, useTypes: filters.useTypes.filter(x => x !== t) })} className="ml-1.5 hover:text-accent-hover">✕</button>
                    </span>
                  ))}
                  {filters.search && (
                    <span className="chip-accent text-[9px]">
                      "{filters.search}"
                      <button onClick={() => setFilters({ ...filters, search: '' })} className="ml-1.5 hover:text-accent-hover">✕</button>
                    </span>
                  )}
                  <button
                    onClick={() => setFilters(defaultFilters)}
                    className="text-[9px] font-mono text-text-muted underline hover:text-accent transition-colors"
                  >
                    Limpiar todo
                  </button>
                </div>
              )}

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(bike => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>

              <div className="mt-6 text-center text-[10px] font-mono text-text-muted">
                Mostrando {filtered.length} de {bikes.length} modelos
                {activeCount > 0 && ` · ${formatNumber(((filtered.length / bikes.length) * 100))}% del catálogo`}
              </div>
            </>
          ) : (
            <div className="panel p-8 sm:p-12 text-center animate-scale-in relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <div className="w-16 h-16 rounded-2xl bg-accent-subtle flex items-center justify-center mx-auto mb-5 ring-1 ring-accent/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACTIVE_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-sm font-bold text-text-primary mb-1">Sin resultados</p>
              <p className="text-xs text-text-muted mb-6 max-w-xs mx-auto leading-relaxed">
                No hay bicicletas que coincidan con los filtros seleccionados. Prueba a ajustar los criterios o limpiar los filtros.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="btn-primary text-xs"
                >
                  Limpiar filtros
                </button>
                <Link to="/terrain" className="btn-secondary text-xs">
                  Explorar terrenos
                </Link>
              </div>

              {activeCount > 0 && (
                <details className="mt-6 text-left">
                  <summary className="text-[10px] font-mono text-text-muted cursor-pointer hover:text-accent transition-colors">
                    Filtros activos ({activeCount})
                  </summary>
                  <ul className="mt-2 space-y-1 text-[10px] text-text-muted font-mono">
                    {filters.brands.length > 0 && <li>Marca: {filters.brands.join(', ')}</li>}
                    {filters.motorBrands.length > 0 && <li>Motor: {filters.motorBrands.join(', ')}</li>}
                    {filters.useTypes.length > 0 && <li>Uso: {filters.useTypes.join(', ')}</li>}
                    {filters.search && <li>Búsqueda: "{filters.search}"</li>}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

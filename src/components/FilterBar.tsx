import type { FilterState, SortOption, UseType } from '../types'
import { brands, priceRange, travelRange, batteryRange, weightRange, motorTorqueRange } from '../data/bikes'
import { getUseTypeLabel } from '../utils/helpers'

interface FilterBarProps {
  filters: FilterState
  setFilters: (f: FilterState) => void
  results: number
}

const useTypes: UseType[] = ['trail', 'enduro', 'bikepark', 'rutas-largas']

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Precio ascendente' },
  { value: 'price-desc', label: 'Precio descendente' },
  { value: 'weight-asc', label: 'Peso ascendente' },
  { value: 'weight-desc', label: 'Peso descendente' },
  { value: 'travel-front', label: 'Más recorrido' },
  { value: 'battery', label: 'Mayor batería' },
]

function RangeSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (v: [number, number]) => void
  format?: (n: number) => string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">{label}</span>
        <span className="text-[11px] font-mono text-accent font-semibold">
          {format ? format(value[0]) : value[0]} – {format ? format(value[1]) : value[1]}
        </span>
      </div>
      <div className="space-y-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={e => onChange([Math.min(Number(e.target.value), value[1] - step), value[1]])}
          className="w-full h-1.5 bg-bg-hover rounded-full appearance-none cursor-pointer accent-accent
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-bg-card [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={e => onChange([value[0], Math.max(Number(e.target.value), value[0] + step)])}
          className="w-full h-1.5 bg-bg-hover rounded-full appearance-none cursor-pointer accent-accent
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-bg-card [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-110"
        />
      </div>
    </div>
  )
}

export function FilterBar({ filters, setFilters, results }: FilterBarProps) {
  const toggleBrand = (brand: string) => {
    setFilters({
      ...filters,
      brands: filters.brands.includes(brand)
        ? filters.brands.filter(b => b !== brand)
        : [...filters.brands, brand],
    })
  }

  const toggleUseType = (type: UseType) => {
    setFilters({
      ...filters,
      useTypes: filters.useTypes.includes(type)
        ? filters.useTypes.filter(t => t !== type)
        : [...filters.useTypes, type],
    })
  }

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.useTypes.length > 0 ||
    filters.search ||
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1] ||
    filters.travelRange[0] !== travelRange[0] ||
    filters.travelRange[1] !== travelRange[1] ||
    filters.batteryRange[0] !== batteryRange[0] ||
    filters.batteryRange[1] !== batteryRange[1] ||
    filters.weightRange[0] !== weightRange[0] ||
    filters.weightRange[1] !== weightRange[1] ||
    filters.motorTorqueRange[0] !== motorTorqueRange[0] ||
    filters.motorTorqueRange[1] !== motorTorqueRange[1]

  return (
    <div className="panel p-4 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Filtros</span>
          <span className="text-[10px] font-mono text-text-muted">({results})</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() =>
              setFilters({
                brands: [],
                useTypes: [],
                priceRange: [priceRange[0], priceRange[1]],
                travelRange: [travelRange[0], travelRange[1]],
                batteryRange: [batteryRange[0], batteryRange[1]],
                weightRange: [weightRange[0], weightRange[1]],
                motorTorqueRange: [motorTorqueRange[0], motorTorqueRange[1]],
                sortBy: 'price-asc',
                search: '',
              })
            }
            className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-accent-hover transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
          Buscar
        </span>
        <input
          type="text"
          placeholder="Marca, modelo..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="input-field text-xs"
        />
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
          Marca
        </span>
        <div className="flex flex-wrap gap-1.5">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => toggleBrand(brand)}
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
                filters.brands.includes(brand)
                  ? 'bg-accent-subtle text-accent border-accent/30'
                  : 'bg-bg-primary text-text-muted border-border hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
          Tipo de uso
        </span>
        <div className="flex flex-wrap gap-1.5">
          {useTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleUseType(type)}
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
                filters.useTypes.includes(type)
                  ? 'bg-accent-subtle text-accent border-accent/30'
                  : 'bg-bg-primary text-text-muted border-border hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {getUseTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      <RangeSlider
        label="Precio"
        min={priceRange[0]}
        max={priceRange[1]}
        step={500}
        value={filters.priceRange}
        onChange={v => setFilters({ ...filters, priceRange: v })}
        format={n => `${n.toLocaleString('es-ES')}€`}
      />

      <RangeSlider
        label="Recorrido"
        min={travelRange[0]}
        max={travelRange[1]}
        step={5}
        value={filters.travelRange}
        onChange={v => setFilters({ ...filters, travelRange: v })}
        format={n => `${n}mm`}
      />

      <RangeSlider
        label="Batería"
        min={batteryRange[0]}
        max={batteryRange[1]}
        step={50}
        value={filters.batteryRange}
        onChange={v => setFilters({ ...filters, batteryRange: v })}
        format={n => `${n}Wh`}
      />

      <RangeSlider
        label="Peso"
        min={weightRange[0]}
        max={weightRange[1]}
        step={0.5}
        value={filters.weightRange}
        onChange={v => setFilters({ ...filters, weightRange: v })}
        format={n => `${n}kg`}
      />

      <RangeSlider
        label="Par motor"
        min={motorTorqueRange[0]}
        max={motorTorqueRange[1]}
        step={5}
        value={filters.motorTorqueRange}
        onChange={v => setFilters({ ...filters, motorTorqueRange: v })}
        format={n => `${n}Nm`}
      />

      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
          Ordenar
        </span>
        <select
          value={filters.sortBy}
          onChange={e => setFilters({ ...filters, sortBy: e.target.value as SortOption })}
          className="input-field text-xs appearance-none bg-no-repeat cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6b73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundPosition: 'right 10px center' }}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

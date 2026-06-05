import { Link } from 'react-router-dom'
import type { EBike } from '../types'
import { formatPrice, getUseTypeLabel, getUseTypeColor } from '../utils/helpers'
import { useAppState } from '../context/AppContext'
import { BikeImage } from './BikeImage'

export function BikeCard({ bike }: { bike: EBike }) {
  const { isInGarage, toggleCompare, isInCompare, addToGarage, removeFromGarage } = useAppState()
  const inGarage = isInGarage(bike.id)
  const inCompare = isInCompare(bike.id)

  return (
    <div className="group panel-hover overflow-hidden animate-fade-in">
      <Link to={`/bike/${bike.id}`} className="block">
        <div className="relative">
          <BikeImage bike={bike} className="h-44" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {bike.useType.map(type => (
              <span
                key={type}
                className="chip"
                style={{
                  backgroundColor: `${getUseTypeColor(type)}12`,
                  borderColor: `${getUseTypeColor(type)}25`,
                  color: getUseTypeColor(type),
                }}
              >
                {getUseTypeLabel(type)}
              </span>
            ))}
          </div>

          {bike.specs.weight < 22 && (
            <span className="absolute top-3 right-3 chip"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.25)',
                color: '#22c55e',
              }}
            >
              Ultra Light
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                {bike.brand}
              </p>
              <h3 className="text-sm font-bold text-text-primary leading-tight group-hover:text-accent transition-colors duration-200 truncate">
                {bike.model}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-accent font-mono">
                {formatPrice(bike.price)}
              </p>
            </div>
          </div>

          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {bike.tagline}
          </p>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { label: 'Rec', value: `${bike.suspension.front.travel}/${bike.suspension.rear.travel}`, unit: 'mm' },
              { label: 'Batería', value: `${bike.battery.capacity}`, unit: 'Wh' },
              { label: 'Motor', value: `${bike.motor.torque}`, unit: 'Nm' },
              { label: 'Peso', value: `${bike.specs.weight}`, unit: 'kg' },
            ].map(stat => (
              <div key={stat.label} className="text-center bg-bg-primary/50 rounded-lg py-1.5 px-1">
                <p className="text-xs font-bold font-mono text-text-primary">{stat.value}</p>
                <p className="text-[9px] text-text-muted font-mono">{stat.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </Link>

      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={e => { e.preventDefault(); inGarage ? removeFromGarage(bike.id) : addToGarage(bike.id) }}
          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
            inGarage
              ? 'bg-success/10 text-success border-success/30 hover:bg-success/20'
              : 'border-border text-text-muted hover:text-text-primary hover:border-border-hover bg-transparent'
          }`}
        >
          {inGarage ? '★ En garaje' : '☆ Garaje'}
        </button>
        <button
          onClick={e => { e.preventDefault(); toggleCompare(bike.id) }}
          className={`py-2 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
            inCompare
              ? 'bg-accent-subtle text-accent border-accent/30'
              : 'border-border text-text-muted hover:text-text-primary hover:border-border-hover bg-transparent'
          }`}
        >
          {inCompare ? 'Comparando' : 'Comparar'}
        </button>
      </div>
    </div>
  )
}

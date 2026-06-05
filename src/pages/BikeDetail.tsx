import { useParams, Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { SpecTable } from '../components/SpecTable'
import { SetupCard } from '../components/SetupCard'
import { BikeImage } from '../components/BikeImage'
import { formatPrice, getUseTypeLabel, getUseTypeColor } from '../utils/helpers'

export function BikeDetail() {
  const { id } = useParams()
  const { bikes, isInGarage, addToGarage, removeFromGarage, toggleCompare, isInCompare } = useAppState()
  const bike = bikes.find(b => b.id === id)

  if (!bike) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-sm text-text-muted mb-4">Bicicleta no encontrada</p>
        <Link to="/catalog" className="btn-primary text-xs">← Volver al catálogo</Link>
      </div>
    )
  }

  const inGarage = isInGarage(bike.id)
  const inCompare = isInCompare(bike.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-6 font-mono">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Volver al catálogo
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="panel overflow-hidden">
            <BikeImage bike={bike} className="h-56 sm:h-72" />

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">{bike.brand} · {bike.year}</p>
                  <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">{bike.model}</h1>
                  <p className="text-sm text-text-secondary mt-1">{bike.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg sm:text-xl font-bold text-accent font-mono">{formatPrice(bike.price)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Recorrido', value: `${bike.suspension.front.travel}/${bike.suspension.rear.travel}`, unit: 'mm' },
                  { label: 'Peso', value: `${bike.specs.weight}`, unit: 'kg' },
                  { label: 'Batería', value: `${bike.battery.capacity}`, unit: 'Wh' },
                  { label: 'Motor', value: `${bike.motor.torque}`, unit: 'Nm' },
                ].map(stat => (
                  <div key={stat.label} className="bg-bg-primary rounded-lg border border-border px-3 py-2.5 text-center">
                    <p className="text-sm font-bold font-mono text-text-primary">{stat.value}</p>
                    <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">{stat.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3 font-mono">
              Descripción
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              {bike.description}
            </p>
          </div>

          <div className="panel p-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4 font-mono">
              Autonomía estimada
            </h2>
            <div className="space-y-3">
              {[
                { mode: 'Eco', km: bike.battery.range.eco, color: 'bg-accent' },
                { mode: 'Trail', km: bike.battery.range.trail, color: 'bg-warning' },
                { mode: 'Turbo/Boost', km: bike.battery.range.turbo, color: 'bg-energy' },
              ].map(item => {
                const max = Math.max(bike.battery.range.eco, bike.battery.range.trail, bike.battery.range.turbo)
                return (
                  <div key={item.mode}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted font-mono uppercase tracking-wider">{item.mode}</span>
                      <span className="text-text-primary font-mono font-semibold">{item.km} km</span>
                    </div>
                    <div className="h-2 bg-bg-hover rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${item.color}`}
                        style={{ width: `${(item.km / max) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <SpecTable bike={bike} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => (inGarage ? removeFromGarage(bike.id) : addToGarage(bike.id))}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 border ${
                inGarage
                  ? 'bg-success/10 text-success border-success/30 hover:bg-success/20'
                  : 'btn-primary text-xs justify-center'
              }`}
            >
              {inGarage ? '★ En mi garaje' : '☆ Añadir a mi garaje'}
            </button>
            <button
              onClick={() => toggleCompare(bike.id)}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 border ${
                inCompare
                  ? 'bg-accent-subtle text-accent border-accent/30'
                  : 'btn-secondary text-xs justify-center'
              }`}
            >
              {inCompare ? 'En comparador' : 'Añadir al comparador'}
            </button>
          </div>

          <div className="panel p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3 font-mono">
              Motor y batería
            </h3>
            <dl className="space-y-2">
              {[
                ['Motor', `${bike.motor.brand} ${bike.motor.model}`],
                ['Par', `${bike.motor.torque} Nm`],
                ['Potencia', `${bike.motor.power} W`],
                ['Sensor', bike.motor.sensor],
                ['Modos', bike.motor.assistModes.join(', ')],
                ['Batería', `${bike.battery.capacity} Wh`],
                ['Extraíble', bike.battery.removable ? 'Sí' : 'No'],
                ['Cargador', bike.battery.chargerType],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs">
                  <dt className="text-text-muted">{label}</dt>
                  <dd className="text-text-primary font-mono text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3 font-mono">
              Suspensión
            </h3>
            <dl className="space-y-2">
              {[
                ['Horquilla', `${bike.suspension.front.brand} ${bike.suspension.front.model}`],
                ['Recorrido', `${bike.suspension.front.travel} mm`],
                ['Ajuste', bike.suspension.front.adjustment],
                ['Amortiguador', `${bike.suspension.rear.brand} ${bike.suspension.rear.model}`],
                ['Recorrido', `${bike.suspension.rear.travel} mm`],
                ['Leverage ratio', bike.suspension.rear.leverageRatio.toString()],
                ['Ajuste', bike.suspension.rear.adjustment],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs">
                  <dt className="text-text-muted">{label}</dt>
                  <dd className="text-text-primary font-mono text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3 font-mono">
              Setup recomendado
            </h3>
            <SetupCard bike={bike} />
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { formatPrice, getUseTypeLabel, getUseTypeColor, getBrandColor } from '../utils/helpers'
import type { UseType } from '../types'

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-bg-secondary/40 border border-border rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:border-border-hover hover:bg-bg-hover/30">
      <span className="text-lg opacity-50 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted">{label}</p>
        <p className="text-sm font-bold font-mono text-text-primary">{value}</p>
        {sub && <p className="text-[9px] font-mono text-text-muted/60 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function Garage() {
  const { bikes, garage, removeFromGarage, toggleCompare, isInCompare } = useAppState()
  const garageBikes = bikes.filter(b => garage.includes(b.id))

  const avgBattery = garageBikes.length > 0
    ? Math.round(garageBikes.reduce((s, b) => s + b.battery.capacity, 0) / garageBikes.length)
    : 0

  const avgWeight = garageBikes.length > 0
    ? (garageBikes.reduce((s, b) => s + b.specs.weight, 0) / garageBikes.length).toFixed(1)
    : '0'

  const avgPrice = garageBikes.length > 0
    ? Math.round(garageBikes.reduce((s, b) => s + b.price, 0) / garageBikes.length)
    : 0

  const useTypeCounts: Record<string, number> = {}
  garageBikes.forEach(b => b.useType.forEach(t => { useTypeCounts[t] = (useTypeCounts[t] || 0) + 1 }))
  const dominantUseType = Object.entries(useTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as UseType | undefined

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Mi Garaje
          </h1>
          <p className="text-xs text-text-muted font-mono mt-0.5">
            {garage.length} {garage.length === 1 ? 'bicicleta en tu colección' : 'bicicletas en tu colección'}
          </p>
        </div>
        {garageBikes.length > 0 && (
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-200"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Añadir más
          </Link>
        )}
      </div>

      {garageBikes.length > 0 ? (
        <>
          {/* ── Stats summary ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard
              icon="🔋"
              label="Batería media"
              value={`${avgBattery} Wh`}
              sub={garageBikes.length > 1 ? `${Math.min(...garageBikes.map(b => b.battery.capacity))} – ${Math.max(...garageBikes.map(b => b.battery.capacity))} Wh` : undefined}
            />
            <StatCard
              icon="↓"
              label="Peso medio"
              value={`${avgWeight} kg`}
              sub={garageBikes.length > 1 ? `${Math.min(...garageBikes.map(b => b.specs.weight))} – ${Math.max(...garageBikes.map(b => b.specs.weight))} kg` : undefined}
            />
            <StatCard
              icon="€"
              label="Precio medio"
              value={formatPrice(avgPrice)}
              sub={garageBikes.length > 1 ? `${formatPrice(Math.min(...garageBikes.map(b => b.price)))} – ${formatPrice(Math.max(...garageBikes.map(b => b.price)))}` : undefined}
            />
            <StatCard
              icon="▲"
              label="Uso dominante"
              value={dominantUseType ? getUseTypeLabel(dominantUseType) : '—'}
              sub={`${garageBikes.length} bici${garageBikes.length !== 1 ? 's' : ''} en colección`}
            />
          </div>

          {/* ── Collection grid ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {garageBikes.map(bike => {
              const inCompare = isInCompare(bike.id)
              const brandColor = getBrandColor(bike.brand)
              return (
                <div key={bike.id} className="group panel-hover overflow-hidden animate-fade-in relative">
                  {/* Collection number badge */}
                  <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-text-muted">
                      {garageBikes.indexOf(bike) + 1}
                    </span>
                  </div>

                  {/* Remove from garage — X button */}
                  <button
                    onClick={() => removeFromGarage(bike.id)}
                    className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-error/20 hover:border-error/40 hover:text-error transition-all duration-200"
                    title="Quitar del garaje"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  {/* Brand accent line */}
                  <div className="h-1 w-full" style={{ backgroundColor: brandColor }} />

                  <Link to={`/bike/${bike.id}`} className="block">
                    <div className="px-4 pt-1">
                      <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: brandColor }}>
                        {bike.brand}
                      </p>
                      <h3 className="text-sm font-bold text-text-primary leading-tight group-hover:text-accent transition-colors duration-200 truncate mt-0.5">
                        {bike.model}
                      </h3>
                    </div>

                    <div className="px-4 pt-3 pb-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: 'Recorrido', value: `${bike.suspension.front.travel}/${bike.suspension.rear.travel} mm` },
                          { label: 'Batería', value: `${bike.battery.capacity} Wh` },
                          { label: 'Peso', value: `${bike.specs.weight} kg` },
                          { label: 'Precio', value: formatPrice(bike.price) },
                        ].map(stat => (
                          <div key={stat.label} className="bg-bg-secondary/40 border border-border/40 rounded-lg py-1.5 px-2 text-center">
                            <p className="text-[10px] font-bold font-mono text-text-primary">{stat.value}</p>
                            <p className="text-[7px] text-text-muted font-mono uppercase tracking-wider">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="px-4 pb-2 flex flex-wrap gap-1">
                      {bike.useType.map(type => (
                        <span
                          key={type}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider font-mono border"
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
                  </Link>

                  {/* Actions */}
                  <div className="flex gap-2 px-4 pb-4">
                    <Link
                      to={`/bike/${bike.id}`}
                      className="flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center transition-all duration-200 border border-border text-text-muted hover:text-text-primary hover:border-border-hover bg-transparent"
                    >
                      Detalle
                    </Link>
                    <button
                      onClick={() => toggleCompare(bike.id)}
                      className={`py-2 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
                        inCompare
                          ? 'bg-accent-subtle text-accent border-accent/30'
                          : 'border-border text-text-muted hover:text-text-primary hover:border-border-hover bg-transparent'
                      }`}
                    >
                      {inCompare ? 'Comparando' : '⇄'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Collection footer ── */}
          <div className="mt-8 p-4 rounded-xl border border-border bg-bg-secondary/20 text-center">
            <p className="text-[10px] font-mono text-text-muted">
              {garage.length} {garage.length === 1 ? 'modelo en tu colección' : 'modelos en tu colección'}
              {' · Valor total: '}
              <span className="text-accent font-bold font-mono">
                {formatPrice(garageBikes.reduce((s, b) => s + b.price, 0))}
              </span>
              {' · Peso total: '}
              <span className="text-text-primary font-bold font-mono">
                {garageBikes.reduce((s, b) => s + b.specs.weight, 0).toFixed(1)} kg
              </span>
            </p>
          </div>
        </>
      ) : (
        /* ── Empty state ── */
        <div className="text-center py-20">
          <div className="max-w-md mx-auto panel p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="w-20 h-20 rounded-2xl bg-accent-subtle flex items-center justify-center mx-auto mb-6 ring-1 ring-accent/20">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="M6 10 L12 6 L18 10" />
                <line x1="8" y1="14" x2="8" y2="10" />
                <line x1="16" y1="14" x2="16" y2="10" />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-text-primary mb-2">
              Tu garaje está vacío
            </h2>
            <p className="text-xs text-text-muted mb-2 leading-relaxed">
              Guarda tus bicicletas favoritas para tener siempre a mano sus especificaciones, compararlas y consultar configuraciones de setup.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {[
                { icon: '★', label: 'Guardar favoritas' },
                { icon: '⇄', label: 'Comparar modelos' },
                { icon: '⚙', label: 'Setup guardado' },
              ].map(f => (
                <span key={f.label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-secondary/50 border border-border text-[9px] font-mono text-text-muted">
                  <span className="opacity-60">{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-widest hover:bg-accent/25 active:scale-[0.98] transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              Explorar catálogo
            </Link>
          </div>

          <div className="max-w-lg mx-auto mt-10 grid grid-cols-2 gap-3">
            {[
              { icon: '⚡', title: 'Compara', desc: 'Hasta 4 modelos lado a lado' },
              { icon: '▲', title: 'Setup', desc: 'Presión y sag de referencia' },
              { icon: '▼', title: 'Peso', desc: 'Controla el peso total' },
              { icon: '🔋', title: 'Autonomía', desc: 'Batería y alcance real' },
            ].map(f => (
              <div key={f.title} className="bg-bg-secondary/20 border border-border rounded-xl px-4 py-3 text-center transition-colors hover:border-border-hover">
                <div className="text-lg mb-1 opacity-40">{f.icon}</div>
                <p className="text-[10px] font-bold text-text-primary uppercase tracking-wider">{f.title}</p>
                <p className="text-[8px] text-text-muted font-mono mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

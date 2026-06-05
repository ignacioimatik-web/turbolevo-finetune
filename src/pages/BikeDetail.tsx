import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { BikeImage } from '../components/BikeImage'
import { formatPrice, getUseTypeLabel, getUseTypeColor } from '../utils/helpers'

function StatBox({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: boolean }) {
  return (
    <div className="bg-bg-primary/60 border border-border rounded-xl px-3 py-2.5 text-center transition-all duration-200 hover:border-border-hover hover:bg-bg-hover/30">
      <p className={`text-base sm:text-lg font-bold font-mono ${accent ? 'text-accent' : 'text-text-primary'}`}>
        {value}
        {unit && <span className="text-[10px] text-text-muted font-normal ml-0.5">{unit}</span>}
      </p>
      <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  )
}

function SectionTitle({ label, color }: { label: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color || 'var(--color-accent)' }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] font-mono" style={{ color: color || 'var(--color-accent)' }}>{label}</span>
    </div>
  )
}

function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0 hover:bg-bg-hover/30 px-1 -mx-1 rounded transition-colors duration-150">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className={`text-[11px] font-mono font-medium ${highlight ? 'text-accent' : 'text-text-primary'}`}>{value}</span>
    </div>
  )
}

function AutonomyBar({ mode, km, max }: { mode: string; km: number; max: number }) {
  const colorMap: Record<string, string> = {
    Eco: 'from-accent to-accent/60',
    Trail: 'from-warning to-warning/60',
    'Turbo/Boost': 'from-energy to-energy/60',
    Breeze: 'from-accent to-accent/60',
    River: 'from-warning to-warning/60',
    Rocket: 'from-energy to-energy/60',
    Turbo: 'from-energy to-energy/60',
    Boost: 'from-energy to-energy/40',
    eMTB: 'from-warning to-warning/60',
    'Tour+': 'from-accent to-accent/40',
    Standard: 'from-accent to-accent/40',
    High: 'from-warning to-warning/40',
    AUTO: 'from-warning to-warning/40',
    'Fine Tune': 'from-accent to-accent/40',
  }
  const barColor = colorMap[mode] || (mode.toLowerCase().includes('turbo') || mode.toLowerCase().includes('boost') || mode.toLowerCase().includes('rocket') ? 'from-energy to-energy/60' : 'from-accent to-accent/60')

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-muted font-mono uppercase tracking-wider text-[10px]">{mode}</span>
        <span className="text-text-primary font-mono font-semibold">{km} km</span>
      </div>
      <div className="h-2 bg-bg-hover rounded-full overflow-hidden ring-1 ring-inset ring-white/5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${(km / max) * 100}%` }}
        />
      </div>
    </div>
  )
}

function InfoChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono border"
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
        color,
      }}
    >
      {label}
    </span>
  )
}

export function BikeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBike, isInGarage, addToGarage, removeFromGarage, toggleCompare, isInCompare } = useAppState()
  const bike = id ? getBike(id) : undefined

  if (!bike) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-subtle flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <p className="text-sm font-bold text-text-primary mb-1">Bicicleta no encontrada</p>
        <p className="text-xs text-text-muted mb-6">El modelo que buscas no existe o ha sido eliminado.</p>
        <Link to="/catalog" className="btn-primary text-xs">← Volver al catálogo</Link>
      </div>
    )
  }

  const inGarage = isInGarage(bike.id)
  const inCompare = isInCompare(bike.id)
  const maxAutonomy = Math.max(bike.battery.range.eco, bike.battery.range.trail, bike.battery.range.turbo)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-[10px] text-text-muted hover:text-accent transition-colors mb-6 font-mono uppercase tracking-wider group">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Volver
      </button>

      {/* ── HERO ── */}
      <div className="panel overflow-hidden mb-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-20" />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 via-transparent to-bg-primary/40 pointer-events-none z-10" />
          <BikeImage bike={bike} className="h-48 sm:h-64 lg:h-72" />
        </div>

        <div className="p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">{bike.brand}</span>
                <span className="text-text-muted/40">·</span>
                <span className="text-[10px] font-mono text-text-muted">{bike.year}</span>
                <span className="text-text-muted/40">·</span>
                <InfoChip label={bike.category} color="#84cc16" />
                <InfoChip label={bike.frame.material} color="#22c55e" />
                <InfoChip label={bike.wheelSetup} color="#3b82f6" />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight mb-2">
                {bike.model}
              </h1>

              <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                {bike.tagline}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
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
            </div>

            <div className="lg:text-right shrink-0">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Desde</p>
              <p className="text-2xl sm:text-3xl font-bold text-accent font-mono">{formatPrice(bike.price)}</p>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4">
                <button
                  onClick={() => (inGarage ? removeFromGarage(bike.id) : addToGarage(bike.id))}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
                    inGarage
                      ? 'bg-success/10 text-success border-success/30 hover:bg-success/20'
                      : 'bg-accent-subtle text-accent border-accent/30 hover:bg-accent/20'
                  }`}
                >
                  {inGarage ? '★ En mi garaje' : '☆ Añadir al garaje'}
                </button>
                <button
                  onClick={() => toggleCompare(bike.id)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
                    inCompare
                      ? 'bg-accent-subtle text-accent border-accent/30'
                      : 'bg-bg-primary text-text-muted border-border hover:text-text-primary hover:border-border-hover'
                  }`}
                >
                  {inCompare ? 'En comparador' : '⇄ Comparar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <StatBox label="Motor" value={bike.motor.torque.toString()} unit="Nm" accent />
            <StatBox label="Batería" value={bike.battery.capacity.toString()} unit="Wh" accent />
            <StatBox label="Peso" value={bike.specs.weight.toString()} unit="kg" />
            <StatBox label="Rec. F/R" value={`${bike.suspension.front.travel}/${bike.suspension.rear.travel}`} unit="mm" />
            <StatBox label="Ruedas" value={bike.specs.wheels.toString()} unit='"' />
            <StatBox label="Cuadro" value={bike.frame.material === 'Carbon' ? 'Carbono' : 'Aluminio'} />
          </div>

          {/* Description */}
          <div className="panel p-5 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            <SectionTitle label="Descripción" />
            <p className="text-xs text-text-secondary leading-relaxed">
              {bike.description}
            </p>
          </div>

          {/* Component specs */}
          <div className="panel p-5">
            <SectionTitle label="Componentes" />
            <div className="grid sm:grid-cols-2 gap-x-8">
              <div>
                <SpecRow label="Horquilla" value={`${bike.suspension.front.brand} ${bike.suspension.front.model}`} highlight />
                <SpecRow label="Recorrido del." value={`${bike.suspension.front.travel} mm`} />
                <SpecRow label="Ajuste" value={bike.suspension.front.adjustment} />
                <SpecRow label="Frenos" value={bike.specs.brakes} />
                <SpecRow label="Transmisión" value={bike.specs.drivetrain} />
              </div>
              <div>
                <SpecRow label="Amortiguador" value={`${bike.suspension.rear.brand} ${bike.suspension.rear.model}`} highlight />
                <SpecRow label="Recorrido tras." value={`${bike.suspension.rear.travel} mm`} />
                <SpecRow label="Leverage ratio" value={bike.suspension.rear.leverageRatio.toString()} />
                <SpecRow label="Carga máxima" value={`${bike.specs.maxLoad} kg`} />
                <SpecRow label="Tallas" value={bike.frame.sizes.join(', ')} />
              </div>
            </div>
          </div>

          {/* Geometry */}
          <div className="panel p-5">
            <SectionTitle label="Geometría" />
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <SpecRow label="Reach" value={`${bike.frame.geometry.reach} mm`} />
                <SpecRow label="Stack" value={`${bike.frame.geometry.stack} mm`} />
              </div>
              <div>
                <SpecRow label="Ángulo dirección" value={`${bike.frame.geometry.headAngle}°`} />
                <SpecRow label="Ángulo sillín" value={`${bike.frame.geometry.seatAngle}°`} />
              </div>
              <div>
                <SpecRow label="Chainstay" value={`${bike.frame.geometry.chainstay} mm`} />
                <SpecRow label="Distancia ejes" value={`${bike.frame.geometry.wheelbase} mm`} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/40">
              <div className="flex items-center gap-4 text-[10px] text-text-muted font-mono">
                <span>Caída pedalier: {bike.frame.geometry.bbDrop} mm</span>
                <span>·</span>
                <span>Peso cuadro: {bike.frame.weight} kg</span>
              </div>
            </div>
          </div>

          {/* Motor & Battery detail */}
          <div className="panel p-5">
            <SectionTitle label="Motor y batería" />
            <div className="grid sm:grid-cols-2 gap-x-8 mb-5">
              <div>
                <SpecRow label="Motor" value={`${bike.motor.brand} ${bike.motor.model}`} highlight />
                <SpecRow label="Par" value={`${bike.motor.torque} Nm`} />
                <SpecRow label="Potencia" value={`${bike.motor.power} W`} />
                <SpecRow label="Sensor" value={bike.motor.sensor} />
                <SpecRow label="Modos" value={bike.motor.assistModes.join(' · ')} />
              </div>
              <div>
                <SpecRow label="Capacidad" value={`${bike.battery.capacity} Wh`} highlight />
                <SpecRow label="Peso batería" value={`${bike.battery.weight} kg`} />
                <SpecRow label="Extraíble" value={bike.battery.removable ? 'Sí' : 'No'} />
                <SpecRow label="Cargador" value={bike.battery.chargerType} />
              </div>
            </div>

            <div className="border-t border-border/40 pt-4">
              <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-3">Autonomía estimada</p>
              <div className="space-y-2.5">
                <AutonomyBar mode={bike.motor.assistModes[0]} km={bike.battery.range.eco} max={maxAutonomy} />
                {bike.motor.assistModes[1] && <AutonomyBar mode={bike.motor.assistModes[1]} km={bike.battery.range.trail} max={maxAutonomy} />}
                <AutonomyBar mode={bike.motor.assistModes[2] || 'Turbo/Boost'} km={bike.battery.range.turbo} max={maxAutonomy} />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-6">
          {/* Setup Base */}
          <div className="panel p-5">
            <SectionTitle label="Setup base" />
            <p className="text-[9px] font-mono text-text-muted mb-4">
              Configuración de referencia para rider de {bike.setupBase.riderWeightKg} kg
            </p>

              <div className="space-y-4">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-2">Presión</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-bg-primary rounded-lg border border-border px-3 py-2.5 text-center transition-all hover:border-border-hover">
                    <p className="text-[9px] text-text-muted font-mono">Delantera</p>
                    <p className="text-base font-bold font-mono text-text-primary">{bike.setupBase.frontPsi} <span className="text-[10px] text-text-muted font-normal">psi</span></p>
                  </div>
                  <div className="bg-bg-primary rounded-lg border border-border px-3 py-2.5 text-center transition-all hover:border-border-hover">
                    <p className="text-[9px] text-text-muted font-mono">Trasera</p>
                    <p className="text-base font-bold font-mono text-text-primary">{bike.setupBase.rearPsi} <span className="text-[10px] text-text-muted font-normal">psi</span></p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-2">Sag</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-bg-primary rounded-lg border border-border px-3 py-2.5 text-center transition-all hover:border-border-hover">
                    <p className="text-[9px] text-text-muted font-mono">Delantero</p>
                    <p className={`text-base font-bold font-mono ${bike.setupBase.sagFrontPercent >= 22 && bike.setupBase.sagFrontPercent <= 28 ? 'text-accent' : 'text-energy'}`}>
                      {bike.setupBase.sagFrontPercent}%
                    </p>
                  </div>
                  <div className="bg-bg-primary rounded-lg border border-border px-3 py-2.5 text-center transition-all hover:border-border-hover">
                    <p className="text-[9px] text-text-muted font-mono">Trasero</p>
                    <p className={`text-base font-bold font-mono ${bike.setupBase.sagRearPercent >= 22 && bike.setupBase.sagRearPercent <= 28 ? 'text-accent' : 'text-energy'}`}>
                      {bike.setupBase.sagRearPercent}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-primary rounded-lg border border-border p-3 hover:border-border-hover transition-all">
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Modo motor recomendado</p>
                <p className="text-sm font-bold font-mono text-accent">{bike.setupBase.motorModeRecommendation}</p>
              </div>

              <div className="bg-accent-subtle/50 rounded-lg border border-accent/15 p-3 hover:bg-accent-subtle transition-all">
                <p className="text-[9px] font-mono uppercase tracking-widest text-accent mb-1">Notas de rebote</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">{bike.setupBase.reboundNotes}</p>
              </div>
            </div>
          </div>

          {/* Terrain match */}
          <div className="panel p-5">
            <SectionTitle label="Uso recomendado" />
            <p className="text-[9px] font-mono text-text-muted mb-3">Fortalezas por terreno</p>
            <div className="space-y-1.5 mb-4">
              {bike.terrainStrengths.map(s => (
                <div key={s} className="flex items-center gap-2 text-[11px]">
                  <span className="text-accent text-xs">◆</span>
                  <span className="text-text-primary">{s}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border/40 pt-3 mb-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-2">Puntos débiles</p>
              <div className="space-y-1.5">
                {bike.weaknesses.map(w => (
                  <div key={w} className="flex items-center gap-2 text-[11px]">
                    <span className="text-energy text-xs">◇</span>
                    <span className="text-text-secondary">{w}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border/40 pt-3">
              <div className="flex items-center gap-3">
                <div className="bg-accent-subtle rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-sm font-bold font-mono text-accent">{bike.autonomyEstimate} km</p>
                  <p className="text-[8px] font-mono text-text-muted uppercase tracking-wider">Autonomía estimada</p>
                </div>
                <div className="bg-bg-primary rounded-lg border border-border px-3 py-2 text-center flex-1">
                  <p className="text-sm font-bold font-mono text-text-primary">{bike.specs.weight} kg</p>
                  <p className="text-[8px] font-mono text-text-muted uppercase tracking-wider">Peso total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rider profile */}
          <div className="panel p-5 bg-gradient-to-br from-accent/[0.03] to-transparent border-accent/10">
            <SectionTitle label="Perfil de ciclista" />
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Ideal para riders que buscan
              {bike.useType.includes('enduro') ? ' una máquina de enduro con capacidad de descenso agresivo' : ''}
              {bike.useType.includes('trail') ? ' versatilidad para rutas mixtas con y sin asistencia' : ''}
              {bike.useType.includes('bikepark') ? ' y rendimiento en bike park' : ''}
              {bike.useType.includes('rutas-largas') ? ', con autonomía para jornadas completas' : ''}.
              {' '}Con un peso de referencia de {bike.setupBase.riderWeightKg} kg para la configuración base.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

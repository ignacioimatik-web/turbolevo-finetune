import type { EBike } from '../types'
import { useAppState } from '../context/AppContext'

function GaugeBar({ value, max = 30, min = 15, label, unit = '%' }: { value: number; max?: number; min?: number; label: string; unit?: string }) {
  const pct = ((value - min) / (max - min)) * 100
  const clamped = Math.min(Math.max(pct, 0), 100)
  const isOptimal = value >= 22 && value <= 28

  return (
    <div className="bg-bg-primary rounded-lg p-3 border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted">{label}</span>
        <span className={`text-sm font-bold font-mono ${isOptimal ? 'text-accent' : 'text-energy'}`}>
          {value}{unit}
        </span>
      </div>
      <div className="h-2 bg-bg-hover rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isOptimal ? 'bg-accent' : 'bg-energy'}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="flex justify-between text-[8px] text-text-muted font-mono mt-1">
        <span>{min}{unit}</span>
        <span>Óptimo 22-28%</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

function ClicksBar({ value, max = 12, label }: { value: number; max?: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-mono text-text-muted w-10 shrink-0">{label}</span>
      <div className="flex gap-0.5 flex-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-sm transition-all duration-300 ${
              i < value ? 'bg-accent' : 'bg-bg-hover'
            } ${i < value ? 'shadow-sm shadow-accent/20' : ''}`}
          />
        ))}
      </div>
      <span className="text-[11px] font-mono text-accent font-bold w-6 text-right">{value}</span>
    </div>
  )
}

export function SetupCard({ bike }: { bike: EBike }) {
  const s = bike.recommendedSetup
  const { isInGarage, addToGarage, removeFromGarage } = useAppState()
  const inGarage = isInGarage(bike.id)

  return (
    <div className="panel p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted">{bike.brand}</p>
          <h3 className="text-sm font-bold text-text-primary">{bike.model}</h3>
        </div>
        <span className="chip-accent text-[9px]">{s.terrainType}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <GaugeBar value={s.sag.front} label="Sag Del." />
        <GaugeBar value={s.sag.rear} label="Sag Tras." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-primary rounded-lg p-3 border border-border">
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted block mb-1">Horquilla</span>
          <p className="text-lg font-bold font-mono text-text-primary">{s.forkPressure} <span className="text-xs text-text-muted font-normal">psi</span></p>
        </div>
        <div className="bg-bg-primary rounded-lg p-3 border border-border">
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted block mb-1">Amortiguador</span>
          <p className="text-lg font-bold font-mono text-text-primary">{s.shockPressure} <span className="text-xs text-text-muted font-normal">psi</span></p>
        </div>
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted block">Rebote</span>
        <ClicksBar value={s.rebound.front} label="Front" />
        <ClicksBar value={s.rebound.rear} label="Rear" />
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted block">Compresión</span>
        <ClicksBar value={s.compression.front} max={10} label="Front" />
        <ClicksBar value={s.compression.rear} max={10} label="Rear" />
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted block mb-1">Neumáticos</span>
          <p className="text-xs font-mono text-text-primary">
            <span className="text-accent font-bold">{s.tirePressure.front}</span>
            <span className="text-text-muted mx-0.5">/</span>
            <span className="text-accent font-bold">{s.tirePressure.rear}</span>
          </p>
          <p className="text-[9px] text-text-muted mt-0.5">{s.tirePressure.terrain}</p>
        </div>
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted block mb-1">Modo motor</span>
          <p className="text-xs font-bold font-mono text-accent">{s.motorMode}</p>
          <p className="text-[9px] text-text-muted mt-0.5">~{s.estimatedRange} km autonomía</p>
        </div>
      </div>

      <button
        onClick={() => (inGarage ? removeFromGarage(bike.id) : addToGarage(bike.id))}
        className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
          inGarage
            ? 'bg-success/10 text-success border-success/30'
            : 'bg-accent-subtle text-accent border-accent/30 hover:bg-accent/20'
        }`}
      >
        {inGarage ? '★ En garaje' : '☆ Guardar setup'}
      </button>
    </div>
  )
}

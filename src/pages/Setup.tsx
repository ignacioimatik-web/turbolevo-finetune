import { useState, useMemo } from 'react'
import { useAppState } from '../context/AppContext'
import { SetupCard } from '../components/SetupCard'
import { getUseTypeLabel } from '../utils/helpers'
import type { UseType } from '../types'
import {
  calculateSetup,
  getTerrainLabel,
  getRidingStyleLabel,
  type TerrainType,
  type RidingStyle,
  type SetupInput,
  type SetupOutput,
} from '../utils/setupCalculator'

const useTypes: UseType[] = ['trail', 'enduro', 'bikepark', 'rutas-largas']

const TERRAINS: TerrainType[] = ['roca-tecnica', 'barro', 'seco-polvo', 'bike-park', 'rutas-largas', 'mixto']
const STYLES: RidingStyle[] = ['conservador', 'equilibrado', 'agresivo']

const DEFAULT_INPUT: SetupInput = {
  riderWeight: 78,
  backpackWeight: 3,
  terrain: 'mixto',
  ridingStyle: 'equilibrado',
  frontTireWidth: 2.5,
  rearTireWidth: 2.4,
  hasMousse: false,
  batteryCapacity: 720,
  elevationGain: 600,
  distance: 45,
}

function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">{label}</label>
        <span className="text-xs font-mono font-bold text-text-primary">
          {value}{unit && <span className="text-[9px] text-text-muted font-normal ml-0.5">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-bg-card [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200
          [&::-webkit-slider-thumb]:hover:scale-125
          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-bg-card"
        style={{
          background: `linear-gradient(to right, #84cc16 ${((value - min) / (max - min)) * 100}%, #2a2a2a ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      <div className="flex justify-between text-[8px] font-mono text-text-muted/50 mt-0.5">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

function ResultCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="bg-bg-primary/60 border border-border rounded-xl px-4 py-3 text-center transition-all duration-200 hover:border-border-hover hover:bg-bg-hover/30">
      <div className="text-lg mb-1 opacity-40">{icon}</div>
      <p className={`text-lg sm:text-xl font-bold font-mono ${accent ? 'text-accent' : 'text-text-primary'}`}>
        {value}
      </p>
      <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider mt-0.5">{label}</p>
      {sub && <p className={`text-[8px] font-mono mt-0.5 ${sub.includes('Insuficiente') ? 'text-energy' : 'text-text-muted/60'}`}>{sub}</p>}
    </div>
  )
}

function SagGauge({ value, label }: { value: number; label: string }) {
  const isOptimal = value >= 22 && value <= 28
  const color = isOptimal ? '#84cc16' : '#f97316'
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-text-muted font-mono">{label}</span>
        <span className="font-mono font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2.5 bg-bg-hover rounded-full overflow-hidden relative ring-1 ring-inset ring-white/5">
        <div
          className="absolute inset-y-0 rounded-full opacity-20"
          style={{ left: '22%', right: `${100 - 28}%`, backgroundColor: '#84cc16' }}
        />
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(value, 33)}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[7px] font-mono text-text-muted/50 mt-0.5">
        <span>0%</span>
        <span>22%</span>
        <span>28%</span>
        <span>33%</span>
      </div>
    </div>
  )
}

export function Setup() {
  const { bikes } = useAppState()
  const [input, setInput] = useState<SetupInput>(DEFAULT_INPUT)
  const [selectedType, setSelectedType] = useState<UseType | 'all'>('all')
  const [showReference, setShowReference] = useState(false)

  const result: SetupOutput = useMemo(() => calculateSetup(input), [input])

  const filtered = selectedType === 'all'
    ? bikes
    : bikes.filter(b => b.useType.includes(selectedType))

  const update = <K extends keyof SetupInput>(k: K, v: SetupInput[K]) =>
    setInput(prev => ({ ...prev, [k]: v }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Calculadora de Setup
        </h1>
        <p className="text-xs text-text-muted font-mono mt-0.5">
          Estimación orientativa de presión, sag, modo motor y autonomía
        </p>
      </div>

      {/* ── Calculator ── */}
      <div className="grid lg:grid-cols-5 gap-6 mb-10">
        {/* Inputs — 3/5 */}
        <div className="lg:col-span-3 panel p-4 sm:p-5 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-4 rounded-full bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent font-mono">Tus datos</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            <InputSlider label="Peso ciclista" value={input.riderWeight} onChange={v => update('riderWeight', v)} min={45} max={140} unit="kg" />
            <InputSlider label="Mochila / equipo" value={input.backpackWeight} onChange={v => update('backpackWeight', v)} min={0} max={15} unit="kg" />
            <InputSlider label="Batería de la bici" value={input.batteryCapacity} onChange={v => update('batteryCapacity', v)} min={400} max={1000} step={10} unit="Wh" />
            <InputSlider label="Desnivel previsto" value={input.elevationGain} onChange={v => update('elevationGain', v)} min={0} max={2500} step={50} unit="m" />
            <InputSlider label="Distancia prevista" value={input.distance} onChange={v => update('distance', v)} min={5} max={150} unit="km" />
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <InputSlider label="Neumático del." value={input.frontTireWidth} onChange={v => update('frontTireWidth', v)} min={2.0} max={2.8} step={0.1} unit='"' />
              <InputSlider label="Neumático tras." value={input.rearTireWidth} onChange={v => update('rearTireWidth', v)} min={2.0} max={2.8} step={0.1} unit='"' />
            </div>
          </div>

          <div className="border-t border-border pt-4 grid sm:grid-cols-3 gap-4">
            {/* Terrain */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-2">Terreno</p>
              <div className="flex flex-wrap gap-1.5">
                {TERRAINS.map(t => (
                  <button
                    key={t}
                    onClick={() => update('terrain', t)}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 ${
                      input.terrain === t
                        ? 'bg-accent text-black border-accent'
                        : 'bg-transparent text-text-muted border-border hover:text-text-primary hover:border-border-hover'
                    }`}
                  >
                    {getTerrainLabel(t)}
                  </button>
                ))}
              </div>
            </div>

            {/* Riding style */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-2">Estilo</p>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map(s => (
                  <button
                    key={s}
                    onClick={() => update('ridingStyle', s)}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 ${
                      input.ridingStyle === s
                        ? 'bg-accent text-black border-accent'
                        : 'bg-transparent text-text-muted border-border hover:text-text-primary hover:border-border-hover'
                    }`}
                  >
                    {getRidingStyleLabel(s)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mousse */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-2">Mousse</p>
              <button
                onClick={() => update('hasMousse', !input.hasMousse)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 ${
                  input.hasMousse
                    ? 'bg-energy/15 text-energy border-energy/30'
                    : 'bg-transparent text-text-muted border-border hover:text-text-primary hover:border-border-hover'
                }`}
              >
                {input.hasMousse ? 'Sí' : 'No'}
              </button>
            </div>
          </div>

          <div className="border-t border-border/40 pt-3 flex justify-end">
            <button
              onClick={() => setInput(DEFAULT_INPUT)}
              className="text-[9px] font-mono uppercase tracking-wider text-text-muted hover:text-accent transition-colors"
            >
              Restaurar valores por defecto
            </button>
          </div>
        </div>

        {/* Results — 2/5 */}
        <div className="lg:col-span-2 panel p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-4 rounded-full bg-energy" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-energy font-mono">Resultado</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ResultCard icon="▼" label="Presión delantera" value={`${result.frontPsi} psi`} accent />
            <ResultCard icon="▲" label="Presión trasera" value={`${result.rearPsi} psi`} accent />
          </div>

          <div className="space-y-3">
            <SagGauge value={result.sagFrontPercent} label="Sag delantero" />
            <SagGauge value={result.sagRearPercent} label="Sag trasero" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ResultCard
              icon="⚡"
              label="Modo motor"
              value={result.motorMode}
              accent
            />
            <ResultCard
              icon="🔋"
              label="Autonomía estimada"
              value={`${result.estimatedAutonomy} km`}
              sub={result.autonomySufficient ? 'Suficiente para la ruta' : `Insuficiente para ${input.distance} km`}
              accent={result.autonomySufficient}
            />
          </div>

          {result.notes.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-[8px] font-mono uppercase tracking-widest text-text-muted mb-2">Notas de ajuste</p>
              <ul className="space-y-1">
                {result.notes.map((note, i) => (
                  <li key={i} className="text-[9px] text-text-secondary leading-relaxed flex gap-2">
                    <span className="text-text-muted/40 mt-0.5 shrink-0">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-accent-subtle/30 border border-accent/10 rounded-xl px-3 py-2.5">
            <p className="text-[8px] font-mono text-accent/70">
              Estimación orientativa. Siempre comprobar con manómetro y ajustar según sensaciones sobre el terreno.
            </p>
          </div>
        </div>
      </div>

      {/* ── Reference setups toggle ── */}
      <div className="border-t border-border pt-6 mb-4">
        <button
          onClick={() => setShowReference(!showReference)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-200 ${showReference ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Ver setups de referencia por modelo
        </button>
      </div>

      {showReference && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {([
              { value: 'all' as const, label: 'Todos' },
              ...useTypes.map(type => ({ value: type, label: getUseTypeLabel(type) })),
            ] as { value: UseType | 'all'; label: string }[]).map(item => (
              <button
                key={item.value}
                onClick={() => setSelectedType(item.value)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                  selectedType === item.value
                    ? 'bg-accent text-black border-accent'
                    : 'bg-transparent text-text-muted border-border hover:text-text-primary hover:border-border-hover'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(bike => (
              <SetupCard key={bike.id} bike={bike} />
            ))}
          </div>

          <div className="mt-10 panel overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-accent font-mono">
                Scores de setup
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-bg-secondary/50">
                    <th className="text-left px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-widest">Modelo</th>
                    <th className="px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-widest text-center">Sag F</th>
                    <th className="px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-widest text-center">Sag R</th>
                    <th className="px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-widest text-center">Horquilla</th>
                    <th className="px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-widest text-center">Amortiguador</th>
                    <th className="px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-widest text-center">Modo</th>
                    <th className="px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-widest text-center">Autonomía</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(bike => (
                    <tr key={bike.id} className="border-t border-border hover:bg-bg-hover/30 transition-colors">
                      <td className="px-4 py-2.5 text-text-primary font-medium text-xs">{bike.brand} {bike.model}</td>
                      <td className="px-4 py-2.5 text-center font-mono text-text-primary">{bike.recommendedSetup.sag.front}%</td>
                      <td className="px-4 py-2.5 text-center font-mono text-text-primary">{bike.recommendedSetup.sag.rear}%</td>
                      <td className="px-4 py-2.5 text-center font-mono text-text-primary">{bike.recommendedSetup.forkPressure} psi</td>
                      <td className="px-4 py-2.5 text-center font-mono text-text-primary">{bike.recommendedSetup.shockPressure} psi</td>
                      <td className="px-4 py-2.5 text-center font-mono text-accent font-bold">{bike.recommendedSetup.motorMode}</td>
                      <td className="px-4 py-2.5 text-center font-mono text-text-primary">{bike.recommendedSetup.estimatedRange} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

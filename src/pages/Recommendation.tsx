import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { BikeImage } from '../components/BikeImage'
import { formatPrice } from '../utils/helpers'
import {
  getRecommendation,
  type RecommendationInput,
  type RecommendationOutput,
  type MainTerrain,
  type RidingStyle,
  type Priority,
  type RouteType,
} from '../utils/recommendationEngine'
const TERRAIN_OPTIONS: { value: MainTerrain; label: string; icon: string }[] = [
  { value: 'enduro', label: 'Enduro', icon: '▽' },
  { value: 'trail', label: 'Trail', icon: '🌲' },
  { value: 'bikepark', label: 'Bike Park', icon: '⚡' },
  { value: 'rutas-largas', label: 'Rutas largas', icon: '🗻' },
  { value: 'mixto', label: 'Mixto', icon: '◈' },
]

const STYLE_OPTIONS: { value: RidingStyle; label: string; desc: string }[] = [
  { value: 'conservador', label: 'Conservador', desc: 'Suave, controlado' },
  { value: 'equilibrado', label: 'Equilibrado', desc: 'Versátil' },
  { value: 'agresivo', label: 'Agresivo', desc: 'Intenso, saltos' },
]

const PRIORITY_OPTIONS: { value: Priority; label: string; icon: string }[] = [
  { value: 'subir', label: 'Subir', icon: '↑' },
  { value: 'equilibrado', label: 'Equilibrado', icon: '⇅' },
  { value: 'bajar', label: 'Bajar', icon: '↓' },
]

const ROUTE_OPTIONS: { value: RouteType; label: string; icon: string }[] = [
  { value: 'rutas-largas', label: 'Rutas largas', icon: '🗻' },
  { value: 'mixto', label: 'Mixto', icon: '◈' },
  { value: 'bike-park', label: 'Bike Park', icon: '⚡' },
]

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 ${
              n <= value
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'bg-bg-secondary/40 text-text-muted border border-border/60 hover:border-border'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

function btnStyle(active: boolean): string {
  return active
    ? 'bg-accent/10 text-accent border-accent/30 shadow-[0_0_12px_-4px_#84cc16]'
    : 'bg-bg-secondary/40 text-text-muted border-border/60 hover:border-border hover:text-text-primary'
}

function ResultCard({
  item,
  rank,
}: {
  item: RecommendationOutput['recommendations'][number]
  rank: number
}) {
  const bike = item.bike
  const rankColors = ['text-amber-400', 'text-slate-300', 'text-amber-700']
  const rankLabels = ['1ª elección', '2ª opción', '3ª opción']

  return (
    <div className="panel overflow-hidden relative group hover:border-accent/30 transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <span className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider font-mono border ${rankColors[rank]} border-current/30 bg-black/40 backdrop-blur-sm`}>
          {rankLabels[rank]}
        </span>
        <span className="px-2 py-1 rounded-lg text-[9px] font-bold font-mono text-accent border border-accent/30 bg-accent/10">
          {item.score}%
        </span>
      </div>

      <div className="relative">
        <BikeImage bike={bike} className="h-36 sm:h-44" />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted">{bike.brand}</p>
            <Link to={`/bike/${bike.id}`} className="text-sm font-bold text-text-primary hover:text-accent transition-colors">
              {bike.model}
            </Link>
          </div>
          <p className="text-sm font-bold text-accent font-mono shrink-0">{formatPrice(bike.price)}</p>
        </div>

        <p className="text-[10px] text-text-secondary leading-relaxed mb-3 bg-accent-subtle/30 border border-accent/10 rounded-lg px-3 py-2">
          {item.reason}
        </p>

        {item.strengths.length > 0 && (
          <div className="mb-3">
            <p className="text-[8px] font-mono uppercase tracking-widest text-accent mb-1.5">Fortalezas</p>
            <ul className="space-y-0.5">
              {item.strengths.map(s => (
                <li key={s} className="flex items-start gap-1.5 text-[10px] text-text-primary">
                  <span className="text-accent mt-0.5 shrink-0">◆</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.weaknesses.length > 0 && (
          <div className="mb-3">
            <p className="text-[8px] font-mono uppercase tracking-widest text-energy mb-1.5">Aspectos a considerar</p>
            <ul className="space-y-0.5">
              {item.weaknesses.map(w => (
                <li key={w} className="flex items-start gap-1.5 text-[10px] text-text-secondary">
                  <span className="text-energy/60 mt-0.5 shrink-0">◇</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-border/40 pt-3 mt-3">
          <p className="text-[8px] font-mono uppercase tracking-widest text-accent mb-1">Consejo de setup</p>
          <p className="text-[10px] text-text-secondary leading-relaxed">{item.setupTip}</p>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            to={`/bike/${bike.id}`}
            className="flex-1 text-center py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-200"
          >
            Ver ficha
          </Link>
          <Link
            to={`/setup?bike=${bike.id}`}
            className="flex-1 text-center py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all duration-200"
          >
            Calcular setup
          </Link>
        </div>
      </div>
    </div>
  )
}

const DEFAULT_INPUT: RecommendationInput = {
  riderWeight: 78,
  budget: 10000,
  mainTerrain: 'enduro',
  importanceAutonomy: 3,
  importanceWeight: 3,
  ridingStyle: 'equilibrado',
  priority: 'equilibrado',
  routeType: 'mixto',
  simpleMaintenance: false,
}

export function Recommendation() {
  const { bikes } = useAppState()
  const [input, setInput] = useState<RecommendationInput>(DEFAULT_INPUT)
  const [result, setResult] = useState<RecommendationOutput | null>(null)
  const [showDiscarded, setShowDiscarded] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const update = <K extends keyof RecommendationInput>(key: K, value: RecommendationInput[K]) => {
    setInput(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const r = getRecommendation(input, bikes)
    setResult(r)
    setHasRun(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="panel overflow-hidden mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-energy/[0.03] pointer-events-none" />
        <div className="p-6 sm:p-8 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Recomendación <span className="text-accent">Inteligente</span>
              </h1>
              <p className="text-xs text-text-muted font-mono mt-0.5">
                Encuentra la e-bike perfecta para ti · Análisis determinista en 8 factores
              </p>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            Responde las preguntas y el sistema analizará cada modelo contra tus preferencias.
            La recomendación es 100% transparente: puedes ver exactamente por qué cada bici
            puntúa como lo hace.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form — left column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="panel p-5 sm:p-6 space-y-6 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            <p className="text-[10px] font-bold uppercase tracking-widest text-accent font-mono flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Tus preferencias
            </p>

            {/* Rider weight */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                Peso del ciclista: <span className="text-accent font-bold">{input.riderWeight} kg</span>
              </p>
              <input
                type="range"
                min={45}
                max={130}
                value={input.riderWeight}
                onChange={e => update('riderWeight', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[8px] text-text-muted font-mono mt-1">
                <span>45 kg</span>
                <span>130 kg</span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                Presupuesto: <span className="text-accent font-bold">{input.budget.toLocaleString('es-ES')} €</span>
              </p>
              <input
                type="range"
                min={5000}
                max={13000}
                step={500}
                value={input.budget}
                onChange={e => update('budget', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[8px] text-text-muted font-mono mt-1">
                <span>5.000 €</span>
                <span>13.000 €</span>
              </div>
            </div>

            {/* Main terrain */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Terreno principal</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {TERRAIN_OPTIONS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => update('mainTerrain', t.value)}
                    className={`px-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 ${btnStyle(input.mainTerrain === t.value)}`}
                  >
                    <span className="block text-sm mb-0.5">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Riding style */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Estilo de conducción</p>
              <div className="grid grid-cols-3 gap-1.5">
                {STYLE_OPTIONS.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => update('ridingStyle', s.value)}
                    className={`px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 ${btnStyle(input.ridingStyle === s.value)}`}
                  >
                    {s.label}
                    <span className="block text-[8px] font-normal lowercase mt-0.5 opacity-60">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Prioridad</p>
              <div className="grid grid-cols-3 gap-1.5">
                {PRIORITY_OPTIONS.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => update('priority', p.value)}
                    className={`px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 ${btnStyle(input.priority === p.value)}`}
                  >
                    <span className="block text-sm mb-0.5">{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Route type */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Tipo de ruta</p>
              <div className="grid grid-cols-3 gap-1.5">
                {ROUTE_OPTIONS.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => update('routeType', r.value)}
                    className={`px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 ${btnStyle(input.routeType === r.value)}`}
                  >
                    <span className="block text-sm mb-0.5">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Importance factors */}
            <div className="grid grid-cols-2 gap-4">
              <StarRating
                label="Importancia autonomía"
                value={input.importanceAutonomy}
                onChange={v => update('importanceAutonomy', v as 1|2|3|4|5)}
              />
              <StarRating
                label="Importancia peso"
                value={input.importanceWeight}
                onChange={v => update('importanceWeight', v as 1|2|3|4|5)}
              />
            </div>

            {/* Simple maintenance toggle */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Mantenimiento</p>
              <button
                type="button"
                onClick={() => update('simpleMaintenance', !input.simpleMaintenance)}
                className={`w-full px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 flex items-center justify-center gap-2 ${btnStyle(input.simpleMaintenance)}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                {input.simpleMaintenance ? 'Sí, prefiero mantenimiento sencillo' : 'No es prioritario'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-widest hover:bg-accent/25 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Obtener recomendación
            </button>
          </form>
        </div>

        {/* Results — right column */}
        <div className="lg:col-span-3 space-y-6">
          {!hasRun && (
            <div className="panel p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <div className="w-16 h-16 rounded-2xl bg-accent-subtle flex items-center justify-center mx-auto mb-5 ring-1 ring-accent/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-text-primary mb-1">Completa tus preferencias</p>
              <p className="text-xs text-text-muted mb-2 max-w-sm mx-auto leading-relaxed">
                Selecciona tus datos y preferencias en el formulario, luego pulsa «Obtener recomendación».
                El sistema analizará los 12 modelos contra tus criterios.
              </p>
              <div className="max-w-xs mx-auto mt-6 grid grid-cols-2 gap-2">
                {[
                  { icon: '▲', label: 'Precio' },
                  { icon: '▼', label: 'Terreno' },
                  { icon: '⚡', label: 'Autonomía' },
                  { icon: '↓', label: 'Peso' },
                ].map(f => (
                  <div key={f.label} className="bg-bg-secondary/30 border border-border/60 rounded-lg px-3 py-2 text-center">
                    <span className="text-xs opacity-50">{f.icon}</span>
                    <p className="text-[8px] font-mono text-text-muted mt-0.5">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <>
              {/* Recommendations */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-accent" />
                  <h2 className="text-lg font-bold text-text-primary">
                    Tus mejores opciones
                  </h2>
                </div>
                {result.recommendations.map((item, i) => (
                  <ResultCard key={item.bike.id} item={item} rank={i} />
                ))}
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="panel p-5 border-energy/20">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-energy font-mono">Advertencias</span>
                  </div>
                  <ul className="space-y-1.5">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-[10px] text-text-secondary">
                        <span className="text-energy/60 mt-0.5 shrink-0">◇</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Discarded bikes */}
              {result.discarded.length > 0 && (
                <div className="panel p-5">
                  <button
                    onClick={() => setShowDiscarded(!showDiscarded)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      Modelos descartados ({result.discarded.length})
                    </span>
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`transition-transform duration-200 ${showDiscarded ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {showDiscarded && (
                    <div className="mt-4 space-y-2 divide-y divide-border/40">
                      {result.discarded.map(d => (
                        <div key={d.bike.id} className="flex items-start justify-between gap-3 pt-2 first:pt-0">
                          <div className="min-w-0">
                            <Link to={`/bike/${d.bike.id}`} className="text-[11px] font-bold text-text-primary hover:text-accent transition-colors">
                              {d.bike.brand} {d.bike.model}
                            </Link>
                            <p className="text-[9px] text-text-muted mt-0.5 leading-relaxed">{d.reason}</p>
                          </div>
                          <span className="text-[10px] font-mono text-text-muted shrink-0">{formatPrice(d.bike.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

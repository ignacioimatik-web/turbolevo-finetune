import { Link } from 'react-router-dom'
import type { EBike } from '../types'
import { formatPrice, getUseTypeLabel } from '../utils/helpers'
import { useAppState } from '../context/AppContext'

interface RowDef {
  label: string
  getValue: (b: EBike) => string
  highlight?: 'higher' | 'lower'
}

const rows: RowDef[] = [
  { label: 'Precio', getValue: b => formatPrice(b.price), highlight: 'lower' },
  { label: 'Peso', getValue: b => `${b.specs.weight} kg`, highlight: 'lower' },
  { label: 'Batería', getValue: b => `${b.battery.capacity} Wh`, highlight: 'higher' },
  { label: 'Motor', getValue: b => `${b.motor.brand} ${b.motor.model}` },
  { label: 'Par motor', getValue: b => `${b.motor.torque} Nm`, highlight: 'higher' },
  { label: 'Rec. delantero', getValue: b => `${b.suspension.front.travel} mm`, highlight: 'higher' },
  { label: 'Rec. trasero', getValue: b => `${b.suspension.rear.travel} mm`, highlight: 'higher' },
  { label: 'Cuadro', getValue: b => b.frame.material },
  { label: 'Ruedas', getValue: b => `${b.specs.wheels}"` },
  { label: 'Horquilla', getValue: b => `${b.suspension.front.brand} ${b.suspension.front.model}` },
  { label: 'Amortiguador', getValue: b => `${b.suspension.rear.brand} ${b.suspension.rear.model}` },
  { label: 'Frenos', getValue: b => b.specs.brakes },
  { label: 'Transmisión', getValue: b => b.specs.drivetrain },
  { label: 'Ángulo dirección', getValue: b => `${b.frame.geometry.headAngle}°` },
  { label: 'Ángulo sillín', getValue: b => `${b.frame.geometry.seatAngle}°` },
  { label: 'Reach', getValue: b => `${b.frame.geometry.reach} mm` },
  { label: 'Stack', getValue: b => `${b.frame.geometry.stack} mm` },
  { label: 'Chainstay', getValue: b => `${b.frame.geometry.chainstay} mm` },
  { label: 'Distancia ejes', getValue: b => `${b.frame.geometry.wheelbase} mm` },
  { label: 'Uso', getValue: b => b.useType.map(getUseTypeLabel).join(', ') },
  { label: 'Autonomía', getValue: b => `${b.autonomyEstimate} km`, highlight: 'higher' },
]

function parseNumeric(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9,.-]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

function getHighlightTargets(bikes: EBike[], row: RowDef): number[] {
  if (!row.highlight) return []
  const nums = bikes.map(b => parseNumeric(row.getValue(b)))
  if (nums.every(n => n === null)) return []
  const valid = nums.filter((n): n is number => n !== null)
  const target = row.highlight === 'higher' ? Math.max(...valid) : Math.min(...valid)
  return nums.map((n, i) => (n === target ? i : -1)).filter(i => i >= 0)
}

function BikeRemoveBtn({ bikeId }: { bikeId: string }) {
  const { removeFromCompare } = useAppState()
  return (
    <button
      onClick={() => removeFromCompare(bikeId)}
      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-bg-card border border-border flex items-center justify-center hover:bg-error/20 hover:border-error/40 hover:text-error transition-all duration-200 group z-20"
      title="Eliminar del comparador"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-error">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}

/* ── Desktop table ── */
function DesktopTable({ bikes }: { bikes: EBike[] }) {
  const { clearCompare } = useAppState()

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-xs min-w-[600px]">
        <thead>
          <tr className="bg-bg-secondary/50">
            <th className="text-left px-4 py-3 text-text-muted text-[10px] font-mono uppercase tracking-widest sticky left-0 bg-bg-secondary/80 z-10 min-w-[130px] border-r border-border">
              Especificación
            </th>
            {bikes.map((b, i) => (
              <th
                key={b.id}
                className={`px-4 py-3 text-center min-w-[170px] relative ${i < bikes.length - 1 ? 'border-r border-border' : ''}`}
              >
                <div className="pr-6">
                  <Link to={`/bike/${b.id}`} className="block hover:text-accent transition-colors">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">{b.brand}</span>
                    <span className="block text-xs font-bold text-text-primary mt-0.5">{b.model}</span>
                  </Link>
                </div>
                <div className="absolute top-3 right-2">
                  <BikeRemoveBtn bikeId={b.id} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const targets = getHighlightTargets(bikes, row)
            return (
              <tr key={row.label} className={`border-t border-border transition-colors duration-150 ${
                ri % 2 === 0 ? 'hover:bg-bg-hover/30' : 'bg-bg-secondary/10 hover:bg-bg-hover/30'
              }`}>
                <td className="px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-wider sticky left-0 z-10 border-r border-border"
                  style={ri % 2 === 0 ? { backgroundColor: 'var(--color-bg-primary)' } : { backgroundColor: 'var(--color-bg-secondary)' }}>
                  {row.label}
                </td>
                {bikes.map((b, i) => (
                  <td
                    key={b.id}
                    className={`px-4 py-2.5 text-center font-mono ${
                      i < bikes.length - 1 ? 'border-r border-border' : ''
                    } ${
                      targets.includes(i) ? 'text-accent font-bold' : 'text-text-primary'
                    }`}
                  >
                    {row.getValue(b)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="px-4 py-3 border-t border-border flex justify-between items-center bg-bg-secondary/30">
        <span className="text-[9px] font-mono text-text-muted">
          {bikes.length} modelos · Los valores destacados en <span className="text-accent font-bold">verde</span> son los mejores de cada categoría
        </span>
        <button onClick={clearCompare} className="text-[10px] font-bold uppercase tracking-widest text-energy hover:text-energy/80 transition-colors">
          Limpiar todo
        </button>
      </div>
    </div>
  )
}

/* ── Mobile comparison cards ── */
function MobileCards({ bikes }: { bikes: EBike[] }) {
  const { clearCompare } = useAppState()

  return (
    <div className="space-y-4">
      {bikes.map(bike => (
          <div key={bike.id} className="panel overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <BikeRemoveBtn bikeId={bike.id} />
            <div className="p-4 border-b border-border bg-bg-secondary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted">{bike.brand}</p>
                  <Link to={`/bike/${bike.id}`} className="text-sm font-bold text-text-primary hover:text-accent transition-colors">
                    {bike.model}
                  </Link>
                </div>
                <p className="text-sm font-bold font-mono text-accent">{formatPrice(bike.price)}</p>
              </div>
            </div>

            <div className="divide-y divide-border/40">
              {rows.map((row, ri) => {
                const targets = getHighlightTargets(bikes, row)
                const isBest = targets.includes(bikes.indexOf(bike))
                return (
                  <div key={row.label} className={`flex justify-between items-center px-4 py-2 ${ri % 2 === 0 ? 'bg-bg-secondary/5' : ''}`}>
                    <span className="text-[10px] text-text-muted">{row.label}</span>
                    <span className={`text-[10px] font-mono ${isBest ? 'text-accent font-bold' : 'text-text-primary'}`}>
                      {row.getValue(bike)}
                      {isBest && (
                        <span className="ml-1 inline-block">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      )}
      <button onClick={clearCompare} className="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-border text-text-muted hover:border-border-hover hover:text-energy active:scale-[0.98] transition-all duration-200">
        Limpiar comparador
      </button>
    </div>
  )
}

/* ── Main export ── */
export function ComparisonTable({ bikes }: { bikes: EBike[] }) {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopTable bikes={bikes} />
      </div>
      <div className="lg:hidden">
        <MobileCards bikes={bikes} />
      </div>
    </>
  )
}

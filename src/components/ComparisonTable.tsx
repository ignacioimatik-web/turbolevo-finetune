import { Link } from 'react-router-dom'
import type { EBike } from '../types'
import { formatPrice } from '../utils/helpers'
import { useAppState } from '../context/AppContext'

export function ComparisonTable({ bikes: compareBikes }: { bikes: EBike[] }) {
  const { clearCompare } = useAppState()

  if (compareBikes.length === 0) {
    return (
      <div className="text-center py-20 panel">
        <div className="text-3xl mb-4 opacity-20 font-mono">⇄</div>
        <p className="text-sm text-text-muted mb-2">No hay modelos seleccionados</p>
        <p className="text-xs text-text-muted mb-6">Selecciona bicis desde el catálogo para comparar</p>
        <Link to="/catalog" className="btn-primary text-xs">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  const rows: { label: string; getValue: (b: EBike) => string; highlight?: 'higher' | 'lower' }[] = [
    { label: 'Marca', getValue: b => b.brand },
    { label: 'Modelo', getValue: b => b.model },
    { label: 'Precio', getValue: b => formatPrice(b.price), highlight: 'lower' },
    { label: 'Peso', getValue: b => `${b.specs.weight} kg`, highlight: 'lower' },
    { label: 'Cuadro', getValue: b => b.frame.material },
    { label: 'Rec. delantero', getValue: b => `${b.suspension.front.travel} mm`, highlight: 'higher' },
    { label: 'Rec. trasero', getValue: b => `${b.suspension.rear.travel} mm`, highlight: 'higher' },
    { label: 'Ángulo dirección', getValue: b => `${b.frame.geometry.headAngle}°` },
    { label: 'Reach', getValue: b => `${b.frame.geometry.reach} mm` },
    { label: 'Horquilla', getValue: b => `${b.suspension.front.brand} ${b.suspension.front.model}` },
    { label: 'Amortiguador', getValue: b => `${b.suspension.rear.brand} ${b.suspension.rear.model}` },
    { label: 'Motor', getValue: b => `${b.motor.brand} ${b.motor.model}` },
    { label: 'Par motor', getValue: b => `${b.motor.torque} Nm`, highlight: 'higher' },
    { label: 'Batería', getValue: b => `${b.battery.capacity} Wh`, highlight: 'higher' },
    { label: 'Autonomía (Trail)', getValue: b => `${b.battery.range.trail} km`, highlight: 'higher' },
    { label: 'Frenos', getValue: b => b.specs.brakes },
    { label: 'Transmisión', getValue: b => b.specs.drivetrain },
    { label: 'Uso', getValue: b => b.useType.join(', ') },
  ]

  function getHighlightIndices(row: typeof rows[number]): number[] {
    if (!row.highlight) return []
    const nums = compareBikes.map(b => {
      const raw = row.getValue(b)
      const num = parseFloat(raw)
      return isNaN(num) ? null : num
    })
    if (nums.every(n => n === null)) return []
    const valid = nums.filter((n): n is number => n !== null)
    const target = row.highlight === 'higher' ? Math.max(...valid) : Math.min(...valid)
    return nums.map((n, i) => (n === target ? i : -1)).filter(i => i >= 0)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Comparativa
          </h2>
          <span className="text-[10px] font-mono text-text-muted">
            ({compareBikes.length} modelos)
          </span>
        </div>
        <button onClick={clearCompare} className="btn-ghost text-[10px]">
          Limpiar todo
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-bg-secondary/50">
              <th className="text-left px-4 py-3 text-text-muted text-[10px] font-mono uppercase tracking-widest sticky left-0 bg-bg-secondary/80 z-10 min-w-[130px] border-r border-border">
                Especificación
              </th>
              {compareBikes.map((b, i) => (
                <th
                  key={b.id}
                  className={`px-4 py-3 text-center min-w-[170px] ${i < compareBikes.length - 1 ? 'border-r border-border' : ''}`}
                >
                  <Link
                    to={`/bike/${b.id}`}
                    className="block hover:text-accent transition-colors"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      {b.brand}
                    </span>
                    <span className="block text-xs font-bold text-text-primary mt-0.5">
                      {b.model}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const highlights = getHighlightIndices(row)
              return (
                <tr key={row.label} className="border-t border-border hover:bg-bg-hover/30 transition-colors">
                  <td className="px-4 py-2.5 text-text-muted text-[10px] font-mono uppercase tracking-wider sticky left-0 bg-bg-primary z-10 border-r border-border">
                    {row.label}
                  </td>
                  {compareBikes.map((b, i) => (
                    <td
                      key={b.id}
                      className={`px-4 py-2.5 text-center font-mono ${
                        i < compareBikes.length - 1 ? 'border-r border-border' : ''
                      } ${
                        highlights.includes(i) ? 'text-accent font-bold' : 'text-text-primary'
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
      </div>
    </div>
  )
}

import type { Terrain } from '../types'

const difficultyConfig = {
  fácil: { color: 'text-accent', border: 'border-accent/25', bg: 'bg-accent-subtle' },
  moderado: { color: 'text-warning', border: 'border-warning/25', bg: 'bg-warning/10' },
  difícil: { color: 'text-energy', border: 'border-energy/25', bg: 'bg-energy-subtle' },
  extremo: { color: 'text-error', border: 'border-error/25', bg: 'bg-error/10' },
}

export function TerrainCard({
  terrain,
  selected,
  onClick,
}: {
  terrain: Terrain
  selected?: boolean
  onClick?: () => void
}) {
  const dc = difficultyConfig[terrain.difficulty]
  const Element = onClick ? 'button' : 'div'

  return (
    <Element
      onClick={onClick}
      className={`panel-hover text-left w-full transition-all duration-300 ${
        selected ? 'ring-2 ring-accent' : ''
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{terrain.icon}</span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-text-primary leading-tight">
                {terrain.name}
              </h3>
              <p className="text-[10px] text-text-muted font-mono mt-0.5 line-clamp-1">
                {terrain.description}
              </p>
            </div>
          </div>
          <span className={`chip shrink-0 ${dc.color} ${dc.border} ${dc.bg}`}>
            {terrain.difficulty}
          </span>
        </div>

        <ul className="space-y-1.5">
          {terrain.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-text-secondary">
              <span className="text-accent mt-0.5 font-mono text-[8px] shrink-0">◆</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </Element>
  )
}

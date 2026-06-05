import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { TerrainCard } from '../components/TerrainCard'
import { BikeCard } from '../components/BikeCard'
import { terrains, routeContexts } from '../data/bikes'

export function Routes() {
  const { bikes } = useAppState()
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null)
  const selectedCtx = selectedTerrain
    ? routeContexts.find(r => r.id === selectedTerrain)
    : null

  const recommendedBikes = selectedCtx
    ? bikes.filter(b => selectedCtx.recommendedBikes.includes(b.id))
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
          Rutas y terrenos
        </h1>
        <p className="text-xs text-text-muted font-mono mt-0.5">
          Configuración óptima para cada tipo de terreno enduro
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {terrains.map(terrain => (
          <TerrainCard
            key={terrain.id}
            terrain={terrain}
            selected={selectedTerrain === terrain.id}
            onClick={() => setSelectedTerrain(selectedTerrain === terrain.id ? null : terrain.id)}
          />
        ))}
      </div>

      {selectedCtx && (
        <div className="space-y-6 animate-fade-in">
          <div className="panel p-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4 font-mono">
              Configuración · {selectedCtx.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Modo motor', value: selectedCtx.motorMode },
                { label: 'Consumo batería', value: `${selectedCtx.batteryConsumption}% / 100km` },
                { label: 'Ajuste sag', value: selectedCtx.sagAdjustment },
                { label: 'Neumáticos', value: selectedCtx.tireSetup },
              ].map(item => (
                <div key={item.label} className="bg-bg-primary rounded-lg border border-border px-4 py-3">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-accent">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {recommendedBikes.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4 font-mono">
                Bicicletas recomendadas
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendedBikes.map(bike => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            </div>
          )}

          <div className="panel p-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3 font-mono">
              Consejos rápidos
            </h2>
            <ul className="space-y-2">
              {selectedCtx.terrain.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="text-accent mt-0.5 font-mono text-[9px] shrink-0">◆</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!selectedTerrain && (
        <div className="text-center py-16 panel">
          <div className="text-4xl mb-4 opacity-20 font-mono">▲</div>
          <p className="text-sm text-text-muted">
            Selecciona un tipo de terreno para ver la configuración recomendada
          </p>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useAppState } from '../context/AppContext'
import { SetupCard } from '../components/SetupCard'
import { getUseTypeLabel } from '../utils/helpers'
import type { UseType } from '../types'

const useTypes: UseType[] = ['trail', 'enduro', 'bikepark', 'rutas-largas']

export function Setup() {
  const { bikes } = useAppState()
  const [selectedType, setSelectedType] = useState<UseType | 'all'>('all')

  const filtered = selectedType === 'all'
    ? bikes
    : bikes.filter(b => b.useType.includes(selectedType))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
          Setup recomendado
        </h1>
        <p className="text-xs text-text-muted font-mono mt-0.5">
          Configuraciones de suspensión, presión y asistencia
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'all' as const, label: 'Todos' },
          ...useTypes.map(type => ({ value: type as const, label: getUseTypeLabel(type) })),
        ].map(item => (
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
    </div>
  )
}

import { createContext, useContext, useCallback, type ReactNode } from 'react'
import type { EBike } from '../types'
import { bikes as defaultBikes } from '../data/bikes'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface AppState {
  bikes: EBike[]
  garage: string[]
  compare: string[]
  addToGarage: (id: string) => void
  removeFromGarage: (id: string) => void
  isInGarage: (id: string) => boolean
  toggleCompare: (id: string) => void
  removeFromCompare: (id: string) => void
  isInCompare: (id: string) => boolean
  clearCompare: () => void
  getBike: (id: string) => EBike | undefined
}

const AppContext = createContext<AppState | null>(null)

const GARAGE_KEY = 'enduro-garage'
const COMPARE_KEY = 'enduro-compare'

export function AppProvider({ children }: { children: ReactNode }) {
  const [garage, setGarage] = useLocalStorage<string[]>(GARAGE_KEY, [])
  const [compare, setCompare] = useLocalStorage<string[]>(COMPARE_KEY, [])

  const addToGarage = useCallback((id: string) => {
    setGarage(prev => Array.isArray(prev) ? (prev.includes(id) ? prev : [...prev, id]) : [id])
  }, [setGarage])

  const removeFromGarage = useCallback((id: string) => {
    setGarage(prev => Array.isArray(prev) ? prev.filter(b => b !== id) : prev)
  }, [setGarage])

  const isInGarage = useCallback(
    (id: string) => Array.isArray(garage) && garage.includes(id),
    [garage],
  )

  const toggleCompare = useCallback((id: string) => {
    setCompare(prev =>
      Array.isArray(prev) && prev.includes(id)
        ? prev.filter(b => b !== id)
        : Array.isArray(prev) && prev.length < 4
          ? [...prev, id]
          : prev,
    )
  }, [setCompare])

  const removeFromCompare = useCallback((id: string) => {
    setCompare(prev => Array.isArray(prev) ? prev.filter(b => b !== id) : prev)
  }, [setCompare])

  const isInCompare = useCallback(
    (id: string) => Array.isArray(compare) && compare.includes(id),
    [compare],
  )

  const clearCompare = useCallback(() => setCompare([]), [setCompare])

  const getBike = useCallback(
    (id: string) => defaultBikes.find(b => b.id === id),
    [],
  )

  return (
    <AppContext
      value={{
        bikes: defaultBikes,
        garage,
        compare,
        addToGarage,
        removeFromGarage,
        isInGarage,
        toggleCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        getBike,
      }}
    >
      {children}
    </AppContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used within AppProvider')
  return ctx
}

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { EBike } from '../types'
import { bikes as defaultBikes } from '../data/bikes'

interface GarageState {
  bikes: string[]
}

interface AppState {
  bikes: EBike[]
  garage: GarageState
  compare: string[]
  addToGarage: (id: string) => void
  removeFromGarage: (id: string) => void
  isInGarage: (id: string) => boolean
  toggleCompare: (id: string) => void
  isInCompare: (id: string) => boolean
  clearCompare: () => void
}

const AppContext = createContext<AppState | null>(null)

const GARAGE_KEY = 'enduro-garage'

function loadGarage(): GarageState {
  try {
    const stored = localStorage.getItem(GARAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { bikes: [] }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [garage, setGarage] = useState<GarageState>(loadGarage)
  const [compare, setCompare] = useState<string[]>([])

  useEffect(() => {
    localStorage.setItem(GARAGE_KEY, JSON.stringify(garage))
  }, [garage])

  const addToGarage = useCallback((id: string) => {
    setGarage(prev => ({
      bikes: prev.bikes.includes(id) ? prev.bikes : [...prev.bikes, id],
    }))
  }, [])

  const removeFromGarage = useCallback((id: string) => {
    setGarage(prev => ({
      bikes: prev.bikes.filter(b => b !== id),
    }))
  }, [])

  const isInGarage = useCallback(
    (id: string) => garage.bikes.includes(id),
    [garage.bikes],
  )

  const toggleCompare = useCallback((id: string) => {
    setCompare(prev =>
      prev.includes(id)
        ? prev.filter(b => b !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    )
  }, [])

  const isInCompare = useCallback(
    (id: string) => compare.includes(id),
    [compare],
  )

  const clearCompare = useCallback(() => setCompare([]), [])

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
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </AppContext>
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used within AppProvider')
  return ctx
}

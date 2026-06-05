import type { EBike, UseType } from '../types'

export function formatPrice(eur: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(eur)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-ES').format(n)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function getBikeImage(bike: EBike): string {
  return bike.image || `/bikes/${bike.id}.svg`
}

export function getUseTypeLabel(type: UseType): string {
  const labels: Record<UseType, string> = {
    trail: 'Trail',
    enduro: 'Enduro',
    bikepark: 'Bike Park',
    'rutas-largas': 'Rutas Largas',
  }
  return labels[type]
}

export function getUseTypeColor(type: UseType): string {
  const colors: Record<UseType, string> = {
    trail: '#22c55e',
    enduro: '#f97316',
    bikepark: '#ef4444',
    'rutas-largas': '#3b82f6',
  }
  return colors[type]
}

export function getBikeById(id: string, bikes: EBike[]): EBike | undefined {
  return bikes.find(b => b.id === id)
}

export function getBrandColor(brand: string): string {
  const colors: Record<string, string> = {
    Specialized: '#e0001b',
    Orbea: '#d40000',
    Trek: '#003366',
    Canyon: '#ffcc00',
    Commencal: '#000000',
    Cannondale: '#2c2c2c',
    Cube: '#174a2e',
    'Santa Cruz': '#ff6600',
    'YT Industries': '#ee3124',
    Mondraker: '#003366',
    Giant: '#004b87',
    Focus: '#8c1c1c',
  }
  return colors[brand] || '#71717a'
}

export function filterBikes(bikes: EBike[], filters: FilterState): EBike[] {
  let result = [...bikes]

  if (filters.brands.length > 0) {
    result = result.filter(b => filters.brands.includes(b.brand))
  }

  if (filters.useTypes.length > 0) {
    result = result.filter(b =>
      b.useType.some(t => filters.useTypes.includes(t))
    )
  }

  result = result.filter(
    b => b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1]
  )

  result = result.filter(
    b =>
      b.suspension.front.travel >= filters.travelRange[0] &&
      b.suspension.front.travel <= filters.travelRange[1]
  )

  result = result.filter(
    b =>
      b.battery.capacity >= filters.batteryRange[0] &&
      b.battery.capacity <= filters.batteryRange[1]
  )

  result = result.filter(
    b =>
      b.specs.weight >= filters.weightRange[0] &&
      b.specs.weight <= filters.weightRange[1]
  )

  result = result.filter(
    b =>
      b.motor.torque >= filters.motorTorqueRange[0] &&
      b.motor.torque <= filters.motorTorqueRange[1]
  )

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      b =>
        b.brand.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q)
    )
  }

  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'weight-asc':
      result.sort((a, b) => a.specs.weight - b.specs.weight)
      break
    case 'weight-desc':
      result.sort((a, b) => b.specs.weight - a.specs.weight)
      break
    case 'travel-front':
      result.sort((a, b) => b.suspension.front.travel - a.suspension.front.travel)
      break
    case 'battery':
      result.sort((a, b) => b.battery.capacity - a.battery.capacity)
      break
  }

  return result
}

interface FilterState {
  brands: string[]
  useTypes: UseType[]
  priceRange: [number, number]
  travelRange: [number, number]
  batteryRange: [number, number]
  weightRange: [number, number]
  motorTorqueRange: [number, number]
  sortBy: SortOption
  search: string
}

export type SortOption = 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc' | 'travel-front' | 'battery'

export const DEFAULT_FILTERS: FilterState = {
  brands: [],
  useTypes: [],
  priceRange: [3000, 15000],
  travelRange: [120, 200],
  batteryRange: [500, 1000],
  weightRange: [18, 30],
  motorTorqueRange: [50, 100],
  sortBy: 'price-asc',
  search: '',
}

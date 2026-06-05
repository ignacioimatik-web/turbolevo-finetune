export type UseType = 'trail' | 'enduro' | 'bikepark' | 'rutas-largas'

export interface EBike {
  id: string
  brand: string
  model: string
  year: number
  category: string
  tagline: string
  description: string
  price: number
  image: string
  brandColor: string
  wheelSetup: string
  terrainStrengths: string[]
  weaknesses: string[]
  autonomyEstimate: number
  imageTheme: string
  frame: {
    material: 'Carbon' | 'Aluminio'
    weight: number
    geometry: {
      headAngle: number
      seatAngle: number
      reach: number
      stack: number
      wheelbase: number
      chainstay: number
      bbDrop: number
    }
    sizes: string[]
  }
  motor: {
    brand: string
    model: string
    torque: number
    power: number
    assistModes: string[]
    sensor: string
  }
  battery: {
    capacity: number
    weight: number
    range: {
      eco: number
      trail: number
      turbo: number
    }
    removable: boolean
    chargerType: string
  }
  suspension: {
    front: {
      brand: string
      model: string
      travel: number
      adjustment: string
    }
    rear: {
      brand: string
      model: string
      travel: number
      leverageRatio: number
      adjustment: string
    }
  }
  specs: {
    weight: number
    wheels: number
    brakes: string
    drivetrain: string
    maxLoad: number
  }
  useType: UseType[]
  recommendedSetup: {
    tirePressure: { front: string; rear: string; terrain: string }
    sag: { front: number; rear: number }
    motorMode: string
    estimatedRange: number
    terrainType: string
    forkPressure: number
    shockPressure: number
    rebound: { front: number; rear: number }
    compression: { front: number; rear: number }
  }
  setupBase: {
    riderWeightKg: number
    frontPsi: number
    rearPsi: number
    sagFrontPercent: number
    sagRearPercent: number
    reboundNotes: string
    motorModeRecommendation: string
  }
}

export type SortOption = 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc' | 'travel-front' | 'battery'

export interface FilterState {
  brands: string[]
  motorBrands: string[]
  useTypes: UseType[]
  priceRange: [number, number]
  travelRange: [number, number]
  rearTravelRange: [number, number]
  batteryRange: [number, number]
  weightRange: [number, number]
  motorTorqueRange: [number, number]
  sortBy: SortOption
  search: string
}

export interface Terrain {
  id: string
  name: string
  icon: string
  description: string
  tips: string[]
  difficulty: 'fácil' | 'moderado' | 'difícil' | 'extremo'
  image: string
}

export interface RouteContext {
  id: string
  name: string
  terrain: Terrain
  recommendedBikes: string[]
  motorMode: string
  batteryConsumption: number
  sagAdjustment: string
  tireSetup: string
}

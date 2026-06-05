import type { EBike, UseType } from '../types'

export type MainTerrain = UseType | 'mixto'
export type RidingStyle = 'conservador' | 'equilibrado' | 'agresivo'
export type Priority = 'subir' | 'bajar' | 'equilibrado'
export type RouteType = 'rutas-largas' | 'bike-park' | 'mixto'

export interface RecommendationInput {
  riderWeight: number
  budget: number
  mainTerrain: MainTerrain
  importanceAutonomy: 1 | 2 | 3 | 4 | 5
  importanceWeight: 1 | 2 | 3 | 4 | 5
  ridingStyle: RidingStyle
  priority: Priority
  routeType: RouteType
  simpleMaintenance: boolean
}

export interface RecommendationItem {
  bike: EBike
  score: number
  reason: string
  strengths: string[]
  weaknesses: string[]
  setupTip: string
}

export interface RecommendationOutput {
  recommendations: RecommendationItem[]
  discarded: { bike: EBike; reason: string }[]
  warnings: string[]
}

interface BikeProfile {
  price: number
  weight: number
  torque: number
  battery: number
  frontTravel: number
  rearTravel: number
  useType: UseType[]
  frameMaterial: string
  motorBrand: string
  hasElectronicShifting: boolean
  rangeEco: number
}

function profileBike(b: EBike): BikeProfile {
  const isElectronic = /AXS|Di2|Wireless/i.test(b.specs.drivetrain)
  return {
    price: b.price,
    weight: b.specs.weight,
    torque: b.motor.torque,
    battery: b.battery.capacity,
    frontTravel: b.suspension.front.travel,
    rearTravel: b.suspension.rear.travel,
    useType: b.useType,
    frameMaterial: b.frame.material,
    motorBrand: b.motor.brand,
    hasElectronicShifting: isElectronic,
    rangeEco: b.battery.range.eco,
  }
}

function clampScore(n: number): number {
  return Math.min(Math.max(n, 0), 100)
}

const TERRAIN_AFFINITY: Record<MainTerrain, UseType[]> = {
  enduro: ['enduro'],
  trail: ['trail'],
  bikepark: ['bikepark'],
  'rutas-largas': ['rutas-largas'],
  mixto: ['enduro', 'trail', 'rutas-largas'],
}

function scoreTerrain(bike: BikeProfile, mainTerrain: MainTerrain): number {
  if (mainTerrain === 'mixto') {
    if (bike.useType.length >= 2) return 100
    if (bike.useType.length === 1 && bike.useType[0] !== 'bikepark') return 75
    return 40
  }
  const preferred = TERRAIN_AFFINITY[mainTerrain]
  const matchCount = bike.useType.filter(t => preferred.includes(t)).length
  if (matchCount >= 2) return 100
  if (matchCount === 1) return 80
  if (bike.useType.some(t => t === 'enduro' && mainTerrain === 'bikepark')) return 60
  if (bike.useType.some(t => t === 'trail' && mainTerrain === 'enduro')) return 40
  return 10
}

const BUDGET_TIERS = [
  { max: 6000, label: 'económica' },
  { max: 8000, label: 'accesible' },
  { max: 10000, label: 'media' },
  { max: 12000, label: 'premium' },
  { max: Infinity, label: 'ultra-premium' },
]

function getBudgetLabel(budget: number): string {
  for (const t of BUDGET_TIERS) {
    if (budget <= t.max) return t.label
  }
  return 'ultra-premium'
}

function scorePrice(price: number, budget: number): number {
  if (price <= budget) return 100
  const overPct = (price - budget) / budget
  if (overPct <= 0.1) return 80
  if (overPct <= 0.2) return 50
  if (overPct <= 0.35) return 20
  return 0
}

function scoreAutonomy(battery: number): number {
  const MIN_BATTERY = 430
  const MAX_BATTERY = 900
  return clampScore(((battery - MIN_BATTERY) / (MAX_BATTERY - MIN_BATTERY)) * 100)
}

function scoreWeight(weight: number): number {
  const MIN_WEIGHT = 20.5
  const MAX_WEIGHT = 26.0
  return clampScore(((MAX_WEIGHT - weight) / (MAX_WEIGHT - MIN_WEIGHT)) * 100)
}

function scoreRidingStyle(bike: BikeProfile, style: RidingStyle): number {
  if (style === 'agresivo') {
    let s = 50
    if (bike.torque >= 85) s += 25
    if (bike.frontTravel >= 170) s += 15
    if (bike.rearTravel >= 160) s += 10
    return clampScore(s)
  }
  if (style === 'conservador') {
    let s = 50
    if (bike.weight <= 23) s += 20
    if (bike.torque <= 60) s += 15
    if (bike.battery >= 720) s += 15
    return clampScore(s)
  }
  return 70
}

function scorePriority(bike: BikeProfile, priority: Priority): number {
  if (priority === 'subir') {
    let s = 50
    if (bike.weight <= 22) s += 30
    if (bike.rangeEco >= 170) s += 20
    return clampScore(s)
  }
  if (priority === 'bajar') {
    let s = 50
    if (bike.torque >= 85) s += 20
    if (bike.frontTravel >= 170) s += 15
    if (bike.rearTravel >= 160) s += 15
    return clampScore(s)
  }
  return 70
}

function scoreRouteType(bike: BikeProfile, routeType: RouteType): number {
  if (routeType === 'rutas-largas') {
    let s = 40
    if (bike.battery >= 750) s += 30
    if (bike.rangeEco >= 170) s += 30
    return clampScore(s)
  }
  if (routeType === 'bike-park') {
    let s = 40
    if (bike.frontTravel >= 170 && bike.rearTravel >= 160) s += 30
    if (bike.torque >= 85) s += 30
    return clampScore(s)
  }
  return 70
}

function scoreMaintenance(bike: BikeProfile, simple: boolean): number {
  if (!simple) return 75
  if (!bike.hasElectronicShifting) return 100
  return 40
}

function pickStrength(scores: Record<string, number>): string[] {
  const strengths: string[] = []
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  for (const [key] of sorted.slice(0, 3)) {
    switch (key) {
      case 'price':
        strengths.push('Excelente relación calidad-precio')
        break
      case 'terrain':
        strengths.push('Perfecta para tu tipo de terreno')
        break
      case 'autonomy':
        strengths.push('Gran autonomía para rutas largas')
        break
      case 'weight':
        strengths.push('Muy ligera para su categoría')
        break
      case 'ridingStyle':
        strengths.push('Setup ideal para tu estilo de conducción')
        break
      case 'priority':
        strengths.push('Rendimiento óptimo en tu prioridad (subida/bajada)')
        break
      case 'route':
        strengths.push('Configurada para tu tipo de ruta')
        break
      case 'maintenance':
        strengths.push('Mantenimiento sencillo y económico')
        break
    }
  }
  return strengths
}

function pickWeakness(scores: Record<string, number>): string[] {
  const weaknesses: string[] = []
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1])
  for (const [key, val] of sorted.slice(0, 2)) {
    if (val >= 60) continue
    switch (key) {
      case 'price':
        weaknesses.push('Precio elevado respecto a tu presupuesto')
        break
      case 'autonomy':
        weaknesses.push('Autonomía limitada para largas distancias')
        break
      case 'weight':
        weaknesses.push('Peso elevado, notarás la diferencia en subidas')
        break
      case 'maintenance':
        weaknesses.push('Componentes electrónicos que requieren mantenimiento especializado')
        break
    }
  }
  return weaknesses
}

function pickSetupTip(bike: EBike, input: RecommendationInput): string {
  const p = profileBike(bike)
  if (input.priority === 'subir' && p.weight > 24) {
    return 'Reduce la presión de la horquilla 2-3 psi respecto a la recomendación base para mejorar tracción en subidas técnicas'
  }
  if (input.priority === 'bajar' && p.torque >= 85) {
    return 'Aumenta la compresión alta 2 clics para evitar bottom-out en aterrizajes. Revisa la presión de la horquilla'
  }
  if (input.routeType === 'rutas-largas') {
    return `Usa el modo Eco el 70% del tiempo para optimizar la autonomía de ${p.rangeEco} km. Reserva Trail/Turbo para zonas técnicas`
  }
  if (input.mainTerrain === 'mixto') {
    return `Configura un sag equilibrado (22-25%) y presiones medias (20-22 psi) para adaptarte a terrenos variables`
  }
  if (input.ridingStyle === 'agresivo') {
    return 'Ajusta el rebote 2 clics más lento para mantener la rueda pegada al suelo en secuencias rápidas de impactos'
  }
  if (input.ridingStyle === 'conservador') {
    return 'Mantén las presiones de serie (1-2 psi por encima de lo recomendado) para proteger la llanta y maximizar la vida útil del neumático'
  }
  return `Presión recomendada: ${bike.setupBase.frontPsi} psi delante / ${bike.setupBase.rearPsi} psi detrás. Sag: ${bike.setupBase.sagFrontPercent}%/${bike.setupBase.sagRearPercent}%`
}

function generateWarnings(input: RecommendationInput, recommendations: RecommendationItem[]): string[] {
  const warnings: string[] = []
  const p = input.riderWeight
  if (p > 100) {
    warnings.push('Tu peso supera los 100 kg: considera aumentar la presión de los neumáticos 2-3 psi y revisar la precarga de la suspensión')
  }
  if (p < 55) {
    warnings.push('Tu peso está por debajo de 55 kg: las configuraciones de suspensión de serie pueden resultarte demasiado rígidas, busca ajustes de precarga mínima')
  }
  if (input.budget < 7000) {
    warnings.push('Con presupuesto inferior a 7.000 € la oferta es limitada. Considera buscar ofertas de temporadas anteriores o modelos de gama de entrada')
  }
  if (input.importanceAutonomy >= 4 && input.importanceWeight >= 4) {
    warnings.push('Es difícil maximizar autonomía y minimizar peso simultáneamente. Las baterías grandes pesan más. Revisa tus prioridades')
  }
  if (input.mainTerrain === 'bikepark' && input.simpleMaintenance) {
    warnings.push('El bike park exige componentes robustos que suelen requerir más mantenimiento. Considera aceptar mayor complejidad a cambio de durabilidad')
  }
  if (input.ridingStyle === 'agresivo' && input.priority === 'subir') {
    warnings.push('Un estilo agresivo priorizando subidas es contradictorio: la configuración para bajada agresiva penaliza la eficiencia en ascenso')
  }
  const best = recommendations[0]
  if (best) {
    const bp = profileBike(best.bike)
    if (input.riderWeight > 90 && bp.frontTravel < 170) {
      warnings.push(`La ${best.bike.brand} ${best.bike.model} tiene ${bp.frontTravel} mm de recorrido delantero. Con tu peso, considera aumentar la presión del amortiguador`)
    }
  }
  return warnings
}

const WEIGHT_MAP: Record<number, number> = { 1: 0.2, 2: 0.4, 3: 0.6, 4: 0.8, 5: 1.0 }

export function getRecommendation(input: RecommendationInput, bikes: EBike[]): RecommendationOutput {
  const priceLabel = getBudgetLabel(input.budget)

  const scored = bikes.map(b => {
    const p = profileBike(b)
    const scores: Record<string, number> = {
      price: scorePrice(p.price, input.budget),
      terrain: scoreTerrain(p, input.mainTerrain),
      autonomy: scoreAutonomy(p.battery) * WEIGHT_MAP[input.importanceAutonomy],
      weight: scoreWeight(p.weight) * WEIGHT_MAP[input.importanceWeight],
      ridingStyle: scoreRidingStyle(p, input.ridingStyle),
      priority: scorePriority(p, input.priority),
      route: scoreRouteType(p, input.routeType),
      maintenance: scoreMaintenance(p, input.simpleMaintenance),
    }
    const total = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    return { bike: b, total, scores }
  })

  const sorted = [...scored].sort((a, b) => b.total - a.total)

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  const recommendations: RecommendationItem[] = top3.map(r => ({
    bike: r.bike,
    score: Math.round(r.total * 10) / 10,
    reason: pickRecommendationReason(r.bike, input, r.scores),
    strengths: pickStrength(r.scores),
    weaknesses: pickWeakness(r.scores),
    setupTip: pickSetupTip(r.bike, input),
  }))

  const discarded: { bike: EBike; reason: string }[] = []
  for (const r of rest) {
    const reasons: string[] = []
    if (r.scores.price < 40) reasons.push(`Supera el presupuesto de ${input.budget.toLocaleString('es-ES')} € (${priceLabel})`)
    if (r.scores.terrain < 40) reasons.push('No está orientada a tu tipo de terreno principal')
    if (r.scores.autonomy < 30 && input.importanceAutonomy >= 3) reasons.push('Autonomía insuficiente para tus necesidades')
    if (r.scores.weight < 30 && input.importanceWeight >= 3) reasons.push('Peso elevado para tus preferencias')
    if (r.scores.maintenance < 50 && input.simpleMaintenance) reasons.push('Componentes electrónicos que complican el mantenimiento')
    if (r.scores.route < 40) reasons.push('Configuración no ideal para tu tipo de ruta')
    if (reasons.length === 0) reasons.push('Puntuación global inferior en la comparativa')
    discarded.push({ bike: r.bike, reason: reasons.join('. ') })
  }

  const warnings = generateWarnings(input, recommendations)

  return { recommendations, discarded, warnings }
}

function pickRecommendationReason(bike: EBike, input: RecommendationInput, scores: Record<string, number>): string {
  const p = profileBike(bike)
  const parts: string[] = []
  const topScores = Object.entries(scores).sort((a, b) => b[1] - a[1])

  const [topKey] = topScores[0]
  switch (topKey) {
    case 'price':
      parts.push(`Mejor relación calidad-precio dentro de los ${input.budget.toLocaleString('es-ES')} €`)
      break
    case 'terrain':
      parts.push(`Perfecta para ${input.mainTerrain === 'mixto' ? 'terrenos variados' : 'tu terreno principal'}`)
      break
    case 'autonomy':
      parts.push(`La mejor autonomía con ${p.battery} Wh de batería`)
      break
    case 'weight':
      parts.push(`La más ligera con solo ${p.weight} kg`)
      break
    case 'ridingStyle':
      parts.push(`Configuración ideal para conducción ${input.ridingStyle}`)
      break
    case 'priority':
      parts.push(`Rendimiento óptimo para ${input.priority === 'subir' ? 'subidas' : 'bajadas'}`)
      break
    case 'route':
      parts.push(`Perfecta para ${input.routeType === 'rutas-largas' ? 'rutas largas' : 'bike park'}`)
      break
    case 'maintenance':
      parts.push('Mantenimiento sencillo con componentes mecánicos')
      break
  }

  if (p.useType.length >= 2) {
    const labels: Record<string, string> = { enduro: 'enduro', trail: 'trail', bikepark: 'bike park', 'rutas-largas': 'rutas largas' }
    const types = p.useType.map(t => labels[t] || t).join(', ')
    parts.push(`Versátil: funciona bien en ${types}`)
  }

  if (p.torque >= 85 && input.priority === 'bajar') {
    parts.push(`Motor de ${p.torque} Nm para afrontar cualquier pendiente`)
  }

  if (p.weight <= 22) {
    parts.push(`Solo ${p.weight} kg, ideal si el peso es prioritario`)
  }

  return parts.join(' · ')
}

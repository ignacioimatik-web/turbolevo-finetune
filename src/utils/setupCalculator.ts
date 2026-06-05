export type TerrainType = 'roca-tecnica' | 'barro' | 'seco-polvo' | 'bike-park' | 'rutas-largas' | 'mixto'
export type RidingStyle = 'conservador' | 'equilibrado' | 'agresivo'

export interface SetupInput {
  riderWeight: number
  backpackWeight: number
  terrain: TerrainType
  ridingStyle: RidingStyle
  frontTireWidth: number
  rearTireWidth: number
  hasMousse: boolean
  batteryCapacity: number
  elevationGain: number
  distance: number
}

export interface SetupOutput {
  frontPsi: number
  rearPsi: number
  sagFrontPercent: number
  sagRearPercent: number
  motorMode: string
  estimatedAutonomy: number
  autonomySufficient: boolean
  notes: string[]
}

const TERRAIN_LABELS: Record<TerrainType, string> = {
  'roca-tecnica': 'Roca técnica',
  barro: 'Barro',
  'seco-polvo': 'Seco / Polvo',
  'bike-park': 'Bike Park',
  'rutas-largas': 'Rutas largas',
  mixto: 'Mixto',
}

export function getTerrainLabel(t: TerrainType): string {
  return TERRAIN_LABELS[t]
}

const STYLE_LABELS: Record<RidingStyle, string> = {
  conservador: 'Conservador',
  equilibrado: 'Equilibrado',
  agresivo: 'Agresivo',
}

export function getRidingStyleLabel(s: RidingStyle): string {
  return STYLE_LABELS[s]
}

const TERRAIN_TIPS: Record<TerrainType, string[]> = {
  'roca-tecnica': [
    'Presiones más bajas mejoran tracción en roca suelta',
    'Vigilar fondo de llanta en impactos fuertes',
    'Considerar inserts para proteger la llanta',
  ],
  barro: [
    'Algo más de presión ayuda a que el neumático no se embote',
    'Evitar presiones muy bajas que retengan barro en taqueado',
    'Compuesto específico para barro si está disponible',
  ],
  'seco-polvo': [
    'Presiones medias-altas para evitar pellizcos en terreno seco y duro',
    'El compound blando mejora tracción en polvo suelto',
    'Vigilar desgaste prematuro del taqueado',
  ],
  'bike-park': [
    'Aumentar presión para soportar impactos repetitivos',
    'Más sag trasero para absorber aterrizajes',
    'Considerar uso de insert antipinchazos',
  ],
  'rutas-largas': [
    'Presiones medias para equilibrar confort y eficiencia',
    'Algo menos de sag para mejorar eficiencia en pedaleo',
    'Modo Eco para maximizar autonomía en tramos llanos',
  ],
  mixto: [
    'Ajuste equilibrado para terreno variable',
    'Presión media + sag equilibrado cubre la mayoría de situaciones',
    'Ajustar sobre la marcha según el tramo predominante',
  ],
}

const STYLE_TIPS: Record<RidingStyle, string[]> = {
  conservador: [
    'Menos sag da más estabilidad en frenada pero menos tracción',
    'Presiones más altas protegen la llanta',
  ],
  equilibrado: [
    'Compromiso razonable entre tracción, confort y protección',
  ],
  agresivo: [
    'Más sag mejora tracción en curvas y absorción de impactos',
    'Presiones más bajas maximizan agarre',
    'Vigilar fondo de llanta en aterrizajes',
  ],
}

const CONSUMPTION_BASE: Record<TerrainType, number> = {
  'roca-tecnica': 13,
  barro: 14,
  'seco-polvo': 11,
  'bike-park': 15,
  'rutas-largas': 10,
  mixto: 12,
}

function calcTirePressure(
  totalWeight: number,
  tireWidth: number,
  terrain: TerrainType,
  style: RidingStyle,
  hasMousse: boolean,
  isRear: boolean,
): number {
  const weightFactor = isRear ? 0.14 : 0.12
  let base = totalWeight * weightFactor + (isRear ? 4 : 3)

  const widthDelta = (tireWidth - 2.5) * -2
  base += widthDelta

  const terrainAdjustments: Record<TerrainType, number> = {
    'roca-tecnica': -1,
    barro: 0.5,
    'seco-polvo': 1,
    'bike-park': 1.5,
    'rutas-largas': 0,
    mixto: 0,
  }
  base += terrainAdjustments[terrain] ?? 0

  const styleAdjustments: Record<RidingStyle, number> = {
    conservador: 1,
    equilibrado: 0,
    agresivo: -1,
  }
  base += styleAdjustments[style] ?? 0

  if (hasMousse) {
    base += isRear ? 2.5 : 2
  }

  return Math.round(base * 2) / 2
}

function calcSag(style: RidingStyle, terrain: TerrainType, isRear: boolean): number {
  const baseMap: Record<RidingStyle, { front: number; rear: number }> = {
    conservador: { front: 18, rear: 22 },
    equilibrado: { front: 22, rear: 26 },
    agresivo: { front: 26, rear: 30 },
  }
  const base = baseMap[style]
  let sag = isRear ? base.rear : base.front

  const terrainBoost: Partial<Record<TerrainType, number>> = {
    'roca-tecnica': 2,
    'bike-park': 3,
    barro: 1,
  }
  sag += terrainBoost[terrain] ?? 0

  return isRear ? Math.min(sag, 33) : Math.min(sag, 30)
}

function calcMotorMode(
  batteryCapacity: number,
  distance: number,
  elevationGain: number,
  terrain: TerrainType,
  style: RidingStyle,
): { mode: string; autonomy: number; sufficient: boolean } {
  if (distance <= 0) {
    return { mode: 'Eco / Breeze', autonomy: 0, sufficient: false }
  }

  const consumptionPerKm = CONSUMPTION_BASE[terrain] ?? 12
  const elevationFactor = 1 + (elevationGain / distance / 100) * 0.15
  const effectiveConsumption = consumptionPerKm * elevationFactor

  const styleConsumptionFactor: Record<RidingStyle, number> = {
    conservador: 0.9,
    equilibrado: 1,
    agresivo: 1.15,
  }
  const finalConsumption = effectiveConsumption * (styleConsumptionFactor[style] ?? 1)

  const estimatedAutonomy = Math.round(batteryCapacity / finalConsumption)
  const autonomyMargin = estimatedAutonomy - distance
  const sufficient = autonomyMargin >= 0

  let mode: string
  const ratio = distance / estimatedAutonomy

  if (ratio > 1.2) {
    mode = 'Eco / Breeze'
  } else if (ratio > 0.85) {
    mode = 'Trail / River'
  } else if (ratio > 0.6) {
    mode = 'Trail'
  } else if (ratio > 0.35) {
    mode = 'Turbo / Boost'
  } else {
    mode = 'Turbo / Boost'
  }

  if (terrain === 'bike-park' || terrain === 'roca-tecnica') {
    if (ratio < 0.7) mode = 'Trail'
  }

  return { mode, autonomy: estimatedAutonomy, sufficient }
}

export function calculateSetup(input: SetupInput): SetupOutput {
  const totalWeight = input.riderWeight + input.backpackWeight
  const frontPsi = calcTirePressure(totalWeight, input.frontTireWidth, input.terrain, input.ridingStyle, input.hasMousse, false)
  const rearPsi = calcTirePressure(totalWeight, input.rearTireWidth, input.terrain, input.ridingStyle, input.hasMousse, true)
  const sagFrontPercent = calcSag(input.ridingStyle, input.terrain, false)
  const sagRearPercent = calcSag(input.ridingStyle, input.terrain, true)
  const { mode, autonomy, sufficient } = calcMotorMode(input.batteryCapacity, input.distance, input.elevationGain, input.terrain, input.ridingStyle)

  const notes: string[] = []

  if (input.terrain === 'roca-tecnica') {
    notes.push('Terreno rocoso: considera reducir presión 1 psi adicional para mejorar tracción en piedra suelta')
  }
  if (input.terrain === 'barro') {
    notes.push('Barro: presiones ligeramente más altas evitan que el neumático se embote; revisa taqueado')
  }
  if (input.hasMousse) {
    notes.push('Mousse detectado: las presiones estimadas ya incluyen el incremento por mousse; verificar compatibilidad con la carcasa')
  }
  if (totalWeight > 100) {
    notes.push(`Peso total alto (${Math.round(totalWeight)} kg): vigilar fondo de llanta; considerar inserts y aumentar presión de referencia`)
  }
  if (input.elevationGain > 800 && input.distance > 40) {
    notes.push(`Desnivel alto (${input.elevationGain} m): priorizar modo Eco en subidas largas para reservar batería`)
  }
  if (!sufficient && autonomy > 0) {
    notes.push(`Autonomía estimada (${autonomy} km) insuficiente para la distancia prevista (${input.distance} km). Usar modo Eco y llevar cargador`)
  }
  if (input.distance > 0 && input.elevationGain / input.distance > 20) {
    notes.push('Desnivel muy pronunciado: ajustar suspensión para mejor eficiencia en subida; considerar bloqueo de horquilla')
  }
  if (input.frontTireWidth > 2.6 || input.rearTireWidth > 2.6) {
    notes.push('Neumáticos anchos (>2.6"): las presiones estimadas pueden ajustarse a la baja 0.5–1 psi adicional')
  }

  const terrainTips = TERRAIN_TIPS[input.terrain]
  const styleTips = STYLE_TIPS[input.ridingStyle]
  const allTips = [...terrainTips, ...styleTips]
  notes.push(...allTips.slice(0, 3))

  notes.push('⚠️ Comprobar presiones reales con manómetro. Adaptar según carcasa, compuesto, llanta y preferencia personal')

  return {
    frontPsi,
    rearPsi,
    sagFrontPercent,
    sagRearPercent,
    motorMode: mode,
    estimatedAutonomy: autonomy,
    autonomySufficient: sufficient,
    notes,
  }
}

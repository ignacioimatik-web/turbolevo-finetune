import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'

interface TerrainProfile {
  id: string
  name: string
  icon: string
  difficulty: string
  color: string
  description: string
  recommendedBikes: { id: string; label: string }[]
  recommendedBattery: string
  recommendedTravel: string
  recommendedTires: string
  recommendedPressure: string
  recommendedMotorMode: string
  risks: string[]
  setupTips: string[]
  catalogFilter: string
  badge: string
}

const terrains: TerrainProfile[] = [
  {
    id: 'roca-tecnica',
    name: 'Roca Técnica',
    icon: '⛰',
    difficulty: 'Difícil',
    color: '#f97316',
    description: 'Bloques de roca, escalones, raíces expuestas y cantos rodados. Terreno que exige máxima tracción, suspensión sensible y elección de línea constante.',
    recommendedBikes: [
      { id: 'trek-rail', label: 'Trek Rail' },
      { id: 'santacruz-heckler', label: 'Santa Cruz Heckler' },
      { id: 'cannondale-moterra', label: 'Cannondale Moterra' },
    ],
    recommendedBattery: '≥ 720 Wh',
    recommendedTravel: '170–180 mm',
    recommendedTires: 'Carcasa DD/DH · Compuesto blando (MaxxGrip)',
    recommendedPressure: '18–20 psi (tubeless)',
    recommendedMotorMode: 'Trail · eMTT · Respuesta inmediata',
    risks: [
      'Fondo de llanta por impacto en cantos vivos',
      'Pellizcos si la presión es demasiado baja',
      'Calentamiento de frenos en descensos largos',
      'Fatiga de muñecas por vibración constante',
    ],
    setupTips: [
      'Rebote 2 clics más rápido en horquilla para que la rueda siga el terreno',
      'Compresión lenta abierta 3–4 clics para tracción en escalones',
      'Presión 1–2 psi por debajo de tu referencia habitual',
      'Valora insertos antipinchazos (CushCore / Tannus)',
    ],
    catalogFilter: 'enduro',
    badge: 'Agresivo',
  },
  {
    id: 'sendero-rapido',
    name: 'Sendero Rápido',
    icon: '🌲',
    difficulty: 'Moderado',
    color: '#22c55e',
    description: 'Single track fluido con curvas peraltadas, rectas rápidas y rodadoras. Ritmo constante donde la eficiencia de pedaleo y la agilidad marcan la diferencia.',
    recommendedBikes: [
      { id: 'focus-jam2', label: 'Focus Jam²' },
      { id: 'specialized-turbo-levo', label: 'Specialized Turbo Levo' },
      { id: 'yt-decoy', label: 'YT Decoy' },
    ],
    recommendedBattery: '≥ 630 Wh',
    recommendedTravel: '150–160 mm',
    recommendedTires: 'Carcasa Exo+ · Compuesto medio (MaxxTerra)',
    recommendedPressure: '20–22 psi (tubeless)',
    recommendedMotorMode: 'Trail · Asistencia equilibrada',
    risks: [
      'Derrape en curvas con tierra suelta',
      'Pérdida de tracción trasera al acelerar en salida de curva',
      'Subviraje por exceso de velocidad en curvas cerradas',
    ],
    setupTips: [
      'Sag al 25% para equilibrio entre tracción y eficiencia',
      'Compresión media 2–3 clics desde cerrado',
      'Bloqueo remoto de horquilla útil en transiciones',
      'Rebote equilibrado — ni muy rápido ni muy lento',
    ],
    catalogFilter: 'trail',
    badge: 'Fluido',
  },
  {
    id: 'bike-park',
    name: 'Bike Park',
    icon: '⚡',
    difficulty: 'Extremo',
    color: '#ef4444',
    description: 'Pistas de descenso con saltos, tablones, raíces y peraltes. Ciclo continuo de subida en telesilla y bajada a máxima intensidad.',
    recommendedBikes: [
      { id: 'trek-rail', label: 'Trek Rail' },
      { id: 'mondraker-crafty', label: 'Mondraker Crafty' },
      { id: 'santacruz-heckler', label: 'Santa Cruz Heckler' },
    ],
    recommendedBattery: '≥ 750 Wh',
    recommendedTravel: '170–180 mm',
    recommendedTires: 'Carcasa DH · Compuesto blando · Insertos obligatorios',
    recommendedPressure: '23–25 psi (tubeless con inserto)',
    recommendedMotorMode: 'Turbo / Boost · Potencia máxima',
    risks: [
      'Bottom-out en aterrizajes si la compresión alta no está ajustada',
      'Reventón de neumático en cantos de tabla',
      'Sobrecalentamiento de frenos en pistas largas',
      'Fatiga de brazos y manos por impactos repetitivos',
    ],
    setupTips: [
      'Aumentar compresión alta 2 clics para evitar bottom-out',
      'Rebote 2 clics más lento para mantener rueda pegada al suelo',
      'Presión de horquilla +5 psi respecto a tu setup habitual',
      'Revisar precarga del muelle de aire antes de cada sesión',
    ],
    catalogFilter: 'enduro',
    badge: 'Intenso',
  },
  {
    id: 'subidas-largas',
    name: 'Subidas Largas',
    icon: '🏔',
    difficulty: 'Moderado',
    color: '#3b82f6',
    description: 'Ascensos prolongados por pista forestal o sendero. Gestión de batería, ritmo constante y confort en posición de pedaleo.',
    recommendedBikes: [
      { id: 'canyon-strive-on', label: 'Canyon Strive:ON' },
      { id: 'giant-reign-e-plus', label: 'Giant Reign E+' },
      { id: 'specialized-turbo-levo', label: 'Specialized Turbo Levo' },
    ],
    recommendedBattery: '≥ 800 Wh',
    recommendedTravel: '150–160 mm',
    recommendedTires: 'Carcasa Exo · Compuesto medio (MaxxTerra)',
    recommendedPressure: '21–23 psi (tubeless)',
    recommendedMotorMode: 'Eco · Máxima eficiencia',
    risks: [
      'Agotamiento de batería antes de completar la subida',
      'Sobrecalentamiento del motor en pendientes muy prolongadas',
      'Calambres por posición estática prolongada',
    ],
    setupTips: [
      'Aumentar presión de amortiguador 1–2 clics para evitar hundimiento',
      'Abrir compresión baja 2 clics para mejor tracción en zonas rotas',
      'Activar bloqueo de horquilla en tramos lisos',
      'Distribuir peso hacia adelante en rampas muy pronunciadas',
    ],
    catalogFilter: 'rutas-largas',
    badge: 'Resistencia',
  },
  {
    id: 'barro',
    name: 'Barro',
    icon: '💦',
    difficulty: 'Difícil',
    color: '#a855f7',
    description: 'Terreno embarrado, arcilloso y resbaladizo. Tracción mínima, derrape constante y necesidad de mantener la velocidad para no quedarse clavado.',
    recommendedBikes: [
      { id: 'commencal-meta-power', label: 'Commencal Meta Power' },
      { id: 'orbea-wild', label: 'Orbea Wild' },
      { id: 'trek-rail', label: 'Trek Rail' },
    ],
    recommendedBattery: '≥ 720 Wh',
    recommendedTravel: '160–170 mm',
    recommendedTires: 'Taco alto y separado · Compuesto blando (MaxxGrip)',
    recommendedPressure: '17–19 psi (tubeless)',
    recommendedMotorMode: 'Trail · Entrega suave de potencia',
    risks: [
      'Neumáticos que se embotan de barro y pierden tracción',
      'Frenos embarrados que pierden potencia',
      'Componentes electrónicos expuestos al agua y barro',
      'Desgaste prematuro de transmisión por abrasión',
    ],
    setupTips: [
      'Presión 2–3 psi más baja para maximizar contacto',
      'Compresión abierta para que la rueda siga el perfil del terreno',
      'Rebote lento para evitar pérdida de tracción',
      'Aplicar lubricante húmedo en cadena después de cada salida',
    ],
    catalogFilter: 'enduro',
    badge: 'Técnico',
  },
  {
    id: 'seco-polvo',
    name: 'Seco / Polvo',
    icon: '☀',
    difficulty: 'Fácil',
    color: '#eab308',
    description: 'Terreno seco, suelto y polvoriento con capa superficial deslizante. Derrape controlado, curvas amplias y trazadas limpias.',
    recommendedBikes: [
      { id: 'focus-jam2', label: 'Focus Jam²' },
      { id: 'canyon-strive-on', label: 'Canyon Strive:ON' },
      { id: 'cube-stereo-hybrid', label: 'Cube Stereo Hybrid' },
    ],
    recommendedBattery: '≥ 630 Wh',
    recommendedTravel: '150–160 mm',
    recommendedTires: 'Compuesto medio (MaxxTerra) · Taco estándar',
    recommendedPressure: '20–22 psi (tubeless)',
    recommendedMotorMode: 'Eco / Trail · Según ritmo',
    risks: [
      'Derrape excesivo en curvas con polvo suelto superficial',
      'Pellizcos en terreno seco y duro si la presión es baja',
      'Visibilidad reducida por polvo en suspensión en grupo',
    ],
    setupTips: [
      'Compresión baja cerrada 2 clics para evitar hundimiento en apoyo',
      'Rebote medio-rápido para mantener tracción en superficie suelta',
      'Presión dentro del rango estándar (20–22 psi)',
      'Neumáticos con compuesto medio que no se sobrecalienten',
    ],
    catalogFilter: 'trail',
    badge: 'Rápido',
  },
  {
    id: 'ruta-larga-montana',
    name: 'Ruta Larga de Montaña',
    icon: '🗻',
    difficulty: 'Moderado',
    color: '#06b6d4',
    description: 'Travesías completas de varias horas combinando subidas, crestas y descensos. El factor determinante es la autonomía y la versatilidad del equipo.',
    recommendedBikes: [
      { id: 'specialized-turbo-levo', label: 'Specialized Turbo Levo' },
      { id: 'giant-reign-e-plus', label: 'Giant Reign E+' },
      { id: 'cube-stereo-hybrid', label: 'Cube Stereo Hybrid' },
    ],
    recommendedBattery: '≥ 800 Wh · Batería extra recomendada',
    recommendedTravel: '150–160 mm',
    recommendedTires: 'Carcasa Exo+ · Compuesto medio · Sin insertos',
    recommendedPressure: '20–22 psi (tubeless)',
    recommendedMotorMode: 'Eco · Gestión constante de batería',
    risks: [
      'Batería insuficiente para completar la ruta',
      'Punto de no retorno en zonas sin cobertura',
      'Deshidratación si no se lleva suficiente agua',
      'Avería mecánica sin herramientas adecuadas',
    ],
    setupTips: [
      'Planificar perfiles de asistencia: Eco en subida, apagado en llano',
      'Llevar batería de repuesto o cargador portátil',
      'Sag equilibrado (25%) para confort en largas horas',
      'Revisar presión de neumáticos con manómetro antes de salir',
    ],
    catalogFilter: 'rutas-largas',
    badge: 'Aventura',
  },
  {
    id: 'enduro-agresivo',
    name: 'Enduro Agresivo',
    icon: '▽',
    difficulty: 'Extremo',
    color: '#dc2626',
    description: 'Enduro en estado puro: subidas cronometradas y descensos técnicos a alta velocidad. Máxima exigencia física y técnica en terrenos que mezclan roca, raíces y saltos.',
    recommendedBikes: [
      { id: 'orbea-wild', label: 'Orbea Wild' },
      { id: 'commencal-meta-power', label: 'Commencal Meta Power' },
      { id: 'trek-rail', label: 'Trek Rail' },
    ],
    recommendedBattery: '≥ 750 Wh',
    recommendedTravel: '170–180 mm',
    recommendedTires: 'Carcasa DD/DH · Compuesto blando · Insertos',
    recommendedPressure: '19–21 psi (tubeless con inserto)',
    recommendedMotorMode: 'Mix Eco+Trail según perfil de etapa',
    risks: [
      'Fatiga extrema en etapas largas de enduro',
      'Bottom-out en aterrizajes tras grandes saltos',
      'Pérdida de tracción en zonas de roca suelta a alta velocidad',
      'Desgaste acelerado de pastillas de freno',
    ],
    setupTips: [
      'Configurar dos modos de suspensión: ascendente (firme) y descendente (abierto)',
      'Rebote 2 clics más lento en amortiguador para secciones rápidas',
      'Aumentar compresión alta si hay muchos aterrizajes',
      'Usar modo eMTB / Trail en subidas técnicas, Turbo en rampas',
    ],
    catalogFilter: 'enduro',
    badge: 'Extremo',
  },
]

function TerrainCard({ t }: { t: TerrainProfile }) {
  const { toggleCompare, isInCompare } = useAppState()

  return (
    <div className="panel overflow-hidden group hover:border-border-hover transition-all duration-300">
      {/* Header with color accent */}
      <div className="h-2 w-full" style={{ backgroundColor: t.color }} />
      <div className="p-5 sm:p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: `${t.color}18`, borderColor: `${t.color}30`, borderWidth: 1 }}
            >
              {t.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary">{t.name}</h3>
                <span
                  className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono border"
                  style={{
                    backgroundColor: `${t.color}15`,
                    borderColor: `${t.color}25`,
                    color: t.color,
                  }}
                >
                  {t.badge}
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted">{t.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[11px] text-text-secondary leading-relaxed mb-5">{t.description}</p>

        {/* Technical specs grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { icon: '🔋', label: 'Batería', value: t.recommendedBattery },
            { icon: '↕', label: 'Recorrido', value: t.recommendedTravel },
            { icon: '◯', label: 'Neumáticos', value: t.recommendedTires },
            { icon: '▼', label: 'Presión', value: t.recommendedPressure },
            { icon: '⚡', label: 'Modo motor', value: t.recommendedMotorMode },
          ].map(spec => (
            <div
              key={spec.label}
              className="col-span-2 sm:col-span-1 bg-bg-secondary/40 border border-border/60 rounded-xl px-3 py-2.5 transition-colors group-hover:border-border"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] opacity-50">{spec.icon}</span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-text-muted">{spec.label}</span>
              </div>
              <p className="text-[11px] font-bold text-text-primary leading-snug">{spec.value}</p>
            </div>
          ))}
        </div>

        {/* Risks */}
        <div className="mb-4">
          <p className="text-[8px] font-mono uppercase tracking-widest text-energy mb-2 flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Riesgos habituales
          </p>
          <ul className="space-y-1">
            {t.risks.map(r => (
              <li key={r} className="flex items-start gap-2 text-[10px] text-text-secondary">
                <span className="text-energy/50 mt-0.5 shrink-0">◇</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Setup tips */}
        <div className="mb-5">
          <p className="text-[8px] font-mono uppercase tracking-widest text-accent mb-2 flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Consejos de setup
          </p>
          <ul className="space-y-1">
            {t.setupTips.map(tip => (
              <li key={tip} className="flex items-start gap-2 text-[10px] text-text-secondary">
                <span className="text-accent/50 mt-0.5 shrink-0">◆</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended bikes + actions */}
        <div className="border-t border-border pt-4">
          <p className="text-[8px] font-mono uppercase tracking-widest text-text-muted mb-3">Bicicletas recomendadas</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {t.recommendedBikes.map(b => (
              <div key={b.id} className="flex items-center gap-1">
                <Link
                  to={`/bike/${b.id}`}
                  className="px-2 py-1 rounded-lg text-[9px] font-bold font-mono bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 active:scale-95 transition-all duration-200"
                >
                  {b.label}
                </Link>
                <button
                  onClick={() => toggleCompare(b.id)}
                  className={`p-1 rounded-lg text-[8px] font-bold border transition-all duration-200 active:scale-90 ${
                    isInCompare(b.id)
                      ? 'bg-accent-subtle text-accent border-accent/30'
                      : 'text-text-muted border-border/60 hover:text-text-primary hover:border-border'
                  }`}
                  title="Añadir al comparador"
                >
                  ⇄
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/catalog?uso=${t.catalogFilter}`}
              className="flex-1 min-w-[100px] text-center px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-200"
            >
              Ver en catálogo
            </Link>
            <Link
              to={`/setup`}
              className="flex-1 min-w-[100px] text-center px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all duration-200"
            >
              Calcular setup
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const terrainIcons = [
  { icon: '⛰', label: 'Roca', id: 'roca-tecnica' },
  { icon: '🌲', label: 'Sendero', id: 'sendero-rapido' },
  { icon: '⚡', label: 'Bike Park', id: 'bike-park' },
  { icon: '🏔', label: 'Subida', id: 'subidas-largas' },
  { icon: '💦', label: 'Barro', id: 'barro' },
  { icon: '☀', label: 'Polvo', id: 'seco-polvo' },
  { icon: '🗻', label: 'Montaña', id: 'ruta-larga-montana' },
  { icon: '▽', label: 'Enduro', id: 'enduro-agresivo' },
]

export function TerrainEnduro() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Hero ── */}
      <div className="panel overflow-hidden mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-energy/[0.03] pointer-events-none" />
        <div className="p-6 sm:p-8 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-2xl">
              ⛰
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Terreno <span className="text-accent">Enduro</span>
              </h1>
              <p className="text-xs text-text-muted font-mono mt-0.5">
                Guía de configuración por tipo de terreno · 8 perfiles
              </p>
            </div>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl mb-6">
            Cada tipo de terreno exige una configuración específica de neumáticos, suspensión, presión y modo de asistencia. 
            Esta guía te ayuda a elegir la bici y el setup óptimo para cada perfil de ruta enduro.
          </p>

          {/* Terrain type pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            {terrainIcons.map(p => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-secondary/50 border border-border text-[9px] font-mono text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-200"
              >
                <span className="opacity-60">{p.icon}</span>
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── 8 Terrain cards ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        {terrains.map(t => (
          <div key={t.id} id={t.id}>
            <TerrainCard t={t} />
          </div>
        ))}
      </div>

      {/* ── Footer CTA ── */}
      <div className="mt-10 panel p-5 sm:p-6 text-center">
        <p className="text-sm font-bold text-text-primary mb-2">
          ¿No sabes qué terreno vas a encontrarte?
        </p>
        <p className="text-xs text-text-muted mb-4 max-w-md mx-auto">
          Usa la calculadora de setup para una configuración equilibrada o visita el catálogo para encontrar la bici que mejor se adapte a tu estilo.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/setup" className="btn-primary text-xs">
            Calculadora de setup
          </Link>
          <Link to="/catalog" className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-200">
            Catálogo completo
          </Link>
        </div>
      </div>
    </div>
  )
}

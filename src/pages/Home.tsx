import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { BikeCard } from '../components/BikeCard'
import { TerrainCard } from '../components/TerrainCard'
import { terrains } from '../data/bikes'
import { formatNumber } from '../utils/helpers'

function HeroBikeVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-accent/5 animate-pulse-accent" />
        <div className="w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-accent/5 absolute animate-pulse-accent" style={{ animationDelay: '1s' }} />
      </div>
      <svg viewBox="0 0 400 320" className="w-full max-w-md relative z-10 drop-shadow-2xl" fill="none">
        <defs>
          <linearGradient id="heroFrame" x1="0" y1="0" x2="400" y2="320">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#65a30d" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="heroWheel" x1="0" y1="0" x2="80" y2="80">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Rear wheel */}
        <circle cx="100" cy="260" r="58" stroke="#27272a" strokeWidth="2" />
        <circle cx="100" cy="260" r="54" stroke="#84cc16" strokeOpacity="0.15" strokeWidth="1" />
        <circle cx="100" cy="260" r="4" fill="#84cc16" fillOpacity="0.5" />
        {[0, 60, 120, 180, 240, 300].map(a => {
          const rad = a * Math.PI / 180
          return (
            <line key={a} x1={100 + 52 * Math.cos(rad)} y1={260 + 52 * Math.sin(rad)}
              x2={100 + 58 * Math.cos(rad)} y2={260 + 58 * Math.sin(rad)}
              stroke="#27272a" strokeWidth="1" />
          )
        })}

        {/* Front wheel */}
        <circle cx="310" cy="260" r="58" stroke="#27272a" strokeWidth="2" />
        <circle cx="310" cy="260" r="54" stroke="#84cc16" strokeOpacity="0.15" strokeWidth="1" />
        <circle cx="310" cy="260" r="4" fill="#84cc16" fillOpacity="0.5" />
        {[30, 90, 150, 210, 270, 330].map(a => {
          const rad = a * Math.PI / 180
          return (
            <line key={a} x1={310 + 52 * Math.cos(rad)} y1={260 + 52 * Math.sin(rad)}
              x2={310 + 58 * Math.cos(rad)} y2={260 + 58 * Math.sin(rad)}
              stroke="#27272a" strokeWidth="1" />
          )
        })}

        {/* Frame triangle */}
        <path d="M100 260 L160 120 L280 180 L310 260 L100 260"
          stroke="url(#heroFrame)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M160 120 L220 100 L280 180"
          stroke="url(#heroFrame)" strokeWidth="3" strokeLinejoin="round" />

        {/* Seatpost and saddle */}
        <line x1="160" y1="120" x2="155" y2="70" stroke="#84cc16" strokeOpacity="0.7" strokeWidth="2.5" />
        <rect x="137" y="60" width="36" height="10" rx="4" fill="#84cc16" fillOpacity="0.4" />

        {/* Stem, handlebar */}
        <line x1="220" y1="100" x2="250" y2="76" stroke="#84cc16" strokeOpacity="0.7" strokeWidth="2.5" />
        <rect x="230" y="66" width="46" height="10" rx="4" fill="#84cc16" fillOpacity="0.4" />

        {/* Fork */}
        <line x1="280" y1="180" x2="310" y2="260" stroke="#84cc16" strokeOpacity="0.6" strokeWidth="2.5" />

        {/* Motor unit */}
        <ellipse cx="180" cy="200" rx="22" ry="16" stroke="#84cc16" strokeOpacity="0.5" strokeWidth="1.5" fill="#84cc16" fillOpacity="0.08" />
        <text x="180" y="204" textAnchor="middle" fill="#84cc16" fillOpacity="0.7" fontSize="8" fontFamily="monospace" fontWeight="bold">MOTOR</text>

        {/* Battery tube */}
        <rect x="110" y="165" width="50" height="12" rx="4" stroke="#84cc16" strokeOpacity="0.3" strokeWidth="1" fill="#84cc16" fillOpacity="0.05" />

        {/* Shock */}
        <line x1="185" y1="145" x2="220" y2="185" stroke="#84cc16" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Travel annotation */}
        <line x1="275" y1="180" x2="275" y2="215" stroke="#a0a0a8" strokeOpacity="0.3" strokeWidth="1" />
        <text x="278" y="200" fill="#a0a0a8" fillOpacity="0.4" fontSize="7" fontFamily="monospace">170mm</text>

        {/* Tech data overlays */}
        <rect x="30" y="10" rx="4" fill="#84cc16" fillOpacity="0.06" stroke="#84cc16" strokeOpacity="0.12" strokeWidth="0.5" width="110" height="28" />
        <text x="40" y="22" fill="#6b6b73" fontSize="6" fontFamily="monospace">CHASSIS · CARBON FACT 11m</text>
        <text x="40" y="32" fill="#6b6b73" fontSize="6" fontFamily="monospace">GEO · 64.5° HA / 77° SA</text>

        <rect x="260" y="10" rx="4" fill="#84cc16" fillOpacity="0.06" stroke="#84cc16" strokeOpacity="0.12" strokeWidth="0.5" width="110" height="28" />
        <text x="270" y="22" fill="#6b6b73" fontSize="6" fontFamily="monospace">MOTOR · SL 1.2 50 Nm</text>
        <text x="270" y="32" fill="#6b6b73" fontSize="6" fontFamily="monospace">BATTERY · 700 Wh</text>

        {/* Ground line */}
        <line x1="40" y1="318" x2="360" y2="318" stroke="#27272a" strokeWidth="1" />
        <line x1="40" y1="316" x2="102" y2="316" stroke="#84cc16" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="308" y1="316" x2="360" y2="316" stroke="#84cc16" strokeOpacity="0.2" strokeWidth="1" />
      </svg>
    </div>
  )
}

function HexGrid() {
  return (
    <>
      {[{ top: '15%', left: '5%', delay: '0s' },
        { top: '45%', left: '8%', delay: '0.5s' },
        { top: '75%', left: '3%', delay: '1s' },
        { top: '20%', right: '4%', delay: '0.3s' },
        { top: '60%', right: '6%', delay: '0.8s' },
        { top: '85%', right: '10%', delay: '1.2s' },
      ].map((hex, i) => (
        <svg key={i} className="absolute w-8 h-8 text-accent/5"
          style={{ top: hex.top, left: hex.left, right: hex.right, animation: `fade-in 1s ${hex.delay} both` }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2L22 8.5V17.5L12 24L2 17.5V8.5L12 2Z" />
        </svg>
      ))}
    </>
  )
}

export function Home() {
  const { bikes } = useAppState()
  const featured = bikes.filter(b => ['specialized-turbo-levo', 'canyon-strive-on', 'yt-decoy', 'focus-jam2'].includes(b.id))

  const stats = [
    { label: 'Modelos analizados', value: bikes.length, suffix: '' },
    { label: 'Motores comparados', value: new Set(bikes.map(b => b.motor.brand + b.motor.model)).size, suffix: '' },
    { label: 'Rango batería', value: Math.min(...bikes.map(b => b.battery.capacity)), suffix: `- ${Math.max(...bikes.map(b => b.battery.capacity))}Wh` },
    { label: 'Configs. de setup', value: bikes.reduce((a, b) => a + b.recommendedSetup.compression.front + b.recommendedSetup.compression.rear, 0) * 6, suffix: '+' },
  ]

  const setupSteps = [
    { icon: '⚖', title: 'Peso del rider', desc: 'Introduce tu peso y la app calcula la presión óptima de horquilla y amortiguador para cada modelo.' },
    { icon: '◈', title: 'Sag frontal/trasero', desc: 'Recomendaciones de sag entre 22-28% según terreno y estilo. Ajuste fino por modelo.' },
    { icon: '⚡', title: 'Modo motor ideal', desc: 'Desde Eco para rutas largas hasta Turbo para descensos técnicos. Según autonomía y exigencia.' },
    { icon: '⛰', title: 'Terreno específico', desc: 'Cada terreno tiene su configuración: roca, barro, polvo, subidas largas o bajadas agresivas.' },
  ]

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center overflow-hidden carbon-weave">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] via-transparent to-bg-primary/60" />
        <div className="absolute inset-0 grain-texture" />
        <HexGrid />

        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/[0.05] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <span className="chip-accent text-[9px] tracking-[0.15em]">Enduro E-Bike Hub</span>
                <span className="chip-muted text-[9px] font-mono">12 modelos · 6 terrenos</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[0.9] mb-5 animate-slide-up">
                Domina la
                <br />
                <span className="text-gradient-accent">montaña eléctrica</span>
              </h1>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mb-8 animate-fade-in delay-200">
                Compara, configura y elige tu e-bike de enduro ideal entre los modelos más potentes del mercado.
                Datos técnicos reales, setups precisos por terreno y análisis de motor, batería y suspensión.
              </p>

              <div className="flex flex-wrap gap-3 animate-fade-in delay-300">
                <Link to="/catalog" className="btn-primary text-xs sm:text-sm px-5 sm:px-6">
                  Explorar e-bikes
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/compare" className="btn-secondary text-xs sm:text-sm px-5 sm:px-6">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Comparar modelos
                </Link>
              </div>

              <div className="flex items-center gap-5 mt-8 animate-fade-in delay-400">
                <div className="flex -space-x-2">
                  {['Specialized', 'Trek', 'Santa Cruz', 'Canyon'].map((brand, i) => (
                    <div key={brand} className="w-8 h-8 rounded-full bg-bg-card border-2 border-bg-primary flex items-center justify-center text-[8px] font-bold text-text-muted font-mono">
                      {brand[0]}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-bg-card border-2 border-bg-primary flex items-center justify-center text-[8px] font-bold text-accent font-mono">
                    +{bikes.length - 4}
                  </div>
                </div>
                <span className="text-[10px] text-text-muted font-mono">Marcas líderes del e-enduro</span>
              </div>
            </div>

            <div className="hidden lg:block animate-fade-in delay-200">
              <HeroBikeVisual />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </section>

      {/* ── METRICS ── */}
      <section className="relative -mt-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div key={stat.label} className="panel bg-bg-card/80 backdrop-blur-md px-4 py-4 sm:py-5 text-center animate-slide-up"
              style={{ animationDelay: `${i * 100 + 200}ms` }}>
              <p className="text-xl sm:text-2xl font-bold font-mono text-accent">
                {stat.value}{stat.suffix && <span className="text-sm text-text-muted font-mono ml-0.5">{stat.suffix}</span>}
              </p>
              <p className="text-[9px] sm:text-[10px] text-text-muted font-mono uppercase tracking-wider mt-1">{stat.label}</p>
              <div className="w-8 h-0.5 bg-accent/30 mx-auto mt-2 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* ── TERRAIN ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent mb-2 animate-fade-in">Elige por terreno</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight animate-fade-in delay-100">
              Cada terreno tiene<br />
              <span className="text-gradient-accent">su configuración</span>
            </h2>
          </div>
          <Link to="/routes" className="btn-ghost text-xs hide-mobile">
            Ver todos los terrenos →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {terrains.slice(0, 6).map((terrain, i) => (
            <div key={terrain.id} className="animate-slide-up" style={{ animationDelay: `${i * 80 + 200}ms` }}>
              <Link to={`/routes?terrain=${terrain.id}`} className="block group">
                <TerrainCard terrain={terrain} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/routes" className="btn-ghost text-xs">
            Ver todos los terrenos →
          </Link>
        </div>
      </section>

      {/* ── FEATURED BIKES ── */}
      <section className="border-t border-border carbon-weave py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent mb-2 animate-fade-in">Modelos destacados</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight animate-fade-in delay-100">
                Potencia y precisión<br />
                <span className="text-gradient-accent">en cada trazada</span>
              </h2>
            </div>
            <Link to="/catalog" className="btn-ghost text-xs hide-mobile">
              Catálogo completo →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((bike, i) => (
              <div key={bike.id} className="animate-slide-up" style={{ animationDelay: `${i * 120 + 300}ms` }}>
                <BikeCard bike={bike} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/catalog" className="btn-ghost text-xs">
              Catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SMART SETUP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent mb-2">Setup inteligente</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight mb-4">
              Configuración precisa<br />
              <span className="text-gradient-accent">según tu peso y terreno</span>
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-8">
              Olvídate de ajustes genéricos. Nuestra app calcula la presión de suspensión, el sag recomendado
              y el modo de motor óptimo combinando tu peso corporal con el tipo de terreno que vas a afrontar.
            </p>

            <div className="space-y-5">
              {setupSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                  <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center text-accent text-sm shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary mb-0.5">{step.title}</p>
                    <p className="text-[11px] text-text-secondary leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/setup" className="btn-primary text-xs sm:text-sm">
                Configurar mi bici
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 animate-fade-in delay-300">
            <div className="panel bg-bg-card/50 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Ejemplo de cálculo · Rider 78 kg · Terreno rocoso</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-3">Suspensión delantera</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-mono">Presión</span>
                        <span className="text-text-primary font-bold font-mono">92 psi</span>
                      </div>
                      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-gradient-to-r from-accent to-accent/50 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-mono">Sag</span>
                        <span className="text-text-primary font-bold font-mono">24%</span>
                      </div>
                      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div className="h-full w-[60%] bg-gradient-to-r from-accent to-accent/50 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-mono">Rebote</span>
                        <span className="text-text-primary font-bold font-mono">6 clics</span>
                      </div>
                      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div className="h-full w-[50%] bg-gradient-to-r from-accent to-accent/50 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-3">Suspensión trasera</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-mono">Presión</span>
                        <span className="text-text-primary font-bold font-mono">225 psi</span>
                      </div>
                      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div className="h-full w-[75%] bg-gradient-to-r from-energy to-energy/50 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-mono">Sag</span>
                        <span className="text-text-primary font-bold font-mono">27%</span>
                      </div>
                      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-gradient-to-r from-energy to-energy/50 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-mono">Modo motor</span>
                        <span className="text-accent font-bold font-mono">eMTB</span>
                      </div>
                      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-accent to-energy rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Autonomía estimada', value: '75 km', color: 'text-accent' },
                    { label: 'Modo recomendado', value: 'eMTB', color: 'text-accent' },
                    { label: 'Dificultad', value: 'Difícil', color: 'text-energy' },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
                      <p className="text-[9px] text-text-muted font-mono mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="border-t border-border carbon-weave relative overflow-hidden">
        <div className="absolute inset-0 topo-pattern" />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.02] via-transparent to-accent/[0.02]" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent mb-4 animate-fade-in">¿Listo para rodar?</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-[0.95] mb-5 animate-slide-up">
              Encuentra tu e-bike<br />
              <span className="text-gradient-accent">y sal a la montaña</span>
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto mb-8 animate-fade-in delay-200">
              Más de {formatNumber(stats[0].value)} modelos analizados con datos técnicos reales, configuraciones de suspensión
              validadas y recomendaciones inteligentes para cada tipo de terreno enduro.
            </p>

            <div className="flex flex-wrap justify-center gap-3 animate-fade-in delay-300">
              <Link to="/catalog" className="btn-primary text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-4">
                Explorar catálogo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link to="/routes" className="btn-secondary text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-4">
                Explorar terrenos
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
      </section>
    </div>
  )
}

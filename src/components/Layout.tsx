import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppState } from '../context/AppContext'

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/catalog', label: 'Catálogo' },
  { path: '/compare', label: 'Comparador' },
  { path: '/garage', label: 'Garaje' },
  { path: '/setup', label: 'Setup' },
  { path: '/routes', label: 'Rutas' },
]

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { garage } = useAppState()

  return (
    <div className="min-h-screen bg-bg-primary carbon-weave">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/85 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-black text-sm font-mono group-hover:glow-accent transition-all duration-300">
                E
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-text-primary tracking-tight">
                  ENDURO<span className="text-accent">HUB</span>
                </span>
                <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
                  e-bike hub
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-0.5">
              {navItems.map(item => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'text-accent'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {item.label}
                    {item.path === '/garage' && garage.bikes.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[8px] font-bold text-black flex items-center justify-center">
                        {garage.bikes.length}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16 min-h-screen">
        {children}
      </main>

      <footer className="border-t border-border bg-bg-secondary/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-[10px] font-bold text-black font-mono">
                E
              </div>
              <span className="text-xs font-bold text-text-primary tracking-tight">
                ENDURO<span className="text-accent">HUB</span>
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Datos orientativos. Verifica especificaciones oficiales.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

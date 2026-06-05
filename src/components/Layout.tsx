import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppState } from '../context/AppContext'

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/catalog', label: 'Catálogo' },
  { path: '/recommendation', label: 'Recomendación' },
  { path: '/compare', label: 'Comparador' },
  { path: '/garage', label: 'Garaje' },
  { path: '/setup', label: 'Setup' },
  { path: '/terrain', label: 'Terreno' },
]

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { garage } = useAppState()
  const [mobileOpen, setMobileOpen] = useState(false)

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
                <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest hidden xs:block">
                  e-bike hub
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
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
                    {item.path === '/garage' && garage.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[8px] font-bold text-black flex items-center justify-center">
                        {garage.length}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-10 h-10 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-all duration-200"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav overlay */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-bg-primary/95 backdrop-blur-xl animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-1">
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200 animate-fade-in ${
                      isActive
                        ? 'bg-accent-subtle text-accent border border-accent/20'
                        : 'text-text-muted hover:text-text-primary hover:bg-bg-hover border border-transparent'
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {item.label}
                    {item.path === '/garage' && garage.length > 0 && (
                      <span className="w-5 h-5 rounded-full bg-accent text-[9px] font-bold text-black flex items-center justify-center">
                        {garage.length}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16 min-h-screen">
        {children}
      </main>

      <footer className="border-t border-border bg-bg-secondary/80 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
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
            <div className="flex items-center gap-4 text-[10px] text-text-muted font-mono">
              <span>e-bike enduro hub</span>
              <span className="w-px h-3 bg-border" />
              <span>Datos orientativos</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

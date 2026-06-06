import { useState } from 'react'
import type { EBike } from '../types'

export function BikeImage({
  bike,
  className = '',
}: {
  bike: EBike
  className?: string
}) {
  const [error, setError] = useState(false)
  const src = bike.images?.hero || bike.image

  if (error) {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center ${className}`}
        style={{ backgroundColor: `${bike.brandColor}15` }}
        role="img"
        aria-label={`${bike.brand} ${bike.model}`}
      >
        <span
          className="text-4xl font-bold font-mono select-none"
          style={{ color: `${bike.brandColor}40` }}
        >
          {bike.brand[0]}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={`${bike.brand} ${bike.model}`}
        loading="lazy"
        onError={() => setError(true)}
        className="w-full h-full object-contain"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 60%, ${bike.brandColor}08 100%)`,
        }}
      />
    </div>
  )
}

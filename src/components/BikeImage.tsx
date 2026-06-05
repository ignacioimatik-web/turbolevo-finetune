import type { EBike } from '../types'

const silhouettes: Record<string, string> = {
  Specialized: 'M16 4 L44 4 L52 28 L28 28 Z',
  Orbea: 'M10 10 L50 10 L58 34 L18 34 Z',
  Trek: 'M12 8 L48 8 L56 32 L20 32 Z',
  Canyon: 'M10 10 L50 10 L58 34 L18 34 Z',
  Commencal: 'M16 4 L44 4 L52 28 L28 28 Z',
  Cannondale: 'M14 6 L46 6 L54 30 L22 30 Z',
  Cube: 'M12 8 L48 8 L56 32 L20 32 Z',
  'Santa Cruz': 'M14 6 L46 6 L54 30 L22 30 Z',
  'YT Industries': 'M16 4 L44 4 L52 28 L28 28 Z',
  Mondraker: 'M10 10 L50 10 L58 34 L18 34 Z',
  Giant: 'M12 8 L48 8 L56 32 L20 32 Z',
  Focus: 'M14 6 L46 6 L54 30 L22 30 Z',
}

export function BikeImage({
  bike,
  className = '',
}: {
  bike: EBike
  className?: string
}) {
  const silhouette = silhouettes[bike.brand] || silhouettes.Specialized
  const travelRatio = bike.suspension.front.travel / 200

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 68 48"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`grad-${bike.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bike.brandColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={bike.brandColor} stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id={`shine-${bike.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.08" />
            <stop offset="50%" stopColor="white" stopOpacity="0.02" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="68" height="48" rx="4" fill={`${bike.brandColor}15`} />

        <rect x="0" y="0" width="68" height="48" rx="4" fill={`url(#shine-${bike.id})`} />

        <path
          d={silhouette}
          fill={`url(#grad-${bike.id})`}
          opacity="0.6"
          transform="translate(2, 6)"
        />

        <circle cx="16" cy="40" r="6" fill={bike.brandColor} opacity="0.25" />
        <circle cx="52" cy="40" r="6" fill={bike.brandColor} opacity="0.25" />

        <line
          x1="14" y1="28" x2="54" y2="28"
          stroke={bike.brandColor}
          strokeWidth="1.5"
          opacity="0.2"
        />

        <text
          x="34" y="22"
          textAnchor="middle"
          fill={bike.brandColor}
          fontSize="10"
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
          opacity="0.5"
        >
          {bike.brand[0]}
        </text>

        <rect
          x="30" y="28"
          width={travelRatio * 14}
          height="2"
          rx="1"
          fill={bike.brandColor}
          opacity="0.3"
        />
      </svg>
    </div>
  )
}

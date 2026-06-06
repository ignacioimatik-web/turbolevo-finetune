import type { VideoHTMLAttributes } from 'react'

interface VideoBackgroundProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  src: string
  poster?: string
  overlay?: boolean
  className?: string
}

export function VideoBackground({ 
  src, 
  poster,
  overlay = true, 
  className = '',
  ...props 
}: VideoBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
        {...props}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-bg-primary/40 to-bg-primary/60" />
      )}
    </div>
  )
}

export function VideoCard({ 
  src, 
  poster,
  children,
  className = '',
}: {
  src: string
  poster?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/30 to-transparent z-10" />
      <div className="relative z-20">{children}</div>
    </div>
  )
}
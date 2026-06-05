import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored === null) return fallback
      const parsed = JSON.parse(stored) as T
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback
      return parsed
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch { /* ignore parse errors */ }
  }, [key, value])

  return [value, setValue]
}

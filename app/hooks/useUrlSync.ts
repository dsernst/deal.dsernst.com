import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'

export function useUrlSync(values: string[], delay = 1500) {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Set new timeout for URL update
    timeoutRef.current = setTimeout(() => {
      const newPath = `/${values[0]}/${values[1]}`
      router.replace(newPath)
    }, delay)

    // Cleanup on unmount or when values change
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [values, delay, router])
}

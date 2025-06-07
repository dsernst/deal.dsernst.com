import { useRouter, usePathname } from 'next/navigation'
import { useRef, useEffect } from 'react'

export function useUrlSync(values: string[], delay = 1500) {
  const router = useRouter()
  const pathname = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Get current URL values
    const urlValues = pathname.split('/').slice(1)

    // Only update if values actually changed
    if (values[0] !== urlValues[0] || values[1] !== urlValues[1]) {
      timeoutRef.current = setTimeout(() => {
        const newPath = `/${values[0]}/${values[1]}`
        console.log('newPath:', newPath)
        router.replace(newPath)
      }, delay)
    }

    // Cleanup on unmount or when values change
    return () => timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [values, delay, router, pathname])
}

import { useRouter, usePathname } from 'next/navigation'
import { useRef, useEffect } from 'react'

export function useUrlSync([v0, v1]: [string, string]) {
  const router = useRouter()
  const path = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    console.log({ v0, v1, path })

    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Only update if values actually changed
    const newPath = `/${v0}${v1 ? `/${v1}` : ''}`
    if (newPath !== path) {
      timeoutRef.current = setTimeout(() => {
        console.log('Setting url path:', newPath)
        router.replace(newPath)
      }, 1000)
    }

    // Cleanup on unmount or when values change
    return () => timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [v0, v1, router, path])
}

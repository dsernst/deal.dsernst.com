import { useRouter, usePathname } from 'next/navigation'
import { useRef, useEffect } from 'react'

export function useUrlSync([v0, v1]: [string, string]) {
  const router = useRouter()
  const pathname = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    console.log({ v0, v1, pathname, timeoutRef: timeoutRef.current })

    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Only update if values actually changed
    const newPath = `/${v0}${v1 ? `/${v1}` : ''}`
    if (newPath !== pathname) {
      timeoutRef.current = setTimeout(() => {
        console.log('newPath:', newPath)
        router.replace(newPath)
      }, 1500)
    }

    // Cleanup on unmount or when values change
    return () => timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [v0, v1, router, pathname])
}

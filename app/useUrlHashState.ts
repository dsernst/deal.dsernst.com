import { useRouter, usePathname } from 'next/navigation'
// import { useRef, useEffect, useState } from 'react'
import { useEffect, useState } from 'react'

export function useUrlHashState(): [
  [string, string],
  (next: [string, string]) => void
] {
  const router = useRouter()
  const path = usePathname()
  // const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const [values, setValues] = useState<[string, string]>(['', ''])

  // Read the hash on client-side mount and on hash change
  useEffect(() => {
    const readHash = () => {
      const [v1 = '', v2 = ''] = window.location.hash
        .replace('#', '')
        .split('-')
      setValues([v1, v2])
    }

    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  const setHashValues = (nextValues: [string, string]) => {
    const [nextV1, nextV2] = nextValues
    const currentHash = window.location.hash.replace('#', '')
    const [currentV1, currentV2] = currentHash.split('-')

    if (currentV1 !== nextV1 || currentV2 !== nextV2) {
      // if (timeoutRef.current) clearTimeout(timeoutRef.current)

      // timeoutRef.current = setTimeout(() => {
      const newHash = `#${nextV1}-${nextV2}`
      router.replace(`${path}${newHash}`)
      setValues(nextValues)
      // }, 1000)
    }
  }

  return [values, setHashValues]
}

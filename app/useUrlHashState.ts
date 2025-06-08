import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { type Odds } from './OddsInput'

export function useUrlHashState(): [Odds, (next: Odds) => void] {
  const router = useRouter()
  const path = usePathname()
  const [values, setValues] = useState<Odds>(['', ''])

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

  const setHashValues = (nextValues: Odds) => {
    const currentUrl = `${path}${window.location.hash}`
    const [nextV1, nextV2] = nextValues

    const newHash = `#${nextV1}-${nextV2}`
    const newUrl = `${path}${newHash}`

    if (newUrl !== currentUrl) {
      router.replace(newUrl)
      setValues(nextValues)
    }
  }

  return [values, setHashValues]
}

import { useEffect, useState } from 'react'

import type { CompactPayload } from './binaryEncoding'

import { type Choices } from './RoleSelector'

export function useInitiatePayload(role: Choices | null, value: null | string, title?: string) {
  const [loading, setLoading] = useState(false)
  const [signedPayload, setSignedPayload] = useState<CompactPayload | null>(null)

  useEffect(() => {
    if (role && value) {
      setLoading(true)
      const body: { role: Choices; title?: string; value: string } = {
        role,
        value,
      }
      if (title?.trim()) body.title = title.trim()
      fetch('/async/api/initiate', {
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
        .then((res) => res.json())
        .then((data) => {
          setSignedPayload(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error initiating payload:', error)
          setLoading(false)
        })
    }
  }, [role, value, title])

  return { loading, signedPayload }
}

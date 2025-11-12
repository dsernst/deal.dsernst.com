import { useEffect, useState } from 'react'

import { type Choices } from './RoleSelector'

type SignedPayload = null | {
  contact: string
  encryptedValue: string
  role: Choices
  signature: string
  timestamp: number
}

export function useInitiatePayload(
  contact: null | string,
  role: Choices | null,
  value: null | string
) {
  const [loading, setLoading] = useState(false)
  const [signedPayload, setSignedPayload] = useState<SignedPayload>(null)

  useEffect(() => {
    if (contact && role && value) {
      setLoading(true)
      fetch('/async/api/initiate', {
        body: JSON.stringify({ contact, role, value }),
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
  }, [contact, role, value])

  return { loading, signedPayload }
}

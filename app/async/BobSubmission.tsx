'use client'

import { useEffect, useRef, useState } from 'react'

import { ResultDisplay } from './ResultDisplay'

export function BobSubmission({
  alicePayload,
  bobValue,
  onError,
}: {
  alicePayload: string
  bobValue: string
  onError: (error: string) => void
}) {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<null | {
    hasOverlap: boolean
    result: null | number
  }>(null)
  const hasSubmitted = useRef(false)

  useEffect(() => {
    // Prevent double submission (React Strict Mode in dev causes double renders)
    if (hasSubmitted.current) return
    hasSubmitted.current = true

    fetch('/async/api/complete', {
      body: JSON.stringify({
        bobValue,
        overlapOnly: false,
        payload: alicePayload,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          onError(data.error)
        } else {
          setResult(data)
        }
        setLoading(false)
      })
      .catch(() => {
        onError('Failed to complete negotiation')
        setLoading(false)
      })
  }, [alicePayload, bobValue, onError])

  if (loading) {
    return <p className="text-gray-400">Computing result...</p>
  }

  if (!result) {
    return null
  }

  return <ResultDisplay result={result} />
}

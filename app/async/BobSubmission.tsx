'use client'

import { useEffect, useRef, useState } from 'react'

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

  if (!result.hasOverlap) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-2xl">❌ No overlap, sorry</p>
        <p className="text-gray-400 text-sm">
          The seller&apos;s minimum is higher than the buyer&apos;s maximum.
        </p>
      </div>
    )
  }

  if (result.result === null) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-bold">✅ A deal is possible</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-400">Fair price:</p>
      <div className="text-4xl font-bold">${result.result.toFixed(2)}</div>
      <p className="text-sm text-gray-400 text-center mt-4">
        Both parties have been notified of this result.
      </p>
    </div>
  )
}

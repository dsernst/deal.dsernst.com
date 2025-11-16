'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { PlaintextData } from './binaryEncoding'

import { BobSubmission } from './BobSubmission'
import { Input } from './Input'
import { ResultDisplay } from './ResultDisplay'

type ValidateResponse =
  | { error: string }
  | {
      r: 'b' | 's'
      result?: { hasOverlap: boolean; result: null | number }
      used: boolean
    }

export function BobContent() {
  const params = useParams()
  const payload = params?.payload as string | undefined
  const [aliceData, setAliceData] = useState<null | PlaintextData>(null)
  const [bobValue, setBobValue] = useState<null | string>(null)
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState(true)
  const [existingResult, setExistingResult] = useState<null | {
    hasOverlap: boolean
    result: null | number
  }>(null)

  useEffect(() => {
    if (!payload) {
      setError('No payload found in URL')
      setLoading(false)
      return
    }

    // Validate payload format and decrypt on client (real validation happens server-side)
    fetch('/async/api/validate', {
      body: JSON.stringify({ payload }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data: ValidateResponse) => {
        if ('error' in data) {
          setError(data.error)
        } else {
          setAliceData({ r: data.r } as PlaintextData)
          // If payload was already used and has results, show them
          if (data.used && data.result) {
            setExistingResult(data.result)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to validate payload')
        setLoading(false)
      })
  }, [payload])

  if (loading)
    return <p className="text-gray-400 mt-8 animate-pulse">Loading invite...</p>

  if (error || !aliceData)
    return <p className="text-red-400">{error || 'Invalid payload'}</p>

  // Determine Bob's role (opposite of Alice's)
  // aliceData from validate only contains 'r' (role), not the full data
  const aliceRole = (aliceData as { r: 'b' | 's' }).r
  const bobRole = aliceRole === 'b' ? 'seller' : 'buyer'

  return (
    <>
      {/* If results already exist (payload was used), show them immediately */}
      {existingResult ? (
        <ResultDisplay result={existingResult} />
      ) : !bobValue ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-400 text-center mb-4">
            You are the{' '}
            <span className="font-semibold">
              {bobRole === 'buyer' ? 'Buyer' : 'Seller'}
            </span>
            . Enter your {bobRole === 'buyer' ? 'max offer' : 'min price'}.
          </p>
          <Input onSubmit={setBobValue} role={bobRole} />
        </div>
      ) : (
        <BobSubmission
          alicePayload={payload!}
          bobValue={bobValue}
          onError={setError}
        />
      )}
    </>
  )
}

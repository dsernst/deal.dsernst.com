'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { PlaintextData } from './binaryEncoding'

import { description, title } from '../constants'
import { BobSubmission } from './BobSubmission'
import { Input } from './Input'

export function BobContent() {
  const params = useParams()
  const payload = params?.payload as string | undefined
  const [aliceData, setAliceData] = useState<null | PlaintextData>(null)
  const [bobValue, setBobValue] = useState<null | string>(null)
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState(true)

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
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setAliceData(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to validate payload')
        setLoading(false)
      })
  }, [payload])

  if (loading) {
    return (
      <div
        className="min-h-screen p-8 pt-4 flex flex-col items-center justify-center"
        style={{ minHeight: '100dvh' }}
      >
        <p className="text-gray-400">Validating payload...</p>
      </div>
    )
  }

  if (error || !aliceData) {
    return (
      <div
        className="min-h-screen p-8 pt-4 flex flex-col items-center justify-center"
        style={{ minHeight: '100dvh' }}
      >
        <h1 className="text-4xl font-bold mb-1">{title}</h1>
        <p className="text-lg text-gray-400 mb-8">{description}</p>
        <p className="text-red-400">{error || 'Invalid payload'}</p>
      </div>
    )
  }

  // Determine Bob's role (opposite of Alice's)
  // aliceData from validate only contains 'r' (role), not the full data
  const aliceRole = (aliceData as { r: 'b' | 's' }).r
  const bobRole = aliceRole === 'b' ? 'seller' : 'buyer'

  return (
    <div
      className="min-h-screen p-8 pt-4 flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh' }}
    >
      <h1 className="text-4xl font-bold mb-1">{title}</h1>
      <p className="text-lg text-gray-400 mb-8">{description}</p>

      {!bobValue ? (
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
    </div>
  )
}

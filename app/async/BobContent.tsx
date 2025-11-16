'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { PlaintextData } from './binaryEncoding'

import { LearnMoreLink } from '../LearnMoreLink'
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
  const [bobsValue, setBobsValue] = useState<null | string>(null)
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState(true)
  const [existingResult, setExistingResult] = useState<null | {
    hasOverlap: boolean
    result: null | number
  }>(null)

  useEffect(() => {
    if (!payload) {
      setError('No payload found in URL')
      return setLoading(false)
    }

    // Check invite status
    fetch('/async/api/validate', {
      body: JSON.stringify({ payload }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data: ValidateResponse) => {
        setLoading(false)
        if ('error' in data) return setError(data.error)

        setAliceData({ r: data.r } as PlaintextData)

        // If invite already has results, show them
        if (data.used && data.result) setExistingResult(data.result)
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

  if (existingResult) return <ResultDisplay result={existingResult} />

  // Determine Bob's role (opposite of Alice's)
  const aliceRole = aliceData.r
  const bobRole = aliceRole === 'b' ? 'seller' : 'buyer'

  return (
    <>
      {!bobsValue ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-400 text-center mb-4">
            You{"'"}ve been invited as a potential{' '}
            <span className="font-semibold">
              {bobRole === 'buyer' ? 'Buyer' : 'Seller'}
            </span>
            .
          </p>
          <Input
            label={`Enter your ${
              bobRole === 'buyer' ? 'max offer' : 'min price'
            }:`}
            onSubmit={setBobsValue}
          />

          <ul className="mt-5 text-sm text-gray-400 space-y-1.5 text-center max-w-xs mx-auto">
            <li>You can only submit your value once.</li>
            <li>Neither side will see the other&apos;s input.</li>
            <li>
              <span className="mt-6 block text-xs">✅</span> If there is an
              overlap, a fair random win-win price will be picked between min &
              max.
            </li>
            <li>
              <span className="mt-6 block text-xs">❌</span> If there&apos;s no
              overlap, no hard feelings.
            </li>

            <li className="mt-6">
              <i className="text-white/75 font-bold">Hint</i>: Unlike
              traditional negotiations, both sides&apos; best move here is to
              enter your{' '}
              <span className="font-medium text-white/75">honest cutoff</span>{' '}
              point, to not miss potential win-win deals. &quot;Posturing&quot;
              is a losing strategy.
            </li>
          </ul>

          <LearnMoreLink />
        </div>
      ) : (
        <BobSubmission
          alicePayload={payload!}
          bobsValue={bobsValue}
          onError={setError}
        />
      )}
    </>
  )
}

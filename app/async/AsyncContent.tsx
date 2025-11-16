'use client'

import Link from 'next/link'
import { useState } from 'react'

import { description, title } from '../constants'
import { LearnMoreLink } from '../LearnMoreLink'
import { Input } from './Input'
import { RoleSelector } from './RoleSelector'
import { ShareUrlDisplay } from './ShareUrlDisplay'
import { useInitiatePayload } from './useInitiatePayload'

type Role = 'buyer' | 'seller' | null

export function Content() {
  const [role, setRole] = useState<Role>(null)
  const [value, setValue] = useState<null | string>(null)

  const { loading, signedPayload } = useInitiatePayload(role, value)

  return (
    <div
      className="min-h-screen p-8 pt-4 flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh' }} // ignore iOS bottom bar
    >
      <h1 className="text-4xl font-bold mb-1">{title}</h1>
      <p className="text-lg text-gray-400 mb-8">{description}</p>

      {!role ? (
        <RoleSelector onSelect={setRole} />
      ) : !value ? (
        <Input onSubmit={setValue} role={role} />
      ) : loading ? (
        <p className="text-gray-400">Creating your Share URL...</p>
      ) : signedPayload ? (
        <ShareUrlDisplay payload={signedPayload} />
      ) : (
        <p className="text-red-400">Error creating Share URL</p>
      )}

      {/* Learn more */}
      <LearnMoreLink />
      {!signedPayload && (
        <Link
          className="text-sm text-gray-400 mt-1 block hover:underline"
          href="/"
        >
          Switch to local-device mode
        </Link>
      )}
    </div>
  )
}

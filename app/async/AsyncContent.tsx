'use client'

import Link from 'next/link'
import { useState } from 'react'

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
    <>
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

      {/* Switch to local-device mode */}
      {!signedPayload && (
        <Link
          className="text-sm text-gray-400 mt-1 block hover:underline"
          href="/"
        >
          Switch to local-device mode
        </Link>
      )}
    </>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'

import { LearnMoreLink } from '../LearnMoreLink'
import { CompactPayload } from './binaryEncoding'
import { Input } from './Input'
import { Instructions } from './Instructions'
import { RoleSelector } from './RoleSelector'
import { ShareUrlDisplay } from './ShareUrlDisplay'
import { useInitiatePayload } from './useInitiatePayload'

type Role = 'buyer' | 'seller' | null

export function Content() {
  const [titleStepDone, setTitleStepDone] = useState(false)
  const [title, setTitle] = useState('')
  const [role, setRole] = useState<Role>(null)
  const [value, setValue] = useState<null | string>(null)

  const { loading, signedPayload } = useInitiatePayload(role, value, title)

  // Share URL on its own screen once ready (or loading/error)
  if (value) return <ShareUrlScreen {...{ loading, signedPayload }} />

  return (
    <>
      <div className="flex flex-col items-center gap-8">
        {/* Step 1: Optional title — always visible, editable */}
        <TitleStep onNext={() => setTitleStepDone(true)} {...{ setTitle, title, titleStepDone }} />

        {/* Step 2: Buyer / Seller — visible after title step, editable */}
        {titleStepDone && (
          <div className="w-full border-t border-gray-600/60 mt-2 pt-8 flex flex-col items-center">
            <RoleSelector onSelect={setRole} selectedRole={role} />
          </div>
        )}

        {/* Step 3: Cutoff amount — visible after role chosen, editable */}
        {role && (
          <div className="w-full border-t border-gray-600/60 mt-2 pt-8 flex flex-col items-center">
            <Input onSubmit={setValue} role={role} />
            <Instructions />
          </div>
        )}
      </div>

      <LearnMoreLink />

      <Link className="text-sm text-gray-400 mt-1 block hover:underline" href="/">
        Switch to local-device mode
      </Link>
    </>
  )
}

function ShareUrlScreen({
  loading,
  signedPayload,
}: {
  loading: boolean
  signedPayload: CompactPayload | null
}) {
  return (
    <>
      {loading ? (
        <p className="text-gray-400">Creating your Share URL...</p>
      ) : signedPayload ? (
        <ShareUrlDisplay payload={signedPayload} />
      ) : (
        <p className="text-red-400">Error creating Share URL</p>
      )}
      <LearnMoreLink />
    </>
  )
}

function TitleStep({
  onNext,
  setTitle,
  title,
  titleStepDone,
}: {
  onNext: () => void
  setTitle: (value: string) => void
  title: string
  titleStepDone: boolean
}) {
  const isEmpty = !title.trim()

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="text-sm text-gray-400 text-center" htmlFor="deal-title">
        Optional title
      </label>
      <div className="flex gap-2 items-center">
        <input
          autoFocus
          className="px-3 py-2 min-w-[12rem] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder:text-gray-500"
          id="deal-title"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onNext()}
          placeholder="e.g. Car sale"
          type="text"
          value={title}
        />
        {!titleStepDone && (
          <button
            className="w-16 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100/10 active:bg-gray-100/20"
            onClick={onNext}
          >
            {isEmpty ? 'Skip' : 'Next'}
          </button>
        )}
      </div>
    </div>
  )
}

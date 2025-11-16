'use client'

import { useState } from 'react'

import type { CompactPayload } from './binaryEncoding'

export function ShareUrlDisplay({ payload }: { payload: CompactPayload }) {
  const shareUrl = `${window.location.origin}/b/${payload.ev}`
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4 max-w-2xl">
      <h2 className="text-2xl font-semibold">Your Share URL</h2>
      <div className="flex gap-2 w-full">
        <input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-900 text-sm"
          readOnly
          type="text"
          value={shareUrl}
        />
        <button
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md cursor-pointer hover:bg-blue-500/10 active:bg-blue-500/20"
          onClick={() => {
            navigator.clipboard.writeText(shareUrl)
            setCopied(true)
          }}
        >
          {!copied ? 'Copy' : 'Copied!'}
        </button>
      </div>
      <p className="text-sm text-gray-400 text-center">
        Share this URL with the other party. They can use it to complete the
        negotiation.
      </p>
    </div>
  )
}

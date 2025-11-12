'use client'

import { useRef, useState } from 'react'

export function ContactInput({
  onSubmit,
}: {
  onSubmit: (email: string) => void
}) {
  const [email, setEmail] = useState('')
  const $submit = useRef<HTMLButtonElement>(null)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col">
        {/* Label */}
        <label
          className="text-sm font-medium mb-1 text-center"
          htmlFor="contact-input"
        >
          Email to Send Results
        </label>

        {/* Input Box */}
        <input
          autoFocus
          className="px-3 py-2 h-15 w-60 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          id="contact-input"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && $submit.current?.click()}
          type="email"
          value={email}
        />

        {/* Submit Button */}
        <button
          className="border-blue-500 border text-white px-4 py-2 rounded-md mt-4 cursor-pointer hover:bg-blue-500/10 active:bg-blue-500/20"
          disabled={!email}
          onClick={() => email && onSubmit(email)}
          ref={$submit}
        >
          Next
        </button>
      </div>
    </div>
  )
}

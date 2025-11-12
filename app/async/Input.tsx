'use client'

import { useRef, useState } from 'react'

import { type Choices, roles } from './RoleSelector'

export function Input({
  onSubmit,
  role,
}: {
  onSubmit: (value: string) => void
  role: Choices
}) {
  const [input, setInput] = useState('')
  const $submit = useRef<HTMLButtonElement>(null)

  const choice = roles.find(([r]) => r.toLowerCase() === role)
  if (!choice) return <p>Error: Invalid role</p>
  const [title, description] = choice

  return (
    <div className="flex gap-4">
      <div className="flex flex-col">
        {/* Label */}
        <label
          className="text-sm font-medium mb-1 text-center"
          htmlFor="alice-input"
        >
          {title}&apos;s {description}
        </label>

        {/* Input Box */}
        <input
          autoFocus
          className="px-3 py-2 h-20 w-40 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-number-controls text-3xl"
          id="alice-input"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && $submit.current?.click()}
          pattern="\d*"
          type="number"
          value={input}
        />

        {/* Submit Button */}
        <button
          className="border-blue-500 border text-white px-4 py-2 rounded-md mt-4 cursor-pointer hover:bg-blue-500/10 active:bg-blue-500/20"
          disabled={!input}
          onClick={() => input && onSubmit(input)}
          ref={$submit}
        >
          Next
        </button>
      </div>
    </div>
  )
}

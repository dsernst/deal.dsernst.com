'use client'

import { useRef, useState } from 'react'

import type { Inputs } from './Content'

export function PrivateInput({
  inputs,
  setValues,
}: {
  inputs: Inputs
  setValues: (nextValues: Inputs) => void
}) {
  const [index, setIndex] = useState(0)
  const [tempInput, setTempInput] = useState('')
  const $submit = useRef<HTMLButtonElement>(null)

  if (index === 2) return null

  return (
    <div className="flex gap-4">
      <div className="flex flex-col" key={`odds${index + 1}`}>
        {/* Label */}
        <label
          className="text-sm font-medium mb-1 text-center"
          htmlFor={`odds${index + 1}`}
        >
          {index === 0 ? "Seller's Min Ask" : "Buyer's Max Bid"}
        </label>

        {/* Input Box */}
        <input
          autoFocus
          className="px-3 py-2 h-20 w-40 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-number-controls text-3xl"
          onChange={(e) => setTempInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && $submit.current?.click()}
          pattern="\d*"
          type="number"
          value={tempInput}
        />

        {/* Submit Button */}
        <button
          className="border-blue-500 border text-white px-4 py-2 rounded-md mt-4 cursor-pointer hover:bg-blue-500/10 active:bg-blue-500/20"
          onClick={() => {
            const nextValues = [...inputs] as Inputs
            nextValues[index] = tempInput
            setValues(nextValues)
            setIndex(index + 1)
            setTempInput('')
          }}
          ref={$submit}
        >
          Next
        </button>
      </div>
    </div>
  )
}

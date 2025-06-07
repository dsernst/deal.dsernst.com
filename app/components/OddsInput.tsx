'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OddsInput({ initialOdds }: { initialOdds: string[] }) {
  const router = useRouter()
  const [values, setValues] = useState(['', ''])

  // Initialize from route params
  useEffect(() => {
    setValues(initialOdds)
  }, [initialOdds])

  /** Set values into URL */
  const updateValue = (index: number, value: string) => {
    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)

    // Update URL path
    const newPath = `/${newValues[0]}/${newValues[1]}`
    router.replace(newPath)
  }

  return (
    <div className="flex gap-4">
      {['30', '75'].map((placeholder, index) => (
        <div key={`odds${index + 1}`} className="flex flex-col">
          <label
            htmlFor={`odds${index + 1}`}
            className="text-sm font-medium mb-1"
          >
            Person {index + 1}&apos;s Odds
          </label>
          <div className="relative text-3xl">
            <input
              type="text"
              {...{ placeholder }}
              value={values[index]}
              onChange={(e) => updateValue(index, e.target.value)}
              className="px-3 py-2 h-20 w-30 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400 absolute right-3 top-[23px]">%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

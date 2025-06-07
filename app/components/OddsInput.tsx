'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OddsInput() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [values, setValues] = useState(['', ''])

  // Initialize from URL params
  useEffect(() => {
    const odds1 = searchParams.get('odds1')
    const odds2 = searchParams.get('odds2')
    setValues([odds1 || '', odds2 || ''])
  }, [searchParams])

  /** Set values into URL */
  const updateValue = (index: number, value: string) => {
    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set(`odds${index + 1}`, value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex gap-4">
      {[30, 75].map((placeholder, index) => (
        <div key={`odds${index + 1}`} className="flex flex-col">
          <label
            htmlFor={`odds${index + 1}`}
            className="text-sm font-medium mb-1"
          >
            Person {index + 1}&apos;s Odds
          </label>
          <input
            type="text"
            placeholder={placeholder + '%'}
            value={values[index]}
            onChange={(e) => updateValue(index, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )
}

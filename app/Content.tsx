'use client'

import { useState } from 'react'

import { Calculation } from './Calculation'
import { description, title } from './constants'
import { OneShotAgreement } from './OneShotAgreement'
import { PrivateInput } from './PrivateInput'

export type Inputs = [string, string]
export function Content() {
  const [[input1, input2], setValues] = useState<Inputs>(['', ''])

  return (
    <div
      className="min-h-screen p-8 pt-4 flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh' }} // ignore iOS bottom bar
    >
      <h1 className="text-4xl font-bold mb-1">{title}</h1>
      <p className="text-lg text-gray-400 mb-8">{description}</p>

      {/* Private inputs */}
      <PrivateInput {...{ inputs: [input1, input2], setValues }} />

      {/* Results */}
      <Calculation {...{ input1, input2 }} />

      <OneShotAgreement />

      {/* Learn more */}
      <a
        className="text-sm text-gray-400 mt-16 block hover:underline"
        href="https://github.com/dsernst/deal.dsernst.com#dealdsernstcom"
        target="_blank"
      >
        Learn more
      </a>
    </div>
  )
}

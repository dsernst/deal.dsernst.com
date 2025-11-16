'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Calculation } from './Calculation'
import { LearnMoreLink } from './LearnMoreLink'
import { ModeContainer } from './ModeSwitcher'
import { OneShotAgreement } from './OneShotAgreement'
import { PrivateInput } from './PrivateInput'

export type Inputs = [string, string]
export function Content() {
  const [[input1, input2], setValues] = useState<Inputs>(['', ''])

  return (
    <>
      {/* Private inputs */}
      <PrivateInput {...{ inputs: [input1, input2], setValues }} />

      {/* Results */}
      <ModeContainer tabs={['Report Overlap Only', 'Pick Fair Price']}>
        {({ ModeSwitcher, overlapOnly }) => (
          <>
            <Calculation {...{ input1, input2, overlapOnly }} />
            <OneShotAgreement {...{ ModeSwitcher, overlapOnly }} />
          </>
        )}
      </ModeContainer>

      {/* Learn more */}
      <LearnMoreLink />
      <Link
        className="text-sm text-gray-400 mt-1 block hover:underline"
        href="/async"
      >
        Switch to async mode
      </Link>
    </>
  )
}

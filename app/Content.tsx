'use client'

import { Calculation } from './Calculation'
import { description, title } from './constants'
import OddsInput from './OddsInput'
import { useUrlHashState } from './useUrlHashState'

export function Content() {
  const [[odds1, odds2], setHashValues] = useUrlHashState()

  return (
    <div
      className="min-h-screen p-8 pt-4 flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh' }} // ignore iOS bottom bar
    >
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-400 mb-8">{description}</p>

      {/* Odds inputs */}
      <OddsInput {...{ odds: [odds1, odds2], setHashValues }} />

      <Calculation {...{ odds1, odds2 }} />
    </div>
  )
}

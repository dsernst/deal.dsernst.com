'use client'

import { usePathname } from 'next/navigation'
import { Calculation } from './Calculation'
import OddsInput from './OddsInput'

export const title = 'Bet Calculator'
export const description = 'Price 2-person bets fast & fairly'

export function Content() {
  // Ensure we always have two values, even if URL is partial
  const [odds1 = '', odds2 = ''] = usePathname().split('/').slice(1)

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-400 mb-8">{description}</p>

      {/* Odds inputs */}
      <OddsInput {...{ odds1, odds2 }} />

      <Calculation {...{ odds1, odds2 }} />
    </div>
  )
}

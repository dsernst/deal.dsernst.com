import { useState } from 'react'

import { calcBet, type Label, round } from './calcBet'

const midpointTypes = {
  Linear:
    'Simple average of both beliefs — gives equal expected value to each side.',
  Relative:
    'Balances the perceived % advantage for each person, based on how confident they are.',
}

export const Calculation = ({
  odds1,
  odds2,
}: {
  odds1: string
  odds2: string
}) => {
  const [usingLinear, setUsingLinear] = useState(false)
  const bet = calcBet(+odds1, +odds2)
  if (!bet)
    return (
      <div className="opacity-30 italic h-74 pt-8">
        Enter odds for calculation
      </div>
    )

  const { labels, leftAmount, normalized, opposite, rightAmount } = bet

  const calculations = usingLinear ? bet.newShape.linear : bet.newShape.relative

  return (
    <div>
      <div className="flex justify-between gap-2 text-center w-42 mt-2">
        <div className="flex flex-col items-center">
          <div>${round(usingLinear ? leftAmount : 0, 2)}</div>
          <Label label={labels[0]} />
        </div>
        <div className="flex flex-col items-center">
          <div>${round(usingLinear ? rightAmount : 0, 2)}</div>
          <Label label={labels[1]} />
        </div>
      </div>

      <h2 className="text-sm font-bold mb-4 text-gray-500 mt-12">
        Payout Calculations
      </h2>

      <div className="*:flex *:justify-between *:gap-4">
        <p className="items-end">
          <span
            className="flex flex-col cursor-pointer hover:border-gray-700 border border-transparent hover:bg-gray-800/50 rounded-md px-1.5 pt-1 pb-0.5 relative -ml-px -left-1.5"
            onClick={() => setUsingLinear(!usingLinear)}
            title={midpointTypes[usingLinear ? 'Linear' : 'Relative']}
          >
            <span className="text-xs text-gray-500 cursor-pointer -mb-0.5">
              {usingLinear ? 'Linear' : 'Relative'}
            </span>
            <b>Midpoint:</b>
          </span>
          <span className="relative bottom-0.5">
            {round(calculations._midpoint * 100, 1)}%
          </span>
        </p>
        <p className="text-xs text-gray-500">
          <b>Opposite:</b> {opposite * 100}%
        </p>

        <p className="mt-6 text-xs text-gray-500">
          <b>Split:</b> {round(calculations._midpoint * 100, 1)} :{' '}
          {opposite * 100}
        </p>

        <p>
          <b>Normalized:</b>{' '}
          <span>
            {calculations._midpoint < 0.5 && <>1 : </>}
            <span className="cursor-help" title={`${round(normalized, 6)}`}>
              {round(normalized, 2)}
            </span>
            {calculations._midpoint >= 0.5 && <> : 1</>}
          </span>
        </p>

        <p className="text-xs mt-6 text-gray-500">
          <i>Expected Value:</i>+FIX%
        </p>
        <p className="text-xs text-gray-700">for both sides</p>
      </div>
    </div>
  )
}

// Parameterize YES/NO labels
const colors = { NO: 'text-red-500/60', YES: 'text-green-500/50' }
const Label = ({ label }: { label: Label }) => (
  <div className={`text-sm ${colors[label]}`}>{label}</div>
)

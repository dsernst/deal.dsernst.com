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
  const [usingLinear, setUsingLinear] = useState(true)
  const bet = calcBet(+odds1, +odds2)
  if (!bet)
    return (
      <div className="opacity-30 italic h-74 pt-8">
        Enter odds for calculation
      </div>
    )

  const {
    arithmeticMidpoint,
    leftAmount,
    leftEv,
    leftLabel,
    normalized,
    opposite,
    relativeMidpoint,
    rightAmount,
    rightLabel,
  } = bet

  return (
    <div>
      <div className="flex justify-between gap-2 text-center w-42 mt-2">
        <div className="flex flex-col items-center">
          <div>${round(usingLinear ? leftAmount : 0, 2)}</div>
          <Label label={leftLabel} />
        </div>
        <div className="flex flex-col items-center">
          <div>${round(usingLinear ? rightAmount : 0, 2)}</div>
          <Label label={rightLabel} />
        </div>
      </div>

      {/* Simple / Kelly toggle */}
      <div className="flex justify-between gap-2 text-center w-42 mt-6">
        {Object.keys(midpointTypes).map((label) => (
          <div
            className={`cursor-pointer border rounded-md px-4 py-0.5 ${
              usingLinear !== (label === 'Relative')
                ? 'bg-gray-100/20 border-gray-400'
                : 'border-gray-500'
            }`}
            key={label}
            onClick={() => setUsingLinear(label === 'Linear')}
          >
            {label}
          </div>
        ))}
      </div>

      <h2 className="text-sm font-bold mb-4 text-gray-500 mt-12">
        Payout Calculations
      </h2>

      <div className="*:flex *:justify-between *:gap-4">
        <p>
          <b>Midpoint:</b>{' '}
          {usingLinear ? arithmeticMidpoint : round(relativeMidpoint * 100, 1)}%
        </p>
        <p className="text-xs text-gray-500">
          <b>Opposite:</b> {opposite}%
        </p>

        <p className="mt-6 text-xs text-gray-500">
          <b>Split:</b> {arithmeticMidpoint} : {opposite}
        </p>

        <p>
          <b>Normalized:</b>{' '}
          <span>
            {arithmeticMidpoint < 50 && <>1 : </>}
            <span className="cursor-help" title={`${round(normalized, 6)}`}>
              {round(normalized, 2)}
            </span>
            {arithmeticMidpoint >= 50 && <> : 1</>}
          </span>
        </p>

        <p className="text-xs mt-6 text-gray-500">
          <i>Expected Value:</i>+{round(leftEv * 100, 1)}%
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

import { useState } from 'react'

import { calcBet, type Label, round } from './calcBet'
import { ExpectedValue } from './ExpectedValue'

const midpointTypes = {
  Linear:
    'Simple average of both beliefs — gives equal expected value to each side.',
  Relative:
    'Balances the perceived % advantage for each person, based on how confident they are.',
}

export const ClickableClasses =
  'cursor-pointer border border-transparent hover:bg-gray-800/50 hover:border-gray-700 active:bg-gray-800 active:border-gray-700 rounded-md pt-1 pb-0.5 relative -ml-px'

export const Calculation = ({
  odds1,
  odds2,
}: {
  odds1: string
  odds2: string
}) => {
  const [usingLinear, setUsingLinear] = useState(false)
  const bet = calcBet(+odds1, +odds2)

  // Message if no bet
  if (!bet)
    return (
      <div className="opacity-30 italic h-74 pt-8">
        Enter odds for calculation
      </div>
    )

  const { labels } = bet
  const calculations = usingLinear ? bet.linear : bet.relative

  return (
    <div>
      {/* Payout */}
      <div className="flex justify-between gap-2 text-center w-52 mt-2">
        {[0, 1]
          .flatMap((i) => [
            // Left & Right Amounts
            <div className="flex flex-col items-center w-16" key={i}>
              <div>${round(calculations.amounts[i], 2)}</div> {/* Amount */}
              <Label label={labels[i]} /> {/* Label */}
            </div>,

            // Separator after 1st item
            !i && (
              <div className="text-xs text-gray-500 mt-1" key="sep">
                wager
              </div>
            ),
          ])
          .filter(Boolean)}
      </div>

      {/* Payout Calculations */}
      <h2 className="text-sm font-bold mb-4 text-gray-500 mt-12">
        Payout Calculations
      </h2>

      <div className="*:flex *:justify-between *:gap-4">
        <p className="items-end">
          {/* Midpoint Switcher */}
          <span
            className={`flex flex-col px-1.5 -left-1.5 ${ClickableClasses}`}
            onClick={() => setUsingLinear(!usingLinear)}
            title={midpointTypes[usingLinear ? 'Linear' : 'Relative']}
          >
            {/* Midpoint Label */}
            <span className="text-xs text-gray-500 cursor-pointer -mb-0.5">
              {usingLinear ? 'Linear' : 'Relative'}
            </span>
            {/* Midpoint */}
            <b>Midpoint:</b>
          </span>
          <span className="relative bottom-0.5">
            {round(calculations._midpoint * 100, 1)}%
          </span>
        </p>
        {/* Opposite */}
        <p className="text-xs text-gray-500">
          <b>Opposite:</b> {round(calculations.opposite * 100, 1)}%
        </p>

        {/* Split */}
        <p className="mt-6 text-xs text-gray-500">
          <b>Split:</b> {round(calculations._midpoint * 100, 1)} :{' '}
          {round(calculations.opposite * 100, 1)}
        </p>

        {/* Normalized */}
        <p>
          <b>Normalized:</b>{' '}
          <span>
            {calculations._midpoint < 0.5 && <>1 : </>}
            <span
              className="cursor-help"
              title={`${round(calculations.normalized, 6)}`}
            >
              {round(calculations.normalized, 2)}
            </span>
            {calculations._midpoint >= 0.5 && <> : 1</>}
          </span>
        </p>

        <ExpectedValue {...{ calculations, usingLinear }} />
      </div>
    </div>
  )
}

// Parameterize YES/NO labels
const colors = { NO: 'text-red-500/60', YES: 'text-green-500/50' }
const Label = ({ label }: { label: Label }) => (
  <div className={`text-sm ${colors[label]}`}>{label}</div>
)

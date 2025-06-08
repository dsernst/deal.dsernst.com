import { calcBet, type Label, round } from './calcBet'

export const Calculation = ({
  odds1,
  odds2,
}: {
  odds1: string
  odds2: string
}) => {
  const bet = calcBet(+odds1, +odds2)
  if (!bet)
    return (
      <div className="opacity-30 italic h-78 pt-8">
        Enter odds for calculation
      </div>
    )
  const {
    gcf,
    isReducible,
    leftAmount,
    leftEv,
    leftLabel,
    midpoint,
    normalized,
    opposite,
    reducedIsntNormalized,
    rightAmount,
    rightLabel,
  } = bet

  return (
    <div>
      <div className="flex justify-between gap-2 text-center w-42 mt-2">
        <div className="flex flex-col items-center">
          <div>${round(leftAmount, 2)}</div>
          <Label label={leftLabel} />
        </div>
        <div className="flex flex-col items-center">
          <div>${round(rightAmount, 2)}</div>
          <Label label={rightLabel} />
        </div>
      </div>

      <h2 className="text-sm font-bold mb-4 text-gray-500 mt-12">
        Payout Calculations
      </h2>

      <div className="*:flex *:justify-between *:gap-4">
        <p>
          <b>Midpoint:</b> {midpoint}%
        </p>
        <p className="text-xs text-gray-500">
          <b>Opposite:</b> {opposite}%
        </p>

        <p className="mt-6 text-xs text-gray-500">
          <b>Split:</b> {midpoint} : {opposite}
        </p>
        {isReducible && (
          <p className={reducedIsntNormalized ? 'text-xs text-gray-500' : ''}>
            <b>Reduced:</b> {midpoint / gcf} : {opposite / gcf}
          </p>
        )}

        {reducedIsntNormalized && (
          <p>
            <b>Normalized:</b>{' '}
            <span>
              {midpoint < 50 && <>1 : </>}
              <span className="cursor-help" title={`${round(normalized, 6)}`}>
                {round(normalized, 2)}
              </span>
              {midpoint >= 50 && <> : 1</>}
            </span>
          </p>
        )}

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

export const Calculation = ({
  odds1: odd1String,
  odds2: odd2String,
}: {
  odds1: string
  odds2: string
}) => {
  const odds1 = Number(odd1String)
  const odds2 = Number(odd2String)
  if (!odds1 || !odds2) return null
  if (odds1 === 0 || odds2 === 0) return null
  if (Number.isNaN(odds1) || Number.isNaN(odds2)) return null

  const midpoint = (odds1 + odds2) / 2
  const opposite = 100 - midpoint
  const gcf = gcd(midpoint, opposite)
  const reducedIsntNormalized = midpoint / gcf !== 1
  const normalized = midpoint < 50 ? opposite / midpoint : midpoint / opposite

  const leftLabel: Label = odds1 > odds2 ? 'YES' : 'NO'
  const rightLabel: Label = leftLabel === 'NO' ? 'YES' : 'NO'
  const leftAmount = midpoint < 50 && leftLabel === 'NO' ? normalized : 1
  const rightAmount = leftAmount === 1 ? normalized : 1

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

      <h2 className="text-lg font-bold mb-4 text-gray-500 mt-12">
        Calculation
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
        <p className={reducedIsntNormalized ? 'text-xs text-gray-500' : ''}>
          <b>Reduced:</b> {midpoint / gcf} : {opposite / gcf}
        </p>

        {reducedIsntNormalized && (
          <p>
            <b>Normalized:</b>{' '}
            <span>
              {1} :{' '}
              <span className="cursor-help" title={`${round(normalized, 6)}`}>
                {round(normalized, 2)}
              </span>
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

// Parameterize YES/NO labels
type Label = 'YES' | 'NO'
const colors = { YES: 'text-green-500/50', NO: 'text-red-500/50' }
const Label = ({ label }: { label: Label }) => (
  <div className={`text-sm ${colors[label]}`}>{label}</div>
)

/** Here’s a clean, simple TypeScript function to compute Greatest Common Factor (GCF), also called Greatest Common Divisor (GCD), using the Euclidean algorithm. 

gcd(48, 18) → 6 */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return Math.abs(a)
}

/** Round a number to a given number of decimal places.

round(3.14159265, 2)  → 3.14  
round(3.14159265, 4)  → 3.1416 */
export function round(value: number, digits: number): number {
  const factor = Math.pow(10, digits)
  return Math.round(value * factor) / factor
}

import { calcRandFairResult } from './async/calcRandFairResult'

export const Calculation = ({
  input1,
  input2,
  overlapOnly,
}: {
  input1: string
  input2: string
  overlapOnly: boolean
}) => {
  if (!input1 || !input2) return null

  const sellerMinAsk = Number(input1)
  const buyerMaxBid = Number(input2)

  const mpcResult = calcRandFairResult(sellerMinAsk, buyerMaxBid, overlapOnly)

  if (!mpcResult.hasOverlap) return <p>❌ No overlap, sorry</p>

  // If overlapOnly, just report that
  if (overlapOnly)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        seller_min ≤ buyer_max:
        <div className="text-2xl font-bold">✅ A deal is possible</div>
      </div>
    )

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      Random point between (seller_min, buyer_max):
      <div className="text-2xl font-bold">✅ {mpcResult.result!.toFixed(2)}</div>
    </div>
  )
}

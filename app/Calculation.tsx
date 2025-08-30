const randomFactor = Math.random() // Re-use across overlapOnly changes

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

  // Report when no overlap
  if (sellerMinAsk > buyerMaxBid) return <p>❌ No overlap, sorry</p>

  // If overlapOnly, just report that
  if (overlapOnly)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        seller_min ≤ buyer_max:
        <div className="text-2xl font-bold">✅ A deal is possible</div>
      </div>
    )

  // Otherwise, pick a random point in the overlap
  const spread = buyerMaxBid - sellerMinAsk
  const rand = randomFactor * spread
  const result = sellerMinAsk + rand

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      Random point between (seller_min, buyer_max):
      <div className="text-2xl font-bold">✅ {result.toFixed(2)}</div>
    </div>
  )
}

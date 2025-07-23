export const Calculation = ({
  input1,
  input2,
}: {
  input1: string
  input2: string
}) => {
  if (!input1 || !input2) return null

  const sellerMinAsk = Number(input1)
  const buyerMaxBid = Number(input2)

  if (sellerMinAsk > buyerMaxBid) return <p>❌ No overlap, sorry</p>

  const spread = buyerMaxBid - sellerMinAsk
  const rand = Math.random() * spread
  const result = sellerMinAsk + rand

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      Random point between (seller_min, buyer_max):
      <div className="text-2xl font-bold">✅ {result.toFixed(2)}</div>
    </div>
  )
}

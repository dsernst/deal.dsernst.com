export const Calculation = ({
  odds1,
  odds2,
}: {
  odds1: string
  odds2: string
}) => {
  if (!odds1 || !odds2) return null

  const midpoint = (Number(odds1) + Number(odds2)) / 2

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4 text-gray-500">Calculation</h2>
      <b>Midpoint:</b> {midpoint}%
    </div>
  )
}

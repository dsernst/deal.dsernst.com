import OddsInput from '../components/OddsInput'

export default async function Home({
  params,
}: {
  params: Promise<{ odds?: string[] }>
}) {
  // Ensure we always have two values, even if URL is partial
  const [odds1 = '', odds2 = ''] = (await params).odds || []

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Bet Calculator</h1>
      <p className="text-lg text-gray-400 mb-8">
        Calculate 2-person bets fast & fairly
      </p>

      {/* Odds inputs */}
      <OddsInput initialOdds={[odds1, odds2]} />
    </div>
  )
}

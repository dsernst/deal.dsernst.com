import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bet Calculator',
  description: 'Calculate 2-person bets fast & fairly',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'

import './globals.css'
import { description, title } from './constants'

export const metadata: Metadata = { description, title }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="dark" lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

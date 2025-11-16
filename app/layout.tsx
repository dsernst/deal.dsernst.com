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
      <body className="antialiased">
        <div
          className="min-h-screen p-8 pt-4 flex flex-col items-center justify-center"
          style={{ minHeight: '100dvh' }} // ignore iOS bottom bar
        >
          <h1 className="text-4xl font-bold mb-1">{title}</h1>
          <p className="text-lg text-gray-400 mb-8">{description}</p>

          {/* Content */}
          {children}
        </div>
      </body>
    </html>
  )
}

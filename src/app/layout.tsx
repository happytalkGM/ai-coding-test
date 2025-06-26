import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Tool Configuration',
  description: 'Tool configuration for LLM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}

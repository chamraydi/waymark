import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Waymark — Adventure, Verified',
  description: 'The first adventure platform where every check-in is verified by a real human, powered by World ID.',
  metadataBase: new URL('https://waymark.vercel.app'),
  openGraph: {
    title: 'Waymark — Adventure, Verified',
    description: 'Real trails. Real humans. Verified on World.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

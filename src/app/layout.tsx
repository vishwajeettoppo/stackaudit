import type { Metadata } from 'next'
import { Inter, Manrope, Work_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-worksans',
})



export const metadata:Metadata = {
  title: 'AI Spend Audit - Optimize Your AI Tool Stack',
  description: 'Find hidden savings in your AI subscriptions. Audit ChatGPT, Copilot, Cursor, and more.',
  openGraph: {
    title: 'AI Spend Audit',
    description: 'Find savings in your AI tool stack',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit',
    description: 'Find savings in your AI tool stack',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${workSans.variable}`}>
      <body className="antialiased selection:bg-primary/10 selection:text-primary">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
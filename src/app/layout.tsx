import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KubeCon 2024 Booth Demo',
  description: 'DevZero KubeCon 2024 Booth Demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
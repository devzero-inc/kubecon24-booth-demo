'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        {isMounted ? children : null}
      </body>
    </html>
  )
}
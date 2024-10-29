'use client'

import { useState, useEffect } from 'react'

export default function SafeClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Or a loading skeleton
  }

  return <>{children}</>
}
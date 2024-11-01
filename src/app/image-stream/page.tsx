import { Suspense } from 'react'
import { ImageStream } from '@/components/ImageStream'
import { getImageData } from '@/lib/data'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60 // Revalidate this page every 60 seconds

async function InitialImagesFetch() {
  const result = await getImageData(1, 20) // Fetch first 20 images
  if (!result) {
    return {
      notFound: true,
    }
  }
  return <ImageStream initialImages={result.images} initialPagination={result.pagination} />
}

export default function ImageStreamPage() {
  return (
    <main className="min-h-screen bg-black relative">
        {/* Logo Container */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12 z-10">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 rounded-full" />
                <Image
                src="https://cdn.prod.website-files.com/659f77ad8e06050cc27ed4d3/662945e3d47abbc448cd338e_Full%20logo%20(colored%20on%20dark).svg"
                alt="Company Logo"
                width={140}
                height={42}
                priority
                className="w-auto h-8 md:h-10 relative transition-transform duration-500 group-hover:scale-105"
                />
            </div>
        </div>
      <nav className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-full text-white hover:bg-zinc-800 transition-colors"
          aria-label="Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-24 max-w-7xl h-screen flex flex-col">
        <h1 className="text-5xl font-light text-white mb-6 animate-fade-in-up text-center">
          DevZero LEGO Minifigure
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Sweepstakes
          </span>
        </h1>
        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <InitialImagesFetch />
        </Suspense>
      </div>
    </main>
  )
}
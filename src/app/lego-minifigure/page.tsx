import { ImageUploader } from '../../components/ImageUploader'
import Link from 'next/link'
import Image from 'next/image'

export default function LegoMinifigure() {
  return (
    <main className="min-h-screen bg-black text-white">
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

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 p-6">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900 rounded-lg text-white hover:bg-zinc-800 transition-colors font-light"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-light">Lego Minifigure Generator</h1>
            <p className="text-gray-400 font-light">
              Upload your photo or take a picture to generate your personalized LEGO minifigure
            </p>
          </div>
          
          <ImageUploader />
        </div>
      </div>
    </main>
  )
}
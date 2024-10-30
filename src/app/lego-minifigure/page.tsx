import { ImageUploader } from '../../components/ImageUploader'
import Link from 'next/link'

export default function LegoMinifigure() {
  return (
    <main className="min-h-screen bg-black text-white">
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
          <span>Back to Home</span>
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
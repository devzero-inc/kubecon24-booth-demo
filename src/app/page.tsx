import Link from 'next/link'
import Image from 'next/image'
import { CalendlyModal } from "@/components/calendly-modal"
import { Gift } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Logo Container */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
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

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-light">
              Welcome to
              <br />
              DevZero
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Explore our various initiatives below.
            </p>
          </div>

          <nav className="grid gap-4">
          <Link 
              href="https://www.linkedin.com/company/devzerohq/events/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light mb-2">Win a LEGO Set</h2>
                  <p className="text-white font-light">Signup for a demo session to win a full LEGO set (Hogwarts, Infinity Gauntlet, Titanic).</p>
                </div>
                <Gift className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">
                DEMO
              </div>
            </Link>

            <CalendlyModal />

            <Link 
              href="/kubecon-booth" 
              className="group p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light mb-2">KubeCon Booth</h2>
                  <p className="text-gray-400 font-light">Visit booth T41 at KubeCon 2024 and learn more about our platform.</p>
                </div>
                <svg 
                  className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link 
              href="/lego-minifigure" 
              className="group p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light mb-2">Personalized LEGO Minifigure</h2>
                  <p className="text-gray-400 font-light">Something for your desk to remember us after KubeCon.</p>
                </div>
                <svg 
                  className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link 
              href="/image-stream" 
              className="group p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light mb-2">Sweepstakes Submissions</h2>
                  <p className="text-gray-400 font-light">See what LEGO Minifigures others are creating!</p>
                </div>
                <svg 
                  className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link 
              href="https://devzero.io" 
              target="_blank"
              className="group p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light mb-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                      devzero.io
                    </span>
                  </h2>
                  <p className="text-gray-400 font-light">Check out our website.</p>
                </div>
                <svg 
                  className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  )
}
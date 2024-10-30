import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
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
                  <h2 className="text-2xl font-light mb-2">Personalized Lego Minifigure</h2>
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
              href="https://devzero.io" 
              className="group p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light mb-2">Visit devzero.io</h2>
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
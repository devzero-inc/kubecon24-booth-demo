import { LandingForm } from '../../components/LandingForm'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
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

      {/* Navigation Bar */}
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

      {/* Main Content */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-black p-12 lg:p-24 flex items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-light text-white mb-6 animate-fade-in-up">
              Build something
              <br />
              extraordinary
            </h1>
            <p className="text-xl font-light text-gray-400 mb-8 animate-fade-in-up animation-delay-200">
              Create stunning software with DevZero&apos;s modern platform designed to make it easier for developers to focus on what they love to do, build software.
            </p>
            <div className="space-y-4 animate-fade-in-up animation-delay-400">
              <div className="flex items-center space-x-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Your favorite tools, transported to the modern age</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Pay for what you use, not for when things stay idle</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Enterprise-grade security and 24/7 dedicated support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-zinc-900 p-12 lg:p-24 flex items-center justify-center">
          <LandingForm />
        </div>
      </div>
    </main>
  )
}
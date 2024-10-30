import { LandingForm } from '../../components/LandingForm'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Navigation Bar */}
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
              Create stunning software with DevZero's modern platform designed to make it easier for developers to focus on what they love to do, build software.
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
import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              Built with <span className="text-red-500">❤️</span> by DevZero
            </p>
            <p className="text-xs text-gray-500 mt-1">
              And currently served directly from a DevZero environment
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="https://github.com/devzero-inc/kubecon24-booth-demo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-gray-400"
            >
              <Github className="w-6 h-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link 
              href="https://www.linkedin.com/company/devzerohq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-gray-400"
            >
              <Linkedin className="w-6 h-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
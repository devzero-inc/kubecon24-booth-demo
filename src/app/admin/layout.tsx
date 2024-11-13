import { ReactNode } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <Link 
            href="/admin/demo-submissions" 
            className="block py-2 px-4 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          >
            Demo Submissions
          </Link>
          <Link 
            href="/admin/kubecon-booth" 
            className="block py-2 px-4 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          >
            KubeCon Booth
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
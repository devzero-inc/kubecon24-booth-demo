'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Submission {
  _id: string
  name: string
  email: string
  company: string
  jobTitle: string
  options: string[]
  createdAt: string
}

export default function DemoSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/demo-submissions')
      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }
      const data = await response.json()
      setSubmissions(data)
    } catch (err) {
      setError('An error occurred while fetching submissions')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/admin')
  }

  if (isLoading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Demo Submissions</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Company</th>
              <th className="py-2 px-4 border-b text-left">Job Title</th>
              <th className="py-2 px-4 border-b text-left">Options</th>
              <th className="py-2 px-4 border-b text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td className="py-2 px-4 border-b">{submission.name}</td>
                <td className="py-2 px-4 border-b">{submission.email}</td>
                <td className="py-2 px-4 border-b">{submission.company}</td>
                <td className="py-2 px-4 border-b">{submission.jobTitle}</td>
                <td className="py-2 px-4 border-b">{submission.options.join(', ')}</td>
                <td className="py-2 px-4 border-b">{new Date(submission.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
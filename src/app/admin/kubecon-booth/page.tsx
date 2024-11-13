'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

interface Submission {
  _id: string
  firstName: string
  lastName: string
  companyName: string
  email: string
  address: string
  phone: string
  originalImage: string
  generatedImage: string
  createdAt: string
}

export default function KubeConBoothPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Fetching submissions...')
      const response = await fetch('/api/admin/submissions')
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.statusText}`)
      }
      const data = await response.json()
      console.log('Submissions fetched successfully:', data.length)
      setSubmissions(data)
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError('An error occurred while fetching submissions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (base64Image: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = `data:image/jpeg;base64,${base64Image}`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading submissions...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchSubmissions}>Retry</Button>
      </div>
    )
  }

  if (submissions.length === 0) {
    return <div className="text-center p-8">No submissions found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">KubeCon Booth Submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Company</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Address</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>
              <th className="py-2 px-4 border-b text-left">Original Image</th>
              <th className="py-2 px-4 border-b text-left">Generated Image</th>
              <th className="py-2 px-4 border-b text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td className="py-2 px-4 border-b">{`${submission.firstName} ${submission.lastName}`}</td>
                <td className="py-2 px-4 border-b">{submission.companyName}</td>
                <td className="py-2 px-4 border-b">{submission.email}</td>
                <td className="py-2 px-4 border-b">{submission.address}</td>
                <td className="py-2 px-4 border-b">{submission.phone}</td>
                <td className="py-2 px-4 border-b">
                  <div className="relative w-20 h-20">
                    <Image
                      src={`data:image/jpeg;base64,${submission.originalImage}`}
                      alt="Original Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    onClick={() => handleDownload(submission.originalImage, `original_${submission._id}.jpg`)}
                    className="mt-2 text-xs"
                  >
                    Download
                  </Button>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="relative w-20 h-20">
                    <Image
                      src={`data:image/jpeg;base64,${submission.generatedImage}`}
                      alt="Generated Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    onClick={() => handleDownload(submission.generatedImage, `generated_${submission._id}.jpg`)}
                    className="mt-2 text-xs"
                  >
                    Download
                  </Button>
                </td>
                <td className="py-2 px-4 border-b">{new Date(submission.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, RefreshCw, X, ArrowRight } from "lucide-react"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

type Stage = 'upload' | 'analyzing' | 'generating' | 'complete'

interface FormData {
  firstName: string
  lastName: string
  companyName: string
  email: string
  address: string
  phone: string
}

export function ImageUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('upload')
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    address: '',
    phone: ''
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result as string
        const base64 = base64String.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const processImage = async (file: File) => {
    try {
      setError(null)
      setStage('analyzing')
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      const base64Image = await getBase64(file)

      const descriptionResponse = await fetch('/api/describe-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Image,
          mimeType: file.type
        }),
      })
      
      if (!descriptionResponse.ok) throw new Error('Failed to analyze image')
      
      const { description } = await descriptionResponse.json()
      setDescription(description)

      setStage('generating')
      const generateResponse = await fetch('/api/generate-lego', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      })

      if (!generateResponse.ok) throw new Error('Failed to generate image')

      const { url } = await generateResponse.json()
      setGeneratedImage(url)
      setStage('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStage('upload')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      await processImage(file)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processImage(file)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          imageUrl: uploadedImage,
          generatedImageUrl: generatedImage,
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to submit form')
      }
  
      const result = await response.json()
      
      if (result.success) {
        setShowForm(false)
        // You might want to show a success message or redirect here
      } else {
        throw new Error(result.error || 'Failed to submit form')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form')
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      {stage === 'upload' && (
        <div
          className={cn(
            "border-2 border-dashed border-zinc-700 rounded-lg p-12 transition-colors",
            isDragging && "border-white bg-zinc-900/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </Button>
            <p className="text-sm text-gray-400">
              or drag and drop your image here
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {(stage === 'analyzing' || stage === 'generating') && (
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-lg font-light">
            {stage === 'analyzing' ? 'Analyzing your photo...' : 'Creating your LEGO minifigure...'}
          </p>
        </div>
      )}

      {/* Results Display */}
      {uploadedImage && stage !== 'upload' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-light">Original Photo</h3>
            <div className="relative aspect-square">
              <Image
                src={uploadedImage}
                alt="Original photo"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            {description && (
              <div className="bg-zinc-900 p-4 rounded-lg">
                <p className="text-sm text-gray-400 font-light">{description}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-light">LEGO Minifigure</h3>
            <div className="relative aspect-square bg-zinc-900 rounded-lg">
              {generatedImage && (
                <Image
                  src={generatedImage}
                  alt="Generated LEGO minifigure"
                  fill
                  className="object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {stage === 'complete' && (
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => {
              setStage('upload')
              setUploadedImage(null)
              setGeneratedImage(null)
              setDescription(null)
            }} 
            className="space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Another Photo</span>
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="space-x-2 bg-white text-black hover:bg-gray-200"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 rounded-lg p-8 max-w-md w-full space-y-6 relative"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-2xl font-light text-white mb-2">Submit Your LEGO Minifigure</h3>
                <p className="text-gray-400 text-sm">Please provide your shipping details</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-200">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      placeholder="John"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-200">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      placeholder="Doe"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-200">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    placeholder="Acme Corporation"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="john.doe@example.com"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-200">Shipping Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="123 Main St, City, Country"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-200">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200 transition-colors mt-6"
                >
                  Submit
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-center">
          <p className="mb-3">{error}</p>
          <Button 
            onClick={() => {
              setError(null)
              setStage('upload')
            }}
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
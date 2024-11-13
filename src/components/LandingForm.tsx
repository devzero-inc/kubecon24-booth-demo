'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import SafeClientWrapper from './safe-client-wrapper'

export function LandingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    setSuccess(false);
    setError('');

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const companyName = formData.get('companyName') as string
    const jobTitle = formData.get('jobTitle') as string
    const email = formData.get('email') as string
    const options = formData.getAll('options') as string[]

    const formValues = {
      name: `${firstName} ${lastName}`,
      email,
      company: companyName,
      jobTitle: jobTitle,
      options
    }

    try {
      const response = await fetch('/api/submit-landing-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Form submission successful:', data)
        setSuccess(true)
        setError('') // Clear any existing error

        // Reset the form
        const formElement = e.target as HTMLFormElement;
        formElement.reset();
        
        setSubmitMessage(data.message);
      } else {
        console.error('Form submission failed:', data)
        setSuccess(false) // Ensure success is false
        setError(data.error || 'An error occurred. Please try again.')
        setSubmitMessage(data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSuccess(false) // Ensure success is false
      setError('An error occurred. Please try again.')
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false)
    }
  }

  const options = [
    { id: "option1", label: "Dev Environments (with Docker)" },
    { id: "option2", label: "Dev Environments (with Kubernetes)" },
    { id: "option3", label: "Developer Experience Index (DXI)" },
    { id: "option4", label: "GitHub Actions (just faster and cheaper)" },
  ]

  return (
    <SafeClientWrapper>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-light text-white">DevZero @ KubeCon 2024</h2>
          <p className="text-gray-400 font-light">Fill out the form below to get an email with details about the demo you watched</p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-200 text-sm font-light">First Name</Label>
              <Input 
                id="firstName" 
                name="firstName" 
                placeholder="John" 
                required 
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:border-transparent font-light" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-200 text-sm font-light">Last Name</Label>
              <Input 
                id="lastName" 
                name="lastName" 
                placeholder="Doe" 
                required 
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:border-transparent font-light" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-200 text-sm font-light">Company Name</Label>
            <Input 
              id="companyName" 
              name="companyName" 
              placeholder="Acme Inc." 
              required 
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:border-transparent font-light" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-gray-200 text-sm font-light">Job Title</Label>
            <Input 
              id="jobTitle" 
              name="jobTitle" 
              placeholder="Staff Technophilosopher" 
              required 
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:border-transparent font-light" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200 text-sm font-light">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="john@example.com" 
              required 
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:border-transparent font-light" 
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-gray-200 text-sm font-light">Learn more about:</Label>
            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={option.id} 
                    name="options" 
                    value={option.id} 
                    className="border-zinc-700 data-[state=checked]:bg-white data-[state=checked]:text-black" 
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-light text-gray-200"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-white text-black hover:bg-gray-200 transition-colors" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Get More Details'}
        </Button>

        {error && (
          <p className="text-sm text-center text-red-500 bg-zinc-800 rounded-lg py-2 px-4">
            {error}
          </p>
        )}

        {success && (
          <div className="text-sm text-center text-green-500 bg-zinc-800 rounded-lg py-2 px-4">
            <p>Thank you for your interest!</p>
            <p>We'll email you soon.</p>
          </div>
        )}
      </form>
    </SafeClientWrapper>
  )
}
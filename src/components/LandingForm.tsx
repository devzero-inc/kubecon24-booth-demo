'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { submitForm } from '../app/actions'
import SafeClientWrapper from './safe-client-wrapper'

export function LandingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    const formData = new FormData(event.currentTarget)
    const result = await submitForm(formData)

    setIsSubmitting(false)
    setSubmitMessage(result.message)
  }

  const options = [
    { id: "option1", label: "Dev Environments (with Docker)" },
    { id: "option1", label: "Dev Environments (with Kubernetes)" },
    { id: "option3", label: "Developer Experience Index" },
    { id: "option4", label: "GitHub Actions - faster and cheaper" },
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

        {submitMessage && (
          <p className="text-sm text-center text-gray-200 bg-zinc-800 rounded-lg py-2 px-4">
            {submitMessage}
          </p>
        )}
      </form>
    </SafeClientWrapper>
  )
}
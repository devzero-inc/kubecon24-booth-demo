'use client'

import { useState, useEffect } from "react"
import { Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CalendlyModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="group p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light mb-2">LEGO Minifigure and a LEGO Office Set</h2>
              <p className="text-gray-400 font-light">Book a meeting with the team to get both!</p>
            </div>
            <Calendar className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <div 
          className="calendly-inline-widget w-full h-full"
          data-url="https://calendly.com/d/cppv-8t7-rwq/meet-the-devzero-team-post-kubecon?month=2024-11"
        />
      </DialogContent>
    </Dialog>
  )
}
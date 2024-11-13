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
        <div className="group p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer border-2 border-green-500 hover:border-green-400">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light mb-2 text-white">Schedule a Meeting</h2>
              <p className="text-gray-400 font-light">Meet the DevZero Team Post-KubeCon</p>
            </div>
            <Calendar className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Meet the DevZero Team Post-KubeCon</DialogTitle>
        </DialogHeader>
        <div 
          className="calendly-inline-widget w-full h-full"
          data-url="https://calendly.com/d/cppv-8t7-rwq/meet-the-devzero-team-post-kubecon?month=2024-11"
        />
      </DialogContent>
    </Dialog>
  )
}
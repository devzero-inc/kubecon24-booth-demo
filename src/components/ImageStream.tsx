'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ImageData {
  id: string
  imageData: string
  createdAt: string
}

interface PaginationData {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  lastKey?: string
}

interface ImageStreamProps {
  initialImages: ImageData[]
  initialPagination: PaginationData
}

export function ImageStream({ initialImages, initialPagination }: ImageStreamProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages)
  const [pagination, setPagination] = useState<PaginationData>(initialPagination)
  const containerRef = useRef<HTMLDivElement>(null)
  const innerContainerRef = useRef<HTMLDivElement>(null)

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`/api/images?limit=10${pagination.lastKey ? `&lastKey=${pagination.lastKey}` : ''}`)
      if (!response.ok) throw new Error('Failed to fetch images')
      const data = await response.json()
      
      setImages(prevImages => {
        const newImages = data.images.filter(newImg => 
          !prevImages.some(existingImg => existingImg.id === newImg.id)
        )
        return [...prevImages, ...newImages]
      })
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch images:', error)
    }
  }, [pagination.lastKey])

  useEffect(() => {
    const intervalId = setInterval(fetchImages, 5000) // Fetch every 5 seconds
    return () => clearInterval(intervalId)
  }, [fetchImages])

  useEffect(() => {
    const container = containerRef.current
    const innerContainer = innerContainerRef.current
    if (!container || !innerContainer) return

    let animationFrameId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // Adjust this value to change scroll speed

    const animate = () => {
      scrollPosition += scrollSpeed
      const containerHeight = container.offsetHeight
      const contentHeight = innerContainer.scrollHeight / 2

      if (scrollPosition >= contentHeight) {
        scrollPosition = 0
        innerContainer.style.transform = `translateY(0px)`
      } else {
        innerContainer.style.transform = `translateY(-${scrollPosition}px)`
      }

      // Clone and append images when nearing the end
      if (contentHeight - scrollPosition < containerHeight * 2) {
        const clonedImages = Array.from(innerContainer.children)
          .slice(0, Math.ceil(containerHeight / 200) * 4)
          .map(child => child.cloneNode(true))
        clonedImages.forEach(clone => innerContainer.appendChild(clone))
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [images])

  const getRandomSize = useCallback(() => {
    return Math.random() < 0.3 ? 'large' : 'small'
  }, [])

  return (
    <div ref={containerRef} className="h-[calc(100vh-8rem)] overflow-hidden relative">
      <div 
        ref={innerContainerRef}
        className="transition-transform duration-100 ease-linear"
        style={{ willChange: 'transform' }}
      >
        <div className="grid grid-cols-4 auto-rows-[200px] gap-4">
          {images.map((image, index) => {
            const size = getRandomSize()
            return (
              <motion.div
                key={`${image.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className={`relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out ${
                  size === 'large' ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <Image
                  src={image.imageData}
                  alt={`LEGO Minifigure ${image.id}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm">
                    Created: {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
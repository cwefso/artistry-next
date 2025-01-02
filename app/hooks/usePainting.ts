"use client"

import { useState, useEffect } from 'react'

// Define a Painting type based on your API response structure
interface Painting {
  id: number
  title: string
  artistName: string
  imageUrl: string
  year: number
}

const usePainting = (url: string) => {
  const [painting, setPainting] = useState<Painting | null>(null)

  useEffect(() => {
    const loadPainting = async () => {
        try {
          const response = await fetch(`https://corsproxy.io/?url=${url}`)
          const result = await response.json()
          setPainting(result[0]) // Log to inspect the response structure
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Error fetching painting:", err.message)
          } else {
            console.error("An unknown error occurred")
          }
        }
      }
    loadPainting()
  }, [url])

  return { painting }
}

export default usePainting

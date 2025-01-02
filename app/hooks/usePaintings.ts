import { useState, useEffect } from 'react'

// Define a Painting type based on your API response structure
interface Painting {
  id: number
  title: string
  artistName: string
  imageUrl: string
  year: number
  // Add other fields based on the actual API response
}

interface PaintingApiResponse {
  // Assuming the API returns an array of paintings, adjust based on actual response
  data: Painting[]
}

const usePaintings = (initialUrl: string) => {
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [url, setUrl] = useState<string>(initialUrl)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  // Fisher-Yates shuffle algorithm to shuffle the array
  const shuffleArray = (array: Painting[]): Painting[] => {
    let shuffledArray = [...array] // Create a shallow copy to avoid mutating the original
    const n = shuffledArray.length
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)) // j is a number, valid for array indexing
      // Swap elements: Ensure that we're swapping correctly by accessing indices i and j
      const temp = shuffledArray[i]
      shuffledArray[i] = shuffledArray[j]
      shuffledArray[j] = temp
    }
    return shuffledArray
  }

  useEffect(() => {
    setError(false)
    setLoading(true)

    const loadPaintings = () => {
      fetch('https://fe-cors-proxy.herokuapp.com', {
        headers: {
          'Target-URL': url
        }
      })
        .then((res) => res.json())
        .then((result: PaintingApiResponse) => {
          const shuffled = shuffleArray(result.data) // Shuffling the array
          setPaintings(shuffled)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err.message)
          setLoading(false)
          setError(true)
        })
    }

    loadPaintings()
  }, [url])

  return {
    paintings, setUrl, loading, error
  }
}

export default usePaintings

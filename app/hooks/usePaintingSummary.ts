import { useState, useEffect } from 'react'

// Define the expected structure of the painting details returned from the API
interface PaintingDetails {
  id: number
  title: string
  artistName: string
  imageUrl: string
  year: number
  // Add any other fields that are relevant to the painting details you expect
}

const usePaintingSummary = (contentId: string | number) => {
  const [paintingDetails, setPaintingDetails] = useState<PaintingDetails | null>(null)

  useEffect(() => {
    const getPaintingDetails = () => {
      fetch('https://fe-cors-proxy.herokuapp.com', {
        headers: {
          'Target-URL': `http://www.wikiart.org/en/App/Painting/ImageJson/${contentId}`
        }
      })
        .then((res) => res.json())
        .then((res: PaintingDetails) => setPaintingDetails(res)) // Set the painting details correctly
        .catch((err) => console.log(err))
    }
    
    if (contentId) {
      getPaintingDetails()
    }
  }, [contentId])

  return paintingDetails
}

export default usePaintingSummary

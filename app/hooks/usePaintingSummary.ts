import { useState, useEffect } from 'react'
import { PaintingInformation } from '../types'

const usePaintingSummary = (contentId: string | number | null) => {
  const [paintingDetails, setPaintingDetails] = useState<PaintingInformation | null>(null)

  const url =  `http://www.wikiart.org/en/App/Painting/ImageJson/${contentId}`

  useEffect(() => {
    const getPaintingDetails = () => {
      fetch(`https://corsproxy.io/?url=${url}`)
        .then((res) => res.json())
        .then((res: PaintingInformation) => setPaintingDetails(res)) // Set the painting details correctly
        .catch((err) => console.log(err))
    }
    
    if (contentId) {
      getPaintingDetails()
    }
  }, [contentId, url])
  return paintingDetails
}

export default usePaintingSummary

import { useState, useEffect } from 'react'

interface PaintingInfo {
  id: number
  title: string
  artistName: string
  imageUrl: string
  year: number
  // Add other fields based on the actual API response (e.g., description, medium, etc.)
}

interface PaintingInfoResponse {
  data: PaintingInfo[]
}

const usePaintingInfo = (title: string, artistName: string): PaintingInfo | null => {
  const [info, setInfo] = useState<PaintingInfo | null>(null)

  useEffect(() => {
    const loadPaintingInfo = () => {
      fetch('https://fe-cors-proxy.herokuapp.com', {
        headers: {
          'Target-URL': `https://www.wikiart.org/en/api/2/PaintingSearch?term=[${artistName} ${title}]`
        }
      })
        .then((res) => res.json())
        .then((result: PaintingInfoResponse) => {
          if (result.data && result.data.length > 0) {
            setInfo(result.data[0])
          } else {
            setInfo(null)
          }
        })
        .catch((err) => console.log(err.message))
    }

    loadPaintingInfo()
  }, [artistName, title])

  return info
}

export default usePaintingInfo

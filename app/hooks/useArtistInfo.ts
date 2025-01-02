import { useState, useEffect } from 'react'

// Define a general interface for the response from the API (adjust fields as needed)
interface ArtistInfo {
  id: number
  name: string
  bio: string
  imageUrl: string
  // Add any other fields based on the actual API response
}

interface ArtistInfoResponse {
  data: ArtistInfo[]
}

const useArtistInfo = (artistId: string): ArtistInfo[] => {
  const [artistInfo, setArtistInfo] = useState<ArtistInfo[]>([])

  useEffect(() => {
    const loadArtistInfo = () => {
      fetch('https://fe-cors-proxy.herokuapp.com', {
        headers: {
          'Target-URL': `https://www.wikiart.org/en/api/2/PaintingsByArtist?id=[${artistId}]`
        }
      })
        .then((res) => res.json())
        .then((result: ArtistInfoResponse) => setArtistInfo(result.data))
        .catch((err) => console.log(err.message))
    }

    loadArtistInfo()
  }, [artistId])

  return artistInfo
}

export default useArtistInfo

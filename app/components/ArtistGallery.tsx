import React from "react";
import Link from "next/link";
import usePaintings from "../hooks/usePaintings";
import Gallery from "./Gallery";

interface Painting {
  id: number;
  title: string;
  artistName: string;
  imageUrl: string;
  year: number;
  // Add other fields based on the actual API response
}

// Define the type for the props of the component
interface ArtistGalleryProps {
  info: {
    artistName: string;
  };
  getUserFavorites: () => void;
  setSelected: (painting: Painting) => void;
}

const ArtistGallery: React.FC<ArtistGalleryProps> = (props) => {
  const { artistName } = props.info;
  let url: string | undefined = undefined;

  // Generate the URL based on artistName
  if (artistName) {
    if (artistName.includes(".")) {
      url = artistName.replace(/\s/g, "").replace(/\./g, "-").toLowerCase();
    } else {
      url = artistName.replace(/\s+/g, "-").replace(/\./g, "-").toLowerCase();
    }
  }

  // Fetch paintings using the custom hook
  const { paintings } = usePaintings(
    `http://www.wikiart.org/en/App/Painting/PaintingsByArtist?artistUrl=${url}&json=2`
  );

  return (
    <section className="painter-page">
      <section className="painter-nav">
        <Link href="/" passHref>
          <h1 className="painting-page-title" data-testid="ArtisTry">
            ArtisTry
          </h1>
        </Link>
        <h1 className="artist-page-name" data-testid={artistName}>
          {artistName}
        </h1>
        <Link href="/user-gallery" passHref>
          <button
            type="button"
            className="my-gallery-btn"
            onClick={props.getUserFavorites}
          >
            My Gallery
          </button>
        </Link>
      </section>
      <section aria-label="gallery">
        <Gallery paintings={paintings} setSelected={props.setSelected} />
      </section>
    </section>
  );
};

export default ArtistGallery;

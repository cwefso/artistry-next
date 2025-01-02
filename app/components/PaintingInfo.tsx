import React, { useState, useEffect } from "react";
import { Link } from "next/link"; // Use Next.js Link for routing
import "./PaintingInfo.css";
import selectedTagBtn from "../assets/selectedTag.png";
import unselectedTagBtn from "../assets/unselectedTag.png";
import usePaintingInfo from "../Hooks/usePaintingInfo";
import usePaintingSummary from "../Hooks/usePaintingSummary";

interface PaintingInfoProps {
  favorites: {
    userFavs: { contentId: string }[]; // Array of favorite painting objects
  };
  paintingInfo: {
    contentId: string;
    title: string;
    image: string;
    artistName: string;
    completitionYear: number;
    artistContentId?: number;
    yearAsString?: string;
    width?: number;
    height?: number;
  };
  getUserFavorites?: () => void;
  setSelected?: (painting: any) => void;
}

const PaintingInfo: React.FC<PaintingInfoProps> = (props) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { title, image, completitionYear, artistName, contentId } =
    props.paintingInfo;
  const { userFavs } = props.favorites;
  const data = usePaintingInfo(title, artistName);
  const [paintings, setPaintings] = useState<any[]>([]);
  const [paintingDetails, setPaintingDetails] = useState<any>({});
  const tagBtn = isFavorite ? selectedTagBtn : unselectedTagBtn;
  const paintingSummary = usePaintingSummary(contentId);
  const { style, description, technique, period, galleryName } =
    paintingSummary;

  const toggleFavs = () => {
    setIsFavorite(!isFavorite);
    isFavorite ? deleteFromFavs(contentId) : addToFavs();
  };

  const addToFavs = () => {
    const {
      title,
      contentId,
      artistContentId,
      artistName,
      completitionYear,
      yearAsString,
      width,
      image,
      height,
    } = props.paintingInfo;

    const check = (data: any) => data || "none";

    fetch(
      "https://artistry-backend-o9f8uj2f0-charles-wefsos-projects.vercel.app/api/v1/favorites",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: check(title),
          contentId: check(contentId),
          artistContentId: check(artistContentId),
          artistName: check(artistName),
          completitionYear: check(completitionYear),
          yearAsString: check(yearAsString),
          width: check(width),
          image: check(image),
          height: check(height),
          name: "image",
        }),
      }
    );
  };

  const deleteFromFavs = (contentId: string) => {
    fetch(
      `https://artistry-backend-o9f8uj2f0-charles-wefsos-projects.vercel.app/api/v1/favorites/${contentId}`,
      {
        method: "DELETE",
      }
    );
  };

  useEffect(() => {
    if (userFavs) {
      const isPaintingAFav = userFavs.find(
        (favorite) => favorite.contentId === contentId
      );
      if (isPaintingAFav) {
        setIsFavorite(true);
      }
    }
  }, [contentId, userFavs]);

  return (
    <section className="painting-page">
      <section className="painting-nav">
        <Link href="/" passHref>
          <h1 aria-label="home button" className="painting-page-title">
            ArtisTry
          </h1>
        </Link>
        <h1 className="painting-title">{title}</h1>
        <img
          src={tagBtn}
          alt="save-btn"
          className="save-btn"
          onClick={toggleFavs}
        />
      </section>
      <section className="painting-data-container">
        <section className="painting-box">
          <img className="artwork" src={image} alt={title} />
          <p className="completion-year">
            Year Completed:
            {completitionYear}
          </p>
        </section>
        <section className="details-container">
          <Link href={`/artists-gallery`} aria-label="artist-gallery" passHref>
            <p className="artist-btn">{artistName}</p>
          </Link>
          {style ? (
            <section className="artwork-details">
              {style && (
                <>
                  <p className="detail-title">Movement</p>
                  <p>{style}</p>
                </>
              )}
              {description && (
                <>
                  <p className="detail-title">Description</p>
                  <p className="summary">{description}</p>
                </>
              )}
              {technique && (
                <>
                  <p className="detail-title">Technique</p>
                  <p>{technique}</p>
                </>
              )}
              {period && (
                <>
                  <p className="detail-title">Period</p>
                  <p>{period}</p>
                </>
              )}
              {galleryName && (
                <>
                  <p className="detail-title-location">Location</p>
                  <p className="detail-location">{galleryName}</p>
                </>
              )}
            </section>
          ) : (
            <p className="loading-details-message">
              Loading Painting Details...
            </p>
          )}
        </section>
      </section>
    </section>
  );
};

export default PaintingInfo;

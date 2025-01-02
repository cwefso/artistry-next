import React, { useState, useEffect } from "react";
import Link from "next/link";
import usePaintings from "../hooks/usePaintings";
import Gallery from "./Gallery";
import randomTerms from "./randomTerms.js";

interface RandomArtProps {
  setSelected: (painting: any) => void;
  getUserFavorites?: () => void;
}

const RandomArt: React.FC<RandomArtProps> = (props) => {
  // Random word generator function
  const getRandomWord = () => {
    return randomTerms[Math.floor(Math.random() * randomTerms.length)];
  };

  // Call to usePaintings hook with random term
  const { paintings, loading, error } = usePaintings(
    `http://www.wikiart.org/en/search/${getRandomWord()}/1?json=2`
  );

  return (
    <section className="painter-page">
      <section className="painter-nav">
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 aria-label="home button" className="painting-page-title">
            ArtisTry
          </h1>
        </Link>
        <section>
          <Link href="/user-gallery" style={{ textDecoration: "none" }}>
            <button className="my-gallery-btn" onClick={props.getUserFavorites}>
              My Gallery
            </button>
          </Link>
        </section>
      </section>
      <section aria-label="gallery">
        {!error && paintings.length > 0 && (
          <Gallery paintings={paintings} setSelected={props.setSelected} />
        )}
        {error && <p>WHAT DID YOU DO!?</p>}
      </section>
    </section>
  );
};

export default RandomArt;

import React, { useState, useEffect } from "react";
import { Painting } from "../types";

const PaintingComponent: React.FC<Painting> = (painting: Painting) => {
  const [broken, setBroken] = useState<boolean>(false); // State is boolean
  const hideBrokenImages = () => {
    setBroken(true);
  };

  const restrictedUrl = painting.image.includes("FRAME");

  useEffect(() => {
    if (restrictedUrl) {
      setBroken(true);
    }
  }, [restrictedUrl]);

  return (
    <section className="painting" id={painting.contentId}>
      {broken && <section tabIndex={-1} className={"hidden"} />}
      {!broken && (
        <img
          tabIndex={0}
          src={painting.image}
          alt={painting.title}
          className="art"
          onError={hideBrokenImages}
        />
      )}
    </section>
  );
};

export default PaintingComponent;

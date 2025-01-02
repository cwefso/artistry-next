import React, { useState, useEffect } from "react";

// Define the type for the Painting object
interface PaintingProps {
  painting: {
    contentId: string;
    title: string;
    image: string;
    artistName?: string;
    artistContentId?: number;
    completionYear?: number;
    yearAsString?: string;
    height?: number;
    width?: number;
  };
}

const Painting: React.FC<PaintingProps> = (props) => {
  const [broken, setBroken] = useState<boolean>(false); // State is boolean
  const hideBrokenImages = () => {
    setBroken(true);
  };

  const restrictedUrl = props.painting.image.includes("FRAME");

  useEffect(() => {
    if (restrictedUrl) {
      setBroken(true);
    }
  }, [restrictedUrl]);

  return (
    <section className="painting" id={props.painting.contentId}>
      {broken && <section tabIndex={-1} className={"hidden"} />}
      {!broken && (
        <img
          tabIndex={0}
          src={props.painting.image}
          alt={props.painting.title}
          className="art"
          onError={hideBrokenImages}
        />
      )}
    </section>
  );
};

export default Painting;

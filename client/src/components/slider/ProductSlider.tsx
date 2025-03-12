import React, { useState, useEffect } from "react";
import "./ProductSlider.css";
import background1 from "/src/Assets/slider/backgroud1.jpg";
import background2 from "/src/Assets/slider/backgroud2.jpg";
import background3 from "/src/Assets/slider/backgroud3.jpg";
import background5 from "/src/Assets/slider/backgroud5.jpg";
import background6 from "/src/Assets/slider/backgroud6.jpg";
import background8 from "/src/Assets/slider/backgroud8.png";
import background9 from "/src/Assets/slider/backgroud9.jpg";

const staticImages = [
  { url: background8, alt: "Product Image 1" },
  { url: background2, alt: "Product Image 2" },
  { url: background3, alt: "Product Image 3" },
  { url: background5, alt: "Product Image 5" },
  { url: background6, alt: "Product Image 6" },
  { url: background1, alt: "Product Image 8" },
  { url: background9, alt: "Product Image 9" },
];

const ImageSlider: React.FC = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const images = staticImages;

  // Automatically transition to the next image
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images.length]);

  function showNextImage() {
    setImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  }

  function showPrevImage() {
    setImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        height: "100vh",
        paddingTop: "20px",
      }}
    >
      <section
        aria-label="Image Slider"
        style={{
          width: "97%",
          height: "350px",
          position: "relative",
          
        }}
      >
        <a href="#after-image-slider-controls" className="skip-link">
          Skip Image Slider Controls
        </a>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {images.map(({ url, alt }, index) => (
            <img
              key={url}
              src={url}
              alt={alt}
              aria-hidden={imageIndex !== index}
              className="img-slider-img"
              style={{ translate: `${-100 * imageIndex}%` }}
            />
          ))}
        </div>
        <button
          onClick={showPrevImage}
          className="img-slider-btn"
          style={{ left: 0 }}
          aria-label="View Previous Image"
        >
          <svg viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button
          onClick={showNextImage}
          className="img-slider-btn"
          style={{ right: 0 }}
          aria-label="View Next Image"
        >
          <svg viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
        <div
          style={{
            position: "absolute",
            bottom: ".5rem",
            left: "50%",
            translate: "-50%",
            display: "flex",
            gap: ".25rem",
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              className="img-slider-dot-btn"
              aria-label={`View Image ${index + 1}`}
              onClick={() => setImageIndex(index)}
            >
              <svg viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill={index === imageIndex ? "white" : "transparent"}
                  strokeWidth="2"
                />
              </svg>
            </button>
          ))}
        </div>
        <div id="after-image-slider-controls" />
      </section>
    </div>
  );
};

export default ImageSlider;
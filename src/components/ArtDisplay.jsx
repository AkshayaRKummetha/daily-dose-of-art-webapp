import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// SVGs for arrows
const ArrowLeft = ({ ...props }) => (
  <button
    aria-label="Previous image"
    {...props}
    style={{
      ...props.style,
      background: "rgba(0,0,0,0.35)",
      border: "none",
      borderRadius: "50%",
      width: 38,
      height: 38,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: "50%",
      left: 10,
      transform: "translateY(-50%)",
      cursor: "pointer",
      zIndex: 2,
      color: "#fff",
      fontSize: "1.8rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
    }}
  >
    <span aria-hidden="true" style={{ fontSize: "1.5em" }}>‹</span>
  </button>
);

const ArrowRight = ({ ...props }) => (
  <button
    aria-label="Next image"
    {...props}
    style={{
      ...props.style,
      background: "rgba(0,0,0,0.35)",
      border: "none",
      borderRadius: "50%",
      width: 38,
      height: 38,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: "50%",
      right: 10,
      transform: "translateY(-50%)",
      cursor: "pointer",
      zIndex: 2,
      color: "#fff",
      fontSize: "1.8rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
    }}
  >
    <span aria-hidden="true" style={{ fontSize: "1.5em" }}>›</span>
  </button>
);

function ArtDisplay({ art, isFavorite, onFavorite }) {
  if (!art) return null;

  // Combine all available images
  const images = [art.primaryImage, ...(art.additionalImages || [])].filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);

  // Ref for TransformWrapper (for reset/center)
  const transformRef = useRef(null);

  // Center view on image change or new artwork
  useEffect(() => {
    if (transformRef.current && transformRef.current.centerView) {
      setTimeout(() => {
        transformRef.current.centerView();
      }, 50);
    }
  }, [imgIndex, art.objectID]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKey = (e) => {
      if (images.length < 2) return;
      if (e.key === "ArrowLeft") {
        setImgIndex((i) => (i > 0 ? i - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setImgIndex((i) => (i < images.length - 1 ? i + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length]);

  const handlePrev = () => setImgIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const handleNext = () => setImgIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  const handleDot = (idx) => setImgIndex(idx);

  // Resetting zoom and centering image
  const handleReset = () => {
    if (transformRef.current) {
      transformRef.current.resetTransform();
      setTimeout(() => {
        transformRef.current.centerView();
      }, 201);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 tabIndex={0}>{art.title}</h2>
      <p>
        <strong>Artist:</strong> {art.artistDisplayName || "Unknown"}
      </p>
      <p>
        <strong>Year:</strong> {art.objectDate || "Unknown"}
      </p>
      <p>
        <strong>Medium:</strong> {art.medium || "Unknown"}
      </p>
      {images.length > 0 ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            maxWidth: "700px",
          }}
        >
          <TransformWrapper
            ref={transformRef}
            centerOnInit
            initialScale={1}
            minScale={0.8}
            maxScale={5}
            doubleClick={{ disabled: false }}
            wheel={{ step: 0.2 }}
          >
            {() => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  position: "relative",
                }}
              >
                {images.length > 1 && (
                  <ArrowLeft onClick={handlePrev} tabIndex={0} />
                )}
                <TransformComponent
                  wrapperStyle={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                  contentStyle={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <img
                    src={images[imgIndex]}
                    alt={art.title}
                    style={{
                      maxWidth: "80vw",
                      maxHeight: "60vh",
                      borderRadius: "8px",
                      marginTop: "1rem",
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                  />
                </TransformComponent>
                {images.length > 1 && (
                  <ArrowRight onClick={handleNext} tabIndex={0} />
                )}
                {/* Dots */}
                {images.length > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: "10px",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "0.5rem",
                      zIndex: 3,
                    }}
                  >
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        aria-label={`Show image ${idx + 1}`}
                        onClick={() => handleDot(idx)}
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          border: "none",
                          background: idx === imgIndex ? "#0055a5" : "#ccc",
                          opacity: idx === imgIndex ? 1 : 0.5,
                          cursor: "pointer",
                          boxShadow: idx === imgIndex ? "0 0 0 2px #fff" : "none",
                          transition: "background 0.2s, opacity 0.2s",
                        }}
                        tabIndex={0}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </TransformWrapper>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button onClick={handleReset} aria-label="Reset zoom and center">Reset</button>
          </div>
        </div>
      ) : (
        <p>No image available.</p>
      )}
      <br />
      <div
        className="button-group"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1.5rem",
        }}
      >
        <button
          className="favorite-btn"
          aria-pressed={isFavorite}
          onClick={() => onFavorite(art)}
          style={{ marginBottom: "1rem" }}
        >
          {isFavorite ? "★ Remove from Favorites" : "☆ Add to Favorites"}
        </button>
        {art.objectURL && (
          <a
            href={art.objectURL}
            target="_blank"
            rel="noopener noreferrer"
            className="art-link"
          >
            Learn more at The Met
          </a>
        )}
      </div>
    </div>
  );
}

ArtDisplay.propTypes = {
  art: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavorite: PropTypes.func.isRequired,
};

export default ArtDisplay;

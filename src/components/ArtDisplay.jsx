import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
                  <button
                    aria-label="Previous image"
                    onClick={handlePrev}
                    style={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.18)",
                      border: "none",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.15rem",
                      zIndex: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                      padding: 0,
                      cursor: "pointer",
                      opacity: 0.85,
                    }}
                  >
                    <span aria-hidden="true" style={{ fontSize: "1.4em", lineHeight: 1 }}>‹</span>
                  </button>
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
                      transition: "box-shadow 0.2s",
                    }}
                  />
                </TransformComponent>
                {images.length > 1 && (
                  <button
                    aria-label="Next image"
                    onClick={handleNext}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.18)",
                      border: "none",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.15rem",
                      zIndex: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                      padding: 0,
                      cursor: "pointer",
                      opacity: 0.85,
                    }}
                  >
                    <span aria-hidden="true" style={{ fontSize: "1.4em", lineHeight: 1 }}>›</span>
                  </button>
                )}
                {/* Dots */}
                {images.length > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: 8,
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "0.32rem",
                      zIndex: 3,
                    }}
                  >
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        aria-label={`Show image ${idx + 1}`}
                        onClick={() => handleDot(idx)}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          border: "none",
                          background: idx === imgIndex ? "#0055a5" : "#ddd",
                          opacity: idx === imgIndex ? 1 : 0.6,
                          cursor: "pointer",
                          boxShadow: idx === imgIndex ? "0 0 0 1.5px #fff" : "none",
                          transition: "background 0.2s, opacity 0.2s",
                          padding: 0,
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

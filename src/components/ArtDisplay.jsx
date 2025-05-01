import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function ArtDisplay({ art, isFavorite, onFavorite }) {
  if (!art) return null;

  // Combine all available images
  const images = [art.primaryImage, ...(art.additionalImages || [])].filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);

  // Reset zoom when image changes
  useEffect(() => {
    setImgIndex(0);
  }, [art.objectID]);

  // Carousel controls
  const handlePrev = () => setImgIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const handleNext = () => setImgIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 tabIndex={0}>{art.title}</h2>
      <p><strong>Artist:</strong> {art.artistDisplayName || "Unknown"}</p>
      <p><strong>Year:</strong> {art.objectDate || "Unknown"}</p>
      <p><strong>Medium:</strong> {art.medium || "Unknown"}</p>

      {images.length > 0 ? (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={5}
            doubleClick={{ disabled: false }}
            wheel={{ step: 0.2 }}
            centerOnInit
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                  <TransformComponent
                    wrapperStyle={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}
                    contentStyle={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}
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
                        marginRight: "auto"
                      }}
                    />
                  </TransformComponent>
                </div>
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <button onClick={zoomIn} aria-label="Zoom in">Zoom In</button>
                  <button onClick={zoomOut} aria-label="Zoom out">Zoom Out</button>
                  <button onClick={resetTransform} aria-label="Reset zoom">Reset</button>
                </div>
              </>
            )}
          </TransformWrapper>

          {images.length > 1 && (
            <div className="carousel-controls" style={{ marginTop: "0.5rem" }}>
              <button onClick={handlePrev} aria-label="Previous image">Prev</button>
              <span style={{ margin: "0 1rem" }}>{imgIndex + 1} / {images.length}</span>
              <button onClick={handleNext} aria-label="Next image">Next</button>
            </div>
          )}
        </div>
      ) : (
        <p>No image available.</p>
      )}

      <div className="button-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1.5rem" }}>
        <button
          className="favorite-btn"
          aria-pressed={isFavorite}
          onClick={() => onFavorite(art)}
          style={{ marginBottom: "1rem" }}
        >
          {isFavorite ? "★ Remove from Favorites" : "☆ Add to Favorites"}
        </button>
        {art.objectURL && (
          <a href={art.objectURL} target="_blank" rel="noopener noreferrer" className="art-link">
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

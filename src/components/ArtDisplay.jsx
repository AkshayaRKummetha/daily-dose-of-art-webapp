import React, { useState } from "react";
import PropTypes from "prop-types";

function ArtDisplay({ art, isFavorite, onFavorite }) {
  if (!art) return null;

  // Collect all available images (primary + additional)
  const images = [art.primaryImage, ...(art.additionalImages || [])].filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);

  const handlePrev = () => setImgIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const handleNext = () => setImgIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div>
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
        <div>
          <img
            src={images[imgIndex]}
            alt={art.title}
            style={{ maxWidth: "80%", borderRadius: "8px", marginTop: "1rem" }}
          />
          {images.length > 1 && (
            <div className="carousel-controls" style={{ marginTop: "0.5rem" }}>
              <button onClick={handlePrev} aria-label="Previous image">Prev</button>
              <span style={{ margin: "0 1rem" }}>
                {imgIndex + 1} / {images.length}
              </span>
              <button onClick={handleNext} aria-label="Next image">Next</button>
            </div>
          )}
        </div>
      ) : (
        <p>No image available.</p>
      )}
      <br />
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

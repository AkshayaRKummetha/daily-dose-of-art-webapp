import React from "react";
import PropTypes from "prop-types";

function ArtDisplay({ art, isFavorite, onFavorite }) {
  if (!art) return null;

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
      {art.primaryImage ? (
        <img
          src={art.primaryImage}
          alt={art.title}
          style={{ maxWidth: "80%", borderRadius: "8px", marginTop: "1rem" }}
        />
      ) : (
        <p>No image available.</p>
      )}
      <br />
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
      <br />
      <button
        className="favorite-btn"
        aria-pressed={isFavorite}
        onClick={() => onFavorite(art)}
      >
        {isFavorite ? "★ Remove from Favorites" : "☆ Add to Favorites"}
      </button>
    </div>
  );
}

ArtDisplay.propTypes = {
  art: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavorite: PropTypes.func.isRequired,
};

export default ArtDisplay;


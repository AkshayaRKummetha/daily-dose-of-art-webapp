import React from "react";
import PropTypes from "prop-types";
import "./FavoritesList.css";

function FavoritesList({ favorites, onSelect, onRemove }) {
  if (!favorites.length) {
    return <p>No favorites yet.</p>;
  }
  return (
    <div>
      <h2 tabIndex={0}>Your Favorites</h2>
      <div className="favorites-grid">
        {favorites.map((fav) => {
          // Use the first available image (primary or additional)
          const image =
            fav.primaryImage ||
            (fav.additionalImages && fav.additionalImages.length > 0
              ? fav.additionalImages[0]
              : "");
          return (
            <div className="favorite-card" key={fav.objectID}>
              <button
                className="favorite-thumb"
                onClick={() => onSelect(fav)}
                aria-label={`View ${fav.title}`}
              >
                <img
                  src={image}
                  alt={fav.title}
                  className="favorite-thumb-img"
                  style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                />
              </button>
              <div className="favorite-title">{fav.title}</div>
              <button
                className="remove-btn"
                aria-label={`Remove ${fav.title} from favorites`}
                onClick={() => onRemove(fav.objectID)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

FavoritesList.propTypes = {
  favorites: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default FavoritesList;

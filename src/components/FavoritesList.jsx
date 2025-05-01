import React from "react";
import PropTypes from "prop-types";
import "./FavoritesAndRecommendationsGrid.css";

function FavoritesList({ favorites, onRemove }) {
  if (!favorites.length) {
    return <p>No favorites yet.</p>;
  }
  return (
    <div>
      <h2 tabIndex={0}>Your Favorites</h2>
      <div className="artwork-grid">
        {favorites.map((fav) => {
          const image =
            fav.primaryImage ||
            (fav.additionalImages && fav.additionalImages.length > 0
              ? fav.additionalImages[0]
              : "");
          return (
            <div className="artwork-card" key={fav.objectID}>
              <img
                src={image}
                alt={fav.title}
                className="artwork-thumb"
              />
              <div className="artwork-title">{fav.title}</div>
              <button
                className="star-btn"
                aria-label={`Remove ${fav.title} from favorites`}
                aria-pressed="true"
                onClick={() => onRemove(fav.objectID)}
                title="Remove from favorites"
              >
                ★
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
  onRemove: PropTypes.func.isRequired,
};

export default FavoritesList;

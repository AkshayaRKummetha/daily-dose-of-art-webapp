import React from "react";
import PropTypes from "prop-types";

function FavoritesList({ favorites, onSelect, onRemove }) {
  if (!favorites.length) {
    return <p>No favorites yet.</p>;
  }
  return (
    <div>
      <h2 tabIndex={0}>Your Favorites</h2>
      <ul className="favorites-list">
        {favorites.map((fav) => (
          <li key={fav.objectID}>
            <button className="favorite-item" onClick={() => onSelect(fav)}>
              {fav.title} ({fav.artistDisplayName || "Unknown"})
            </button>
            <button
              className="remove-btn"
              aria-label={`Remove ${fav.title} from favorites`}
              onClick={() => onRemove(fav.objectID)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

FavoritesList.propTypes = {
  favorites: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default FavoritesList;


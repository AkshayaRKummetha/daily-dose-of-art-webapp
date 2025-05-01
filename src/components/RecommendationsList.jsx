import React from "react";
import PropTypes from "prop-types";
import "./FavoritesAndRecommendationsGrid.css";

function RecommendationsList({ recommendations, onFavorite, favorites }) {
  if (!recommendations.length) {
    return <p>No recommendations yet. Save some favorites or set preferences!</p>;
  }
  return (
    <div>
      <h2 tabIndex={0}>Recommended Artworks</h2>
      <div className="artwork-grid">
        {recommendations.map((rec) => {
          const image =
            rec.primaryImage ||
            (rec.additionalImages && rec.additionalImages.length > 0
              ? rec.additionalImages[0]
              : "");
          const isFavorited = favorites.some(f => f.objectID === rec.objectID);
          return (
            <div className="artwork-card" key={rec.objectID}>
              <img
                src={image}
                alt={rec.title}
                className="artwork-thumb"
              />
              <div className="artwork-title">{rec.title}</div>
              <button
                className="star-btn"
                aria-label={
                  isFavorited
                    ? `Remove ${rec.title} from favorites`
                    : `Add ${rec.title} to favorites`
                }
                aria-pressed={isFavorited}
                onClick={() => onFavorite(rec)}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorited ? "★" : "☆"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

RecommendationsList.propTypes = {
  recommendations: PropTypes.array.isRequired,
  onFavorite: PropTypes.func.isRequired,
  favorites: PropTypes.array.isRequired,
};

export default RecommendationsList;

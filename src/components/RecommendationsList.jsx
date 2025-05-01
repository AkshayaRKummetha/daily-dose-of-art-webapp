import React from "react";
import PropTypes from "prop-types";
import "./RecommendationsList.css";

function RecommendationsList({ recommendations, onFavorite, favorites }) {
  if (!recommendations.length) {
    return <p>No recommendations yet. Save some favorites to get suggestions!</p>;
  }
  
  return (
    <div>
      <h2 tabIndex={0}>Recommended Artworks</h2>
      <div className="recommendations-grid">
        {recommendations.map((rec) => {
          const image = rec.primaryImage || 
            (rec.additionalImages?.[0] || "");
          const isFavorited = favorites.some(f => f.objectID === rec.objectID);
          
          return (
            <div className="recommendation-card" key={rec.objectID}>
              <img
                src={image}
                alt={rec.title}
                className="recommendation-thumb"
              />
              <div className="recommendation-title">{rec.title}</div>
              <div className="recommendation-details">
                <span>{rec.style?.split('|')[0] || 'Unknown Style'}</span>
                <button 
                  onClick={() => onFavorite(rec)}
                  aria-pressed={isFavorited}
                >
                  {isFavorited ? "★" : "☆"}
                </button>
              </div>
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

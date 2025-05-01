import React, { useState, useEffect } from "react";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import FavoritesList from "./components/FavoritesList";
import ArtDisplay from "./components/ArtDisplay";
import VisitorInfoModal from "./components/VisitorInfoModal";
import Preferences from "./components/Preferences";
import { 
  getDailyArt, 
  fetchArtById, 
  getFavorites, 
  saveFavorite, 
  removeFavorite, 
  getRecommendedArtworks // Importing recommendation utility
} from "./utils";

// Initializing default preferences
const DEFAULT_PREFERENCES = { styles: [], periods: [] };

export default function App() {
  // Initializing state variables
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(getFavorites());
  const [showFavorites, setShowFavorites] = useState(false);
  const [showVisitorInfo, setShowVisitorInfo] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(
    JSON.parse(localStorage.getItem("artPreferences")) || DEFAULT_PREFERENCES
  );
  const [allArtworks, setAllArtworks] = useState([]); // Storing fetched artworks for recommendations

  // Fetching daily art on mount
  useEffect(() => {
    setLoading(true);
    setError("");
    getDailyArt()
      .then((artData) => {
        // Setting art only if it has at least one image
        if (artData.primaryImage || (artData.additionalImages && artData.additionalImages.length > 0)) {
          setArt(artData);
          // Adding fetched art to allArtworks for recommendations
          setAllArtworks((prev) => {
            if (artData && !prev.some(a => a.objectID === artData.objectID)) {
              return [...prev, artData];
            }
            return prev;
          });
        } else {
          setError("No image found for today's artwork. Try refreshing.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load artwork. Please try again.");
        setLoading(false);
      });
  }, []);

  // Handling refresh for new random artwork
  const handleRefresh = () => {
    setLoading(true);
    setError("");
    fetchArtById()
      .then((artData) => {
        if (artData.primaryImage || (artData.additionalImages && artData.additionalImages.length > 0)) {
          setArt(artData);
          // Adding new art to allArtworks for recommendations
          setAllArtworks((prev) => {
            if (artData && !prev.some(a => a.objectID === artData.objectID)) {
              return [...prev, artData];
            }
            return prev;
          });
          const today = new Date().toISOString().slice(0, 10);
          localStorage.setItem("dailyArt", JSON.stringify({ date: today, art: artData }));
        } else {
          setError("No image found for this artwork. Try again.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load new artwork. Please try again.");
        setLoading(false);
      });
  };

  // Handling favorite/unfavorite logic
  const handleFavorite = (artwork) => {
    if (favorites.some((fav) => fav.objectID === artwork.objectID)) {
      const updated = removeFavorite(artwork.objectID);
      setFavorites(updated);
    } else {
      const updated = saveFavorite(artwork);
      setFavorites(updated);
    }
  };

  // Toggling favorites panel
  const toggleFavorites = () => setShowFavorites((prev) => !prev);

  // Toggling preferences panel
  const togglePreferences = () => setShowPreferences((prev) => !prev);

  // Handling updating preferences and saving to localStorage
  const handleSetPreferences = (prefs) => {
    setPreferences(prefs);
    localStorage.setItem("artPreferences", JSON.stringify(prefs));
  };

  // Getting recommendations based on favorites and preferences
  const recommended = getRecommendedArtworks(allArtworks, favorites, preferences);

  return (
    <div className="app-container">
      <h1>Daily Dose of Art</h1>
      <div className="controls" style={{ marginBottom: "2rem" }}>
        <button onClick={handleRefresh}>New Artwork</button>
        <button onClick={toggleFavorites}>
          {showFavorites ? "Hide Favorites" : "Show Favorites"}
        </button>
        <button onClick={togglePreferences}>
          {showPreferences ? "Hide Preferences" : "Set Preferences"}
        </button>
      </div>
      {/* Rendering loader while loading */}
      {loading && <Loader />}
      {/* Rendering error message if error exists */}
      {error && <ErrorMessage message={error} />}
      {/* Rendering Preferences panel if toggled */}
      {showPreferences && (
        <Preferences preferences={preferences} setPreferences={handleSetPreferences} />
      )}
      {/* Rendering ArtDisplay if not loading, not showing favorites or preferences, and art exists */}
      {!loading && art && !showFavorites && !showPreferences && (
        <ArtDisplay
          art={art}
          onFavorite={handleFavorite}
          isFavorite={favorites.some((fav) => fav.objectID === art.objectID)}
        />
      )}
      {/* Rendering Recommendations if not loading, not showing favorites or preferences, and recommendations exist */}
      {!loading && !showFavorites && !showPreferences && recommended.length > 0 && (
        <div>
          <h2>Recommended for You</h2>
          <div className="recommended-list">
            {recommended.slice(0, 4).map((recArt) => (
              <ArtDisplay
                key={recArt.objectID}
                art={recArt}
                onFavorite={handleFavorite}
                isFavorite={favorites.some((fav) => fav.objectID === recArt.objectID)}
              />
            ))}
          </div>
        </div>
      )}
      {/* Rendering FavoritesList if toggled */}
      {showFavorites && (
        <FavoritesList
          favorites={favorites}
          onSelect={(artwork) => setArt(artwork)}
          onRemove={(objectID) => {
            setFavorites(removeFavorite(objectID));
          }}
        />
      )}
      {/* Rendering VisitorInfoModal if toggled */}
      {showVisitorInfo && (
        <VisitorInfoModal onClose={() => setShowVisitorInfo(false)} />
      )}
    </div>
  );
}

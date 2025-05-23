import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import FavoritesList from "./components/FavoritesList";
import RecommendationsList from "./components/RecommendationsList";
import ArtDisplay from "./components/ArtDisplay";
import VisitorInfoModal from "./components/VisitorInfoModal";
import Preferences from "./components/Preferences";
import {
  getDailyArt,
  fetchArtById,
  getFavorites,
  saveFavorite,
  removeFavorite,
  getRecommendedArtworks
} from "./utils";

const DEFAULT_PREFERENCES = { styles: [], periods: [], mediums: [] };

export default function App() {
  const navigate = useNavigate();
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(getFavorites());
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showVisitorInfo, setShowVisitorInfo] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(
    JSON.parse(localStorage.getItem("artPreferences")) || DEFAULT_PREFERENCES
  );
  const [allArtworks, setAllArtworks] = useState([]);

  // Load artwork on mount or when preferences change
  useEffect(() => {
    setLoading(true);
    setError("");
    getDailyArt(preferences)
      .then((artData) => {
        if (artData?.primaryImage || (artData?.additionalImages && artData.additionalImages.length > 0)) {
          setArt(artData);
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
        navigate('/');
      })
      .catch(() => {
        setError("Failed to load artwork. Please try again.");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [preferences]);

  // Handles fetching new artwork and resets views
  const handleRefresh = async () => {
    setShowFavorites(false);
    setShowRecommendations(false);
    setShowPreferences(false);
    setLoading(true);
    setError("");
    try {
      const artData = await fetchArtById(preferences);
      if (artData?.primaryImage || (artData?.additionalImages && artData.additionalImages.length > 0)) {
        setArt(artData);
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
    } catch {
      setError("Failed to load new artwork. Please try again.");
    }
    setLoading(false);
    navigate('/');
  };

  // Handles saving/removing favorites
  const handleFavorite = (artwork) => {
    if (favorites.some((fav) => fav.objectID === artwork.objectID)) {
      const updated = removeFavorite(artwork.objectID);
      setFavorites(updated);
    } else {
      const updated = saveFavorite(artwork);
      setFavorites(updated);
    }
  };

  // Handles saving preferences and returning to main view
  const handleSavePreferences = (updatedPrefs) => {
    setPreferences(updatedPrefs);
    localStorage.setItem("artPreferences", JSON.stringify(updatedPrefs));
    setShowPreferences(false);
    setShowFavorites(false);
    setShowRecommendations(false);
    handleRefresh(); // Show new artwork with new preferences
  };

  const recommended = getRecommendedArtworks(allArtworks, favorites, preferences);

  return (
    <div className="app-container">
      <h1>Daily Dose of Art</h1>
      <div className="controls" style={{ marginBottom: "2rem" }}>
        <button onClick={handleRefresh}>New Artwork</button>
        <button onClick={() => setShowFavorites((prev) => !prev)}>
          {showFavorites ? "Hide Favorites" : "Show Favorites"}
        </button>
        <button onClick={() => setShowRecommendations((prev) => !prev)}>
          {showRecommendations ? "Hide Recommendations" : "Show Recommendations"}
        </button>
        <button onClick={() => setShowPreferences((prev) => !prev)}>
          {showPreferences ? "Hide Preferences" : "Set Preferences"}
        </button>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {showPreferences && (
        <Preferences
          preferences={preferences}
          setPreferences={handleSavePreferences}
        />
      )}

      {!loading && art && !showFavorites && !showRecommendations && !showPreferences && (
        <div className="main-art-container">
          <ArtDisplay
            art={art}
            onFavorite={handleFavorite}
            isFavorite={favorites.some((fav) => fav.objectID === art.objectID)}
            handleRefresh={handleRefresh}
          />
        </div>
      )}

      {showRecommendations && (
        <RecommendationsList
          recommendations={recommended}
          onFavorite={handleFavorite}
          favorites={favorites}
        />
      )}

      {showFavorites && (
        <FavoritesList
          favorites={favorites}
          onRemove={(objectID) => setFavorites(removeFavorite(objectID))}
        />
      )}

      {showVisitorInfo && (
        <VisitorInfoModal onClose={() => setShowVisitorInfo(false)} />
      )}
    </div>
  );
}

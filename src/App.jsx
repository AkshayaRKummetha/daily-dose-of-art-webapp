import React, { useState } from "react";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import FavoritesList from "./components/FavoritesList";
import ArtDisplay from "./components/ArtDisplay";
import VisitorInfoModal from "./components/VisitorInfoModal";
import { getDailyArt, fetchArtById, getFavorites, saveFavorite, removeFavorite } from "./utils";

export default function App() {
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(getFavorites());
  const [showFavorites, setShowFavorites] = useState(false);
  const [showVisitorInfo, setShowVisitorInfo] = useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError("");
    getDailyArt()
      .then((artData) => {
        setArt(artData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load artwork. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    fetchArtById()
      .then((artData) => {
        setArt(artData);
        setLoading(false);
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem("dailyArt", JSON.stringify({ date: today, art: artData }));
      })
      .catch(() => {
        setError("Failed to load new artwork. Please try again.");
        setLoading(false);
      });
  };

  const handleFavorite = (artwork) => {
    if (favorites.some((fav) => fav.objectID === artwork.objectID)) {
      const updated = removeFavorite(artwork.objectID);
      setFavorites(updated);
    } else {
      const updated = saveFavorite(artwork);
      setFavorites(updated);
    }
  };

  const toggleFavorites = () => setShowFavorites((prev) => !prev);

  return (
    <div className="app-container">
      <h1 tabIndex={0}>Daily Dose of Art</h1>
      <div className="controls">
        <button onClick={handleRefresh} aria-label="Show new artwork">New Artwork</button>
        <button onClick={toggleFavorites} aria-label="Show favorites">
          {showFavorites ? "Hide Favorites" : "Show Favorites"}
        </button>
        <button onClick={() => setShowVisitorInfo(true)}>
          Visitor Info
        </button>
      </div>
      <VisitorInfoModal open={showVisitorInfo} onClose={() => setShowVisitorInfo(false)} />
      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={handleRefresh} />}
      {!loading && art && !showFavorites && (
        <ArtDisplay
          art={art}
          isFavorite={favorites.some((fav) => fav.objectID === art.objectID)}
          onFavorite={handleFavorite}
        />
      )}
      {!loading && showFavorites && (
        <FavoritesList
          favorites={favorites}
          onSelect={(artwork) => {
            setArt(artwork);
            setShowFavorites(false);
          }}
          onRemove={(objectID) => {
            const updated = removeFavorite(objectID);
            setFavorites(updated);
          }}
        />
      )}

    </div>
  );
}

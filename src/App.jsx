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
        // Only set art if it has at least one image
        if (artData.primaryImage || (artData.additionalImages && artData.additionalImages.length > 0)) {
          setArt(artData);
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

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    fetchArtById()
      .then((artData) => {
        if (artData.primaryImage || (artData.additionalImages && artData.additionalImages.length > 0)) {
          setArt(artData);
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
      <h1>Daily Dose of Art</h1>
      <button onClick={handleRefresh}>New Artwork</button>
      <button onClick={toggleFavorites}>
        {showFavorites ? "Hide Favorites" : "Show Favorites"}
      </button>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && art && !showFavorites && (
        <ArtDisplay
          art={art}
          onFavorite={handleFavorite}
          isFavorite={favorites.some((fav) => fav.objectID === art.objectID)}
        />
      )}
      {showFavorites && (
        <FavoritesList
          favorites={favorites}
          onSelect={(artwork) => setArt(artwork)}
          onRemove={(objectID) => {
            setFavorites(removeFavorite(objectID));
          }}
        />
      )}
      {/* If you use VisitorInfoModal */}
      {showVisitorInfo && (
        <VisitorInfoModal onClose={() => setShowVisitorInfo(false)} />
      )}
    </div>
  );
}

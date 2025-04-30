import React { useEffect, useState, Suspense, lazy } from "react";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import FavoritesList from "./components/FavoritesList";
import { getDailyArt, fetchArtById, getFavorites, saveFavorite, removeFavorite } from "./utils";

const ArtDisplay = lazy(() => import("./components/ArtDisplay"));

function App() {
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(getFavorites());
  const [showFavorites, setShowFavorites] = useState(false);

  // Loading daily art from cache or fetching a new one
  useEffect(() => {
    setLoading(true);
    setError("");
    getDailyArt()
      .then((artData) => {
        setArt(artData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load artwork. Please try again.");
        setLoading(false);
      });
  }, []);

  // Handling manual refresh (fetching new random art and updating daily cache)
  const handleRefresh = () => {
    setLoading(true);
    setError("");
    fetchArtById()
      .then((artData) => {
        setArt(artData);
        setLoading(false);
        // Save as today's art
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem("dailyArt", JSON.stringify({ date: today, art: artData }));
      })
      .catch(() => {
        setError("Failed to load new artwork. Please try again.");
        setLoading(false);
      });
  };

  // Adding/removing favorites
  const handleFavorite = (artwork) => {
    if (favorites.some((fav) => fav.objectID === artwork.objectID)) {
      const updated = removeFavorite(artwork.objectID);
      setFavorites(updated);
    } else {
      const updated = saveFavorite(artwork);
      setFavorites(updated);
    }
  };

  // Toggling favorites list
  const toggleFavorites = () => setShowFavorites((prev) => !prev);

  return (
    <div className="app-container">
      <h1 tabIndex={0}>Daily Dose of Art</h1>
      <div className="controls">
        <button onClick={handleRefresh} aria-label="Show new artwork">New Artwork</button>
        <button onClick={toggleFavorites} aria-label="Show favorites">
          {showFavorites ? "Hide Favorites" : "Show Favorites"}
        </button>
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={handleRefresh} />}
      {!loading && art && !showFavorites && (
        <Suspense fallback={<Loader />}>
          <ArtDisplay
            art={art}
            isFavorite={favorites.some((fav) => fav.objectID === art.objectID)}
            onFavorite={handleFavorite}
          />
        </Suspense>
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

export default App;


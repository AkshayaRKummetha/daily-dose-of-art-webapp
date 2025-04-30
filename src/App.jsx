import React, { useEffect, useState, Suspense, lazy } from "react";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import FavoritesList from "./components/FavoritesList";
import VisitorInfoModal from "./components/VisitorInfoModal";
import Exhibitions from "./components/Exhibitions";
import EventCalendar from "./components/EventCalendar";
import SupportCTA from "./components/SupportCTA";
import SocialLinks from "./components/SocialLinks";
import NavBar from "./components/NavBar";
import {
  getDailyArt,
  fetchArtById,
  getFavorites,
  saveFavorite,
  removeFavorite,
} from "./utils";

const ArtDisplay = lazy(() => import("./components/ArtDisplay"));

function App() {
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(getFavorites());
  const [showFavorites, setShowFavorites] = useState(false);
  const [showVisitorInfo, setShowVisitorInfo] = useState(false);

  // Loading daily art from cache or fetch a new one
  useEffect(() => {
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

  // Handling manual refresh (fetch new random art and update daily cache)
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

  // Handling adding/removing favorites
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

  // Showing Visitor Info Modal
  const handleShowVisitorInfo = () => setShowVisitorInfo(true);
  const handleCloseVisitorInfo = () => setShowVisitorInfo(false);

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <NavBar onShowVisitorInfo={handleShowVisitorInfo} />

      {/* Visitor Information Modal */}
      <VisitorInfoModal open={showVisitorInfo} onClose={handleCloseVisitorInfo} />

      {/* Main Heading */}
      <h1 tabIndex={0}>Daily Dose of Art</h1>

      {/* Main Controls */}
      <div className="controls">
        <button onClick={handleRefresh} aria-label="Show new artwork">New Artwork</button>
        <button onClick={toggleFavorites} aria-label="Show favorites">
          {showFavorites ? "Hide Favorites" : "Show Favorites"}
        </button>
        <button onClick={handleShowVisitorInfo} aria-label="Show visitor information">
          Visitor Info
        </button>
      </div>

      {/* Main Content */}
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

      {/* Museum Website Features */}
      <Exhibitions />
      <EventCalendar />
      <SupportCTA />
      <SocialLinks />
    </div>
  );
}

export default App;

// Fetching a new random artwork from The Met API
export async function fetchArtById() {
  const idsRes = await fetch(
    "https://collectionapi.metmuseum.org/public/collection/v1/objects"
  );
  const idsData = await idsRes.json();
  if (!idsData.objectIDs?.length) throw new Error("No artworks found.");

  // Trying up to 10 times to get an artwork with an image
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * idsData.objectIDs.length);
    const randomId = idsData.objectIDs[randomIndex];
    const artRes = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomId}`
    );
    const art = await artRes.json();
    // Returning art only if it has a primary or additional image
    if (art.primaryImage || (art.additionalImages && art.additionalImages.length > 0)) {
      return art;
    }
  }
  throw new Error("Could not find artwork with images after several tries.");
}

// Getting today's artwork from localStorage or fetching a new one
export async function getDailyArt() {
  const today = new Date().toISOString().slice(0, 10);
  const cached = localStorage.getItem("dailyArt");
  if (cached) {
    const { date, art } = JSON.parse(cached);
    // Returning cached art if it is from today and has an image
    if (
      date === today &&
      (art.primaryImage || (art.additionalImages && art.additionalImages.length > 0))
    ) {
      return art;
    }
  }
  // Fetching new art and saving it to localStorage
  const art = await fetchArtById();
  localStorage.setItem("dailyArt", JSON.stringify({ date: today, art }));
  return art;
}

// Managing favorites list
export function getFavorites() {
  const favs = localStorage.getItem("favorites");
  return favs ? JSON.parse(favs) : [];
}

// Saving a favorite artwork
export function saveFavorite(art) {
  const favs = getFavorites();
  if (!favs.some((fav) => fav.objectID === art.objectID)) {
    const updated = [...favs, art];
    localStorage.setItem("favorites", JSON.stringify(updated));
    return updated;
  }
  return favs;
}

// Removing a favorite artwork by objectID
export function removeFavorite(objectID) {
  const favs = getFavorites();
  const updated = favs.filter((fav) => fav.objectID !== objectID);
  localStorage.setItem("favorites", JSON.stringify(updated));
  return updated;
}

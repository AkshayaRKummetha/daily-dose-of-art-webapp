export async function fetchArtById(preferences = {}) {
  const params = new URLSearchParams({
    hasImages: 'true',
    q: 'public' // Base query to ensure some results
  });

  // Apply medium filter if specified
  if (preferences.mediums?.length) {
    params.set('medium', preferences.mediums.join('|'));
  }

  try {
    // First try filtered search
    const searchRes = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?${params}`
    );
    const { objectIDs = [] } = await searchRes.json();

    // Get details for up to 20 random results
    const sampleIDs = objectIDs.length > 0 
      ? getRandomSample(objectIDs, 20)
      : await fetchArtIDsFallback();

    // Check artworks against client-side filters
    for (const id of sampleIDs) {
      const art = await fetchArtDetails(id);
      if (art && matchesClientFilters(art, preferences)) {
        return art;
      }
    }
    
    // Fallback to non-filtered search
    return fetchArtById({});
  } catch (error) {
    console.error('Filter error:', error.message);
    return fetchArtById({});
  }
}

// Client-side filter matching (OR logic for medium/style)
function matchesClientFilters(art, preferences) {
  const { styles = [], mediums = [] } = preferences;
  
  // No filters = match all
  if (styles.length === 0 && mediums.length === 0) return true;

  // Check style matches (any)
  const styleMatch = styles.length > 0 &&
    styles.some(s => art.style?.toLowerCase().includes(s.toLowerCase()));

  // Check medium matches (any)
  const mediumMatch = mediums.length > 0 &&
    mediums.some(m => art.medium?.toLowerCase().includes(m.toLowerCase()));

  // OR combination
  return styleMatch || mediumMatch;
}

// Update recommendation scoring
export function getRecommendedArtworks(allArtworks, favorites, preferences) {
  return allArtworks
    .filter(art => !favorites.some(fav => fav.objectID === art.objectID))
    .map(art => ({
      art,
      score: calculatePreferenceScore(art, preferences)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(({ art }) => art);
}

function calculatePreferenceScore(art, preferences) {
  let score = 0;
  const { styles = [], mediums = [] } = preferences;

  // Style matching (40%)
  if (styles.length && art.style) {
    const artStyles = art.style.toLowerCase().split('|');
    score += styles.filter(s => 
      artStyles.some(as => as.includes(s.toLowerCase()))
    ).length * 40;
  }

  // Medium matching (40%)
  if (mediums.length && art.medium) {
    const artMediums = art.medium.toLowerCase().split(/,\s*|;\s*|\band\b/);
    score += mediums.filter(m => 
      artMediums.some(am => am.includes(m.toLowerCase()))
    ).length * 40;
  }

  return score + Math.random() * 20; // Add randomness for diversity
}

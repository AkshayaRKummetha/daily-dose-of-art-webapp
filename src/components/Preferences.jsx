import React, { useEffect, useState } from "react";

// Defining API endpoints for fetching styles and periods
const TAGS_API = "https://collectionapi.metmuseum.org/public/collection/v1/tags";
const OBJECTS_API = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

// Creating a helper to fetch unique periods from a sample of artworks
async function fetchUniquePeriods(sampleSize = 300) {
  // Fetching a sample of object IDs
  const res = await fetch(`${OBJECTS_API}?hasImages=true`);
  const data = await res.json();
  const ids = data.objectIDs.slice(0, sampleSize);

  // Fetching details for each object and extracting periods
  const periodSet = new Set();
  await Promise.all(
    ids.map(async (id) => {
      const objRes = await fetch(`${OBJECTS_API}/${id}`);
      const obj = await objRes.json();
      if (obj.period && obj.period.trim()) {
        periodSet.add(obj.period.trim());
      }
    })
  );
  return Array.from(periodSet).sort();
}

// Creating the Preferences component
export default function Preferences({ preferences, setPreferences }) {
  // Using state for styles and periods fetched from the API
  const [styles, setStyles] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localPrefs, setLocalPrefs] = useState(preferences);

  // Fetching styles (tags) and periods from The Met API on mount
  useEffect(() => {
    setLoading(true);

    // Fetching styles (tags)
    fetch(TAGS_API)
      .then((res) => res.json())
      .then((data) => {
        // Extracting unique style tags
        const tagList = (data.tags || [])
          .map((tag) => tag.term)
          .filter(Boolean)
          .sort();
        setStyles(tagList);
      });

    // Fetching unique periods
    fetchUniquePeriods().then((periodList) => {
      setPeriods(periodList);
      setLoading(false);
    });
  }, []);

  // Updating local preferences when parent preferences change
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  // Handling selection of styles or periods
  const handleChange = (type, value) => {
    setLocalPrefs((prefs) => ({
      ...prefs,
      [type]: prefs[type].includes(value)
        ? prefs[type].filter((v) => v !== value)
        : [...prefs[type], value],
    }));
  };

  // Saving preferences to parent and localStorage
  const handleSave = () => {
    setPreferences(localPrefs);
    localStorage.setItem("artPreferences", JSON.stringify(localPrefs));
  };

  // Rendering loading state if data is being fetched
  if (loading) return <div>Loading preferences...</div>;

  // Rendering the preferences selection UI
  return (
    <div className="preferences-panel">
      <h3>Choosing Art Preferences</h3>
      <div style={{ marginBottom: "1.5rem" }}>
        <strong>Styles (Tags):</strong>
        <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #eee", padding: 8, borderRadius: 4 }}>
          {styles.map((style) => (
            <label key={style} style={{ marginRight: "1rem", display: "inline-block", marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={localPrefs.styles.includes(style)}
                onChange={() => handleChange("styles", style)}
              />
              {style}
            </label>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <strong>Periods:</strong>
        <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #eee", padding: 8, borderRadius: 4 }}>
          {periods.map((period) => (
            <label key={period} style={{ marginRight: "1rem", display: "inline-block", marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={localPrefs.periods.includes(period)}
                onChange={() => handleChange("periods", period)}
              />
              {period}
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleSave}>Saving Preferences</button>
    </div>
  );
}

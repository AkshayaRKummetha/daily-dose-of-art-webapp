import React, { useState, useEffect } from "react";

// Helper to get unique, sorted, non-empty values
function getUnique(arr) {
  return Array.from(new Set(arr.filter(Boolean).map(s => s.trim())))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function Preferences({ preferences, setPreferences }) {
  const [localPrefs, setLocalPrefs] = useState({
    styles: preferences.styles || [],
    mediums: preferences.mediums || [],
    periods: preferences.periods || [],
  });
  const [allStyles, setAllStyles] = useState([]);
  const [allMediums, setAllMediums] = useState([]);
  const [allPeriods, setAllPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocalPrefs({
      styles: preferences.styles || [],
      mediums: preferences.mediums || [],
      periods: preferences.periods || [],
    });
  }, [preferences]);

  // Fetch unique options from a sample of artworks
  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      try {
        const idsRes = await fetch(
          "https://collectionapi.metmuseum.org/public/collection/v1/objects"
        );
        const idsData = await idsRes.json();
        const objectIDs = idsData.objectIDs || [];
        const sampleIDs = [];
        while (sampleIDs.length < 100 && objectIDs.length) {
          const idx = Math.floor(Math.random() * objectIDs.length);
          sampleIDs.push(objectIDs.splice(idx, 1)[0]);
        }
        const details = [];
        for (let i = 0; i < sampleIDs.length; i += 10) {
          const chunk = sampleIDs.slice(i, i + 10);
          const chunkDetails = await Promise.all(
            chunk.map(id =>
              fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
                .then(res => res.json())
                .catch(() => ({}))
            )
          );
          details.push(...chunkDetails);
        }
        const styles = [];
        const mediums = [];
        const periods = [];
        details.forEach(obj => {
          if (obj.style) styles.push(...obj.style.split("|"));
          if (obj.classification) styles.push(obj.classification);
          if (obj.medium) mediums.push(...obj.medium.split(/,|;| and /));
          if (obj.objectDate) periods.push(obj.objectDate);
          if (obj.period) periods.push(obj.period);
        });
        setAllStyles(getUnique(styles));
        setAllMediums(getUnique(mediums));
        setAllPeriods(getUnique(periods));
      } catch (err) {
        setAllStyles([]);
        setAllMediums([]);
        setAllPeriods([]);
      }
      setLoading(false);
    }
    fetchOptions();
  }, []);

  // Handle checkbox change
  const handleChange = (type, value) => {
    setLocalPrefs((prefs) => ({
      ...prefs,
      [type]: Array.isArray(prefs[type])
        ? prefs[type].includes(value)
          ? prefs[type].filter((v) => v !== value)
          : [...prefs[type], value]
        : [value],
    }));
  };

  // Save preferences to parent and localStorage
  const handleSave = () => {
    setPreferences(localPrefs);
    localStorage.setItem("artPreferences", JSON.stringify(localPrefs));
  };

  return (
    <div className="preferences-panel" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h3>Artwork Preferences</h3>
      {loading && <p>Loading options from The Met...</p>}

      {/* Styles */}
      <div style={{ marginBottom: "1rem" }}>
        <h4>Styles</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {allStyles.map(style => (
            <label key={style}>
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

      {/* Mediums */}
      <div style={{ marginBottom: "1rem" }}>
        <h4>Mediums</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {allMediums.map(medium => (
            <label key={medium}>
              <input
                type="checkbox"
                checked={localPrefs.mediums.includes(medium)}
                onChange={() => handleChange("mediums", medium)}
              />
              {medium}
            </label>
          ))}
        </div>
      </div>

      {/* Periods */}
      <div style={{ marginBottom: "1rem" }}>
        <h4>Periods</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {allPeriods.map(period => (
            <label key={period}>
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

      <button style={{ marginTop: "1.5rem" }} onClick={handleSave}>
        Save Preferences
      </button>
    </div>
  );
}

export default Preferences;

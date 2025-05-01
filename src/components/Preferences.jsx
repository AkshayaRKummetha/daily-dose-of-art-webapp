import React, { useState, useEffect } from "react";

// Defining available styles and periods (customize as needed)
const STYLES = ["Impressionism", "Modern", "Renaissance", "Baroque", "Egyptian", "Abstract"];
const PERIODS = ["19th Century", "20th Century", "21st Century", "Ancient", "Medieval"];

function Preferences({ preferences, setPreferences }) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  // Handling checkbox change for styles or periods
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

  return (
    <div className="preferences-panel" style={{ margin: "2rem 0" }}>
      <h3>Choose Art Preferences</h3>
      <div>
        <strong>Styles:</strong>
        {STYLES.map((style) => (
          <label key={style} style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={localPrefs.styles.includes(style)}
              onChange={() => handleChange("styles", style)}
            />
            {style}
          </label>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <strong>Periods:</strong>
        {PERIODS.map((period) => (
          <label key={period} style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={localPrefs.periods.includes(period)}
              onChange={() => handleChange("periods", period)}
            />
            {period}
          </label>
        ))}
      </div>
      <button style={{ marginTop: "1.5rem" }} onClick={handleSave}>
        Save Preferences
      </button>
    </div>
  );
}

export default Preferences;

import React, { useState, useEffect } from "react";
import "./Preferences.css";

// Initial filter options
const INITIAL_STYLES = ["Impressionism", "Modern", "Renaissance", "Abstract"];
const INITIAL_MEDIUMS = ["Drawing", "Painting", "Sculpture", "Photography"];

function Preferences({ preferences, setPreferences }) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleFilterChange = (type, value) => {
    setLocalPrefs(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  return (
    <div className="preferences-panel">
      <h3>Artwork Preferences</h3>

      {/* Medium Filters */}
      <div className="filter-section">
        <h4>Mediums</h4>
        <div className="filter-options">
          {INITIAL_MEDIUMS.map(medium => (
            <label key={medium}>
              <input
                type="checkbox"
                checked={localPrefs.mediums.includes(medium)}
                onChange={() => handleFilterChange('mediums', medium)}
              />
              {medium}
            </label>
          ))}
        </div>
      </div>

      {/* Style Filters */}
      <div className="filter-section">
        <h4>Styles</h4>
        <div className="filter-options">
          {INITIAL_STYLES.map(style => (
            <label key={style}>
              <input
                type="checkbox"
                checked={localPrefs.styles.includes(style)}
                onChange={() => handleFilterChange('styles', style)}
              />
              {style}
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={() => {
          setPreferences(localPrefs);
          localStorage.setItem('artPreferences', JSON.stringify(localPrefs));
        }}
      >
        Apply Filters
      </button>
    </div>
  );
}

export default Preferences;

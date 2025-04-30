import React, { useEffect, useState } from "react";
import Parser from "rss-parser";

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExhibitions() {
      setLoading(true);
      setError("");
      try {
        const parser = new Parser();
        // Use a CORS proxy since the RSS feed is not CORS-enabled
        const CORS_PROXY = "https://api.allorigins.win/get?url=";
        const RSS_URL = encodeURIComponent("https://www.metmuseum.org/exhibitions.rss");
        const response = await fetch(`${CORS_PROXY}${RSS_URL}`);
        const data = await response.json();
        const feed = await parser.parseString(data.contents);
        setExhibitions(feed.items || []);
      } catch (err) {
        setError("Failed to load exhibitions.");
      }
      setLoading(false);
    }
    fetchExhibitions();
  }, []);

  if (loading) return <div className="loader">Loading exhibitions...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!exhibitions.length) return <div>No exhibitions found.</div>;

  return (
    <section className="exhibitions-section" id="exhibitions">
      <h2>Current Exhibitions</h2>
      <div className="exhibitions-list">
        {exhibitions.map((ex, i) => (
          <div className="exhibition-card" key={i}>
            {ex.enclosure && ex.enclosure.url ? (
              <img src={ex.enclosure.url} alt={ex.title} />
            ) : (
              <img src="/default-exhibition.jpg" alt="Exhibition" />
            )}
            <div>
              <h3>{ex.title}</h3>
              <p className="exhibition-dates">
                {ex.pubDate ? new Date(ex.pubDate).toLocaleDateString() : ""}
              </p>
              <p>{ex.contentSnippet || ex.content || ""}</p>
              <a href={ex.link} target="_blank" rel="noopener noreferrer">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

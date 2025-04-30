import { useEffect, useState } from "react";

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/exhibitions.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch exhibitions.");
        return res.json();
      })
      .then((data) => {
        setExhibitions(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load exhibitions at this time.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading exhibitions...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section className="exhibitions-section" id="exhibitions">
      <h2>Current Exhibitions</h2>
      <div className="exhibitions-list">
        {exhibitions.map((ex, i) => (
          <div className="exhibition-card" key={i}>
            <img src={ex.image} alt={ex.title} />
            <div>
              <h3>{ex.title}</h3>
              <p className="exhibition-dates">{ex.dates}</p>
              <p>{ex.description}</p>
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

import React, { useEffect, useState } from "react";

const BACKEND_URL = "<OVDE_UNESI_BACKEND_URL>"; // npr. https://local-helper-backend.vercel.app

function App() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState("");
  const [error, setError] = useState("");

  const fetchIdeas = async (weatherParam = "") => {
    setLoading(true);
    setError("");
    try {
      let url = `${BACKEND_URL}/ideas`;
      if (weatherParam) url += `?weather=${weatherParam}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Greška u preuzimanju ideja");
      const data = await res.json();
      setIdeas(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleWeatherChange = (e) => {
    setWeather(e.target.value);
    fetchIdeas(e.target.value);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Local Helper</h1>
      <p>3 dnevne ideje za aktivnosti u Beogradu</p>
      <label>
        Vreme:
        <select value={weather} onChange={handleWeatherChange} style={{ marginLeft: 8 }}>
          <option value="">Bilo koje</option>
          <option value="sunny">Sunčano</option>
          <option value="rainy">Kišovito</option>
        </select>
      </label>
      <hr />
      {loading ? (
        <p>Učitavanje...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {ideas.map((idea) => (
            <li key={idea.id} style={{ marginBottom: 24, border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <span style={{ fontSize: 12, color: "#888" }}>
                Tip: {idea.type} | Vreme: {idea.weather}
              </span>
              <br />
              <a href={idea.link} target="_blank" rel="noopener noreferrer">Više informacija</a>
            </li>
          ))}
        </ul>
      )}
      <hr />
      <h2>Podrži projekat</h2>
      <p>Doniraj za razvoj Local Helper-a:</p>
      <a href="https://www.buymeacoffee.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style={{ height: 40 }} />
      </a>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const BACKEND_URL = "<OVDE_UNESI_BACKEND_URL>"; // npr. https://local-helper-backend.vercel.app
const CITIES = ["Beograd", "Novi Sad", "Subotica"];
const TYPES = ["outdoor", "indoor", "food", "family", "culture"];

function getWeatherIcon(weather) {
  if (weather === "sunny") return "☀️";
  if (weather === "rainy") return "🌧️";
  return "🌤️";
}

function App() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState("Beograd");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const fetchIdeas = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      let url = `${BACKEND_URL}/ideas`;
      const q = [];
      if (params.weather) q.push(`weather=${params.weather}`);
      if (params.city) q.push(`city=${params.city}`);
      if (params.type) q.push(`type=${params.type}`);
      if (q.length) url += `?${q.join("&")}`;
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
    fetchIdeas({ weather, city, type });
    // eslint-disable-next-line
  }, [weather, city, type]);

  const handleFavorite = (id) => {
    let favs;
    if (favorites.includes(id)) {
      favs = favorites.filter((fid) => fid !== id);
    } else {
      favs = [...favorites, id];
    }
    setFavorites(favs);
    localStorage.setItem("favorites", JSON.stringify(favs));
  };

  return (
    <>
      <head>
        <title>Local Helper</title>
        <meta name="description" content="3 dnevne ideje za aktivnosti u tvom gradu" />
        <meta property="og:title" content="Local Helper" />
        <meta property="og:description" content="3 dnevne ideje za aktivnosti u tvom gradu" />
      </head>
      <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
        <img src="/logo.png" alt="Local Helper logo" style={{ width: 90, display: "block", margin: "0 auto 8px auto" }} />
        <h1 style={{ textAlign: "center" }}>Local Helper</h1>
        <p style={{ textAlign: "center" }}>3 dnevne ideje za aktivnosti u tvom gradu</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <label>
            Grad:
            <select value={city} onChange={e => setCity(e.target.value)} style={{ marginLeft: 8 }}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            Vreme:
            <select value={weather} onChange={e => setWeather(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="">Bilo koje</option>
              <option value="sunny">Sunčano</option>
              <option value="rainy">Kišovito</option>
            </select>
          </label>
          <label>
            Tip:
            <select value={type} onChange={e => setType(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="">Bilo koji</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <hr />
        {loading ? (
          <Loader />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {ideas.map((idea) => (
              <li key={idea.id} style={{ marginBottom: 24, border: "1px solid #eee", borderRadius: 8, padding: 16, position: "relative" }}>
                <button
                  onClick={() => handleFavorite(idea.id)}
                  style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", fontSize: 22 }}
                  title={favorites.includes(idea.id) ? "Ukloni iz omiljenih" : "Dodaj u omiljene"}
                  aria-label="favorite"
                >
                  {favorites.includes(idea.id) ? "★" : "☆"}
                </button>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
                <span style={{ fontSize: 14, color: "#888" }}>
                  {getWeatherIcon(idea.weather)} {idea.weather} | {idea.type} | {idea.city}
                </span>
                <br />
                <a href={idea.link} target="_blank" rel="noopener noreferrer">Više informacija</a>
              </li>
            ))}
          </ul>
        )}
        <hr />
        <h2>Omiljene ideje</h2>
        {favorites.length === 0 ? <p>Nema omiljenih ideja.</p> : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {ideas.filter(i => favorites.includes(i.id)).map(idea => (
              <li key={idea.id} style={{ marginBottom: 12 }}>
                {idea.title}
                <button onClick={() => handleFavorite(idea.id)} style={{ marginLeft: 8, fontSize: 16 }}>Ukloni</button>
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
    </>
  );
}

export default App;

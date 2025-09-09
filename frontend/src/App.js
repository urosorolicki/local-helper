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
      <div style={{
        maxWidth: 520,
        margin: "40px auto",
        fontFamily: "'Nunito', 'Comic Sans MS', 'Comic Sans', cursive, sans-serif",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 32px 0 #0001",
        padding: 32,
        position: "relative"
      }}>
        <img src="/logo.png" alt="Local Helper logo" style={{ width: 110, display: "block", margin: "0 auto 18px auto", borderRadius: 20, boxShadow: "0 2px 12px #0002" }} />
        <h1 style={{ textAlign: "center", fontWeight: 900, fontSize: 38, letterSpacing: 1, color: "#222" }}>Local Helper</h1>
        <p style={{ textAlign: "center", fontSize: 18, color: "#444", marginBottom: 28 }}>🎉 3 dnevne ideje za aktivnosti u tvom gradu 🎉</p>
        <div style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 24,
          justifyContent: "center"
        }}>
          <label style={{ fontWeight: 600, color: "#333" }}>
            Grad:
            <select value={city} onChange={e => setCity(e.target.value)} style={{ marginLeft: 8, borderRadius: 8, border: "1px solid #ddd", padding: "6px 12px", fontSize: 15 }}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 600, color: "#333" }}>
            Vreme:
            <select value={weather} onChange={e => setWeather(e.target.value)} style={{ marginLeft: 8, borderRadius: 8, border: "1px solid #ddd", padding: "6px 12px", fontSize: 15 }}>
              <option value="">Bilo koje</option>
              <option value="sunny">Sunčano</option>
              <option value="rainy">Kišovito</option>
            </select>
          </label>
          <label style={{ fontWeight: 600, color: "#333" }}>
            Tip:
            <select value={type} onChange={e => setType(e.target.value)} style={{ marginLeft: 8, borderRadius: 8, border: "1px solid #ddd", padding: "6px 12px", fontSize: 15 }}>
              <option value="">Bilo koji</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <div style={{ margin: "18px 0 28px 0", borderTop: "2px dashed #e0e0e0" }} />
        {loading ? (
          <Loader />
        ) : error ? (
          <div style={{ color: "#e74c3c", background: "#fff3f3", border: "1px solid #fbb", borderRadius: 8, padding: 16, margin: "16px 0", fontWeight: 600, textAlign: "center" }}>{error}</div>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {ideas.map((idea, idx) => (
              <li key={idea.id} style={{
                marginBottom: 28,
                borderRadius: 16,
                background: ["#f9fbe7", "#e3f2fd", "#fff8e1"][idx % 3],
                boxShadow: "0 2px 12px #0001",
                padding: 22,
                position: "relative",
                border: "2px solid #fff"
              }}>
                <button
                  onClick={() => handleFavorite(idea.id)}
                  style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 28, color: favorites.includes(idea.id) ? "#fbc02d" : "#bbb", transition: "color 0.2s" }}
                  title={favorites.includes(idea.id) ? "Ukloni iz omiljenih" : "Dodaj u omiljene"}
                  aria-label="favorite"
                >
                  {favorites.includes(idea.id) ? "★" : "☆"}
                </button>
                <h3 style={{ fontSize: 22, margin: "0 0 8px 0", color: "#222" }}>{idea.title}</h3>
                <p style={{ fontSize: 16, color: "#444", margin: "0 0 10px 0" }}>{idea.description}</p>
                <span style={{ fontSize: 15, color: "#666", fontWeight: 600 }}>
                  {getWeatherIcon(idea.weather)} {idea.weather} | {idea.type} | {idea.city}
                </span>
                <br />
                <a href={idea.link} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", fontWeight: 700, textDecoration: "none", fontSize: 15, marginTop: 8, display: "inline-block" }}>Više informacija</a>
              </li>
            ))}
          </ul>
        )}
        <div style={{ margin: "32px 0 24px 0", borderTop: "2px dashed #e0e0e0" }} />
        <h2 style={{ fontWeight: 900, fontSize: 26, color: "#222", marginBottom: 10 }}>Omiljene ideje</h2>
        {favorites.length === 0 ? <p style={{ color: "#888", fontSize: 16 }}>Nema omiljenih ideja.</p> : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {ideas.filter(i => favorites.includes(i.id)).map(idea => (
              <li key={idea.id} style={{ marginBottom: 12, fontSize: 16, color: "#444" }}>
                {idea.title}
                <button onClick={() => handleFavorite(idea.id)} style={{ marginLeft: 8, fontSize: 16, background: "#fffbe1", border: "1px solid #fbc02d", borderRadius: 6, padding: "2px 10px", cursor: "pointer", color: "#fbc02d", fontWeight: 700 }}>Ukloni</button>
              </li>
            ))}
          </ul>
        )}
        <div style={{ margin: "32px 0 24px 0", borderTop: "2px dashed #e0e0e0" }} />
        <h2 style={{ fontWeight: 900, fontSize: 26, color: "#222", marginBottom: 10 }}>Podrži projekat</h2>
        <p style={{ color: "#444", fontSize: 16 }}>Doniraj za razvoj Local Helper-a:</p>
        <a href="https://www.buymeacoffee.com/" target="_blank" rel="noopener noreferrer">
          <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style={{ height: 44, borderRadius: 8, boxShadow: "0 2px 8px #0002" }} />
        </a>
      </div>
    </>
  );
}

export default App;


import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const BACKEND_URL = "https://local-helper.onrender.com";
const CITIES = ["Beograd", "Novi Sad", "Subotica"];
const TYPES = ["outdoor", "indoor", "food", "family", "culture"];
const IDEA_EMOJIS = ["🎨", "🎲", "🎸", "🎤", "🎭", "🎡", "🎳", "🎯", "🎮", "🎬", "🎻", "🎷", "🎺", "🎹", "🧩", "🛹", "🚴", "🏞️", "🏰", "🏕️", "🏖️", "🍕", "🍦", "🍹", "🍔", "🍣", "🍩", "🍿", "☕", "🍷", "🍺"];

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
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: -1,
        background: "linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)"
      }} />
      <div style={{
        maxWidth: 540,
        margin: "48px auto 32px auto",
        fontFamily: "'Fredoka', 'Nunito', 'Comic Sans MS', 'Comic Sans', cursive, sans-serif",
        background: "rgba(255,255,255,0.85)",
        borderRadius: 22,
        boxShadow: "0 8px 40px 0 #0002",
        padding: 36,
        position: "relative",
        backdropFilter: "blur(2px)",
        border: "1.5px solid #fff7"
      }}>
  <img src="/logo.png" alt="gdedaidem.com logo" style={{ width: 110, display: "block", margin: "0 auto 18px auto", borderRadius: 20, boxShadow: "0 2px 12px #0002" }} />
    <h1 style={{ textAlign: "center", fontWeight: 900, fontSize: 38, letterSpacing: 1, color: "#222" }}>gdedaidem.com</h1>
  <p style={{ textAlign: "center", fontSize: 18, color: "#444", marginBottom: 28 }}>🎉 Gde da idem? Šta da radim u Beogradu? Svakog dana 3 najbolje ideje! 🎉</p>
        <div style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 28,
          justifyContent: "center"
        }}>
          <label style={{ fontWeight: 700, color: "#333", fontSize: 17, letterSpacing: 0.5 }}>
            Grad:
            <select value={city} onChange={e => setCity(e.target.value)} style={{ marginLeft: 8, borderRadius: 12, border: "1.5px solid #43c6ac", padding: "8px 16px", fontSize: 16, background: "#f8ffae", fontWeight: 600, boxShadow: "0 2px 8px #43c6ac22" }}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 700, color: "#333", fontSize: 17, letterSpacing: 0.5 }}>
            Vreme:
            <select value={weather} onChange={e => setWeather(e.target.value)} style={{ marginLeft: 8, borderRadius: 12, border: "1.5px solid #43c6ac", padding: "8px 16px", fontSize: 16, background: "#f8ffae", fontWeight: 600, boxShadow: "0 2px 8px #43c6ac22" }}>
              <option value="">Bilo koje</option>
              <option value="sunny">Sunčano</option>
              <option value="rainy">Kišovito</option>
            </select>
          </label>
          <label style={{ fontWeight: 700, color: "#333", fontSize: 17, letterSpacing: 0.5 }}>
            Tip:
            <select value={type} onChange={e => setType(e.target.value)} style={{ marginLeft: 8, borderRadius: 12, border: "1.5px solid #43c6ac", padding: "8px 16px", fontSize: 16, background: "#f8ffae", fontWeight: 600, boxShadow: "0 2px 8px #43c6ac22" }}>
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
              <li
                key={idea.id}
                style={{
                  marginBottom: 32,
                  borderRadius: 20,
                  background: ["#f9fbe7cc", "#e3f2fdcc", "#fff8e1cc"][idx % 3],
                  boxShadow: "0 6px 24px #43c6ac33, 0 1.5px 0 #fff7",
                  padding: 28,
                  position: "relative",
                  border: "2.5px solid #fff",
                  transition: "transform 0.18s cubic-bezier(.4,2,.6,1)",
                  cursor: "pointer",
                  overflow: "hidden",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.035)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <span style={{ fontSize: 36, position: "absolute", left: 18, top: 18, opacity: 0.18, userSelect: "none" }}>
                  {IDEA_EMOJIS[(idea.id * 7 + idx) % IDEA_EMOJIS.length]}
                </span>
                <button
                  onClick={() => handleFavorite(idea.id)}
                  style={{ position: "absolute", top: 16, right: 20, background: "#fffbe1", border: "1.5px solid #fbc02d", borderRadius: 10, cursor: "pointer", fontSize: 28, color: favorites.includes(idea.id) ? "#fbc02d" : "#bbb", transition: "color 0.2s", padding: "2px 12px", boxShadow: "0 2px 8px #fbc02d22" }}
                  title={favorites.includes(idea.id) ? "Ukloni iz omiljenih" : "Dodaj u omiljene"}
                  aria-label="favorite"
                >
                  {favorites.includes(idea.id) ? "★" : "☆"}
                </button>
                <h3 style={{ fontSize: 24, margin: "0 0 10px 0", color: "#222", fontWeight: 700, letterSpacing: 0.5 }}>{idea.title}</h3>
                <p style={{ fontSize: 17, color: "#444", margin: "0 0 12px 0", fontWeight: 500 }}>{idea.description}</p>
                <span style={{ fontSize: 16, color: "#666", fontWeight: 600, marginBottom: 4 }}>
                  {getWeatherIcon(idea.weather)} {idea.weather} | {idea.type} | {idea.city}
                </span>
                <a href={idea.link} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", fontWeight: 700, textDecoration: "none", fontSize: 16, marginTop: 10, display: "inline-block", borderBottom: "1.5px dashed #1976d2", paddingBottom: 2 }}>Više informacija</a>
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
    <p style={{ color: "#444", fontSize: 16 }}>Doniraj za razvoj gdedaidem.com sajta:</p>
        <a href="https://www.buymeacoffee.com/urosorolicki" target="_blank" rel="noopener noreferrer">
          <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style={{ height: 44, borderRadius: 8, boxShadow: "0 2px 8px #0002" }} />
        </a>
      </div>
    </>
  );
}

export default App;

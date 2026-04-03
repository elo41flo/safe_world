import React from "react";
import "../Style/parametres.css";
import "../App.css";

const Parametres = ({ userId, setTheme, currentTheme }) => {
  const SERVER_URL = "https://safe-world-back.vercel.app/";

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="settings-container">
      <h2 style={{ color: "var(--text-main)" }}>Paramètres de mon compte ⚙️</h2>

      {/* SECTION APPARENCE */}
      <div className="settings-section">
        <h3>Apparence</h3>
        <p>Choisis l'ambiance de ton espace :</p>
        <div className="theme-selector">
          <button
            className={`theme-btn ${currentTheme === "light" ? "active" : ""}`}
            onClick={() => changeTheme("light")}
          >
            ⚪ Blanc
          </button>

          <button
            className={`theme-btn ${currentTheme === "dark" ? "active" : ""}`}
            onClick={() => changeTheme("dark")}
          >
            ⚫ Noir
          </button>

          <button
            className={`theme-btn tech ${currentTheme === "tech" ? "active" : ""}`}
            onClick={() => changeTheme("tech")}
          >
            📟 Tech
          </button>

          <button
            className={`theme-btn cyber ${currentTheme === "cyber" ? "active" : ""}`}
            onClick={() => changeTheme("cyber")}
          >
            ⚡ Cyber
          </button>
        </div>
      </div>

      {/* SECTION SÉCURITÉ */}
      <div className="settings-section">
        <h3>Sécurité</h3>
        <button className="btn-logout" onClick={handleLogout}>
          Se déconnecter 🚪
        </button>
      </div>
    </div>
  );
};

export default Parametres;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../Style/Sidebar.css";

const Sidebar = ({ age, userId }) => {
  // 👈 On récupère userId ici
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    // On utilise window.location pour forcer le refresh et vider les états de App.jsx
    window.location.href = "/login";
  };

  return (
    <nav className="sidebar">
      {/* 1. Recherche (15+) */}
      {age >= 15 && (
        <div className="sidebar-search">
          <SearchBar />
        </div>
      )}

      <ul>
        <li>
          <NavLink to="/">🏠 Accueil</NavLink>
        </li>

        <li>
          {age < 15 ? (
            <NavLink to="/messages-proches">✉️ Messagerie (Proches)</NavLink>
          ) : (
            <NavLink to="/messages">✉️ Messagerie (Filtres)</NavLink>
          )}
        </li>

        <li>
          <NavLink to="/conseils">🛡️ Conseils & Pratiques</NavLink>
        </li>

        {age >= 15 && (
          <li>
            <NavLink to="/create-post">➕ Créer une publication</NavLink>
          </li>
        )}

        <li>
          <NavLink to="/parametres">⚙️ Paramètres</NavLink>
        </li>

        {/* --- SECTION CONNEXION / DÉCONNEXION --- */}
        <li
          style={{
            marginTop: "20px",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            paddingTop: "10px",
          }}
        >
          {userId ? (
            <button onClick={handleLogout} className="logout-btn">
              🚪 Se déconnecter
            </button>
          ) : (
            <NavLink to="/login" className="login-link">
              🔑 Se connecter / S'inscrire
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;

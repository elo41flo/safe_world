import React from "react";
import { Link } from "react-router-dom";
import logoSafe from "../assets/Safe.png";
import "../Style/Header.css";

// On récupère unreadCount ici 🎁
const Header = ({ unreadCount }) => {
  return (
    <header className="header-container">
      {/* Cliquer sur le logo ramène à l'accueil */}
      <Link to="/" className="logo-link">
        <img src={logoSafe} alt="Safe World Logo" className="logo-img" />
      </Link>

      <div className="header-actions">
        {/* On entoure la cloche d'un lien vers les messages/notifications */}
        <Link to="/messages" className="notification-link">
          <div className="notification-wrapper">
            <span>🔔 Notifications</span>
            {/* On affiche la pastille SEULEMENT s'il y a des messages non lus */}
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
        </Link>

        <Link to="/profil" style={{ textDecoration: "none" }}>
          <span className="profile-link">👤 Mon profil</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

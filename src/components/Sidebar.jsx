import React from "react";
import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar"; // 🔍 On importe la barre de recherche
import "../Style/Sidebar.css";

const Sidebar = ({ age }) => {
  return (
    <nav className="sidebar">
      {/* 1. La barre de recherche n'apparaît que pour les Ados et Adultes (15+) */}
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

        {/*{age >= 18 && (
          <li>
            <NavLink to="/espace-parent">👨‍👩‍👧 Espace Parent</NavLink>
          </li>
        )} */}

        <li>
          <NavLink to="/parametres">⚙️ Paramètres</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;

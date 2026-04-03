import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const SERVER_URL = "http://localhost:5000";

  // Cette fonction DOIT être appelée à chaque lettre
  const handleChange = async (e) => {
    const val = e.target.value;
    setQuery(val); // On met à jour l'input visuellement

    if (val.length > 0) {
      try {
        console.log("Recherche en cours pour :", val);
        const res = await fetch(`${SERVER_URL}/api/users/search/${val}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Erreur Fetch SearchBar :", err);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = (id) => {
    navigate(`/profil/${id}`);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Chercher un ami..."
        value={query}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", borderRadius: "20px" }}
      />

      {results.length > 0 && (
        <ul
          className="search-results"
          style={{
            position: "absolute",
            background: "white",
            zIndex: 1000,
            width: "100%",
            listStyle: "none",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          {results.map((u) => (
            <li
              key={u.id}
              onClick={() => handleSelect(u.id)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                color: "black",
              }}
            >
              {u.pseudo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

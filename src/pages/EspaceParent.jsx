import React, { useState, useEffect } from "react";

const EspaceParent = ({ enfantId = 2 }) => {
  const [prochePseudo, setProchePseudo] = useState("");
  const [proches, setProches] = useState([]);
  const [message, setMessage] = useState("");

  // 1. Charger la liste au démarrage
  const fetchProches = async () => {
    const response = await fetch(
      `http://localhost:5000/api/proches/${enfantId}`,
    );
    const data = await response.json();
    setProches(data);
  };

  useEffect(() => {
    fetchProches();
  }, [enfantId]);

  // 2. Ajouter un proche
  const handleAddProche = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/proches/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enfant_id: enfantId,
        proche_pseudo: prochePseudo,
      }),
    });
    if (response.ok) {
      setProchePseudo("");
      fetchProches(); // Rafraîchir la liste
    }
    const data = await response.json();
    setMessage(data.message);
  };

  // 3. Supprimer un proche
  const handleDelete = async (linkId) => {
    const response = await fetch(
      `http://localhost:5000/api/proches/${linkId}`,
      { method: "DELETE" },
    );
    if (response.ok) fetchProches();
  };

  return (
    <div style={containerStyle}>
      <h2>👨‍👩‍👧 Contrôle Parental</h2>

      <form onSubmit={handleAddProche} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Pseudo du proche..."
          value={prochePseudo}
          onChange={(e) => setProchePseudo(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={addBtnStyle}>
          Autoriser
        </button>
      </form>

      <h3>👥 Personnes autorisées :</h3>
      <div style={listStyle}>
        {proches.length > 0 ? (
          proches.map((p) => (
            <div key={p.link_id} style={itemStyle}>
              <span>@{p.pseudo}</span>
              <button
                onClick={() => handleDelete(p.link_id)}
                style={delBtnStyle}
              >
                Retirer
              </button>
            </div>
          ))
        ) : (
          <p>Aucun proche autorisé pour le moment. 🌿</p>
        )}
      </div>
      {message && (
        <p style={{ color: "#2f855a", marginTop: "10px" }}>{message}</p>
      )}
    </div>
  );
};

// --- STYLES ---
const containerStyle = {
  padding: "25px",
  border: "2px dashed #3182ce",
  borderRadius: "15px",
  background: "white",
};
const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e0",
  marginRight: "10px",
};
const addBtnStyle = {
  padding: "10px 20px",
  background: "#3182ce",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
const listStyle = {
  marginTop: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
  background: "#edf2f7",
  borderRadius: "8px",
};
const delBtnStyle = {
  background: "#e53e3e",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default EspaceParent;

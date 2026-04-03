import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Register.css";

const Register = ({ setAge, setPseudo }) => {
  // 1. On prépare un objet qui contient exactement ce que SQL attend
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    password: "",
    date_naissance: "", // On utilise le même nom que dans ta BDD
  });

  const navigate = useNavigate();

  // Fonction pour mettre à jour les champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 2. Envoi au serveur (port 5000)
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Mise à jour des infos globales dans App.jsx
        setPseudo(formData.pseudo);
        // On n'envoie plus juste un chiffre, mais la date
        setAge(formData.date_naissance);

        alert(`Bienvenue sur Safe World, ${formData.pseudo} ! 🌿`);
        navigate("/");
      } else {
        alert("Oups : " + (data.message || "Impossible de créer le compte."));
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert(
        "Le serveur ne répond pas. Vérifie que le serveur Node est lancé !",
      );
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Rejoindre Safe World 🌿</h2>
        <p>Crée ton compte pour partager en toute sécurité.</p>

        <input
          type="text"
          name="pseudo"
          placeholder="Ton pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Ton adresse email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* SECTION DATE DE NAISSANCE */}
        <label
          style={{
            fontSize: "14px",
            color: "#718096",
            alignSelf: "flex-start",
            marginLeft: "10%",
          }}
        >
          Ta date de naissance :
        </label>
        <input
          type="date"
          name="date_naissance" // Doit correspondre à la clé dans formData
          value={formData.date_naissance}
          onChange={handleChange}
          required
        />

        <button type="submit">S'inscrire</button>

        <p className="login-link">
          Déjà inscrit ?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "#38a169" }}
          >
            Se connecter
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;

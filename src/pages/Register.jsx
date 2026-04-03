import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 On ajoute Link ici
import "../Style/Register.css";

const Register = ({ setAge, setPseudo }) => {
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    password: "",
    date_naissance: "",
  });

  const navigate = useNavigate();

  // On utilise la variable d'environnement pour Vercel
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${SERVER_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setPseudo(formData.pseudo);
        setAge(formData.date_naissance);
        alert(`Bienvenue sur Safe World, ${formData.pseudo} ! 🌿`);
        navigate("/login"); // On redirige vers le login après l'inscription
      } else {
        alert("Oups : " + (data.message || "Impossible de créer le compte."));
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Le serveur ne répond pas. Vérifie ta connexion !");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Rejoindre Safe World 🌿</h2>
        <p style={{ color: "var(--text-main)" }}>
          Crée ton compte pour partager en toute sécurité.
        </p>

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

        <label
          style={{
            fontSize: "14px",
            color: "var(--text-main)",
            alignSelf: "flex-start",
            marginLeft: "10%",
            opacity: 0.8,
          }}
        >
          Ta date de naissance :
        </label>
        <input
          type="date"
          name="date_naissance"
          value={formData.date_naissance}
          onChange={handleChange}
          required
        />

        <button type="submit">S'inscrire</button>

        {/* --- LE LIEN VERS LOGIN --- */}
        <p
          className="login-link"
          style={{ color: "var(--text-main)", marginTop: "15px" }}
        >
          Déjà inscrit ?{" "}
          <Link
            to="/login"
            style={{
              color: "#38a169",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 On importe Link ici

const Login = ({ setAge, setPseudo, setUserId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // On récupère l'URL de l'API via les variables d'environnement
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${SERVER_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.user.id);
        localStorage.setItem("userId", data.user.id);
        setAge(data.user.age);
        setPseudo(data.user.pseudo);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur login:", error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleLogin}>
        <h2>Connexion à Safe World 🛡️</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>

        {/* --- AJOUT DU LIEN VERS L'INSCRIPTION --- */}
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            color: "var(--text-main)",
          }}
        >
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            style={{
              color: "#38a169",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Inscris-toi ici !
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

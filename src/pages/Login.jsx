import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 📍 On ajoute setUserId dans les props ici
const Login = ({ setAge, setPseudo, setUserId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🚀 CRITIQUE : On met à jour l'ID global de l'utilisateur
        // On récupère data.user.id qui vient de ton serveur (SQL)
        setUserId(data.user.id);

        // Bonus : On le stocke dans le localStorage pour ne pas être déconnecté au refresh
        localStorage.setItem("userId", data.user.id);

        setAge(data.user.age);
        setPseudo(data.user.pseudo);

        navigate("/"); // Retour à l'accueil
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
      </form>
    </div>
  );
};

export default Login;

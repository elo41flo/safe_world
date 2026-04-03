import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Profil from "./pages/Profil";
import EspaceParent from "./pages/EspaceParent";
import Parametres from "./pages/parametres";
import CreatePost from "./components/CreatePost";

function App() {
  const SERVER_URL = "http://localhost:5000";

  // 1. États globaux (Auth & Profil)
  const [userId, setUserId] = useState(
    () => Number(localStorage.getItem("userId")) || null,
  );
  const [userAge, setUserAge] = useState(
    () => Number(localStorage.getItem("userAge")) || 18,
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || "Invité",
  );

  // 2. Gestion du Thème
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  // 3. État des VRAIES Notifications
  const [notifications, setNotifications] = useState([]);

  // --- EFFET : Application du Thème ---
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- EFFET : Récupération des notifications depuis l'API ---
  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch(`${SERVER_URL}/api/notifications/${userId}`);
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (err) {
          console.error("Erreur chargement notifications:", err);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Check toutes les 30s
      return () => clearInterval(interval);
    }
  }, [userId]);

  // --- FONCTION : Marquer une notification comme lue ---
  const markAsRead = async (id) => {
    try {
      await fetch(`${SERVER_URL}/api/notifications/${id}/read`, {
        method: "PUT",
      });
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)),
      );
    } catch (err) {
      console.error("Erreur lecture notification:", err);
    }
  };

  // Calcul du nombre de non-lus pour le Header
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div
      className="app-layout"
      style={{ display: "flex", minHeight: "100vh", width: "100vw" }}
    >
      <aside style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar age={userAge} />
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* On passe le compteur au Header pour la pastille rouge */}
        <Header currentUser={userName} unreadCount={unreadCount} />

        <main
          style={{
            padding: "30px",
            flex: 1,
            backgroundColor: "var(--bg-color)",
            transition: "background-color 0.3s ease",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h2
                    style={{ color: "var(--text-main)", marginBottom: "20px" }}
                  >
                    Bonjour {userName} ! 👋
                  </h2>
                  <Feed currentUser={userName} />
                </>
              }
            />

            <Route
              path="/register"
              element={<Register setAge={setUserAge} setPseudo={setUserName} />}
            />
            <Route
              path="/login"
              element={
                <Login
                  setAge={setUserAge}
                  setPseudo={setUserName}
                  setUserId={setUserId}
                />
              }
            />

            <Route
              path="/profil"
              element={
                <Profil
                  userId={userId}
                  currentUserId={userId}
                  setUserName={setUserName}
                />
              }
            />
            <Route
              path="/profil/:id"
              element={
                <Profil
                  userId={userId}
                  currentUserId={userId}
                  setUserName={setUserName}
                />
              }
            />

            {/* Page Messages avec les vraies notifications et la fonction markAsRead */}
            <Route
              path="/messages"
              element={
                <Messages
                  currentUserId={userId}
                  notifications={notifications}
                  markAsRead={markAsRead}
                />
              }
            />

            <Route
              path="/parametres"
              element={
                <Parametres
                  userId={userId}
                  setTheme={setTheme}
                  currentTheme={theme}
                />
              }
            />
            <Route path="/conseils" element={<Conseils />} />
            <Route
              path="/espace-parent"
              element={<EspaceParent enfantId={userId} />}
            />
            <Route path="/create-post" element={<CreatePost />} />

            <Route
              path="*"
              element={
                <h2
                  style={{
                    color: "var(--text-main)",
                    textAlign: "center",
                    marginTop: "50px",
                  }}
                >
                  Oups ! Page inexistante. 🧐
                </h2>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const Conseils = () => (
  <div
    className="card"
    style={{
      backgroundColor: "var(--card-bg)",
      color: "var(--text-main)",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    }}
  >
    <h2>🛡️ Conseils Sécurité</h2>
    <ul>
      <li>Ne partage jamais ton mot de passe.</li>
      <li>N'ajoute que des personnes connues.</li>
      <li>Signale tout comportement suspect.</li>
    </ul>
  </div>
);

export default App;

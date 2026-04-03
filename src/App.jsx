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
  // On utilise les variables d'environnement pour Vercel
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  // 1. États globaux
  const [userId, setUserId] = useState(
    () => Number(localStorage.getItem("userId")) || null,
  );
  const [userAge, setUserAge] = useState(
    () => Number(localStorage.getItem("userAge")) || 18,
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || "Invité",
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [notifications, setNotifications] = useState([]);

  // 2. Application du Thème
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3. Récupération des notifications
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
          console.error("Erreur notifications:", err);
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId, SERVER_URL]);

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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div
      className="app-layout"
      style={{ display: "flex", minHeight: "100vh", width: "100vw" }}
    >
      {/* ✅ LA SIDEBAR EST ICI (FIXE ET UNIQUE) */}
      <aside style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar age={userAge} userId={userId} />
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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

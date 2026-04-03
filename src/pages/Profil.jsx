import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Style/Profil.css";
import { cleanContent } from "../utils/moderateur";
import { calculateAge } from "../utils/dateUtils";

const Profil = ({ userId, currentUserId, setUserName }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Si 'id' est présent dans l'URL, on affiche ce profil, sinon on affiche le nôtre
  const targetId = id || userId;

  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // États pour la modification
  const [tempBio, setTempBio] = useState("");
  const [tempPseudo, setTempPseudo] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const SERVER_URL = "http://localhost:5000";

  useEffect(() => {
    // 1. Charger les infos du profil cible
    fetch(`${SERVER_URL}/api/users/profile/${targetId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setTempBio(data.bio || "");
        setTempPseudo(data.pseudo || "");
      })
      .catch((err) => console.error("Erreur chargement profil:", err));

    // 2. Charger les publications de ce profil
    fetch(`${SERVER_URL}/api/posts/user/${targetId}`)
      .then((res) => res.json())
      .then((data) => setUserPosts(data));

    // 3. Vérifier si on est déjà amis (uniquement si on regarde le profil de quelqu'un d'autre)
    if (id && id !== currentUserId) {
      fetch(`${SERVER_URL}/api/friends/${currentUserId}`)
        .then((res) => res.json())
        .then((friends) => {
          // On vérifie si l'ID du profil visité est dans ma liste d'amis
          const check = friends.some((f) => Number(f.id) === Number(id));
          setIsFriend(check);
        })
        .catch((err) => console.error("Erreur vérification amitié:", err));
    }
  }, [targetId, currentUserId, id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddFriend = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/friends/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, friendId: targetId }),
      });
      if (res.ok) {
        setIsFriend(true);
        alert("Ami ajouté ! Vous pouvez maintenant discuter. 🤝");
      }
    } catch (err) {
      console.error("Erreur ajout ami:", err);
    }
  };

  const handleSaveProfile = async () => {
    const safeBio = cleanContent(tempBio);
    const safePseudo = cleanContent(tempPseudo);

    const formData = new FormData();
    formData.append("pseudo", safePseudo);
    formData.append("bio", safeBio);
    if (selectedFile) formData.append("avatar", selectedFile);

    try {
      const response = await fetch(
        `${SERVER_URL}/api/users/profile/${targetId}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (response.ok) {
        const result = await response.json();
        setUser({
          ...user,
          pseudo: safePseudo,
          bio: safeBio,
          avatar_url: result.avatar_url || user.avatar_url,
        });

        // Mise à jour globale du nom si c'est notre profil
        if (Number(targetId) === Number(currentUserId) && setUserName) {
          setUserName(safePseudo);
        }

        setIsEditing(false);
        setPreviewUrl(null);
        alert("Profil mis à jour ! ✨");
      }
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    }
  };

  if (!user) return <div className="loading">Chargement du profil... 🌿</div>;

  const isMyOwnProfile = Number(targetId) === Number(currentUserId);

  return (
    <div className="profile-container">
      <header className="profile-header">
        {/* SECTION AVATAR */}
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" />
            ) : user.avatar_url ? (
              <img src={`${SERVER_URL}${user.avatar_url}`} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                {user.pseudo?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {isEditing && isMyOwnProfile && (
            <label className="btn-upload-avatar">
              📷
              <input
                type="file"
                onChange={handleFileChange}
                hidden
                accept="image/*"
              />
            </label>
          )}
        </div>

        {/* SECTION INFOS */}
        <div className="profile-info">
          <div className="profile-top-row">
            {isEditing ? (
              <input
                className="edit-pseudo-input"
                value={tempPseudo}
                onChange={(e) => setTempPseudo(e.target.value)}
              />
            ) : (
              <h2>{user.pseudo}</h2>
            )}

            <div className="profile-actions">
              {isMyOwnProfile ? (
                <button
                  className="btn-edit"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Annuler" : "Modifier le profil"}
                </button>
              ) : (
                <div className="friend-actions">
                  {!isFriend ? (
                    <button
                      className="btn-add-friend"
                      onClick={handleAddFriend}
                    >
                      ➕ Ajouter en ami
                    </button>
                  ) : (
                    <button
                      className="btn-message"
                      onClick={() => navigate("/messages")}
                    >
                      ✉️ Envoyer un message
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <span>
              <strong>{userPosts.length}</strong> publications
            </span>
            <span>
              <strong>{calculateAge(user.date_naissance)}</strong> ans
            </span>
          </div>

          <div className="profile-bio-section">
            {isEditing ? (
              <div className="bio-edit-box">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Ta bio safe..."
                />
                <button onClick={handleSaveProfile} className="btn-save">
                  Enregistrer
                </button>
              </div>
            ) : (
              <p className="profile-bio">
                {user.bio || "Bienvenue sur mon espace Safe ! ✨"}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* GRILLE DE PUBLICATIONS */}
      <div className="profile-grid">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post.id} className="grid-item">
              {post.media_url ? (
                <img src={`${SERVER_URL}${post.media_url}`} alt="Post" />
              ) : (
                <div className="text-post-placeholder">
                  <p>{post.content}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-posts">Aucune publication pour le moment. 🌿</p>
        )}
      </div>
    </div>
  );
};

export default Profil;

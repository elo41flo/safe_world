import React, { useState } from "react";
import "../Style/Post.css";
import { cleanContent } from "../utils/moderateur"; // On n'oublie pas la sécurité !

const Post = ({ data, onDelete, onLike }) => {
  const SERVER_URL = "http://localhost:5000";

  // États pour les commentaires
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Fonction pour charger les commentaires depuis l'API
  const toggleComments = async () => {
    if (!showComments) {
      try {
        const response = await fetch(
          `${SERVER_URL}/api/posts/${data.id}/comments`,
        );
        const result = await response.json();
        setComments(result);
      } catch (err) {
        console.error("Erreur chargement commentaires:", err);
      }
    }
    setShowComments(!showComments);
  };

  // Fonction pour envoyer un nouveau commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Modération automatique
    const safeComment = cleanContent(newComment);

    try {
      const response = await fetch(`${SERVER_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: data.id,
          user_id: 1, // À rendre dynamique avec l'utilisateur connecté plus tard
          content: safeComment,
        }),
      });

      if (response.ok) {
        const savedComment = await response.json();
        // On l'ajoute à la liste locale avec le pseudo "Moi" ou Elo pour l'instant
        setComments([...comments, { ...savedComment, author: "Moi" }]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Erreur envoi commentaire:", err);
    }
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <div>
          <strong>@{data.author || "Anonyme"}</strong>
          <span className="post-mood">{data.mood}</span>
        </div>
        <small className="post-date">
          {data.created_at
            ? new Date(data.created_at).toLocaleTimeString()
            : data.date}
        </small>
      </div>

      <div className="post-media-container">
        {data.media_url ? (
          data.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
            <video controls className="post-video">
              <source src={`${SERVER_URL}${data.media_url}`} type="video/mp4" />
            </video>
          ) : (
            <img
              src={`${SERVER_URL}${data.media_url}`}
              alt="Publication"
              className="post-img"
            />
          )
        ) : (
          <div className="post-image-placeholder">
            <span>📷 Pas de média</span>
          </div>
        )}
      </div>

      <p className="post-content">{data.content}</p>

      <div className="post-actions">
        <button
          onClick={() => onLike(data.id)}
          className={data.likes_count > 0 ? "btn-like-active" : ""}
        >
          ❤️ {data.likes_count > 0 ? data.likes_count : ""} J'aime
        </button>

        {/* Le bouton déclenche l'affichage des commentaires */}
        <button onClick={toggleComments}>💬 Commenter</button>

        <button onClick={() => onDelete(data.id)} className="btn-delete">
          🗑️
        </button>
      </div>

      {/* SECTION COMMENTAIRES */}
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <strong>@{c.author}</strong>: {c.content}
                </div>
              ))
            ) : (
              <p className="no-comments">
                Pas encore de commentaires safe ici... 🌿
              </p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Écris un commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      )}
    </article>
  );
};

export default Post;

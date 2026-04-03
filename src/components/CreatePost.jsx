import React, { useState, useEffect } from "react";
import "../Style/CreatePost.css";

const CreatePost = ({ onAddPost, defaultAuthor }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null); // Pour stocker le fichier choisi
  const fileInputRef = React.useRef(null); // Pour cliquer sur l'input caché

  const handleSubmit = (e) => {
    e.preventDefault();
    // On envoie le texte + le fichier à la fonction addPost du Feed
    onAddPost({ author: defaultAuthor, content, mood: "📝", file });
    setContent("");
    setFile(null);
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <input type="text" value={defaultAuthor} disabled />
        <textarea
          placeholder="Partagez quelque chose de Safe..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Input caché pour les fichiers */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*,video/*"
        />

        <div className="create-post-actions">
          <button type="button" onClick={() => fileInputRef.current.click()}>
            📷 {file ? "Fichier prêt !" : "Photo / Vidéo"}
          </button>
          <button type="submit" className="btn-publish">
            Publier sur Safe World
          </button>
        </div>
        {file && (
          <p style={{ fontSize: "0.8em", color: "green" }}>📎 {file.name}</p>
        )}
      </form>
    </div>
  );
};

export default CreatePost;

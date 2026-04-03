import React, { useState, useEffect } from "react";
import Post from "./Post";
import CreatePost from "./CreatePost";
import "../Style/Feed.css";
import { cleanContent } from "../utils/moderateur";

const Feed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);

  // --- 1. CHARGEMENT DEPUIS LA BDD ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Erreur SQL lors du chargement :", error);
      }
    };
    fetchPosts();
  }, []);

  // --- 2. PUBLIER (TEXTE FILTRÉ + MÉDIA) ---
  const addPost = async (newPostData) => {
    // Application du filtre Safe IA sur le texte
    const filteredContent = cleanContent(newPostData.content);

    // On prépare un FormData car on a un fichier (Multer l'attend comme ça)
    const formData = new FormData();
    formData.append("user_id", 1); // ID fixe pour l'instant
    formData.append("author", newPostData.author);
    formData.append("content", filteredContent);
    formData.append("mood", newPostData.mood);

    // Si une photo ou vidéo est jointe dans CreatePost
    if (newPostData.file) {
      formData.append("media", newPostData.file);
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        // /!\ Note : Pas de Header "Content-Type", le navigateur le met seul pour FormData
        body: formData,
      });

      if (response.ok) {
        const savedPost = await response.json();

        // On ajoute le post retourné par le serveur (avec sa vraie URL média) en haut de la liste
        setPosts([savedPost, ...posts]);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi au serveur :", error);
    }
  };

  // --- 3. SUPPRIMER ---
  const deletePost = async (idToDelete) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${idToDelete}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== idToDelete));
      }
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  // --- 4. LIKER ---
  const likePost = async (idToLike) => {
    // Optionnel : tu pourras ajouter une route PUT côté serveur pour sauvegarder les likes
    const updatedPosts = posts.map((post) => {
      if (post.id === idToLike) {
        return { ...post, likes_count: (post.likes_count || 0) + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div className="feed-container">
      {/* Formulaire qui envoie maintenant des objets avec fichiers */}
      <CreatePost onAddPost={addPost} defaultAuthor={currentUser} />

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              data={post}
              onDelete={deletePost}
              onLike={likePost}
            />
          ))
        ) : (
          <p className="no-posts-message">
            Aucun post pour le moment. Soyez le premier ! 🌿
          </p>
        )}
      </div>
    </div>
  );
};

export default Feed;

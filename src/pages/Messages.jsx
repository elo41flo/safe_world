import React, { useState, useEffect, useRef } from "react";
import "../Style/Messages.css";

const Messages = ({ currentUserId }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 💡 Ref pour le scroll automatique
  const messagesEndRef = useRef(null);

  const SERVER_URL = "http://localhost:5000";

  // Fonction pour scroller en bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroller à chaque fois que la liste de messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Charger la liste des amis
  useEffect(() => {
    fetch(`${SERVER_URL}/api/friends/${currentUserId}`)
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.error("Erreur contacts:", err));
  }, [currentUserId]);

  // 2. Charger la conversation
  useEffect(() => {
    if (selectedContact) {
      const fetchMessages = () => {
        fetch(
          `${SERVER_URL}/api/messages/${currentUserId}/${selectedContact.id}`,
        )
          .then((res) => res.json())
          .then((data) => setMessages(data))
          .catch((err) => console.error("Erreur messages:", err));
      };

      fetchMessages(); // Chargement immédiat

      // Polling pour le temps réel (toutes les 3s)
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedContact, currentUserId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const msgData = {
      sender_id: currentUserId,
      receiver_id: selectedContact.id,
      content: newMessage,
    };

    try {
      const res = await fetch(`${SERVER_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages((prev) => [...prev, savedMsg]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Erreur envoi message:", err);
    }
  };

  return (
    <div className="messages-page">
      {/* Colonne de gauche : Liste des amis */}
      <div className="contacts-list">
        <h3>Mes Amis 🤝</h3>
        <div className="contacts-container">
          {contacts.length > 0 ? (
            contacts.map((c) => (
              <div
                key={c.id}
                className={`contact-item ${selectedContact?.id === c.id ? "active" : ""}`}
                onClick={() => setSelectedContact(c)}
              >
                <div className="contact-avatar">
                  {c.pseudo?.charAt(0).toUpperCase()}
                </div>
                <span>{c.pseudo}</span>
              </div>
            ))
          ) : (
            <p className="no-friends">Aucun ami pour le moment.</p>
          )}
        </div>
      </div>

      {/* Colonne de droite : Fenêtre de chat */}
      <div className="chat-window">
        {selectedContact ? (
          <>
            <div className="chat-header">
              Discussion avec <strong>{selectedContact.pseudo}</strong>
            </div>

            <div className="messages-display">
              {messages.map((m, index) => {
                const isSentByMe =
                  Number(m.sender_id) === Number(currentUserId);
                return (
                  <div
                    key={index}
                    className={`message-wrapper ${isSentByMe ? "sent" : "received"}`}
                  >
                    <div className="message-bubble">{m.content}</div>
                  </div>
                );
              })}
              {/* Point de repère pour le scroll automatique */}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-form" onSubmit={handleSendMessage}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écris ton message safe..."
                autoComplete="off"
              />
              <button type="submit" disabled={!newMessage.trim()}>
                Envoyer
              </button>
            </form>
          </>
        ) : (
          <div className="no-contact">
            <div className="welcome-chat">💬</div>
            <p>Sélectionne un ami pour commencer à discuter !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

// src/utils/moderator.js

const forbiddenWords = ["Abruti", "Crétin", "Bâtard", "Bastard", "Bouffon", "Bouseux", "Bouseuse", "Branleur", "Branquignol", "Idiot", "ça me fait chier", "ça pue", "Casse couille", "Dégage", "Va te faire foutre", "Chiant", "Chiante", "Chier", "Connard", "Connasse", "Couillon", "Crétin", "Idiot", "Déguelasse", "Enculé", "Fuck", "Enfoiré", "Batard", "Bastard", "Con", "Connard", "Connasse", "Ferme ta gueule", "Gueule", "Fils de pute", "Pute", "Grosse vache", "Nique ta mère", "Sac à merde", "Ta gueule"]; // Ajoute ta liste ici

export const cleanContent = (text) => {
  let cleanedText = text;

  forbiddenWords.forEach((word) => {
    // Le "gi" permet de trouver le mot peu importe les majuscules/minuscules
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    
    // On remplace par des étoiles de la même longueur que le mot
    cleanedText = cleanedText.replace(regex, "*".repeat(word.length));
  });

  return cleanedText;
};
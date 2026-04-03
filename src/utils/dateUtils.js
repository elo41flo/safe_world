// src/utils/dateUtils.js

export const calculateAge = (birthDate) => {
  if (!birthDate) return "Âge inconnu";
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Si on n'a pas encore fêté son anniversaire cette année, on enlève 1 an
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
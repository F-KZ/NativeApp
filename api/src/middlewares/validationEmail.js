/**
 * Valide une adresse email selon plusieurs critères
 * @param {string} email - L'adresse email à valider
 * @returns {Error|null} Retourne une Error avec le message approprié ou null si valide
 */
const validateEmail = (email) => {
    if (typeof email !== 'string') {
      return new Error('Email doit être une chaîne de caractères');
    }
  
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      return new Error('Email est requis');
    }
  
    // Vérification de la longueur maximale raisonnable
    if (trimmedEmail.length > 20 || trimmedEmail.length < 5) {
      return new Error('Email doit être compris entre 5 et 20 caractères');
    }
  
    // Version plus rigoureuse de la validation d'email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return new Error('Format email invalide');
    }
  
    // Vérification que le domaine a au moins un point
    const domainPart = trimmedEmail.split('@')[1];
    if (!domainPart || domainPart.indexOf('.') === -1) {
      return new Error('Le domaine de l\'email est invalide');
    }
  
    return null;
  };
  
  export default validateEmail;
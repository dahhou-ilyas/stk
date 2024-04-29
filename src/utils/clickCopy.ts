// Path: /utils/clipboard.js
export const copyToClipboard = async (text:string) => {
    try {
      // Tenter de copier le texte dans le presse-papiers
      await navigator.clipboard.writeText(text);
      return true; // Copier avec succès
    } catch (error) {
      console.error('Erreur lors de la copie dans le presse-papiers :', error);
      return false; // En cas d'erreur, retourner false
    }
  };
  
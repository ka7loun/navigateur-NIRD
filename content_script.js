// Fonction pour injecter les règles CSS forçant les polices système
function injectSystemFonts(enable) {
  const styleId = 'nird-font-style';
  let styleElement = document.getElementById(styleId);

  if (enable) {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// Fonction pour neutraliser les vidéos et les GIFs
function neutralizeMedia(enable) {
  const selector = 'video, img[src$=".gif"], img[src$=".GIF"]';
  
  if (enable) {
    const mediaElements = document.querySelectorAll(selector);
    
    mediaElements.forEach(element => {
      // Vérifie si l'élément n'est pas déjà neutralisé
      if (!element.dataset.nirdOriginalDisplay) {
        // Sauvegarde l'état original
        element.dataset.nirdOriginalDisplay = element.style.display || '';
        
        // Création du placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'nird-media-placeholder';
        placeholder.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          color: #555;
          padding: 20px;
          font-family: sans-serif;
          font-size: 14px;
          width: ${element.clientWidth || 300}px;
          height: ${element.clientHeight || 150}px;
          box-sizing: border-box;
        `;
        placeholder.textContent = 'Média neutralisé (NIRD)';
        placeholder.dataset.nirdTargetId = Math.random().toString(36).substr(2, 9);
        element.dataset.nirdPlaceholderId = placeholder.dataset.nirdTargetId;

        // Insère le placeholder et cache l'élément
        element.parentNode.insertBefore(placeholder, element);
        element.style.display = 'none';
      }
    });
  } else {
    // Restauration des médias
    const placeholders = document.querySelectorAll('.nird-media-placeholder');
    placeholders.forEach(placeholder => {
      const targetId = placeholder.dataset.nirdTargetId;
      // Recherche l'élément caché correspondant (approximation via structure ou ID si on l'avait stocké plus rigoureusement)
      // Ici on va chercher l'élément qui a ce placeholder ID
      // Note: querySelectorAll est plus sûr
      const originalElement = document.querySelector(`[data-nird-placeholder-id="${targetId}"]`);
      
      if (originalElement) {
        originalElement.style.display = originalElement.dataset.nirdOriginalDisplay;
        delete originalElement.dataset.nirdOriginalDisplay;
        delete originalElement.dataset.nirdPlaceholderId;
      }
      placeholder.remove();
    });
  }
}

// Fonction principale pour appliquer les changements selon l'état
function applySobrietyMode(isEnabled) {
  injectSystemFonts(isEnabled);
  neutralizeMedia(isEnabled);
}

// Écoute des messages venant du popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSobriety") {
    applySobrietyMode(request.state);
    sendResponse({ status: "Mode updated" });
  }
});

// Initialisation : vérifie l'état au chargement de la page
chrome.storage.local.get(['sobrietyMode'], (result) => {
  if (result.sobrietyMode) {
    applySobrietyMode(true);
  }
});

// --- Bouclier de Confidentialité (Account 3) ---

// Liste des paramètres de suivi à supprimer
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'yclid', '_hsenc', '_hsmi', 'mc_cid', 'mc_eid'
];

// Fonction pour nettoyer une URL
function cleanUrl(url) {
  try {
    const urlObj = new URL(url);
    let cleaned = false;
    
    TRACKING_PARAMS.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        cleaned = true;
      }
    });
    
    return { url: urlObj.toString(), cleaned };
  } catch (e) {
    return { url, cleaned: false };
  }
}

// Interception des clics pour nettoyer les URLs
document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (link && link.href) {
    const { url, cleaned } = cleanUrl(link.href);
    
    if (cleaned) {
      // Si l'URL a été nettoyée, on met à jour le href
      link.href = url;
      
      // Envoi d'un message pour incrémenter le compteur
      chrome.runtime.sendMessage({ action: "updateMetrics", trackers: 1 });
      
      console.log("Lien nettoyé par NIRD :", url);
    }
  }
}, true);

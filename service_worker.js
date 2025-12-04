// Initialisation des métriques lors de l'installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['trackersCleaned', 'mediaNeutralized'], (result) => {
    // Initialiser les compteurs s'ils n'existent pas
    if (result.trackersCleaned === undefined) {
      chrome.storage.local.set({ trackersCleaned: 0 });
    }
    if (result.mediaNeutralized === undefined) {
      chrome.storage.local.set({ mediaNeutralized: 0 });
    }
  });

  // Création de l'entrée dans le menu contextuel
  chrome.contextMenus.create({
    id: "cleanAndCopyLink",
    title: "Nettoyer et Copier le Lien NIRD",
    contexts: ["link", "page", "selection"]
  });
});

// Liste des paramètres de suivi à supprimer (répliquée ici pour le Service Worker)
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'yclid', '_hsenc', '_hsmi', 'mc_cid', 'mc_eid'
];

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

// Écoute des clics sur le menu contextuel
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "cleanAndCopyLink") {
    let targetUrl = info.linkUrl || info.pageUrl;
    
    if (targetUrl) {
      const { url: cleanedUrl, cleaned } = cleanUrl(targetUrl);
      
      // Copier dans le presse-papiers (nécessite l'exécution d'un script dans la page active pour utiliser l'API Clipboard)
      // Note: En MV3, on peut utiliser navigator.clipboard dans le contexte de la page
      if (tab && tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            navigator.clipboard.writeText(text).then(() => {
              console.log('Lien nettoyé copié !');
            });
          },
          args: [cleanedUrl]
        });

        if (cleaned) {
           // Mise à jour des métriques si le lien a été nettoyé
           chrome.storage.local.get(['trackersCleaned'], (result) => {
             chrome.storage.local.set({ trackersCleaned: (result.trackersCleaned || 0) + 1 });
           });
        }
      }
    }
  }
});

// Écoute des messages pour la mise à jour des métriques (exemple d'utilisation future)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateMetrics") {
    chrome.storage.local.get(['trackersCleaned', 'mediaNeutralized'], (result) => {
      const newTrackers = (result.trackersCleaned || 0) + (request.trackers || 0);
      const newMedia = (result.mediaNeutralized || 0) + (request.media || 0);
      
      chrome.storage.local.set({
        trackersCleaned: newTrackers,
        mediaNeutralized: newMedia
      });
    });
  }
});

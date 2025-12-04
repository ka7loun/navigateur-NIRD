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

// Écoute des clics sur le menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "cleanAndCopyLink") {
    console.log("Action Nettoyer et Copier le Lien NIRD déclenchée");
    // La logique de nettoyage sera implémentée ici
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


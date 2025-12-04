// Initialisation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['trackersCleaned', 'mediaNeutralized'], (result) => {
    if (result.trackersCleaned === undefined) chrome.storage.local.set({ trackersCleaned: 0 });
    if (result.mediaNeutralized === undefined) chrome.storage.local.set({ mediaNeutralized: 0 });
  });

  chrome.contextMenus.create({
    id: "cleanAndCopyLink",
    title: "📋 Nettoyer et Copier le Lien (NIRD)",
    contexts: ["link", "page", "selection"]
  });
});

// Utilitaire de nettoyage (copié ici car le worker n'a pas accès au DOM/Content Script directement)
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
  } catch (e) { return { url, cleaned: false }; }
}

// Gestion du Menu Contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "cleanAndCopyLink") {
    // Priorité : Lien survolé > URL de la page > Texte sélectionné (si c'est une URL)
    let targetUrl = info.linkUrl || info.pageUrl || info.selectionText;

    if (targetUrl) {
      const { url: cleanedUrl, cleaned } = cleanUrl(targetUrl);

      // Pour copier dans le presse-papier, on doit injecter un script dans l'onglet actif
      if (tab && tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            // Cette fonction s'exécute dans la page web
            navigator.clipboard.writeText(text).then(() => {
              // Feedback visuel simple (optionnel)
              console.log('Lien NIRD copié :', text);
              alert('✅ Lien nettoyé et copié !'); 
            }).catch(err => console.error('Erreur copie:', err));
          },
          args: [cleanedUrl]
        });

        // Mettre à jour les stats si on a effectivement nettoyé quelque chose
        if (cleaned) {
          chrome.storage.local.get(['trackersCleaned'], (result) => {
            chrome.storage.local.set({ trackersCleaned: (result.trackersCleaned || 0) + 1 });
          });
        }
      }
    }
  }
});

// Gestion centralisée des messages
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
  } else if (request.action === "updateEcoScore") {
    // Stocke le CO2 de la page active (pas cumulé globalement pour l'instant, juste pour l'affichage temps réel)
    // On pourrait aussi le cumuler si on veut un "Total CO2 économisé"
    chrome.storage.local.set({ currentCo2: request.co2 });
  }
});

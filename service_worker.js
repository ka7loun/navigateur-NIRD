// Initialisation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['trackersCleaned'], (result) => {
    if (result.trackersCleaned === undefined) chrome.storage.local.set({ trackersCleaned: 0 });
  });

  chrome.contextMenus.create({
    id: "cleanAndCopyLink",
    title: "📋 Nettoyer et Copier le Lien (NIRD)",
    contexts: ["link", "page", "selection"]
  });
  
  // Initialiser le mode hibernation à OFF par défaut
  chrome.storage.local.get(['hibernateMode'], (result) => {
    if (result.hibernateMode === undefined) chrome.storage.local.set({ hibernateMode: false });
  });
});

// Utilitaire de nettoyage
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
    let targetUrl = info.linkUrl || info.pageUrl || info.selectionText;

    if (targetUrl) {
      const { url: cleanedUrl, cleaned } = cleanUrl(targetUrl);

      if (tab && tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            navigator.clipboard.writeText(text).then(() => {
              console.log('Lien NIRD copié :', text);
              alert('✅ Lien nettoyé et copié !'); 
            }).catch(err => console.error('Erreur copie:', err));
          },
          args: [cleanedUrl]
        });

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
    chrome.storage.local.get(['trackersCleaned'], (result) => {
      const newTrackers = (result.trackersCleaned || 0) + (request.trackers || 0);
      
      chrome.storage.local.set({
        trackersCleaned: newTrackers
      });
    });
  } else if (request.action === "updateEcoScore") {
    chrome.storage.local.set({ currentCo2: request.co2 });
  } else if (request.action === "triggerHibernation") {
     // Appel manuel ou automatique pour l'hibernation
     checkAndHibernateTabs();
  }
});


// --- 6. HIBERNATEUR D'ONGLETS (Durabilité) ---

async function checkAndHibernateTabs() {
  // Ne fonctionne que si le mode est activé
  const { hibernateMode } = await chrome.storage.local.get(['hibernateMode']);
  if (!hibernateMode) return;

  // Récupère tous les onglets
  const tabs = await chrome.tabs.query({ active: false, discarded: false, status: 'complete' });
  
  // Seuil : 10 minutes (600000 ms) d'inactivité en théorie (ici simplifié pour l'exemple : tous les inactifs)
  // Dans une vraie implémentation, on trackerait le lastAccessed.
  // Pour la démo NIRD, on hiberne agressivement les onglets inactifs > 30min (ou juste tous ceux qui ne sont pas audibles)
  
  let discardedCount = 0;
  for (const tab of tabs) {
    // Ne pas hiberner si l'onglet joue du son ou est épinglé (selon préférence)
    if (!tab.audible && !tab.pinned) {
      try {
        await chrome.tabs.discard(tab.id);
        discardedCount++;
      } catch (e) {
        console.error("Impossible d'hiberner l'onglet", tab.id, e);
      }
    }
  }
  
  if (discardedCount > 0) {
    console.log(`💤 NIRD : ${discardedCount} onglets hibernés pour économiser la RAM.`);
  }
}

// Vérification périodique (toutes les 5 minutes)
chrome.alarms.create('hibernationCheck', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'hibernationCheck') {
    checkAndHibernateTabs();
  }
});

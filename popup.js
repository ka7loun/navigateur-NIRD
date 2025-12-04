document.addEventListener('DOMContentLoaded', () => {
  const sobrietyToggle = document.getElementById('sobrietyMode');
  const trackersElement = document.getElementById('trackersCleaned');
  const mediaElement = document.getElementById('mediaNeutralized');
  const co2Element = document.getElementById('pageCo2');

  // 1. Lire l'état initial depuis le storage
  chrome.storage.local.get(['sobrietyMode', 'trackersCleaned', 'mediaNeutralized', 'currentCo2'], (result) => {
    // État du toggle
    sobrietyToggle.checked = result.sobrietyMode || false;

    // Mise à jour des métriques
    trackersElement.textContent = result.trackersCleaned || 0;
    mediaElement.textContent = result.mediaNeutralized || 0;
    
    // Affichage du CO2 (arrondi à 2 décimales)
    if (result.currentCo2) {
      co2Element.textContent = result.currentCo2.toFixed(3) + " g";
    }
  });

  // 2. Gérer le changement d'état du toggle
  sobrietyToggle.addEventListener('change', () => {
    const isEnabled = sobrietyToggle.checked;

    // Sauvegarder le nouvel état
    chrome.storage.local.set({ sobrietyMode: isEnabled }, () => {
      console.log(`Mode Sobriété ${isEnabled ? 'activé' : 'désactivé'}`);
    });

    // Envoyer un message au content script de l'onglet actif
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: "toggleSobriety", 
          state: isEnabled 
        }).catch(err => console.log("Impossible de contacter l'onglet (peut-être pas une page web ?)"));
      }
    });
  });
});


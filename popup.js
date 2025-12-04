document.addEventListener('DOMContentLoaded', () => {
  const sobrietyToggle = document.getElementById('sobrietyMode');
  const a11yToggle = document.getElementById('a11yMode');
  const trackersElement = document.getElementById('trackersCleaned');
  const mediaElement = document.getElementById('mediaNeutralized');
  const co2Element = document.getElementById('pageCo2');

  // 1. Lire l'état initial depuis le storage
  chrome.storage.local.get(['sobrietyMode', 'a11yMode', 'trackersCleaned', 'mediaNeutralized', 'currentCo2'], (result) => {
    // État des toggles
    sobrietyToggle.checked = result.sobrietyMode || false;
    if(a11yToggle) a11yToggle.checked = result.a11yMode || false;

    // Mise à jour des métriques
    trackersElement.textContent = result.trackersCleaned || 0;
    mediaElement.textContent = result.mediaNeutralized || 0;
    
    // Affichage du CO2
    if (result.currentCo2) {
      co2Element.textContent = result.currentCo2.toFixed(3) + " g";
    }
  });

  // 2. Mode Sobriété
  sobrietyToggle.addEventListener('change', () => {
    const isEnabled = sobrietyToggle.checked;
    chrome.storage.local.set({ sobrietyMode: isEnabled });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSobriety", state: isEnabled }).catch(() => {});
      }
    });
  });

  // 3. Mode Accessibilité
  if (a11yToggle) {
    a11yToggle.addEventListener('change', () => {
      const isEnabled = a11yToggle.checked;
      chrome.storage.local.set({ a11yMode: isEnabled });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "toggleA11y", state: isEnabled }).catch(() => {});
        }
      });
    });
  }
});


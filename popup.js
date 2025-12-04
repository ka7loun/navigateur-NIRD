document.addEventListener('DOMContentLoaded', () => {
  const sobrietyToggle = document.getElementById('sobrietyMode');
  const a11yToggle = document.getElementById('a11yMode');
  const focusToggle = document.getElementById('focusMode');
  const hibernateToggle = document.getElementById('hibernateMode');
  
  const trackersElement = document.getElementById('trackersCleaned');
  const mediaElement = document.getElementById('mediaNeutralized');
  const co2Element = document.getElementById('pageCo2');

  // --- 1. LOGIQUE UI INFO NIRD (NEW) ---
  const modal = document.getElementById('infoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalClose = document.getElementById('modalClose');

  const NIRD_INFOS = {
    durabilite: {
      title: "♻️ DURABILITÉ",
      text: "Ce module réduit drastiquement la consommation de données et d'énergie en bloquant les ressources lourdes, prolongeant ainsi la vie de votre batterie et de votre appareil."
    },
    inclusion: {
      title: "🤝 INCLUSION",
      text: "Rend le numérique accessible à tous. Ce mode adapte l'affichage pour faciliter la lecture aux personnes dyslexiques ou ayant des troubles visuels."
    },
    responsabilite: {
      title: "⚖️ RESPONSABILITÉ",
      text: "Protège votre attention et votre santé mentale en masquant les mécanismes addictifs (Shorts, fils infinis) conçus pour vous captiver."
    },
    hibernation: {
      title: "♻️ DURABILITÉ & SOBRIÉTÉ",
      text: "Réduit l'empreinte mémoire du navigateur. En mettant en veille les onglets inutilisés, vous libérez de la RAM et économisez de l'énergie."
    },
    co2: {
      title: "🌍 ÉCO-TAGGER (INCLUSION)",
      text: "Rend visible l'invisible. Chaque octet transféré consomme de l'énergie (réseau, serveurs). Ce chiffre vous sensibilise à l'empreinte carbone réelle de votre navigation."
    },
    trackers: {
      title: "🛡️ RESPONSABILITÉ",
      text: "Chaque tracker bloqué est une victoire pour votre vie privée. Moins de collecte de données = moins de serveurs de publicité sollicités = moins d'énergie gaspillée."
    },
    medias: {
      title: "⚡ DURABILITÉ",
      text: "Vidéos, GIFs et images lourdes consomment énormément de bande passante. En les bloquant par défaut, vous économisez directement de l'électricité et des données."
    }
  };

  // Gestion des clics sur les boutons info
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.dataset.info;
      if (NIRD_INFOS[type]) {
        modalTitle.textContent = NIRD_INFOS[type].title;
        modalText.textContent = NIRD_INFOS[type].text;
        modal.classList.add('active');
      }
    });
  });

  // Fermeture du modal
  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });


  // --- 2. LOGIQUE FONCTIONNELLE (EXISTANTE) ---

  // Initialisation
  chrome.storage.local.get(['sobrietyMode', 'a11yMode', 'focusMode', 'hibernateMode', 'trackersCleaned', 'mediaNeutralized', 'currentCo2'], (result) => {
    if(sobrietyToggle) sobrietyToggle.checked = result.sobrietyMode || false;
    if(a11yToggle) a11yToggle.checked = result.a11yMode || false;
    if(focusToggle) focusToggle.checked = result.focusMode || false;
    if(hibernateToggle) hibernateToggle.checked = result.hibernateMode || false;

    trackersElement.textContent = result.trackersCleaned || 0;
    mediaElement.textContent = result.mediaNeutralized || 0;
    
    if (result.currentCo2) {
      co2Element.textContent = result.currentCo2.toFixed(3) + " g";
    }
  });

  // Listeners
  if(sobrietyToggle) {
    sobrietyToggle.addEventListener('change', () => {
      const isEnabled = sobrietyToggle.checked;
      chrome.storage.local.set({ sobrietyMode: isEnabled });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSobriety", state: isEnabled }).catch(() => {});
      });
    });
  }

  if (a11yToggle) {
    a11yToggle.addEventListener('change', () => {
      const isEnabled = a11yToggle.checked;
      chrome.storage.local.set({ a11yMode: isEnabled });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, { action: "toggleA11y", state: isEnabled }).catch(() => {});
      });
    });
  }

  if (focusToggle) {
    focusToggle.addEventListener('change', () => {
      const isEnabled = focusToggle.checked;
      chrome.storage.local.set({ focusMode: isEnabled });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, { action: "toggleFocus", state: isEnabled }).catch(() => {});
      });
    });
  }

  if (hibernateToggle) {
    hibernateToggle.addEventListener('change', () => {
      const isEnabled = hibernateToggle.checked;
      chrome.storage.local.set({ hibernateMode: isEnabled });
      if (isEnabled) chrome.runtime.sendMessage({ action: "triggerHibernation" });
    });
  }
});

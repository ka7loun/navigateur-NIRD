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
    detox: {
      title: "🧘 PILIER : RESPONSABILITÉ (BIEN-ÊTRE)",
      text: "POURQUOI ? La technologie doit être un outil, pas une addiction.\n\nSOLUTION NIRD : Un petit défi quotidien pour vous encourager à déconnecter, à reprendre le contrôle de votre temps et à réduire votre dépendance aux écrans."
    },
    durabilite: {
      title: "♻️ PILIER : DURABILITÉ",
      text: "POURQUOI ? Le chargement de polices tierces et de médias lourds est énergivore.\n\nSOLUTION NIRD : En bloquant ces éléments, nous réduisons la consommation de bande passante et l'effort CPU, prolongeant la durée de vie de votre matériel (lutte contre l'obsolescence programmée)."
    },
    inclusion: {
      title: "🤝 PILIER : INCLUSION",
      text: "POURQUOI ? Le web standard exclut souvent les personnes dyslexiques ou malvoyantes.\n\nSOLUTION NIRD : Ce mode adapte l'affichage (police, contraste) pour rendre l'information accessible à tous, garantissant l'égalité d'accès au savoir."
    },
    responsabilite: {
      title: "⚖️ PILIER : RESPONSABILITÉ",
      text: "POURQUOI ? L'économie de l'attention exploite nos biais cognitifs pour nous captiver.\n\nSOLUTION NIRD : Le filtre bloque les mécanismes addictifs (Shorts, fils infinis) pour protéger votre santé mentale et favoriser une navigation consciente."
    },
    hibernation: {
      title: "♻️ PILIER : DURABILITÉ",
      text: "POURQUOI ? Garder des onglets ouverts consomme inutilement de la RAM et de l'électricité.\n\nSOLUTION NIRD : L'hibernation automatique libère les ressources des onglets inactifs, réduisant l'empreinte énergétique globale de votre session."
    },
    co2: {
      title: "🌍 PILIER : INCLUSION & TRANSPARENCE",
      text: "POURQUOI ? L'impact écologique du numérique est souvent invisible pour l'utilisateur.\n\nSOLUTION NIRD : Cet indicateur rend tangible le coût carbone de chaque page visitée, éduquant l'utilisateur à l'impact de ses clics."
    },
    trackers: {
      title: "🛡️ PILIER : RESPONSABILITÉ",
      text: "POURQUOI ? Le traçage publicitaire viole la vie privée et consomme des ressources serveur.\n\nSOLUTION NIRD : En supprimant les mouchards (trackers), nous garantissons la souveraineté de vos données et allégeons le trafic réseau."
    },
    medias: {
      title: "⚡ PILIER : SOBRIÉTÉ (DURABILITÉ)",
      text: "POURQUOI ? La vidéo et les images animées représentent la majorité du trafic web mondial.\n\nSOLUTION NIRD : Neutraliser ces éléments par défaut permet une navigation 'Low-Tech' respectueuse des limites planétaires."
    }
  };

  // Gestion des clics sur les boutons info
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.dataset.info;
      if (NIRD_INFOS[type]) {
        modalTitle.textContent = NIRD_INFOS[type].title;
        // On utilise innerHTML pour permettre les sauts de ligne avec \n remplacés par <br>
        modalText.innerHTML = NIRD_INFOS[type].text.replace(/\n/g, '<br>');
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

  // --- 3. CHALLENGE DETOX DU JOUR ---
  const challenges = [
    "Ne regardez aucune vidéo avant midi aujourd'hui.",
    "Désactivez les notifications pour les 2 prochaines heures.",
    "Faites une pause de 5 minutes sans écran toutes les heures.",
    "N'ouvrez pas plus de 5 onglets simultanément.",
    "Évitez les réseaux sociaux jusqu'à ce soir.",
    "Lisez un article en entier sans scroller ailleurs.",
    "Nettoyez votre boîte mail pendant 10 minutes."
  ];

  const today = new Date().toDateString();
  // Pseudo-aléatoire basé sur la date pour que tout le monde ait le même challenge le même jour
  const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const challengeIndex = seed % challenges.length;
  
  const challengeElement = document.getElementById('detoxChallenge');
  if (challengeElement) {
    challengeElement.textContent = `"${challenges[challengeIndex]}"`;
  }
});

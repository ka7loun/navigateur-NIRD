// --- 1. MODE SOBRIÉTÉ (BLUR & PAUSE) ---

function injectSystemFonts(enable) {
  const styleId = 'nird-font-style';
  let styleElement = document.getElementById(styleId);

  if (enable) {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        * { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
      `;
      document.head.appendChild(styleElement);
    }
  } else {
    if (styleElement) styleElement.remove();
  }
}

function neutralizeMedia(enable) {
  // On cible vidéos et images (GIFs potentiels ou images lourdes)
  const selector = 'video, iframe, img[src*=".gif"], img[src*=".GIF"]';
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    if (enable) {
      if (el.classList.contains('nird-neutralized')) return;

      // 1. Pause si c'est une vidéo
      if (el.tagName === 'VIDEO') {
        el.pause();
        el.autoplay = false;
      }

      // 2. Ajouter le style de flou (Blur)
      el.style.transition = 'filter 0.3s ease';
      el.style.filter = 'blur(10px) grayscale(100%)';
      el.classList.add('nird-neutralized');

      // 3. Ajouter un overlay "Click to Play"
      const wrapper = document.createElement('div');
      wrapper.className = 'nird-wrapper';
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);

      const overlay = document.createElement('div');
      overlay.className = 'nird-overlay';
      overlay.textContent = '▶️ Activer (NIRD)';
      overlay.style.cssText = `
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-family: sans-serif;
        cursor: pointer;
        z-index: 9999;
        pointer-events: auto;
      `;

      wrapper.appendChild(overlay);

      const restore = (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        el.style.filter = 'none';
        if (el.tagName === 'VIDEO') el.play();
        
        overlay.remove();
        el.classList.remove('nird-neutralized');
      };

      overlay.addEventListener('click', restore);
      el.addEventListener('click', restore, { once: true });

    } else {
      if (el.classList.contains('nird-neutralized')) {
        el.style.filter = 'none';
        el.classList.remove('nird-neutralized');
        
        const wrapper = el.closest('.nird-wrapper');
        if (wrapper) {
          const overlay = wrapper.querySelector('.nird-overlay');
          if (overlay) overlay.remove();
        }
      }
    }
  });
}

function applySobrietyMode(isEnabled) {
  injectSystemFonts(isEnabled);
  neutralizeMedia(isEnabled);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSobriety") {
    applySobrietyMode(request.state);
  }
});

chrome.storage.local.get(['sobrietyMode'], (result) => {
  if (result.sobrietyMode) applySobrietyMode(true);
});


// --- 2. BOUCLIER URL (VERSION STRICTE) ---

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

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  
  if (link && link.href) {
    const { url, cleaned } = cleanUrl(link.href);
    
    if (cleaned) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log("🚫 NIRD : Tracker bloqué !", link.href, "->", url);
      chrome.runtime.sendMessage({ action: "updateMetrics", trackers: 1 });
      
      setTimeout(() => {
        window.location.href = url;
      }, 10);
    }
  }
}, true);


// --- 3. ÉCO-TAGGER (Calcul CO2) ---

function calculateCarbonFootprint() {
  // Récupère les ressources chargées (images, scripts, css...)
  const resources = performance.getEntriesByType('resource');
  let totalBytes = 0;

  resources.forEach(resource => {
    // transferSize inclut le header + body (compressé)
    if (resource.transferSize > 0) {
      totalBytes += resource.transferSize;
    }
  });

  // Formule approximative : 1GB transféré = ~0.81 kWh * 475g CO2/kWh (mix moyen mondial) = ~385g CO2
  // Pour simplifier : ~0.4g CO2 par MB (Source: The Shift Project / WebsiteCarbon)
  const totalMB = totalBytes / (1024 * 1024);
  const co2grams = totalMB * 0.4; // Facteur d'émission (très simplifié)

  return co2grams;
}

// Envoie le CO2 calculé périodiquement ou au chargement
function sendEcoStats() {
  // Attendre que la page soit chargée pour avoir des données pertinentes
  if (document.readyState === 'complete') {
    const co2 = calculateCarbonFootprint();
    if (co2 > 0) {
      chrome.runtime.sendMessage({ 
        action: "updateEcoScore", 
        co2: co2 
      }).catch(() => {}); // Ignorer erreur si popup fermé
    }
  }
}

// Écouteurs pour le chargement
window.addEventListener('load', () => {
  // Calcul initial
  setTimeout(sendEcoStats, 2000);
});

// Recalcul périodique si l'utilisateur reste sur la page (SPA, chargement dynamique)
setInterval(sendEcoStats, 10000);

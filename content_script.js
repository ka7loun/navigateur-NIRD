// --- 1. MODE SOBRIÉTÉ (POLICES) ---

function injectSystemFonts(enable) {
  const styleId = 'nird-font-style';
  let styleElement = document.getElementById(styleId);

  if (enable) {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      // On force toutes les polices à utiliser le système par défaut pour économiser le téléchargement de WebFonts
      styleElement.textContent = `
        @font-face { font-family: "NIRD-System"; src: local("Arial"); }
        * { 
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; 
        }
      `;
      document.head.appendChild(styleElement);
    }
  } else {
    if (styleElement) styleElement.remove();
  }
}

function applySobrietyMode(isEnabled) {
  injectSystemFonts(isEnabled);
}

// --- 2. MODE LECTURE ACCESSIBLE (Inclusion) ---
function applyAccessibility(enable) {
  const a11yStyleId = 'nird-a11y-style';
  let styleElement = document.getElementById(a11yStyleId);

  if (enable) {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = a11yStyleId;
      styleElement.textContent = `
        /* Police Dyslexie-friendly (sans-serif large) */
        p, h1, h2, h3, h4, h5, h6, span, div, li, a {
          font-family: "Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif !important;
          line-height: 1.8 !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.1em !important;
        }
        /* Augmentation du contraste textuel */
        p, span, div, li {
          color: #000 !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  } else {
    if (styleElement) styleElement.remove();
  }
}

// --- 3. FILTRE ANTI-ATTENTION (Responsabilité) ---
function applyFocusMode(enable) {
  const focusStyleId = 'nird-focus-style';
  let styleElement = document.getElementById(focusStyleId);

  if (enable) {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = focusStyleId;
      // Bloque YouTube Shorts, Recommandations, Facebook Reels, LinkedIn Feed pub
      styleElement.textContent = `
        /* YouTube */
        ytd-rich-grid-renderer, ytd-reel-shelf-renderer, #secondary-inner, ytd-shorts { display: none !important; }
        
        /* Facebook */
        div[role="feed"], div[aria-label="Reels"], div[aria-label="Stories"] { display: none !important; }
        
        /* LinkedIn */
        .ad-banner-container, .right-rail, .feed-shared-update-v2__content { opacity: 0.5; }
        
        /* Instagram */
        article div:nth-child(3) { display: none !important; } /* Commentaires */
        
        /* TikTok (Web) */
        div[data-e2e="recommend-list-item-container"] { display: none !important; }
      `;
      document.head.appendChild(styleElement);
    }
  } else {
    if (styleElement) styleElement.remove();
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSobriety") {
    applySobrietyMode(request.state);
  } else if (request.action === "toggleA11y") {
    applyAccessibility(request.state);
  } else if (request.action === "toggleFocus") {
    applyFocusMode(request.state);
  }
});

chrome.storage.local.get(['sobrietyMode', 'a11yMode', 'focusMode'], (result) => {
  if (result.sobrietyMode) applySobrietyMode(true);
  if (result.a11yMode) applyAccessibility(true);
  if (result.focusMode) applyFocusMode(true);
});


// --- 4. BOUCLIER URL (VERSION STRICTE) ---

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


// --- 5. ÉCO-TAGGER (Calcul CO2) ---
// Based on Sustainable Web Design Model (SWDM) v4
// Source: https://sustainablewebdesign.org/estimating-digital-emissions/
// Data sources: IEA 2022, Malmodin 2023, ITU 2023, Ember 2024

const SWDM_CONFIG = {
  // Energy intensity per GB (kWh/GB) - from IEA 2022 & Malmodin 2023
  operational: {
    dataCenter: 0.055,
    network: 0.059,
    userDevice: 0.080
  },
  embodied: {
    dataCenter: 0.012,
    network: 0.013,
    userDevice: 0.081
  },
  // Global average grid carbon intensity (gCO2e/kWh) - Ember 2024
  gridIntensity: 494,
  // Caching assumptions for returning visitors
  returnVisitorRatio: 0.75,
  dataCacheRatio: 0.02
};

function calculateCarbonFootprint() {
  const resources = performance.getEntriesByType('resource');
  let totalBytes = 0;

  resources.forEach(resource => {
    if (resource.transferSize > 0) {
      totalBytes += resource.transferSize;
    }
  });

  // Add document size estimate (HTML)
  const docSize = new Blob([document.documentElement.outerHTML]).size;
  totalBytes += docSize;

  const totalGB = totalBytes / (1024 * 1024 * 1024);

  // Calculate operational emissions (gCO2e)
  const opDataCenter = totalGB * SWDM_CONFIG.operational.dataCenter * SWDM_CONFIG.gridIntensity;
  const opNetwork = totalGB * SWDM_CONFIG.operational.network * SWDM_CONFIG.gridIntensity;
  const opUserDevice = totalGB * SWDM_CONFIG.operational.userDevice * SWDM_CONFIG.gridIntensity;
  const operationalEmissions = opDataCenter + opNetwork + opUserDevice;

  // Calculate embodied emissions (gCO2e)
  const emDataCenter = totalGB * SWDM_CONFIG.embodied.dataCenter * SWDM_CONFIG.gridIntensity;
  const emNetwork = totalGB * SWDM_CONFIG.embodied.network * SWDM_CONFIG.gridIntensity;
  const emUserDevice = totalGB * SWDM_CONFIG.embodied.userDevice * SWDM_CONFIG.gridIntensity;
  const embodiedEmissions = emDataCenter + emNetwork + emUserDevice;

  // Total emissions per page view
  const totalEmissions = operationalEmissions + embodiedEmissions;

  // Convert to grams (already in gCO2e)
  return totalEmissions;
}

function sendEcoStats() {
  if (document.readyState === 'complete') {
    const co2 = calculateCarbonFootprint();
    if (co2 > 0) {
      chrome.runtime.sendMessage({ 
        action: "updateEcoScore", 
        co2: co2 
      }).catch(() => {});
    }
  }
}

window.addEventListener('load', () => {
  setTimeout(sendEcoStats, 2000);
});

setInterval(sendEcoStats, 10000);

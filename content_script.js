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
  const selector = 'video, iframe, img[src*=".gif"], img[src*=".GIF"]';
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    if (enable) {
      if (el.classList.contains('nird-neutralized')) return;

      if (el.tagName === 'VIDEO') {
        el.pause();
        el.autoplay = false;
      }

      el.style.transition = 'filter 0.3s ease';
      el.style.filter = 'blur(10px) grayscale(100%)';
      el.classList.add('nird-neutralized');

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

function calculateCarbonFootprint() {
  const resources = performance.getEntriesByType('resource');
  let totalBytes = 0;

  resources.forEach(resource => {
    if (resource.transferSize > 0) {
      totalBytes += resource.transferSize;
    }
  });

  const totalMB = totalBytes / (1024 * 1024);
  const co2grams = totalMB * 0.4; 

  return co2grams;
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

# Navigateur NIRD - Analysis Notes

## Overview
French browser extension (Manifest V3) for responsible web browsing. **NIRD = Numérique Inclusif, Responsable, Durable**. Built for "Nuit de l'Info" hackathon.

## Features (6 total)

| Feature | File | Status |
|---------|------|--------|
| Mode Sobriété (System Fonts) | content_script.js | ✅ Working |
| Lecture Accessible (Dyslexia mode) | content_script.js | ✅ Working |
| Filtre Anti-Attention | content_script.js | ⚠️ Partial |
| Hibernateur d'Onglets | service_worker.js | ✅ Working |
| Bouclier URL (Tracker removal) | content_script.js + service_worker.js | ✅ Working |
| Éco-Tagger (CO2 calc) | content_script.js | ⚠️ Basic |

---

## ✅ GOOD STUFF

- **Clean architecture**: Clear separation (popup, content_script, service_worker)
- **Manifest V3 compliant**: Modern Chrome standard
- **Minimal permissions**: Only requests what's needed
- **No external dependencies**: Pure vanilla JS, lightweight
- **Beautiful UI**: Modern CSS, iOS-style toggles, nice gradients
- **Educational modals**: Each feature explains its NIRD impact
- **Privacy-first**: All processing local, no data sent externally
- **Clever daily challenge**: Seed-based pseudo-random, same for all users each day

---

## ⚠️ FLAWS & BUGS

### Code Quality
1. **DRY violation**: `TRACKING_PARAMS` and `cleanUrl()` duplicated in content_script.js AND service_worker.js
2. **No TypeScript**: Would benefit from type safety
3. **No tests**: Zero test coverage
4. **No build process**: Raw files, no minification
5. **Magic numbers**: `0.4` CO2 factor, `5` minutes, `2000ms` delay - should be constants

### Functionality Issues
1. **CO2 calculation oversimplified**: `totalMB * 0.4` is a rough estimate, not accounting for grid carbon intensity
2. **Focus mode selectors fragile**: YouTube/FB/IG DOM changes frequently → selectors will break
3. **Instagram selector too aggressive**: `article div:nth-child(3)` hides random content
4. **Tab hibernation has no time tracking**: Claims 5/10 min but hibernates ALL inactive tabs immediately
5. **No feedback on tracker blocking**: User doesn't see when trackers are removed (except counter)

### UX Issues
1. **No dark mode**: Popup is light-only
2. **No settings persistence indicator**: User doesn't know settings are saved
3. **CO2 doesn't reset on navigation**: Shows stale data
4. **No i18n**: French-only, limits audience
5. **Modal text uses innerHTML**: Minor XSS risk with `.replace(/\n/g, '<br>')`

### Missing Features (README promises)
1. **README mentions "Vidéos, GIFs" blocking** but Mode Sobriété only changes fonts
2. **No actual media blocking implementation**

---

## 💡 CONTRIBUTION IDEAS

### Quick Wins
- [ ] Extract shared constants/utils to `utils.js`
- [ ] Add dark mode toggle
- [ ] Fix Instagram/YouTube selectors with data attributes
- [ ] Add notification when tracker is cleaned
- [ ] Add i18n support (start with EN)

### Medium Effort
- [ ] Implement actual video/GIF blocking for sobriété mode
- [ ] Track actual tab inactivity time with `chrome.tabs.onActivated`
- [ ] Better CO2 calculation (use Website Carbon API or similar formula)
- [ ] Add stats history/graphs (daily/weekly CO2 saved)
- [ ] Add export/import settings

### Advanced
- [ ] Add TypeScript + build system (Vite/Webpack)
- [ ] Unit tests with Jest
- [ ] E2E tests with Playwright
- [ ] Firefox/Safari port
- [ ] Sync settings across devices with `chrome.storage.sync`
- [ ] Add allowlist/blocklist for sites

---

## File Structure
```
navigateur-NIRD/
├── manifest.json        # Extension config (MV3)
├── popup.html           # UI (461 lines, inline CSS)
├── popup.js             # Popup logic (148 lines)
├── content_script.js    # Page injection (188 lines)
├── service_worker.js    # Background tasks (127 lines)
├── icons/               # Extension icons
├── README.md            # Documentation
└── LICENSE              # MIT
```

## Tech Stack
- Vanilla JS (ES6+)
- Chrome Extension Manifest V3
- Chrome APIs: storage, scripting, activeTab, contextMenus, alarms

---

## CO2 Calculation - SWDM v4 Implementation

**Implemented**: Sustainable Web Design Model (SWDM) v4
**Source**: https://sustainablewebdesign.org/estimating-digital-emissions/

### Formula
```
Total CO2 (gCO2e) = Operational + Embodied emissions
```

### Energy Intensity (kWh/GB)
| Segment | Operational | Embodied |
|---------|-------------|----------|
| Data Center | 0.055 | 0.012 |
| Network | 0.059 | 0.013 |
| User Device | 0.080 | 0.081 |

### Grid Intensity
- **494 gCO2e/kWh** (global average, Ember 2024)

### Data Sources
- IEA 2022 (data center & network energy)
- Malmodin 2023 (user device energy, embodied ratios)
- ITU 2023 (global data transfer: 5.29 ZB)
- Ember 2024 (grid carbon intensity)

---

## Priority Fixes for First PR
1. **Fix DRY violation** - consolidate utils
2. **Implement media blocking** - matches README promise
3. **Fix tab hibernation timing** - track actual inactivity
4. **Update fragile selectors** - YouTube changes often

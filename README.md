# 🇫🇷 Le Navigateur NIRD : L'Extension Ultime pour un Web Responsable

> **Sobriété, Éthique, Performance & Inclusion**

## 🌟 Manifeste du Projet

**Le Navigateur NIRD** est une extension Manifest V3 conçue pour transformer l'expérience de navigation web en un acte de citoyenneté numérique. En agissant directement sur la consommation de ressources, la protection des données personnelles, l'accessibilité et la santé mentale, notre extension incarne les trois piliers de l'initiative **NIRD (Numérique Inclusif, Responsable et Durable)**.

Notre objectif est d'offrir aux utilisateurs scolaires et citoyens un outil "couteau-suisse" pour reprendre le contrôle de leur environnement numérique.

---

## I. Fonctionnalités & Impact NIRD

L'extension intègre **7 fonctionnalités majeures**, couvrant tous les aspects de la sobriété numérique.

### ♻️ PILIER : DURABILITÉ (Énergie & Matériel)

L'objectif est de réduire l'empreinte carbone et de lutter contre l'obsolescence programmée en allégeant la charge sur les ordinateurs.

| Fonctionnalité | Description Technique | Impact Concret |
| :--- | :--- | :--- |
| **Nettoyeur d'Énergie** | Force l'utilisation de polices système (Arial, etc.) et remplace les médias lourds (GIFs, Vidéos) par des placeholders. | Réduit la bande passante et la charge CPU. Prolonge la batterie et la vie des vieux PC. |
| **Hibernateur d'Onglets** | Décharge (discard) automatiquement les onglets inactifs depuis > 5 min. | Libère la mémoire RAM instantanément. Indispensable pour les navigateurs gourmands. |
| **Mode Sobriété (Blur)** | Applique un flou + N&B sur les médias. Bouton "Click-to-Play" pour activer. | Empêche le chargement inutile de contenu et sensibilise visuellement à la consommation. |

### 🛡️ PILIER : RESPONSABILITÉ (Données & Attention)

L'objectif est de protéger la vie privée et la santé mentale des utilisateurs face aux géants du web.

| Fonctionnalité | Description Technique | Impact Concret |
| :--- | :--- | :--- |
| **Bouclier de Confidentialité** | Intercepte les clics et supprime les paramètres de tracking (`utm_`, `gclid`) avant la navigation. | Empêche le pistage publicitaire inter-sites. Vos données restent privées. |
| **Filtre Anti-Attention** | Masque les éléments addictifs (Shorts, fils infinis, recommandations) sur YouTube/FB/LinkedIn via CSS. | Protège contre la captologie. Favorise une recherche d'information intentionnelle et non subie. |
| **Challenge Détox** | Affiche un défi quotidien aléatoire ("Pas de vidéo avant midi") dans le popup. | Encourage la déconnexion et le changement de comportement (Tech for Good). |

### 🤝 PILIER : INCLUSION (Accessibilité & Pédagogie)

L'objectif est de rendre le numérique accessible à tous et de rendre visible l'impact invisible du web.

| Fonctionnalité | Description Technique | Impact Concret |
| :--- | :--- | :--- |
| **Mode Lecture Accessible** | Change la police pour une version "Dyslexie-friendly" (Comic Sans/OpenDyslexic) et augmente le contraste. | Permet aux personnes dyslexiques ou malvoyantes de naviguer confortablement sur n'importe quel site. |
| **Éco-Tagger (CO2)** | Calcule en temps réel le poids de la page (Ressources API) et estime les grammes de CO2 émis. | **Rend visible l'invisible.** Sensibilise l'utilisateur au coût écologique de chaque clic. |
| **Outils Pédagogiques** | Des info-bulles ℹ️ expliquent chaque fonctionnalité avec le pilier NIRD associé. | Transforme l'outil en support éducatif pour comprendre les enjeux du numérique. |

---

## II. Architecture Technique (Manifest V3)

Le projet respecte les standards modernes de Chrome et les bonnes pratiques de sécurité.

*   **Permissions Minimales** : `storage`, `scripting`, `activeTab`, `contextMenus`, `alarms`. Pas de collecte de données distante.
*   **Performance** : Utilisation de `requestAnimationFrame` et `MutationObserver` légers.
*   **Confidentialité** : Tout le traitement se fait en local sur la machine de l'utilisateur.

---

## 🧑‍💻 Structure de l'Équipe NIRD

Ce projet a été réalisé en simulant une méthodologie Agile professionnelle avec 3 développeurs distincts, utilisant Git Flow (Feature Branching, Pull Requests).

### 1. 🥇 Account 1 : Chef de Projet (`ka7loun`)
*   **Responsabilités :** Architecture, Dashboard, Eco-Tagger, Challenge Détox, Documentation.
*   **Apport :** Vision globale, métriques et pédagogie.

### 2. 🎨 Account 2 : Front-End & Accessibilité (`ahmed0219`)
*   **Responsabilités :** Mode Lecture Accessible, Tooltips UI, Design Popup.
*   **Apport :** UX inclusive et design éco-conçu.

### 3. 🛡️ Account 3 : Sécurité & Performance (`adeemmm23`)
*   **Responsabilités :** Filtre Anti-Attention, Hibernation, Bouclier URL.
*   **Apport :** Robustesse technique et protection utilisateur.

---

## III. Installation

1.  **Cloner le dépôt :** `git clone https://github.com/ka7loun/navigateur-NIRD.git`
2.  **Accéder à `chrome://extensions`** dans votre navigateur (Chrome/Brave/Edge).
3.  Activer le **Mode développeur** (interrupteur en haut à droite).
4.  Cliquer sur **Charger l'extension non empaquetée** et sélectionner le dossier du projet.

---
*Développé avec ❤️ pour la Nuit de l'Info - Défi NIRD.*

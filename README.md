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

## II. Architecture & Transparence (Permissions)

Nous nous engageons à une transparence totale sur les permissions demandées (Manifest V3).

| Permission | Justification (Pourquoi ?) |
| :--- | :--- |
| `storage` | Pour sauvegarder vos préférences (état des interrupteurs) et vos compteurs d'impact localement. |
| `scripting` | Pour modifier le style des pages (polices, flou, filtres) et injecter le script de nettoyage. |
| `activeTab` | Pour interagir uniquement avec l'onglet que vous visitez, sans surveiller tout votre historique. |
| `contextMenus` | Pour ajouter l'option "Nettoyer et Copier le Lien" au clic-droit. |
| `alarms` | Pour vérifier périodiquement les onglets inactifs et déclencher l'hibernation. |

---

## III. Guide d'Installation

### 1. Prérequis
*   Un navigateur basé sur Chromium (Google Chrome, Microsoft Edge, Brave, Vivaldi).
*   Git (optionnel, pour cloner) ou simplement télécharger le ZIP.

### 2. Installation (Mode Développeur)
1.  **Récupérer le code** :
    *   Via Git : `git clone https://github.com/ka7loun/navigateur-NIRD.git`
    *   Ou télécharger le ZIP depuis GitHub et l'extraire.
2.  **Ouvrir la gestion des extensions** :
    *   Tapez `chrome://extensions` dans la barre d'adresse.
3.  **Activer le mode développeur** :
    *   En haut à droite de la page, basculez l'interrupteur **"Mode développeur"**.
4.  **Charger l'extension** :
    *   Cliquez sur le bouton **"Charger l'extension non empaquetée"** (en haut à gauche).
    *   Sélectionnez le dossier `navigateur-NIRD` (celui qui contient le fichier `manifest.json`).
5.  **C'est prêt !** L'icône NIRD apparaît dans votre barre d'outils.

---

## IV. Fonctionnement & Utilisation

Une fois installée, cliquez sur l'icône de l'extension pour ouvrir le **Tableau de Bord**.

### 1. Activer les Modes
*   **Mode Sobriété** : Activez-le pour bloquer les vidéos/GIFs et simplifier les polices. Idéal pour économiser de la batterie.
*   **Lecture Accessible** : Activez-le si vous avez du mal à lire le texte. La police s'adapte instantanément.
*   **Filtre Anti-Attention** : Activez-le avant d'aller sur YouTube ou les réseaux sociaux pour ne pas vous faire piéger par les algorithmes.
*   **Hibernateur** : Laissez-le activé pour que vos onglets en arrière-plan arrêtent de consommer de la mémoire.

### 2. Nettoyer un Lien
*   **Automatique** : Cliquez simplement sur n'importe quel lien. Si un tracker est détecté, il sera supprimé avant le chargement.
*   **Manuel** : Faites un **clic-droit** sur un lien > Sélectionnez **"Nettoyer et Copier le Lien (NIRD)"**. Le lien propre est copié dans votre presse-papier.

### 3. Suivre son Impact
*   Regardez la section **Impact Écologique** pour voir combien de grammes de CO2 la page actuelle a consommé et combien de mouchards vous avez bloqués !

---

## 🧑‍💻 Structure de l'Équipe NIRD

Ce projet a été réalisé en simulant une méthodologie Agile professionnelle avec 3 développeurs distincts, utilisant Git Flow (Feature Branching, Pull Requests).

*   **🥇 Account 1 (`ka7loun`)** : Chef de Projet, Architecture, Dashboard, Eco-Tagger.
*   **🎨 Account 2 (`ahmed0219`)** : Front-End, Accessibilité, Design.
*   **🛡️ Account 3 (`adeemmm23`)** : Sécurité, Filtres, Performance.

---
*Développé avec ❤️ pour la Nuit de l'Info - Défi NIRD.*

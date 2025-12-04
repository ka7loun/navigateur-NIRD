# 🇫🇷 Le Navigateur NIRD : Sobriété, Éthique & Performance

## 🌟 Manifeste du Projet

**Le Navigateur NIRD** est une extension Manifest V3 conçue pour transformer l'expérience de navigation web en un acte de citoyenneté numérique. En agissant directement sur la consommation de ressources, la protection des données personnelles et l'accessibilité du contenu, notre extension incarne les trois piliers de l'initiative **NIRD (Numérique Inclusif, Responsable et Durable)**.

Notre objectif est d'offrir aux utilisateurs scolaires et citoyens un outil puissant pour reprendre le contrôle de leur environnement numérique, lutter contre l'obsolescence logicielle et réduire leur empreinte environnementale.

---

## I. Fonctionnalités Détaillées et Justification NIRD

L'extension se décompose en trois modules intégrés, chacun répondant à un pilier fondamental du NIRD.

### 1. ♻️ Module : Nettoyeur d'Énergie (Durabilité)

Ce module vise à réduire la consommation de ressources (bande passante, CPU) et à prolonger la durée de vie du matériel informatique, en parfaite adéquation avec le principe de **Durabilité** du NIRD.

| Fonctionnalité | Description | Justification NIRD |
| :--- | :--- | :--- |
| **Toggle "Mode Sobriété"** | Interrupteur global qui force l'utilisation des polices système (Arial, Georgia, etc.) et bloque/neutralise les médias lourds (GIFs, vidéos en auto-play). | **DURABILITÉ** : Le chargement de polices tierces (Google Fonts, etc.) et de médias non sollicités est énergivore. Forcer les polices système et bloquer l'auto-play réduit drastiquement la bande passante et la charge CPU, **prolongeant la vie des ordinateurs anciens** (lutte contre l'obsolescence programmée). |
| **Remplacement des Médias** | Les vidéos et les GIFs sont remplacés par un *placeholder* statique avec une icône de lecture, nécessitant un clic pour charger le contenu réel. | **DURABILITÉ/SOBRIÉTÉ** : Évite le chargement inutile de médias lourds, permettant à l'utilisateur de choisir consciemment quand dépenser de l'énergie et de la bande passante. |

### 2. 🛡️ Module : Bouclier de Confidentialité (Responsabilité)

Ce module est centré sur la protection de la vie privée et la transparence des pratiques numériques, honorant le principe de **Responsabilité** du NIRD.

| Fonctionnalité | Description | Justification NIRD |
| :--- | :--- | :--- |
| **Nettoyage des URLs (Sur Clic)** | Le script détecte les clics sur les liens hypertexte et retire automatiquement les **paramètres de suivi** (ex: `utm_source`, `gclid`, `fbclid`, `sessionid`) avant la navigation. | **RESPONSABILITÉ** : Ces paramètres sont utilisés pour le traçage publicitaire et la collecte de données privées. Leur suppression renforce la **souveraineté des données** et la protection de la vie privée des élèves et enseignants, un impératif éthique pour les communs numériques. |
| **Option "Nettoyer et Copier"** | Ajout d'une entrée au menu contextuel (clic droit) permettant de nettoyer le lien de la page actuelle (ou un lien sélectionné) et de copier la version épurée dans le presse-papiers. | **RESPONSABILITÉ/PARTAGE ÉTHIQUE** : Encourage le partage de liens propres, non tracés, au sein de la communauté scolaire (par exemple, dans les ENT ou les mails). |

### 3. 📊 Module : Tableau de Bord Éco-Citoyen (Inclusion/Transparence)

Ce module assure la sensibilisation et la mesure des efforts, conformément aux principes d'**Inclusion** (par la transparence) et de **Responsabilité** (par la mesure).

| Fonctionnalité | Description | Justification NIRD |
| :--- | :--- | :--- |
| **Métriques de Sobriété** | Dans le *popup* de l'extension, l'utilisateur voit un compteur affichant le nombre de trackers URL nettoyés et le nombre d'éléments multimédias neutralisés depuis l'installation. | **INCLUSION/SENSIBILISATION** : La transparence des données rend l'impact environnemental et éthique du numérique **visible et pédagogique**. Cela permet de former les élèves et les équipes aux enjeux de la sobriété numérique. |
| **Permissions Minimales** | L'extension ne demandera que les permissions strictement nécessaires à son fonctionnement (`storage`, `scripting`, `activeTab`, `contextMenus`). | **RESPONSABILITÉ/ÉTHIQUE** : Respect des bonnes pratiques de développement, garantissant que l'outil est **digne de confiance** et ne collecte aucune donnée à des fins commerciales. |

---

## II. Engagement Open Source

Pour garantir la **Responsabilité** et l'esprit des **communs numériques éducatifs**, l'intégralité du code source sera publiée sous **Licence MIT/GPL** sur GitHub/GitLab. Ce choix permet à la communauté NIRD de vérifier le fonctionnement du Bouclier de Confidentialité et d'apporter des contributions (**Forge des communs numériques éducatifs**).

---

## 🧑‍💻 Structure de l'Équipe NIRD (Simulée)

Ce projet a été réalisé en simulant une équipe de 3 développeurs pour garantir une séparation des responsabilités et une qualité de code optimale via des revues de code (Pull Requests).

### 1. 🥇 Account 1 : Chef de Projet & Architecture (Project Lead)
*   **Compte:** `ka7loun`
*   **Rôle:** Architecture Core, Fusion & Contrôle Qualité, Gestion des Métriques, Documentation.
*   **Focus NIRD:** Transparence & Gouvernance.

### 2. 🎨 Account 2 : Développement Front-End & Sobriété (Nettoyeur)
*   **Compte:** `ahmed0219`
*   **Rôle:** Module Nettoyeur d'Énergie (Injection CSS, Neutralisation Médias).
*   **Focus NIRD:** Durabilité & Sobriété Numérique.

### 3. 🛡️ Account 3 : Développement Utility & Sécurité (Bouclier)
*   **Compte:** `adeemmm23`
*   **Rôle:** Module Bouclier de Confidentialité (Nettoyage URLs, Menu Contextuel).
*   **Focus NIRD:** Responsabilité & Protection des Données.

---

## III. Installation (Mode Développeur)

1.  **Cloner le dépôt :** `git clone https://github.com/ka7loun/navigateur-NIRD.git`
2.  **Accéder à `chrome://extensions`** dans votre navigateur Chrome/Chromium/Brave.
3.  Activer le **Mode développeur** (interrupteur en haut à droite).
4.  Cliquer sur **Charger l'extension non empaquetée** et sélectionner le dossier du projet.

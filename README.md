# 🐳 Service d'Exécution de Conteneurs Docker 

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)]()

Ce projet consiste en la création d'un service permettant aux utilisateurs de gérer des conteneurs Docker de manière simple et efficace. L'objectif principal est de fournir une interface intuitive pour lancer des conteneurs, les arrêter, les supprimer, et les rendre accessibles via des URLs personnalisées.

## 📚 Table des matières
- [🎯 Fonctionnalités](#fonctionnalités)
- [👥 Gestion des Utilisateurs](#gestion-des-utilisateurs)
- [💾 Système de Fichiers (Drive)](#système-de-fichiers-drive)
- [🏗️ Architecture](#architecture)
- [💻 Technologies Utilisées](#technologies-utilisées)
- [📄 Licences](#licences)

## 🎯 Fonctionnalités

- 🚀 **Lancement de conteneurs** : Les utilisateurs peuvent fournir l'URL d'une image Docker ou un Dockerfile pour créer une image et lancer un conteneur.
- 🎮 **Gestion des conteneurs** : Interface utilisateur pour lister, démarrer et arrêter les conteneurs en cours d'exécution.
- 🌐 **Accès via URL** : Chaque conteneur est accessible par une URL personnalisée, gérée par l'utilisateur (ex. : `http://moncontainer34.ledomaine.ovh`).
- 👨‍💼 **Interface Admin** : Permet aux administrateurs de gérer les utilisateurs et les conteneurs, avec une vue d'ensemble sur l'état des conteneurs et la charge du serveur.
- 🔌 **Gestion des ports** : Politique de liaison des ports pour permettre à plusieurs conteneurs de fonctionner simultanément sans conflit.
- 🔒 **Sécurité** : Utilisation de JWT pour l'authentification, gestion des rôles, et audit des actions.

## 👥 Gestion des Utilisateurs

### 🎭 Rôles et Permissions
- 👑 **Administrateur**
  - Gestion complète de la plateforme
  - Création/Suppression des utilisateurs
  - Configuration système
  - Accès aux métriques et logs

- 👨‍💼 **Manager**
  - Gestion de son équipe
  - Attribution des ressources
  - Visualisation des métriques
  - Gestion des quotas

- 👨‍💻 **Développeur**
  - Déploiement de conteneurs
  - Gestion de ses conteneurs
  - Accès aux logs
  - Configuration des volumes

- 👀 **Observateur**
  - Visualisation des conteneurs
  - Lecture des logs
  - Accès en lecture aux fichiers

### 📊 Quotas et Limites
- 💻 Nombre maximum de conteneurs
- 💾 Espace de stockage alloué
- 🌐 Bande passante
- 🔌 Ports disponibles

### 🔐 Sécurité
- 🔑 Authentification multi-facteurs
- 🔄 SSO (Google, GitHub)
- 📝 Logs d'audit
- 🚫 Gestion des IP autorisées

## 💾 Système de Fichiers (Drive)

### 📁 Fonctionnalités Drive
- 🗄️ **Stockage persistant**
  - Volumes dédiés par utilisateur
  - Quotas personnalisables
  - Isolation des données

- 🔄 **Synchronisation**
  - Sauvegarde automatique
  - Versioning des fichiers
  - Points de restauration

- 👥 **Partage**
  - Partage entre conteneurs
  - Partage entre utilisateurs
  - Gestion des permissions

- 🔒 **Sécurité**
  - Chiffrement des données
  - Contrôle d'accès
  - Audit des accès

## 🏗️ Architecture

```mermaid
graph TD
    A[Interface Utilisateur] -->|API Requests| B[Backend API]
    C[Interface Admin] -->|API Requests| B
    B -->|Gestion Docker| D[Docker Engine]
    B -->|Gestion DNS| E[API DNS]
    B -->|Authentification| F[Service Auth]
    B -->|Stockage données| G[Base de données]
    H[Reverse Proxy] -->|Routage| I[Conteneurs Docker]
    B -->|Gestion| H
    
    %% Composants Drive et Users
    B -->|Fichiers| J[Service Drive]
    J -->|Stockage| K[Volume Manager]
    K -->|Montage| I
    
    F -->|Gestion| L[User Manager]
    L -->|Quotas| M[Resource Manager]
    M -->|Monitoring| I

    style A fill:#03B4C1,stroke:#333,stroke-width:2px
    style B fill:#410093,stroke:#333,stroke-width:2px
    style J fill:#01a6f0,stroke:#333,stroke-width:2px
    style K fill:#ffba01,stroke:#333,stroke-width:2px
    style L fill:#7fbc00,stroke:#333,stroke-width:2px
    style M fill:#F34F1C,stroke:#333,stroke-width:2px
```

### ⚙️ Détails de l'architecture :

1. 🖥️ **Interface Utilisateur** : Application web pour que les utilisateurs gèrent leurs conteneurs (démarrer, arrêter, supprimer).
2. 👨‍💼 **Interface Admin** : Application web pour administrateurs, avec des fonctionnalités supplémentaires de gestion des utilisateurs et de supervision.
3. 🔄 **Backend API** : Service principal, traitant toutes les requêtes des interfaces.
4. 🐳 **Docker Engine** : Gestion des conteneurs.
5. 🌐 **API DNS** : Gestion dynamique des noms de domaine des conteneurs.
6. 🔐 **Service Authentification** : Sécurisation de l'accès via JWT.
7. 💾 **Base de données** : Stockage des informations utilisateurs, conteneurs, et logs.
8. 🔄 **Reverse Proxy** : Routage dynamique des URLs vers les bons conteneurs.

## 💻 Technologies Utilisées

### 🎨 Frontend
| Technologie | Description |
|-------------|-------------|
| ⚛️ **React.js** ou **Vue.js** | Interface dynamique et réactive |
| 🎨 **Tailwind CSS** | Styling moderne |

### ⚙️ Backend
| Technologie | Description |
|-------------|-------------|
| 🔧 **Node.js** avec **Express.js** ou **FastAPI (Python)** | Gestion des APIs |
| 🐳 **Docker SDK** | Gestion de Docker |
| 🔑 **JWT** | Sécurisation des sessions |
| 📁 **MinIO** | Stockage de fichiers compatible S3 |
| 📊 **Redis** | Cache et sessions |

### 🗄️ Base de données
| Technologie | Description |
|-------------|-------------|
| 💾 **MongoDB** | Base de données principale NoSQL pour :<br>- Stockage flexible des données utilisateurs<br>- Gestion des configurations des conteneurs<br>- Évolutivité horizontale facile |
| 📊 **TimescaleDB** | Base de données temporelle pour :<br>- Métriques de performance<br>- Logs système<br>- Données de monitoring |

### 🔄 Reverse Proxy
| Technologie | Description |
|-------------|-------------|
| 🔄 **Nginx** ou **Traefik** | Routage dynamique |

### 🌐 Gestion DNS
| Technologie | Description |
|-------------|-------------|
| 🌍 **API OVH** ou **Google Cloud DNS** | Attribution des noms de domaine |

### 🚀 Déploiement
| Technologie | Description |
|-------------|-------------|
| 🐳 **Docker Compose** | Orchestration multi-services |

## 📄 Licence

Ce projet est sous licence Apache 2.0. Pour plus d'informations, consultez le fichier [LICENSE](LICENSE).

---

<div align="center">
  <p>Dynastie AMOUSSOU</p>
</div>

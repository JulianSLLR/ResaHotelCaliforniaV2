# 🏨 ResaHotel Node.js

> Un système de réservation d'hôtel robuste et moderne construit avec Node.js, Express et MySQL. Offre à la fois une application web avec rendu côté serveur et une API REST sécurisée.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D%2020.0.0-brightgreen.svg)
![Express](https://img.shields.io/badge/express-5.1.0-lightgrey.svg)
![MySQL](https://img.shields.io/badge/mysql2-3.15.1-orange.svg)

## 📖 Vue d'ensemble

**ResaHotel** est une application à double interface conçue pour gérer efficacement les opérations hôtelières. Elle propose une interface publique conviviale pour la consultation et la réservation de chambres, ainsi qu'une API puissante pour les tâches administratives et les intégrations externes.

Le projet est architecturé avec une séparation claire des responsabilités, utilisant un modèle MVC pour l'application web et un modèle contrôleur-service pour l'API.

## ✨ Fonctionnalités

- **🔐 Authentification & Sécurité** : Authentification sécurisée par JWT pour les endpoints de l'API et gestion de session pour l'application web.
- **🛏️ Gestion des Chambres** : Opérations CRUD complètes pour les chambres de l'hôtel.
- **👥 Gestion des Clients** : Gestion des profils et des données clients.
- **📅 Système de Réservation** : Réserver, modifier et annuler des réservations.
- **🌐 Double Interface** :
  - **Application Web** : Vues avec rendu côté serveur utilisant EJS.
  - **API REST** : API basée sur JSON pour les applications mobiles ou tierces.
- **🔒 Support HTTPS** : Configuration intégrée pour des connexions HTTPS sécurisées.

## 🛠️ Stack Technologique

- **Runtime** : [Node.js](https://nodejs.org/)
- **Framework** : [Express.js](https://expressjs.com/)
- **Base de données** : [MySQL](https://www.mysql.com/)
- **Moteur de template** : [EJS](https://ejs.co/)
- **Styles** : [TailwindCSS](https://tailwindcss.com/)
- **Tests** : [Vitest](https://vitest.dev/)

## 🚀 Installation & Configuration

### Prérequis

- Node.js (v20+ recommandé)
- Serveur MySQL

### 1. Cloner le dépôt

```bash
git clone https://github.com/JulianSLLR/ResaHotelCaliforniaV2.git
cd ResaHotelCaliforniaV2
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

Assurez-vous que votre serveur MySQL est en cours d'exécution. Créez une base de données (ex: `resahotelcaliforniasd`) et importez le code (si fourni dans `config/DB.sql`).

Configurez votre connexion à la base de données dans `config/configDB.js` ou via des variables d'environnement.

### 4. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
SECRET=votre_super_cle_secrete_jwt
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=hotel_db
```

### 5. Certificats SSL

Cette application fonctionne en HTTPS. Vous devez générer des certificats auto-signés pour le développement :

1.  Créez un dossier `ssl` à la racine.
2.  Générez les clés (avec `openssl`) :
    ```bash
    mkdir ssl
    # Exemple avec mkcert
    openssl req -x509 -newkey rsa:4096 -keyout ssl/private.key -out ssl/certificate.crt -days 365 -nodes
    ```

## 🏃 Utilisation

Démarrez le serveur de développement :

```bash
npm start
```

- **Application Web** : Visitez `https://localhost:3001`
- **API** : Accédez aux endpoints sur `https://localhost:3001/api`

## 📡 Documentation de l'API

L'utilisation nécessite l'en-tête `Authorization: Bearer <token>` pour les routes protégées.

### Authentification

| Méthode | Endpoint     | Description                      |
| :------ | :----------- | :------------------------------- |
| `POST`  | `/api/login` | S'authentifier et obtenir un JWT |

### 🏨 Chambres

| Méthode  | Endpoint            | Description                    |
| :------- | :------------------ | :----------------------------- |
| `GET`    | `/api/chambres`     | Obtenir toutes les chambres    |
| `GET`    | `/api/chambres/:id` | Obtenir une chambre spécifique |
| `POST`   | `/api/chambres`     | Créer une nouvelle chambre     |
| `PUT`    | `/api/chambres/:id` | Mettre à jour une chambre      |
| `DELETE` | `/api/chambres/:id` | Supprimer une chambre          |

### 👥 Clients

| Méthode  | Endpoint           | Description                  |
| :------- | :----------------- | :--------------------------- |
| `GET`    | `/api/clients`     | Obtenir tous les clients     |
| `GET`    | `/api/clients/:id` | Obtenir un client spécifique |
| `POST`   | `/api/clients`     | Enregistrer un client        |
| `PUT`    | `/api/clients/:id` | Mettre à jour un client      |
| `DELETE` | `/api/clients/:id` | Supprimer un client          |

### 📅 Réservations

| Méthode  | Endpoint                | Description                    |
| :------- | :---------------------- | :----------------------------- |
| `GET`    | `/api/reservations`     | Lister toutes les réservations |
| `GET`    | `/api/reservations/:id` | Détails d'une réservation      |
| `POST`   | `/api/reservations`     | Créer une réservation          |
| `PUT`    | `/api/reservations/:id` | Mettre à jour une réservation  |
| `DELETE` | `/api/reservations/:id` | Annuler une réservation        |

## 📂 Structure du Projet

```
projetResaHotelNodejs/
├── config/             # Configuration BDD & App
├── public/             # Assets statiques (CSS, JS, Images)
├── src/
│   ├── api/            # Contrôleurs, Routes, Modèles de l'API
│   ├── routes/         # Routes de l'Application Web
│   └── ...
├── ssl/                # Certificats SSL (private.key, certificate.crt)
├── views/              # Templates EJS
├── app.js              # Point d'entrée de l'application
└── server.js           # Configuration serveur (si séparée)
```

## 🧪 Tests

Lancez la suite de tests avec Vitest :

```bash
npm test
```

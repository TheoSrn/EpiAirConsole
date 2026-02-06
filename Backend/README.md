# Readme du backend

## Architechture du backend

backend/ 
 ├── src/ 
 │   ├── config/        # Connexion DB, paramètres 
 │   ├── controllers/   # Logique métier 
 │   ├── routes/        # Définition des endpoints 
 │   ├── models/        # Schémas MongoDB 
 │   ├── middleware/    # Auth, sécurité, etc. 
 │   ├── sockets/       # Gestion WebSocket 
 │   ├── utils/         # Fonctions outils 
 │   ├── swagger/       # Configuration Swagger 
 │   ├── app.js         # App Express 
 │   └── server.js      # Serveur + Socket.IO 
 ├── .env 
 ├── package.json 
 └── README.md 

## Lancer le projet

-- Installer les dépendances --

```npm install```

-- Lancer le serveur --

``` cd Backend / npm run dev```

-- Aller sur le swagger --

```localhost:3000```

## DataBase

-- Connection en local a la DB Mongo --

- Installer MongoDB Compass (pour une visualitation des tables)
- Installaler mongod sur le terminal ``` sudo apt-get install -y mongodb-org ```
- Lancer la commande ``` mongod ```
- Connecter vous via MongoDB Compass.
- *Le lien de la connection local de la DB est sur l'URL basique mongo (mongodb://localhost:27017/). !!! Ne pas oublier de mettre l'URL de la db dans le .env !!!*

## Lancer les tests

-- Tests --

- Se placer dans le répertoire `Backend` puis lancer la commande :

```bash
npm test
```

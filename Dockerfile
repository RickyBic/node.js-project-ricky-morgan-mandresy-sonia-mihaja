# Utilise une image Node officielle
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json séparément (meilleur cache Docker)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code source dans l'image
COPY . .

# Expose le port utilisé par ton backend
EXPOSE 5000

# Démarre l'application
CMD ["node", "app.js"]

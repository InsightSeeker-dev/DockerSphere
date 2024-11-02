#!/bin/bash
# scripts/deploy.sh

# Définition des couleurs pour le logging
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Démarrage du déploiement${NC}"

# Vérification des dépendances
if ! command -v docker &> /dev/null; then
    echo "Docker n'est pas installé. Installation..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose n'est pas installé. Installation..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Arrêt des conteneurs existants
echo -e "${YELLOW}📦 Arrêt des conteneurs existants...${NC}"
docker-compose down

# Pull des dernières images
echo -e "${YELLOW}🔄 Récupération des dernières images...${NC}"
docker-compose pull

# Build et démarrage des services
echo -e "${YELLOW}🏗️ Construction et démarrage des services...${NC}"
docker-compose up --build -d

# Vérification de l'état des services
echo -e "${YELLOW}🔍 Vérification de l'état des services...${NC}"
docker-compose ps

echo -e "${GREEN}✅ Déploiement terminé avec succès${NC}"

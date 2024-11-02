#!/bin/bash
# scripts/setup-ssl.sh

# Variables
DOMAIN="ledomaine.ovh"
EMAIL="votre@email.com"

# Couleurs pour le logging
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔒 Configuration SSL pour $DOMAIN${NC}"

# Création des répertoires nécessaires
mkdir -p ./nginx/ssl
mkdir -p ./nginx/certbot/www
mkdir -p ./nginx/conf.d

# Installation de Certbot si nécessaire
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}📦 Installation de Certbot...${NC}"
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Arrêt de Nginx s'il est en cours d'exécution
echo -e "${YELLOW}🛑 Arrêt de Nginx...${NC}"
docker-compose down nginx

# Obtention du certificat
echo -e "${YELLOW}📜 Obtention du certificat SSL...${NC}"
certbot certonly --standalone \
    -d "$DOMAIN" \
    -d "*.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --staging \  # Retirez ce drapeau pour la production

# Copie des certificats
echo -e "${YELLOW}📋 Copie des certificats...${NC}"
mkdir -p "./nginx/ssl/live/$DOMAIN"
cp /etc/letsencrypt/live/$DOMAIN/* "./nginx/ssl/live/$DOMAIN/"
chmod -R 755 ./nginx/ssl

# Configuration du renouvellement automatique
echo -e "${YELLOW}🔄 Configuration du renouvellement automatique...${NC}"
cat > /etc/cron.d/certbot-renew << EOF
0 0 * * * root certbot renew --quiet --post-hook "docker-compose restart nginx"
EOF
chmod 644 /etc/cron.d/certbot-renew

# Redémarrage de Nginx
echo -e "${YELLOW}🚀 Redémarrage de Nginx...${NC}"
docker-compose up -d nginx

echo -e "${GREEN}✅ Configuration SSL terminée${NC}"

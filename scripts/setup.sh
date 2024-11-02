#!/bin/bash
# scripts/setup.sh

# Vérification des privilèges root
if [ "$EUID" -ne 0 ]; then 
    echo "Ce script doit être exécuté en tant que root"
    exit 1
fi

# Installation des dépendances système
apt-get update && apt-get upgrade -y
apt-get install -y \
    curl \
    git \
    docker.io \
    docker-compose \
    nginx \
    certbot \
    python3-certbot-nginx

# Configuration des permissions Docker
usermod -aG docker $USER

# Création des répertoires nécessaires
mkdir -p /backups/docker-service
mkdir -p /var/log/docker-service

# Configuration des tâches cron
(crontab -l 2>/dev/null; echo "0 2 * * * /scripts/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "*/5 * * * * /scripts/monitor.sh") | crontab -

# Démarrage des services système
systemctl enable docker
systemctl start docker
systemctl enable nginx
systemctl start nginx

echo "✅ Installation terminée avec succès"

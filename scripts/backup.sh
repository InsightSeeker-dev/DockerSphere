#!/bin/bash
# scripts/backup.sh

# Configuration
BACKUP_DIR="/backups/docker-service"
DATE=$(date +%Y%m%d_%H%M%S)
MONGO_CONTAINER="docker-service-mongodb"
RETENTION_DAYS=7

# Création du répertoire de backup s'il n'existe pas
mkdir -p $BACKUP_DIR

# Backup de MongoDB
echo "📦 Démarrage du backup MongoDB..."
docker exec $MONGO_CONTAINER mongodump --out=/dump
docker cp $MONGO_CONTAINER:/dump $BACKUP_DIR/mongodb_$DATE
docker exec $MONGO_CONTAINER rm -rf /dump

# Backup des volumes Docker
echo "📂 Backup des volumes Docker..."
docker run --rm -v docker-service_mongodb_data:/source:ro -v $BACKUP_DIR:/backup alpine \
    tar -czf /backup/volumes_$DATE.tar.gz -C /source .

# Nettoyage des anciens backups
echo "🧹 Nettoyage des anciens backups..."
find $BACKUP_DIR -type d -name "mongodb_*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;
find $BACKUP_DIR -type f -name "volumes_*.tar.gz" -mtime +$RETENTION_DAYS -exec rm {} \;

echo "✅ Backup terminé avec succès"

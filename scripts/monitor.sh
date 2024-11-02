#!/bin/bash
# scripts/monitor.sh

# Configuration
SLACK_WEBHOOK_URL="votre_webhook_url"
DISCORD_WEBHOOK_URL="votre_webhook_url"

# Fonction pour envoyer une notification
send_notification() {
    local message="$1"
    local severity="$2"

    # Slack notification
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"[$severity] $message\"}" \
            $SLACK_WEBHOOK_URL
    fi

    # Discord notification
    if [ ! -z "$DISCORD_WEBHOOK_URL" ]; then
        curl -X POST -H "Content-Type: application/json" \
            --data "{\"content\":\"[$severity] $message\"}" \
            $DISCORD_WEBHOOK_URL
    fi
}

# Vérification des services
check_services() {
    local services=$(docker-compose ps --services)
    
    for service in $services; do
        if [ "$(docker-compose ps -q $service)" ]; then
            status=$(docker-compose ps $service | grep -q "Up" && echo "UP" || echo "DOWN")
            if [ "$status" = "DOWN" ]; then
                send_notification "Service $service is DOWN!" "CRITICAL"
                
                # Tentative de redémarrage
                echo "Tentative de redémarrage de $service..."
                docker-compose restart $service
            fi
        fi
    done
}

# Vérification de l'utilisation des ressources
check_resources() {
    local containers=$(docker ps --format "{{.Names}}")
    
    for container in $containers; do
        # CPU usage
        cpu_usage=$(docker stats $container --no-stream --format "{{.CPUPerc}}")
        # Memory usage
        mem_usage=$(docker stats $container --no-stream --format "{{.MemPerc}}")
        
        # Alertes si dépassement des seuils
        if [[ ${cpu_usage%.*} -gt 80 ]]; then
            send_notification "High CPU usage ($cpu_usage) in container $container" "WARNING"
        fi
        if [[ ${mem_usage%.*} -gt 80 ]]; then
            send_notification "High memory usage ($mem_usage) in container $container" "WARNING"
        fi
    done
}

# Boucle principale
while true; do
    check_services
    check_resources
    sleep 300  # Vérification toutes les 5 minutes
done

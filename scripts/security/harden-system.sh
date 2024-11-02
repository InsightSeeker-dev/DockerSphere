#!/bin/bash
# scripts/security/harden-system.sh

# Configuration de la sécurité du système
echo "🔒 Configuration de la sécurité du système..."

# Mettre à jour le système
apt update && apt upgrade -y

# Installation des outils de sécurité
apt install -y \
    fail2ban \
    ufw \
    auditd \
    rkhunter \
    chkrootkit \
    lynis

# Configuration de Fail2ban
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
EOF

# Configuration sysctl pour la sécurité réseau
cat > /etc/sysctl.d/99-security.conf << EOF
# Protection contre les attaques IP spoofing
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Désactiver le routage IP
net.ipv4.ip_forward = 0

# Protection contre les attaques SYN flood
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Protection contre les paquets ICMP
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Désactiver IPv6 si non utilisé
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
EOF

# Appliquer les paramètres sysctl
sysctl -p /etc/sysctl.d/99-security.conf

# Configuration des permissions des fichiers
chmod 600 /etc/ssh/sshd_config
chmod 700 /root/.ssh
chmod 600 /root/.ssh/authorized_keys

# Configuration de SSH
cat > /etc/ssh/sshd_config.d/hardening.conf << EOF
PermitRootLogin no
PasswordAuthentication no
X11Forwarding no
MaxAuthTries 3
Protocol 2
AllowUsers your_username
EOF

# Redémarrage des services
systemctl restart fail2ban
systemctl restart ssh

echo "✅ Configuration de la sécurité terminée"

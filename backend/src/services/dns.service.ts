// backend/src/services/dns.service.ts
import ovh from 'ovh';
import { Container } from '../models/Container';
import dotenv from 'dotenv';

dotenv.config();

// Configuration OVH
const ovhClient = ovh({
  appKey: process.env.OVH_APP_KEY,
  appSecret: process.env.OVH_APP_SECRET,
  consumerKey: process.env.OVH_CONSUMER_KEY,
  endpoint: process.env.OVH_ENDPOINT || 'ovh-eu'
});

class DNSService {
  private domain: string;

  constructor() {
    this.domain = process.env.BASE_DOMAIN || 'ledomaine.ovh';
  }

  async createSubdomain(containerName: string, targetIp: string): Promise<string> {
    const subdomain = `${containerName}.${this.domain}`;
    try {
      // Création de l'enregistrement A
      await ovhClient.post(`/domain/zone/${this.domain}/record`, {
        fieldType: 'A',
        subDomain: containerName,
        target: targetIp,
        ttl: 60
      });

      // Rafraîchissement de la zone DNS
      await ovhClient.post(`/domain/zone/${this.domain}/refresh`);

      return subdomain;
    } catch (error) {
      console.error('Erreur lors de la création du sous-domaine:', error);
      throw new Error('Échec de la création du sous-domaine');
    }
  }

  async removeSubdomain(containerName: string): Promise<void> {
    try {
      // Récupération des enregistrements existants
      const records = await ovhClient.get(`/domain/zone/${this.domain}/record`, {
        subDomain: containerName,
        fieldType: 'A'
      });

      // Suppression des enregistrements
      for (const recordId of records) {
        await ovhClient.delete(`/domain/zone/${this.domain}/record/${recordId}`);
      }

      // Rafraîchissement de la zone DNS
      await ovhClient.post(`/domain/zone/${this.domain}/refresh`);
    } catch (error) {
      console.error('Erreur lors de la suppression du sous-domaine:', error);
      throw new Error('Échec de la suppression du sous-domaine');
    }
  }

  async updateSubdomain(containerName: string, newIp: string): Promise<void> {
    try {
      await this.removeSubdomain(containerName);
      await this.createSubdomain(containerName, newIp);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du sous-domaine:', error);
      throw new Error('Échec de la mise à jour du sous-domaine');
    }
  }
}

export const dnsService = new DNSService();

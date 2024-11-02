// backend/src/services/container.service.ts
import Docker from 'dockerode';
import { Container } from '../models/Container';
import { dnsService } from './dns.service';

const docker = new Docker();

class ContainerService {
  async createContainer(userId: string, containerConfig: any) {
    try {
      // Création du conteneur Docker
      const container = await docker.createContainer({
        ...containerConfig,
        name: `user-${userId}-${containerConfig.name}`,
        Labels: {
          userId: userId,
          containerName: containerConfig.name
        }
      });

      // Démarrage du conteneur
      await container.start();

      // Récupération des informations réseau
      const containerInfo = await container.inspect();
      const containerIp = containerInfo.NetworkSettings.IPAddress;

      // Création du sous-domaine
      const subdomain = await dnsService.createSubdomain(
        containerConfig.name,
        containerIp
      );

      // Sauvegarde dans la base de données
      const containerDoc = new Container({
        userId,
        name: containerConfig.name,
        image: containerConfig.Image,
        status: 'running',
        url: subdomain,
        containerId: container.id
      });

      await containerDoc.save();

      return containerDoc;
    } catch (error) {
      console.error('Erreur lors de la création du conteneur:', error);
      throw error;
    }
  }

  async deleteContainer(containerId: string) {
    try {
      const containerDoc = await Container.findOne({ containerId });
      if (!containerDoc) {
        throw new Error('Conteneur non trouvé');
      }

      // Suppression du conteneur Docker
      const container = docker.getContainer(containerId);
      await container.stop();
      await container.remove();

      // Suppression du sous-domaine
      await dnsService.removeSubdomain(containerDoc.name);

      // Suppression de l'enregistrement dans la base de données
      await containerDoc.remove();
    } catch (error) {
      console.error('Erreur lors de la suppression du conteneur:', error);
      throw error;
    }
  }

  async updateContainerStatus(containerId: string, status: string) {
    try {
      const containerDoc = await Container.findOne({ containerId });
      if (!containerDoc) {
        throw new Error('Conteneur non trouvé');
      }

      containerDoc.status = status;
      await containerDoc.save();

      return containerDoc;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }
}

export const containerService = new ContainerService();

import { docker } from '../config/docker';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export class ContainerService {
  async createContainer(userId: string, data: {
    name: string;
    image: string;
    dockerfile?: string;
    customUrl?: string;
    ports?: string[];
  }) {
    try {
      // Create container in Docker
      const containerConfig = {
        Image: data.image,
        name: data.name,
        ExposedPorts: this.parsePortsToDockerFormat(data.ports || []),
        HostConfig: {
          PortBindings: this.createPortBindings(data.ports || [])
        }
      };

      const container = await docker.createContainer(containerConfig);
      await container.start();

      // Save container info to database
      const dbContainer = await prisma.container.create({
        data: {
          name: data.name,
          image: data.image,
          status: 'running',
          url: data.customUrl,
          ports: JSON.stringify(data.ports),
          userId
        }
      });

      return dbContainer;
    } catch (error) {
      logger.error('Container creation failed:', error);
      throw error;
    }
  }

  async startContainer(containerId: string, userId: string) {
    const dbContainer = await prisma.container.findFirst({
      where: { id: containerId, userId }
    });

    if (!dbContainer) {
      throw new Error('Container not found');
    }

    const container = docker.getContainer(dbContainer.name);
    await container.start();

    return await prisma.container.update({
      where: { id: containerId },
      data: { status: 'running' }
    });
  }

  async stopContainer(containerId: string, userId: string) {
    const dbContainer = await prisma.container.findFirst({
      where: { id: containerId, userId }
    });

    if (!dbContainer) {
      throw new Error('Container not found');
    }

    const container = docker.getContainer(dbContainer.name);
    await container.stop();

    return await prisma.container.update({
      where: { id: containerId },
      data: { status: 'stopped' }
    });
  }

  async deleteContainer(containerId: string, userId: string) {
    const dbContainer = await prisma.container.findFirst({
      where: { id: containerId, userId }
    });

    if (!dbContainer) {
      throw new Error('Container not found');
    }

    const container = docker.getContainer(dbContainer.name);
    await container.stop();
    await container.remove();

    return await prisma.container.delete({
      where: { id: containerId }
    });
  }

  private parsePortsToDockerFormat(ports: string[]) {
    const exposedPorts: Record<string, {}> = {};
    ports.forEach(port => {
      const [containerPort] = port.split(':');
      exposedPorts[`${containerPort}/tcp`] = {};
    });
    return exposedPorts;
  }

  private createPortBindings(ports: string[]) {
    const portBindings: Record<string, any[]> = {};
    ports.forEach(port => {
      const [containerPort, hostPort] = port.split(':');
      portBindings[`${containerPort}/tcp`] = [{ HostPort: hostPort }];
    });
    return portBindings;
  }
}
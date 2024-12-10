import { getDockerClient } from './client';
import type { Container, ContainerStats } from './types';

export async function listContainers(): Promise<Container[]> {
  const docker = getDockerClient();
  try {
    return await docker.listContainers({ all: true });
  } catch (error) {
    console.error('Error listing containers:', error);
    throw new Error('Failed to list containers');
  }
}

export async function getContainerStats(containerId: string): Promise<ContainerStats> {
  const docker = getDockerClient();
  try {
    const container = docker.getContainer(containerId);
    const stats = await container.stats({ stream: false });
    
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * 100;

    return {
      cpu: cpuPercent,
      memory: {
        usage: stats.memory_stats.usage,
        limit: stats.memory_stats.limit,
        percentage: (stats.memory_stats.usage / stats.memory_stats.limit) * 100,
      },
      network: {
        rx_bytes: Object.values(stats.networks || {}).reduce((acc: number, net: any) => acc + net.rx_bytes, 0),
        tx_bytes: Object.values(stats.networks || {}).reduce((acc: number, net: any) => acc + net.tx_bytes, 0),
      },
    };
  } catch (error) {
    console.error(`Error getting stats for container ${containerId}:`, error);
    throw new Error('Failed to get container stats');
  }
}
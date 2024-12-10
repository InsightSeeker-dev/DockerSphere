import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Docker from 'dockerode';

const docker = new Docker({
  socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  host: process.env.DOCKER_HOST,
  port: process.env.DOCKER_PORT ? parseInt(process.env.DOCKER_PORT) : undefined,
  version: process.env.DOCKER_VERSION,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const container = docker.getContainer(params.id);
    const stats = await container.stats({ stream: false });

    // Calculer les pourcentages d'utilisation
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * 100 * stats.cpu_stats.online_cpus;

    const memoryUsage = stats.memory_stats.usage;
    const memoryLimit = stats.memory_stats.limit;
    const memoryPercent = (memoryUsage / memoryLimit) * 100;

    // Calculer l'utilisation réseau
    const networkRx = Object.values(stats.networks || {}).reduce(
      (acc: number, net: any) => acc + net.rx_bytes,
      0
    );
    const networkTx = Object.values(stats.networks || {}).reduce(
      (acc: number, net: any) => acc + net.tx_bytes,
      0
    );

    return NextResponse.json({
      cpu_percent: Math.round(cpuPercent * 100) / 100,
      memory_usage: memoryUsage,
      memory_limit: memoryLimit,
      memory_percent: Math.round(memoryPercent * 100) / 100,
      network_rx: networkRx,
      network_tx: networkTx,
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching container stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch container statistics' },
      { status: 500 }
    );
  }
}
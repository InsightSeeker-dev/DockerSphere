import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ContainerLogs } from '@/components/containers/container-logs';
import Docker from 'dockerode';

export const dynamic = 'force-dynamic';

const docker = new Docker({
  socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  host: process.env.DOCKER_HOST,
  port: process.env.DOCKER_PORT ? parseInt(process.env.DOCKER_PORT) : undefined,
  version: process.env.DOCKER_VERSION,
});

interface Props {
  params: {
    id: string;
  };
}

export default async function ContainerLogsPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  try {
    const container = docker.getContainer(params.id);
    const info = await container.inspect();

    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Container Logs: {info.Name.replace('/', '')}
          </h1>
          <p className="text-sm text-muted-foreground">ID: {params.id}</p>
        </div>
        
        <ContainerLogs 
          containerId={params.id} 
          containerName={info.Name.replace('/', '')} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching container info:', error);
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
          <h2 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-400">
            Error
          </h2>
          <p className="text-sm text-red-600 dark:text-red-300">
            Failed to fetch container information. The container might not exist or
            there was an error connecting to Docker.
          </p>
        </div>
      </div>
    );
  }
}
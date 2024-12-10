import Docker from 'dockerode';

let dockerClient: Docker | null = null;

export function getDockerClient(): Docker {
  if (!dockerClient) {
    dockerClient = new Docker({
      socketPath: process.platform === 'win32' 
        ? '//./pipe/docker_engine'
        : '/var/run/docker.sock'
    });
  }
  return dockerClient;
}